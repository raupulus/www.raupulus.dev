<script setup lang="ts">
const config = useRuntimeConfig();

const url = config.public.app.url;
const title = 'Redes Sociales de Raúl Caro Pastorino | Desarrollador Web Full Stack Backend';
const description = 'Sígueme en mis redes sociales y mantente actualizado con mi último trabajo y proyectos como desarrollador web full stack especializado en backend. Conecta conmigo en LinkedIn, GitHub, Twitter e Instagram.';
const keywords = 'redes sociales, Raúl Caro Pastorino, desarrollador web, full stack, backend, LinkedIn, GitHub, Twitter, Instagram';

useHead({
    title: title,
    meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url + '/social' },
        { property: 'og:image', content: url + '/social/social.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: url + '/social/social.webp' }
    ]
});

const groups = [
    {
        title: 'Profesional',
        networks: [
            {
                title: 'Linkedin',
                image: '/images/icons/social/linkedin.svg',
                description: 'Descubre mi perfil de Linkedin para conocer en detalle mi experiencia laboral y académica, y no dudes en contactarme a través de esta plataforma.',
                url: 'https://www.linkedin.com/in/raulcaropastorino/',
            },
            {
                title: 'Gitlab',
                image: '/images/icons/social/gitlab.svg',
                description: 'Explora mis proyectos y contribuciones en mi perfil de Gitlab. ¡Conéctate conmigo fácilmente desde Gitlab!',
                url: 'https://gitlab.com/raupulus',
            },
            {
                title: 'Github',
                image: '/images/icons/social/github.svg',
                description: 'Visita mi perfil en Github para ver mi código y contribuciones a proyectos de código abierto. Principalmente uso Gitlab, por lo que GitHub es mi respaldo de repositorios.',
                url: 'https://github.com/raupulus',
            },
            {
                title: 'StackOverflow (Es)',
                image: '/images/icons/social/stackoverflow.svg',
                description: 'Consulta mis respuestas y preguntas en la comunidad de StackOverflow en español. Aprende y colabora en temas de programación.',
                url: 'https://es.stackoverflow.com/users/82651/raupulus',
            },
            {
                title: 'StackOverflow (En)',
                image: '/images/icons/social/stackoverflow.svg',
                description: 'Accede a mi perfil en la versión en inglés de StackOverflow para ver mis contribuciones y resolver tus dudas de programación.',
                url: 'https://stackoverflow.com/users/8776414/raupulus',
            },
            {
                title: 'InfoJobs',
                image: '/images/icons/social/infojobs.svg',
                description: 'Conoce mi perfil en InfoJobs donde encontrarás mi currículum y detalles de mi búsqueda de oportunidades de empleo.',
                url: 'https://www.infojobs.net/candidate/cv/view/index.xhtml?dgv=7953348122049587012',
            },
            {
                title: 'Npmjs',
                image: '/images/icons/social/npmjs.svg',
                description: 'Revisa mis paquetes publicados junto con sus versiones y detalles en mi perfil de Npmjs.',
                url: 'https://www.npmjs.com/~fryntiz',
            },
            {
                title: 'Packagist',
                image: '/images/icons/social/packagist.svg',
                description: 'Consulta mis paquetes publicados y sus detalles en mi perfil de Packagist.',
                url: 'https://packagist.org/users/raupulus/',
            },
        ]
    },
    {
        title: 'Recursos Compartidos',
        networks: [
            {
                title: 'Codepen (Diseños CSS)',
                image: '/images/icons/social/codepen.svg',
                description: 'Aquí comparto mis diseños en CSS para que puedan ser reutilizados. ¡Sígueme para ser notificado con nuevas publicaciones de diseños!',
                url: 'https://codepen.io/raupulus',
            },
            {
                title: 'Thingiverse (Modelos Impresora 3D)',
                image: '/images/icons/social/thingiverse.webp',
                description: 'Descubre mis modelos 3D en Thingiverse, donde comparto mis creaciones para impresoras 3D. ¡Sígueme y mantente al día con mis últimos diseños innovadores!',
                url: 'https://www.thingiverse.com/raupulus/designs',
            },
            {
                title: 'Printables (Modelos Impresora 3D)',
                image: '/images/icons/social/printables.svg',
                description: 'Explora mis diseños 3D en Printables y encuentra modelos únicos para tus proyectos de impresión 3D. ¡Sígueme para no perderte ninguna de mis nuevas creaciones!',
                url: 'https://www.printables.com/@raupulus_2109175',
            },
            {
                title: 'Maker World (Modelos Impresora 3D)',
                image: '/images/icons/social/bambulab.svg',
                description: 'Visita mi perfil en Maker World y descubre una variedad de modelos 3D originales. Te invito a seguirme para estar al tanto de mis últimas aportaciones al mundo de la impresión 3D.',
                url: 'https://makerworld.com/es/@raupulus',
            }

        ]
    },
    {
        title: 'Social',
        networks: [
            {
                title: 'Twitter',
                image: '/images/icons/social/twitter.svg',
                description: 'Sigue mis publicaciones y mantente al tanto de mis actividades en Twitter, donde suelo estar más activo.',
                url: 'https://twitter.com/raupulus',
            },
            {
                title: 'Mastodon',
                image: '/images/icons/social/mastodon.svg',
                description: 'Conéctate conmigo en Mastodon para seguir mis publicaciones y actualizaciones.',
                url: 'https://mastodon.online/@raupulus',
            },
            {
                title: 'Facebook',
                image: '/images/icons/social/facebook.svg',
                description: 'Sigue mis publicaciones y actualizaciones en mi perfil de Facebook.',
                url: 'https://www.facebook.com/raupulus/',
            },
            {
                title: 'Instagram',
                image: '/images/icons/social/instagram.svg',
                description: 'Descubre mis publicaciones y fotografías en Instagram, donde comparto proyectos y algunas imágenes de mis cámaras.',
                url: 'https://www.instagram.com/raupulus/',
            },

        ]
    },
    {
        title: 'Streaming y Vídeos',
        networks: [
            {
                title: 'Youtube (Raul Caro Pastorino)',
                image: '/images/icons/social/youtube.svg',
                description: 'Mira mis vídeos en mi canal de YouTube y suscríbete para contenido relacionado con programación, tecnología, diseño, y más.',
                url: 'https://www.youtube.com/@raupulus',
            },
            {
                title: 'Youtube (La Guía Linux)',
                image: '/images/icons/social/youtube.svg',
                description: 'Explora vídeos sobre software libre en mi canal de YouTube y suscríbete.',
                url: 'https://www.youtube.com/c/Laguialinux',
            },
            {
                title: 'Twitch',
                image: '/images/icons/social/twitch.svg',
                description: 'Únete a mis directos en Twitch y suscríbete para no perderte ningún stream.',
                url: 'https://www.twitch.tv/raupulus',
            },
            {
                title: 'TikTok',
                image: '/images/icons/social/tiktok.svg',
                description: 'Sigue mis vídeos en TikTok y mantente al tanto de mis nuevas publicaciones.',
                url: 'https://www.tiktok.com/@raupulus',
            },
        ]
    },
    {
        title: 'Difusión',
        networks: [
            {
                title: 'Telegram Canal Raupulus Diffusion',
                image: '/images/icons/social/telegram.svg',
                description: 'Únete a mi canal de Telegram donde comparto todo relacionado con tecnología, software libre y GNU/Linux, además de los desarrollos en los que estoy involucrado.',
                url: 'https://t.me/raupulus_diffusion',
            },
            {
                title: 'Telegram Canal AI Automations Experimental',
                image: '/images/icons/social/telegram.svg',
                description: 'Este canal es para un proyecto donde creo contenido con inteligencia artificial y lo comparto automáticamente en redes. En este canal encontrarás imágenes y vídeos creados así',
                url: 'https://t.me/ai_automations_experimental',
            },
            {
                title: 'Telegram Canal La Guía Linux',
                image: '/images/icons/social/telegram.svg',
                description: 'Canal de Difusión oficial sobre Guías y vídeotutoriales GNU/Linux por el proyecto LaGuiaLinux LGL',
                url: 'https://t.me/laguialinux',
            },
        ]
    },
];

