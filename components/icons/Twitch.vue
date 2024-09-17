<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://www.twitch.tv/raupulus'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a Twitch'
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
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#9147ff">
        <img src="@/public/images/icons/twitch.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#9147ff">
        <NuxtImg src="/images/icons/twitch.svg" width="32" style="width: 100%;"
            alt="Logo de Twitch" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#9147ff">
        <NuxtImg src="/images/icons/twitch.svg" width="24" style="width: 100%;"
            alt="Logo de Twitch" />
    </IconsGeneric>
</template>
