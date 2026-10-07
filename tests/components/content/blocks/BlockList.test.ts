import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockList from '~/components/content/blocks/BlockList.vue';

describe('BlockList', () => {
    it('renderiza el formato antiguo (array de textos)', async () => {
        const wrapper = await mountSuspended(BlockList, {
            props: {
                block: { id: 'l1', type: 'list', data: { style: 'unordered', items: ['Uno', 'Dos'] } },
            },
        });

        expect(wrapper.text()).toContain('Uno');
        expect(wrapper.text()).toContain('Dos');
    });

    it('renderiza listas anidadas de @editorjs/list 2.x con numeración romana', async () => {
        const wrapper = await mountSuspended(BlockList, {
            props: {
                block: {
                    id: 'l2',
                    type: 'list',
                    data: {
                        style: 'ordered',
                        meta: { counterType: 'upper-roman', start: 3 },
                        items: [{ content: 'Padre', meta: {}, items: [{ content: 'Hijo', meta: {}, items: [] }] }],
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('III');
        expect(wrapper.text()).toContain('Padre');
        expect(wrapper.text()).toContain('Hijo');
    });

    it('sanitiza el contenido de los elementos', async () => {
        const wrapper = await mountSuspended(BlockList, {
            props: {
                block: {
                    id: 'l3',
                    type: 'list',
                    data: { style: 'unordered', items: ['<img src=x onerror="alert(1)">Texto'] },
                },
            },
        });

        expect(wrapper.html()).not.toContain('onerror');
    });
});
