import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockLinkTool from '~/components/content/blocks/BlockLinkTool.vue';

describe('BlockLinkTool', () => {
    it('renderiza la tarjeta de enlace externo con título, descripción y dominio', async () => {
        const wrapper = await mountSuspended(BlockLinkTool, {
            props: {
                block: {
                    id: 'link-1',
                    type: 'linkTool',
                    data: {
                        link: 'https://laravel.com/docs',
                        meta: {
                            title: 'Documentación Oficial de Laravel',
                            description: 'Aprende sobre el framework PHP más popular.',
                            keywords: 'php, framework, laravel',
                        },
                    },
                },
            },
        });

        const a = wrapper.find('a');
        expect(a.exists()).toBe(true);
        expect(a.attributes('href')).toBe('https://laravel.com/docs');
        expect(wrapper.text()).toContain('Documentación Oficial de Laravel');
        expect(wrapper.text()).toContain('laravel.com');
    });
});
