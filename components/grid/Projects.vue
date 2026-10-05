<script lang="ts" setup>
    import type { ContentType } from '~/types/ContentType';

    defineProps({
        projects: {
            type: Array as PropType<Array<ContentType>>,
            default: () => [],
            required: false,
        },
    });

    function isHorizontal(pos: number) {
        return (pos + 1) % 3 === 0;
    }
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div
            v-for="(project, key) in projects"
            :key="project.slug"
            :class="isHorizontal(key) ? 'col-span-1 md:col-span-2' : 'col-span-1'"
        >
            <CardProjectHorizontal v-if="isHorizontal(key)" :data="project" />
            <CardProjectVertical v-else :data="project" />
        </div>
    </div>
</template>
