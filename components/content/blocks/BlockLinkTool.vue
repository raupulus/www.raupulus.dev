<template>
  <div :id="linkTool.id" class="r-web-preview-container">
    <div class="r-web-preview-box">
      <a class="r-web-preview-link" target="_blank" rel="nofollow noindex noreferrer" :href="linkTool.data.link">

        <div v-if="linkTool.data.meta.image?.url" class="r-web-preview-image"
          v-bind:style="{ backgroundImage: `url(${linkTool.data.meta.image.url})` }"></div>

        <div v-if="linkTool.data.meta.title" class="r-web-preview-title" v-html="linkTool.data.meta.title"></div>

        <div v-if="linkTool.data.meta.description" class="r-web-preview-description"
          v-html="replaceBreakLine(linkTool.data.meta.description)"></div>

        <span class="r-web-preview-anchor">{{ linkTool.data.link.replace(/https*:\/\//, '') }}</span>
      </a>
    </div>
  </div>

</template>

<script lang="ts" setup>
import type { BlockLinkToolType } from '@/types/BlocksType';
import type { BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const linkTool = props.block as BlockLinkToolType
const replaceBreakLine = (text: string) => text.replace(/\n|\r/g, '<br>').trim();
</script>

<style scoped>
.r-web-preview-container {
  margin: 1rem 0;
  width: 100%;
  box-sizing: border-box;
}

.r-web-preview-box {
  margin: auto;
  padding: 1rem 0.4rem;
  width: 100%;
  max-width: 650px;
  box-sizing: border-box;
}

.r-web-preview-link {
  cursor: pointer;
  background: #fff;
  border: 1px solid rgba(201, 201, 204, 0.48);
  box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
  border-radius: 6px;
  will-change: filter;
  animation: link-in 450ms 1 cubic-bezier(0.215, 0.61, 0.355, 1);
  display: block;
  padding: 25px;
  color: initial !important;
  text-decoration: none !important;
}

.r-web-preview-image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0 0 0 30px;
  width: 65px;
  height: 65px;
  border-radius: 3px;
  float: right;
}

.r-web-preview-title {
  text-align: left;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5em;
  margin: 0 0 10px 0;
}

.r-web-preview-description {
  margin: 0 0 20px 0;
  font-size: 15px;
  text-align: left;
  line-height: 1.55em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.r-web-preview-anchor {
  display: block;
  font-size: 15px;
  line-height: 1em;
  color: #888 !important;
  border: 0 !important;
  padding: 0 !important;
  text-align: left;
}
</style>
