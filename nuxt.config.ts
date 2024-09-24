// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },

    plugins: [

    ],

    // Configuración para generación de sitios estáticos
    /*
    nitro: {
        prerender: {
            routes: [
                // Agrega aquí las rutas estáticas si es necesario
            ]
        }
    },
    */

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
                { name: 'application-name', content: 'www.raupulus.dev' },
                { name: 'keywords', content: 'Raúl Caro Pastorino, raupulus, desarrollador, desarrollador web, web developer, iot, maker, php, laravel, vue, vue3, vuejs, nuxt, js, javascript, python, bash, linux, Raul Caro Pastorino' },
                { name: 'author', content: 'Raúl Caro Pastorino' },
                { name: 'twitter:card', content: 'summary_large_image' },
                { name: 'twitter:site', content: '@raupulus' },
                { name: 'twitter:creator', content: '@raupulus' },
                { name: 'twitter:title', content: 'Raúl Caro Pastorino' },
                { name: 'twitter:description', content: 'Desarrollador Web Backend, Laravel & Vuejs (@raupulus)' },
                { name: 'twitter:image', content: 'https://raw.githubusercontent.com/raupulus/raupulus/master/images/banner.webp' },
                { name: 'og:title', content: 'Raúl Caro Pastorino' },
                { name: 'og:type', content: 'website' },
                { name: 'og:url', content: 'https://raupulus.dev' },
                { name: 'og:image', content: 'https://raw.githubusercontent.com/raupulus/raupulus/master/images/banner.webp' },
                { name: 'og:description', content: 'Desarrollador Web Backend, Laravel & Vuejs (@raupulus)' },
                { name: 'og:site_name', content: 'Portfolio de Raúl Caro Pastorino' },
                { name: 'og:locale', content: 'es_ES' },
                { name: 'og:locale:alternate', content: 'en_EN' },
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

    modules: ["@nuxt/image", '@nuxtjs/sitemap'],

    image: {
        provider: 'ipx',
        dir: 'public', // Directorio base donde se guardan las imágenes
        domains: ['localhost', 'raupulus.dev'],
    },
    nitro: {
        preset: 'static',
        prerender: {
            routes: ['/'], // Manteniendo la prerenderización de la ruta raíz
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
        // TODO: Añadir aquí proyectos cuando dinamice urls
        /*
        urls: async () => {
            const posts = await fetch('https://api.tu-dominio.com/posts')
                .then(res => res.json());

            return posts.map((post: any) => ({
                loc: `/post/${post.slug}`,
                changefreq: 'daily',
                priority: 0.9,
                lastmod: post.updatedAt
            }));
        },
        */
        defaults: {
            changefreq: 'weekly',
            priority: 0.5,
            lastmod: new Date()
        },
    },

    compatibilityDate: '2024-09-10'
})
