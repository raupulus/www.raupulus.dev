<script setup>
const props = defineProps({
    tag: {
        type: String,
        default: ''
    },
    background: {
        type: String,
        default: '#a3a3a3'
    },
    image: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <div class="box" :style="'background-color: ' + background + ';'">
        <div class="top">
            <slot />
        </div>

        <div class="bottom">
            <div class="tag">{{ tag }}</div>

            <span class="title">
                {{ title }}
            </span>

            <span class="description">
                {{ description }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.box {
    display: inline-block;
    margin: 10px;
    /** LO ANTERIOR PASAR A GRID **/
    width: 300px;
    height: 700px;
    background-color: rgb(0, 93, 181);
    border-radius: 10px;
    overflow: hidden;
}

@media (max-width: 671px) {
    .box {
        width: 90%;
    }
}

.top {
    display: grid;
    place-items: center;
    width: 100%;
    height: 55%;
    padding: 10px;
    border-radius: 10px 10px 0 0;
}

.bottom {
    width: 100%;
    height: 45%;
    color: var(--white);
    background-color: rgba(0, 0, 0, 0.5);
    text-align: left;
}

.tag {
    position: absolute;
    translate: 0 -50%;
    margin-left: 25px;
    width: 128px;
    padding: 5px;
    color: var(--primary);
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    background-color: var(--gray);
    border-radius: 25px;
    z-index: 1;
}

.title {
    display: block;
    padding: 25px 15px 5px 15px;
    font-size: 2.5rem;
    font-weight: bold;
    margin: 10px 0;
}

.description {
    display: block;
    padding: 10px 15px 5px 15px;
    font-size: 1.4rem;
    font-weight: 400;
    margin: 10px 0;
}
</style>
