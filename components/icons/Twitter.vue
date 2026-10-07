<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://twitter.com/raupulus',
        size: '24px',
        title: 'Enlace a Twitter',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#00ACEE">
        <img src="@/public/images/icons/twitter.svg" width="24" style="width: 100%" alt="Logo de Twitter" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#00ACEE">
        <NuxtImg src="/images/icons/twitter.svg" width="32" style="width: 100%" alt="Logo de Twitter" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#00ACEE">
        <NuxtImg src="/images/icons/twitter.svg" width="24" style="width: 100%" alt="Logo de Twitter" />
    </IconsGeneric>
</template>
