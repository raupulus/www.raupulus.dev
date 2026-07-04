import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BlockAlert from '~/components/content/blocks/BlockAlert.vue'

describe('BlockAlert', () => {
    it('debe renderizar mensaje de alerta', async () => {
        const wrapper = await mountSuspended(BlockAlert, {
            props: {
                block: {
                    id: 'alert-1',
                    type: 'alert',
                    data: {
                        type: 'info',
                        message: 'Este es un mensaje de alerta',
                    },
                },
            },
        })

        expect(wrapper.text()).toContain('Este es un mensaje de alerta')
    })

    it('debe sanitizar contenido malicioso en alertas', async () => {
        const wrapper = await mountSuspended(BlockAlert, {
            props: {
                block: {
                    id: 'alert-2',
                    type: 'alert',
                    data: {
                        type: 'warning',
                        message: 'Alerta segura<script>alert("xss")</script>',
                    },
                },
            },
        })

        expect(wrapper.html()).not.toContain('<script>')
        expect(wrapper.text()).toContain('Alerta segura')
    })
})
