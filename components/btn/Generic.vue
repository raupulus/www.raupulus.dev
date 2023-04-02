
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
            default: null
        }
    },
    setup(props) {
        //const baseClass = 'btn';
        //const defaultClass = 'btn-generic';
        const selectedClass = props.selected ? 'btn-generic-selected' : null;
        const customClass = props.class ?? selectedClass ?? 'btn-generic';

        return {
            allClass: 'btn ' + customClass,

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
.btn {
    display: inline-block;
    margin: 5px 7px;
    padding: 10px;
    text-align: center;
    /*font-family: 'Open Sans', sans-serif;*/
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
