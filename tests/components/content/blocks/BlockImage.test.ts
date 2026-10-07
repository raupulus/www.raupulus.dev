import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import BlockImage from '~/components/content/blocks/BlockImage.vue';

mockComponent('NuxtImg', () => {
    return defineComponent({
        name: 'NuxtImg',
        props: ['src', 'alt', 'title'],
        setup(props) {
            return () => h('img', { src: props.src, alt: props.alt, title: props.title });
        },
    });
});

describe('BlockImage', () => {
    it('renderiza la imagen y su pie de foto (caption)', async () => {
        const wrapper = await mountSuspended(BlockImage, {
            props: {
                block: {
                    id: 'img-1',
                    type: 'image',
                    data: {
                        file: {
                            url: 'https://api.raupulus.dev/uploads/test.webp',
                            path: '/uploads/test.webp',
                            url_thumbnail: '',
                            path_thumbnail: '',
                            url_large: '',
                            path_large: '',
                            content_id: 1,
                            content_file_id: 1,
                            file_id: 1,
                            module: 'content',
                            title: 'Imagen de prueba',
                            alt: 'Texto alternativo descriptivo',
                            name: 'test.webp',
                            extension: 'webp',
                            mime: 'image/webp',
                            size: 1024,
                            file_type_image: 'image',
                        },
                        caption: 'Diagrama de arquitectura',
                        withBorder: true,
                        withBackground: false,
                        stretched: false,
                    },
                },
            },
        });

        expect(wrapper.find('figcaption').text()).toBe('Diagrama de arquitectura');
        expect(wrapper.find('img').attributes('alt')).toBe('Diagrama de arquitectura');
    });

    it('aplica atributos width y height explícitos si vienen en el archivo para evitar CLS', async () => {
        const wrapper = await mountSuspended(BlockImage, {
            props: {
                block: {
                    id: 'img-cls',
                    type: 'image',
                    data: {
                        file: {
                            url: 'https://api.raupulus.dev/uploads/test.webp',
                            path: '/uploads/test.webp',
                            url_thumbnail: '',
                            path_thumbnail: '',
                            url_large: '',
                            path_large: '',
                            content_id: 1,
                            content_file_id: 1,
                            file_id: 1,
                            module: 'content',
                            title: 'Imagen con dimensiones',
                            alt: 'Texto alternativo',
                            name: 'test.webp',
                            extension: 'webp',
                            mime: 'image/webp',
                            size: 1024,
                            file_type_image: 'image',
                            width: 1200,
                            height: 630,
                        },
                        caption: '',
                        withBorder: false,
                        withBackground: false,
                        stretched: false,
                    },
                },
            },
        });

        const img = wrapper.find('img');
        expect(img.attributes('width')).toBe('1200');
        expect(img.attributes('height')).toBe('630');
    });
});
