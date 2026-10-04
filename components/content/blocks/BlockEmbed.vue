<template>
  <div :id="embed.id" class="r-embed-container">
    <div class="r-embed-box">
      <div v-if="embed.data.caption" class="r-embed-title">
        {{ replaceBreakLine(embed.data.caption) }}
      </div>

      <div v-if="isSafeEmbedUrl(embed.data.embed)" class="r-embed-box-iframe">
        <iframe
          class="r-embed-iframe"
          :data-width="embed.data.width"
          :data-height="embed.data.height"
          :style="'width: 100%; max-width: ' + embed.data.width + 'px; height: ' + embed.data.height + 'px;'"
          :src="embed.data.embed"
          :title="embed.data.caption || 'Contenido multimedia embebido'"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockType, BlockEmbedType } from '@/types/BlocksType';
import { isSafeEmbedUrl } from '~/utils/sanitize';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const embed = props.block as BlockEmbedType
const replaceBreakLine = (text: string) => text.replace(/<br\s*\/?>/gi, '').trim();
</script>

<style scoped>
.r-embed-container {
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
}
</style>
