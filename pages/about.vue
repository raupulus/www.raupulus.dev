import { BtnGeneric } from '../.nuxt/components';
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

// Define the type for gallery paths
interface GalleryPath {
    thumbnail: string;
    image: string;
}

// Initialize galleryPaths with the type
const galleryPaths: GalleryPath[] = [];

// Function to generate gallery paths
const generateGalleryPaths = (): GalleryPath[] => {
    const basePath = '/images/pages/about/gallery/';

    // Cantidad de imágenes en la galería
    const quantity = 44;

    for (let i = 0; i < quantity; i++) {
        galleryPaths.push({
            thumbnail: `${basePath}${i + 1}_250px.webp`,
            image: `${basePath}${i + 1}_1280px.webp`,
        });
    }

    return galleryPaths;
};

// Call the function to generate paths
generateGalleryPaths();

const showImageSlide = (idx: number) => {
    console.log(idx)
    alert('Galería de imágenes aún no implementada: Work In Progress');
}

</script>

<template>
    <section>
        <div>
            <h1 class="text-center">
                Sobre
                <span class="text-primary font-bold">
                    Mi
                </span>
            </h1>
        </div>


        <div class="box-about-content">
            <div class="box-about-main">
                <div class="about-description">
                    <div>
                        <p>
                            Soy un desarrollador backend con amplia experiencia en PHP,
                            <strong>Laravel</strong>, Javascript y
                            PostgreSQL.
                        </p>

                        <p>
                            A lo largo de mi carrera he trabajado en una variedad de proyectos, desde pequeños sitios
                            web hasta grandes aplicaciones empresariales.
                        </p>

                        <p>
                            Tengo un profundo conocimiento con el stack sobre <strong>linux</strong> desde
                            <strong>terminal</strong> y
                            con
                            paneles de gestión, stockage de productos, tiendas, web empresariales,
                            <strong>apis</strong>, bases de datos,
                            optimización de rendimiento, servidores vps, <strong>consumo de servicios</strong>
                            (streaming,
                            plataformas de
                            pago, AI...), sistemas de caché...
                        </p>
                    </div>
                </div>

                <div class="about-callout">
                    <div>
                        <BtnGeneric to="https://curriculum.raupulus.dev" text="Descargar CV" class="btn-red"
                            title="Enlace a mi Curriculum Vitae en PDF" width="100%" target="_blank">
                            <template #before>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff" width="30px"
                                    style="display: block; text-align: center; margin: auto;">
                                    <path
                                        d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" />
                                </svg>
                            </template>
                        </BtnGeneric>

                        <BtnGeneric to="https://curriculum.raupulus.dev" text="Ver CV" target="_blank"
                            title="Enlace a mi Curriculum Vitae" width="100%" />
                    </div>

                    <div class="box-two-buttons">
                        <BtnGeneric to="https://www.linkedin.com/in/raulcaropastorino" text="Linkedin"
                            class="btn-color-blue-linkedin" title="Enlace a mi Linkedin" width="100%" target="_blank">
                            <template #before>
                                <svg class="fill-current social-icon-card text-color-blue"
                                    style="height: 22px; translate: -4px 4px;" viewBox="0 0 448 512" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
                                    <defs id="defs1" />
                                    <path
                                        d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                                        id="path1" style="fill:#fff;fill-opacity:1" />
                                </svg>
                            </template>
                        </BtnGeneric>

                        <BtnGeneric to="https://github.com/raupulus" class="btn-black" text="Github"
                            title="Enlace a mi GitHub" width="100%" target="_blank">
                            <template #before>
                                <svg xmlns="http://www.w3.org/2000/svg" class="social-icon-card fill-black-800"
                                    style="height: 22px; translate: -4px 4px;" viewBox="0 0 496 512" fill="#fff">
                                    <path
                                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z">
                                    </path>
                                </svg>
                            </template>
                        </BtnGeneric>
                    </div>
                </div>
            </div>
        </div>

        <div class="box-about-information">
            <p>
                En este
                <strong>portfolio/portal</strong>, encontrará mi currículum vitae, las vías para contactarme, una
                selección de
                mis proyectos más recientes y algunos trabajos que puedo publicar.
            </p>

            <p>
                Muchos trabajos elaborados para empresas privadas o junto a otros freelances no puedo publicarlos o
                adjuntarlos por confidencialidad.
            </p>

            <p>
                Le invito a explorar mi trabajo y a ponerse en contacto conmigo si tiene alguna pregunta o consultar
                sobre algún proyecto.
            </p>
        </div>

        <div class="box-about-skills box-about-card">
            <div class="about-skills about-card">
                <h3 class="about-card-title">Skills</h3>

                <div class="about-card-content">
                    <ul>
                        <li>Desarrollo backend principalmente con PHP, Laravel, javascript, vuejs</li>
                        <li>Creación de APIs</li>
                        <li>Gestión de bases de datos MySQL y PostgreSQL</li>
                        <li>Optimización del rendimiento</li>
                        <li>Implementación de prácticas de seguridad</li>
                        <li>Trabajo en equipo y comunicación</li>
                        <li>He trabajado antes con otros stacks y me adapto rápido</li>
                    </ul>
                </div>
            </div>

            <div class="about-passions about-card">
                <h3 class="about-card-title">Pasiones</h3>

                <div class="about-card-content">
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
            </div>
        </div>

        <!-- Imagen del entorno de trabajo con callout para ver CV -->
        <div class="box-about-work-environment">
            <div class="box-about-work-environment-image">

            </div>

            <div class="box-about-work-environment-callout">
                <div>
                    <NuxtImg src="/logo_128x128.webp" alt="Logotipo de Raúl Caro Pastorino"
                        title="Logotipo de Raúl Caro Pastorino" />
                </div>

                <div>
                    <BtnGeneric to="https://curriculum.raupulus.dev" text="Ver CV Online" target="_blank"
                        title="Enlace a mi Curriculum Vitae" />
                </div>
            </div>
        </div>

        <!-- Hobbies y pasatiempos -->
        <div class="box-about-hobbies box-about-card">
            <div class="about-hobbies about-card">
                <h3 class="about-card-title">Hobbies</h3>

                <div class="about-card-content">
                    <ul>
                        <li>Electrónica</li>
                        <li>Raspberry Pi</li>
                        <li>Inteligencia Artificial</li>
                        <li>Planificar nuevos proyectos</li>
                        <li>IOT con microcontroladores y sensores</li>
                        <li>Automatizar tareas en Linux y MacOS con scripts</li>
                        <li>Probar nuevas tecnologías software/hardware (nuevos microcontroladores, frameworks...)</li>
                    </ul>
                </div>
            </div>

            <div class="about-hobbies2 about-card">
                <h3 class="about-card-title">Pasatiempos</h3>

                <div class="about-card-content">
                    <ul>
                        <li>Fotografía</li>
                        <li>Diseño gráfico 2D</li>
                        <li>Correr por la Playa</li>
                        <li>Libros de fantasía, terror, historia...</li>
                        <li>Diseño y modelado 3D para proyectos</li>
                        <li>Ver Streamings de otros programadores y makers</li>
                        <li>Creación de contenido (Entradas en blogs/foros y vídeos)</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="box-about-gallery">
            <div v-for="(galleryPath, idx) in galleryPaths" :key="idx" class="about-gallery-item">
                <NuxtImg class="about-gallery-image" :src="galleryPath.thumbnail" @click="() => showImageSlide(idx)" />
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Caja principal para todo */
.box-about-content {
    height: 100%;
}

