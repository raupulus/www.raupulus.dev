import { describe, it, expect } from 'vitest';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import ImageSlide from '~/components/modals/ImageSlide.vue';
import type { GalleryPathType } from '@/types/GalleryPathType';

mockComponent('NuxtImg', {
    props: ['src', 'alt'],
    template: '<img :src="src" :alt="alt" />',
});

mockComponent('UiMaterialIcon', {
    props: ['name'],
    template: '<span class="material-icon">{{ name }}</span>',
});

describe('Modal ImageSlide Component', () => {
    const mockGallery: GalleryPathType[] = [
        { image: 'https://example.com/slide1.webp', thumbnail: 'https://example.com/thumb1.webp' },
        { image: 'https://example.com/slide2.webp', thumbnail: 'https://example.com/thumb2.webp' },
        { image: 'https://example.com/slide3.webp', thumbnail: 'https://example.com/thumb3.webp' },
    ];

    it('no renderiza nada si show es false', async () => {
        const wrapper = await mountSuspended(ImageSlide, {
            props: {
                show: false,
                galleryPaths: mockGallery,
            },
        });

        expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    });

    it('renderiza el diálogo accesible y el contador cuando show es true', async () => {
        const wrapper = await mountSuspended(ImageSlide, {
            props: {
                show: true,
                galleryPaths: mockGallery,
                selectedIndex: 0,
            },
        });

        const dialog = wrapper.find('[role="dialog"]');
        expect(dialog.exists()).toBe(true);
        expect(dialog.attributes('aria-modal')).toBe('true');
        expect(wrapper.text()).toContain('1 / 3');
    });

    it('emite update:show al pulsar el botón de cerrar', async () => {
        const wrapper = await mountSuspended(ImageSlide, {
            props: {
                show: true,
                galleryPaths: mockGallery,
                selectedIndex: 0,
            },
        });

        const closeBtn = wrapper.find('button[aria-label="Cerrar galería"]');
        expect(closeBtn.exists()).toBe(true);
        await closeBtn.trigger('click');

        expect(wrapper.emitted('update:show')).toBeTruthy();
        expect(wrapper.emitted('update:show')![0]).toEqual([false]);
    });
});
