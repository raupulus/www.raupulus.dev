<script setup lang="ts">
    import { ref, computed, watch } from 'vue';
    import { useBlogData, blogDataSearch, useGetBlogPostBySlug, useGetRelatedBlogPosts } from '@/composables/blogData';
    import type { ApiResponseType } from '@/types/ApiResponse';
    import type { ContentPageType } from '@/types/ContentPageType';
    import type { BlockHeaderType } from '@/types/BlocksType';

    const config = useRuntimeConfig();
    const route = useRoute();
    const router = useRouter();
    const siteUrl = config.public.app.url;

    const slugs = computed(() => (Array.isArray(route.params.slugs) ? route.params.slugs.filter(Boolean) : []));
    const isDetail = computed(() => slugs.value.length > 0);
    const articleSlug = computed(() => slugs.value[0] || '');
    const pageSlug = computed(() => slugs.value[1] || '');

    // Validación de profundidad de ruta: máximo 2 niveles (/blog/:content/:page/)
    if (slugs.value.length > 2) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Página no encontrada',
            fatal: true,
        });
    }

    // ==========================================
    // MODO DETALLE: Carga de artículo y subpágina
    // ==========================================
    const { data: article } = await useAsyncData(
        () => `blog-detail-${articleSlug.value}`,
        () => {
            if (!articleSlug.value) return Promise.resolve(null);
            return useGetBlogPostBySlug(articleSlug.value);
        },
        {
            watch: [articleSlug],
        },
    );

    if (isDetail.value && !article.value) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Artículo no encontrado',
            fatal: true,
        });
    }

    // Opción B: Si se accede a /blog/:contentSlug/ sin página, redirigir a la primera página
    if (isDetail.value && slugs.value.length === 1 && article.value) {
        const firstPageSlug = article.value.first_page?.slug || article.value.pages?.[0]?.slug || '1';
        await navigateTo(`/blog/${article.value.slug}/${firstPageSlug}/`, { redirectCode: 301, replace: true });
    }

    const { data: activePage } = await useAsyncData(
        () => `blog-page-${articleSlug.value}-${pageSlug.value || 'first'}`,
        async () => {
            if (!article.value) return null;

            const targetIndex = pageSlug.value
                ? article.value.pages?.find((p) => p.slug === pageSlug.value)
                : article.value.pages?.find((p) => p.order === 1) || article.value.pages?.[0];

            if (!targetIndex) return null;

            if (targetIndex.order === 1 && article.value.first_page) {
                return normalizePage(article.value.first_page);
            }

            const API_BASE = useApiBase();
            const url = `${API_BASE}/platforms/${PLATFORM_SLUG}/contents/${encodeURIComponent(articleSlug.value)}/pages/${targetIndex.order}?format=editorjs`;
            try {
                const res = await $fetch<ApiResponseType<ContentPageType>>(url, {
                    headers: { Accept: 'application/json' },
                });
                return res?.data ? normalizePage(res.data) : null;
            } catch {
                return null;
            }
        },
        {
            watch: [articleSlug, pageSlug, article],
        },
    );

    if (isDetail.value && pageSlug.value && !activePage.value) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Página del artículo no encontrada',
            fatal: true,
        });
    }

    // Artículos relacionados (3 aleatorios/relacionados desde la API)
    const { data: relatedArticles } = await useAsyncData(
        () => `blog-related-${articleSlug.value}`,
        () => {
            if (!articleSlug.value) return Promise.resolve([]);
            return useGetRelatedBlogPosts(articleSlug.value, 3);
        },
        {
            watch: [articleSlug],
        },
    );

    const allPages = computed(() => {
        if (!article.value?.pages?.length) return [];
        return [...article.value.pages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    const currentPageIndex = computed(() => {
        if (!allPages.value.length || !activePage.value) return -1;
        return allPages.value.findIndex((p) => p.slug === activePage.value?.slug);
    });

    const prevPageLink = computed(() => {
        const idx = currentPageIndex.value;
        if (idx <= 0) return null;
        const prev = allPages.value[idx - 1];
        if (!prev) return null;
        return {
            title: prev.title,
            to: `/blog/${article.value!.slug}/${prev.slug}/`,
        };
    });

    const nextPageLink = computed(() => {
        const idx = currentPageIndex.value;
        if (idx < 0 || idx >= allPages.value.length - 1) return null;
        const next = allPages.value[idx + 1];
        if (!next) return null;
        return {
            title: next.title,
            to: `/blog/${article.value!.slug}/${next.slug}/`,
        };
    });

    // Estimación del tiempo de lectura en minutos
    const readingTimeMinutes = computed(() => {
        if (!activePage.value?.body?.blocks) return 3;
        let wordCount = 0;
        for (const block of activePage.value.body.blocks) {
            const data = block.data as Record<string, unknown> | undefined;
            if (data?.text && typeof data.text === 'string') {
                wordCount += data.text.split(/\s+/).length;
            }
            if (data?.code && typeof data.code === 'string') {
                wordCount += data.code.split(/\s+/).length;
            }
            if (data?.items && Array.isArray(data.items)) {
                wordCount += data.items.length * 8;
            }
        }
        return Math.max(1, Math.ceil(wordCount / 200));
    });

    // ==========================================
    // MODO CATÁLOGO: Búsqueda y listado /blog/
    // ==========================================
    const { datas, hasMorePages, isLoading, fetchNextPage } = useBlogData();
    const searchInput = ref((route.query.q as string) || '');

    const syncQuery = () => {
        if (!isDetail.value) {
            router.replace({
                query: {
                    ...route.query,
                    q: searchInput.value.trim() || undefined,
                },
            });
        }
    };

    const performSearch = () => {
        syncQuery();
        if (!searchInput.value.trim()) {
            blogDataSearch();
        } else {
            blogDataSearch({
                search: searchInput.value.trim(),
            });
        }
    };

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    watch(searchInput, () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch();
        }, 300);
    });

    // ==========================================
    // SEO & METADATOS
    // ==========================================
    const catalogTitle = 'Blog Técnico | Raúl Caro Pastorino';
    const catalogDescription =
        'Artículos técnicos, guías y notas sobre desarrollo backend con Laravel, IA en producción, nodos LoRa/Meshtastic y Linux por Raúl Caro Pastorino.';

    const currentUrl = computed(() => {
        if (!isDetail.value) return `${siteUrl}/blog/`;
        return `${siteUrl}/blog/${articleSlug.value}/${pageSlug.value}/`;
    });

    const pageTitle = computed(() => {
        if (!isDetail.value) return catalogTitle;
        if (!article.value) return 'Blog | Raúl Caro Pastorino';
        if (pageSlug.value && activePage.value?.title && allPages.value.length > 1) {
            return `${activePage.value.title} · ${article.value.title} | Raúl Caro Pastorino`;
        }
        return `${article.value.seo_title || article.value.title} | Raúl Caro Pastorino`;
    });

    const pageDescription = computed(() => {
        if (!isDetail.value) return catalogDescription;
        return (
            article.value?.seo_description ||
            article.value?.excerpt ||
            'Artículo técnico en el blog de Raúl Caro Pastorino.'
        );
    });

    const pageImage = computed(() => {
        if (isDetail.value && article.value?.image) {
            return imageUrl(article.value.image, 'large') || `${siteUrl}/social/home.webp`;
        }
        return `${siteUrl}/social/home.webp`;
    });

    const breadcrumbSchema = computed(() => {
        const items = [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: siteUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: `${siteUrl}/blog/`,
            },
        ];

        if (isDetail.value && article.value) {
            const firstPageSlug = article.value.first_page?.slug || article.value.pages?.[0]?.slug || '';
            items.push({
                '@type': 'ListItem',
                position: 3,
                name: article.value.title,
                item: `${siteUrl}/blog/${article.value.slug}/${firstPageSlug}/`,
            });

            if (pageSlug.value && activePage.value?.title && pageSlug.value !== firstPageSlug) {
                items.push({
                    '@type': 'ListItem',
                    position: 4,
                    name: activePage.value.title,
                    item: currentUrl.value,
                });
            }
        }

        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: items,
        };
    });

    const articleSchema = computed(() => {
        if (!isDetail.value || !article.value) {
            const itemList = (datas.value?.contents || []).slice(0, 20).map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.title,
                url: `${siteUrl}/blog/${item.slug}/${item.first_page?.slug || item.pages?.[0]?.slug || ''}/`,
            }));

            return {
                '@context': 'https://schema.org',
                '@type': 'Blog',
                name: catalogTitle,
                url: `${siteUrl}/blog/`,
                description: catalogDescription,
                ...(itemList.length > 0
                    ? {
                          mainEntity: {
                              '@type': 'ItemList',
                              itemListElement: itemList,
                          },
                      }
                    : {}),
            };
        }

        return {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: activePage.value?.title || article.value.title,
            name: article.value.title,
            description: pageDescription.value,
            url: currentUrl.value,
            image: pageImage.value,
            datePublished: article.value.published_at || article.value.created_at,
            dateModified: article.value.updated_at,
            inLanguage: 'es',
            author: {
                '@type': 'Person',
                name: 'Raúl Caro Pastorino',
                url: siteUrl,
            },
            publisher: {
                '@type': 'Person',
                name: 'Raúl Caro Pastorino',
                url: siteUrl,
            },
        };
    });

    useHead(() => ({
        title: pageTitle.value,
        meta: [
            { name: 'description', content: pageDescription.value },
            {
                name: 'keywords',
                content:
                    'blog, artículos técnicos, backend, Laravel, inteligencia artificial, IoT, LoRa, Meshtastic, GNU/Linux, Raúl Caro Pastorino',
            },
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
        link: [{ rel: 'canonical', href: currentUrl.value }],
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(breadcrumbSchema.value),
            },
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(articleSchema.value),
            },
        ],
    }));

    // ==========================================
    // TABLA DE CONTENIDOS (TOC) DE LA PÁGINA ACTIVA
    // ==========================================
    interface TocItem {
        id: string;
        text: string;
        level: number;
    }

    const tocItems = computed<TocItem[]>(() => {
        if (!activePage.value?.body?.blocks?.length) return [];
        const items: TocItem[] = [];
        for (const block of activePage.value.body.blocks) {
            if (block.type === 'header') {
                const headerBlock = block as BlockHeaderType;
                const rawText = headerBlock.data?.text ? headerBlock.data.text.replace(/<[^>]*>/g, '').trim() : '';
                if (!rawText) continue;
                const id = headerBlock.id
                    ? `h-${headerBlock.id}`
                    : rawText
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, '')
                          .trim()
                          .replace(/\s+/g, '-');
                items.push({
                    id,
                    text: rawText,
                    level: Number(headerBlock.data?.level) || 2,
                });
            }
        }
        return items;
    });

    function scrollToHeading(id: string) {
        if (import.meta.client) {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, '', `#${id}`);
            }
        }
    }

    // ==========================================
    // COMPARTIR ARTÍCULO
    // ==========================================
    const linkCopied = ref(false);
    let copyTimeout: ReturnType<typeof setTimeout> | null = null;

    const currentShareUrl = computed(() => {
        if (import.meta.client) {
            return window.location.href;
        }
        return `${siteUrl}${route.fullPath}`;
    });

    async function copyShareLink() {
        if (!import.meta.client) return;
        try {
            await navigator.clipboard.writeText(currentShareUrl.value);
            linkCopied.value = true;
            if (copyTimeout) clearTimeout(copyTimeout);
            copyTimeout = setTimeout(() => {
                linkCopied.value = false;
            }, 2500);
        } catch {
            linkCopied.value = false;
        }
    }

    const twitterShareUrl = computed(() => {
        const title = article.value?.title || '';
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentShareUrl.value)}`;
    });

    const linkedinShareUrl = computed(() => {
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentShareUrl.value)}`;
    });

    const telegramShareUrl = computed(() => {
        const title = article.value?.title || '';
        return `https://t.me/share/url?url=${encodeURIComponent(currentShareUrl.value)}&text=${encodeURIComponent(title)}`;
    });

    const whatsappShareUrl = computed(() => {
        const title = article.value?.title || '';
        return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${currentShareUrl.value}`)}`;
    });
