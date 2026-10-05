import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import BlockEmbed from '~/components/content/blocks/BlockEmbed.vue';

describe('BlockEmbed', () => {
    it('renderiza iframe para URLs seguras de YouTube', async () => {
        const wrapper = await mountSuspended(BlockEmbed, {
            props: {
                block: {
                    id: 'embed-1',
                    type: 'embed',
                    data: {
                        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        service: 'youtube',
                        source: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        width: 560,
                        height: 315,
                        caption: 'Vídeo explicativo',
                    },
                },
            },
        });

        const iframe = wrapper.find('iframe');
        expect(iframe.exists()).toBe(true);
        expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
        expect(wrapper.text()).toContain('Vídeo explicativo');
    });

    it('bloquea URLs inseguras no permitidas por el sanitizer', async () => {
        const wrapper = await mountSuspended(BlockEmbed, {
            props: {
                block: {
                    id: 'embed-insecure',
                    type: 'embed',
                    data: {
                        link: 'javascript:alert(1)',
                        service: 'malicious',
                        source: 'javascript:alert(1)',
                        embed: 'javascript:alert(1)',
                        width: 560,
                        height: 315,
                        caption: 'Malicioso',
                    },
                },
            },
        });

        expect(wrapper.find('iframe').exists()).toBe(false);
    });
});
