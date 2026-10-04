<template>
    <div
        v-if="show && galleryPaths.length > 0"
        class="fixed inset-0 z-[1000] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-label="Visor de galería de imágenes"
        @click.self="closeModal"
    >
        <div class="relative flex flex-col w-full max-w-6xl max-h-full bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-2xl">

            <!-- Barra superior: contador y cerrar -->
            <div class="flex items-center justify-between px-5 py-3 border-b border-outline-variant/20 bg-surface-container-high">
                <span class="font-label text-xs tracking-widest uppercase text-outline">
                    Galería · <span class="text-tertiary">{{ currentIndex + 1 }}</span> / {{ galleryPaths.length }}
                </span>
                <button
                    class="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container-highest transition-colors"
                    aria-label="Cerrar galería"
                    @click="closeModal"
                >
                    <UiMaterialIcon name="close" />
                </button>
            </div>

            <!-- Imagen principal con flechas laterales -->
            <div class="relative flex-1 min-h-0 flex items-center justify-center bg-surface-container-lowest">
                <NuxtImg
                    v-if="currentImage"
                    :src="currentImage.image"
                    class="max-h-[60vh] md:max-h-[65vh] w-full object-contain"
                    :alt="'Imagen ' + (currentIndex + 1) + ' de la galería'"
                    loading="eager"
                />

                <button
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-surface-container-high/80 border border-outline-variant/30 text-on-surface backdrop-blur-sm transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="currentIndex === 0"
                    aria-label="Imagen anterior"
                    @click="previousImage"
                >
                    <UiMaterialIcon name="arrow_forward" class="rotate-180" />
                </button>

                <button
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-surface-container-high/80 border border-outline-variant/30 text-on-surface backdrop-blur-sm transition-all hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    :disabled="currentIndex === galleryPaths.length - 1"
                    aria-label="Imagen siguiente"
                    @click="nextImage"
                >
                    <UiMaterialIcon name="arrow_forward" />
                </button>
            </div>

            <!-- Tira de miniaturas -->
            <div class="border-t border-outline-variant/20 bg-surface-container-high px-3 py-3">
                <div ref="thumbnailsRef" class="flex gap-2 overflow-x-auto scroll-smooth">
                    <button
                        v-for="(path, index) in galleryPaths"
                        :key="index"
                        type="button"
                        class="shrink-0 rounded-lg overflow-hidden border-2 transition-all"
                        :class="index === currentIndex
                            ? 'border-primary opacity-100'
                            : 'border-transparent opacity-50 hover:opacity-100'"
                        :aria-label="'Ver imagen ' + (index + 1)"
                        :aria-current="index === currentIndex ? 'true' : undefined"
                        @click="selectImage(index)"
                    >
                        <NuxtImg
                            :src="path.thumbnail"
                            class="w-16 h-16 md:w-20 md:h-20 object-cover"
                            width="80"
                            height="80"
                            :alt="'Miniatura ' + (index + 1)"
                            loading="lazy"
                        />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { GalleryPathType } from '@/types/GalleryPathType';

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    galleryPaths: {
        type: Array as PropType<GalleryPathType[]>,
        default: () => [],
    },
    selectedIndex: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(['update:show']);

const currentIndex = ref<number>(props.selectedIndex);
const currentImage = computed(() => props.galleryPaths[currentIndex.value]);
const thumbnailsRef = ref<HTMLElement | null>(null);

watch(() => props.selectedIndex, (newIndex) => {
    currentIndex.value = newIndex;
});

// Mantiene visible la miniatura activa al navegar
watch(currentIndex, async () => {
    await nextTick();
    const container = thumbnailsRef.value;
    const active = container?.children[currentIndex.value] as HTMLElement | undefined;
    active?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
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
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowLeft') {
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
</script>
