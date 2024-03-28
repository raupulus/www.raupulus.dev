<script lang="ts" setup>
import type { TechnologyType } from '@/types/TechnologyType';

const emit = defineEmits(['clickTechnologySelect']);

const props = defineProps({
  technologies: {
    type: Array as PropType<Array<TechnologyType>>,
    require: false,
    default: () => [],
  },
  technologySelect: {
    type: String,
    require: false,
    default: '',
  }
})

</script>

<template>
  <div class="box-grid-technologies">
    <div class="box-container-technologies" v-if="technologies && technologies.length">

      <img v-for="technology in technologies" :src="technology.urlImageSmall" :alt="technology.name"
        @click="technologySelect !== technology.slug ? emit('clickTechnologySelect', { technologySelect: technology.slug }) : null"
        :title="technology.name" :class="technologySelect === technology.slug ? 'technology-selected' : ''" />

    </div>
  </div>
</template>

<style>
.box-grid-technologies {
  width: 100%;
}

.box-container-technologies {
  text-align: center;
  overflow: hidden;
  padding: 1.3rem;
}

.box-container-technologies img {
  display: inline-block;
  margin: 1px 2px;
  width: 25px;
  height: 25px;
  cursor: pointer;
  object-fit: cover;
  object-position: center;
  filter: grayscale(60%);
}

.box-container-technologies img:hover,
.box-container-technologies img.technology-selected {
  transform: scale(1.3);
  filter: grayscale(0%);
}

.box-container-technologies img.technology-selected {
  cursor: not-allowed;
}
</style>
