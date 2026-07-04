<script lang="ts" setup>
import type { GalleryPathType } from '@/types/GalleryPathType'

const config = useRuntimeConfig()
const url = config.public.app.url
const domainApi = config.public.api.domain
const urlToPdfCv = domainApi + '/cv/get/pdf/raupulus/default'

const title = 'Sobre mí - Raúl Caro Pastorino | Desarrollador Web Full Stack Backend'
const description = 'Conoce a Raúl Caro Pastorino, un experimentado desarrollador web full stack especializado en backend. Descubre mi trayectoria profesional, habilidades destacadas y proyectos realizados.'
const keywords = 'sobre mí, Raúl Caro Pastorino, desarrollador web, full stack, backend, proyectos, experiencia, habilidades'

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
})

// Genera las rutas de la galería de imágenes
const galleryPaths: GalleryPathType[] = []
const generateGalleryPaths = (): GalleryPathType[] => {
    const basePath = '/images/pages/about/gallery/'
    const quantity = 50
    for (let i = 0; i < quantity; i++) {
        galleryPaths.push({
            thumbnail: `${basePath}${i + 1}_250px.webp`,
            image: `${basePath}${i + 1}_1280px.webp`,
        })
    }
    return galleryPaths
}
generateGalleryPaths()

const showImageModal = ref(false)
const selectedIndex = ref(0)

const showImageSlide = (idx: number) => {
    selectedIndex.value = idx
    showImageModal.value = true
}

// Datos estáticos de skills, pasiones, hobbies y pasatiempos
const skills = [
    'Desarrollo backend principalmente con PHP, Laravel, javascript, vuejs',
    'Creación de APIs',
    'Gestión de bases de datos MySQL y PostgreSQL',
    'Optimización del rendimiento',
    'Implementación de prácticas de seguridad',
    'Trabajo en equipo y comunicación',
    'He trabajado antes con otros stacks y me adapto rápido',
]

const passions = [
    'Crear aplicaciones web robustas y escalables',
    'Aprender nuevas tecnologías',
    'Resolver problemas complejos',
    'Ayudar a otros a tener éxito',
    'La experiencia de trabajar y compartir proyecto con otros desarrolladores',
    'Inteligencia Artificial',
    'IOT (Internet de las cosas)',
    'Automatizaciones',
]

const hobbies = [
    'Electrónica',
    'Raspberry Pi',
    'Inteligencia Artificial',
    'Planificar nuevos proyectos',
    'IOT con microcontroladores y sensores',
    'Automatizar tareas en Linux y MacOS con scripts',
    'Probar nuevas tecnologías software/hardware (nuevos microcontroladores, frameworks...)',
]

const pastimes = [
    'Fotografía',
    'Diseño gráfico 2D',
    'Correr por la Playa',
    'Libros de fantasía, terror, historia...',
    'Diseño y modelado 3D para proyectos',
    'Ver Streamings de otros programadores y makers',
    'Creación de contenido (Entradas en blogs/foros y vídeos)',
]
</script>

