import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Block from '~/components/content/blocks/Block.vue';

describe('Block (Dispatcher)', () => {
    it('despacha un bloque de párrafo correctamente', async () => {
        const wrapper = await mountSuspended(Block, {
            props: {
                block: {
                    id: 'b-p',
                    type: 'paragraph',
                    data: {
                        text: 'Párrafo a través del despachador.',
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('Párrafo a través del despachador.');
    });

    it('despacha un bloque de encabezado correctamente', async () => {
        const wrapper = await mountSuspended(Block, {
            props: {
                block: {
                    id: 'b-h',
                    type: 'header',
                    data: {
                        text: 'Encabezado despachado',
                        level: 2,
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('Encabezado despachado');
    });

    it('muestra aviso amigable cuando el tipo de bloque no está soportado', async () => {
        const wrapper = await mountSuspended(Block, {
            props: {
                block: {
                    id: 'b-unknown',
                    type: 'custom_unsupported_type',
                    data: {},
                },
            },
        });

        expect(wrapper.text()).toContain('[Bloque no soportado: custom_unsupported_type]');
    });
});
