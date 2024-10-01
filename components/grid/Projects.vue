<script lang="ts" setup>
import type { ContentType } from '~/types/ContentType';

const props = defineProps({
  projects: {
    type: Array as PropType<Array<ContentType>>,
    default: [],
    required: false,
  }
});

const showContent = ref(false);
const currentContent = ref<ContentType | undefined>(undefined);

function isHorizontal(pos: number) {
  return ((pos + 1) % 3) === 0
}

function handleShowProjectEvent(project: ContentType) {
  //console.log(project);
  showContent.value = true;
  currentContent.value = project;
}

</script>

<template>
  <div class="box-grid-projects">
    <ModalsProjectShow :project="currentContent" :visible="showContent" @closemodalprojectshow="showContent = false" />

    <div v-for="project, key in projects" :key="project.slug"
      :class="isHorizontal(key) ? 'box-horizontal' : 'box-vertical'">

      <CardProjectHorizontal v-if="isHorizontal(key)" :data="project" @projecteventshow="handleShowProjectEvent" />

      <CardProjectVertical v-else :data="project" @projecteventshow="handleShowProjectEvent" />
    </div>
  </div>
</template>

<style>
.box-grid-projects {
  margin: 0;
  padding: 0;
  display: grid;
  /*grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
  /*grid-template-columns: repeat(2, 1fr);*/
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1.3rem;
  align-items: top;
  box-sizing: border-box;
}

.box-horizontal {
  grid-column: 1 / span 2;
}

.box-vertical {}

@media (max-width: 880px) {
  .box-grid-projects {
    grid-gap: 0.6rem;
  }

  .box-vertical {
    grid-column: 1 / span 2;
  }
}
</style>
