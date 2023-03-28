// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        buildAssetsDir: '/',
        head: {
            htmlAttrs: { dir: 'ltr', lang: 'es' },
            link: [{
                rel: 'icon',
                type: 'image/x-icon',
                href: "/assets/favicons/favicon.ico"
            }]
        },
    },
    css: [
        '@/assets/css/vars.css',
        '@/assets/css/fonts.css',
        '@/assets/css/theme.css',
        '@/assets/css/styles.css',
    ],
    runtimeConfig: {
        // The private keys which are only available server-side
        apiSecret: '123',
        // Keys within public are also exposed client-side
        public: {
            apiBase: '/api',
            test: 'INTERIOR'
        }
    },
    typescript: {
        strict: true
    }
})
