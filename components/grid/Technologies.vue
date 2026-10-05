<script lang="ts" setup>
    import type { TechnologyType } from '@/types/TechnologyType';

    const emit = defineEmits(['clickTechnologySelect']);

    defineProps({
        technologies: {
            type: Array as PropType<Array<TechnologyType>>,
            required: false,
            default: () => [],
        },
        technologySelect: {
            type: String,
            required: false,
            default: '',
        },
    });
</script>

<template>
    <div class="w-full">
        <div
            v-if="technologies && technologies.length"
            class="max-w-2xl mx-auto p-4 text-center flex flex-wrap justify-center gap-2"
        >
            <template v-for="technology in technologies" :key="technology.slug">
                <button
                    v-if="technology.image"
                    type="button"
                    :aria-pressed="technologySelect === technology.slug"
                    :aria-label="`Filtrar por ${technology.name}`"
                    :title="technology.name"
                    class="p-2 rounded-lg border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center justify-center cursor-pointer"
                    :class="
                        technologySelect === technology.slug
                            ? 'bg-primary/20 border-primary scale-110 shadow-lg shadow-primary/20 ring-1 ring-primary'
                            : 'bg-surface-container-high/60 border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-high hover:scale-105 opacity-80 hover:opacity-100'
                    "
                    @click="
                        emit('clickTechnologySelect', {
                            technologySelect: technologySelect === technology.slug ? '' : technology.slug,
                        })
                    "
                >
                    <NuxtImg
                        :src="technology.image"
                        :alt="technology.name"
                        loading="lazy"
                        width="32"
                        height="32"
                        class="w-7 h-7 object-contain transition-all"
                        :class="technologySelect === technology.slug ? '' : 'grayscale hover:grayscale-0'"
                    />
                </button>
            </template>
        </div>
    </div>
</template>
