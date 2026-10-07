import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import CookiesPage from '~/pages/cookies.vue';

// Mock de NuxtLink
mockComponent('NuxtLink', () => {
    return defineComponent({
        name: 'NuxtLink',
        props: ['to'],
        setup(props, { slots }) {
            return () => h('a', { href: props.to }, slots.default ? slots.default() : []);
        },
    });
});

// Mock de UiMaterialIcon
mockComponent('UiMaterialIcon', () => {
    return defineComponent({
        name: 'UiMaterialIcon',
        props: ['name'],
        setup(props) {
            return () => h('span', { class: 'material-icon' }, props.name);
        },
    });
});

describe('Página de Política de Cookies (pages/cookies.vue)', () => {
    it('renderiza el título, subtítulos y tablas de cookies técnicas y analíticas', async () => {
        const wrapper = await mountSuspended(CookiesPage);

        // Encabezado
        expect(wrapper.text()).toContain('Política de');
        expect(wrapper.text()).toContain('Cookies');
        expect(wrapper.text()).toContain('art. 22.2 de la LSSI-CE');

        // Cookies técnicas
        expect(wrapper.text()).toContain('ncc_c');
        expect(wrapper.text()).toContain('ncc_e');
        expect(wrapper.text()).toContain('XSRF-TOKEN');

        // Cookies analíticas
        expect(wrapper.text()).toContain('_ga');
        expect(wrapper.text()).toContain('_gid');
        expect(wrapper.text()).toContain('_ga_*');
        expect(wrapper.text()).toContain('Google Consent Mode v2');

        // Botón de gestión rápida
        const button = wrapper.find('button');
        expect(button.exists()).toBe(true);
        expect(button.text()).toContain('Gestionar Consentimiento');

        // Enlace a Política de Privacidad
        const privacyLinks = wrapper.findAll('a[href="/privacy/"]');
        expect(privacyLinks.length).toBeGreaterThan(0);
    });

    it('abre el modal de preferencias al hacer clic en "Gestionar Consentimiento"', async () => {
        const wrapper = await mountSuspended(CookiesPage);

        const manageBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Gestionar Consentimiento'));
        expect(manageBtn).toBeDefined();

        await manageBtn!.trigger('click');

        // useCookieControl().isModalActive debe haberse activado
        const cookieControl = useCookieControl();
        expect(cookieControl.isModalActive.value).toBe(true);
    });
});
