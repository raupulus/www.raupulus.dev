import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Skill from '~/components/card/Skill.vue';

describe('Card Skill Component', () => {
    it('renderiza título y descripción correctamente', () => {
        const wrapper = mount(Skill, {
            props: {
                title: 'Backend Architecture',
                description: 'Diseño de arquitecturas escalables con Laravel y Node.',
            },
        });

        expect(wrapper.find('.box-title').text()).toBe('Backend Architecture');
        expect(wrapper.find('.box-description').text()).toBe('Diseño de arquitecturas escalables con Laravel y Node.');
    });

    it('renderiza el slot dentro del contenedor de imagen', () => {
        const wrapper = mount(Skill, {
            props: {
                title: 'Testing',
                description: 'Pruebas con Vitest.',
            },
            slots: {
                default: '<span class="test-icon">Icon</span>',
            },
        });

        expect(wrapper.find('.box-img .test-icon').exists()).toBe(true);
        expect(wrapper.find('.box-img .test-icon').text()).toBe('Icon');
    });
});
