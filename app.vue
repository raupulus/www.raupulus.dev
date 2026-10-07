<script setup lang="ts">
    //import fetchCsrfToken from '@/composables/fetchPostData'

    const webTitle = 'Raúl Caro Pastorino · Full Stack Senior · Laravel & IA';
    const webDescription =
        'Portfolio de Raúl Caro Pastorino (@raupulus). Desarrollador Full Stack Senior especializado en backend PHP/Laravel, PostgreSQL, IA aplicada y proyectos Open Source/IoT.';

    // Canonical y og:url dinámicos según la ruta actual (con barra final según URLS=con-barra-final)
    const route = useRoute();
    const config = useRuntimeConfig();
    const siteUrl = (config.public.app.url || 'https://raupulus.dev').replace(/\/$/, '');
    const canonicalUrl = computed(() => {
        const p = route.path;
        const withSlash = p === '/' ? '/' : p.endsWith('/') ? p : `${p}/`;
        return siteUrl + withSlash;
    });

    useSeoMeta({
        description: webDescription,
        ogTitle: webTitle,
        ogDescription: webDescription,
        ogImage: `${siteUrl}/social/home.webp`,
        ogUrl: canonicalUrl,
        twitterTitle: webTitle,
        twitterDescription: webDescription,
        twitterImage: `${siteUrl}/social/home.webp`,
        twitterCard: 'summary_large_image',
    });

    useHead({
        htmlAttrs: {
            lang: 'es',
            class: 'dark',
        },
        meta: [
            { name: 'theme-color', content: '#091421' },
            { property: 'og:url', content: canonicalUrl },
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: '/favicons/favicon-32x32.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: '/favicons/favicon-16x16.png',
            },
            {
                rel: 'apple-touch-icon',
                sizes: '180x180',
                href: '/favicons/apple-touch-icon.png',
            },
            {
                rel: 'manifest',
                href: '/favicons/site.webmanifest',
            },
            {
                rel: 'canonical',
                href: canonicalUrl,
            },
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
                            jobTitle: 'Desarrollador Full Stack Senior · Backend Laravel · IA aplicada',
                            description:
                                'Desarrollador Full Stack Senior con más de 15 años de experiencia, especializado en PHP/Laravel, IA aplicada en producción (RAG y agentes), bases de datos PostgreSQL, hardware propio y sistemas GNU/Linux.',
                            knowsAbout: [
                                'PHP',
                                'Laravel',
                                'Inteligencia Artificial',
                                'RAG (Retrieval-Augmented Generation)',
                                'Agentes de IA',
                                'Python',
                                'Vue.js',
                                'Nuxt',
                                'IoT',
                                'LoRa / Meshtastic',
                                'Diseño de PCBs',
                                'PostgreSQL',
                                'GNU/Linux',
                            ],
                            sameAs: [
                                'https://github.com/raupulus',
                                'https://gitlab.com/raupulus',
                                'https://www.linkedin.com/in/raulcaropastorino/',
                                'https://twitter.com/raupulus',
                                'https://bsky.app/profile/raupulus.bsky.social',
                                'https://mastodon.online/@raupulus',
                                'https://www.youtube.com/@raupulus',
                                'https://t.me/raupulus_diffusion',
                                'https://packagist.org/users/raupulus/',
                                'https://www.printables.com/@raupulus_2109175',
                            ],
                        },
                        {
                            '@type': 'WebSite',
                            '@id': siteUrl + '/#website',
                            url: siteUrl,
                            name: 'Raúl Caro Pastorino · Portfolio',
                            description: webDescription,
                            inLanguage: 'es',
                            publisher: { '@id': siteUrl + '/#person' },
                        },
                    ],
                }),
            },
        ],
    });

    onNuxtReady(async () => {
        /*
    if (!useCookie('XSRF-TOKEN').value) {
        fetchCsrfToken()
    }
    */

        // Carga datos de la plataforma en el cliente (usa proxy para evitar CORS)
        await usePlatformData();
    });

    /* Cookies y analítica con Consent Mode v2 */
    const { cookiesEnabledIds } = useCookieControl();

    watch(
        () => cookiesEnabledIds.value,
        (current, previous) => {
            if (!import.meta.client) {
                return;
            }

            const { initialize, gtag } = useGtag();
            if (!previous?.includes('google-analytics') && current?.includes('google-analytics')) {
                // Se concede consentimiento a analítica
                initialize();
                gtag('consent', 'update', {
                    analytics_storage: 'granted',
                });
            } else if (previous?.includes('google-analytics') && !current?.includes('google-analytics')) {
                // Se revoca consentimiento de analítica
                gtag('consent', 'update', {
                    analytics_storage: 'denied',
                });
                // Eliminar cookies generadas por Google Analytics en host local y dominio raíz
                if (typeof document !== 'undefined') {
                    const hostname = window.location.hostname;
                    const rootDomain = hostname.replace(/^www\./, '');
                    document.cookie.split(';').forEach((cookie) => {
                        const eqPos = cookie.indexOf('=');
                        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
                        if (name.startsWith('_ga') || name.startsWith('_gid')) {
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${hostname};`;
                            if (rootDomain !== hostname) {
                                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${rootDomain};`;
                            }
                        }
                    });
                }
            }
        },
        { deep: true, immediate: true },
    );
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
