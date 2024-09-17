<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: 'https://t.me/raupulus_diffusion'
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace a Telegram'
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
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#3272b8">
        <img src="@/public/images/icons/telegram.svg" width="24" style="width: 100%;"
            alt="Logo de Youtube" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#3272b8">
        <NuxtImg src="/images/icons/telegram.svg" width="32" style="width: 100%;"
            alt="Logo de Telegram" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#3272b8">
        <NuxtImg src="/images/icons/telegram.svg" width="24" style="width: 100%;"
            alt="Logo de Telegram" />
    </IconsGeneric>
</template>
