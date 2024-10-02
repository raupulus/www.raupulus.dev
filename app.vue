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



onNuxtReady(() => {

    /*
    if (!useCookie('XSRF-TOKEN').value) {
        fetchCsrfToken()
    }
    */

    usePlatformData()
    //useProjectsData()
})


/* Cookies */
const {
    cookiesEnabled,
    cookiesEnabledIds,
    isConsentGiven,
    isModalActive,
    moduleOptions,
} = useCookieControl()

watch(
    () => cookiesEnabledIds.value,
    (current, previous) => {
        console.log('cambia cookes');
        if (
            !previous?.includes('google-analytics') &&
            current?.includes('google-analytics')
        ) {
            console.log('se habilita google analytics');
            // cookie con id `google-analytics` se ha añadido
            //window.location.reload() // placeholder para tu manejador de cambios personalizado
            const { gtag, initialize } = useGtag()
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
    <div id="app">
        <AppHeader />

        <div id="app-box-content">
            <NuxtPage />
        </div>

        <AppFooter />

        <CookieControl locale="es" />
    </div>
</template>

<style>
body.disable-scroll {
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
}
</style>
