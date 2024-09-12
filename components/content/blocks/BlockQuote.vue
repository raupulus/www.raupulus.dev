<template>
  <blockquote :id="quote.id" :class="'r-blockquote r-blockquote-alignment-' + quote.data.alignment">
    <p class="r-blockquote-icon">
      <svg viewBox="0 0 512 512" title="quote-left" class="quote-icon">
        <path
          d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z" />
      </svg>
    </p>

    <p class="r-blockquote-title" v-html="computedQuoteText"></p>

    <p class="r-blockquote-caption" v-html="computedQuoteCaption"></p>

    <hr>
  </blockquote>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { BlockQuoteType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
});

const quote = props.block as BlockQuoteType;

// Computed properties to handle text and caption
const computedQuoteText = computed(() => quote.data.text || '');
const computedQuoteCaption = computed(() => `&mdash;${quote.data.caption || ''}`);

</script>

<style scoped>
.r-blockquote {
  margin: auto;
  padding: 1.3rem;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  font-size: 1.4rem;
  line-height: 1.4;
  font-style: italic;
  word-break: break-all;
  box-sizing: border-box;
  background-color: #eaeaea;
  border-radius: 0.3rem;
}

.r-blockquote {
  margin-top: 1.2rem;
}

.r-blockquote-icon {}

.r-blockquote-icon>svg {
  width: 60px;
}

.r-blockquote.r-blockquote-alignment-left .r-blockquote-title {
  text-align: left;
}

.r-blockquote.r-blockquote-alignment-center .r-blockquote-title {
  text-align: center;
}

.r-blockquote.r-blockquote-alignment-right .r-blockquote-title {
  text-align: right;
}

.r-blockquote-title {}

.r-blockquote-caption {
  text-align: right;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
