
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
        },
        class: {
            type: String,
            required: false,
            default: ''
        }
    },
    setup(props) {
        //const baseClass = 'btn';
        //const defaultClass = 'btn-generic';
        //const selectedClass = 'btn-generic-selected';

        return {
            allClass: 'btn ' + (props.selected ? 'btn-generic-selected' : 'btn-generic'),

            //allClass: 'btn ' + (props.selected ? 'btn-generic-selected' : (props.class ?? ''))
        }
    }
})
</script>

<template>
    <span v-if="to">
        <NuxtLink :to="to">
            <span :class="allClass">
                <span>
                    {{ text }}
                </span>
            </span>
        </NuxtLink>
    </span>

    <span v-else-if="typeof callback === 'function'" @click="callback" :class="allClass">
        <span>
            {{ text }}
        </span>
    </span>

    <span v-else :class="allClass">
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
    margin: 5px 7px;
    padding: 10px;
    text-align: center;
    font-family: 'Open Sans', sans-serif;
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
