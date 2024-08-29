<template>

  <div :id="checkList.id" class="r-checkbox-container">
    <div class="r-checkbox-box">

      <div v-for="item in checkList.data.items" class="r-checkbox-item">
        <svg v-if="item.checked" xmlns="http://www.w3.org/2000/svg" class="r-checkbox-item-icon" style="fill: #00b44e;"
          height="1em" viewBox="0 0 448 512">
          <path
            d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
        </svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" class="r-checkbox-item-icon" style="fill: #808080;" height="1em"
          viewBox="0 0 448 512">
          <path
            d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
        </svg>


        <div class="r-checkbox-item-content" v-html="replaceBreakLine(item.text)"></div>

      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockCheckListType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const checkList = props.block as BlockCheckListType
const replaceBreakLine = (text: string) => text.replace(/\n|\r/g, '<br>').trim();

</script>

<style scoped>
.r-checkbox-container {
  margin: 1rem 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
}

.r-checkbox-box {
  margin: auto;
  max-width: 500px;
  box-sizing: border-box;
}

.r-checkbox-item {
  display: flex;
  margin: 0.3rem 0;
  padding: 0.6rem;
  align-items: center;
  background-color: #eee;
}

.r-checkbox-item-icon {
  margin-right: 0.3rem;
  font-size: 2rem;
  font-weight: bold;
}

.r-checkbox-item-content {
  flex: 1;
  font-size: 1.1rem;
  word-break: break-all;
  text-align: left;
}
</style>
