<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProjectsData, projectsDataSearch, useGetProjectBySlug } from '@/composables/projectsData'
import { getPlatformData } from '@/composables/platformData'
import type { ApiResponseType } from '@/types/ApiResponse'
import type { ContentPageType } from '@/types/ContentPageType'

const config = useRuntimeConfig()
const route = useRoute()
const siteUrl = config.public.app.url

const slugs = computed(() => (Array.isArray(route.params.slugs) ? route.params.slugs : []))
const isDetail = computed(() => slugs.value.length > 0)
const projectSlug = computed(() => slugs.value[0] || '')
const pageSlug = computed(() => slugs.value[1] || '')

// ==========================================
// MODO DETALLE: Carga estática de proyecto
// ==========================================
const { data: project } = await useAsyncData(
    () => `project-detail-${projectSlug.value}`,
    () => {
        if (!projectSlug.value) return Promise.resolve(null)
        return useGetProjectBySlug(projectSlug.value)
    },
    {
        watch: [projectSlug],
    }
)

if (isDetail.value && !project.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Proyecto no encontrado',
        fatal: true,
    })
}

const { data: activePage } = await useAsyncData(
    () => `project-page-${projectSlug.value}-${pageSlug.value || 'first'}`,
    async () => {
        if (!project.value) return null
        if (!pageSlug.value && project.value.first_page) {
            return normalizePage(project.value.first_page)
        }
        const targetIndex = pageSlug.value
            ? project.value.pages?.find(p => p.slug === pageSlug.value)
            : (project.value.pages?.find(p => p.order === 1) || project.value.pages?.[0])

        if (!targetIndex) return null

        if (targetIndex.order === 1 && project.value.first_page) {
            return normalizePage(project.value.first_page)
        }

        const API_BASE = useApiBase()
        const url = `${API_BASE}/platforms/${PLATFORM_SLUG}/contents/${encodeURIComponent(projectSlug.value)}/pages/${targetIndex.order}?format=editorjs`
        try {
            const res = await $fetch<ApiResponseType<ContentPageType>>(url, {
                headers: { Accept: 'application/json' },
            })
            return res?.data ? normalizePage(res.data) : null
        } catch {
            return null
        }
    },
    {
        watch: [projectSlug, pageSlug, project],
    }
)

if (isDetail.value && pageSlug.value && !activePage.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Página del proyecto no encontrada',
        fatal: true,
    })
}

const allPages = computed(() => {
    if (!project.value?.pages?.length) return []
    return [...project.value.pages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

const currentPageIndex = computed(() => {
    if (!allPages.value.length || !activePage.value) return -1
    return allPages.value.findIndex(p => p.slug === activePage.value?.slug)
})

const prevPageLink = computed(() => {
    const idx = currentPageIndex.value
    if (idx <= 0) return null
    const prev = allPages.value[idx - 1]
    if (!prev) return null
    return {
        title: prev.title,
        to: prev.order === 1 ? `/projects/${project.value!.slug}/` : `/projects/${project.value!.slug}/${prev.slug}/`,
    }
})

const nextPageLink = computed(() => {
    const idx = currentPageIndex.value
    if (idx < 0 || idx >= allPages.value.length - 1) return null
    const next = allPages.value[idx + 1]
    if (!next) return null
    return {
        title: next.title,
        to: `/projects/${project.value!.slug}/${next.slug}/`,
    }
})

// ==========================================
// MODO CATÁLOGO: Búsqueda y filtrado
// ==========================================
const router = useRouter()
const platformData = getPlatformData()
const { datas, hasMorePages, isLoading, fetchNextPage } = useProjectsData()

const searchInput = ref((route.query.q as string) || '')
const technologySelect = ref((route.query.tech as string) || '')
const currentTechnology = ref(technologySelect.value ? getTechnologyBySlug(technologySelect.value) : undefined)

const syncQuery = () => {
    if (!isDetail.value) {
        router.replace({
            query: {
                ...route.query,
                q: searchInput.value.trim() || undefined,
                tech: technologySelect.value || undefined,
            },
        })
    }
}

const performSearch = () => {
    syncQuery()
    if (!searchInput.value.trim() && !technologySelect.value) {
        projectsDataSearch()
    } else {
        projectsDataSearch({
            search: searchInput.value.trim(),
            technology: technologySelect.value,
        })
    }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchInput, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        performSearch()
    }, 300)
})

