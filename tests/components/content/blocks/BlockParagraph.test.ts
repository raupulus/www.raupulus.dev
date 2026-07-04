import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BlockParagraph from '~/components/content/blocks/BlockParagraph.vue'

describe('BlockParagraph', () => {
    it('debe renderizar texto simple', async () => {
        const wrapper = await mountSuspended(BlockParagraph, {
            props: {
                block: {
                    id: 'test-1',
                    type: 'paragraph',
                    data: {
                        text: 'Texto de prueba',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('Texto de prueba')
    })

    it('debe renderizar texto con formato HTML seguro', async () => {
        const wrapper = await mountSuspended(BlockParagraph, {
            props: {
                block: {
                    id: 'test-2',
                    type: 'paragraph',
                    data: {
                        text: '<strong>Negrita</strong> y <em>cursiva</em>',
                    },
                },
            },
        })

        expect(wrapper.html()).toContain('<strong>Negrita</strong>')
        expect(wrapper.html()).toContain('<em>cursiva</em>')
    })

    it('debe sanitizar scripts maliciosos', async () => {
        const wrapper = await mountSuspended(BlockParagraph, {
            props: {
                block: {
                    id: 'test-3',
                    type: 'paragraph',
                    data: {
                        text: '<p>Texto seguro</p><script>alert("xss")</script>',
                    },
                },
            },
        })

        expect(wrapper.html()).not.toContain('<script>')
        expect(wrapper.text()).toContain('Texto seguro')
    })
})
