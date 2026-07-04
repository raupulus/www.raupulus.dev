<script setup lang="ts">
const config = useRuntimeConfig()
const url = config.public.app.url
const title = 'Sitios webs creados por Raúl Caro Pastorino | Desarrollador Web Full Stack Backend'
const description = 'Descubre los sitios web que he creado y publicado como desarrollador web full stack. Explora mis proyectos más destacados, cada uno diseñado y desarrollado con las mejores prácticas en desarrollo backend y frontend.'
const keywords = 'sitios web, proyectos, Raúl Caro Pastorino, desarrollador web, full stack, backend, frontend, diseño web, desarrollo web, portafolio'

useHead({
    title: title,
    meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url + '/webs' },
        { property: 'og:image', content: url + '/social/webs.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: url + '/social/webs.webp' }
    ]
})

// Sitios web publicados
const webs = [
    {
        title: 'Jaja Project',
        image: '/images/icons/webs/jajaproject.webp',
        description: 'Plataforma web comunitaria dónde puedes compartir tus chistes, adivinanzas y preguntas quiz para consumirla mediante api de comunidad',
        url: 'https://jaja.raupulus.dev',
        tags: ['Vue.js', 'Laravel', 'API'],
    },
    {
        title: 'Api Personal (Para debug y desarrollo iot)',
        image: '/images/icons/world.svg',
        description: 'Esta es mi Api personal, donde subo los desarrollos que voy haciendo y los comparto con el mundo además de revisar que todo funciona correctamente con el tiempo.',
        url: 'https://api.raupulus.dev',
        tags: ['Laravel', 'REST API', 'IoT'],
    },
    {
        title: 'Micro-Blog Personal',
        image: '/images/icons/webs/blog_personal.svg',
        description: 'En este sitio encontrarás mi micro-blog personal, donde escribo sobre lo que voy aprendiendo y resumo las cosas que voy realizando.',
        url: 'https://microblog.fryntiz.dev/',
        tags: ['Blog', 'Personal'],
    },
    {
        title: 'La Guía Linux',
        image: '/images/icons/webs/laguialinux.webp',
        description: 'Web para mi proyecto de software libre, donde comparto información sobre GNU/Linux y software libre.',
        url: 'https://laguialinux.es/',
        tags: ['GNU/Linux', 'Open Source', 'Documentación'],
    },
    {
        title: 'AI Dyslexic',
        image: '/images/icons/webs/aidyslexic.webp',
        description: 'Proyecto que crea una "idea" en base a un sistema de roles usando AI para generar un prompt que produzca imágenes mediante Stable Diffusion o Dall-e. Subo imágenes a una API como galería y publica en redes (Twitter, Instagram, Mastodon, Telegram). Crea un slideshow con ffmpeg y subirlo a TikTok y YouTube, sincronizando con la API para establecer el video como portada de la colección.',
        url: 'https://aidyslexic.raupulus.dev',
        tags: ['AI', 'Python', 'Automatización'],
    },
    {
        title: 'Portfolio Web Personal',
        image: '/logo_128x128.webp',
        description: 'Esta es mi web personal, donde comparto mis proyectos y experiencia.',
        url: 'https://raupulus.dev',
        tags: ['Nuxt.js', 'Vue.js', 'Portfolio'],
    },
]
</script>

<template>
    <div class="min-h-screen bg-background circuit-pattern">

        <!-- Cabecera -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <span class="font-label text-secondary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                <span class="w-8 h-[1px] bg-secondary"/>
                Sitios Publicados
            </span>
            <h1 class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6 max-w-4xl">
                Mis <span class="text-on-surface-variant font-light">Sitios Webs</span>
            </h1>
            <p class="text-on-surface-variant text-lg max-w-2xl border-l-2 border-secondary pl-6 py-2">
                {{ description }}
            </p>
        </div>

        <!-- Grid de webs -->
        <section class="px-8 pb-24 max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <a
                    v-for="web in webs"
                    :key="web.title"
                    :href="web.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex flex-col bg-surface-container-high rounded-xl border border-outline-variant/20 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
                >
                    <!-- Imagen / logo -->
                    <div class="relative h-48 bg-surface-container-lowest flex items-center justify-center overflow-hidden border-b border-outline-variant/10">
                        <NuxtImg
                            :src="web.image"
                            :alt="web.title"
                            :title="web.title"
                            width="120"
                            height="120"
                            class="w-24 h-24 object-contain transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        <!-- Indicador de enlace externo -->
                        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <UiMaterialIcon class="text-primary text-sm" name="north_east" />
                        </div>
                    </div>

                    <!-- Contenido -->
                    <div class="flex flex-col flex-1 p-6">
                        <h2 class="font-headline text-lg font-bold mb-3 text-on-surface group-hover:text-primary transition-colors">
                            {{ web.title }}
                        </h2>
                        <p class="text-sm text-on-surface-variant leading-relaxed flex-1 mb-4">
                            {{ web.description }}
                        </p>

                        <!-- Tags -->
                        <div v-if="web.tags" class="flex flex-wrap gap-2 mb-4">
                            <span
                                v-for="tag in web.tags"
                                :key="tag"
                                class="px-2 py-0.5 bg-surface-container-lowest text-outline text-[10px] font-label uppercase tracking-wider rounded border border-outline-variant/20"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <!-- URL -->
                        <div class="flex items-center gap-2 pt-4 border-t border-outline-variant/10">
                            <UiMaterialIcon class="text-tertiary text-sm" name="link" />
                            <span class="font-label text-xs text-outline truncate">{{ web.url }}</span>
                        </div>
                    </div>
                </a>
            </div>
        </section>
    </div>
</template>
