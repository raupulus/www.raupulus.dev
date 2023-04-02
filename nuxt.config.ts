// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,

    app: {
        head: {
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { charset: 'utf-8' },
                { name: 'application-name', content: 'www.raupulus.dev' },
                { name: 'title', content: 'Raúl Caro Pastorino Web Developer (@raupulus)' },
                { name: 'description', content: 'Portfolio de presentación con la información de Raúl Caro Pastorino (@raupulus) Desarrollador Web (Chipiona, Andalucía, Cádiz, España)' },
                { name: 'keywords', content: 'Raúl, Raúl Caro, Raul, Raul Caro, Raúl Caro Pastorino, Raul Caro Pastorino, raupulus, desarrollador, desarrollador web, web, developer, web developer, iot, maker, php, laravel, vue, vue3, vuejs, next, nextjs, next3, nextjs3, js, javascript' },
                { name: 'author', content: 'Raúl Caro Pastorino' },
                { name: 'twitter:card', content: 'summary' },
                { name: 'twitter:site', content: '@Nuxt' },
                { name: 'twitter:creator', content: '@Nuxt' },
                { name: 'twitter:title', content: 'Nuxt' },
                { name: 'twitter:description', content: 'Nuxt' },
                { name: 'twitter:image', content: 'Nuxt' },
                { name: 'og:title', content: 'Nuxt' },
                { name: 'og:type', content: 'website' },
                { name: 'og:url', content: 'Nuxt' },
                { name: 'og:image', content: 'Nuxt' },
                { name: 'og:description', content: 'Nuxt' },
                { name: 'og:site_name', content: 'Nuxt' },
                { name: 'og:locale', content: 'es_ES' },
                { name: 'og:locale:alternate', content: 'en_EN' },
            ],
            htmlAttrs: { dir: 'ltr', lang: 'es' },
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: "/assets/favicons/favicon.ico"
                },
                //{ rel: 'stylesheet', href: 'https://awesome-lib.css' }
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


    /*
    app: {
        //buildAssetsDir: '/',
        head: {
            htmlAttrs: { dir: 'ltr', lang: 'es' },
            link: [{
                rel: 'icon',
                type: 'image/x-icon',
                href: "/assets/favicons/favicon.ico"
            }]
        },
    },
    */

    /*
    runtimeConfig: {
        // The private keys which are only available server-side
        apiSecret: '123',
        // Keys within public are also exposed client-side
        public: {
            apiBase: '/api',
            test: 'INTERIOR'
        }
    },
    */
    typescript: {
        strict: true,
        typeCheck: true,
    }
})
