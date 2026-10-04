<script setup lang="ts">
//import fetchCsrfToken from '@/composables/fetchPostData'

const webTitle = 'Portfolio de Raúl Caro Pastorino Web Developer (@raupulus)';
const webDescription = 'Portal como desarrollador web de Raúl Caro Pastorino (@raupulus) Developer & Maker';

useSeoMeta({
    description: webDescription,
    ogTitle: webTitle,
    ogDescription: webDescription,
    ogImage: '/logo_512x512.png',
    ogUrl: 'https://raupulus.dev',
    twitterTitle: webTitle,
    twitterDescription: webDescription,
    twitterImage: '/logo_512x512.png',
    twitterCard: 'summary'
})

// Canonical y og:url dinámicos según la ruta actual (con barra final según URLS=con-barra-final)
const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = (config.public.app.url || 'https://raupulus.dev').replace(/\/$/, '')
const canonicalUrl = computed(() => {
    const p = route.path;
    const withSlash = p === '/' ? '/' : (p.endsWith('/') ? p : `${p}/`);
    return siteUrl + withSlash;
});

useHead({
    htmlAttrs: {
        lang: 'es',
        class: 'dark'
    },
    meta: [
        { name: 'theme-color', content: '#091421' },
        { property: 'og:url', content: canonicalUrl }
    ],
    link: [
        {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicons/favicon-32x32.png'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            href: '/favicons/favicon-16x16.png'
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            href: '/favicons/apple-touch-icon.png'
        },
        {
            rel: 'manifest',
            href: '/favicons/site.webmanifest'
        },
        {
            rel: 'canonical',
            href: canonicalUrl
        }
    ],
    script: [
        // Datos estructurados: identidad del autor y del sitio (rich results)
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                    {
                        '@type': 'Person',
                        '@id': siteUrl + '/#person',
                        name: 'Raúl Caro Pastorino',
                        alternateName: 'raupulus',
                        url: siteUrl,
                        image: siteUrl + '/logo_512x512.png',
                        jobTitle: 'Desarrollador Web Backend',
                        description: 'Desarrollador Web Backend especializado en PHP/Laravel, Python, IoT y sistemas distribuidos.',
                        knowsAbout: ['PHP', 'Laravel', 'Python', 'Vue.js', 'Nuxt', 'IoT', 'PostgreSQL', 'GNU/Linux'],
                        sameAs: [
                            'https://github.com/raupulus',
                            'https://gitlab.com/raupulus',
                            'https://www.linkedin.com/in/raulcaropastorino/',
                            'https://twitter.com/raupulus',
                            'https://mastodon.online/@raupulus',
                            'https://www.youtube.com/@raupulus',
                            'https://www.twitch.tv/raupulus',
                        ],
                    },
                    {
                        '@type': 'WebSite',
                        '@id': siteUrl + '/#website',
                        url: siteUrl,
                        name: 'Portfolio de Raúl Caro Pastorino',
                        inLanguage: 'es',
                        publisher: { '@id': siteUrl + '/#person' },
                    },
                ],
            }),
        },
    ]
})


onNuxtReady(async () => {
    /*
    if (!useCookie('XSRF-TOKEN').value) {
        fetchCsrfToken()
    }
    */

    // Carga datos de la plataforma en el cliente (usa proxy para evitar CORS)
    await usePlatformData()
})


/* Cookies y analítica con Consent Mode v2 */
const { cookiesEnabledIds } = useCookieControl()

watch(
    () => cookiesEnabledIds.value,
    (current, previous) => {
        const { initialize, gtag } = useGtag()
        if (
            !previous?.includes('google-analytics') &&
            current?.includes('google-analytics')
        ) {
            // Se concede consentimiento a analítica
            initialize()
            gtag('consent', 'update', {
                analytics_storage: 'granted'
            })
        } else if (
            previous?.includes('google-analytics') &&
            !current?.includes('google-analytics')
        ) {
            // Se revoca consentimiento de analítica
            gtag('consent', 'update', {
                analytics_storage: 'denied'
            })
            // Eliminar cookies generadas por Google Analytics
            if (typeof document !== 'undefined') {
                const domain = window.location.hostname
                document.cookie.split(';').forEach((cookie) => {
                    const eqPos = cookie.indexOf('=')
                    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
                    if (name.startsWith('_ga') || name.startsWith('_gid')) {
                        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`
                        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain};`
                    }
                })
            }
        }
    },
    { deep: true },
)
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
body.disable-scroll {
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
}
</style>