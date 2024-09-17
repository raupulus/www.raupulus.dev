<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://mastodon.online/@raupulus'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a Mastodon'
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
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#6b21a8">
        <img src="@/public/images/icons/mastodon.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#6b21a8">
        <NuxtImg src="/images/icons/mastodon.svg" width="32" style="width: 100%;"
            alt="Logo de Mastodon" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#6b21a8">
        <NuxtImg src="/images/icons/mastodon.svg" width="24" style="width: 100%;"
            alt="Logo de Mastodon" />
    </IconsGeneric>
</template>
