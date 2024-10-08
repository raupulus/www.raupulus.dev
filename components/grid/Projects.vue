<script lang="ts" setup>
import type { ContentType } from '~/types/ContentType';

const emit = defineEmits(['slugchange']);

const props = defineProps({
  openProjetOnLoad: {
    type: Boolean,
    default: false,
  },
  slugContent: {
    type: String,
    default: null,
  },
  slugPage: {
    type: String,
    default: null,
  },
  projects: {
    type: Array as PropType<Array<ContentType>>,
    default: [],
    required: false,
  }
});

const showContent = ref(props.openProjetOnLoad);
const currentContent = ref<ContentType | undefined>(undefined);

function isHorizontal(pos: number) {
  return ((pos + 1) % 3) === 0
}

function handleShowProjectEvent(project: ContentType) {
  showContent.value = true;
  currentContent.value = project;

  // Página a buscar.
  let page = 1;

  if (project.pages_slug && project.pages_slug.length && props.slugPage) {
    console.log('SE CUMPLE');
    page = project.pages_slug.indexOf(props.slugPage) + 1;
  }

  usePageData(page, project.slug).then((page) => {
    // Emito evento al padre para actualizar el slug de la url
    emit('slugchange', currentContent.value?.slug, page.value?.slug)
  })
}

// Abrir el modal al entrar si se recibe slug.
if (props.openProjetOnLoad && props.slugContent) {
  useGetProjectBySlug(props.slugContent).then((content: ContentType | null) => {
    if (content) {
      currentContent.value = content;
      handleShowProjectEvent(content);
    }
  });
}

</script>

<template>
  <div class="box-grid-projects">
    <ModalsProjectShow :project="currentContent" :visible="showContent" @closemodalprojectshow="showContent = false"
      @slugchange="(slugProject, slugPage) => emit('slugchange', slugProject, slugPage)" />

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
