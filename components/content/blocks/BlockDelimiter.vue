<template>
  <div :id="delimiter.id" class="r-delimiter-container">
    <div class="r-delimiter">
      <span class="r-delimiter-content"></span>
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { BlockDelimiterType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const delimiter = props.block as BlockDelimiterType
</script>

<style scoped>
.r-delimiter-container {
  width: 100%;

}

.r-delimiter {
  margin: auto;
  width: 80%;
  text-align: center;
}

.r-delimiter-content:after {
  content: '***';
}

.r-delimiter-content {
  margin: auto;
  color: #0071a7;
  font-size: 5rem;
  font-weight: bold;
}
</style>
