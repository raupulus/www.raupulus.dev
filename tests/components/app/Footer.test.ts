import { describe, it, expect } from 'vitest';
import { defineComponent, h } from 'vue';
import { mountSuspended, mockComponent } from '@nuxt/test-utils/runtime';
import Footer from '~/components/app/Footer.vue';

mockComponent('NuxtLink', () => {
    return defineComponent({
        name: 'NuxtLink',
        props: ['to'],
        setup(props, { slots }) {
            return () => h('a', { href: props.to }, slots.default ? slots.default() : []);
        },
    });
});

describe('Footer', () => {
    it('renderiza rol contentinfo, nombre, copyright y enlaces legales', async () => {
        const wrapper = await mountSuspended(Footer);

        const footerEl = wrapper.find('footer[role="contentinfo"]');
        expect(footerEl.exists()).toBe(true);

        expect(wrapper.text()).toContain('RAÚL CARO PASTORINO');
        expect(wrapper.text()).toContain('Hecho con software libre');

        // Enlaces legales
        expect(wrapper.text()).toContain('Política de Privacidad');
        expect(wrapper.text()).toContain('Cookies');
        expect(wrapper.text()).toContain('Preferencias de Cookies');
        expect(wrapper.text()).toContain('Aviso Legal');
        expect(wrapper.text()).toContain('Contacto');
        expect(wrapper.text()).toContain('Código de esta web');

        const repoLink = wrapper.find('a[href="https://gitlab.com/raupulus/www.raupulus.dev"]');
        expect(repoLink.exists()).toBe(true);
        expect(repoLink.attributes('target')).toBe('_blank');
        expect(repoLink.attributes('rel')).toContain('noopener');

        // Botón de preferencias de cookies
        const cookiePrefBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Preferencias de Cookies'));
        expect(cookiePrefBtn).toBeDefined();
        await cookiePrefBtn!.trigger('click');

        const cookieControl = useCookieControl();
        expect(cookieControl.isModalActive.value).toBe(true);
    });
});
