<template>
  <h1 class="r-header" v-if="header.data.level === 1">
    {{ header.data.text }}
  </h1>

  <h2 class="r-header" v-else-if="header.data.level === 2">
    {{ header.data.text }}
  </h2>

  <h3 class="r-header" v-else-if="header.data.level === 3">
    {{ header.data.text }}
  </h3>

  <h4 class="r-header" v-else-if="header.data.level === 4">
    {{ header.data.text }}
  </h4>

  <h5 class="r-header" v-else-if="header.data.level === 5">
    {{ header.data.text }}
  </h5>

  <h6 class="r-header" v-else-if="header.data.level === 6">
    {{ header.data.text }}
  </h6>
</template>

<script lang="ts" setup>
import type { BlockHeaderType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const header = props.block as BlockHeaderType

</script>

<style scoped>
.r-header {
  text-align: center;
}

h1.r-header {}

h2.r-header {}

h3.r-header {}

h4.r-header {}

h5.r-header {}

h6.r-header {}
</style>
