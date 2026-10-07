import { onMounted } from 'vue';
import type { ApiMetaType, ApiResponseType } from '@/types/ApiResponse';
import type { ContentType } from '@/types/ContentType';
import type { ContentPageIndexType, ContentPageType } from '@/types/ContentPageType';
import type { MetadataType } from '@/types/MetadataType';
// Import relativo y explícito: este archivo también se carga desde nuxt.config.ts
// (sitemap/prerender), donde no hay auto-imports ni alias.
import { PLATFORM_SLUG, hasNextPage } from '../utils/ContentUtils';

export type BlogStateType = {
    contents?: ContentType[];
    meta?: ApiMetaType;
};

export type BlogSearchParamsType = {
    search?: string;
    category?: string;
    tag?: string;
};

/**
 * Partes del detalle que necesita la entrada de blog.
 */
const BLOG_DETAIL_INCLUDE = 'technologies,metadata,taxonomies';

function contentsUrl(apiBase: string): string {
    return `${apiBase}/platforms/${PLATFORM_SLUG}/contents`;
}

function prepareDataContent(content: ContentType): ContentType {
    if (content.metadata) {
        content.metadata = prepareDataMetadata(content.metadata);
    }
    return content;
}

function prepareDataMetadata(metadata: MetadataType): MetadataType {
    const priority: (keyof MetadataType)[] = [
        'web',
        'youtube_channel',
        'youtube_video',
        'youtube',
        'gitlab',
        'github',
        'twitter',
        'linkedin',
        'mastodon',
        'twitch',
        'telegram_channel',
    ];

    const results: MetadataType = {};
    let counter = 0;

    if (metadata) {
        priority.forEach((p) => {
            if (p === 'youtube_channel' || p === 'youtube_video') {
                if (metadata[p] && counter < 4) {
                    if (!results.youtube) {
                        counter++;
                    }
                    results.youtube = metadata[p];
                }
            } else if (counter < 4 && metadata[p]) {
                counter++;
                results[p] = metadata[p];
            }
        });
    }

    return results;
}

/**
 * Construye la query del listado de blog (`GET /platforms/{p}/contents?type=blog`).
 */
function blogQuery(page: number, perPage: number, params: BlogSearchParamsType | null = null): string {
    const query = new URLSearchParams({
        type: 'blog',
        page: page.toString(),
        per_page: perPage.toString(),
    });

    if (params?.search?.trim()) {
        query.append('q', params.search.trim());
    }

    if (params?.category) {
        query.append('category', params.category);
    }

    if (params?.tag) {
        query.append('tag', params.tag);
    }

    return query.toString();
}

/**
 * Composable para el listado paginado de entradas del blog.
 */
