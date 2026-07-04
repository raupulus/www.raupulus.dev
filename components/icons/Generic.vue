<script setup>
defineProps({
    url: {
        type: String,
        required: false,
        default: null
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
    },
    size: {
        type: String,
        required: false,
        default: "24px"
    }
})
</script>

<template>
    <span class="box-icon">
        <a v-if="url" :href="url" :title="title" target="_blank" rel="noopener noreferrer" :aria-label="title" :class="grayscale ? 'icon-grayscale' : ''">
            <slot />
        </a>

        <slot v-else />
    </span>
</template>

<style scoped>
.box-icon {
    display: v-bind(display);
    margin: auto;
    width: v-bind(size);
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
