<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://gitlab.com/raupulus',
        size: '24px',
        title: 'Enlace a repositorio GitLab',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#FCA326">
        <img src="@/public/images/icons/gitlab.svg" width="24" style="width: 100%" alt="Logo de Gitlab" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#FCA326">
        <NuxtImg src="/images/icons/gitlab.svg" width="32" style="width: 100%" alt="Logo de Gitlab" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#FCA326">
        <NuxtImg src="/images/icons/gitlab.svg" width="24" style="width: 100%" alt="Logo de Gitlab" />
    </IconsGeneric>
</template>
