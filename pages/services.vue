<script setup>
const services = [
    {
        title: 'Nodo de Mastodon',
        image: 'https://mastodon.social/apple-touch-icon.png',
        description: 'Servicio de alojamiento de un nodo de Mastodon, la red social descentralizada.',
        url: 'https://mastodon.social/@raupulus',
    },
    {
        title: 'Mumble Service',
        image: 'https://mastodon.social/apple-touch-icon.png',
        description: 'Servicio de alojamiento de un servidor de Mumble, la red de voz descentralizada.',
        url: 'https://mumble.raupulus.dev',
    },
    {
        title: 'NextCloud Service',
        image: 'https://mastodon.social/apple-touch-icon.png',
        description: 'Servicio de alojamiento de un servidor de NextCloud, la nube descentralizada.',
        url: 'https://nextcloud.raupulus.dev',
    }
]
</script>

<template>
    <section>
        <div>
            <h2>
                Servicios
            </h2>
        </div>

        <div v-for="service in services">
            <div>
                <h3>
                    {{ service.title }}
                </h3>
            </div>

        </div>
    </section>

    <div>
        <h1>
            SOY SERVICIOS.vue
        </h1>
    </div>
</template>
