<script setup lang="ts">
    interface Props {
        url?: string | null;
        display?: string;
        title?: string;
        grayscale?: boolean;
        size?: string | number;
    }

    const props = withDefaults(defineProps<Props>(), {
        url: null,
        display: 'inline-block',
        title: 'Enlace',
        grayscale: false,
        size: '24px',
    });

    const computedSize = computed(() => {
        if (typeof props.size === 'number') {
            return `${props.size}px`;
        }
        return props.size || '24px';
    });
</script>

<template>
    <span class="box-icon">
        <a
            v-if="url"
            :href="url"
            :title="title"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="title"
            :class="{ 'icon-grayscale': grayscale }"
        >
            <slot />
        </a>

        <slot v-else />
    </span>
</template>

<style scoped>
    .box-icon {
        display: v-bind(display);
        margin: auto;
        width: v-bind(computedSize);
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
