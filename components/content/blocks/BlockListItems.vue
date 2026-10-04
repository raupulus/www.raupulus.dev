<template>
  <ol v-if="listStyle === 'ordered'" class="r-list-items my-4 space-y-2 text-on-surface list-none" :start="start">
    <li v-for="(item, idx) in items" :key="idx" class="r-list-item flex items-start gap-2 leading-relaxed">
      <span class="font-bold text-secondary shrink-0 font-label text-sm min-w-[1.5rem]">{{ listCounterLabel(start + idx, counterType) }}.</span>
      <div class="flex-1">
        <div class="r-list-item-content inline" v-html="sanitizeHtml(replaceBreakLine(item.content))"/>
        <ContentBlocksBlockListItems
          v-if="item.items?.length"
          :items="item.items"
          :list-style="listStyle"
          :counter-type="counterType"
        />
      </div>
    </li>
  </ol>

  <ul v-else-if="listStyle === 'checklist'" class="r-list-items my-4 space-y-2 list-none" role="list">
    <li v-for="(item, idx) in items" :key="idx" class="r-list-item flex items-start gap-3 leading-relaxed">
      <span class="shrink-0 mt-1 inline-flex items-center" :aria-label="item.checked ? 'Completado' : 'Pendiente'">
        <UiMaterialIcon
          v-if="item.checked"
          name="check_box"
          class="text-tertiary text-lg"
        />
        <UiMaterialIcon
          v-else
          name="check_box_outline_blank"
          class="text-outline text-lg"
        />
      </span>
      <div class="flex-1">
        <div class="r-list-item-content" v-html="sanitizeHtml(replaceBreakLine(item.content))"/>
        <ContentBlocksBlockListItems
          v-if="item.items?.length"
          :items="item.items"
          :list-style="listStyle"
          :counter-type="counterType"
        />
      </div>
    </li>
  </ul>

  <ul v-else class="r-list-items list-disc pl-6 my-4 space-y-2 text-on-surface" role="list">
    <li v-for="(item, idx) in items" :key="idx" class="r-list-item leading-relaxed">
      <div class="r-list-item-content inline" v-html="sanitizeHtml(replaceBreakLine(item.content))"/>
      <ContentBlocksBlockListItems
        v-if="item.items?.length"
        :items="item.items"
        :list-style="listStyle"
        :counter-type="counterType"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { BlockListCounterType, BlockListStyleType } from '@/types/BlocksType';
import { listCounterLabel, type NormalizedListItemType } from '~/utils/ContentUtils';
import { sanitizeHtml } from '~/utils/sanitize';

defineProps({
  items: {
    type: Array as PropType<NormalizedListItemType[]>,
    required: true,
  },
  listStyle: {
    type: String as PropType<BlockListStyleType>,
    default: 'unordered',
  },
  counterType: {
    type: String as PropType<BlockListCounterType>,
    default: 'numeric',
  },
  start: {
    type: Number,
    default: 1,
  },
})

const replaceBreakLine = (text: string) => text.replace(/\n|\r/g, '<br>').trim();
</script>
