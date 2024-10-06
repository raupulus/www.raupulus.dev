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
  margin: auto;
  max-width: 600px;
  padding: 1.3rem;
  text-align: center;
  overflow: hidden;
}

.box-container-technologies img {
  display: inline-block;
  margin: 2px 4px;
  padding-bottom: 2px;
  width: 35px;
  height: 35px;
  cursor: pointer;
  object-fit: cover;
  object-position: center;
  filter: grayscale(60%);
}

.box-container-technologies img:hover,
.box-container-technologies img.technology-selected {
  transform: scale(1.3);
  filter: grayscale(0%);
  border-bottom: 4px solid var(--primary);
}

.box-container-technologies img.technology-selected {
  cursor: not-allowed;
}
</style>
