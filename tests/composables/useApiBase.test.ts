import { describe, it, expect } from 'vitest'
import { useApiBase, useApiDomain } from '~/composables/useApiBase'

describe('useApiBase y useApiDomain', () => {
    it('useApiBase y useApiDomain son funciones exportadas', () => {
        expect(typeof useApiBase).toBe('function')
        expect(typeof useApiDomain).toBe('function')
    })

    it('devuelven cadenas de texto en el contexto de ejecución', () => {
        expect(typeof useApiBase()).toBe('string')
        expect(typeof useApiDomain()).toBe('string')
    })
})
