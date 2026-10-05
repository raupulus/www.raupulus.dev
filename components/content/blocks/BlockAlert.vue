<template>
  <div
    :id="alert.id"
    class="my-4 p-4 rounded-xl border transition-colors shadow-sm"
    :class="[alertTypeClasses, alertAlignClass]"
    role="alert"
  >
    <div class="space-y-1">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="alert.data.title" class="font-headline font-bold text-base leading-snug" v-html="sanitizeHtml(replaceBreakLine(alert.data.title))" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="text-sm leading-relaxed" v-html="sanitizeHtml(replaceBreakLine(alert.data.message))" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { BlockAlertType, BlockType } from '@/types/BlocksType';
import { sanitizeHtml } from '~/utils/sanitize';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const alert = props.block as BlockAlertType
const replaceBreakLine = (text: string) => text.replace(/\n|\r/g, '<br>').trim();

const alertTypeClasses = computed(() => {
  switch (alert.data.type) {
    case 'primary':
      return 'bg-primary-container/15 border-primary/30 text-on-surface [&_.font-headline]:text-primary';
    case 'secondary':
      return 'bg-secondary-container/15 border-secondary/30 text-on-surface [&_.font-headline]:text-secondary';
    case 'info':
      return 'bg-tertiary-container/15 border-tertiary/30 text-on-surface [&_.font-headline]:text-tertiary';
    case 'success':
      return 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100 [&_.font-headline]:text-emerald-300';
    case 'warning':
      return 'bg-amber-950/40 border-amber-500/30 text-amber-100 [&_.font-headline]:text-amber-300';
    case 'danger':
      return 'bg-error-container/20 border-error/40 text-on-error-container [&_.font-headline]:text-error';
    case 'light':
      return 'bg-surface-container-highest border-outline-variant/40 text-on-surface';
    case 'dark':
    default:
      return 'bg-surface-container-high border-outline-variant/30 text-on-surface';
  }
});

const alertAlignClass = computed(() => {
  switch (alert.data.align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'left':
    default:
      return 'text-left';
  }
});
</script>

