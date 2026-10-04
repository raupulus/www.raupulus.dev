<script lang="ts" setup>
import type { ContentType } from '~/types/ContentType';

const config = useRuntimeConfig();
const urlBase = config.public.app.url;

const emit = defineEmits(['slugchange', 'metatagchange']);

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
    default: () => [],
    required: false,
  }
});

const showContent = ref(props.openProjetOnLoad);
const currentContent = ref<ContentType | undefined>(undefined);

function isHorizontal(pos: number) {
  return ((pos + 1) % 3) === 0
}

/**
 * Abre un proyecto en el modal: descarga su detalle (índice de páginas,
 * primera página, tecnologías, metadatos y taxonomías) y la página pedida en
 * la URL (`slugPage`) o la primera.
 *
 * @param slug Slug del proyecto
 * @param preview Datos del listado para pintar el modal mientras llega el detalle
 */
async function openProject(slug: string, preview?: ContentType) {
  setCurrentPage(undefined);
  showContent.value = true;
  currentContent.value = preview;

  const project = await useGetProjectBySlug(slug);

  if (!project) {
    if (!preview) {
      showContent.value = false;
    }
    return;
  }

  currentContent.value = project;

  // Página a mostrar: la de la URL si pertenece a este proyecto, si no la primera
  const order = project.pages?.find(page => page.slug === props.slugPage)?.order ?? 1;

  const contentPage = (order === 1 && project.first_page)
    ? setCurrentPage(project.first_page)
    : await usePageData(order, project.slug);

  // Emito evento al padre para actualizar el slug de la url
  emit('slugchange', project.slug, contentPage.value?.slug)

  // Cambio los metatags de la página
  const meta = buildProjectMetatags(project, contentPage.value, urlBase);
  emit('metatagchange', meta.title, meta.description, meta.keywords, meta.url, meta.image);
}

function handleShowProjectEvent(project: ContentType) {
  openProject(project.slug, project);
}

// Abrir el modal al entrar si se recibe slug. Sólo en el cliente: el detalle
// suma una visita en la API y no debe contarse al prerenderizar.
onMounted(() => {
  if (props.openProjetOnLoad && props.slugContent) {
    openProject(props.slugContent);
  }
});

</script>

<template>
  <div class="box-grid-projects">
    <ModalsProjectShow
:project="currentContent" :visible="showContent" @closemodalprojectshow="showContent = false"
      @metatagchange="(title, description, keywords, url, image) => emit('metatagchange', title, description, keywords, url, image)"
      @slugchange="(slugProject, slugPage) => emit('slugchange', slugProject, slugPage)" />

    <div
v-for="project, key in projects" :key="project.slug"
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
