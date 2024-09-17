import { type } from '../../.nuxt/types/imports';
import { default } from '../../composables/useGoogleRecaptcha';
<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://www.youtube.com/@raupulus'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a Youtube'
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
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#dc2626">
        <img src="@/public/images/icons/youtube.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#dc2626">
        <NuxtImg src="/images/icons/youtube.svg" width="32" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#dc2626">
        <NuxtImg src="/images/icons/youtube.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>
</template>
