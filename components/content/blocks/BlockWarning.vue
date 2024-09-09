<template>
  <div :id="warning.id" class="r-warning-container">
    <div class="r-warning-wrapper">
      <div class="r-warning-title">
        {{ warning.data.title }}
      </div>

      <div class="r-warning-body">
        {{ warning.data.message }}
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { BlockWarningType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const warning = props.block as BlockWarningType
warning.data.title = warning.data.title.replace(/\n|\r/g, '<br>').trim();
warning.data.message = warning.data.message.replace(/\n|\r/g, '<br>').trim();

</script>

<style scoped>
.r-warning-container {
  background-color: #f8d7da;
  color: #721c24;
  padding: 2rem 1rem;
  border: 1px solid #f5c6cb;
  border-radius: .25rem;
  width: 80%;
  margin: auto;
}

.r-warning-wrapper {
  text-align: center;
}

.r-warning-title {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
}

.r-warning-body {
  font-size: 1rem;
  font-weight: 400;
}

.r-warning-btn-close {
  position: absolute;
  top: 3px;
  right: 3px;
  padding: 3px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
</style>
