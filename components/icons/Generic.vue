<script setup>
const props = defineProps({
    url: {
        type: String,
        required: false,
        default: null
    },
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
    display: inline-block;
    margin: 5px;
}
</style>
