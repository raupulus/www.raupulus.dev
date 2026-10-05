<template>
  <!-- eslint-disable vue/no-v-html -->
  <div :id="linkTool.id" class="my-6 w-full max-w-2xl mx-auto">
    <a
      class="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 hover:border-primary/50 rounded-xl transition-all duration-300 shadow-sm overflow-hidden"
      target="_blank"
      rel="nofollow noindex noreferrer noopener"
      :href="isSafeHttpUrl(linkTool.data.link) ? linkTool.data.link : '#'"
      :aria-label="'Enlace externo: ' + (linkTool.data.meta.title || linkTool.data.link)"
    >
      <div class="flex-1 min-w-0">
        <h4
          v-if="linkTool.data.meta.title"
          class="font-headline text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1"
          v-html="sanitizeHtml(linkTool.data.meta.title)"
        />
        <p
          v-if="linkTool.data.meta.description"
          class="font-body text-xs sm:text-sm text-on-surface-variant line-clamp-2 mb-3 leading-relaxed"
          v-html="sanitizeHtml(replaceBreakLine(linkTool.data.meta.description))"
        />

        <div class="flex items-center gap-1.5 font-label text-xs text-tertiary">
          <UiMaterialIcon name="link" class="text-sm shrink-0" />
          <span class="truncate">{{ displayDomain }}</span>
        </div>
      </div>

      <div
        v-if="linkTool.data.meta.image?.url && isSafeHttpUrl(linkTool.data.meta.image.url)"
        class="w-full sm:w-20 h-28 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 bg-surface-container-lowest"
      >
        <img
          :src="linkTool.data.meta.image.url"
          alt=""
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        >
      </div>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { BlockLinkToolType, BlockType } from '@/types/BlocksType';
import { sanitizeHtml, isSafeHttpUrl } from '~/utils/sanitize';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const linkTool = props.block as BlockLinkToolType
const replaceBreakLine = (text: string) => text.replace(/\n|\r/g, '<br>').trim();
const displayDomain = computed(() => {
  try {
    const url = new URL(linkTool.data.link);
    return url.hostname;
  } catch {
    return linkTool.data.link.replace(/^https?:\/\//, '').split('/')[0];
  }
});
</script>