</script>

<template>
    <section>
        <div class="text-center">
            <h1>
                Mis
                <span class="text-primary font-bold">
                    Redes Sociales
                </span>
            </h1>
        </div>

        <div v-for="group in groups" class="box-group">
            <div class="box-group-title">
                <h2>{{ group.title }}</h2>
            </div>

            <div v-for="network in group.networks" class="box-service">
                <div class="box-image">
                    <NuxtImg :src="network.image" />
                </div>

                <div>
                    <h3 class="title">{{ network.title }}</h3>
                    <p>{{ network.description }}</p>
                </div>

                <div class="box-btns">
                    <BtnGeneric text="Ir" :title="network.title" :to="network.url" width="50px" target="_blank" />
                </div>

            </div>

        </div>
    </section>
</template>


<style scoped>
.box-group-title {
    width: 70%;
    text-align: right;
    padding: 0.3rem 3rem;
    background-color: red;
    border-radius: 0 1.3rem 1.3rem 0;
    background-color: var(--primary);
    color: var(--white);
}

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
    margin: auto;
    padding: 0.3rem;
    width: 120px;
    text-align: center;
    box-sizing: border-box;
}

.box-image img {
    width: 100%;
}

.box-btns {
    text-align: center;
}

@media (max-width: 600px) {
    .box-service {
        display: grid;
        max-width: 90%;
        grid-template-columns: 1fr;
        gap: 0;
        padding: 5px;
        border-radius: 8px;
    }

    .title {
        text-align: center;
    }

    .box-btns {
        text-align: center;
    }
}
</style>
