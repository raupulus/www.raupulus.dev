<script setup lang="ts">
const config = useRuntimeConfig()
const url = config.public.app.url
const title = 'Redes Sociales de Raúl Caro Pastorino | Desarrollador Web Full Stack Backend'
const description = 'Sígueme en mis redes sociales y mantente actualizado con mi último trabajo y proyectos como desarrollador web full stack especializado en backend. Conecta conmigo en LinkedIn, GitHub, Twitter e Instagram.'
const keywords = 'redes sociales, Raúl Caro Pastorino, desarrollador web, full stack, backend, LinkedIn, GitHub, Twitter, Instagram'

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
        { property: 'og:image', content: url + '/social/social.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: url + '/social/social.webp' }
    ]
})

// Redes sociales con diseño bento: las primeras son "featured" (grandes), el resto normales
const socialNetworks = [
    // Fila 1: GitHub grande (col-8) + LinkedIn (col-4)
    {
        title: 'GitHub',
        handle: '@raupulus',
        image: '/images/icons/social/github.svg',
        description: 'Visita mi perfil en Github para ver mi código y contribuciones a proyectos de código abierto. Principalmente uso Gitlab, por lo que GitHub es mi respaldo de repositorios.',
        url: 'https://github.com/raupulus',
        icon: 'code',
        size: 'large', // col-span-8
        badge: 'Código Abierto',
        badgeIcon: 'code',
        stats: [
            { label: 'Enfoque', value: 'PHP & Python' },
            { label: 'Estado', value: 'Alta Frecuencia', active: true },
        ],
    },
    {
        title: 'LinkedIn',
        handle: '@raulcaropastorino',
        image: '/images/icons/social/linkedin.svg',
        description: 'Descubre mi perfil de Linkedin para conocer en detalle mi experiencia laboral y académica, y no dudes en contactarme a través de esta plataforma.',
        url: 'https://www.linkedin.com/in/raulcaropastorino/',
        icon: 'work',
        size: 'medium', // col-span-4
        badge: 'Red Profesional',
    },
    // Fila 2: GitLab grande (col-8) + Twitter (col-4)
    {
        title: 'GitLab',
        handle: '@raupulus',
        image: '/images/icons/social/gitlab.svg',
        description: 'Explora mis proyectos y contribuciones en mi perfil de Gitlab. Principalmente uso Gitlab para todos mis proyectos personales y profesionales.',
        url: 'https://gitlab.com/raupulus',
        icon: 'code_blocks',
        size: 'large',
        badge: 'Repositorio Principal',
        stats: [
            { label: 'Enfoque', value: 'Laravel & IoT' },
            { label: 'Estado', value: 'Muy Activo', active: true },
        ],
    },
    {
        title: 'Twitter / X',
        handle: '@raupulus',
        image: '/images/icons/social/twitter.svg',
        description: 'Sigue mis publicaciones y mantente al tanto de mis actividades en Twitter, donde suelo estar más activo.',
        url: 'https://twitter.com/raupulus',
        icon: 'share',
        size: 'medium',
        badge: 'Red Social',
    },
    // Fila 3: Telegram grande (col-8) + YouTube (col-4)
    {
        title: 'Telegram - Raupulus Diffusion',
        handle: '@raupulus_diffusion',
        image: '/images/icons/social/telegram.svg',
        description: 'Únete a mi canal de Telegram donde comparto todo relacionado con tecnología, software libre y GNU/Linux.',
        url: 'https://t.me/raupulus_diffusion',
        icon: 'send',
        size: 'large',
        badge: 'Canal de Difusión',
        stats: [
            { label: 'Contenido', value: 'Tecnología & Linux' },
            { label: 'Estado', value: 'Actualizaciones Diarias', active: true },
        ],
    },
    {
        title: 'YouTube',
        handle: '@raupulus',
        image: '/images/icons/social/youtube.svg',
        description: 'Mira mis vídeos en mi canal de YouTube y suscríbete para contenido relacionado con programación, tecnología, diseño, y más.',
        url: 'https://www.youtube.com/@raupulus',
        icon: 'play_circle',
        size: 'medium',
        badge: 'Contenido en Vídeo',
    },
    // Fila 4: tarjetas pequeñas (col-3 cada una)
    {
        title: 'Mastodon',
        handle: '@raupulus',
        image: '/images/icons/social/mastodon.svg',
        description: 'Conéctate conmigo en Mastodon para seguir mis publicaciones y actualizaciones.',
        url: 'https://mastodon.online/@raupulus',
        icon: 'rss_feed',
        size: 'small',
    },
    {
        title: 'Blue Sky',
        handle: '@raupulus',
        image: '/images/icons/social/bluesky.svg',
        description: 'Nuevo por esta red social pero me está encantando y actualmente estoy bastante activo en ella.',
        url: 'https://bsky.app/profile/raupulus.bsky.social',
        icon: 'cloud',
        size: 'small',
    },
    {
        title: 'Twitch',
        handle: '@raupulus',
        image: '/images/icons/social/twitch.svg',
        description: 'Únete a mis directos en Twitch y suscríbete para no perderte ningún stream.',
        url: 'https://www.twitch.tv/raupulus',
        icon: 'live_tv',
        size: 'small',
    },
    {
        title: 'Instagram',
        handle: '@raupulus',
        image: '/images/icons/social/instagram.svg',
        description: 'Descubre mis publicaciones y fotografías en Instagram, donde comparto proyectos y algunas imágenes de mis cámaras.',
        url: 'https://www.instagram.com/raupulus/',
        icon: 'photo_camera',
        size: 'small',
    },
    {
        title: 'StackOverflow',
        handle: '@raupulus',
        image: '/images/icons/social/stackoverflow.svg',
        description: 'Consulta mis respuestas y preguntas en la comunidad de StackOverflow en español.',
        url: 'https://es.stackoverflow.com/users/82651/raupulus',
        icon: 'help',
        size: 'small',
    },
    {
        title: 'Codepen',
        handle: '@raupulus',
        image: '/images/icons/social/codepen.svg',
        description: 'Aquí comparto mis diseños en CSS para que puedan ser reutilizados.',
        url: 'https://codepen.io/raupulus',
        icon: 'code',
        size: 'small',
    },
    {
        title: 'Thingiverse',
        handle: '@raupulus',
        image: '/images/icons/social/thingiverse.webp',
        description: 'Descubre mis modelos 3D en Thingiverse, donde comparto mis creaciones para impresoras 3D.',
        url: 'https://www.thingiverse.com/raupulus/designs',
        icon: 'view_in_ar',
        size: 'small',
    },
    {
        title: 'Printables',
        handle: '@raupulus',
        image: '/images/icons/social/printables.svg',
        description: 'Explora mis diseños 3D en Printables y encuentra modelos únicos para tus proyectos.',
        url: 'https://www.printables.com/@raupulus_2109175',
        icon: 'view_in_ar',
        size: 'small',
    },
    {
        title: 'Facebook',
        handle: '@raupulus',
        image: '/images/icons/social/facebook.svg',
        description: 'Sigue mis publicaciones y actualizaciones en mi perfil de Facebook.',
        url: 'https://www.facebook.com/raupulus/',
        icon: 'group',
        size: 'small',
    },
    {
        title: 'TikTok',
        handle: '@raupulus',
        image: '/images/icons/social/tiktok.svg',
        description: 'Sigue mis vídeos en TikTok y mantente al tanto de mis nuevas publicaciones.',
        url: 'https://www.tiktok.com/@raupulus',
        icon: 'music_video',
        size: 'small',
    },
    {
        title: 'Npmjs',
        handle: '@fryntiz',
        image: '/images/icons/social/npmjs.svg',
        description: 'Revisa mis paquetes publicados junto con sus versiones y detalles en mi perfil de Npmjs.',
        url: 'https://www.npmjs.com/~fryntiz',
        icon: 'package_2',
        size: 'small',
    },
    {
        title: 'Packagist',
        handle: '@raupulus',
        image: '/images/icons/social/packagist.svg',
        description: 'Consulta mis paquetes publicados y sus detalles en mi perfil de Packagist.',
        url: 'https://packagist.org/users/raupulus/',
        icon: 'package_2',
        size: 'small',
    },
]

