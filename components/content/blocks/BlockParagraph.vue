<template>
  <p :id="paragraph.id" :class="'r-paragraph' + (paragraph.tunes?.textVariant
    ? ' r-paragraph-' + paragraph.tunes?.textVariant : '')">

    <cite v-if="paragraph.tunes?.textVariant === 'citation'" v-html="paragraph.data.text"></cite>

    <span v-else-if="paragraph.tunes?.textVariant === 'call-out'" class="r-call-out">
      <span class="r-call-out-left"></span>
      <span class="r-call-out-right" v-html="paragraph.data.text"></span>
    </span>

  <details v-else-if="paragraph.tunes?.textVariant === 'details'">
    <summary>Detalles</summary>

    <span v-html="paragraph.data.text"></span>
  </details>

  <span v-else v-html="paragraph.data.text"></span>

  </p>
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


/** Cita **/

.r-paragraph.r-paragraph-citation {
  display: block;
  font-size: 1.5em;
  color: #666;
}

.r-paragraph.r-paragraph-citation cite {
  display: block;
  margin: auto;
  padding: 2rem 1rem;
  width: 80%;
  max-width: 600px;
  background-color: #eee;
  box-sizing: border-box;
  border-radius: 50px 0 50px 0;
}

/** Callout **/
.r-paragraph.r-paragraph-call-out {
  margin: auto;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;
  color: #fafafa;
}

.r-paragraph.r-paragraph-call-out .r-call-out {
  display: flex;
  width: 100%;
  align-content: center;
  align-items: center;
  box-sizing: border-box;
}

.r-call-out-left {
  display: inline-block;
  width: 0;
  height: 0;
  border-right: 60px solid #2d3748;
  border-top: 25px solid transparent;
  border-bottom: 25px solid transparent;
  box-sizing: border-box;
  translate: 8px;
  border-radius: 10px;
}

.r-call-out-right {
  flex: 1;
  display: inline-block;
  padding: 1.3rem 1rem;
  font-size: 1.4rem;
  color: #d3d3d3;
  background: #2d3748;
  box-sizing: border-box;
  border-radius: 10px;
}
</style>
