<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://github.com/raupulus'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a repositorio en GitHub'
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
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#050505">
        <img src="@/public/images/icons/github.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#050505">
        <NuxtImg src="/images/icons/github.svg" width="32" style="width: 100%;"
            alt="Logo de Github" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#050505">
        <NuxtImg src="/images/icons/github.svg" width="24" style="width: 100%;"
            alt="Logo de Github" />
    </IconsGeneric>
</template>
