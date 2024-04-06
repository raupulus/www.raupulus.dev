<template>
  <div v-if="visible" class="modal-project-show">

    <div class="modal-container-project-show">
      <!-- Header -->
      <div class="modal-project-show-header">
        <div class="modal-project-show-header-technologies">
          Iconos de tecnología (arriba derecha)
        </div>

        Imagen de cabecera

        <h3>Título del proyecto</h3>

        <span class="modal-project-show-header-close" @click="emit('closemodalprojectshow')">
          CERRAR MODAL
        </span>
      </div>

      <div class="modal-project-show-body">

      </div>

      <div class="modal-project-show-footer">
        < [1] [2] ... [5] [6]>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import type { ContentType } from '@/types/ContentType';

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
    default: false,
  },
  project: {
    type: Object as PropType<ContentType>,
  }
})

const emit = defineEmits(['closemodalprojectshow']);

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
  overflow: hidden;
}

.modal-container-project-show {
  display: grid;
  margin: auto;
  width: 100%;
  max-width: 1200px;
  height: 90%;
  grid-template-rows: 200px 1fr auto;

  background-color: #f1f1f1;
  text-align: center;
  font-size: 2rem;
  color: #f1f1f1;
}


.modal-project-show-header {
  width: 100%;
  height: 100%;
  background-color: red;
}

.modal-project-show-body {
  padding: 1.3rem;
}

.modal-project-show-footer {
  padding: 1.3rem;
  background-color: #000;
}

.modal-project-show-header-close {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  padding: 1.3rem;
  background-color: green;
}
</style>
