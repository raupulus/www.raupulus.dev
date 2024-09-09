<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://twitter.com/raupulus'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a Twitter'
    },
    decored: {
        type: Boolean,
        required: false,
        default: false,
    }
})
</script>

<template>
    <IconsGenericSocial v-if="decored" :url="url" :title="title" :size="size" color="#00ACEE">
        <NuxtImg format="webp" quality="80" src="/icons/twitter.svg" width="32" style="width: 100%;"
            alt="Logo de Twitter" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#00ACEE">
        <NuxtImg format="webp" quality="80" src="/icons/twitter.svg" width="24" style="width: 100%;"
            alt="Logo de Twitter" />
    </IconsGeneric>
</template>
