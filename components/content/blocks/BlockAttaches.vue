<template>
  <div :id="attaches.id" class="r-attaches-container" :data-content_id="attaches.data.file.content_id"
    :data-content_file_id="attaches.data.file.content_file_id" :data-file_id="attaches.data.file.file_id">

    <div class="r-attaches-box">

      <div v-if="attaches.data.file.url_thumbnail" class="r-attaches-img">
        <img :src="attaches.data.file.url_thumbnail" :alt="attaches.data.title">
      </div>

      <div v-else-if="attaches.data.file.file_type_image" class="r-attaches-img">
        <img :src="attaches.data.file.file_type_image" :alt="attaches.data.title">
      </div>

      <div class="r-attaches-info">
        <div>
          {{ attaches.data.title }}
          <span class="r-attaches-info-originalname"> ({{ attaches.data.file.name }})</span>
        </div>

        <div v-if="attaches.data.file.size" class="r-attaches-info-size">
          {{ formatBytes(attaches.data.file.size) }}
        </div>
      </div>

      <div class="r-attaches-download" :data-url_download="attaches.data.file.url">
        <a :href="attaches.data.file.url" download target="_blank" class="r-attaches-download-link">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2"
              d="M7 10L11.8586 14.8586C11.9367 14.9367 12.0633 14.9367 12.1414 14.8586L17 10"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockAttachesType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const attaches = props.block as BlockAttachesType

const formatBytes = (bytes: number, precision: number = 2) => {
  var units = ['B', 'KB', 'MB', 'GB', 'TB'];

  bytes = Math.max(bytes, 0);
  var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
  pow = Math.min(pow, units.length - 1);

  bytes /= Math.pow(1024, pow);

  return (Math.round(bytes * Math.pow(10, precision)) / Math.pow(10, precision)).toFixed(precision) + ' ' + units[pow];
}
</script>

<style scoped>
.r-attaches-container {
  max-width: 650px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

.r-attaches-box {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid #EFF0F1;
  ;
  border-radius: 7px;
  background: #fff;
}

.r-attaches-img {
  height: 80px;
}

.r-attaches-img img {
  height: 100%;
}

.r-attaches-info {
  display: grid;
  grid-gap: 4px;
  max-width: calc(100% - 80px);
  margin: auto 0;
  flex-grow: 2;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d3748;
}

.r-attaches-info .r-attaches-info-size {
  font-size: 0.9rem;
  font-weight: normal;
  color: #707684;
}

.r-attaches-info .r-attaches-info-originalname {
  display: none;
  font-size: 0.7rem;
  font-weight: normal;
}

.r-attaches-download {}

.r-attaches-download svg {
  color: rgba(63, 131, 248, 0.9);
  width: 3rem;
}

.r-attaches-download .r-attaches-download-link {}
</style>
