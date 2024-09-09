<template>
  <div :id="code.id" class="r-codeblock-container" data-lan>
    <div class="r-codeblock-header">
      <div class="r-codeblock-header-left">
        &lt;Code&gt;
      </div>

      <div class="r-codeblock-header-center">

      </div>

      <div class="r-codeblock-header-right">
        <svg @click="copyCode" xmlns="http://www.w3.org/2000/svg" height="1em"
          viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path
            d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z" />
        </svg>
      </div>
    </div>

    <!-- Contenido -->
    <div class="r-codeblock-content">
      <div class="r-codeblock-numbers">

        <!-- TODO: split de líneas y contarlas -->
        <span v-for="nLine, idx in Array(nLines)" style="display: block; width: 100%;">
          {{ idx + 1 }}
        </span>

      </div>

      <code class="r-codeblock" v-html="codeHtml" :data-language="code.data.language ?? 'text'"></code>
    </div>

    <!-- Footer -->
    <div class="r-codeblock-footer">
      {{ code.data.language ?? 'text' }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockCodeType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const code = props.block as BlockCodeType
const codeHtml = code.data.code.replace(/\n|\r/g, '<br>').trim();
let nLines = (codeHtml.match(/<br>/g) || []).length + 1;


const copyCode = async (event: MouseEvent) => {
  try {
    await navigator.clipboard.writeText(code.data.code || '');
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

</script>

<style scoped>
.r-codeblock-container {
  margin: 1rem 0;
  box-sizing: border-box;
  font-family: "Courier New", monospace, Consolas, Courier;
}

.r-codeblock-header {
  display: flex;
  width: 100%;
  padding: 0.2rem 0.4rem;
  text-align: left;
  align-items: center;
  font-size: 1.4rem;
  color: #fafafa;
  background-color: #4b545c;
  border-top: 3px solid #000;
  border-left: 3px solid #000;
  border-right: 3px solid #000;
  border-bottom: 5px groove #000;
  border-radius: 10px 10px 0 0;
  box-sizing: border-box;
}

.r-codeblock-header-left {
  flex: 1;
}

.r-codeblock-header-center {
  flex: 2;
}

.r-codeblock-header-right {
  flex: 1;
  text-align: right;
}

.r-codeblock-header-right svg {
  cursor: pointer;
  margin-right: 1rem;
  fill: #fafafa;
  translate: 0 4px;
}

.r-codeblock-content {
  display: flex;
  padding: 0 3rem 0 0;
  text-align: left;
  background-color: #2e3440;
  color: rgba(160, 228, 155, 1);
  font-size: 1.1rem;
  width: 100%;
  border-right: 3px solid #000;
  box-sizing: border-box;
  border-left: 3px solid #000;
}

.r-codeblock-numbers {
  display: inline-block;
  padding: 0 0.5rem;
  width: 60px;
  color: #fafafa;
  background-color: #4b545c;
  text-align: right;
  box-sizing: border-box;
}

.r-codeblock-container .r-codeblock {
  display: inline-block;
  margin-left: 0.5rem;
  box-sizing: border-box;
}

.r-codeblock-footer {
  display: block;
  width: 100%;
  text-align: right;
  padding: 0.2rem 0.4rem;
  font-size: 1rem;
  color: #4b545c;
  background-color: #eaeaea;
  border-left: 3px solid #000;
  border-right: 3px solid #000;
  border-bottom: 3px solid #000;
  border-radius: 0 0 5px 5px;
  box-sizing: border-box;
}
</style>
