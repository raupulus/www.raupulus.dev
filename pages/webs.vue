<script setup lang="ts">
    const config = useRuntimeConfig();
    const url = config.public.app.url;
    const title = 'Sitios web creados por Raúl Caro Pastorino | Desarrollador Web';
    const description =
        'Descubre los sitios web que he creado y publicado como desarrollador web. Explora mis proyectos más destacados, cada uno diseñado y desarrollado con las mejores prácticas en desarrollo backend y frontend.';
    const keywords =
        'sitios web, proyectos, Raúl Caro Pastorino, desarrollador web, backend, frontend, diseño web, desarrollo web, portafolio';

    useHead({
        title: title,
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { name: 'robots', content: 'index, follow' },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: title },
            { property: 'og:url', content: `${url}/webs/` },
            { property: 'og:image', content: `${url}/social/webs.webp` },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: `${url}/social/webs.webp` },
        ],
        link: [{ rel: 'canonical', href: `${url}/webs/` }],
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: title,
                    url: `${url}/webs/`,
                    description: description,
                    author: {
                        '@type': 'Person',
                        name: 'Raúl Caro Pastorino',
                        url: `${url}/`,
                    },
                }),
            },
        ],
    });

    // Sitios web publicados
    const webs = [
        {
            title: 'Jaja Project',
            image: '/images/icons/webs/jajaproject.webp',
            description:
                'Plataforma web comunitaria donde compartir chistes, adivinanzas y preguntas tipo quiz accesibles mediante una API pública.',
            url: 'https://jaja.raupulus.dev',
            tags: ['Vue.js', 'Laravel', 'API'],
        },
        {
            title: 'API Personal (Para debug y desarrollo IoT)',
            image: '/images/icons/world.svg',
            description:
                'API REST centralizada para pruebas de servicios, ingesta de telemetría IoT, utilidades compartidas y monitorización.',
            url: 'https://api.raupulus.dev',
            tags: ['Laravel', 'REST API', 'IoT'],
        },
        {
            title: 'Micro-Blog Personal',
            image: '/images/icons/webs/blog_personal.svg',
            description:
                'En este sitio encontrarás mi micro-blog personal, donde escribo sobre lo que voy aprendiendo y resumo las cosas que voy realizando.',
            url: 'https://microblog.raupulus.dev/',
            tags: ['Blog', 'Personal'],
        },
        {
            title: 'La Guía Linux',
            image: '/images/icons/webs/laguialinux.webp',
            description:
                'Portal de divulgación y comunidad sobre GNU/Linux y software libre activo desde 2008, con tutoriales, guías prácticas y recursos técnicos.',
            url: 'https://laguialinux.es/',
            tags: ['GNU/Linux', 'Open Source', 'Documentación'],
        },
        {
            title: 'Curriculum Vitae Online',
            image: '/logo_128x128.webp',
            description:
                'Versión web completa y actualizada de mi currículum vitae con experiencia detallada, stack técnico, proyectos e integraciones de IA.',
            url: 'https://curriculum.raupulus.dev/',
            tags: ['CV', 'Perfil Profesional', 'HTML/CSS'],
        },
        {
            title: 'AI Dyslexic',
            image: '/images/icons/webs/aidyslexic.webp',
            description:
                'Automatización que genera conceptos visuales mediante IA y produce imágenes con Stable Diffusion o DALL·E. Publica las galerías en redes sociales, genera clips en vídeo con FFmpeg para TikTok y YouTube, y sincroniza la portada con la API.',
            url: 'https://aidyslexic.raupulus.dev',
            tags: ['AI', 'Python', 'Automatización'],
        },
        {
            title: 'Raupulus Music',
            image: '/images/icons/webs/music.webp',
            description:
                'Sitio oficial de Raupulus Music. Metal Industrial, Cyberpunk y videoclips generados por IA cinematográfica, con el álbum "Nunca venderé mi alma de Metal", letras y universo visual.',
            url: 'https://music.raupulus.dev/',
            tags: ['Música', 'Metal Industrial', 'IA', 'Videoclips'],
        },
        {
            title: 'Andalucía Mesh',
            image: '/images/icons/webs/mesh.webp',
            description:
                'Red regional comunitaria de radioenlaces LoRa Meshtastic en Andalucía: comunicación libre y descentralizada sin internet, telemetría y estado de la red en tiempo real.',
            url: 'https://mesh.desdechipiona.es/',
            tags: ['Meshtastic', 'LoRa', 'IoT', 'Hardware'],
        },
        {
            title: 'Portfolio Web Personal',
            image: '/logo_128x128.webp',
            description: 'Esta es mi web personal, donde comparto mis proyectos y experiencia.',
            url: 'https://raupulus.dev',
            tags: ['Nuxt.js', 'Vue.js', 'Portfolio'],
        },
    ];
</script>

<template>
    <div class="min-h-screen bg-background circuit-pattern">
        <!-- Cabecera -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <span class="font-label text-secondary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                <span class="w-8 h-[1px] bg-secondary" />
                Sitios Publicados
            </span>
            <h1
                class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6 max-w-4xl"
            >
                Mis <span class="text-on-surface-variant font-light">Sitios Web</span>
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
                    <div
                        class="relative h-48 bg-surface-container-lowest flex items-center justify-center overflow-hidden border-b border-outline-variant/10"
                    >
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
                        <h2
                            class="font-headline text-lg font-bold mb-3 text-on-surface group-hover:text-primary transition-colors"
                        >
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
