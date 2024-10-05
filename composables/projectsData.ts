import { ref, onMounted } from 'vue';
import { type ContentType } from '@/types/ContentType';
import { type MetadataType } from '@/types/MetadataType';
import { type PaginationType } from '@/types/PaginationType';
import { type SearchParamsType } from '@/types/SearchParamsType';

type ResponseContentType = {
    pagination?: PaginationType,
    search_params?: SearchParamsType,
    contents?: ContentType[],
}

type ResponseProjectType = {
    ok?: boolean,
    content?: ContentType,
}

const datas = ref<ResponseContentType>({});

function prepareData(res: ResponseContentType) {
    if (res.contents) {
        res.contents.forEach(ele => {
            ele = prepareDataContent(ele);
        });
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

    let results: MetadataType = {};
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
    const runtimeConfig = useRuntimeConfig();
    const API_BASE = runtimeConfig.public.api.base;
    const API_URL = `${API_BASE}/platform/portfolio/content/type/project`;

    const fetchData = async (page = 1, quantity = 10) => {
        //console.log(`Fetching data for page: ${page}`);  // Log for debugging
        const params = new URLSearchParams({ page: page.toString(), quantity: quantity.toString() });
        const response = await fetch(`${API_URL}?${params}`);

        if (response.ok) {
            const res = await response.json();
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
            return newData.pagination?.hasNextPage ?? false;
        } else {
            console.error('FETCH projectsData ERROR', response);
            return false;
        }
    };

    onMounted(async () => {
        await fetchData();

        setTimeout(async () => {
            let hasMore = datas.value.pagination?.hasNextPage;
            let currentPage = 1;

            while (hasMore) {
                currentPage += 1;  // Increment page number
                //console.log(`Requesting page: ${currentPage}`);  // Log for debugging
                hasMore = await fetchData(currentPage);
            }
        }, 50);

    });

    return {
        datas,
        fetchData,
    };
}

export async function projectsDataSearch(params: {} | null = null) {
    const runtimeConfig = useRuntimeConfig();
    const API_BASE = runtimeConfig.public.api.base;
    const API_URL = `${API_BASE}/platform/portfolio/content/type/project`;

    datas.value.contents = [];  // Limpiar los datos existentes
    datas.value.pagination = undefined;  // Reiniciar la paginación

    let hasMore = true;
    let page = 1;
    const quantity = 15;  // Cantidad de proyectos por página

    while (hasMore) {
        const searchParams = new URLSearchParams(params as Record<string, string> || []);
        searchParams.append('page', page.toString());
        searchParams.append('quantity', quantity.toString());
        const requestURL = `${API_URL}?${searchParams.toString()}`;

        //console.log(`Fetching search data for page: ${page}`);  // Log para depuración
        const response = await fetch(requestURL, {
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const res: ResponseContentType = await response.json();
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
        } else {
            console.error('FETCH projectsDataSearch ERROR', response);
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
    const runtimeConfig = useRuntimeConfig();
    const API_BASE = runtimeConfig.public.api.base;
    const API_URL = `${API_BASE}/content/portfolio/${slug}/get`;

    let project: ContentType | null = null;

    const response = await fetch(API_URL);
    if (response.ok) {
        const res = await response.json();
        project = prepareDataProjectResponse(res).content ?? null;
    } else {
        console.error('FETCH projectBySlug ERROR', response);
    }

    return project;
}

/**
 *
 * Devuelve todos los proyectos paginando hasta obtenerlos todos.
 * Usado principalmente para el sitemap
 *
 * @param apiBaseUrl
 * @returns
 */
export async function usefetchProjectsPaginated(): Promise<ContentType[]> {
    const apiBaseUrl = process.env.API_BASE_URL; // Asegúrate de sustituir esta línea por la URL correcta

    let page = 1;
    const quantity = 15; // Cantidad de proyectos por página
    let totalProjects: ContentType[] = [];
    let hasMorePages = true;

    interface ProjectResponseType {
        pagination: PaginationType;
        contents: ContentType[];
    }

    while (hasMorePages) {
        const response = await fetch(`${apiBaseUrl}/platform/portfolio/content/type/project?page=${page}&quantity=${quantity}`);
        const data: ProjectResponseType = await response.json();
        totalProjects = [...totalProjects, ...data.contents];

        hasMorePages = data.pagination.hasNextPage;
        page++;
    }

    return totalProjects;
}
