import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockTable from '~/components/content/blocks/BlockTable.vue';

describe('BlockTable', () => {
    it('renderiza cabeceras th y filas td cuando withHeadings es true', async () => {
        const wrapper = await mountSuspended(BlockTable, {
            props: {
                block: {
                    id: 'table-1',
                    type: 'table',
                    data: {
                        withHeadings: true,
                        caption: 'Comparativa de rendimiento',
                        content: [
                            ['Parámetro', 'Valor'],
                            ['Latencia', '15ms'],
                        ],
                    },
                },
            },
        });

        expect(wrapper.find('caption').text()).toBe('Comparativa de rendimiento');
        const ths = wrapper.findAll('th');
        expect(ths.length).toBe(2);
        expect(ths[0]?.text()).toBe('Parámetro');
        const tds = wrapper.findAll('td');
        expect(tds.length).toBe(2);
        expect(tds[0]?.text()).toBe('Latencia');
        expect(tds[1]?.text()).toBe('15ms');
    });
});