</script>

<template>
    <div class="min-h-screen bg-background">
        <!-- ============================================== -->
        <!-- MODO CATÁLOGO: /blog/                          -->
        <!-- ============================================== -->
        <template v-if="!isDetail">
            <!-- Cabecera de la sección -->
            <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
                <span class="font-label text-secondary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                    <span class="w-8 h-[1px] bg-secondary" />
                    Artículos Técnicos
                </span>
                <h1
                    class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6 max-w-4xl"
                >
                    Mi <span class="text-on-surface-variant font-light">Blog</span> Personal
                </h1>
                <p class="text-on-surface-variant text-lg max-w-2xl border-l-2 border-secondary pl-6 py-2">
                    Artículos técnicos, guías en profundidad y notas sobre backend con Laravel, IA aplicada, nodos
                    LoRa/Meshtastic y GNU/Linux.
                </p>
            </div>

            <!-- Filtros y buscador -->
            <section class="px-8 pb-8 max-w-7xl mx-auto">
                <div class="p-6 bg-surface-container-low rounded-xl border border-outline-variant/20 mb-8">
                    <div class="relative w-full">
                        <label for="search-input" class="sr-only">Buscar artículos</label>
                        <UiMaterialIcon
                            name="search"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none"
                        />
                        <input
                            id="search-input"
                            v-model="searchInput"
                            type="search"
                            placeholder="Buscar artículos por título, concepto o tecnología..."
                            class="w-full pl-12 pr-4 py-3 bg-surface-container-high rounded-lg border border-outline-variant/30 text-on-surface placeholder:text-outline-variant text-sm focus:outline-none focus:border-secondary transition-colors"
                        />
                    </div>
                </div>

                <!-- Contador de resultados -->
                <div v-if="datas.meta?.total" class="mb-8 flex items-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span class="font-label text-xs text-on-surface-variant uppercase tracking-widest">
                        {{ datas.meta.total }} artículos publicados
                    </span>
                </div>

                <!-- Grid de artículos -->
                <h2 class="sr-only">Listado de artículos del blog</h2>
                <div
                    v-if="datas.contents && datas.contents.length"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <CardBlogCard v-for="item in datas.contents" :key="item.id" :data="item" />
                </div>

                <!-- Estado vacío -->
                <div
                    v-else-if="!isLoading"
                    class="py-16 text-center bg-surface-container-low rounded-xl border border-outline-variant/20 p-8"
                >
                    <UiMaterialIcon name="code_blocks" class="text-secondary text-5xl mb-4" />
                    <h3 class="font-headline text-xl font-bold mb-2">No se encontraron artículos</h3>
                    <p class="text-sm text-on-surface-variant max-w-md mx-auto">
                        Prueba con otros términos de búsqueda o borra el filtro para ver todo el contenido.
                    </p>
                </div>

                <!-- Botón cargar más -->
                <div v-if="hasMorePages" class="mt-16 flex flex-col items-center">
                    <button
                        :disabled="isLoading"
                        class="group flex items-center gap-4 px-10 py-4 bg-surface-container-highest border border-outline-variant/30 rounded hover:border-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        @click="() => fetchNextPage()"
                    >
                        <span class="text-sm font-label uppercase tracking-[0.3em] font-bold">
                            {{ isLoading ? 'Cargando...' : 'Cargar más artículos' }}
                        </span>
                        <UiMaterialIcon
                            class="text-secondary transition-transform duration-500"
                            :class="isLoading ? 'animate-spin' : 'group-hover:rotate-180'"
                            name="refresh"
                        />
                    </button>
                </div>
            </section>
        </template>

        <!-- ============================================== -->
        <!-- MODO DETALLE: /blog/:contentSlug/:pageSlug/    -->
        <!-- ============================================== -->
        <template v-else-if="article">
            <!-- Migas de pan (Breadcrumbs) -->
            <nav aria-label="Migas de pan" class="pt-8 pb-4 px-4 sm:px-8 max-w-7xl mx-auto">
                <ol
                    class="flex items-center gap-2 text-xs font-label uppercase tracking-widest text-on-surface-variant flex-wrap"
                >
                    <li>
                        <NuxtLink to="/" class="hover:text-primary transition-colors">Inicio</NuxtLink>
                    </li>
                    <li aria-hidden="true">
                        <span class="text-outline-variant">/</span>
                    </li>
                    <li>
                        <NuxtLink to="/blog/" class="hover:text-primary transition-colors">Blog</NuxtLink>
                    </li>
                    <li aria-hidden="true">
                        <span class="text-outline-variant">/</span>
                    </li>
                    <li
                        class="truncate max-w-[220px]"
                        :class="
                            allPages.length <= 1 ? 'text-primary font-bold' : 'hover:text-primary transition-colors'
                        "
                    >
                        <NuxtLink
                            v-if="allPages.length > 1 && allPages[0]"
                            :to="`/blog/${article.slug}/${allPages[0].slug}/`"
                        >
                            {{ article.title }}
                        </NuxtLink>
                        <span v-else>{{ article.title }}</span>
                    </li>
                    <template v-if="allPages.length > 1 && activePage">
                        <li aria-hidden="true">
                            <span class="text-outline-variant">/</span>
                        </li>
                        <li class="text-primary truncate font-bold" aria-current="page">
                            {{ activePage.title }}
                        </li>
                    </template>
                </ol>
            </nav>

            <!-- Enlace volver a blog -->
            <div class="px-4 sm:px-8 max-w-7xl mx-auto mb-6">
                <NuxtLink
                    to="/blog/"
                    class="inline-flex items-center gap-2 text-xs font-label uppercase tracking-widest text-secondary hover:text-primary transition-colors group"
                >
                    <UiMaterialIcon
                        name="arrow_forward"
                        class="rotate-180 text-sm transition-transform group-hover:-translate-x-1"
                    />
                    Volver al listado de artículos
                </NuxtLink>
            </div>

            <!-- Cabecera del artículo -->
            <header class="px-4 sm:px-8 max-w-7xl mx-auto mb-10">
                <div
                    class="relative bg-surface-container-high rounded-2xl border border-outline-variant/30 overflow-hidden p-6 sm:p-10 shadow-xl"
                >
                    <!-- Fondo difuminado decorativo con la portada -->
                    <div
                        v-if="article.image"
                        class="absolute inset-0 bg-cover bg-center opacity-10 filter blur-xl pointer-events-none"
                        :style="{ backgroundImage: `url(${imageUrl(article.image, 'large')})` }"
                    />

                    <div class="relative z-10">
                        <!-- Metadatos de publicación: fecha, tiempo lectura, vistas, categoría -->
                        <div
                            class="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs font-label uppercase tracking-widest"
                        >
                            <div class="flex items-center gap-4 flex-wrap text-on-surface-variant">
                                <span v-if="article.published_at || article.created_at">
                                    {{ formatDate(article.published_at ?? article.created_at) }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <UiMaterialIcon name="schedule" class="text-xs" />
                                    ~{{ readingTimeMinutes }} min de lectura
                                </span>
                                <span v-if="article.views_count" class="flex items-center gap-1">
                                    <UiMaterialIcon name="bolt" class="text-xs" />
                                    {{ article.views_count }} lecturas
                                </span>
                            </div>

                            <span
                                v-if="article.taxonomies?.categories?.[0]"
                                class="px-3 py-1 bg-surface-container-highest rounded-full text-secondary font-bold border border-secondary/20"
                            >
                                {{ article.taxonomies.categories[0].name }}
                            </span>
                        </div>

                        <!-- H1 del artículo / subpágina -->
                        <h1
                            class="font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-6"
                        >
                            <span
                                v-if="allPages.length > 1 && activePage?.title"
                                class="block text-lg sm:text-xl font-normal text-secondary uppercase tracking-widest font-label mb-2"
                            >
                                {{ article.title }}
                            </span>
                            {{ allPages.length > 1 && activePage?.title ? activePage.title : article.title }}
                        </h1>

                        <!-- Extracto del artículo -->
                        <p
                            v-if="article.excerpt"
                            class="text-base sm:text-lg text-on-surface-variant leading-relaxed mb-6 max-w-4xl"
                        >
                            {{ article.excerpt }}
                        </p>

                        <!-- Tecnologías / Etiquetas relacionadas -->
                        <div v-if="article.technologies?.length" class="mb-4">
                            <div class="flex flex-wrap gap-2">
                                <div
                                    v-for="tech in article.technologies"
                                    :key="tech.slug"
                                    class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest/80 rounded-lg border border-outline-variant/30 text-xs font-body text-on-surface"
                                >
                                    <img
                                        v-if="tech.image"
                                        :src="tech.image"
                                        :alt="'Logotipo de ' + tech.name"
                                        :title="tech.name"
                                        width="18"
                                        height="18"
                                        loading="lazy"
                                        decoding="async"
                                        class="w-4 h-4 object-contain"
                                    />
                                    <span>{{ tech.name }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Enlaces externos del artículo si los tiene -->
                        <div
                            v-if="article.metadata && Object.keys(article.metadata).length"
                            class="pt-4 border-t border-outline-variant/20 flex flex-wrap items-center gap-4"
                        >
                            <span class="font-label text-xs uppercase tracking-widest text-on-surface-variant"
                                >Enlaces de interés:</span
                            >
                            <div class="flex items-center gap-3 flex-wrap">
                                <a
                                    v-if="article.metadata.web"
                                    :href="article.metadata.web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded text-xs font-label uppercase font-bold tracking-widest hover:bg-primary-container transition-colors"
                                >
                                    <IconsEarth :margin="0" :legacy="true" />
                                    Sitio Web
                                </a>
                                <a
                                    v-if="article.metadata.github"
                                    :href="article.metadata.github"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant/40 rounded text-xs font-label uppercase font-bold tracking-widest text-on-surface hover:border-primary transition-colors"
                                >
                                    <IconsGithub :margin="0" :legacy="true" />
                                    GitHub
                                </a>
                                <a
                                    v-if="article.metadata.gitlab"
                                    :href="article.metadata.gitlab"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant/40 rounded text-xs font-label uppercase font-bold tracking-widest text-on-surface hover:border-primary transition-colors"
                                >
                                    <IconsGitlab :margin="0" :legacy="true" />
                                    GitLab
                                </a>
                                <a
                                    v-if="article.metadata.youtube"
                                    :href="article.metadata.youtube"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant/40 rounded text-xs font-label uppercase font-bold tracking-widest text-on-surface hover:text-error transition-colors"
                                >
                                    <IconsYoutube :margin="0" :legacy="true" />
                                    Vídeo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Pestañas horizontales de subpáginas (antes del contenido) -->
            <nav
                v-if="allPages.length > 1"
                aria-label="Páginas del artículo"
                class="px-4 sm:px-8 max-w-7xl mx-auto mb-8"
            >
                <div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20">
                    <NuxtLink
                        v-for="p in allPages"
                        :key="p.slug"
                        :to="`/blog/${article.slug}/${p.slug}/`"
                        class="px-5 py-2.5 rounded-lg text-xs font-label uppercase tracking-widest font-bold whitespace-nowrap transition-all border"
                        :class="
                            pageSlug === p.slug
                                ? 'bg-primary text-on-primary border-primary shadow-md'
                                : 'bg-surface-container-high/50 text-on-surface-variant border-outline-variant/20 hover:border-primary/40 hover:text-on-surface'
                        "
                    >
                        {{ p.title }}
                    </NuxtLink>
                </div>
            </nav>

            <!-- Layout principal: Contenido (izq/centro) + Sidebar con tarjetitas pequeñas (der) -->
            <div class="px-4 sm:px-8 max-w-7xl mx-auto mb-16">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <!-- Columna de contenido (EditorJS) -->
                    <main class="lg:col-span-8 space-y-8">
                        <div
                            class="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6 sm:p-12 shadow-sm"
                        >
                            <div v-if="activePage?.body?.blocks?.length" class="space-y-6">
                                <ContentBlocksBlock
                                    v-for="(block, idx) in activePage.body.blocks"
                                    :key="block.id ?? idx"
                                    :block="block"
                                />
                            </div>
                            <div
                                v-else
                                class="py-12 text-center text-on-surface-variant font-label uppercase tracking-widest text-xs"
                            >
                                No hay contenido disponible para esta sección.
                            </div>
                        </div>

                        <!-- Paginador inferior entre subpáginas (← Anterior / Siguiente →) -->
                        <div
                            v-if="allPages.length > 1"
                            class="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/20"
                        >
                            <NuxtLink
                                v-if="prevPageLink"
                                :to="prevPageLink.to"
                                class="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-high border border-outline-variant/30 rounded-lg text-xs font-label uppercase tracking-widest text-on-surface hover:border-primary hover:text-primary transition-all group"
                            >
                                <UiMaterialIcon
                                    name="arrow_forward"
                                    class="rotate-180 text-sm transition-transform group-hover:-translate-x-1"
                                />
                                <span>
                                    Anterior: <strong>{{ prevPageLink.title }}</strong>
                                </span>
                            </NuxtLink>
                            <div v-else />

                            <NuxtLink
                                v-if="nextPageLink"
                                :to="nextPageLink.to"
                                class="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-high border border-outline-variant/30 rounded-lg text-xs font-label uppercase tracking-widest text-on-surface hover:border-primary hover:text-primary transition-all group ml-auto"
                            >
                                <span>
                                    Siguiente: <strong>{{ nextPageLink.title }}</strong>
                                </span>
                                <UiMaterialIcon
                                    name="arrow_forward"
                                    class="text-sm transition-transform group-hover:translate-x-1"
                                />
                            </NuxtLink>
                        </div>
                    </main>

                    <!-- Columna lateral: Panel de control, índice y herramientas (Sticky) -->
                    <aside class="lg:col-span-4 sticky top-24 space-y-5">
                        <!-- 1. Tarjetero de páginas del artículo (si tiene más de 1 página) -->
                        <div
                            v-if="allPages.length > 1"
                            class="bg-surface-container-high/60 backdrop-blur rounded-xl border border-outline-variant/30 p-4 shadow-sm"
                        >
                            <div class="flex items-center gap-2 mb-3 pb-2.5 border-b border-outline-variant/20">
                                <UiMaterialIcon name="layers" class="text-secondary text-base" />
                                <h3 class="font-headline font-bold text-xs tracking-wider text-on-surface uppercase">
                                    Páginas del artículo
                                </h3>
                                <span
                                    class="ml-auto text-[11px] font-label text-on-surface-variant font-bold px-2 py-0.5 rounded bg-surface-container-highest"
                                >
                                    {{ currentPageIndex + 1 }} / {{ allPages.length }}
                                </span>
                            </div>

                            <!-- Listado de tarjetitas pequeñas -->
                            <div class="flex flex-col gap-2.5">
                                <NuxtLink
                                    v-for="(p, idx) in allPages"
                                    :key="p.slug"
                                    :to="`/blog/${article.slug}/${p.slug}/`"
                                    class="group p-3 rounded-lg border transition-all text-left flex items-start gap-3"
                                    :class="
                                        pageSlug === p.slug
                                            ? 'bg-primary/10 border-primary shadow-sm text-primary'
                                            : 'bg-surface-container-lowest/60 border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high text-on-surface'
                                    "
                                >
                                    <span
                                        class="w-6 h-6 rounded flex items-center justify-center text-xs font-label font-bold shrink-0 mt-0.5"
                                        :class="
                                            pageSlug === p.slug
                                                ? 'bg-primary text-on-primary'
                                                : 'bg-surface-container-high text-on-surface-variant group-hover:text-primary'
                                        "
                                    >
                                        {{ idx + 1 }}
                                    </span>
                                    <div class="min-w-0 flex-1">
                                        <p
                                            class="text-xs font-headline font-bold leading-snug line-clamp-2"
                                            :class="pageSlug === p.slug ? 'text-primary' : 'group-hover:text-primary'"
                                        >
                                            {{ p.title }}
                                        </p>
                                        <span
                                            v-if="pageSlug === p.slug"
                                            class="text-[10px] font-label text-secondary flex items-center gap-1 mt-1 font-bold uppercase tracking-wider"
                                        >
                                            <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                                            Leyendo ahora
                                        </span>
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- 2. Tabla de Contenidos interactiva (TOC) -->
                        <div
                            v-if="tocItems.length > 0"
                            class="bg-surface-container-high/60 backdrop-blur rounded-xl border border-outline-variant/30 p-4 shadow-sm"
                        >
                            <div class="flex items-center gap-2 mb-3 pb-2.5 border-b border-outline-variant/20">
                                <UiMaterialIcon name="code_blocks" class="text-secondary text-base" />
                                <h3 class="font-headline font-bold text-xs tracking-wider text-on-surface uppercase">
                                    En esta página
                                </h3>
                                <span class="ml-auto text-[10px] font-label text-on-surface-variant">
                                    {{ tocItems.length }} secciones
                                </span>
                            </div>

                            <nav aria-label="Índice de la página actual" class="flex flex-col gap-1.5">
                                <a
                                    v-for="item in tocItems"
                                    :key="item.id"
                                    :href="`#${item.id}`"
                                    class="text-xs leading-relaxed text-on-surface-variant hover:text-primary transition-colors flex items-start gap-2 py-0.5 group"
                                    :class="item.level > 2 ? 'pl-4 text-[11px]' : ''"
                                    @click.prevent="scrollToHeading(item.id)"
                                >
                                    <span class="text-secondary opacity-60 group-hover:opacity-100 transition-opacity"
                                        >›</span
                                    >
                                    <span class="group-hover:translate-x-0.5 transition-transform">{{
                                        item.text
                                    }}</span>
                                </a>
                            </nav>
                        </div>

                        <!-- 3. Ficha Técnica / Metadatos de lectura -->
                        <div
                            class="bg-surface-container-low rounded-xl border border-outline-variant/20 p-4 shadow-sm text-xs space-y-3"
                        >
                            <div class="flex items-center gap-2 pb-2.5 border-b border-outline-variant/20">
                                <UiMaterialIcon name="bolt" class="text-secondary text-base" />
                                <h3 class="font-headline font-bold text-xs tracking-wider text-on-surface uppercase">
                                    Ficha Técnica
                                </h3>
                            </div>

                            <!-- Métricas clave -->
                            <div class="grid grid-cols-2 gap-2.5">
                                <div
                                    class="bg-surface-container-high/40 p-2 rounded-lg border border-outline-variant/10"
                                >
                                    <span
                                        class="block text-[10px] uppercase font-label text-on-surface-variant tracking-wider"
                                        >Lectura</span
                                    >
                                    <span class="font-bold text-on-surface flex items-center gap-1 mt-0.5">
                                        <UiMaterialIcon name="schedule" class="text-xs text-secondary" />
                                        ~{{ readingTimeMinutes }} min
                                    </span>
                                </div>
                                <div
                                    class="bg-surface-container-high/40 p-2 rounded-lg border border-outline-variant/10"
                                >
                                    <span
                                        class="block text-[10px] uppercase font-label text-on-surface-variant tracking-wider"
                                        >Publicación</span
                                    >
                                    <span class="font-bold text-on-surface truncate block mt-0.5">
                                        {{ formatDate(article.published_at ?? article.created_at) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Tecnologías utilizadas -->
                            <div v-if="article.technologies?.length" class="pt-2">
                                <span
                                    class="block text-[10px] uppercase font-label text-on-surface-variant tracking-wider mb-2"
                                >
                                    Tecnologías clave
                                </span>
                                <div class="flex flex-wrap gap-1.5">
                                    <div
                                        v-for="tech in article.technologies"
                                        :key="tech.slug"
                                        class="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high rounded-md border border-outline-variant/20 text-[11px] text-on-surface"
                                    >
                                        <img
                                            v-if="tech.image"
                                            :src="tech.image"
                                            :alt="'Logotipo de ' + tech.name"
                                            width="14"
                                            height="14"
                                            loading="lazy"
                                            decoding="async"
                                            class="w-3.5 h-3.5 object-contain"
                                        />
                                        <span>{{ tech.name }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Enlaces directos de interés -->
                            <div
                                v-if="article.metadata && Object.keys(article.metadata).length"
                                class="pt-2 border-t border-outline-variant/20"
                            >
                                <span
                                    class="block text-[10px] uppercase font-label text-on-surface-variant tracking-wider mb-2"
                                >
                                    Recursos del artículo
                                </span>
                                <div class="flex flex-col gap-2">
                                    <a
                                        v-if="article.metadata.github"
                                        :href="article.metadata.github"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center justify-between p-2 rounded-lg bg-surface-container-high hover:border-primary/50 border border-outline-variant/20 text-on-surface hover:text-primary transition-all group"
                                    >
                                        <span class="flex items-center gap-2">
                                            <IconsGithub :margin="0" :legacy="true" :size="16" />
                                            <span class="text-xs font-bold">Repositorio GitHub</span>
                                        </span>
                                        <UiMaterialIcon
                                            name="open_in_new"
                                            class="text-xs text-on-surface-variant group-hover:text-primary"
                                        />
                                    </a>
                                    <a
                                        v-if="article.metadata.web"
                                        :href="article.metadata.web"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center justify-between p-2 rounded-lg bg-surface-container-high hover:border-primary/50 border border-outline-variant/20 text-on-surface hover:text-primary transition-all group"
                                    >
                                        <span class="flex items-center gap-2">
                                            <IconsEarth :margin="0" :legacy="true" :size="16" />
                                            <span class="text-xs font-bold">Sitio Web / Demo</span>
                                        </span>
                                        <UiMaterialIcon
                                            name="open_in_new"
                                            class="text-xs text-on-surface-variant group-hover:text-primary"
                                        />
                                    </a>
                                    <a
                                        v-if="article.metadata.gitlab"
                                        :href="article.metadata.gitlab"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center justify-between p-2 rounded-lg bg-surface-container-high hover:border-primary/50 border border-outline-variant/20 text-on-surface hover:text-primary transition-all group"
                                    >
                                        <span class="flex items-center gap-2">
                                            <IconsGitlab :margin="0" :legacy="true" :size="16" />
                                            <span class="text-xs font-bold">Repositorio GitLab</span>
                                        </span>
                                        <UiMaterialIcon
                                            name="open_in_new"
                                            class="text-xs text-on-surface-variant group-hover:text-primary"
                                        />
                                    </a>
                                    <a
                                        v-if="article.metadata.youtube"
                                        :href="article.metadata.youtube"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center justify-between p-2 rounded-lg bg-surface-container-high hover:border-error/50 border border-outline-variant/20 text-on-surface hover:text-error transition-all group"
                                    >
                                        <span class="flex items-center gap-2">
                                            <IconsYoutube :margin="0" :legacy="true" :size="16" />
                                            <span class="text-xs font-bold">Vídeo Tutorial</span>
                                        </span>
                                        <UiMaterialIcon
                                            name="open_in_new"
                                            class="text-xs text-on-surface-variant group-hover:text-error"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- 4. Compartir artículo -->
                        <div
                            class="bg-surface-container-low rounded-xl border border-outline-variant/20 p-4 shadow-sm text-xs space-y-2.5"
                        >
                            <div class="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
                                <UiMaterialIcon name="share" class="text-secondary text-base" />
                                <h3 class="font-headline font-bold text-xs tracking-wider text-on-surface uppercase">
                                    Compartir
                                </h3>
                            </div>

                            <!-- Botón copiar enlace -->
                            <button
                                type="button"
                                class="w-full py-2 px-3 rounded-lg border text-xs font-label uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                                :class="
                                    linkCopied
                                        ? 'bg-secondary/20 border-secondary text-secondary'
                                        : 'bg-surface-container-high border-outline-variant/30 text-on-surface hover:border-primary hover:text-primary'
                                "
                                @click="copyShareLink"
                            >
                                <UiMaterialIcon :name="linkCopied ? 'check' : 'content_copy'" class="text-sm" />
                                <span>{{ linkCopied ? '¡Enlace copiado!' : 'Copiar enlace directo' }}</span>
                            </button>

                            <!-- Redes sociales para compartir -->
                            <div class="flex items-center justify-center gap-2.5 pt-1">
                                <a
                                    :href="twitterShareUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Compartir en X / Twitter"
                                    class="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center hover:border-primary transition-all group"
                                >
                                    <IconsTwitter :legacy="true" :size="15" />
                                </a>
                                <a
                                    :href="linkedinShareUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Compartir en LinkedIn"
                                    class="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center hover:border-primary transition-all group"
                                >
                                    <IconsLinkedin :legacy="true" :size="15" />
                                </a>
                                <a
                                    :href="telegramShareUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Compartir en Telegram"
                                    class="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center hover:border-primary transition-all group"
                                >
                                    <IconsTelegram :legacy="true" :size="15" />
                                </a>
                                <a
                                    :href="whatsappShareUrl"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Compartir en WhatsApp"
                                    class="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center hover:border-secondary transition-all group text-secondary"
                                >
                                    <UiMaterialIcon name="send" class="text-xs" />
                                </a>
                            </div>
                        </div>

                        <!-- 5. Ficha de autor enriquecida -->
                        <div
                            class="bg-surface-container-low rounded-xl border border-outline-variant/20 p-4 text-xs text-on-surface-variant space-y-3 shadow-sm"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-secondary/40 flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-inner"
                                >
                                    RC
                                </div>
                                <div class="min-w-0">
                                    <p class="font-bold text-on-surface text-sm truncate">Raúl Caro Pastorino</p>
                                    <p class="text-[11px] text-secondary font-label tracking-wide uppercase">
                                        Backend &amp; Maker
                                    </p>
                                </div>
                            </div>
                            <p class="text-xs leading-relaxed text-on-surface-variant">
                                Ingeniero y desarrollador web backend especializado en Laravel, APIs REST,
                                microcontroladores y software libre. Publico tutoriales basados en proyectos y
                                experimentación real.
                            </p>

                            <!-- Redes del autor -->
                            <div class="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
                                <a
                                    href="https://github.com/raupulus"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub de Raúl"
                                    class="p-1.5 rounded bg-surface-container-high hover:border-primary border border-outline-variant/20 transition-colors"
                                >
                                    <IconsGithub :margin="0" :legacy="true" :size="15" />
                                </a>
                                <a
                                    href="https://gitlab.com/raupulus"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitLab de Raúl"
                                    class="p-1.5 rounded bg-surface-container-high hover:border-primary border border-outline-variant/20 transition-colors"
                                >
                                    <IconsGitlab :margin="0" :legacy="true" :size="15" />
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/raupulus"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn de Raúl"
                                    class="p-1.5 rounded bg-surface-container-high hover:border-primary border border-outline-variant/20 transition-colors"
                                >
                                    <IconsLinkedin :margin="0" :legacy="true" :size="15" />
                                </a>
                                <a
                                    href="https://twitter.com/raupulus"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter / X de Raúl"
                                    class="p-1.5 rounded bg-surface-container-high hover:border-primary border border-outline-variant/20 transition-colors"
                                >
                                    <IconsTwitter :margin="0" :legacy="true" :size="15" />
                                </a>

                                <NuxtLink
                                    to="/about/"
                                    class="ml-auto inline-flex items-center gap-1 text-secondary hover:text-primary text-[11px] font-bold uppercase tracking-wider transition-colors"
                                >
                                    Bio
                                    <UiMaterialIcon name="arrow_forward" class="text-xs" />
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- 6. Interacción / Contacto técnico (CTA) -->
                        <div
                            class="bg-gradient-to-br from-surface-container-low to-surface-container-high rounded-xl border border-secondary/20 p-4 text-xs space-y-2.5 shadow-sm"
                        >
                            <div class="flex items-center gap-2">
                                <UiMaterialIcon name="send" class="text-secondary text-base" />
                                <h4 class="font-headline font-bold text-xs uppercase tracking-wider text-on-surface">
                                    ¿Dudas o Sugerencias?
                                </h4>
                            </div>
                            <p class="text-[11px] text-on-surface-variant leading-relaxed">
                                ¿Tienes alguna pregunta sobre esta guía o quieres colaborar en un desarrollo similar?
                            </p>
                            <NuxtLink
                                to="/contact/"
                                class="inline-flex items-center justify-center gap-2 w-full py-2 px-3 bg-primary text-on-primary rounded-lg text-xs font-label uppercase tracking-widest font-bold hover:bg-primary-container transition-colors shadow-sm"
                            >
                                <UiMaterialIcon name="send" class="text-xs" />
                                Enviar mensaje
                            </NuxtLink>
                        </div>
                    </aside>
                </div>

                <!-- Sección: Artículos relacionados al pie (3 aleatorios de la API) -->
                <section
                    v-if="relatedArticles && relatedArticles.length"
                    class="mt-20 pt-12 border-t border-outline-variant/20"
                >
                    <div class="flex items-center gap-3 mb-8">
                        <UiMaterialIcon name="bolt" class="text-secondary text-2xl" />
                        <div>
                            <span class="font-label text-secondary tracking-widest text-xs uppercase block"
                                >Continúa leyendo</span
                            >
                            <h2 class="font-headline text-2xl sm:text-3xl font-bold tracking-tight">
                                Artículos Relacionados
                            </h2>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CardBlogCard v-for="rel in relatedArticles" :key="rel.id" :data="rel" />
                    </div>
                </section>
            </div>
        </template>
    </div>
</template>
