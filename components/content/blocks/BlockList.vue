<template>
  <div :id="list.id" class="r-list-container">
    <div class="r-list-box">
      <div class="r-list-item" v-for="item, idx in list.data.items">
        <div class="r-list-item-icon">
          <span v-if="list.data.style === 'ordered'">
            {{ idx + 1 }}
          </span>

          <svg v-else xmlns="http://www.w3.org/2000/svg" height="1em"
            viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
          </svg>
        </div>

        <div class="r-list-item-content" v-html="replaceBreakLine(item)"></div>

      </div>

    </div>
  </div>

</template>

<script lang="ts" setup>
import type { BlockListType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const list = props.block as BlockListType

const replaceBreakLine = (text: string) => text.replace(/\n|\r/g, '<br>').trim();

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

.r-list-item-content a:hover {
  color: #ffa07a;
  text-decoration: underline;
}
</style>