<template>
    <div class="min-h-screen bg-background">

        <!-- ===== CABECERA ===== -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <span class="font-label text-tertiary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                <span class="w-8 h-[1px] bg-tertiary"/>
                Perfil Personal
            </span>
            <h1 class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6">
                Sobre <span class="text-on-surface-variant font-light">Mí</span>
            </h1>
        </div>

        <!-- ===== DESCRIPCIÓN PRINCIPAL + BOTONES ===== -->
        <section class="px-8 pb-16 max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                <!-- Descripción -->
                <div class="lg:col-span-2 p-10 bg-surface-container-high rounded-xl border border-outline-variant/20">
                    <p class="text-on-surface-variant text-lg leading-relaxed mb-4">
                        Soy un desarrollador backend con amplia experiencia en PHP,
                        <strong class="text-on-surface">Laravel</strong>, Javascript y PostgreSQL.
                    </p>
                    <p class="text-on-surface-variant text-lg leading-relaxed mb-4">
                        A lo largo de mi carrera he trabajado en una variedad de proyectos, desde pequeños sitios
                        web hasta grandes aplicaciones empresariales.
                    </p>
                    <p class="text-on-surface-variant text-lg leading-relaxed">
                        Tengo un profundo conocimiento con el stack sobre <strong class="text-on-surface">linux</strong> desde
                        <strong class="text-on-surface">terminal</strong> y con paneles de gestión, stockage de productos,
                        tiendas, web empresariales, <strong class="text-on-surface">apis</strong>, bases de datos,
                        optimización de rendimiento, servidores vps,
                        <strong class="text-on-surface">consumo de servicios</strong> (streaming, plataformas de pago, AI...),
                        sistemas de caché...
                    </p>
                </div>

                <!-- Botones CV y redes -->
                <div class="flex flex-col gap-4">
                    <a
                        :href="urlToPdfCv"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Enlace a mi Curriculum Vitae en PDF"
                        class="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-widest uppercase rounded-lg hover:scale-95 transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="w-5 h-5">
                            <path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z"/>
                        </svg>
                        Descargar CV
                    </a>

                    <a
                        href="https://curriculum.raupulus.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Enlace a mi Curriculum Vitae"
                        class="flex items-center justify-center gap-3 px-6 py-4 bg-surface-container-high border border-outline-variant/30 hover:border-primary text-on-surface font-headline font-bold text-sm tracking-widest uppercase rounded-lg transition-all duration-300"
                    >
                        <UiMaterialIcon class="text-primary" name="open_in_new" />
                        Ver CV Online
                    </a>

                    <div class="grid grid-cols-2 gap-3 mt-2">
                        <a
                            href="https://www.linkedin.com/in/raulcaropastorino"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Enlace a mi Linkedin"
                            class="flex items-center justify-center gap-2 px-4 py-3 bg-[#0077b5] text-white font-headline font-bold text-xs tracking-widest uppercase rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 448 512">
                                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/>
                            </svg>
                            Linkedin
                        </a>
                        <a
                            href="https://github.com/raupulus"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Enlace a mi GitHub"
                            class="flex items-center justify-center gap-2 px-4 py-3 bg-[#24292e] text-white font-headline font-bold text-xs tracking-widest uppercase rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 496 512">
                                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"/>
                            </svg>
                            Github
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== INFO SOBRE EL PORTFOLIO ===== -->
        <section class="px-8 pb-16 max-w-7xl mx-auto">
            <div class="p-10 bg-primary/5 border-2 border-primary rounded-xl">
                <p class="text-on-surface-variant text-lg leading-relaxed mb-4">
                    En este <strong class="text-on-surface">portfolio/portal</strong>, encontrará mi currículum vitae,
                    las vías para contactarme, una selección de mis proyectos más recientes y algunos trabajos que puedo publicar.
                </p>
                <p class="text-on-surface-variant text-lg leading-relaxed mb-4">
                    Muchos trabajos elaborados para empresas privadas o junto a otros freelances no puedo publicarlos o
                    adjuntarlos por confidencialidad.
                </p>
                <p class="text-on-surface-variant text-lg leading-relaxed">
                    Le invito a explorar mi trabajo y a ponerse en contacto conmigo si tiene alguna pregunta o consultar
                    sobre algún proyecto.
                </p>
            </div>
        </section>

        <!-- ===== SKILLS Y PASIONES ===== -->
        <section class="px-8 pb-16 max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Skills -->
                <div class="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20">
                    <div class="px-8 py-4 bg-primary">
                        <h3 class="font-headline text-xl font-bold text-on-primary tracking-tight">Skills</h3>
                    </div>
                    <ul class="p-8 space-y-3">
                        <li v-for="skill in skills" :key="skill" class="flex items-start gap-3 text-on-surface-variant">
                            <UiMaterialIcon class="text-tertiary text-sm mt-0.5 shrink-0" name="check_circle" />
                            {{ skill }}
                        </li>
                    </ul>
                </div>

                <!-- Pasiones -->
                <div class="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20">
                    <div class="px-8 py-4 bg-primary">
                        <h3 class="font-headline text-xl font-bold text-on-primary tracking-tight">Pasiones</h3>
                    </div>
                    <ul class="p-8 space-y-3">
                        <li v-for="passion in passions" :key="passion" class="flex items-start gap-3 text-on-surface-variant">
                            <UiMaterialIcon class="text-secondary text-sm mt-0.5 shrink-0" name="favorite" />
                            {{ passion }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- ===== ENTORNO DE TRABAJO ===== -->
        <section class="px-8 pb-16 max-w-7xl mx-auto">
            <div
                class="relative w-full h-80 rounded-xl overflow-hidden border border-outline-variant/20 flex items-center justify-center"
                style="background-image: url('/images/pages/about/work_environment.webp'); background-position: center; background-size: cover;"
            >
                <div class="absolute inset-0 bg-background/60"/>
                <div class="relative z-10 flex flex-col items-center gap-6">
                    <NuxtImg
                        src="/logo_128x128.webp"
                        alt="Logotipo de Raúl Caro Pastorino"
                        title="Logotipo de Raúl Caro Pastorino"
                        width="80"
                        height="80"
                        class="rounded-full border-2 border-primary"
                    />
                    <a
                        href="https://curriculum.raupulus.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Enlace a mi Curriculum Vitae"
                        class="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-widest uppercase rounded-lg hover:scale-95 transition-all duration-300"
                    >
                        Ver CV Online
                    </a>
                </div>
            </div>
        </section>

        <!-- ===== HOBBIES Y PASATIEMPOS ===== -->
        <section class="px-8 pb-16 max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Hobbies -->
                <div class="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20">
                    <div class="px-8 py-4 bg-tertiary-container">
                        <h3 class="font-headline text-xl font-bold text-on-tertiary-container tracking-tight">Hobbies</h3>
                    </div>
                    <ul class="p-8 space-y-3">
                        <li v-for="hobby in hobbies" :key="hobby" class="flex items-start gap-3 text-on-surface-variant">
                            <UiMaterialIcon class="text-tertiary text-sm mt-0.5 shrink-0" name="bolt" />
                            {{ hobby }}
                        </li>
                    </ul>
                </div>

                <!-- Pasatiempos -->
                <div class="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/20">
                    <div class="px-8 py-4 bg-tertiary-container">
                        <h3 class="font-headline text-xl font-bold text-on-tertiary-container tracking-tight">Pasatiempos</h3>
                    </div>
                    <ul class="p-8 space-y-3">
                        <li v-for="pastime in pastimes" :key="pastime" class="flex items-start gap-3 text-on-surface-variant">
                            <UiMaterialIcon class="text-secondary text-sm mt-0.5 shrink-0" name="star" />
                            {{ pastime }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- ===== GALERÍA ===== -->
        <section class="px-8 pb-24 max-w-7xl mx-auto">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
                <button
                    v-for="(galleryPath, idx) in galleryPaths"
                    :key="idx"
                    type="button"
                    class="relative w-full overflow-hidden cursor-zoom-in group"
                    style="padding-top: 56.25%;"
                    :aria-label="'Ampliar imagen ' + (idx + 1) + ' de la galería'"
                    @click="showImageSlide(idx)"
                >
                    <NuxtImg
                        class="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        width="250"
                        height="141"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        :alt="'Imagen ' + (idx + 1) + ' de la galería sobre mí'"
                        :src="galleryPath.thumbnail"
                    />
                </button>
            </div>
        </section>

        <!-- Modal de galería -->
        <ModalsImageSlide
            :show="showImageModal"
            :gallery-paths="galleryPaths"
            :selected-index="selectedIndex"
            @update:show="showImageModal = $event"
        />
    </div>
</template>

