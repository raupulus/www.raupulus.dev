import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockHeader from '~/components/content/blocks/BlockHeader.vue';

describe('BlockHeader', () => {
    it('renderiza encabezados con el nivel correcto h1-h6 mapeados semánticamente', async () => {
        const wrapperLevel1 = await mountSuspended(BlockHeader, {
            props: {
                block: {
                    id: 'header-1',
                    type: 'header',
                    data: {
                        text: 'Título Nivel 1',
                        level: 1,
                    },
                },
            },
        });

        const h2 = wrapperLevel1.find('h2');
        expect(h2.exists()).toBe(true);
        expect(h2.text()).toBe('Título Nivel 1');

        const wrapperLevel2 = await mountSuspended(BlockHeader, {
            props: {
                block: {
                    id: 'header-2',
                    type: 'header',
                    data: {
                        text: 'Título Nivel 2',
                        level: 2,
                    },
                },
            },
        });

        const h3 = wrapperLevel2.find('h3');
        expect(h3.exists()).toBe(true);
        expect(h3.text()).toBe('Título Nivel 2');
    });

    it('sanitiza contenido malicioso en el texto del encabezado', async () => {
        const wrapper = await mountSuspended(BlockHeader, {
            props: {
                block: {
                    id: 'header-xss',
                    type: 'header',
                    data: {
                        text: 'Encabezado <script>alert(1)</script><span>Válido</span>',
                        level: 3,
                    },
                },
            },
        });

        expect(wrapper.html()).not.toContain('<script>');
        expect(wrapper.html()).toContain('<span>Válido</span>');
    });
});
