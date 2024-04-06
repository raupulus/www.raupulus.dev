<script setup>
const props = defineProps({
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
        default: "24px",
    },
    color: {
        type: String,
        required: false,
        default: '#2a64a3'
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
    margin: 0;
    width: v-bind(size);
    height: v-bind(size);
    padding: 17%;
    background-color: v-bind(color);
    border-radius: 17%;
    box-sizing: border-box;
    box-shadow: 9px 9px 8px 2px rgba(0, 0, 0, 0.4);
}

.box-icon>a {
    display: block;
    width: 100%;
    height: 100%;
    padding: 20%;
    background-color: #f3f3f3;
    border-radius: 25%;
    box-sizing: border-box;
    box-shadow: 8px 8px 8px 2px rgba(0, 0, 0, 0.25);
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
