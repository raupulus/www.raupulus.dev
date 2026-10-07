<template>
    <div :id="delimiter.id" class="my-10 w-full flex items-center justify-center gap-4" role="separator">
        <span class="w-16 h-[1px] bg-gradient-to-r from-transparent to-outline-variant/40" />
        <span class="w-1.5 h-1.5 rounded-full bg-secondary/60" />
        <span class="w-2.5 h-2.5 rounded-full bg-primary/70" />
        <span class="w-1.5 h-1.5 rounded-full bg-secondary/60" />
        <span class="w-16 h-[1px] bg-gradient-to-l from-transparent to-outline-variant/40" />
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';
    import type { BlockDelimiterType, BlockType } from '@/types/BlocksType';

    const props = defineProps({
        block: {
            type: Object as PropType<BlockType>,
            required: true,
        },
    });

    const delimiter = computed(() => props.block as BlockDelimiterType);
</script>
