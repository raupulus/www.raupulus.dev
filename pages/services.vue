<script setup>
const services = [
    {
        title: 'Nodo de Mastodon',
        image: 'https://mastodon.social/apple-touch-icon.png',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor odio, congue eu eleifend blandit, mollis vitae arcu. Etiam quis dignissim lorem, sit amet consectetur felis. Etiam mollis turpis et interdum suscipit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempor ante eget facilisis finibus. Integer ultrices tellus et erat ultricies, in condimentum velit dapibus.',
        url: 'https://mastodon.social/@raupulus',
    },
    {
        title: 'Mumble Service',
        image: 'https://mastodon.social/apple-touch-icon.png',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor odio, congue eu eleifend blandit, mollis vitae arcu. Etiam quis dignissim lorem, sit amet consectetur felis. Etiam mollis turpis et interdum suscipit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempor ante eget facilisis finibus. Integer ultrices tellus et erat ultricies, in condimentum velit dapibus.',
        url: 'https://mumble.raupulus.dev',
    },
    {
        title: 'NextCloud Service',
        image: 'https://mastodon.social/apple-touch-icon.png',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dolor odio, congue eu eleifend blandit, mollis vitae arcu. Etiam quis dignissim lorem, sit amet consectetur felis. Etiam mollis turpis et interdum suscipit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tempor ante eget facilisis finibus. Integer ultrices tellus et erat ultricies, in condimentum velit dapibus.',
        url: 'https://nextcloud.raupulus.dev',
    }
]
</script>

<template>
    <section>
        <div class="text-center">
            <h2>
                Servicios
            </h2>
        </div>

        <div v-for="service in services">
            <div class="box-service">
                <div class="box-image">
                    <img src="@/assets/images/logo.webp">
                </div>

                <div>
                    <h3 class="title">{{ service.title }}</h3>
                    <p>{{ service.description }}</p>
                </div>

                <div>
                    <a :href="service.url" target="_blank">
                        <BtnGeneric text="Ir" />
                    </a>
                </div>

            </div>

        </div>
    </section>
</template>


<style scoped>
.box-service {
    display: grid;
    max-width: 80%;
    margin: 3rem auto;
    grid-template-columns: auto 1fr auto;
    gap: 5px;
    color: var(--black);
    padding: 10px;
    border-radius: 8px;
    background-color: #E6E6E6;
    align-items: center;
}

.box-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
}

.box-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
</style>
