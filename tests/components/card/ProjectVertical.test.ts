import { describe, it, expect } from 'vitest';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import ProjectVertical from '~/components/card/ProjectVertical.vue';
import type { ContentType } from '@/types/ContentType';

mockComponent('NuxtLink', {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
});

mockComponent('NuxtImg', {
    props: ['src', 'alt', 'title'],
    template: '<img :src="src" :alt="alt" :title="title" />',
});

mockComponent('UiMaterialIcon', {
    props: ['name'],
    template: '<span class="material-icon">{{ name }}</span>',
});

describe('Card ProjectVertical Component', () => {
    const mockData = {
        id: 11,
        title: 'Monitor Calidad Aire',
        slug: 'monitor-calidad-aire',
        excerpt: 'Dispositivo IoT con sensor MQ135.',
        created_at: '2026-02-10T12:00:00Z',
        image: 'https://example.com/air.webp',
        technologies: [{ id: 1, name: 'Raspberry Pi', slug: 'raspberry-pi', image: 'https://example.com/rpi.svg' }],
    } as unknown as ContentType;

    it('renderiza título, enlace y resumen en disposición vertical', async () => {
        const wrapper = await mountSuspended(ProjectVertical, {
            props: {
                data: mockData,
            },
        });

        expect(wrapper.text()).toContain('Monitor Calidad Aire');
        expect(wrapper.text()).toContain('Dispositivo IoT con sensor MQ135.');
        expect(wrapper.find('a[href="/projects/monitor-calidad-aire/"]').exists()).toBe(true);
    });
});
