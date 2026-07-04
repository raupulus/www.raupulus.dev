<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProjectsData, projectsDataSearch } from '@/composables/projectsData';
import { getPlatformData } from '@/composables/platformData';

const config = useRuntimeConfig();
const route = useRoute();
const slugs = Array.isArray(route.params.slugs) ? route.params.slugs : [];
const slugContent = ref(slugs[0]);
const slugPage = ref(slugs[1]);
const openProjetOnLoad = ref(false);

if (slugContent.value) {
    openProjetOnLoad.value = true;
}

const url = config.public.app.url;
const urlProjects = url + '/projects';
const title = 'Proyectos de Raúl Caro Pastorino';
const description = 'Explora una colección de proyectos destacados realizados por Raúl Caro Pastorino. Descubre innovaciones y desarrollos tecnológicos en diferentes áreas.';
const keywords = 'proyectos, Raúl Caro Pastorino, desarrollo, tecnología, innovaciones';
const imageProjects = url + '/social/projects.webp'

const metadatas = reactive({
    title: title,
    description: description,
    keywords: keywords,
    url: urlProjects,
    image: imageProjects,
});

useHead({
    title: metadatas.title,
    meta: [
        { name: 'description', content: metadatas.description },
        { name: 'keywords', content: metadatas.keywords },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: metadatas.title },
        { property: 'og:description', content: metadatas.description },
        { property: 'og:url', content: metadatas.url },
        { property: 'og:image', content: metadatas.image },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: metadatas.title },
        { name: 'twitter:description', content: metadatas.description },
        { name: 'twitter:image', content: metadatas.image }
    ]
});

const platformData = getPlatformData();
const { datas, hasMorePages, isLoading, fetchNextPage } = useProjectsData();

const searchInput = ref('');
const technologySelect = ref('');
const currentTechnology = ref();

// Actualiza la tecnología actual cuando cambia el slug seleccionado
watch(technologySelect, (currentSlug) => {
    currentTechnology.value = getTechnologyBySlug(currentSlug);
});

function btnSearch() {
    projectsDataSearch({
        search: searchInput.value,
        technology: technologySelect.value,
    });
}

function btnClear() {
    searchInput.value = '';
    technologySelect.value = '';
    projectsDataSearch();
}

function handleClickTechnology(params: any) {
    technologySelect.value = params.technologySelect;
    projectsDataSearch({
        search: searchInput.value,
        technology: technologySelect.value,
    });
}

// Actualiza el slug en la URL sin recargar la página
const handleChangeUrlSlug = (contentSlug: string | undefined, pageSlug: string | undefined) => {
    let newUrl = window.location.origin + '/projects';
    if (contentSlug) {
        slugContent.value = contentSlug;
        slugPage.value = pageSlug ?? '';
        const newSlug = pageSlug ? contentSlug + '/' + pageSlug : contentSlug;
        newUrl += '/' + newSlug;
    } else {
        slugContent.value = '';
        slugPage.value = '';
    }
    window.history.pushState({}, '', newUrl);
};

// Actualiza los metatags según el proyecto visualizado
const handleChangeMetatags = (
    newTitle: string | undefined,
    newDescription: string | undefined,
    newKeywords: string | undefined,
    newUrl: string | undefined,
    newImage: string | undefined
) => {
    metadatas.title = newTitle || title;
    metadatas.description = newDescription || description;
    metadatas.keywords = newKeywords || keywords;
    metadatas.url = newUrl || urlProjects;
    metadatas.image = newImage || imageProjects;
    useHead({
        title: metadatas.title,
        meta: [
            { name: 'description', content: metadatas.description },
            { name: 'keywords', content: metadatas.keywords },
            { name: 'robots', content: 'index, follow' },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: metadatas.title },
            { property: 'og:description', content: metadatas.description },
            { property: 'og:url', content: metadatas.url },
            { property: 'og:image', content: metadatas.image },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: metadatas.title },
            { name: 'twitter:description', content: metadatas.description },
            { name: 'twitter:image', content: metadatas.image }
        ]
    });
};
</script>

