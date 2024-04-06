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
    decored: {
        type: Boolean,
        required: false,
        default: false,
    }
})
</script>

<template>
    <IconsGenericSocial v-if="decored" :url="url" :title="title" :size="size" color="#9147ff">
        <NuxtImg format="webp" quality="80" src="/icons/twitch.svg" width="32" style="width: 100%;" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#9147ff">
        <NuxtImg format="webp" quality="80" src="/icons/twitch.svg" width="24" style="width: 100%;" />
    </IconsGeneric>
</template>
