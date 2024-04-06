<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://raupulus.dev'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a sitio web'
    },
    decored: {
        type: Boolean,
        required: false,
        default: false,
    }
})
</script>

<template>
    <IconsGenericSocial v-if="decored" :url="url" :title="title" :size="size" color="#2a64a3">
        <NuxtImg format="webp" quality="80" src="/icons/earth.svg" width="32" style="width: 100%;" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#2a64a3">
        <NuxtImg format="webp" quality="80" src="/icons/earth.svg" width="24" style="width: 100%;" />
    </IconsGeneric>
</template>
