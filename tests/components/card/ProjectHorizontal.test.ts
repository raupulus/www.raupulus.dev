import { describe, it, expect } from 'vitest';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import ProjectHorizontal from '~/components/card/ProjectHorizontal.vue';
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

describe('Card ProjectHorizontal Component', () => {
    const mockData = {
        id: 10,
        title: 'Estación Meteorológica',
        slug: 'estacion-meteorologica',
        excerpt: 'Sensor IoT de alta precisión.',
        created_at: '2026-01-15T10:00:00Z',
        image: 'https://example.com/weather.webp',
        technologies: [
            { id: 1, name: 'ESP32', slug: 'esp32', image: 'https://example.com/esp32.svg' },
            { id: 2, name: 'Python', slug: 'python', image: 'https://example.com/python.svg' },
        ],
    } as unknown as ContentType;

    it('renderiza título, resumen y tecnologías del proyecto', async () => {
        const wrapper = await mountSuspended(ProjectHorizontal, {
            props: {
                data: mockData,
            },
        });

        expect(wrapper.text()).toContain('Estación Meteorológica');
        expect(wrapper.text()).toContain('Sensor IoT de alta precisión.');
        expect(wrapper.find('a[href="/projects/estacion-meteorologica/"]').exists()).toBe(true);
    });
});
