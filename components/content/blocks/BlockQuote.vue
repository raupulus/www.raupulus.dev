<template>
    <figure :id="quote.id" class="my-6 max-w-2xl mx-auto">
        <blockquote
            class="relative p-6 sm:p-8 bg-surface-container-high/60 border-l-4 border-secondary rounded-r-xl shadow-sm"
            :class="{
                'text-left': quote.data.alignment === 'left',
                'text-center': quote.data.alignment === 'center',
                'text-right': quote.data.alignment === 'right',
            }"
        >
            <div class="mb-3 text-secondary/30">
                <svg viewBox="0 0 512 512" class="w-8 h-8 fill-current" aria-hidden="true">
                    <path
                        d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"
                    />
                </svg>
            </div>

            <!-- eslint-disable-next-line vue/no-v-html -->
            <p
                class="font-body text-base sm:text-lg italic text-on-surface leading-relaxed mb-3"
                v-html="computedQuoteText"
            />

            <!-- eslint-disable-next-line vue/no-v-html -->
            <figcaption
                v-if="quote.data.caption"
                class="font-label text-xs sm:text-sm font-bold tracking-wider text-secondary uppercase"
                v-html="computedQuoteCaption"
            />
        </blockquote>
    </figure>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import type { BlockQuoteType, BlockType } from '@/types/BlocksType';
    import { sanitizeHtml } from '~/utils/sanitize';

    const props = defineProps({
        block: {
            type: Object as PropType<BlockType>,
            required: true,
        },
    });

    const quote = props.block as BlockQuoteType;

    const computedQuoteText = computed(() => sanitizeHtml(quote.data.text || ''));
    const computedQuoteCaption = computed(() => sanitizeHtml(`&mdash; ${quote.data.caption || ''}`));
</script>
