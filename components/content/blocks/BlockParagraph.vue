<template>
    <details
        v-if="paragraph.tunes?.textVariant === 'details'"
        :id="paragraph.id"
        class="my-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface cursor-pointer group"
    >
        <summary
            class="font-headline font-semibold text-secondary select-none focus:outline-none focus-visible:text-primary"
        >
            Detalles
        </summary>
        <div class="mt-3 text-on-surface-variant leading-relaxed text-sm">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="sanitizeHtml(paragraph.data.text)" />
        </div>
    </details>

    <div
        v-else-if="paragraph.tunes?.textVariant === 'citation'"
        :id="paragraph.id"
        class="my-6 p-4 border-l-4 border-secondary bg-surface-container-high/60 rounded-r-xl"
    >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <cite
            class="not-italic text-base md:text-lg text-on-surface italic font-serif leading-relaxed block"
            v-html="sanitizeHtml(paragraph.data.text)"
        />
    </div>

    <div
        v-else-if="paragraph.tunes?.textVariant === 'call-out'"
        :id="paragraph.id"
        class="my-4 p-4 rounded-xl border border-secondary/30 bg-secondary-container/10 text-on-surface flex items-start gap-3"
    >
        <span class="w-1.5 self-stretch rounded-full bg-secondary shrink-0" aria-hidden="true" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="flex-1 text-sm md:text-base leading-relaxed" v-html="sanitizeHtml(paragraph.data.text)" />
    </div>

    <p v-else :id="paragraph.id" class="r-paragraph my-3 text-on-surface leading-relaxed text-base font-body">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="sanitizeHtml(paragraph.data.text)" />
    </p>
</template>

<script lang="ts" setup>
    import type { BlockParagraphType, BlockType } from '@/types/BlocksType';
    import { sanitizeHtml } from '~/utils/sanitize';

    const props = defineProps({
        block: {
            type: Object as PropType<BlockType>,
            required: true,
        },
    });

    const paragraph = props.block as BlockParagraphType;
</script>

<style scoped>
    :deep(a) {
        color: #4cd4ce;
        text-decoration: underline;
        text-underline-offset: 3px;
        transition: color 0.2s ease;
    }

    :deep(a:hover) {
        color: #6ee7b7;
    }

    :deep(strong),
    :deep(b) {
        font-weight: 700;
        color: #f1f5f9;
    }

    :deep(code.inline-code) {
        background-color: rgba(255, 255, 255, 0.08);
        color: #a7f3d0;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.875em;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    :deep(mark) {
        background-color: rgba(254, 240, 138, 0.25);
        color: #fef08a;
        padding: 0.1rem 0.3rem;
        border-radius: 2px;
    }
</style>
