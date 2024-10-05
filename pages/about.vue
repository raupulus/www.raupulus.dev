<script lang="ts" setup>

const config = useRuntimeConfig();

const url = config.public.app.url;
const title = 'Sobre mí - Raúl Caro Pastorino | Desarrollador Web Full Stack Backend';
const description = 'Conoce a Raúl Caro Pastorino, un experimentado desarrollador web full stack especializado en backend. Descubre mi trayectoria profesional, habilidades destacadas y proyectos realizados.';
const keywords = 'sobre mí, Raúl Caro Pastorino, desarrollador web, full stack, backend, proyectos, experiencia, habilidades';

useHead({
    title: title,
    meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url + '/about' },
        { property: 'og:image', content: url + '/social/about.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: url + '/social/about.webp' }
    ]
});

</script>

<template>
    <section>
        <div>
            <h2 class="text-center">
                Sobre
                <span class="text-primary font-bold">
                    Mi
                </span>
            </h2>
        </div>

        <div class="box-description">
            <div>

                <div class="box-text">
                    <p>
                        Soy un desarrollador backend con amplia experiencia en PHP y Laravel.
                    </p>

                    <p>
                        A lo largo de mi carrera
                        he trabajado en una variedad de proyectos, desde pequeños sitios web hasta grandes aplicaciones
                        empresariales.
                    </p>

                    <p>
                        Tengo un profundo
                        conocimiento con el stack sobre linux en paneles de gestión,
                        stockage de productos, apis, bases de datos, optimización de rendimiento, servidores vps,
                        sistemas de caché...
                    </p>

                    <p>
                        En este portfolio/portal, encontrará una selección de mis proyectos más recientes que puedo
                        publicar
                        (muchos elaborados para empresas privadas o junto a otros freelances no puedo publicarlos o
                        adjuntarlos por contrato), así como mi
                        currículum vitae y mis datos de contacto.
                    </p>

                    <p>
                        Le invito a explorar mi trabajo y a ponerse en
                        contacto conmigo si tiene alguna pregunta o si desea discutir un posible proyecto.
                    </p>

                    <p>
                        Mis habilidades clave incluyen:
                    </p>

                    <ul>
                        <li>Desarrollo backend principalmente con PHP, Laravel, javascript, vuejs</li>
                        <li>Creación de APIs</li>
                        <li>Gestión de bases de datos MySQL y PostgreSQL</li>
                        <li>Optimización del rendimiento</li>
                        <li>Implementación de prácticas de seguridad</li>
                        <li>Trabajo en equipo y comunicación</li>
                    </ul>

                    <p>
                        Estoy apasionado por:
                    </p>

                    <ul>
                        <li>Crear aplicaciones web robustas y escalables</li>
                        <li>Aprender nuevas tecnologías</li>
                        <li>Resolver problemas complejos</li>
                        <li>Ayudar a otros a tener éxito</li>
                        <li>La experiencia de trabajar y compartir proyecto con otros desarrolladores</li>
                        <li>Inteligencia Artificial</li>
                        <li>IOT (Internet de las cosas)</li>
                        <li>Automatizaciones</li>
                    </ul>
                </div>

                <div class="box-buttons">
                    <BtnGeneric to="https://curriculum.raupulus.dev" text="Curriculum Vitae"
                        title="Enlace a mi Curriculum Vitae" />
                </div>
            </div>

            <div class="box-image">
                <img src="@/assets/images/about.webp" alt="Imagen de Raúl Caro Pastorino">
            </div>
        </div>
    </section>
</template>

<style scoped>
.box-description {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 100px;
}

.box-text {
    font-size: 1.2rem;
    line-height: 2.5rem;
}

.box-image {
    width: 100%;
    overflow: hidden;
    border-radius: 20px;
    align-self: center;
}

.box-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

@media (max-width: 920px) {
    .box-description {
        display: block;
        grid-template-columns: none;
        gap: 0;
    }

    .box-image {
        width: 80%;
        margin: 3rem auto 2rem auto;
    }

    .box-buttons {
        text-align: center;
    }
}
</style>
