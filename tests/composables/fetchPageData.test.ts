import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('fetchPageData', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.restoreAllMocks()
    })

    it('usePageData debe ser una función exportada', async () => {
        const module = await import('~/composables/fetchPageData')
        expect(typeof module.usePageData).toBe('function')
    })

    it('getPageData debe ser una función exportada', async () => {
        const module = await import('~/composables/fetchPageData')
        expect(typeof module.getPageData).toBe('function')
    })

    it('setCurrentPage fija la página actual normalizando el cuerpo', async () => {
        const { setCurrentPage, getPageData } = await import('~/composables/fetchPageData')

        setCurrentPage({
            id: 25, content_id: 18, order: 1, title: 'About', slug: 'about', format: 'editorjs',
            body: JSON.stringify({ time: 1, version: '2.31.7', blocks: [{ id: 'a', type: 'paragraph', data: { text: 'Hola' } }] }) as never,
        })

        expect(getPageData().value?.slug).toBe('about')
        expect(getPageData().value?.body.blocks).toHaveLength(1)

        setCurrentPage(undefined)
        expect(getPageData().value).toBeUndefined()
    })
})
