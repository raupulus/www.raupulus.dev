import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockWarning from '~/components/content/blocks/BlockWarning.vue';

describe('BlockWarning', () => {
    it('renderiza advertencia con rol de alerta, título y mensaje', async () => {
        const wrapper = await mountSuspended(BlockWarning, {
            props: {
                block: {
                    id: 'warn-1',
                    type: 'warning',
                    data: {
                        title: 'Aviso Importante',
                        message: 'Esta es una advertencia de seguridad crítica.',
                    },
                },
            },
        });

        const alertEl = wrapper.find('[role="alert"]');
        expect(alertEl.exists()).toBe(true);
        expect(wrapper.text()).toContain('Aviso Importante');
        expect(wrapper.text()).toContain('Esta es una advertencia de seguridad crítica.');
    });

    it('sanitiza contenido malicioso en título y mensaje', async () => {
        const wrapper = await mountSuspended(BlockWarning, {
            props: {
                block: {
                    id: 'warn-xss',
                    type: 'warning',
                    data: {
                        title: 'Alerta <script>malware()</script>segura',
                        message: '<img src=x onerror=alert(1)>Mensaje limpio',
                    },
                },
            },
        });

        expect(wrapper.html()).not.toContain('<script>');
        expect(wrapper.html()).not.toContain('onerror');
        expect(wrapper.text()).toContain('segura');
        expect(wrapper.text()).toContain('Mensaje limpio');
    });
});
