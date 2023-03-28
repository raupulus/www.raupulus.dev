
<script>
export default defineComponent({
    props: {
        text: {
            type: String,
            default: 'Generic Button'
        },
        to: {
            type: String,
            required: false,
            default: null
        },

        selected: {
            type: Boolean,
            default: false
        },

        callback: {
            type: Function,
            required: false,
            default: null
        }
    },
    setup(props) {
        console.log(props.text, props.to, props.callback);
    }
})
</script>

<template>
    <span v-if="to">
        <NuxtLink :to="to">
            <span class="btn" :class="selected ? 'btn-generic-selected' : 'btn-generic'">
                <span>
                    {{ text }}
                </span>
            </span>
        </NuxtLink>
    </span>

    <span v-else-if="typeof callback === 'function'" @click="callback" class="btn"
        :class="selected ? 'btn-generic-selected' : 'btn-generic'">
        <span>
            {{ text }}
        </span>
    </span>

    <span v-else class="btn" :class="selected ? 'btn-generic-selected' : 'btn-generic'">
        <span>
            {{ text }}
        </span>
    </span>
</template>

<style lang="css" scoped>
/*
TODOS!!!!
- Agregar tipografía Open Sans
- Implementar recibir js lambda para evento click o url
*/

.btn {
    display: inline-block;
    margin: 10px;
    padding: 10px;
    text-align: center;
    /* font-family: 'Open Sans', sans-serif; */
    border-radius: 8px;
}

.btn:hover {
    cursor: pointer;
}

.btn:active {
    cursor: pointer;
    background-color: var(--white);
    color: var(--primary);
}

.btn-generic {
    background-color: var(--primary);
    color: var(--white);
}

.btn-generic-selected {
    background-color: var(--warning);
    color: var(--white);
}
</style>
