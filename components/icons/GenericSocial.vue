<script setup lang="ts">
    interface Props {
        url?: string | null;
        display?: string;
        title?: string;
        grayscale?: boolean;
        size?: string | number;
        color?: string;
    }

    const props = withDefaults(defineProps<Props>(), {
        url: null,
        display: 'inline-flex',
        title: 'Enlace',
        grayscale: false,
        size: '24px',
        color: '#2a64a3',
    });

    const computedSize = computed(() => {
        if (typeof props.size === 'number') {
            return `${props.size}px`;
        }
        return props.size || '24px';
    });
</script>

<template>
    <a
        v-if="url"
        :href="url"
        :title="title"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="title"
        class="box-icon"
        :class="{ 'icon-grayscale': grayscale }"
    >
        <span class="box-icon-inner">
            <slot />
        </span>
    </a>

    <span v-else class="box-icon" :title="title" :class="{ 'icon-grayscale': grayscale }">
        <span class="box-icon-inner">
            <slot />
        </span>
    </span>
</template>

<style scoped>
    .box-icon {
        --icon-size: v-bind(computedSize);
        display: v-bind(display);
        align-items: center;
        justify-content: center;
        margin: 0;
        width: var(--icon-size);
        height: var(--icon-size);
        padding: calc(var(--icon-size) * 0.12);
        background-color: v-bind(color);
        border-radius: 24%;
        box-sizing: border-box;
        box-shadow:
            0 8px 18px -2px rgba(0, 0, 0, 0.4),
            0 4px 8px -2px rgba(0, 0, 0, 0.2);
        text-decoration: none;
        cursor: pointer;
        flex-shrink: 0;
        transition:
            transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .box-icon:hover {
        transform: translateY(-4px) scale(1.05);
        box-shadow:
            0 14px 24px -2px rgba(0, 0, 0, 0.55),
            0 6px 12px -2px rgba(0, 0, 0, 0.3);
    }

    .box-icon:focus-visible {
        outline: 2px solid var(--color-primary, #a3c9ff);
        outline-offset: 4px;
    }

    .box-icon:active {
        transform: translateY(-1px) scale(0.98);
    }

    .box-icon-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: calc(var(--icon-size) * 0.14);
        background-color: #ffffff;
        border-radius: 25%;
        box-sizing: border-box;
        box-shadow:
            inset 0 1px 2px rgba(0, 0, 0, 0.08),
            0 2px 4px rgba(0, 0, 0, 0.2);
        transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .box-icon:hover .box-icon-inner {
        transform: scale(1.04);
    }

    .box-icon-inner :deep(img),
    .box-icon-inner :deep(svg),
    .box-icon-inner :deep(picture) {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
        margin: auto;
    }

    .icon-grayscale {
        filter: grayscale(80%);
    }

    .icon-grayscale:hover {
        filter: grayscale(0%);
    }
</style>
