<template>
  <div
    :id="attaches.id"
    class="my-4 w-full max-w-xl mx-auto"
    :data-content_id="attaches.data.file.content_id"
    :data-content_file_id="attaches.data.file.content_file_id"
    :data-file_id="attaches.data.file.file_id"
  >
    <div class="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-high hover:border-primary/40 transition-colors shadow-sm">
      <div v-if="attaches.data.file.url_thumbnail" class="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-container-low flex items-center justify-center">
        <NuxtImg :src="attaches.data.file.url_thumbnail" :alt="attaches.data.title || 'Adjunto'" class="w-full h-full object-cover" loading="lazy" />
      </div>

      <div v-else-if="attaches.data.file.file_type_image" class="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-container-low flex items-center justify-center">
        <NuxtImg :src="attaches.data.file.file_type_image" :alt="attaches.data.title || 'Adjunto'" class="w-full h-full object-cover" loading="lazy" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold text-on-surface truncate font-headline">
          {{ attaches.data.title || attaches.data.file.name }}
        </div>
        <div class="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant font-mono">
          <span v-if="attaches.data.file.extension" class="uppercase font-bold text-secondary">
            {{ attaches.data.file.extension }}
          </span>
          <span v-if="attaches.data.file.size">
            {{ formatBytes(attaches.data.file.size) }}
          </span>
        </div>
      </div>

      <div class="shrink-0" :data-url_download="attaches.data.file.url">
        <a
          :href="attaches.data.file.url"
          download
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="'Descargar archivo ' + (attaches.data.title || attaches.data.file.name || 'adjunto')"
          class="p-2.5 rounded-lg text-primary hover:text-on-primary hover:bg-primary/90 transition-colors inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <UiMaterialIcon name="download" class="text-xl" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockAttachesType, BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const attaches = props.block as BlockAttachesType

const formatBytes = (bytes: number, precision: number = 2) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  bytes = Math.max(bytes, 0);
  let pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
  pow = Math.min(pow, units.length - 1);

  bytes /= Math.pow(1024, pow);

  return (Math.round(bytes * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision) + ' ' + units[pow];
}
</script>

