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
    },
    grayscale: {
        type: Boolean,
        required: false,
        default: false,
    }
})
</script>

<template>
    <span class="box-icon">
        <a v-if="url" :href="url" :title="title" target="_blank" :class="grayscale ? 'icon-grayscale' : ''">
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

.icon-grayscale {
    filter: grayscale(80%);
}

.icon-grayscale:hover {
    filter: grayscale(10%);
    fill: #2a64a3;
    transform: scale(1.1);
}
</style>
