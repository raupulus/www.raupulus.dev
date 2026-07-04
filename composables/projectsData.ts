import { onMounted } from 'vue';
import type { ContentType } from '@/types/ContentType';
import type { MetadataType } from '@/types/MetadataType';
import type { PaginationType } from '@/types/PaginationType';
import type { SearchParamsType } from '@/types/SearchParamsType';

type ResponseContentType = {
    pagination?: PaginationType,
    search_params?: SearchParamsType,
    contents?: ContentType[],
}

type ResponseProjectType = {
    ok?: boolean,
    content?: ContentType,
}

// datas se define dentro de cada composable usando useState para evitar state leak en SSR

function prepareData(res: ResponseContentType) {
    if (res.contents) {
        res.contents = res.contents.map(ele => prepareDataContent(ele));
    }
    return res;
}

function prepareDataProjectResponse(res: ResponseProjectType) {
    if (res.content) {
        res.content = prepareDataContent(res.content);
    }

    return res;
}

function prepareDataContent(content: ContentType) {
    if (content.metadata) {
        content.metadata = prepareDataMetadata(content.metadata);
    }
    return content;
}

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

export function useProjectsData() {
    const datas = useState<ResponseContentType>('projectsData', () => ({}));
    const currentPage = useState<number>('projectsCurrentPage', () => 1);
    const hasMorePages = useState<boolean>('projectsHasMore', () => true);
    const isLoading = useState<boolean>('projectsLoading', () => false);

    /**
     * Carga la siguiente página de proyectos (carga bajo demanda).
     */
    const fetchNextPage = async (quantity = 20) => {
        if (!hasMorePages.value || isLoading.value) return;

        // Se calcula en cada llamada para usar proxy en cliente y URL directa en servidor
        const API_BASE = useApiBase();
        const API_URL = `${API_BASE}/platform/portfolio/content/type/project`;

        isLoading.value = true;

        try {
            const params = new URLSearchParams({
                page: currentPage.value.toString(),
                quantity: quantity.toString(),
            });
            const res = await $fetch<ResponseContentType>(`${API_URL}?${params}`);
            const newData = prepareData(res);

            if (currentPage.value === 1) {
                datas.value = newData;
            } else {
                if (newData.contents) {
                    datas.value.contents = [...(datas.value.contents ?? []), ...newData.contents];
                }
                if (newData.pagination) {
                    datas.value.pagination = newData.pagination;
                }
            }

            hasMorePages.value = newData.pagination?.hasNextPage ?? false;

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

export async function projectsDataSearch(params: Record<string, string> | null = null) {
    const datas = useState<ResponseContentType>('projectsData', () => ({}));

    // Se calcula en cada llamada para usar proxy en cliente
    const API_BASE = useApiBase();
    const API_URL = `${API_BASE}/platform/portfolio/content/type/project`;

    datas.value.contents = [];  // Limpiar los datos existentes
    datas.value.pagination = undefined;  // Reiniciar la paginación

    let hasMore = true;
    let page = 1;
    const quantity = 15;  // Cantidad de proyectos por página

    while (hasMore) {
        const searchParams = new URLSearchParams(params ?? {});
        searchParams.append('page', page.toString());
        searchParams.append('quantity', quantity.toString());
        const requestURL = `${API_URL}?${searchParams.toString()}`;

        try {
            const res = await $fetch<ResponseContentType>(requestURL, {
                headers: {
                    Accept: 'application/json',
                },
            });
            const newData = prepareData(res);

            if (page === 1) {
                datas.value = newData;
            } else {
                if (newData.contents) {
                    datas.value.contents = [...(datas.value.contents ?? []), ...newData.contents];
                }
                if (newData.pagination) {
                    datas.value.pagination = newData.pagination;
                }
            }

            hasMore = newData.pagination?.hasNextPage ?? false;
            page++;
        } catch (error) {
            console.error('FETCH projectsDataSearch ERROR', error);
            hasMore = false;
        }
    }
}

/**
 * Busca un contenido de por el slug
 *
 * @param slug
 * @returns
 */
export async function useGetProjectBySlug(slug: string): Promise<ContentType | null> {
    const API_BASE = useApiBase();
    const API_URL = `${API_BASE}/content/portfolio/${slug}/get`;

    try {
        const res = await $fetch<ResponseProjectType>(API_URL);
        return prepareDataProjectResponse(res).content ?? null;
    } catch (error) {
        console.error('FETCH projectBySlug ERROR', error);
        return null;
    }
}

/**
 * Devuelve todos los proyectos paginando hasta obtenerlos todos.
 * Usado principalmente para el sitemap (se ejecuta en Node.js, no necesita proxy).
 *
 * @returns Lista completa de proyectos
 */
export async function usefetchProjectsPaginated(): Promise<ContentType[]> {
    const API_BASE = process.env.API_BASE_URL || 'https://api.raupulus.dev/api/v1';
    let allProjects: ContentType[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    try {
        while (hasMorePages) {
            const response = await fetch(
                `${API_BASE}/platform/portfolio/content/type/project?page=${currentPage}&quantity=50`
            );

            if (!response.ok) {
                console.error(`Error fetching projects page ${currentPage}: HTTP ${response.status}`);
                break;
            }

            const data = await response.json();

            if (data?.contents && Array.isArray(data.contents)) {
                allProjects = [...allProjects, ...data.contents];
            }

            if (data?.pagination?.hasNextPage) {
                currentPage++;
            } else {
                hasMorePages = false;
            }
        }
    } catch (error) {
        console.error('Error fetching projects for sitemap/prerender:', error);
    }

    return allProjects;
}