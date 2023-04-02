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

            /*
            link: [
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: "@/assets/favicons/favicon.ico"
                },
                //{ rel: 'stylesheet', href: 'https://awesome-lib.css' }
            ],
            */
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
