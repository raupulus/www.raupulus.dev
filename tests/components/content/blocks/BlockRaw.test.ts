import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BlockRaw from '~/components/content/blocks/BlockRaw.vue'

describe('BlockRaw', () => {
    it('debe renderizar HTML básico', async () => {
        const wrapper = await mountSuspended(BlockRaw, {
            props: {
                block: {
                    id: 'raw-1',
                    type: 'raw',
                    data: {
                        html: '<div>Contenido HTML raw</div>',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('Contenido HTML raw')
    })

    it('debe permitir iframes en modo raw', async () => {
        const wrapper = await mountSuspended(BlockRaw, {
            props: {
                block: {
                    id: 'raw-2',
                    type: 'raw',
                    data: {
                        html: '<iframe src="https://www.youtube.com/embed/test"></iframe>',
                    },
                },
            },
        })

        expect(wrapper.html()).toContain('<iframe')
    })

    it('debe eliminar scripts maliciosos en raw', async () => {
        const wrapper = await mountSuspended(BlockRaw, {
            props: {
                block: {
                    id: 'raw-3',
                    type: 'raw',
                    data: {
                        html: '<div>Seguro</div><script>alert("xss")</script>',
                    },
                },
            },
        })

        expect(wrapper.html()).not.toContain('<script>')
        expect(wrapper.text()).toContain('Seguro')
    })
})
