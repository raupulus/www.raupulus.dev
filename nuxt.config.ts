// https://nuxt.com/docs/api/configuration/nuxt-config
import { usefetchProjectsPaginated } from './composables/projectsData';
import { useFetchBlogPaginated } from './composables/blogData';
import fs from 'fs';
import path from 'path';

// Define la ruta del archivo JSON donde se almacenarán las rutas
const cachedRoutesPath = path.resolve('cachedRoutes.json');

// Fuente única de verdad para la API durante la compilación/prerender
const configuredApiBase =
    process.env.API_BASE_URL ||
    (process.env.API_DOMAIN_URL ? `${process.env.API_DOMAIN_URL}/api/v2` : 'http://127.0.0.1:8000/api/v2');

export default defineNuxtConfig({
    buildDir: '.nuxt',
    ssr: true,
    devtools: { enabled: process.env.NODE_ENV !== 'production' },

    routeRules: {
        '/**': {
            headers: {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
            },
        },
        '/_proxy/api/**': {
            proxy: `${process.env.API_DOMAIN_URL || 'http://localhost:8000'}/api/**`,
        },
        // Cookie CSRF de Sanctum (fuera de /api) para el formulario de contacto
        '/_proxy/sanctum/**': {
            proxy: `${process.env.API_DOMAIN_URL || 'http://localhost:8000'}/sanctum/**`,
        },
    },

    runtimeConfig: {
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
                contact: process.env.API_PATH_CONTACT || 'contact-messages',
            },
            turnstile: {
                siteKey: process.env.TURNSTILE_SITE_KEY,
            },
        },
    },

    app: {
        head: {
            title: 'Raúl Caro Pastorino | Desarrollador Full Stack Senior · Backend Laravel · IA aplicada',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            meta: [
                {
                    name: 'description',
                    content:
                        'Portfolio de Raúl Caro Pastorino (@raupulus). Desarrollador Full Stack Senior especializado en backend PHP/Laravel, PostgreSQL, IA aplicada y proyectos Open Source/IoT.',
                },
                { name: 'application-name', content: 'raupulus.dev' },
                {
                    name: 'keywords',
                    content:
                        'Raúl Caro Pastorino, raupulus, desarrollador full stack, backend, laravel, php, postgresql, inteligencia artificial, IA aplicada, vue, nuxt, iot, python, linux, software libre',
                },
                { name: 'author', content: 'Raúl Caro Pastorino' },
                { name: 'color-scheme', content: 'dark' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:site', content: '@raupulus' },
                { name: 'twitter:creator', content: '@raupulus' },
                { name: 'twitter:title', content: 'Raúl Caro Pastorino' },
                {
                    name: 'twitter:description',
                    content: 'Desarrollador Full Stack Senior · Backend Laravel · IA aplicada (@raupulus)',
                },
                { name: 'twitter:image', content: 'https://raupulus.dev/social/home.webp' },
                { property: 'og:title', content: 'Raúl Caro Pastorino' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: 'https://raupulus.dev/' },
                { property: 'og:image', content: 'https://raupulus.dev/social/home.webp' },
                {
                    property: 'og:description',
                    content: 'Desarrollador Full Stack Senior · Backend Laravel · IA aplicada (@raupulus)',
                },
                { property: 'og:site_name', content: 'Portfolio de Raúl Caro Pastorino' },
                { property: 'og:locale', content: 'es_ES' },
            ],
            htmlAttrs: { dir: 'ltr', lang: 'es' },

            link: [
                // Las fuentes se sirven self-hosted con @nuxt/fonts y los iconos
                // Material como SVG inline (components/ui/MaterialIcon.vue).
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicons/favicon.ico',
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
            ],
        },
    },

    css: ['@/assets/css/vars.css', '@/assets/css/theme.css', '@/assets/css/styles.css'],

    //plugins: [{ src: '~/plugins/vuejs-medium-editor', ssr: false }]
    typescript: {
        strict: true,
        typeCheck: false,
    },

    modules: [
        '@nuxt/image',
        'nuxt-gtag',
        '@dargmuesli/nuxt-cookie-control',
        '@nuxtjs/tailwindcss',
        '@nuxt/eslint',
        '@nuxt/fonts',
        '@nuxtjs/turnstile',
    ],

    turnstile: {
        siteKey: process.env.TURNSTILE_SITE_KEY,
    },

    // Fuentes self-hosted (descargadas en build, servidas desde el propio dominio)
    fonts: {
        families: [
            { name: 'Space Grotesk', provider: 'google', weights: [400, 700] },
            { name: 'Plus Jakarta Sans', provider: 'google', weights: [400, 500, 700] },
        ],
    },

    image: {
        provider: 'none',
        dir: 'public', // Directorio base donde se guardan las imágenes
        domains: ['localhost', 'raupulus.dev', 'api.raupulus.dev'],
    },
    nitro: {
        prerender: {
            crawlLinks: true,
            failOnError: true,
            routes: [
                '/',
                '/about/',
                '/contact/',
                '/cookies/',
                '/legal/',
                '/privacy/',
                '/social/',
                '/webs/',
                '/200.html',
                '/404.html',
                '/sitemap.xml',
            ],
        },
        hooks: {
            async 'prerender:routes'(routes: Set<string>) {
                console.warn(`[prerender] Generando rutas dinámicas desde ${configuredApiBase}...`);

                // Obtener los proyectos paginados
                const projects = await usefetchProjectsPaginated(configuredApiBase);

                if (projects.length === 0 && !process.env.ALLOW_EMPTY_PROJECTS) {
                    throw new Error(
                        `[build] Error fatal: No se encontraron proyectos en la API (${configuredApiBase}). ` +
                            'El build estático requiere proyectos para no vaciar el catálogo y el sitemap. ' +
                            'Para desarrollo offline sin backend, define ALLOW_EMPTY_PROJECTS=1.',
                    );
                }

                const projectUrls = projects.flatMap((project) => {
                    const mainProjectUrl = `/projects/${project.slug}/`;
                    const pageUrls = project.pages?.map((page) => `/projects/${project.slug}/${page.slug}/`) ?? [];
                    return [mainProjectUrl, ...pageUrls];
                });

                // Obtener las entradas de blog paginadas
                const blogPosts = await useFetchBlogPaginated(configuredApiBase);
                const blogUrls = blogPosts.flatMap((post) => {
                    const pageUrls = post.pages?.map((page) => `/blog/${post.slug}/${page.slug}/`) ?? [];
                    return pageUrls;
                });

                const feedUrls = ['/blog/feed.xml', '/blog/rss.xml', '/sitemap.xml'];
                const allDynamicUrls = ['/blog/', ...feedUrls, ...projectUrls, ...blogUrls];

                // Si el archivo ya existe, se eliminará antes de generar uno nuevo
                if (fs.existsSync(cachedRoutesPath)) {
                    fs.unlinkSync(cachedRoutesPath);
                }

                // Escribir las rutas generadas en el archivo JSON
                fs.writeFileSync(cachedRoutesPath, JSON.stringify(['/', ...allDynamicUrls], null, 2));

                // Añadir cada URL generada a las rutas de prerender
                allDynamicUrls.forEach((url) => routes.add(url));

                console.warn(
                    `[prerender] ${projectUrls.length} rutas de proyectos y ${blogUrls.length} rutas de blog añadidas al prerender.`,
                );
            },
        },
    },
    router: {
        options: {
            strict: false,
        },
    },

    // https://github.com/johannschopplich/nuxt-gtag#readme
    gtag: {
        id: process.env.GTAG_ID,
        enabled: process.env.NODE_ENV === 'production',
        initMode: 'manual',
        initCommands: [
            // Setup up consent mode
            [
                'consent',
                'default',
                {
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    ad_storage: 'denied',
                    analytics_storage: 'denied',
                    wait_for_update: 500,
                },
            ],
        ],
    },

    cookieControl: {
        barPosition: 'bottom-right', // Posición del banner de cookies
        closeModalOnClickOutside: true, // Cerrar modal al hacer clic fuera
        colors: {
            barBackground: '#121c2a', // Fondo del banner (surface-container-low)
            barButtonBackground: '#212b39', // Fondo de botones del banner (surface-container-high)
            barButtonColor: '#d9e3f6', // Color del texto de botones del banner
            barButtonHoverBackground: '#303a48', // Hover de botones del banner (surface-bright)
            barButtonHoverColor: '#ffffff', // Hover del texto de botones del banner
            barTextColor: '#d9e3f6', // Color del texto del banner (on-surface)
            checkboxActiveBackground: '#a3c9ff', // Fondo del checkbox activo (primary)
            checkboxActiveCircleBackground: '#00315c', // Círculo del checkbox activo (on-primary)
            checkboxDisabledBackground: '#1a2432', // Fondo del checkbox deshabilitado
            checkboxDisabledCircleBackground: '#414751', // Círculo del checkbox deshabilitado (outline-variant)
            checkboxInactiveBackground: '#2b3544', // Fondo del checkbox inactivo (surface-variant)
            checkboxInactiveCircleBackground: '#8b919c', // Círculo del checkbox inactivo (outline)
            controlButtonBackground: '#16202e', // Fondo del botón de control flotante
            controlButtonHoverBackground: '#212b39', // Hover del botón de control flotante
            controlButtonIconColor: '#a3c9ff', // Color del icono de cookies flotante (primary)
            controlButtonIconHoverColor: '#ffffff', // Hover del icono de cookies flotante
            focusRingColor: '#a3c9ff', // Color del anillo de enfoque de accesibilidad
            modalBackground: '#121c2a', // Fondo del modal (surface-container-low, consistente con tema oscuro)
            modalButtonBackground: '#212b39', // Fondo de botones del modal
            modalButtonColor: '#d9e3f6', // Color del texto de botones del modal
            modalButtonHoverBackground: '#303a48', // Hover de botones del modal
            modalButtonHoverColor: '#ffffff', // Hover del texto de botones del modal
            modalOverlay: '#050f1c', // Fondo de superposición del modal (surface-container-lowest)
            modalOverlayOpacity: 0.85, // Opacidad de superposición
            modalTextColor: '#d9e3f6', // Color de texto general en el modal
            modalUnsavedColor: '#ffb4ab', // Color de aviso de cambios no guardados (error/alerta)
        },
        cookies: {
            necessary: [
                {
                    id: 'necessary', // ID necesario de la cookie
                    name: {
                        en: 'Necessary Cookies',
                        es: 'Cookies Necesarias',
                    },
                    description: {
                        en: 'These cookies are essential for the website to function properly and to remember your privacy choices.',
                        es: 'Estas cookies son esenciales para el correcto funcionamiento técnico del sitio y para registrar sus preferencias de privacidad.',
                    },
                    // Lista de enlaces informativos
                    links: {
                        '/privacy/': 'Política de Privacidad',
                        '/cookies/': 'Política de Cookies',
                    },
                },
            ],
            optional: [
                {
                    id: 'google-analytics', // ID opcional de la cookie
                    name: {
                        en: 'Analytics Cookies',
                        es: 'Cookies de Analítica',
                    },
                    description: {
                        en: 'These cookies provide anonymous analytic data about site traffic via Google Analytics 4 with Consent Mode v2.',
                        es: 'Estas cookies proporcionan métricas anónimas sobre el tráfico de navegación mediante Google Analytics 4 con Consent Mode v2.',
                    },
                    isPreselected: false,
                    targetCookieIds: ['_ga', '_gid'],
                    links: {
                        '/cookies/': 'Política de Cookies',
                    },
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
        // Cumplimiento AEPD: botón de rechazar obligatorio en la primera capa (mismo nivel y visibilidad)
        isAcceptNecessaryButtonEnabled: true,
        // Al rechazar todo se guardan solo las necesarias y no se vuelve a hostigar al usuario
        declineAllAcceptsNecessary: true,
        isControlButtonEnabled: true, // Botón flotante para reabrir y revocar en cualquier momento
        isIframeBlocked: false, // No bloquear iframes
        isModalForced: false, // No forzar modal intrusivo

        // Separación de nombre y descripción mediante guion en el modal
        isDashInDescriptionEnabled: true,

        locales: ['es', 'en'], // Idiomas soportados
        localeTexts: {
            es: {
                bannerTitle: 'Configuración de Cookies y Privacidad',
                bannerDescription:
                    'Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y, con su consentimiento previo, cookies analíticas para medir visitas y mejorar la experiencia. Puede aceptar todas, rechazarlas o configurar sus preferencias. No se aplica consentimiento por mera navegación.',
                accept: 'Aceptar todas',
                decline: 'Rechazar todas',
                acceptAll: 'Aceptar todas',
                declineAll: 'Rechazar todas',
                manageCookies: 'Configurar',
                save: 'Guardar preferencias',
                close: 'Cerrar',
                cookiesNecessary: 'Cookies técnicas y obligatorias',
                cookiesOptional: 'Cookies analíticas opcionales',
                settingsUnsaved: 'Tiene configuraciones sin guardar',
            },
            en: {
                bannerTitle: 'Cookie & Privacy Settings',
                bannerDescription:
                    'We use strictly necessary technical cookies to operate this website and, optionally with your prior consent, analytics cookies to measure traffic and improve your experience. You can accept all, decline all, or configure your preferences. No consent is inferred from mere browsing.',
                accept: 'Accept All',
                decline: 'Decline All',
                acceptAll: 'Accept All',
                declineAll: 'Decline All',
                manageCookies: 'Configure',
                save: 'Save Preferences',
                close: 'Close',
                cookiesNecessary: 'Strictly Necessary Cookies',
                cookiesOptional: 'Optional Analytics Cookies',
                settingsUnsaved: 'You have unsaved changes',
            },
        },
    },

    compatibilityDate: '2024-09-10',
});
