<script setup>
import fetchCsrfToken from '@/composables/fetchPostData'

const webTitle = 'Portfolio de Raúl Caro Pastorino Web Developer (@raupulus)';
const webDescription = 'Portfolio de presentación con la información de Raúl Caro Pastorino (@raupulus) Desarrollador Web (Chipiona, Andalucía, Cádiz, España)';

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

useHead({
    htmlAttrs: {
        lang: 'es'
    },
    link: [
        {
            rel: 'icon',
            type: 'image/ico',
            href: '/favicon.ico'
        }
    ]
})

const scrollDisabled = useScrollDisabled();

/**
 * Deshabilita el scroll en el body
 *
 * @param {boolean} disabled
 */
function scrollToggle(disabled) {
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



onNuxtReady(() => {

    /*
    if (!useCookie('XSRF-TOKEN').value) {
        fetchCsrfToken()
    }
    */

    usePlatformData()
    //useProjectsData()
})

</script>

<template>
    <div id="app">
        <AppHeader />

        <div id="app-box-content">
            <NuxtPage />
        </div>

        <AppFooter />
    </div>
</template>

<style>
body.disable-scroll {
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
}
</style>
