import { describe, it, expect } from 'vitest';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import Header from '~/components/app/Header.vue';

mockComponent('NuxtLink', {
    props: ['to'],
    template: '<a :href="to"><slot /></a>',
});

describe('Header', () => {
    it('renderiza la marca y los enlaces de navegación principales', async () => {
        const wrapper = await mountSuspended(Header);

        expect(wrapper.text()).toContain('RAÚL CARO PASTORINO');
        expect(wrapper.text()).toContain('Inicio');
        expect(wrapper.text()).toContain('Proyectos');
        expect(wrapper.text()).toContain('Blog');
        expect(wrapper.text()).toContain('Sobre Mí');
        expect(wrapper.text()).toContain('Webs');
        expect(wrapper.text()).toContain('Social');
        expect(wrapper.text()).toContain('Contacto');
    });

    it('tiene botón móvil con atributos de accesibilidad WCAG requeridos', async () => {
        const wrapper = await mountSuspended(Header);
        const nav = wrapper.find('nav[aria-label="Navegación principal"]');
        expect(nav.exists()).toBe(true);

        const mobileBtn = wrapper.find('button[aria-controls="mobile-menu"]');
        expect(mobileBtn.exists()).toBe(true);
        expect(mobileBtn.attributes('aria-expanded')).toBe('false');
        expect(mobileBtn.attributes('aria-label')).toBe('Abrir menú');
        expect(mobileBtn.attributes('aria-controls')).toBe('mobile-menu');
    });
});
