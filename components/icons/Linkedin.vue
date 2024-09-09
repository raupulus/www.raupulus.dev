<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://www.linkedin.com/in/raulcaropastorino'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a Linkedin'
    },
    decored: {
        type: Boolean,
        required: false,
        default: false,
    }
})
</script>

<template>
    <IconsGenericSocial v-if="decored" :url="url" :title="title" :size="size" color="#0276b7">
        <NuxtImg format="webp" quality="80" src="/icons/linkedin.svg" width="32" style="width: 100%;"
            alt="Logo de Linkedin" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#0276b7">
        <NuxtImg format="webp" quality="80" src="/icons/linkedin.svg" width="24" style="width: 100%;"
            alt="Logo de Linkedin" />
    </IconsGeneric>
</template>
