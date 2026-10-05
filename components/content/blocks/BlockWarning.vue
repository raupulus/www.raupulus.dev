<template>
  <aside
    :id="warning.id"
    role="alert"
    class="my-6 max-w-2xl mx-auto p-5 sm:p-6 rounded-xl border border-error/30 bg-error-container/15 text-on-surface shadow-sm"
  >
    <div class="flex items-start gap-4">
      <div class="p-2 rounded-lg bg-error/15 text-error shrink-0 mt-0.5">
        <UiMaterialIcon name="warning" class="text-xl" />
      </div>

      <div class="flex-1 min-w-0">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h4 v-if="formattedTitle" class="font-headline text-base sm:text-lg font-bold text-on-surface mb-2" v-html="formattedTitle" />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-if="formattedMessage" class="font-body text-sm text-on-surface-variant leading-relaxed" v-html="formattedMessage" />
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { BlockWarningType, BlockType } from '@/types/BlocksType';
import { sanitizeHtml } from '~/utils/sanitize';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
});

const warning = computed(() => props.block as BlockWarningType);

const formattedTitle = computed(() => {
  const text = warning.value.data?.title;
  if (!text) return '';
  return sanitizeHtml(text.replace(/\n|\r/g, '<br>').trim());
});

const formattedMessage = computed(() => {
  const text = warning.value.data?.message;
  if (!text) return '';
  return sanitizeHtml(text.replace(/\n|\r/g, '<br>').trim());
});
</script>