watch(technologySelect, (currentSlug) => {
    currentTechnology.value = getTechnologyBySlug(currentSlug)
    performSearch()
})

onMounted(() => {
    if (!isDetail.value && (route.query.q || route.query.tech)) {
        performSearch()
    }
})

function btnSearch() {
    if (debounceTimer) clearTimeout(debounceTimer)
    performSearch()
}

function btnClear() {
    if (debounceTimer) clearTimeout(debounceTimer)
    searchInput.value = ''
    technologySelect.value = ''
    currentTechnology.value = undefined
    syncQuery()
    projectsDataSearch()
}

function handleClickTechnology(params: { technologySelect: string }) {
    technologySelect.value = params.technologySelect
}

// ==========================================
// METATAGS Y SEO
// ==========================================
const catalogTitle = 'Proyectos de Raúl Caro Pastorino'
const catalogDescription = 'Aquí encontrarás mis proyectos personales: desarrollo web, IoT con Raspberry Pi y ESP32, herramientas y experimentos. La mayoría publicados como software libre con su código y documentación.'
const catalogKeywords = 'proyectos, Raúl Caro Pastorino, desarrollo, tecnología, innovaciones'
const catalogImage = `${siteUrl}/social/projects.webp`

const currentUrl = computed(() => {
    if (!isDetail.value || !project.value) {
        return `${siteUrl}/projects/`
    }
    return pageSlug.value
        ? `${siteUrl}/projects/${project.value.slug}/${pageSlug.value}/`
        : `${siteUrl}/projects/${project.value.slug}/`
})

const pageTitle = computed(() => {
    if (!isDetail.value || !project.value) {
        return catalogTitle
    }
    if (pageSlug.value && activePage.value?.title) {
        return `${activePage.value.title} · ${project.value.title} · Raúl Caro Pastorino`
    }
    return `${project.value.title} · Proyectos · Raúl Caro Pastorino`
})

const pageDescription = computed(() => {
    if (!isDetail.value || !project.value) {
        return catalogDescription
    }
    return project.value.excerpt || project.value.seo_description || `Detalle del proyecto ${project.value.title}`
})

const pageKeywords = computed(() => {
    if (!isDetail.value || !project.value) {
        return catalogKeywords
    }
    const meta = buildProjectMetatags(project.value, activePage.value || undefined, siteUrl)
    return meta.keywords || catalogKeywords
})

const pageImage = computed(() => {
    if (!isDetail.value || !project.value) {
        return catalogImage
    }
    return imageUrl(project.value.image, 'large') || catalogImage
})

const breadcrumbSchema = computed(() => {
    const items = [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Inicio',
            item: `${siteUrl}/`,
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Proyectos',
            item: `${siteUrl}/projects/`,
        },
    ]

    if (isDetail.value && project.value) {
        items.push({
            '@type': 'ListItem',
            position: 3,
            name: project.value.title,
            item: `${siteUrl}/projects/${project.value.slug}/`,
        })

        if (pageSlug.value && activePage.value?.title) {
            items.push({
                '@type': 'ListItem',
                position: 4,
                name: activePage.value.title,
                item: currentUrl.value,
            })
        }
    }

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items,
    }
})

const projectSchema = computed(() => {
    if (!isDetail.value || !project.value) {
        return {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: catalogTitle,
            url: `${siteUrl}/projects/`,
            description: catalogDescription,
        }
    }

    const isCode = !!(project.value.metadata?.github || project.value.metadata?.gitlab)
    return {
        '@context': 'https://schema.org',
        '@type': isCode ? 'SoftwareSourceCode' : 'CreativeWork',
        name: project.value.title,
        headline: activePage.value?.title || project.value.title,
        description: pageDescription.value,
        url: currentUrl.value,
        image: pageImage.value,
        datePublished: project.value.published_at || project.value.created_at,
        dateModified: project.value.updated_at,
        inLanguage: 'es',
        author: {
            '@type': 'Person',
            name: 'Raúl Caro Pastorino',
            url: siteUrl,
        },
        ...(isCode
            ? {
                codeRepository: project.value.metadata?.github || project.value.metadata?.gitlab,
                programmingLanguage: project.value.technologies?.map(t => t.name),
            }
            : {}),
    }
})

