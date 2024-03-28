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
    github: 'IconsGithub',
    linkedin: 'IconsLinkedin',
    twitter: 'IconsTwitter',
    mastodon: 'IconsMastodon',
    twitch: 'IconsTwitch',
    youtube: 'IconsYoutube',
    web: 'IconsEarth',
    telegram: 'IconsTelegram',
}
</script>

<template>
    <div class="box-project">
        <div class="box-card">
            <div class="box-img">
                <img :src="data.urlImageMedium" :alt="data.title" />
                {{ data.urlImageMedium }}
            </div>

            <div class="box-title">
                <span class="title">
                    {{ data.title }}
                </span>
            </div>

            <div class="box-description">
                {{ data.excerpt }}
            </div>
        </div>

        <span class="separator"></span>

        <div v-if="data.metadata" class="box-links">
            <div v-for="key, idx in Object.keys(data.metadata)"
                :class="(idx > 0 && (idx) < Object.keys(data.metadata).length) ? 'link-margin' : ''">

                <IconsYoutube v-if="key === 'youtube'" :margin="0" :url="data.metadata.youtube" display="block" />
                <IconsEarth v-if="key === 'web'" :margin="0" :url="data.metadata.web" display="block" />
                <IconsTwitter v-if="key === 'twitter'" :margin="0" :url="data.metadata.twitter" display="block" />

                <IconsGitlab v-if="key === 'gitlab'" :margin="0" :url="data.metadata.gitlab" display="block" />

                <IconsTelegram v-if="key === 'telegram_channel'" :margin="0" :url="data.metadata.telegram_channel"
                    display="block" />

                <IconsGithub v-if="key === 'github'" :margin="0" :url="data.metadata.github" display="block" />

                <IconsLinkedin v-if="key === 'linkedin'" :margin="0" :url="data.metadata.linkedin" display="block" />

                <IconsMastodon v-if="key === 'mastodon'" :margin="0" :url="data.metadata.mastodon" display="block" />

                <IconsTwitch v-if="key === 'twitch'" :margin="0" :url="data.metadata.twitch" display="block" />
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
