import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import Select from '~/components/form/Select.vue';

describe('Form Select Component', () => {
    const mockDatas = [
        { slug: 'vue', name: 'Vue.js' },
        { slug: 'laravel', name: 'Laravel' },
        { slug: 'typescript', name: 'TypeScript' },
    ];

    it('renderiza el select con el atributo name correspondiente', async () => {
        const wrapper = await mountSuspended(Select, {
            props: {
                name: 'technologies',
                datas: mockDatas,
            },
        });

        const select = wrapper.find('select');
        expect(select.exists()).toBe(true);
        expect(select.attributes('name')).toBe('technologies');
    });

    it('renderiza las opciones con el valor y texto correctos', async () => {
        const wrapper = await mountSuspended(Select, {
            props: {
                name: 'filter',
                datas: mockDatas,
            },
        });

        const options = wrapper.findAll('option');
        expect(options).toHaveLength(3);
        expect(options[0]!.attributes('value')).toBe('vue');
        expect(options[0]!.text()).toBe('Vue.js');
        expect(options[1]!.attributes('value')).toBe('laravel');
        expect(options[1]!.text()).toBe('Laravel');
        expect(options[2]!.attributes('value')).toBe('typescript');
        expect(options[2]!.text()).toBe('TypeScript');
    });
});
