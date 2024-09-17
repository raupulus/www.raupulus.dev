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
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#2a64a3">
        <img src="@/public/images/icons/earth.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#2a64a3">
        <NuxtImg src="/images/icons/earth.svg" width="32" style="width: 100%;"
            alt="Icono de la tierra" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#2a64a3">
        <NuxtImg src="/images/icons/earth.svg" width="24" style="width: 100%;"
            alt="Icono de la tierra" />
    </IconsGeneric>
</template>
