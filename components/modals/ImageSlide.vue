<template>
    <div v-if="show && galleryPaths.length > 0" class="modal">
        <div class="modal-content">
            <button @click="closeModal" class="close">&times;</button>

            <div class="main-image">
                <NuxtImg v-if="currentImage" :src="currentImage.image" class="large-image" />
            </div>

            <div class="thumbnails">
                <div v-for="(path, index) in galleryPaths" :key="index" @click="selectImage(index)"
                    :class="{ active: index === currentIndex }" class="thumbnail-item">
                    <NuxtImg :src="path.thumbnail" class="thumbnail-image" />
                </div>
            </div>

            <button @click="previousImage" class="prev-button">&laquo; Prev</button>
            <button @click="nextImage" class="next-button">Next &raquo;</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import type { GalleryPathType } from '@/types/GalleryPathType';

export default defineComponent({
    name: 'ModalsImageSlide',
    props: {
        show: {
            type: Boolean,
            required: true
        },
        galleryPaths: {
            type: Array as PropType<GalleryPathType[]>,
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
            if (props.galleryPaths.length > 0) {
                currentIndex.value = (currentIndex.value - 1 + props.galleryPaths.length) % props.galleryPaths.length;
            }
        };

        const nextImage = () => {
            if (props.galleryPaths.length > 0) {
                currentIndex.value = (currentIndex.value + 1) % props.galleryPaths.length;
            }
        };

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
/* Your styles here */
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
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 1rem;
    border: 1px solid #888;
    width: 80%;
    max-width: 800px;
    position: relative;
}

.close {
    position: absolute;
    top: 15px;
    right: 20px;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}

.main-image {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
}

.large-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
}

.thumbnails {
    display: flex;
    overflow-x: auto;
    margin-bottom: 1rem;
}

.thumbnail-item {
    margin-right: 0.5rem;
    cursor: pointer;
}

.thumbnail-item.active .thumbnail-image {
    border: 2px solid #007bff;
}

.thumbnail-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.prev-button,
.next-button {
    background-color: #007bff;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 0.5rem;
    cursor: pointer;
    border-radius: 4px;
}

.prev-button:hover,
.next-button:hover {
    background-color: #0056b3;
}
</style>
