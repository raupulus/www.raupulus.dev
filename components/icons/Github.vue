<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://github.com/raupulus',
        size: '24px',
        title: 'Enlace a repositorio en GitHub',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#050505">
        <img src="@/public/images/icons/github.svg" width="24" style="width: 100%" alt="Logo de Github" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#050505">
        <NuxtImg src="/images/icons/github.svg" width="32" style="width: 100%" alt="Logo de Github" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#050505">
        <NuxtImg src="/images/icons/github.svg" width="24" style="width: 100%" alt="Logo de Github" />
    </IconsGeneric>
</template>
