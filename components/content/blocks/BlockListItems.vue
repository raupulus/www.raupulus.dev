<template>
  <div class="r-list-items">
    <div v-for="(item, idx) in items" :key="idx" class="r-list-item">
      <div class="r-list-item-icon">
        <span v-if="listStyle === 'ordered'">
          {{ listCounterLabel(start + idx, counterType) }}
        </span>

        <svg
v-else-if="listStyle === 'checklist' && item.checked" xmlns="http://www.w3.org/2000/svg" style="fill: #00b44e;"
          height="1em" viewBox="0 0 448 512" role="img" aria-label="Completado">
          <path
            d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
        </svg>

        <svg
v-else-if="listStyle === 'checklist'" xmlns="http://www.w3.org/2000/svg" style="fill: #808080;" height="1em"
          viewBox="0 0 448 512" role="img" aria-label="Pendiente">
          <path
            d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
        </svg>

        <svg
v-else xmlns="http://www.w3.org/2000/svg" height="1em"
          viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
        </svg>
      </div>

      <div class="r-list-item-body">
        <div class="r-list-item-content" v-html="sanitizeHtml(replaceBreakLine(item.content))"/>

        <!-- Sublista (@editorjs/list 2.x): hereda estilo y numeración -->
        <ContentBlocksBlockListItems
          v-if="item.items.length"
          :items="item.items"
          :list-style="listStyle"
          :counter-type="counterType"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockListCounterType, BlockListStyleType } from '@/types/BlocksType';
import type { NormalizedListItemType } from '~/utils/ContentUtils';
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
