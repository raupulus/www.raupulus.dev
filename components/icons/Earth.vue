<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://raupulus.dev',
        size: '24px',
        title: 'Enlace a sitio web',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#2a64a3">
        <img src="@/public/images/icons/earth.svg" width="24" style="width: 100%" alt="Icono de la tierra" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#2a64a3">
        <NuxtImg src="/images/icons/earth.svg" width="32" style="width: 100%" alt="Icono de la tierra" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#2a64a3">
        <NuxtImg src="/images/icons/earth.svg" width="24" style="width: 100%" alt="Icono de la tierra" />
    </IconsGeneric>
</template>
