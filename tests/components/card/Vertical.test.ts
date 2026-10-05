import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Vertical from '~/components/card/Vertical.vue';

describe('Card Vertical Component', () => {
    it('renderiza tag, título, descripción y estilo de fondo', () => {
        const wrapper = mount(Vertical, {
            props: {
                tag: 'Destacado',
                title: 'Proyecto IoT',
                description: 'Monitorización de sensores con ESP32.',
                background: '#123456',
            },
        });

        expect(wrapper.find('.tag').text()).toBe('Destacado');
        expect(wrapper.find('.title').text()).toBe('Proyecto IoT');
        expect(wrapper.find('.description').text()).toBe('Monitorización de sensores con ESP32.');
        expect(wrapper.find('.box').attributes('style')).toContain('background-color: #123456;');
    });

    it('renderiza el slot en la sección superior', () => {
        const wrapper = mount(Vertical, {
            props: {
                title: 'Test Slot',
            },
            slots: {
                default: '<div class="custom-media">Media Content</div>',
            },
        });

        expect(wrapper.find('.top .custom-media').exists()).toBe(true);
        expect(wrapper.find('.top .custom-media').text()).toBe('Media Content');
    });
});
