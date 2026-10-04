import { onMounted } from 'vue';
import type { ApiMetaType, ApiResponseType } from '@/types/ApiResponse';
import type { ContentType } from '@/types/ContentType';
import type { ContentPageIndexType, ContentPageType } from '@/types/ContentPageType';
import type { MetadataType } from '@/types/MetadataType';
// Import relativo y explícito: este archivo también se carga desde nuxt.config.ts
// (sitemap/prerender), donde no hay auto-imports ni alias.
import { PLATFORM_SLUG, hasNextPage } from '../utils/ContentUtils';

type ProjectsStateType = {
    contents?: ContentType[],
    meta?: ApiMetaType,
}

export type ProjectsSearchParamsType = {
    search?: string,
    technology?: string,
}

/**
 * Partes del detalle que necesita el modal de proyecto.
 */
const PROJECT_DETAIL_INCLUDE = 'technologies,metadata,taxonomies';

// datas se define dentro de cada composable usando useState para evitar state leak en SSR

function contentsUrl(apiBase: string): string {
    return `${apiBase}/platforms/${PLATFORM_SLUG}/contents`;
}

function prepareDataContent(content: ContentType): ContentType {
    if (content.metadata) {
        content.metadata = prepareDataMetadata(content.metadata);
    }
    return content;
}

/**
 * Se queda con los 4 enlaces más relevantes de los metadatos, unificando
 * canal y vídeo de YouTube en `youtube`.
 */
