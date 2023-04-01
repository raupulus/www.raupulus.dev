import { Title, componentNames } from '../../.nuxt/components';
<script setup>
const props = defineProps({

    /** TODO: Una vez terminada la api, crear tipo **/

    data: {
        //type: Object,
        required: true
    },
});

const componentNames = {
    gitlab: 'IconsGitlab',
}
</script>

<template>
    <div class="box-project">
        <div class="box-card">
            <div class="box-img">
                <img :src="data.image" :alt="data.title">
                {{ data.image }}
            </div>

            <div class="box-title">
                <span class="title">
                    {{ data.title }}
                </span>
            </div>

            <div class="box-description">
                {{ data.description }}
            </div>
        </div>

        <span class="separator"></span>

        <div v-if="data.links && Array.isArray(data.links)" class="box-links">
            <div v-for="link, id in data.links" :class="(id > 0 && (id) < data.links.length) ? 'link-margin' : ''">
                <div>{{ link.icon }} - {{ id }}s</div>
                <div>{{ link.url }}</div>
                <div>{{ componentNames[link.icon] }}</div>
                <component :is="componentNames[link.icon]" />

            </div>
        </div>
    </div>
</template>


<style scoped>
.box-project {
    margin: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    background-color: var(--gray);
    border-radius: 0 0 16px 16px;
}

.box-card {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.box-img {
    width: 100%;
    height: 280px;
    background-color: var(--gray);
    overflow: hidden;
}

.box-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.box-title {
    padding: 10px 0;
    background-color: var(--primary);
}

.title {
    display: block;
    text-align: center;
    color: var(--white);
    font-weight: bold;
    font-size: 1.3rem;
    text-transform: capitalize;
}

.box-description {
    padding: 10px;
    height: 100%;
    min-height: 180px;
}

.separator {
    display: block;
    width: 100%;
    height: 3px;
    background-color: var(--white);
}

.box-links {
    display: grid;
    margin: 5px 0;
    padding: 10px 5px;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    grid-gap: 0 5px;
    align-items: center;
    text-align: center;
}

.link-margin {
    border-left: 3px solid var(--darkgrey);
}
</style>
