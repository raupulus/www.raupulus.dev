// https://nuxt.com/docs/api/configuration/nuxt-config
import { type ContentType } from '@/types/ContentType';
import { usefetchProjectsPaginated } from './composables/projectsData';
import fs from 'fs';
import path from 'path';

// Define la ruta del archivo JSON donde se almacenarán las rutas
const cachedRoutesPath = path.resolve('cachedRoutes.json');

export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },

    plugins: [

    ],

    runtimeConfig: {
        captcha: {
            secretKey: process.env.CAPTCHA_SITE_PRIVATE_KEY,
        },
        public: {
            app: {
                name: process.env.APP_NAME,
                description: process.env.APP_DESCRIPTION,
                url: process.env.APP_URL,
                domain: process.env.APP_DOMAIN,
                currentLocale: 'es',
                locale: process.env.APP_LOCALE,
                localeAlternate: process.env.APP_LOCALE_ALTERNATE,
            },
            api: {
                domain: process.env.API_DOMAIN_URL,
                base: process.env.API_BASE_URL,
                contact: process.env.API_PATH_CONTACT,
            },
            captcha: {
                siteKey: process.env.CAPTCHA_SITE_KEY,
            }
        }
    },

    app: {
        head: {
            title: 'Portfolio de Raúl Caro Pastorino Web Developer (@raupulus)',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            meta: [
                { name: 'description', content: 'Portfolio de presentación con la información de Raúl Caro Pastorino (@raupulus) Desarrollador Web (Chipiona, Andalucía, Cádiz, España)' },
                { name: 'application-name', content: 'raupulus.dev' },
                { name: 'keywords', content: 'Raúl Caro Pastorino, raupulus, desarrollador, desarrollador web, web developer, iot, maker, php, laravel, vue, vue3, vuejs, nuxt, js, javascript, python, bash, linux, Raul Caro Pastorino' },
                { name: 'author', content: 'Raúl Caro Pastorino' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:site', content: '@raupulus' },
                { name: 'twitter:creator', content: '@raupulus' },
                { name: 'twitter:title', content: 'Raúl Caro Pastorino' },
                { name: 'twitter:description', content: 'Desarrollador Web Backend, Laravel & Vuejs (@raupulus)' },
                { name: 'twitter:image', content: 'https://raw.githubusercontent.com/raupulus/raupulus/master/images/banner.webp' },
                { property: 'og:title', content: 'Raúl Caro Pastorino' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: 'https://raupulus.dev' },
                { property: 'og:image', content: 'https://raw.githubusercontent.com/raupulus/raupulus/master/images/banner.webp' },
                { property: 'og:description', content: 'Desarrollador Web Backend, Laravel & Vuejs (@raupulus)' },
                { property: 'og:site_name', content: 'Portfolio de Raúl Caro Pastorino' },
                { property: 'og:locale', content: 'es_ES' },
                { property: 'og:locale:alternate', content: 'en_EN' },
            ],
            htmlAttrs: { dir: 'ltr', lang: 'es' },

            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicons/favicon.ico'
                },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicons/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicons/favicon-16x16.png' },
                { rel: 'manifest', href: '/favicons/site.webmanifest' },

                // Librerías externas
                // { rel: 'stylesheet', href: 'https://awesome-lib.css' }
            ],
            script: [
                //{ src: 'https://awesome-lib.js' }
            ],
            // please note that this is an area that is likely to change
            style: [
                // <style type="text/css">:root { color: red }</style>
                //{ children: ':root { color: red }', type: 'text/css' }
            ],
            noscript: [
                // <noscript>JavaScript is required</noscript>
                //{ children: 'JavaScript is required' }
            ]
        },


    },

    css: [
        '@/assets/css/vars.css',
        '@/assets/css/fonts.css',
        '@/assets/css/theme.css',
        '@/assets/css/styles.css',
    ],

    //plugins: [{ src: '~/plugins/vuejs-medium-editor', ssr: false }]
    typescript: {
        strict: true,
        typeCheck: true,
    },

    modules: ["@nuxt/image", '@nuxtjs/sitemap', 'nuxt-gtag', '@dargmuesli/nuxt-cookie-control'],

    image: {
        provider: 'ipx',
        dir: 'public', // Directorio base donde se guardan las imágenes
        domains: ['localhost', 'raupulus.dev'],
    },
    nitro: {
        preset: 'static',
        prerender: {
            routes: [],
            //routes: ['/projects/slug-contenido/slug-page1',],
        },
        hooks: {
            async 'prerender:routes'(routes: Set<string>) {
                console.log('Generando rutas dinámicas');

                // Obtener los proyectos paginados
                const projects = await usefetchProjectsPaginated();
                const urls = projects.flatMap((project) => {
                    const mainProjectUrl = `/projects/${project.slug}`;
                    const pageUrls = project.pages_slug?.map((pageSlug) =>
                        `/projects/${project.slug}/${pageSlug}`
                    ) ?? [];
                    return [mainProjectUrl, ...pageUrls];
                });

                // Si el archivo ya existe, se eliminará antes de generar uno nuevo
                if (fs.existsSync(cachedRoutesPath)) {
                    fs.unlinkSync(cachedRoutesPath);
                }

                // Escribir las rutas generadas en el archivo JSON
                fs.writeFileSync(cachedRoutesPath, JSON.stringify(['/', ...urls], null, 2));

                // Añadir cada URL generada a las rutas de prerender
                urls.forEach(url => routes.add(url));

                console.log('Rutas generadas:');
                urls.forEach(url => console.log(url));
            },
        },

    },
    site: {
        url: process.env.APP_URL,
        name: process.env.APP_NAME
    },
    sitemap: {
        exclude: [
            '/admin/**',
            '/login'
        ],
        urls: async (): Promise<any> => {
            const projects: ContentType[] = await usefetchProjectsPaginated();

            const urls = projects.flatMap((project: ContentType) => {
                // URL para el proyecto principal
                const mainProjectUrl = {
                    loc: `/projects/${project.slug}`,
                    changefreq: 'weekly',
                    priority: 0.9,
                    lastmod: project.updated_at
                };

                // URLs para las páginas del proyecto
                let pageUrls = project.pages_slug?.map((pageSlug: string) => ({
                    loc: `/projects/${project.slug}/${pageSlug}`,
                    changefreq: 'weekly',
                    priority: 0.7,
                    lastmod: project.updated_at
                }));

                if (!pageUrls) {
                    pageUrls = [];
                }

                return [mainProjectUrl, ...pageUrls];
            });

            return urls;
        },
        defaults: {
            changefreq: 'weekly',
            priority: 0.5,
            lastmod: new Date()
        },
    },

    // https://github.com/johannschopplich/nuxt-gtag#readme
    gtag: {
        id: process.env.GTAG_ID,
        enabled: process.env.NODE_ENV === 'production',
        initMode: 'auto',
        initCommands: [
            // Setup up consent mode
            ['consent', 'default', {
                ad_user_data: 'granted',
                ad_personalization: 'denied',
                ad_storage: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500,
            }]
        ]
    },

    cookieControl: {
        barPosition: 'bottom-right', // Posición del banner de cookies
        closeModalOnClickOutside: true, // Cerrar modal al hacer clic fuera
        colors: {
            barBackground: '#000', // Fondo del banner
            barButtonBackground: '#fff', // Fondo del botón del banner
            barButtonColor: '#000', // Color del texto del botón del banner
            barButtonHoverBackground: '#333', // Fondo del botón al pasar el ratón
            barButtonHoverColor: '#fff', // Color del texto del botón al pasar el ratón
            barTextColor: '#fff', // Color del texto del banner
            checkboxActiveBackground: '#000', // Fondo del checkbox activo
            checkboxActiveCircleBackground: '#fff', // Fondo del círculo del checkbox activo
            checkboxDisabledBackground: '#ddd', // Fondo del checkbox deshabilitado
            checkboxDisabledCircleBackground: '#fff', // Fondo del círculo del checkbox deshabilitado
            checkboxInactiveBackground: '#000', // Fondo del checkbox inactivo
            checkboxInactiveCircleBackground: '#fff', // Fondo del círculo del checkbox inactivo
            controlButtonBackground: '#fff', // Fondo del botón de control
            controlButtonHoverBackground: '#000', // Fondo del botón de control al pasar el ratón
            controlButtonIconColor: '#000', // Color del icono del botón de control
            controlButtonIconHoverColor: '#fff', // Color del icono del botón de control al pasar el ratón
            focusRingColor: '#808080', // Color del anillo de enfoque
            modalBackground: '#fff', // Fondo del modal
            modalButtonBackground: '#000', // Fondo del botón del modal
            modalButtonColor: '#fff', // Color del texto del botón del modal
            modalButtonHoverBackground: '#333', // Fondo del botón del modal al pasar el ratón
            modalButtonHoverColor: '#fff', // Color del texto del botón del modal al pasar el ratón
            modalOverlay: '#000', // Superposición del modal
            modalOverlayOpacity: 0.8, // Opacidad de la superposición del modal
            modalTextColor: '#000', // Color del texto del modal
            modalUnsavedColor: '#fff', // Color del texto no guardado del modal
        },
        cookies: {
            necessary: [
                {
                    id: 'necessary', // ID necesario de la cookie
                    name: {
                        en: 'Necessary Cookies',
                        es: 'Cookies Necesarias'
                    },
                    description: {
                        en: 'These cookies are essential for the website to function properly.',
                        es: 'Estas cookies son esenciales para el correcto funcionamiento del sitio web.',
                    },
                    // Lista de enlaces
                    links: {
                        '/privacy': 'Política de Privacidad',
                    },
                },
            ],
            optional: [
                {
                    id: 'google-analytics', // ID opcional de la cookie
                    name: {
                        en: 'Analytics Cookies',
                        es: 'Cookies de Analítica'
                    },
                    description: {
                        en: 'These cookies provide analytic data about site traffic.',
                        es: 'Estas cookies proporcionan datos analíticos sobre el tráfico del sitio.',
                    },
                    isPreselected: true,
                    //src: 'https://example.com/analytics/js?id=<API-KEY>',
                    //targetCookieIds: ['_ga', '_gid', 'google-analytics'], // IDs de cookies objetivo
                },
            ],
        },
        cookieExpiryOffsetMs: 1000 * 60 * 60 * 24 * 365, // Un año
        cookieNameIsConsentGiven: 'ncc_c', // Nombre de la cookie para consentimiento dado
        cookieNameCookiesEnabledIds: 'ncc_e', // Nombre de la cookie para cookies habilitadas
        cookieOptions: {
            path: '/',
            sameSite: 'strict',
        },
        isAcceptNecessaryButtonEnabled: false, // Mostrar botón "Aceptar necesarias"
        isControlButtonEnabled: true, // Mostrar botón de control
        isIframeBlocked: false, // No bloquear iframes
        isModalForced: false, // No forzar mostrar el modal

        // Switch to toggle the separation of cookie name and description in the configuration modal by a dash.
        isDashInDescriptionEnabled: true,

        locales: ['es', 'en'], // Idiomas
        localeTexts: {
            es: {
                save: 'Recordar',
                acceptAll: 'Aceptar Todas',
                declineAll: 'Rechazar Todas',
                manageCookies: 'Gestionar Cookies',
            },
            en: {
                save: 'Remember',
                acceptAll: 'Accept All',
                declineAll: 'Decline All',
                manageCookies: 'Manage Cookies',
            }
        }
    },

    compatibilityDate: '2024-09-10'
})
