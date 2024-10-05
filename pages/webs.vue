<script setup lang="ts">
const config = useRuntimeConfig();

const url = config.public.app.url;
const title = 'Sitios webs creados por Raúl Caro Pastorino | Desarrollador Web Full Stack Backend';
const description = 'Descubre los sitios web que he creado y publicado como desarrollador web full stack. Explora mis proyectos más destacados, cada uno diseñado y desarrollado con las mejores prácticas en desarrollo backend y frontend.';
const keywords = 'sitios web, proyectos, Raúl Caro Pastorino, desarrollador web, full stack, backend, frontend, diseño web, desarrollo web, portafolio';

useHead({
    title: title,
    meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url + '/social' },
        { property: 'og:image', content: url + '/social/webs.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: url + '/social/webs.webp' }
    ]
});

const webs = [
    {
        title: 'AI Dyslexic',
        image: '/images/icons/webs/aidyslexic.webp',
        description: 'Proyecto que crea una "idea" en base a un sistema de roles usando AI para generar un prompt que produzca imágenes mediante Stable Diffusion o Dall-e. Subo imágenes a una API como galería y publica en redes (Twitter, Instagram, Mastodon, Telegram). Crea un slideshow con ffmpeg y subirlo a TikTok y YouTube, sincronizando con la API para establecer el video como portada de la colección.',
        url: 'https://aidyslexic.raupulus.dev',
    },
    {
        title: 'Portfolio Web Personal',
        image: '/logo_128x128.webp',
        description: 'Esta es mi web personal, donde comparto mis proyectos y experiencia.',
        url: 'https://raupulus.dev',
    },
    {
        title: 'Api Personal (Para debug y desarrollo iot)',
        image: '/images/icons/world.svg',
        description: 'Esta es mi Api personal, donde subo los desarrollos que voy haciendo y los comparto con el mundo además de revisar que todo funciona correctamente con el tiempo.',
        url: 'https://api.fryntiz.dev',
    },
    {
        title: 'Micro-Blog Personal',
        image: '/images/icons/webs/blog_personal.svg',
        description: 'En este sitio encontrarás mi micro-blog personal, donde escribo sobre lo que voy aprendiendo y resumo las cosas que voy realizando.',
        url: 'https://microblog.fryntiz.dev/',
    },
    {
        title: 'La Guía Linux',
        image: '/images/icons/webs/laguialinux.webp',
        description: 'Web para mi proyecto de software libre, donde comparto información sobre GNU/Linux y software libre.',
        url: 'https://laguialinux.es/',
    },
];
</script>

<template>
    <section>
        <div class="text-center">
            <h1>
                Mis

                <span class="text-primary font-bold">
                    Sitios Webs
                </span>
            </h1>
        </div>

        <div v-for="web in webs" class="box-service">
            <div class="box-image">
                <NuxtImg :src="web.image" />
            </div>

            <div>
                <h3 class="title">{{ web.title }}</h3>
                <p>{{ web.description }}</p>
            </div>

            <div class="box-btns">
                <BtnGeneric text="Ir" :title="web.title" :to="web.url" width="50px" />
            </div>

        </div>
    </section>
</template>


<style scoped>
.box-group-title {
    width: 70%;
    text-align: right;
    padding: 0.3rem 3rem;
    background-color: red;
    border-radius: 0 1.3rem 1.3rem 0;
    background-color: var(--primary);
    color: var(--white);
}

.box-service {
    display: grid;
    max-width: 80%;
    margin: 3rem auto;
    grid-template-columns: auto 1fr auto;
    gap: 5px;
    color: var(--black);
    padding: 10px;
    border-radius: 8px;
    background-color: #E6E6E6;
    align-items: center;
}

.box-image {
    margin: auto;
    padding: 0.3rem;
    width: 120px;
    text-align: center;
    box-sizing: border-box;
}

.box-image img {
    width: 100%;
}

.box-btns {
    text-align: center;
}

@media (max-width: 600px) {
    .box-service {
        display: grid;
        max-width: 90%;
        grid-template-columns: 1fr;
        gap: 0;
        padding: 5px;
        border-radius: 8px;
    }

    .title {
        text-align: center;
    }

    .box-btns {
        text-align: center;
    }
}
</style>
