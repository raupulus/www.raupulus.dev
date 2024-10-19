<template>
  <div class="content-block">

    <ContentBlocksBlockParagraph v-if="block.type === 'paragraph'" :block="block" />
    <ContentBlocksBlockRaw v-else-if="block.type === 'raw'" :block="block" />
    <ContentBlocksBlockHeader v-else-if="block.type === 'header'" :block="block" />
    <ContentBlocksBlockCode v-else-if="block.type === 'code'" :block="block" />
    <ContentBlocksBlockWarning v-else-if="block.type === 'warning'" :block="block" />
    <ContentBlocksBlockQuote v-else-if="block.type === 'quote'" :block="block" />
    <ContentBlocksBlockList v-else-if="block.type === 'list'" :block="block" />
    <ContentBlocksBlockCheckList v-else-if="block.type === 'checklist'" :block="block" />
    <ContentBlocksBlockDelimiter v-else-if="block.type === 'delimiter'" :block="block" />
    <ContentBlocksBlockAlert v-else-if="block.type === 'alert'" :block="block" />
    <ContentBlocksBlockLinkTool v-else-if="block.type === 'linkTool'" :block="block" />
    <ContentBlocksBlockTable v-else-if="block.type === 'table'" :block="block" />
    <ContentBlocksBlockAttaches v-else-if="block.type === 'attaches'" :block="block" />
    <ContentBlocksBlockImage v-else-if="block.type === 'image'" :block="block" />
    <ContentBlocksBlockEmbed v-else-if="block.type === 'embed'" :block="block" />

    <div v-else>
      {{ block.type }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})
</script>

<style scoped>
.content-block {
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}
</style>
