<template>
  <div :id="alert.id"
    :class="'r-alert-container r-alert-align-' + alert.data.align + ' r-alert-type-' + alert.data.type">
    <div class="r-alert">
      <div v-if="alert.data.title" class="r-alert-title" v-html="replaceBreakLine(alert.data.title)"></div>
      <div class="r-alert-content" v-html="replaceBreakLine(alert.data.message)"></div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { BlockAlertType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const alert = props.block as BlockAlertType
const replaceBreakLine = (text: string) => text.replace(/\n|\r/g, '<br>').trim();
</script>

<style scoped>
.r-alert-container {
  position: relative;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.r-alert-title {
  font-size: 2.3rem;
  font-weight: bold;
}

.r-alert-align-left {
  text-align: left;
}

.r-alert-align-right {
  text-align: right;
}

.r-alert-align-center {
  text-align: center;
}

.r-alert-type-primary {
  background-color: #ebf8ff;
  border: 1px solid #4299e1;
  color: #2b6cb0;
}

.r-alert-type-secondary {
  background-color: #f7fafc;
  border: 1px solid #cbd5e0;
  color: #222731;
}

.r-alert-type-info {
  background-color: #e6fdff;
  border: 1px solid #4cd4ce;
  color: #00727c;
}

.r-alert-type-success {
  background-color: #f0fff4;
  border: 1px solid #68d391;
  color: #2f855a;
}

.r-alert-type-warning {
  background-color: #fffaf0;
  border: 1px solid #ed8936;
  color: #c05621;
}

.r-alert-type-danger {
  background-color: #fff5f5;
  border: 1px solid #fc8181;
  color: #c53030;
}

.r-alert-type-light {
  background-color: #fff;
  border: 1px solid #edf2f7;
  color: #1a202c;
}

.r-alert-type-dark {
  background-color: #2d3748;
  border: 1px solid #1a202c;
  color: #d3d3d3;
}
</style>
