<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: null
    },
    margin: {
        type: Number || String,
        required: false,
        default: 5
    },
    display: {
        type: String,
        required: false,
        default: 'inline-block'
    },
    title: {
        type: String,
        required: false,
        default: 'Enlace'
    }
})
</script>

<template>
    <span class="box-icon">
        <a v-if="url" :href="url" target="_blank">
            <slot />
        </a>

        <slot v-else />
    </span>
</template>

<style scoped>
.box-icon {
    display: v-bind(display);
    margin: v-bind(margin);
}
</style>
