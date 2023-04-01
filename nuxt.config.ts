// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,

    app: {
        head: {
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' }
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
