<template>
  <div :id="embed.id" class="r-embed-container">
    <div class="r-embed-box">
      <div v-if="embed.data.caption" class="r-embed-title">
        {{ replaceBreakLine(embed.data.caption) }}
      </div>

      <div class="r-embed-box-iframe">
        <iframe class="r-embed-iframe" :data-width="embed.data.width" :data-height="embed.data.height"
          :style="'width: 100%; max-width: ' + embed.data.width + 'px; height: ' + embed.data.height + 'px;'"
          :src="embed.data.embed" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { BlockType } from '@/types/BlocksType';
import type { BlockEmbedType } from '@/types/BlocksType';

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
