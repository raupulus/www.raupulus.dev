import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockQuote from '~/components/content/blocks/BlockQuote.vue';

describe('BlockQuote', () => {
    it('renderiza la cita y su autor/caption con diseño accesible', async () => {
        const wrapper = await mountSuspended(BlockQuote, {
            props: {
                block: {
                    id: 'quote-1',
                    type: 'quote',
                    data: {
                        text: 'Simplicity is prerequisite for reliability.',
                        caption: 'Edsger W. Dijkstra',
                        alignment: 'left',
                    },
                },
            },
        });

        expect(wrapper.text()).toContain('Simplicity is prerequisite for reliability.');
        expect(wrapper.text()).toContain('Edsger W. Dijkstra');
    });
});
