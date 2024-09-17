<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://gitlab.com/raupulus'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a repositorio GitLab'
    },
    legacy: {
        type: Boolean,
        required: false,
        default: false,
    },
    decored: {
        type: Boolean,
        required: false,
        default: false,
    }
})
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#FCA326">
        <img src="@/public/images/icons/gitlab.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#FCA326">
        <NuxtImg src="/images/icons/gitlab.svg" width="32" style="width: 100%;"
            alt="Logo de Gitlab" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#FCA326">
        <NuxtImg src="/images/icons/gitlab.svg" width="24" style="width: 100%;"
            alt="Logo de Gitlab" />
    </IconsGeneric>
</template>
