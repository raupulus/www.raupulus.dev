<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://t.me/raupulus_diffusion',
        size: '24px',
        title: 'Enlace a Telegram',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#3272b8">
        <img src="@/public/images/icons/telegram.svg" width="24" style="width: 100%" alt="Logo de Telegram" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#3272b8">
        <NuxtImg src="/images/icons/telegram.svg" width="32" style="width: 100%" alt="Logo de Telegram" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#3272b8">
        <NuxtImg src="/images/icons/telegram.svg" width="24" style="width: 100%" alt="Logo de Telegram" />
    </IconsGeneric>
</template>
