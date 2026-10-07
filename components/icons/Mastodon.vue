<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://mastodon.online/@raupulus',
        size: '24px',
        title: 'Enlace a Mastodon',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#6b21a8">
        <img src="@/public/images/icons/mastodon.svg" width="24" style="width: 100%" alt="Logo de Mastodon" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#6b21a8">
        <NuxtImg src="/images/icons/mastodon.svg" width="32" style="width: 100%" alt="Logo de Mastodon" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#6b21a8">
        <NuxtImg src="/images/icons/mastodon.svg" width="24" style="width: 100%" alt="Logo de Mastodon" />
    </IconsGeneric>
</template>
