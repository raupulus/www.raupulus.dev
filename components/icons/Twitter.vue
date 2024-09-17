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
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#00ACEE">
        <img src="@/public/images/icons/twitter.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#00ACEE">
        <NuxtImg src="/images/icons/twitter.svg" width="32" style="width: 100%;"
            alt="Logo de Twitter" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#00ACEE">
        <NuxtImg src="/images/icons/twitter.svg" width="24" style="width: 100%;"
            alt="Logo de Twitter" />
    </IconsGeneric>
</template>
