<template>
  <p class="r-paragraph" v-html="paragraph.data.text"></p>
</template>

<script lang="ts" setup>
import type { BlockParagraphType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const paragraph = props.block as BlockParagraphType

</script>

<style>
.r-paragraph {
  text-align: left;
  font-size: 1rem;
}

.r-paragraph>a {
  text-decoration: none;
  color: rgba(63, 131, 248, 0.9);
  font-size: 1.1rem;
  font-weight: bold;
  font-style: italic;
}

.r-paragraph>b,
.r-paragraph>strong {
  color: rgba(0, 0, 0, 0.8);
}

.r-paragraph>mark {}

.r-paragraph>code.inline-code {
  background-color: #2e3440;
  color: rgba(160, 228, 155, 1);
  padding: 0.2rem 0.6rem;
  border-radius: 3px;
  font-size: 1.1rem;
}
</style>
