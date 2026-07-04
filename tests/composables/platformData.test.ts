import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('platformData', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.restoreAllMocks()
    })

    it('usePlatformData debe ser una función exportada', async () => {
        const module = await import('~/composables/platformData')
        expect(typeof module.usePlatformData).toBe('function')
    })

    it('getPlatformData debe ser una función exportada', async () => {
        const module = await import('~/composables/platformData')
        expect(typeof module.getPlatformData).toBe('function')
    })
})
