import { describe, it, expect } from 'vitest';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import Project from '~/components/card/Project.vue';
import type { ContentType } from '@/types/ContentType';

mockComponent('NuxtImg', {
    props: ['src', 'alt'],
    template: '<img :src="src" :alt="alt" />',
});

mockComponent('IconsGithub', {
    props: ['url'],
    template: '<a :href="url" class="icon-github">Github</a>',
});

mockComponent('IconsEarth', {
    props: ['url'],
    template: '<a :href="url" class="icon-earth">Web</a>',
});

describe('Card Project Component', () => {
    const mockProjectData: ContentType = {
        id: 1,
        title: 'Proyecto Automatización',
        slug: 'proyecto-automatizacion',
        excerpt: 'Sistema autónomo de captura y análisis.',
        image: 'https://example.com/cover.webp',
        metadata: {
            github: 'https://github.com/raupulus/auto',
            web: 'https://auto.raupulus.dev',
        },
    } as unknown as ContentType;

    it('renderiza título, descripción y enlaces sociales de metadatos', async () => {
        const wrapper = await mountSuspended(Project, {
            props: {
                data: mockProjectData,
            },
        });

        expect(wrapper.find('.title').text()).toBe('Proyecto Automatización');
        expect(wrapper.find('.box-description').text()).toBe('Sistema autónomo de captura y análisis.');
        expect(wrapper.find('.box-links').exists()).toBe(true);
        expect(wrapper.find('.icon-github').exists()).toBe(true);
        expect(wrapper.find('.icon-earth').exists()).toBe(true);
    });

    it('no renderiza box-links si no existen metadatos', async () => {
        const wrapper = await mountSuspended(Project, {
            props: {
                data: {
                    id: 2,
                    title: 'Sin Metadatos',
                    slug: 'sin-metadatos',
                    excerpt: 'Proyecto sin enlaces externos.',
                } as unknown as ContentType,
            },
        });

        expect(wrapper.find('.box-links').exists()).toBe(false);
    });
});
