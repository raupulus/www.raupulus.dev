<template>
  <div v-if="visible && project" class="modal-project-show">
    <div class="modal-container-project-show">
      <!-- Header -->
      <div class="modal-project-show-header" :style="{ backgroundImage: `url('${backgroundImageUrl}')` }">

        <!-- Izquierda, imagen del proyecto -->
        <div class="modal-project-show-header-main-img">
          <img :src="project.urlImageSmall" :alt="project.title" :title="project.title">
        </div>

        <!-- Centro, título y la imagen de la página actual -->
        <div class="modal-project-header-center">
          <h3 class="modal-project-title-page">{{ page?.title ?? project.title }}</h3>

          <div class="modal-project-show-header-technologies">
            <img v-for="technology in project.technologies" :src="technology.urlImageSmall" :title="technology.name"
              :alt="technology.name">
          </div>
        </div>

        <!-- Derecha, tecnologías y cerrar modal -->
        <div class="modal-project-show-header-main-last">
          <span class="modal-project-show-header-close"
            @click="() => { emit('closemodalprojectshow'); emit('slugchange'); emit('metatagchange') }">
            X
          </span>
        </div>

      </div>

      <div class="modal-project-show-body">

        <div class="modal-project-show-body-content" v-if="page?.content">
          <ContentBlocksBlock v-for="block in page.content.blocks" :block="block" />
        </div>

      </div>

      <div class="modal-project-show-footer">

        <!-- Paginador -->
        <ContentPaginator v-if="project && project?.total_pages && project?.total_pages > 1"
          :contentslug="project?.slug" :project="project"
          @slugchange="(slugProject, slugPage) => emit('slugchange', slugProject, slugPage)" :currentpage="page?.order"
          @metatagchange="(title, description, keywords, url, image) => emit('metatagchange', title, description, keywords, url, image)"
          :totalpages="project?.total_pages" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type { ContentType } from '@/types/ContentType';
//import type { ContentPageType } from '@/types/ContentPageType';
import { usePageData, getPageData } from '../../composables/fetchPageData';

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
    default: false,
  },
  project: {
    type: Object as PropType<ContentType | undefined>,
    required: false,
    default: undefined
  }
})

const emit = defineEmits(['disablescroll', 'closemodalprojectshow', 'slugchange', 'metatagchange']);
const scrollDisabled = useScrollDisabled();

//const page = ref<ContentPageType | undefined>(undefined);
const page = getPageData();

watch(props, (allProps) => {
  scrollDisabled.value = allProps.visible;
})

// Computed property for background image URL
const backgroundImageUrl = computed(() => page.value?.images?.large ?? props.project?.urlImage);

</script>

<style scoped>
.modal-project-show {
  display: grid;
  position: fixed;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  align-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  grid-template-rows: 1fr;
  z-index: 11;
  box-sizing: border-box;
}

.modal-container-project-show {
  display: grid;
  margin: auto;
  width: 100%;
  max-width: 1200px;
  max-height: 100vh;
  height: 95%;
  grid-template-rows: 200px 1fr auto;

  background-color: #f1f1f1;
  text-align: center;
  font-size: 2rem;
  color: #f1f1f1;
}


/** Cabecera **/
.modal-project-show-header {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: auto 1fr auto;
  background-color: #f1f1f1;
  /*background-image: v-bind("`url('${page?.images?.large ?? project?.urlImage}')`");*/
  /* Imagen principal del proyecto */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  backdrop-filter: blur(2px);
  align-content: center;
  grid-template-rows: 200px;
  gap: 0.3rem;
  padding: 0.3rem;
  box-sizing: border-box;

  /* Animación para entrar la imagen */
  -webkit-transition: background-image 0.4s ease-in-out;
  transition: background-image 0.4s ease-in-out;
}

.modal-project-header-center {
  display: grid;
  grid-template-rows: 1fr auto;
}

.modal-project-title-page {
  display: block;
  margin: 0.3rem;
  width: 100%;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-decoration: wavy;
  text-shadow: 1px 1px 2px var(--primary), 0 0 1em var(--primary), 0 0 0.2em var(--primary);
}

.modal-project-show-header-technologies {
  display: flex;
  padding: 0.3rem;
  flex-direction: row-reverse;
  box-sizing: border-box;


}

.modal-project-show-header-technologies svg,
.modal-project-show-header-technologies img {
  display: inline-block;
  margin: 0 3px;
  width: 25px;
  height: 25px;
}

.modal-project-show-header-main-img {
  display: grid;
  margin: auto;
  width: 120px;
  border-radius: 6px;
  overflow: hidden;
  align-content: center;
  align-self: center;
}

.modal-project-show-header-main-img>img {
  margin: auto;
  width: 100%;
}

.modal-project-show-header-main-last {
  display: grid;
  margin: auto;
  width: 120px;
  height: 100%;
  align-content: center;
  align-self: center;
}

/** Contenido **/
.modal-project-show-body {
  padding: 1.3rem;
  width: 100%;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
}

.modal-project-show-body-content {
  word-break: break-all;
  color: #222222;
}

.modal-project-show-footer {
  padding: 0.1rem;
  background-color: #000;
}

.modal-project-show-header-close {
  position: absolute;
  padding: 1.3rem 1.3rem 2.3rem 2.3rem;
  right: 0;
  top: 0;
  opacity: 0.4;
  cursor: pointer;
  background-color: var(--primary);
  border-radius: 0 0 0 66px;
}

.modal-project-show-header-close:hover {
  opacity: 1;
  background-color: var(--warning);
}

@media (max-width: 650px) {
  .modal-project-show-header-main-img {
    display: none;
  }

  .modal-project-show-header-main-last {
    position: absolute;
    right: 0;
    top: 0;
  }

  .modal-container-project-show {
    font-size: 1.1rem;
  }

  .modal-project-show-header-close {
    padding: 0.9rem 0.9rem 1.6rem 1.6rem;
  }

  .modal-project-title-page {
    padding: 0 3.2rem;
    box-sizing: border-box;
    font-size: 1.6rem;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    display: block;
  }

}
</style>
