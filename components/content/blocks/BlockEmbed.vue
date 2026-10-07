<template>
    <div :id="embed.id" class="my-6 w-full">
        <div class="w-full max-w-4xl mx-auto">
            <div
                v-if="isSafeEmbedUrl(embed.data.embed)"
                class="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-outline-variant/30 bg-surface-container"
            >
                <iframe
                    class="w-full h-full"
                    :src="embed.data.embed"
                    :title="embed.data.caption || 'Contenido multimedia embebido'"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    loading="lazy"
                    referrerpolicy="strict-origin-when-cross-origin"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                />
            </div>

            <div v-if="embed.data.caption" class="mt-2 text-center text-xs text-on-surface-variant font-mono">
                {{ replaceBreakLine(embed.data.caption) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import type { BlockType, BlockEmbedType } from '@/types/BlocksType';
    import { isSafeEmbedUrl } from '~/utils/sanitize';

    const props = defineProps({
        block: {
            type: Object as PropType<BlockType>,
            required: true,
        },
    });

    const embed = props.block as BlockEmbedType;
    const replaceBreakLine = (text: string) => text.replace(/<br\s*\/?>/gi, '').trim();
</script>
