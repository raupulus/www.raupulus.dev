
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
        },
        menu: {
            type: Boolean,
            required: false,
            default: false
        },
        width: {
            type: String,
            required: false,
            default: 'auto'
        }
    },
    setup(props) {
        const customClass = props.class ?? 'btn-generic';

        return {
            allClass: 'btn ' + customClass + (props.menu ? ' btn-menu' : ''),
        }
    }
})
</script>

<template>
    <span v-if="to" class="box-button">
        <NuxtLink :to="to">
            <span :class="allClass">
                <span>
                    {{ text }}
                </span>
            </span>
        </NuxtLink>
    </span>

    <span v-else-if="typeof callback === 'function'" @click="callback" :class="allClass" class="box-button">
        <span>
            {{ text }}
        </span>
    </span>

    <span v-else :class="allClass" class="box-button">
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
    width: v-bind(width);
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

.router-link-active .btn {
    cursor: not-allowed;
}

.router-link-active .btn-menu {
    background-color: var(--warning);
    color: var(--white);
}
</style>