// Separa las redes por tamaño para el layout bento
const bentoRows = computed(() => {
    const rows: Array<typeof socialNetworks> = []
    let i = 0
    while (i < socialNetworks.length) {
        const net = socialNetworks[i]
        if (!net) break

        const next = socialNetworks[i + 1]
        if (net.size === 'large' && next && next.size === 'medium') {
            rows.push([net, next])
            i += 2
        } else {
            // Agrupa las small de 4 en 4
            const smallGroup: typeof socialNetworks = []
            let current = socialNetworks[i]
            while (current && current.size === 'small') {
                smallGroup.push(current)
                i++
                current = socialNetworks[i]
            }
            if (smallGroup.length) rows.push(smallGroup)
            else { rows.push([net]); i++ }
        }
    }
    return rows
})
</script>

<template>
    <div class="min-h-screen bg-background circuit-pattern">

        <!-- Cabecera -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <div class="inline-block mb-4 px-3 py-1 bg-surface-container-low border border-outline-variant/30 rounded">
                <span class="font-label text-[10px] tracking-[0.2em] text-tertiary uppercase">Redes y Conexiones</span>
            </div>
            <h1 class="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-6 max-w-3xl">
                Redes <span class="text-primary">Sociales</span>
            </h1>
            <p class="font-body text-lg text-on-surface-variant max-w-xl leading-relaxed">
                {{ description }}
            </p>
        </div>

        <!-- Bento Grid -->
        <div class="px-8 pb-24 max-w-7xl mx-auto">
            <div v-for="(row, rowIdx) in bentoRows" :key="rowIdx" class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">

                <template v-for="network in row" :key="network.title">

                    <!-- Tarjeta LARGE (col-span-8) -->
                    <a
                        v-if="network.size === 'large'"
                        :href="network.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="md:col-span-8 group relative overflow-hidden bg-surface-container-high rounded-xl p-8 border border-outline-variant/20 hover:border-primary/40 transition-all duration-500 flex flex-col justify-between"
                    >
                        <div class="absolute top-0 right-0 p-4">
                            <UiMaterialIcon
                                class="text-4xl text-on-surface-variant opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all"
                                :name="network.icon"
                            />
                        </div>
                        <div>
                            <div class="flex items-center gap-3 mb-6">
                                <div class="w-12 h-12 flex items-center justify-center bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                                    <NuxtImg
                                        v-if="network.image"
                                        :src="network.image"
                                        :alt="network.title"
                                        width="28"
                                        height="28"
                                        class="w-7 h-7 object-contain"
                                    />
                                    <UiMaterialIcon v-else class="text-primary" :name="network.icon" />
                                </div>
                                <div>
                                    <h3 class="font-headline text-2xl font-bold">{{ network.title }}</h3>
                                    <p class="font-label text-xs text-tertiary">{{ network.handle }}</p>
                                </div>
                            </div>
                            <p class="text-on-surface-variant mb-8 max-w-md">{{ network.description }}</p>
                        </div>
                        <div class="flex flex-wrap gap-4 items-center">
                            <template v-if="network.stats">
                                <div
                                    v-for="stat in network.stats"
                                    :key="stat.label"
                                    class="bg-surface-container-lowest px-4 py-2 rounded border border-outline-variant/30"
                                >
                                    <span class="block font-label text-[10px] text-outline uppercase tracking-wider">{{ stat.label }}</span>
                                    <span class="flex items-center gap-2 text-sm font-medium" :class="stat.active ? 'text-tertiary' : 'text-on-surface'">
                                        <span v-if="stat.active" class="w-2 h-2 rounded-full bg-tertiary animate-pulse"/>
                                        {{ stat.value }}
                                    </span>
                                </div>
                            </template>
                            <span class="ml-auto flex items-center gap-2 font-label text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                                VER_PERFIL <UiMaterialIcon class="text-sm" name="arrow_forward" />
                            </span>
                        </div>
                    </a>

                    <!-- Tarjeta MEDIUM (col-span-4) -->
                    <a
                        v-else-if="network.size === 'medium'"
                        :href="network.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="md:col-span-4 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10 group hover:border-primary/30 transition-all duration-300"
                    >
                        <div>
                            <div class="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-6 border border-primary/20">
                                <NuxtImg
                                    v-if="network.image"
                                    :src="network.image"
                                    :alt="network.title"
                                    width="24"
                                    height="24"
                                    class="w-6 h-6 object-contain"
                                />
                                <UiMaterialIcon v-else class="text-primary" :name="network.icon" />
                            </div>
                            <h3 class="font-headline text-xl font-bold mb-2">{{ network.title }}</h3>
                            <p v-if="network.badge" class="font-label text-xs text-secondary mb-4 uppercase tracking-widest">{{ network.badge }}</p>
                            <p class="text-sm text-on-surface-variant leading-relaxed">{{ network.description }}</p>
                        </div>
                        <div class="mt-8">
                            <div class="w-full h-[1px] bg-outline-variant/20 mb-6"/>
                            <span class="flex items-center justify-between text-on-surface group-hover:text-primary transition-colors">
                                <span class="font-label text-sm">Ver Perfil</span>
                                <UiMaterialIcon name="north_east" />
                            </span>
                        </div>
                    </a>

                    <!-- Tarjeta SMALL (col-span-3) -->
                    <a
                        v-else
                        :href="network.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="md:col-span-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 group hover:border-primary/40 hover:bg-surface-container-low transition-all duration-300 flex flex-col"
                    >
                        <div class="flex justify-between items-start mb-4">
                            <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                                <NuxtImg
                                    v-if="network.image"
                                    :src="network.image"
                                    :alt="network.title"
                                    width="22"
                                    height="22"
                                    class="w-5 h-5 object-contain"
                                />
                                <UiMaterialIcon v-else class="text-sm text-primary" :name="network.icon" />
                            </div>
                            <UiMaterialIcon class="text-outline group-hover:text-primary transition-colors text-sm" name="north_east" />
                        </div>
                        <h3 class="font-headline text-base font-bold mb-1">{{ network.title }}</h3>
                        <p class="font-label text-[10px] text-outline mb-2">{{ network.handle }}</p>
                        <p class="text-xs text-on-surface-variant leading-relaxed flex-1">{{ network.description }}</p>
                    </a>

                </template>
            </div>
        </div>
    </div>
</template>
