<template>
    <div :id="list.id" class="my-4 w-full">
        <ContentBlocksBlockListItems
            :items="items"
            :list-style="list.data.style"
            :counter-type="list.data.meta?.counterType"
            :start="list.data.meta?.start"
        />
    </div>
</template>

<script lang="ts" setup>
    import type { BlockListType, BlockType } from '@/types/BlocksType';

    const props = defineProps({
        block: {
            type: Object as PropType<BlockType>,
            required: true,
        },
    });

    const list = props.block as BlockListType;

    // Admite el formato antiguo (textos) y el de @editorjs/list 2.x (anidado)
    const items = normalizeListItems(list.data.items);
</script>
