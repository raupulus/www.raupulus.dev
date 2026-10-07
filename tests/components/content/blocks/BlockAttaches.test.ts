import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockAttaches from '~/components/content/blocks/BlockAttaches.vue';

describe('BlockAttaches', () => {
    it('renderiza título, extensión, tamaño y enlace de descarga accesible', async () => {
        const wrapper = await mountSuspended(BlockAttaches, {
            props: {
                block: {
                    id: 'att-1',
                    type: 'attaches',
                    data: {
                        file: {
                            url: 'https://api.raupulus.dev/files/manual.pdf',
                            title: 'Manual de Instalación',
                            name: 'manual.pdf',
                            alt: 'Manual de Instalación',
                            path: '/files/manual.pdf',
                            extension: 'pdf',
                            mime: 'application/pdf',
                            size: 2097152, // 2 MB
                            file_type_image: '',
                            url_thumbnail: '',
                            path_thumbnail: '',
                            url_large: '',
                            path_large: '',
                            content_id: 1,
                            content_file_id: 1,
                            file_id: 1,
                            module: 'content',
                        },
                        title: 'Manual de Instalación',
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('Manual de Instalación');
        expect(wrapper.text().toLowerCase()).toContain('pdf');
        expect(wrapper.text()).toContain('2.00 MB');
        const link = wrapper.find('a[download]');
        expect(link.exists()).toBe(true);
        expect(link.attributes('href')).toBe('https://api.raupulus.dev/files/manual.pdf');
    });
});