function prepareDataMetadata(metadata: MetadataType) {
    const priority: (keyof MetadataType)[] = [
        'web', 'youtube_channel', 'youtube_video', 'youtube', 'gitlab', 'github',
        'twitter', 'linkedin', 'mastodon', 'twitch',
        'telegram_channel',
    ];

    const results: MetadataType = {};
    let counter = 0;

    if (metadata) {
        priority.forEach(p => {
            if ((p === 'youtube_channel') || (p === 'youtube_video')) {
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
 * Construye la query del listado de proyectos (`GET /platforms/{p}/contents`).
 * Los filtros vacíos no se envían.
 */
function projectsQuery(page: number, perPage: number, params: ProjectsSearchParamsType | null = null): string {
    const query = new URLSearchParams({
        type: 'project',
        page: page.toString(),
        per_page: perPage.toString(),
    });

    if (params?.search?.trim()) {
        query.append('q', params.search.trim());
    }

    if (params?.technology) {
        query.append('technology', params.technology);
    }

    return query.toString();
}

export function useProjectsData() {
    const datas = useState<ProjectsStateType>('projectsData', () => ({}));
    const currentPage = useState<number>('projectsCurrentPage', () => 1);
    const hasMorePages = useState<boolean>('projectsHasMore', () => true);
    const isLoading = useState<boolean>('projectsLoading', () => false);

    /**
     * Carga la siguiente página de proyectos (carga bajo demanda).
     */
    const fetchNextPage = async (perPage = 20) => {
        if (!hasMorePages.value || isLoading.value) return;

        // Se calcula en cada llamada para usar proxy en cliente y URL directa en servidor
        const API_URL = contentsUrl(useApiBase());

        isLoading.value = true;

        try {
            const res = await $fetch<ApiResponseType<ContentType[]>>(
                `${API_URL}?${projectsQuery(currentPage.value, perPage)}`
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
            console.error('Error fetching projects:', error);
            hasMorePages.value = false;
        } finally {
            isLoading.value = false;
        }
    };

    // Carga inicial en el cliente (usa proxy para evitar CORS)
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
 * Busca proyectos por texto y/o tecnología y carga todos los resultados.
 * Sin parámetros, vuelve a cargar el listado completo.
 */
export async function projectsDataSearch(params: ProjectsSearchParamsType | null = null) {
    const datas = useState<ProjectsStateType>('projectsData', () => ({}));
    const hasMorePages = useState<boolean>('projectsHasMore', () => true);

    // Se calcula en cada llamada para usar proxy en cliente
    const API_URL = contentsUrl(useApiBase());

    // Limpiar los datos existentes y la paginación
    datas.value = { contents: [], meta: undefined };

    // La búsqueda carga todos los resultados: no hay botón de "cargar más"
    hasMorePages.value = false;

    let hasMore = true;
    let page = 1;
    const perPage = 25;

    while (hasMore) {
        try {
            const res = await $fetch<ApiResponseType<ContentType[]>>(
                `${API_URL}?${projectsQuery(page, perPage, params)}`,
                { headers: { Accept: 'application/json' } }
            );
            const contents = (res.data ?? []).map(prepareDataContent);

            datas.value = {
                contents: [...(datas.value.contents ?? []), ...contents],
                meta: res.meta,
            };

            hasMore = hasNextPage(res.meta);
            page++;
        } catch (error) {
            console.error('FETCH projectsDataSearch ERROR', error);
            hasMore = false;
        }
    }
}

/**
 * Busca un proyecto por su slug: datos, índice de páginas, primera página
 * (en Editor.js) y las partes de PROJECT_DETAIL_INCLUDE.
 *
 * Cada llamada suma una visita al contenido en la API.
 *
 * @param slug
 * @returns
 */
export async function useGetProjectBySlug(slug: string): Promise<ContentType | null> {
    const query = new URLSearchParams({ include: PROJECT_DETAIL_INCLUDE, format: 'editorjs' });
    const API_URL = `${contentsUrl(useApiBase())}/${encodeURIComponent(slug)}?${query}`;

    try {
        const res = await $fetch<ApiResponseType<ContentType>>(API_URL);
        return res.data ? prepareDataContent(res.data) : null;
    } catch (error) {
        console.error('FETCH projectBySlug ERROR', error);
        return null;
    }
}

/**
 * Devuelve todos los proyectos paginando hasta obtenerlos todos, cada uno con
 * su índice de páginas (`pages`) para generar las rutas `/projects/:slug/:page`.
 *
 * Usado para el sitemap y el prerender (se ejecuta en Node.js, no necesita
 * proxy). Las páginas se piden a `/pages`, que a diferencia del detalle no
 * suma visitas al contenido.
 *
 * @returns Lista completa de proyectos
 */
export async function usefetchProjectsPaginated(apiBaseUrl?: string): Promise<ContentType[]> {
    const API_BASE = apiBaseUrl || process.env.API_BASE_URL || (process.env.API_DOMAIN_URL ? `${process.env.API_DOMAIN_URL}/api/v2` : 'http://127.0.0.1:8000/api/v2');
    const API_URL = contentsUrl(API_BASE);
    let allProjects: ContentType[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    try {
        while (hasMorePages) {
            const response = await fetch(`${API_URL}?${projectsQuery(currentPage, 100)}`, {
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) {
                const errorMsg = `Error fetching projects page ${currentPage}: HTTP ${response.status} from ${API_URL}`;
                console.error(errorMsg);
                if (!process.env.ALLOW_EMPTY_PROJECTS) {
                    throw new Error(errorMsg);
                }
                break;
            }

            const json = await response.json() as ApiResponseType<ContentType[]>;

            if (Array.isArray(json?.data)) {
                allProjects = [...allProjects, ...json.data];
            }

            hasMorePages = hasNextPage(json?.meta);
            currentPage++;
        }

        for (const project of allProjects) {
            if (project.pages_count) {
                project.pages = await fetchProjectPagesIndex(API_URL, project.slug);
            }
        }
    } catch (err) {
        if (!process.env.ALLOW_EMPTY_PROJECTS) {
            throw err;
        }
        console.warn(
            `[proyectos] No se pudo conectar con la API (${API_BASE}). ` +
            'ALLOW_EMPTY_PROJECTS activo: se continúa sin las rutas dinámicas de proyectos.'
        );
    }

    return allProjects;
}

/**
 * Índice de páginas de un proyecto (sin el texto) a partir de `/pages`.
 */
async function fetchProjectPagesIndex(contentsApiUrl: string, slug: string): Promise<ContentPageIndexType[]> {
    const response = await fetch(`${contentsApiUrl}/${encodeURIComponent(slug)}/pages?limit=100`, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        console.error(`Error fetching pages of project ${slug}: HTTP ${response.status}`);
        return [];
    }

    const json = await response.json() as ApiResponseType<ContentPageType[]>;

    return (json?.data ?? []).map(({ id, order, title, slug, format }) => ({ id, order, title, slug, format }));
}