useHead(() => ({
    title: pageTitle.value,
    meta: [
        { name: 'description', content: pageDescription.value },
        { name: 'keywords', content: pageKeywords.value },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: isDetail.value ? 'article' : 'website' },
        { property: 'og:title', content: pageTitle.value },
        { property: 'og:description', content: pageDescription.value },
        { property: 'og:url', content: currentUrl.value },
        { property: 'og:image', content: pageImage.value },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle.value },
        { name: 'twitter:description', content: pageDescription.value },
        { name: 'twitter:image', content: pageImage.value },
    ],
    link: [
        { rel: 'canonical', href: currentUrl.value },
    ],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(breadcrumbSchema.value),
        },
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(projectSchema.value),
        },
    ],
}))
</script>

<template>
    <div class="min-h-screen bg-background">
        <!-- ============================================== -->
        <!-- MODO CATÁLOGO: /projects/                      -->
        <!-- ============================================== -->
        <template v-if="!isDetail">
            <!-- Cabecera de la sección -->
            <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
                <span class="font-label text-secondary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                    <span class="w-8 h-[1px] bg-secondary" />
                    Portfolio de Proyectos
                </span>
                <h1 class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6 max-w-4xl">
                    Mis <span class="text-on-surface-variant font-light">Proyectos</span>
                </h1>
                <p class="text-on-surface-variant text-lg max-w-2xl border-l-2 border-secondary pl-6 py-2">
                    {{ catalogDescription }}
                </p>
            </div>

            <!-- Sección de búsqueda y filtros -->
            <section class="px-8 pb-12 max-w-7xl mx-auto">
                <!-- Indicador de tecnología activa -->
                <div v-if="technologySelect && currentTechnology?.name" class="mb-6 flex items-center gap-3">
                    <span class="font-label text-xs text-outline uppercase tracking-widest">Filtrando por:</span>
                    <div class="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded border border-primary/30">
                        <NuxtImg
                            v-if="currentTechnology?.image"
                            :src="currentTechnology.image"
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
                            class="w-full bg-surface-container-lowest border-b-2 border-outline-variant focus:border-secondary outline-none pl-4 pr-10 py-3 text-on-surface font-body placeholder:text-outline transition-colors"
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
                    <h2 class="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-4">
                        Filtrar por tecnología
                    </h2>
                    <GridTechnologies
                        :technologies="platformData?.technologies"
                        :technology-select="technologySelect"
                        @click-technology-select="handleClickTechnology"
                    />
                </div>
            </section>

            <!-- Grid de proyectos -->
            <section class="px-8 pb-24 max-w-7xl mx-auto">
                <h2 class="sr-only">Catálogo de Proyectos</h2>

                <!-- Contador de resultados -->
                <div v-if="datas.meta?.total" class="mb-8 flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                    <span class="font-label text-xs text-outline uppercase tracking-widest">
                        {{ datas.meta.total }} proyectos encontrados
                    </span>
                </div>

                <!-- Componente de grid de proyectos -->
                <GridProjects
                    v-if="datas?.contents"
                    :projects="datas?.contents"
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
        </template>

        <!-- ============================================== -->
        <!-- MODO DETALLE: /projects/:slug/                 -->
        <!-- ============================================== -->
        <template v-else-if="project">
            <!-- Migas de pan accesibles -->
            <nav aria-label="Migas de pan" class="pt-8 pb-4 px-4 sm:px-8 max-w-5xl mx-auto">
                <ol class="flex items-center flex-wrap gap-2 text-xs font-label uppercase tracking-widest text-outline">
                    <li>
                        <NuxtLink to="/" class="hover:text-primary transition-colors">Inicio</NuxtLink>
                    </li>
                    <li aria-hidden="true">
                        <span class="text-outline-variant">/</span>
                    </li>
                    <li>
                        <NuxtLink to="/projects/" class="hover:text-primary transition-colors">Proyectos</NuxtLink>
                    </li>
                    <li aria-hidden="true">
                        <span class="text-outline-variant">/</span>
                    </li>
                    <li v-if="!pageSlug" class="text-primary truncate font-bold" aria-current="page">
                        {{ project.title }}
                    </li>
                    <template v-else>
                        <li>
                            <NuxtLink :to="`/projects/${project.slug}/`" class="hover:text-primary transition-colors truncate max-w-[200px] inline-block align-bottom">
                                {{ project.title }}
                            </NuxtLink>
                        </li>
                        <li aria-hidden="true">
                            <span class="text-outline-variant">/</span>
                        </li>
                        <li class="text-primary truncate font-bold" aria-current="page">
                            {{ activePage?.title }}
                        </li>
                    </template>
                </ol>
            </nav>

            <!-- Enlace volver a catálogo -->
            <div class="px-4 sm:px-8 max-w-5xl mx-auto mb-6">
                <NuxtLink
                    to="/projects/"
                    class="inline-flex items-center gap-2 text-xs font-label uppercase tracking-widest text-secondary hover:text-primary transition-colors group"
                >
                    <UiMaterialIcon name="arrow_forward" class="rotate-180 text-sm transition-transform group-hover:-translate-x-1" />
                    Volver al catálogo de proyectos
                </NuxtLink>
            </div>

            <!-- Cabecera del proyecto -->
            <header class="px-4 sm:px-8 max-w-5xl mx-auto mb-10">
                <div class="relative bg-surface-container-high rounded-2xl border border-outline-variant/30 overflow-hidden p-6 sm:p-10 shadow-xl">
                    <!-- Fondo difuminado decorativo con la imagen del proyecto -->
                    <div
                        v-if="project.image"
                        class="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xl pointer-events-none"
                        :style="{ backgroundImage: `url(${imageUrl(project.image, 'large')})` }"
                    />

                    <div class="relative z-10">
                        <!-- Fecha y categoría -->
                        <div class="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs font-label uppercase tracking-widest">
                            <span v-if="project.published_at || project.created_at" class="text-outline">
                                {{ formatDate(project.published_at ?? project.created_at) }}
                            </span>
                            <span v-if="project.taxonomies?.categories?.[0]" class="px-3 py-1 bg-surface-container-highest rounded-full text-secondary font-bold border border-secondary/20">
                                {{ project.taxonomies.categories[0].name }}
                            </span>
                        </div>

                        <!-- H1 único por página -->
                        <h1 class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-6">
                            <span v-if="pageSlug && activePage?.title" class="block text-lg sm:text-xl font-normal text-secondary uppercase tracking-widest font-label mb-2">
                                {{ project.title }}
                            </span>
                            {{ pageSlug && activePage?.title ? activePage.title : project.title }}
                        </h1>

                        <!-- Extracto del proyecto -->
                        <p v-if="project.excerpt" class="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-8 max-w-3xl">
                            {{ project.excerpt }}
                        </p>

                        <!-- Tecnologías utilizadas -->
                        <div v-if="project.technologies?.length" class="mb-8">
                            <span class="block font-label text-xs uppercase tracking-widest text-outline mb-3">Tecnologías utilizadas:</span>
                            <div class="flex flex-wrap gap-2">
                                <div
                                    v-for="tech in project.technologies"
                                    :key="tech.slug"
                                    class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest/80 rounded-lg border border-outline-variant/30 text-xs font-body text-on-surface"
                                >
                                    <NuxtImg
                                        v-if="tech.image"
                                        :src="tech.image"
                                        :alt="tech.name"
                                        :title="tech.name"
                                        width="18"
                                        height="18"
                                        class="w-4 h-4 object-contain"
                                    />
                                    <span>{{ tech.name }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Enlaces externos del proyecto -->
                        <div v-if="project.metadata && Object.keys(project.metadata).length" class="pt-6 border-t border-outline-variant/20 flex flex-wrap items-center gap-4">
                            <span class="font-label text-xs uppercase tracking-widest text-outline">Enlaces del proyecto:</span>
                            <div class="flex items-center gap-3 flex-wrap">
                                <a
                                    v-if="project.metadata.web"
                                    :href="project.metadata.web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded text-xs font-label uppercase font-bold tracking-widest hover:bg-primary-container transition-colors"
                                >
                                    <IconsEarth :margin="0" :legacy="true" />
                                    Sitio Web
                                </a>
                                <a
                                    v-if="project.metadata.github"
                                    :href="project.metadata.github"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant/40 rounded text-xs font-label uppercase font-bold tracking-widest text-on-surface hover:border-primary transition-colors"
                                >
                                    <IconsGithub :margin="0" :legacy="true" />
                                    Repositorio GitHub
                                </a>
                                <a
                                    v-if="project.metadata.gitlab"
                                    :href="project.metadata.gitlab"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant/40 rounded text-xs font-label uppercase font-bold tracking-widest text-on-surface hover:border-primary transition-colors"
                                >
                                    <IconsGitlab :margin="0" :legacy="true" />
                                    Repositorio GitLab
                                </a>
                                <a
                                    v-if="project.metadata.youtube"
                                    :href="project.metadata.youtube"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant/40 rounded text-xs font-label uppercase font-bold tracking-widest text-on-surface hover:text-error transition-colors"
                                >
                                    <IconsYoutube :margin="0" :legacy="true" />
                                    Ver Vídeo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Pestañas de subpáginas (si el proyecto tiene más de una página) -->
            <nav v-if="project.pages && project.pages.length > 1" aria-label="Secciones del proyecto" class="px-4 sm:px-8 max-w-5xl mx-auto mb-8">
                <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20">
                    <NuxtLink
                        v-for="p in project.pages"
                        :key="p.slug"
                        :to="p.order === 1 ? `/projects/${project.slug}/` : `/projects/${project.slug}/${p.slug}/`"
                        class="px-5 py-2.5 rounded-lg text-xs font-label uppercase tracking-widest font-bold whitespace-nowrap transition-all border"
                        :class="(pageSlug === p.slug || (!pageSlug && p.order === 1))
                            ? 'bg-primary text-on-primary border-primary shadow-md'
                            : 'bg-surface-container-high/50 text-on-surface-variant border-outline-variant/20 hover:border-primary/40 hover:text-on-surface'"
                    >
                        {{ p.title }}
                    </NuxtLink>
                </div>
            </nav>

            <!-- Contenido principal de la página (bloques Editor.js) -->
            <main class="px-4 sm:px-8 max-w-5xl mx-auto mb-16">
                <div class="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6 sm:p-12 shadow-sm">
                    <div v-if="activePage?.body?.blocks?.length" class="space-y-6">
                        <ContentBlocksBlock
                            v-for="(block, idx) in activePage.body.blocks"
                            :key="block.id ?? idx"
                            :block="block"
                        />
                    </div>
                    <div v-else class="py-12 text-center text-outline font-label uppercase tracking-widest text-xs">
                        No hay contenido disponible para esta sección.
                    </div>
                </div>
            </main>

            <!-- Paginador inferior entre subpáginas -->
            <div v-if="project.pages && project.pages.length > 1" class="px-4 sm:px-8 max-w-5xl mx-auto mb-16 flex items-center justify-between gap-4">
                <NuxtLink
                    v-if="prevPageLink"
                    :to="prevPageLink.to"
                    class="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-high border border-outline-variant/30 rounded-lg text-xs font-label uppercase tracking-widest text-on-surface hover:border-primary hover:text-primary transition-all group"
                >
                    <UiMaterialIcon name="arrow_forward" class="rotate-180 text-sm transition-transform group-hover:-translate-x-1" />
                    <span>Anterior: <strong>{{ prevPageLink.title }}</strong></span>
                </NuxtLink>
                <div v-else />

                <NuxtLink
                    v-if="nextPageLink"
                    :to="nextPageLink.to"
                    class="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-high border border-outline-variant/30 rounded-lg text-xs font-label uppercase tracking-widest text-on-surface hover:border-primary hover:text-primary transition-all group ml-auto"
                >
                    <span>Siguiente: <strong>{{ nextPageLink.title }}</strong></span>
                    <UiMaterialIcon name="arrow_forward" class="text-sm transition-transform group-hover:translate-x-1" />
                </NuxtLink>
            </div>
        </template>

        <!-- Fallback si el proyecto no fue encontrado -->
        <div v-else class="py-32 text-center px-4">
            <h1 class="font-headline text-3xl font-bold text-on-surface mb-4">Proyecto no encontrado</h1>
            <p class="text-on-surface-variant mb-8 text-sm">El proyecto solicitado no existe o no está disponible.</p>
            <NuxtLink to="/projects/" class="px-6 py-3 bg-primary text-on-primary font-label text-xs uppercase tracking-widest font-bold rounded">
                Volver a proyectos
            </NuxtLink>
        </div>
    </div>
</template>
