import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import GenericSocial from '~/components/icons/GenericSocial.vue';
import Youtube from '~/components/icons/Youtube.vue';

describe('IconsGenericSocial Component', () => {
    it('renderiza como enlace <a> cuando se proporciona url', async () => {
        const wrapper = await mountSuspended(GenericSocial, {
            props: {
                url: 'https://youtube.com/@raupulus',
                title: 'Canal de Youtube',
                size: '80px',
                color: '#dc2626',
            },
            slots: {
                default: '<span class="test-icon">ICON</span>',
            },
        });

        const anchor = wrapper.find('a.box-icon');
        expect(anchor.exists()).toBe(true);
        expect(anchor.attributes('href')).toBe('https://youtube.com/@raupulus');
        expect(anchor.attributes('target')).toBe('_blank');
        expect(anchor.attributes('rel')).toBe('noopener noreferrer');
        expect(anchor.attributes('aria-label')).toBe('Canal de Youtube');
        expect(anchor.attributes('title')).toBe('Canal de Youtube');
        expect(wrapper.find('.box-icon-inner').exists()).toBe(true);
        expect(wrapper.find('.test-icon').text()).toBe('ICON');
    });

    it('renderiza como <span> cuando no hay url', async () => {
        const wrapper = await mountSuspended(GenericSocial, {
            props: {
                url: null,
                title: 'Sin Enlace',
                size: '80px',
            },
            slots: {
                default: '<span class="test-icon">ICON</span>',
            },
        });

        expect(wrapper.find('a.box-icon').exists()).toBe(false);
        const span = wrapper.find('span.box-icon');
        expect(span.exists()).toBe(true);
        expect(wrapper.find('.box-icon-inner').exists()).toBe(true);
    });

    it('soporta tamaño numérico sin errores', async () => {
        const wrapper = await mountSuspended(GenericSocial, {
            props: {
                size: 64,
                url: 'https://gitlab.com/raupulus',
            },
        });

        expect(wrapper.find('a.box-icon').exists()).toBe(true);
    });
});

describe('Youtube Icon Component', () => {
    it('renderiza con decoración (decored: true) con enlace y contenedor interior', async () => {
        const wrapper = await mountSuspended(Youtube, {
            props: {
                size: '80px',
                decored: true,
            },
        });

        const link = wrapper.find('a.box-icon');
        expect(link.exists()).toBe(true);
        expect(link.attributes('href')).toBe('https://www.youtube.com/@raupulus');
        expect(wrapper.find('.box-icon-inner').exists()).toBe(true);
        expect(wrapper.find('img').exists()).toBe(true);
    });
});
