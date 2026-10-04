<template>
  <h2 v-if="header.data.level === 1" class="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary mt-8 mb-4">
    {{ header.data.text }}
  </h2>

  <h3 v-else-if="header.data.level === 2" class="font-headline text-xl md:text-2xl font-bold tracking-tight text-on-surface mt-6 mb-3">
    {{ header.data.text }}
  </h3>

  <h4 v-else-if="header.data.level === 3" class="font-headline text-lg md:text-xl font-bold text-on-surface mt-4 mb-2">
    {{ header.data.text }}
  </h4>

  <h5 v-else-if="header.data.level === 4" class="font-headline text-base md:text-lg font-bold text-on-surface mt-3 mb-2">
    {{ header.data.text }}
  </h5>

  <h6 v-else-if="header.data.level === 5 || header.data.level === 6" class="font-headline text-sm md:text-base font-bold text-on-surface mt-2 mb-1">
    {{ header.data.text }}
  </h6>
</template>

<script lang="ts" setup>
import type { BlockHeaderType, BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const header = props.block as BlockHeaderType
</script>
