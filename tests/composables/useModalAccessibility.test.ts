import { describe, it, expect, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useModalAccessibility } from '~/composables/useModalAccessibility'

describe('useModalAccessibility', () => {
    beforeEach(() => {
        document.body.style.overflow = ''
        document.body.innerHTML = ''
    })

    it('bloquea y restaura el scroll de document.body según el estado isOpen', async () => {
        const isOpen = ref(false)
        const modalRef = ref<HTMLElement | null>(null)

        useModalAccessibility(isOpen, modalRef)

        expect(document.body.style.overflow).toBe('')

        isOpen.value = true
        await nextTick()
        expect(document.body.style.overflow).toBe('hidden')

        isOpen.value = false
        await nextTick()
        expect(document.body.style.overflow).toBe('')
    })

    it('hace focus en el primer elemento interactivo al abrir', async () => {
        const isOpen = ref(false)
        const modalDiv = document.createElement('div')
        const button = document.createElement('button')
        modalDiv.appendChild(button)
        document.body.appendChild(modalDiv)

        const modalRef = ref<HTMLElement | null>(modalDiv)

        useModalAccessibility(isOpen, modalRef)

        isOpen.value = true
        await nextTick()
        await nextTick()

        expect(document.activeElement).toBe(button)
    })
})
