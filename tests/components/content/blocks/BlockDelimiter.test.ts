import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockDelimiter from '~/components/content/blocks/BlockDelimiter.vue';

describe('BlockDelimiter', () => {
    it('renderiza el separador horizontal con rol separator', async () => {
        const wrapper = await mountSuspended(BlockDelimiter, {
            props: {
                block: {
                    id: 'del-1',
                    type: 'delimiter',
                    data: {},
                },
            },
        });

        const sep = wrapper.find('[role="separator"]');
        expect(sep.exists()).toBe(true);
    });
});
