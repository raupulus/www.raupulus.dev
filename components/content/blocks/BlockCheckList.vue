<template>
    <!-- eslint-disable vue/no-v-html -->
    <div :id="checkList.id" class="my-6 max-w-2xl mx-auto space-y-2.5">
        <div
            v-for="(item, idx) in checkList.data.items"
            :key="idx"
            class="flex items-start gap-3 p-3.5 rounded-xl border transition-colors bg-surface-container-high/40"
            :class="
                item.checked ? 'border-primary/30 text-on-surface' : 'border-outline-variant/20 text-on-surface-variant'
            "
            role="checkbox"
            :aria-checked="item.checked"
            tabindex="0"
        >
            <div class="mt-0.5 shrink-0">
                <UiMaterialIcon v-if="item.checked" name="check_circle" class="text-xl text-primary" />
                <UiMaterialIcon v-else name="radio_button_unchecked" class="text-xl text-outline/60" />
            </div>

            <div
                class="font-body text-sm leading-relaxed"
                :class="{ 'line-through text-outline': item.checked }"
                v-html="sanitizeHtml(replaceBreakLine(item.text))"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import type { BlockCheckListType, BlockType } from '@/types/BlocksType';
    import { sanitizeHtml } from '~/utils/sanitize';

    const props = defineProps({
        block: {
            type: Object as PropType<BlockType>,
            required: true,
        },
    });

    const checkList = computed(() => props.block as BlockCheckListType);
    const replaceBreakLine = (text: string) => (text ? text.replace(/\n|\r/g, '<br>').trim() : '');
</script>
