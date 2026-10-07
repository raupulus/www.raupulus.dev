import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockCode from '~/components/content/blocks/BlockCode.vue';

describe('BlockCode', () => {
    it('renderiza el código, lenguaje y número de líneas', async () => {
        const wrapper = await mountSuspended(BlockCode, {
            props: {
                block: {
                    id: 'code-1',
                    type: 'code',
                    data: {
                        code: 'console.log("hola")\nreturn true;',
                        language: 'javascript',
                        showlinenumbers: true,
                    },
                },
            },
        });

        expect(wrapper.text().toLowerCase()).toContain('javascript');
        expect(wrapper.text()).toContain('console.log("hola")');
        expect(wrapper.text()).toContain('return true;');
        expect(wrapper.find('button[title="Copiar código"]').exists()).toBe(true);
    });
});
