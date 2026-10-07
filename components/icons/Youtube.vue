<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://www.youtube.com/@raupulus',
        size: '24px',
        title: 'Enlace a Youtube',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#dc2626">
        <img src="@/public/images/icons/youtube.svg" width="24" style="width: 100%" alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#dc2626">
        <NuxtImg src="/images/icons/youtube.svg" width="32" style="width: 100%" alt="Logo de Youtube" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#dc2626">
        <NuxtImg src="/images/icons/youtube.svg" width="24" style="width: 100%" alt="Logo de Youtube" />
    </IconsGeneric>
</template>
