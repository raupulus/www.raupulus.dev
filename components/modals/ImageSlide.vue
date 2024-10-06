<template>
    <div v-if="show && galleryPaths.length > 0" class="modal" @click.self="closeModal">
        <div class="modal-content">
            <button @click="closeModal" class="close">X</button>

            <div class="main-image-container">
                <img v-if="currentImage" :src="currentImage.image" class="large-image" />
            </div>

            <div class="thumbnails-container">
                <div class="thumbnails">
                    <div v-for="(path, index) in galleryPaths" :key="index" @click="selectImage(index)"
                        :class="{ active: index === currentIndex }" class="thumbnail-item">
                        <NuxtImg :src="path.thumbnail" class="thumbnail-image" loading="lazy" />
                    </div>
                </div>
            </div>

            <div class="button-container">
                <button @click="previousImage" class="prev-button" :class="{ disabled: currentIndex === 0 }"
                    :disabled="currentIndex === 0">
                    Anterior
                </button>
                <button @click="nextImage" class="next-button"
                    :class="{ disabled: currentIndex === galleryPaths.length - 1 }"
                    :disabled="currentIndex === galleryPaths.length - 1">
                    Siguiente
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import type { GalleryPathType } from '@/types/GalleryPathType';

export default defineComponent({
    name: 'ModalsImageSlide',
    props: {
        show: {
            type: Boolean,
            required: true
        },
        galleryPaths: {
            type: Array as () => GalleryPathType[],
            default: () => [],
            required: true
        },
        selectedIndex: {
            type: Number,
            default: 0
        },
    },
    setup(props, { emit }) {
        const currentIndex = ref<number>(props.selectedIndex);
        const currentImage = computed(() => props.galleryPaths[currentIndex.value]);

        watch(() => props.selectedIndex, (newIndex) => {
            currentIndex.value = newIndex;
        });

        const closeModal = () => {
            emit('update:show', false);
        };

        const selectImage = (index: number) => {
            currentIndex.value = index;
        };

        const previousImage = () => {
            if (currentIndex.value > 0) {
                currentIndex.value -= 1;
            }
        };

        const nextImage = () => {
            if (currentIndex.value < props.galleryPaths.length - 1) {
                currentIndex.value += 1;
            }
        };

        const handleKeydown = (event: KeyboardEvent) => {
            if (props.show) {
                if (event.key === 'ArrowLeft') {
                    previousImage();
                } else if (event.key === 'ArrowRight') {
                    nextImage();
                }
            }
        };

        onMounted(() => {
            window.addEventListener('keydown', handleKeydown);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('keydown', handleKeydown);
        });

        return {
            currentIndex,
            currentImage,
            closeModal,
            selectImage,
            previousImage,
            nextImage,
        };
    },
});
</script>

<style scoped>
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.8);
}

.modal-content {
    position: relative;
    display: grid;
    grid-template-rows: auto 110px 60px;
    /* Ajustamos la altura de los thumbnails */
    align-items: center;
    background-color: #fefefe;
    padding: 1rem;
    border: 1px solid #888;
    width: 90%;
    max-width: 1400px;
    height: 90%;
    box-sizing: border-box;
}

.close {
    position: absolute;
    padding: 1.3rem 1.3rem 2.3rem 2.3rem;
    right: 0;
    top: 0;
    opacity: 0.4;
    cursor: pointer;
    background-color: var(--primary);
    border-radius: 0 0 0 66px;
    text-align: center;
    font-size: 2rem;
    color: #f1f1f1;
    border: transparent;
}

.close:hover,
.close:focus {
    opacity: 1;
    background-color: var(--warning);
}

.main-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 100%;
}

.large-image {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.thumbnails-container {
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
}

.thumbnails {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    white-space: nowrap;
    width: 100%;
    padding: 0 10px;
}

.thumbnail-item {
    display: inline-block;
    margin: 0 5px;
    flex-shrink: 0;
    cursor: pointer;
}

.thumbnail-item.active .thumbnail-image {
    border: 3px solid var(--primary);
}

.thumbnail-image {
    width: 80px;
    /* Ajustamos el tamaño de los thumbnails */
    height: 80px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 1rem;
    box-sizing: border-box;
}

.prev-button,
.next-button {
    background-color: var(--primary);
    border: none;
    color: #fff;
    padding: 0.5rem 1rem;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.prev-button.disabled,
.next-button.disabled {
    background-color: var(--gray);
    cursor: not-allowed;
}

.prev-button:hover:not(.disabled),
.next-button:hover:not(.disabled) {
    background-color: var(--warning);
}
</style>
