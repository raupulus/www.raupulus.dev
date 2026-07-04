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
})
