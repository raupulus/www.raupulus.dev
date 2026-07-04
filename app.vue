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

// Canonical y og:url dinámicos según la ruta actual (importante para SEO en SSG)
const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = (config.public.app.url || 'https://raupulus.dev').replace(/\/$/, '')
const canonicalUrl = computed(() => siteUrl + (route.path === '/' ? '' : route.path))

useHead({
    htmlAttrs: {
        lang: 'es'
    },
    link: [
        {
            rel: 'icon',
            type: 'image/ico',
            href: '/favicon.ico'
        },
        {
            rel: 'canonical',
            href: canonicalUrl
        }
    ],
    meta: [
        { property: 'og:url', content: canonicalUrl }
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

const scrollDisabled = useScrollDisabled();

/**
 * Deshabilita el scroll en el body
 *
 * @param {boolean} disabled
 */
function scrollToggle(disabled: boolean) {
    if (disabled) {
        document.body.classList.add('disable-scroll');
    } else {
        document.body.classList.remove('disable-scroll');
    }
}


watch(scrollDisabled, (current) => {
    //console.log('Valor actual: ', current);
    scrollToggle(current);
});


onNuxtReady(async () => {
    /*
    if (!useCookie('XSRF-TOKEN').value) {
        fetchCsrfToken()
    }
    */

    // Carga datos de la plataforma en el cliente (usa proxy para evitar CORS)
    await usePlatformData()
})


/* Cookies */
const { cookiesEnabledIds } = useCookieControl()

watch(
    () => cookiesEnabledIds.value,
    (current, previous) => {
        if (
            !previous?.includes('google-analytics') &&
            current?.includes('google-analytics')
        ) {
            //console.log('se habilita google analytics');
            // cookie con id `google-analytics` se ha añadido
            //window.location.reload() // placeholder para tu manejador de cambios personalizado
            const { gtag } = useGtag()
            gtag('consent', 'update', {
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                ad_storage: 'granted',
                analytics_storage: 'granted'
            })

            //initialize();
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