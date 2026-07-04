import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/** Borra la cookie XSRF-TOKEN del entorno de test */
function clearXsrfCookie() {
    document.cookie = 'XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
}

describe('fetchPostData', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.restoreAllMocks()
        clearXsrfCookie()
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        clearXsrfCookie()
    })

    it('fetchCsrfToken debe ser una función exportada', async () => {
        const module = await import('~/composables/fetchPostData')
        expect(typeof module.fetchCsrfToken).toBe('function')
    })

    it('fetchPost debe ser una función exportada por defecto', async () => {
        const module = await import('~/composables/fetchPostData')
        expect(typeof module.default).toBe('function')
    })

    it('fetchPost envía la cookie XSRF decodificada en la cabecera X-XSRF-TOKEN', async () => {
        document.cookie = 'XSRF-TOKEN=token%3Dcon%2Bcaracteres; path=/'

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ ok: true }),
        })
        vi.stubGlobal('fetch', fetchMock)

        const { default: fetchPost } = await import('~/composables/fetchPostData')
        await fetchPost('https://api.test/contact/send', { foo: 'bar' })

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const [url, options] = fetchMock.mock.calls[0]!
        expect(url).toBe('https://api.test/contact/send')
        expect(options.headers['X-XSRF-TOKEN']).toBe('token=con+caracteres')
        expect(options.credentials).toBe('include')
        expect(JSON.parse(options.body)).toEqual({ foo: 'bar' })
    })

    it('fetchPost solicita el token CSRF si no hay cookie previa', async () => {
        const fetchMock = vi.fn().mockImplementation(async (url: string) => {
            if (url.includes('/auth/csrf-cookie')) {
                document.cookie = 'XSRF-TOKEN=nuevo-token; path=/'
                return { ok: true, status: 204, json: async () => ({}) }
            }
            return { ok: true, status: 200, json: async () => ({ ok: true }) }
        })
        vi.stubGlobal('fetch', fetchMock)

        const { default: fetchPost } = await import('~/composables/fetchPostData')
        await fetchPost('https://api.test/contact/send', {})

        expect(fetchMock).toHaveBeenCalledTimes(2)
        expect(fetchMock.mock.calls[0]![0]).toContain('/auth/csrf-cookie')
        expect(fetchMock.mock.calls[1]![1].headers['X-XSRF-TOKEN']).toBe('nuevo-token')
    })

    it('fetchPost devuelve el JSON aunque la respuesta sea un error de validación (4xx)', async () => {
        document.cookie = 'XSRF-TOKEN=token; path=/'

        const apiError = { messages: { errors: { email: ['El email no es válido'] } } }
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 422,
            json: async () => apiError,
        }))

        const { default: fetchPost } = await import('~/composables/fetchPostData')
        const result = await fetchPost('https://api.test/contact/send', {})

        expect(result).toEqual(apiError)
    })

    it('fetchPost devuelve el formato de error de seguridad de la API (status ko)', async () => {
        document.cookie = 'XSRF-TOKEN=token; path=/'

        const apiError = { status: 'ko', error: { httpCode: 403, message: 'Origen erróneo' } }
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 403,
            json: async () => apiError,
        }))

        const { default: fetchPost } = await import('~/composables/fetchPostData')
        const result = await fetchPost('https://api.test/contact/send', {})

        expect(result).toEqual(apiError)
    })

    it('fetchPost lanza excepción si la respuesta no contiene JSON', async () => {
        document.cookie = 'XSRF-TOKEN=token; path=/'

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => { throw new Error('not json') },
        }))

        const { default: fetchPost } = await import('~/composables/fetchPostData')

        await expect(fetchPost('https://api.test/contact/send', {})).rejects.toThrow('HTTP 500')
    })
})
