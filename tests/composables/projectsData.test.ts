import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('projectsData', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.restoreAllMocks()
    })

    it('useProjectsData debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData')
        expect(typeof module.useProjectsData).toBe('function')
    })

    it('projectsDataSearch debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData')
        expect(typeof module.projectsDataSearch).toBe('function')
    })

    it('useGetProjectBySlug debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData')
        expect(typeof module.useGetProjectBySlug).toBe('function')
    })

    it('usefetchProjectsPaginated debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData')
        expect(typeof module.usefetchProjectsPaginated).toBe('function')
    })
})
