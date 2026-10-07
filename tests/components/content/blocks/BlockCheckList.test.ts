import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockCheckList from '~/components/content/blocks/BlockCheckList.vue';

describe('BlockCheckList', () => {
    it('renderiza elementos con aria-checked y roles de accesibilidad', async () => {
        const wrapper = await mountSuspended(BlockCheckList, {
            props: {
                block: {
                    id: 'chk-1',
                    type: 'checklist',
                    data: {
                        items: [
                            { text: 'Tarea completada', checked: true },
                            { text: 'Tarea pendiente', checked: false },
                        ],
                    },
                },
            },
        });

        const checkboxes = wrapper.findAll('[role="checkbox"]');
        expect(checkboxes.length).toBe(2);
        expect(checkboxes[0]?.attributes('aria-checked')).toBe('true');
        expect(checkboxes[0]?.text()).toContain('Tarea completada');
        expect(checkboxes[1]?.attributes('aria-checked')).toBe('false');
        expect(checkboxes[1]?.text()).toContain('Tarea pendiente');
    });
});
