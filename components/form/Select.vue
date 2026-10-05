<script setup lang="ts">
    import type { PropType } from 'vue';

    defineProps({
        name: {
            type: String,
            required: true,
        },
        datas: {
            type: Array as PropType<Array<{ slug: string; name: string }>>,
            required: true,
        },
        callback: {
            type: Function as PropType<(val: string) => void>,
            required: false,
            default: undefined,
        },
    });
</script>

<template>
    <div class="form-select">
        <select :name="name">
            <option v-for="(ele, key) in datas" :key="key" :value="ele.slug">
                {{ ele.name }}
            </option>
        </select>
    </div>
</template>

<style scoped>
    .form-select > select {
        margin: 0 auto 35px auto;
        width: 200px;
        padding: 0 10px;
        cursor: pointer;
        font-size: 1rem;
        color: var(--black);
        background-color: var(--yellow);
        border: none;
        border-radius: 50px;
    }
</style>
