<template>
  <div
    :id="image.id"
    class="my-8 w-full flex flex-col items-center"
    :class="{
      'max-w-5xl mx-auto': image.data.stretched,
      'max-w-3xl mx-auto': !image.data.stretched,
      'p-4 bg-surface-container-low rounded-2xl': image.data.withBackground,
    }"
  >
    <figure
      class="w-full flex flex-col items-center overflow-hidden rounded-xl bg-surface-container-lowest"
      :class="{
        'border border-outline-variant/30 shadow-md': image.data.withBorder || !image.data.withBackground,
      }"
    >
      <NuxtImg
        :src="image.data.file?.url || image.data.file?.url_thumbnail || ''"
        class="w-full max-h-[550px] object-contain rounded-t-xl"
        :data-url_medium="image.data.file?.url"
        :data-url_full="image.data.file?.url_large"
        :alt="cleanCaption || image.data.file?.name || 'Imagen del proyecto'"
        :title="cleanCaption || image.data.file?.name || ''"
        loading="lazy"
        format="webp"
      />

      <figcaption
        v-if="cleanCaption"
        class="w-full py-3 px-4 text-center font-label text-xs sm:text-sm text-on-surface-variant bg-surface-container-high/40 border-t border-outline-variant/10"
      >
        {{ cleanCaption }}
      </figcaption>
    </figure>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { BlockImageType, BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const image = computed(() => props.block as BlockImageType)
const cleanCaption = computed(() => {
  const cap = image.value?.data?.caption
  if (!cap) return ''
  return cap.replace(/<[^>]*>/g, '').trim()
})
</script>