/* Bloque principal para descripción genérica */
.box-about-main {
    display: grid;
    padding: 10px 2rem;
    grid-template-columns: 1fr 340px;
    gap: 1.3rem;
    align-items: center;
    font-size: 1.3rem;
    background-color: #dedede;
    box-sizing: border-box;
    border-radius: 5px;
}

.box-two-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 0.3rem;
}

/* Información sobre este porfolio */
.box-about-information {
    margin-top: 1.3rem;
    padding: 10px 2rem;
    background-color: rgba(50, 114, 184, 0.1);
    font-size: 1.3rem;
    border-radius: 5px;
    border: 10px solid var(--primary);
    box-shadow: 1px 1px 15px #000;
    box-sizing: border-box;
}

/* Tarjetas a 2 por fila */
.box-about-card {
    position: relative;
    display: grid;
    margin-top: 1.3rem;
    padding: 1.3rem;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    border-radius: 0.6rem 0.6rem 0 0;
    gap: 1.3rem;
    box-sizing: border-box;
    font-size: 1.3rem;
}

.box-about-card>.about-card {
    height: 100%;
    background-color: #dedede;
    box-sizing: border-box;
    border-radius: 0.6rem 0.6rem 0 0;
}

.box-about-card>.about-card>.about-card-title {
    margin: 0;
    padding: 0.3rem 2rem;
    text-align: center;
    background-color: var(--primary);
    box-sizing: border-box;
    border-radius: 0.6rem 0.6rem 0 0;
    color: #fff;
    font-size: 1.9rem;
    font-weight: bold;
}

.box-about-card>.about-card>.about-card-content {
    position: relative;
    padding: 1.3rem;
    box-sizing: border-box;
}

.box-about-card>.about-card>.about-card-content li {
    list-style-type: none;
    /* Elimina el punto por defecto */
    position: relative;
    margin-bottom: 1rem;
    padding-left: 1.6rem;
    /* Ajusta según sea necesario */
}

.box-about-card>.about-card>.about-card-content li::before {
    content: url('/images/icons/success.svg');
    position: absolute;
    left: 0;
    top: 3px;
    /*top: 50%;*/
    /*transform: translateY(-50%);*/

    /* Ajustes adicionales */
    width: 22px;
    /* Ajusta según el tamaño de tu imagen */
    height: 22px;
    /* Ajusta según el tamaño de tu imagen */
}

/* Imagen del entorno de trabajo con callout */
.box-about-work-environment {
    display: grid;
    position: relative;
    margin-top: 1.3rem;
    width: 100%;
    height: 400px;
    text-align: center;
    grid-template-columns: 1fr;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
    background-image: url("/images/pages/about/work_environment.webp");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.box-about-work-environment>.box-about-work-environment-image {
    position: absolute;
    top: 0;
    left: 0;
}

.box-about-work-environment>.box-about-work-environment-callout {
    text-align: center;
}

/* Galería de imágenes */
.box-about-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-gap: 0.3rem;
    justify-items: center;
    align-items: center;
}

.about-gallery-item {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    /* La proporción de aspecto 16:9 (ajusta según necesites) */
    overflow: hidden;
}

.about-gallery-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease, opacity 0.3s ease;
    background-color: #fff;
    cursor: zoom-in;
}

.about-gallery-image:hover {
    transform: scale(1.1);
}

@media (max-width: 920px) {
    .box-about-main {
        grid-template-columns: 1fr;
    }

    .box-about-card {
        grid-template-columns: 1fr;
        padding: 0.3rem;
    }
}
</style>
