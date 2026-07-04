<template>
  <div class="r-raw-html" v-html="sanitizeRawHtml(raw.data.html)"/>
</template>

<script lang="ts" setup>
import type { BlockType, BlockRawType  } from '@/types/BlocksType';
import { sanitizeRawHtml } from '~/utils/sanitize';

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
