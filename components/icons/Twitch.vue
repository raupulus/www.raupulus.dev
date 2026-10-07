<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://www.twitch.tv/raupulus',
        size: '24px',
        title: 'Enlace a Twitch',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#9147ff">
        <img src="@/public/images/icons/twitch.svg" width="24" style="width: 100%" alt="Logo de Twitch" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#9147ff">
        <NuxtImg src="/images/icons/twitch.svg" width="32" style="width: 100%" alt="Logo de Twitch" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#9147ff">
        <NuxtImg src="/images/icons/twitch.svg" width="24" style="width: 100%" alt="Logo de Twitch" />
    </IconsGeneric>
</template>
