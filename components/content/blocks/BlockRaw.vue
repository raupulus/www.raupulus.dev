<template>
  <div class="r-raw-html" v-html="raw.data.html"></div>
</template>

<script lang="ts" setup>
import type { BlockType } from '@/types/BlocksType';
import type { BlockRawType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const raw = props.block as BlockRawType

</script>

<style scoped>
.r-raw-html {
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}
</style>
