<template>
  <div :id="image.id"
    :class="'r-image-container' + (image.data.withBorder ? ' r-image-container-with-border' : '') + (image.data.withBackground ? ' r-image-container-withBackground' : '') + (image.data.stretched ? ' r-image-container-stretched' : '')">
    <div class="r-image-box">
      <figure class="r-image-figure">
        <img :src="image.data.file.url_thumbnail" class="r-image-img" :data-url_medium="image.data.file.url"
          :data-url_full="image.data.file.url_large" :alt="image.data.caption" :title="image.data.caption"
          @load="loadHighQualityImage" />

        <figcaption v-if="image.data.caption" class="r-image-caption">
          {{ image.data.caption }}
        </figcaption>

      </figure>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BlockImageType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const image = props.block as BlockImageType
image.data.caption = image?.data?.caption?.replace(/\n|\r/g, '<br>').trim();

const loadHighQualityImage = (event: Event) => {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = image.data.file.url;
};

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
.r-image-container {
  width: 100%;
  text-align: center;
  height: 320px;
}

.r-image-container.r-image-container-with-border {}

.r-image-container.r-image-container-stretched {}

.r-image-container.r-image-container-withBackground {
  padding: 1rem 0;
  background-color: #eee;
  box-sizing: border-box;
}

.r-image-box {
  display: inline-block;
  margin: auto;
  height: 300px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 15px;
}

.r-image-box:hover {
  height: 320px;
}

.r-image-figure {
  margin: 0;
  padding: 0;
  width: auto;
  height: 100%;
}

.r-image-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.r-image-caption {
  display: none;

}

.r-image-img:hover {
  filter: blur(0.1px) brightness(0.9) contrast(0.9) grayscale(0.1);
}

.r-image-img:hover+.r-image-caption,
.r-image-caption:hover {
  display: block;
  width: 100%;
  color: #eee;
  font-size: 1.2rem;
  font-weight: bold;
  max-width: 320px;
  text-align: center;
  margin: auto;
  translate: 0 -110%;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  padding: 3px 3px 10px 3px;
}
</style>