<template>
    <div class="min-h-screen bg-background">
        <!-- Cabecera de la sección -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <span class="font-label text-secondary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                <span class="w-8 h-[1px] bg-secondary"/>
                Engineering Repository
            </span>
            <h1 class="font-headline text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6 max-w-4xl break-words">
                ENGINEERING <span class="text-on-surface-variant font-light">SYSTEMS &amp;</span> ARCHITECTURES
            </h1>
            <p class="text-on-surface-variant text-lg max-w-2xl border-l-2 border-secondary pl-6 py-2">
                {{ description }}
            </p>
        </div>

        <!-- Sección de búsqueda y filtros -->
        <section class="px-8 pb-12 max-w-7xl mx-auto">
            <!-- Indicador de tecnología activa -->
            <div v-if="technologySelect && currentTechnology?.name" class="mb-6 flex items-center gap-3">
                <span class="font-label text-xs text-outline uppercase tracking-widest">Filtrando por:</span>
                <div class="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded border border-primary/30">
                    <NuxtImg
                        v-if="currentTechnology?.urlImageSmall"
                        :src="currentTechnology.urlImageSmall"
                        :alt="currentTechnology.name"
                        :title="currentTechnology.name"
                        width="20"
                        height="20"
                        class="w-5 h-5 object-contain"
                    />
                    <span class="font-headline font-bold text-sm text-primary">{{ currentTechnology?.name }}</span>
                    <button class="ml-2 text-outline hover:text-error transition-colors" aria-label="Quitar filtro de tecnología" @click="btnClear">
                        <UiMaterialIcon class="text-sm" name="close" />
                    </button>
                </div>
            </div>

            <!-- Barra de búsqueda -->
            <div class="flex gap-3 mb-8">
                <div class="flex-1 relative max-w-xl">
                    <input
                        v-model="searchInput"
                        type="search"
                        name="search"
                        aria-label="Buscar proyecto"
                        placeholder="Buscar proyecto..."
                        class="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-secondary outline-none px-4 py-3 text-on-surface font-body placeholder:text-outline transition-colors"
                        @keydown.enter="btnSearch"
                    >
                    <UiMaterialIcon class="absolute right-3 top-1/2 -translate-y-1/2 text-outline" name="search" />
                </div>
                <button
                    class="px-6 py-3 bg-primary text-on-primary font-headline font-bold text-xs tracking-widest uppercase rounded hover:bg-primary-container transition-colors"
                    @click="btnSearch"
                >
                    Buscar
                </button>
                <button
                    class="px-4 py-3 border border-outline-variant hover:border-error text-outline hover:text-error rounded transition-colors"
                    title="Limpiar búsqueda"
                    aria-label="Limpiar búsqueda"
                    @click="btnClear"
                >
                    <UiMaterialIcon class="text-sm" name="delete_sweep" />
                </button>
            </div>

            <!-- Filtro de tecnologías -->
            <div class="mb-4">
                <h3 class="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-4">
                    Filter by Ecosystem
                </h3>
                <GridTechnologies
                    :technologies="platformData?.technologies"
                    :technology-select="technologySelect"
                    @click-technology-select="handleClickTechnology"
                />
            </div>
        </section>

        <!-- Grid de proyectos -->
        <section class="px-8 pb-24 max-w-7xl mx-auto">
            <!-- Contador de resultados -->
            <div v-if="datas.pagination?.totalElements" class="mb-8 flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"/>
                <span class="font-label text-xs text-outline uppercase tracking-widest">
                    {{ datas.pagination.totalElements }} proyectos encontrados
                </span>
            </div>

            <!-- Componente de grid de proyectos -->
            <GridProjects
                v-if="datas?.contents"
                :projects="datas?.contents"
                :slug-content="slugContent"
                :slug-page="slugPage"
                :open-projet-on-load="openProjetOnLoad"
                @slugchange="handleChangeUrlSlug"
                @metatagchange="handleChangeMetatags"
            />

            <!-- Botón cargar más -->
            <div v-if="hasMorePages" class="mt-20 flex flex-col items-center">
                <button
                    :disabled="isLoading"
                    class="group flex items-center gap-4 px-10 py-4 bg-surface-container-highest border border-outline-variant/30 rounded hover:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="() => fetchNextPage()"
                >
                    <span class="text-sm font-label uppercase tracking-[0.3em] font-bold">
                        {{ isLoading ? 'Cargando...' : 'Cargar más proyectos' }}
                    </span>
                    <UiMaterialIcon
                        class="text-secondary transition-transform duration-500"
                        :class="isLoading ? 'animate-spin' : 'group-hover:rotate-180'"
                        name="sync"
                    />
                </button>
            </div>
        </section>
    </div>
</template>
