<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true,
        default: ''
    },
    description: {
        type: String,
        required: true,
        default: ''
    }
})
</script>

<template>
    <div class="box">
        <div class="box-img">
            <slot />
        </div>

        <div class="box-title">
            {{ title }}
        </div>

        <div class="box-description">
            {{ description }}
        </div>
    </div>
</template>

<style scoped>
.box {
    display: inline-block;
    margin: 20px;
    width: 310px;
    height: 250px;
    background-color: var(--gray);
    border-radius: 16px;
    box-sizing: border-box;
}

.box-img {
    margin: 45px auto 10px auto;
    padding: 6px;
    width: 56px;
    height: 56px;
    color: var(--white);
    background-color: var(--primary);
    border-radius: 50%;
    overflow: hidden;
    box-sizing: border-box;
}

.box-img img,
.box-img svg {
    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;
}


.box-title {
    font-size: 1.3rem;
    font-weight: bold;
    margin: 10px 5px;
    color: #434343;
}

.box-description {
    font-size: 1rem;
    color: #645757;
    margin: 10px 9px;
}
</style>
