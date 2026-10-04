<template>
  <div :id="list.id" class="r-list-container">
    <div class="r-list-box">
      <ContentBlocksBlockListItems
        :items="items"
        :list-style="list.data.style"
        :counter-type="list.data.meta?.counterType"
        :start="list.data.meta?.start"
      />
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { BlockListType, BlockType  } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const list = props.block as BlockListType

// Admite el formato antiguo (textos) y el de @editorjs/list 2.x (anidado)
const items = normalizeListItems(list.data.items)

</script>

<style>
.r-list-container {
  margin: 1rem 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.r-list-box {
  margin: auto;
  max-width: 500px;
  box-sizing: border-box;
}

.r-list-item {
  display: flex;
  margin: 0.3rem 0;
  padding: 0.1rem;
  align-items: center;
}

.r-list-item-icon {
  padding: 0.4rem;
  margin-right: 0.3rem;
  font-size: 1.6rem;
  font-weight: bold;
  background: #0071a7;
  border-radius: 0 8px 0 8px;
  color: #eee;
  fill: white;
}

.r-list-item-content {
  flex: 1;
  padding: 0.4rem;
  text-align: left;
  background-color: #2d3748;
  border: 1px solid #1a202c;
  border-radius: 5px;
  color: #d3d3d3;
  font-size: 1.1rem;
  word-break: break-all;
}

.r-list-item-content a {
  color: #90cdf4;
  font-weight: bold;
  transition: color 0.3s ease-in-out;
}

.r-list-item-body {
  flex: 1;
  min-width: 0;
}

.r-list-item-body > .r-list-items {
  margin-top: 0.3rem;
  margin-left: 1.5rem;
}

.r-list-item-content a:hover {
  color: #ffa07a;
  text-decoration: underline;
}
</style>
