<script lang="ts" setup>
import type { ContentType } from '@/types/ContentType';

const props = defineProps({
  data: {
    type: Object as PropType<ContentType>,
    required: true
  },
});

const emit = defineEmits(['projecteventshow']);

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

const currentImgSrc = ref(props.data.urlImageSmall);

const onImageLoaded = () => {
  currentImgSrc.value = props.data.urlImage;
};

</script>

<template>
  <div class="card-project-box">
    <div class="card-project-content">
      <div class="card-project-img">
        <NuxtImg :src="currentImgSrc" width="440" height="300" :alt="data.title" :title="data.title"
          @click="emit('projecteventshow', data)" @load="onImageLoaded" />
      </div>

      <div class="card-project-info">
        <div class="card-project-date" v-if="data.created_at_human">{{ data.created_at_human }}</div>

        <h3 class="card-project-title">{{ data.title }}</h3>

        <div class="card-project-description">
          <p>
            {{ data.excerpt }}
          </p>
        </div>

        <div class="card-project-readmore">
          <span @click="emit('projecteventshow', data)">
            Ver Proyecto
          </span>
        </div>
      </div>

      <!-- Tecnologías -->
      <div class="card-project-box-technologies">
        <img v-for="technology in data.technologies" :src="technology.urlImageSmall" :title="technology.name"
          :alt="technology.name">
      </div>
    </div>

    <div class="card-project-footer" v-if="data.metadata">
      <div v-for="key, idx in Object.keys(data.metadata)"
        :class="(idx > 0 && (idx) < Object.keys(data.metadata).length) ? 'link-margin' : ''">

        <IconsYoutube v-if="key === 'youtube'" :margin="0" :url="data.metadata.youtube" :grayscale="true"
          display="block" :legacy="true" />
        <IconsEarth v-if="key === 'web'" :margin="0" :url="data.metadata.web" :grayscale="true" display="block"
          :legacy="true" />
        <IconsTwitter v-if="key === 'twitter'" :margin="0" :url="data.metadata.twitter" :grayscale="true"
          display="block" :legacy="true" />

        <IconsGitlab v-if="key === 'gitlab'" :margin="0" :url="data.metadata.gitlab" :grayscale="true" display="block"
          :legacy="true" />

        <IconsTelegram v-if="key === 'telegram_channel'" :margin="0" :url="data.metadata.telegram_channel"
          :grayscale="true" display="block" :legacy="true" />

        <IconsGithub v-if="key === 'github'" :margin="0" :url="data.metadata.github" :grayscale="true" display="block"
          :legacy="true" />

        <IconsLinkedin v-if="key === 'linkedin'" :margin="0" :url="data.metadata.linkedin" :grayscale="true"
          display="block" :legacy="true" />

        <IconsMastodon v-if="key === 'mastodon'" :margin="0" :url="data.metadata.mastodon" :grayscale="true"
          display="block" :legacy="true" />

        <IconsTwitch v-if="key === 'twitch'" :margin="0" :url="data.metadata.twitch" :grayscale="true" display="block"
          :legacy="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-project-box {
  margin-top: 3.9rem;
  padding-left: 0;
  font-family: sans-serif;
}

.card-project-content {
  position: relative;
  display: grid;
  padding: 1.3rem 2.6rem;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  background-color: #dedede;
  align-items: center;
  border-radius: 0.6rem 0.6rem 0 0;
}

.card-project-img {
  margin: auto;
  margin-bottom: -40px !important;
  width: 90%;
  height: 300px;
  translate: 0 -78px;
  border-radius: 8px;
  box-shadow: 3px 3px 3px rgba(52, 58, 64, 0.6);
  overflow: hidden;
  transition-duration: 1s;
  transition-property: transform;
}

.card-project-img:hover {
  transform: scale(1.05) rotate(1.5deg);
}

.card-project-img img {
  width: 100%;
  height: 100%;
  transition-duration: 1s;
  transition-property: filter;
  object-fit: cover;
}

.card-project-img img:hover {
  cursor: pointer;
  transform: scale(1.1) rotate(-1deg);
  filter: blur(1px);
}

.card-project-date {
  font-size: 0.9rem;
  font-weight: lighter;
  font-style: italic;
  color: rgba(52, 58, 64, 0.4);
}

.card-project-title {
  margin: 0.3rem 0;
  font-size: 1.3rem;
  font-weight: bold;
  color: #3272b8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.card-project-description {
  margin: 0;
  display: -webkit-box;
  color: #585c60;
  -webkit-box-orient: vertical;
  line-clamp: 4;
  -webkit-line-clamp: 4;
  overflow: hidden;
}

.card-project-readmore {
  cursor: pointer;
  padding: 1.6rem;
  text-align: center;
}

.card-project-readmore a,
.card-project-readmore span {
  display: inline-block;
  text-decoration: none;
  color: #f3f3f3;
  padding: 0.6rem 1rem;
  background-color: #3272b8;
  border-radius: 6px;
  box-shadow: 1px 1px 3px rgba(52, 58, 64, 0.6);
}

.card-project-readmore a:hover,
.card-project-readmore span:hover {
  color: #e6e5e5;
  background-color: #2a64a3;
  box-shadow: 1px 1px 1px #343a4033;
}

.card-project-footer {
  display: grid;
  margin: 3px auto;
  padding: 0.6rem 2.6rem;
  min-height: 28px;
  grid-gap: 0 5px;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  text-align: center;
  background-color: #bcbdbe;
  border-radius: 0 0 1rem 1rem;
}

.card-project-footer>div:not(:first-child) {
  border-left: 1px solid #d0d3d699;
}

.card-project-footer a {
  text-decoration: none;
}



.card-project-box-technologies {
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  right: 8px;
  z-index: 10;
}

.card-project-box-technologies svg,
.card-project-box-technologies img {
  display: inline-block;
  margin: 0 3px;
  width: 25px;
  height: 25px;
}

/* Versión responsive */

@media (max-width: 500px) {
  .card-project-content {
    display: grid;
    padding: 1.3rem 1.6rem;
  }

  .card-project-img {
    margin-bottom: -30px !important;
    width: 100%;
    height: 220px;
    translate: 0 -45px;
  }

  .card-project-footer {
    padding: 0.6rem 1.8rem;
  }

  .card-project-box-technologies {
    display: block;
    width: 100%;
    text-align: right;
    translate: 0 -10px;
    bottom: 0;
  }
}
</style>
