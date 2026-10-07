<script setup lang="ts">
    interface Props {
        url?: string;
        size?: string | number;
        title?: string;
        legacy?: boolean;
        decored?: boolean;
    }

    withDefaults(defineProps<Props>(), {
        url: 'https://www.linkedin.com/in/raulcaropastorino',
        size: '24px',
        title: 'Enlace a Linkedin',
        legacy: false,
        decored: false,
    });
</script>

<template>
    <IconsGeneric v-if="legacy" :url="url" :title="title" :size="size" color="#0276b7">
        <img src="@/public/images/icons/linkedin.svg" width="24" style="width: 100%" alt="Logo de Linkedin" />
    </IconsGeneric>

    <IconsGenericSocial v-else-if="decored" :url="url" :title="title" :size="size" color="#0276b7">
        <NuxtImg src="/images/icons/linkedin.svg" width="32" style="width: 100%" alt="Logo de Linkedin" />
    </IconsGenericSocial>

    <IconsGeneric v-else :url="url" :title="title" :size="size" color="#0276b7">
        <NuxtImg src="/images/icons/linkedin.svg" width="24" style="width: 100%" alt="Logo de Linkedin" />
    </IconsGeneric>
</template>