export function useBlogData() {
    const datas = useState<BlogStateType>('blogData', () => ({}));
    const currentPage = useState<number>('blogCurrentPage', () => 1);
    const hasMorePages = useState<boolean>('blogHasMore', () => true);
    const isLoading = useState<boolean>('blogLoading', () => false);

    /**
     * Carga la siguiente página de entradas (bajo demanda).
     */
    const fetchNextPage = async (perPage = 12) => {
        if (!hasMorePages.value || isLoading.value) return;

        const API_URL = contentsUrl(useApiBase());
        isLoading.value = true;

        try {
            const res = await $fetch<ApiResponseType<ContentType[]>>(
                `${API_URL}?${blogQuery(currentPage.value, perPage)}`,
            );
            const contents = (res.data ?? []).map(prepareDataContent);

            datas.value = {
                contents: currentPage.value === 1 ? contents : [...(datas.value.contents ?? []), ...contents],
                meta: res.meta,
            };

            hasMorePages.value = hasNextPage(res.meta);

            if (hasMorePages.value) {
                currentPage.value++;
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            hasMorePages.value = false;
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(async () => {
        if (!datas.value.contents?.length) {
            await fetchNextPage();
        }
    });

    return {
        datas,
        hasMorePages,
        isLoading,
        fetchNextPage,
    };
}

/**
 * Busca entradas de blog por texto, categoría o etiqueta.
 */
let activeBlogSearchAbortController: AbortController | null = null;

export async function blogDataSearch(params: BlogSearchParamsType | null = null) {
    if (activeBlogSearchAbortController) {
        activeBlogSearchAbortController.abort();
    }
    const abortController = new AbortController();
    activeBlogSearchAbortController = abortController;

    const datas = useState<BlogStateType>('blogData', () => ({}));
    const hasMorePages = useState<boolean>('blogHasMore', () => true);

    const API_URL = contentsUrl(useApiBase());

    datas.value = { contents: [], meta: undefined };
    hasMorePages.value = false;

    let hasMore = true;
    let page = 1;
    const perPage = 25;

    while (hasMore) {
        if (abortController.signal.aborted) return;
        try {
            const res = await $fetch<ApiResponseType<ContentType[]>>(`${API_URL}?${blogQuery(page, perPage, params)}`, {
                headers: { Accept: 'application/json' },
                signal: abortController.signal,
            });
            if (abortController.signal.aborted) return;
            const contents = (res.data ?? []).map(prepareDataContent);

            datas.value = {
                contents: [...(datas.value.contents ?? []), ...contents],
                meta: res.meta,
            };

            hasMore = hasNextPage(res.meta);
            page++;
        } catch (error: unknown) {
            const err = error as { name?: string };
            if (err?.name === 'AbortError' || abortController.signal.aborted) {
                return;
            }
            console.error('FETCH blogDataSearch ERROR', error);
            hasMore = false;
        }
    }
}

/**
 * Obtiene el detalle de un artículo por su slug:
 * datos, índice de páginas, primera página con bloques Editor.js y metadatos.
 */
export async function useGetBlogPostBySlug(slug: string): Promise<ContentType | null> {
    const query = new URLSearchParams({ include: BLOG_DETAIL_INCLUDE, format: 'editorjs' });
    const API_URL = `${contentsUrl(useApiBase())}/${encodeURIComponent(slug)}?${query}`;

    try {
        const res = await $fetch<ApiResponseType<ContentType>>(API_URL);
        return res.data ? prepareDataContent(res.data) : null;
    } catch (error) {
        console.error('FETCH blogPostBySlug ERROR', error);
        return null;
    }
}

/**
 * Obtiene artículos relacionados para una entrada (para pie de lectura).
 */
export async function useGetRelatedBlogPosts(slug: string, limit = 3): Promise<ContentType[]> {
    const API_URL = `${contentsUrl(useApiBase())}/${encodeURIComponent(slug)}/related?limit=${limit}`;

    try {
        const res = await $fetch<ApiResponseType<ContentType[]>>(API_URL);
        return Array.isArray(res.data) ? res.data.map(prepareDataContent) : [];
    } catch (error) {
        console.error('FETCH relatedBlogPosts ERROR', error);
        return [];
    }
}

/**
 * Devuelve todas las entradas del blog paginando hasta obtenerlas todas, cada una
 * con su índice de páginas (`pages`) para generar las rutas `/blog/:slug/:page`.
 *
 * Usado para el sitemap y el prerender estático de Nitro.
 */
export async function useFetchBlogPaginated(apiBaseUrl?: string): Promise<ContentType[]> {
    const API_BASE =
        apiBaseUrl ||
        process.env.API_BASE_URL ||
        (process.env.API_DOMAIN_URL ? `${process.env.API_DOMAIN_URL}/api/v2` : 'http://127.0.0.1:8000/api/v2');
    const API_URL = contentsUrl(API_BASE);
    let allPosts: ContentType[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    try {
        while (hasMorePages) {
            const response = await fetch(`${API_URL}?${blogQuery(currentPage, 100)}`, {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                const errorMsg = `Error fetching blog page ${currentPage}: HTTP ${response.status} from ${API_URL}`;
                console.error(errorMsg);
                if (!process.env.ALLOW_EMPTY_PROJECTS) {
                    throw new Error(errorMsg);
                }
                break;
            }

            const json = (await response.json()) as ApiResponseType<ContentType[]>;

            if (Array.isArray(json?.data)) {
                allPosts = [...allPosts, ...json.data];
            }

            hasMorePages = hasNextPage(json?.meta);
            currentPage++;
        }

        for (const post of allPosts) {
            if (post.pages_count) {
                post.pages = await fetchBlogPagesIndex(API_URL, post.slug);
            }
        }
    } catch (err) {
        if (!process.env.ALLOW_EMPTY_PROJECTS) {
            throw err;
        }
        console.warn(
            `[blog] No se pudo conectar con la API (${API_BASE}). ` +
                'ALLOW_EMPTY_PROJECTS activo: se continúa sin las rutas dinámicas de blog.',
        );
    }

    return allPosts;
}

/**
 * Índice de páginas de un artículo (sin el texto completo) a partir de `/pages`.
 */
async function fetchBlogPagesIndex(contentsApiUrl: string, slug: string): Promise<ContentPageIndexType[]> {
    const response = await fetch(`${contentsApiUrl}/${encodeURIComponent(slug)}/pages?limit=100`, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        console.error(`Error fetching pages of blog post ${slug}: HTTP ${response.status}`);
        return [];
    }

    const json = (await response.json()) as ApiResponseType<ContentPageType[]>;

    return (json?.data ?? []).map(({ id, order, title, slug, format }) => ({ id, order, title, slug, format }));
}
