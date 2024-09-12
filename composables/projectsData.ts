import { ref, onMounted } from 'vue';
import { type ContentType } from '@/types/ContentType';
import { type MetadataType } from '@/types/MetadataType';
import { type PaginationType } from '@/types/PaginationType';
import { type SearchParamsType } from '@/types/SearchParamsType';

type ResponseContentType = {
    pagination?: PaginationType,
    search_content?: SearchParamsType,
    contents?: ContentType[],
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

    const fetchData = async () => {
        const response = await fetch(API_URL);
        if (response.ok) {
            const res = await response.json();
            datas.value = prepareData(res);
        } else {
            console.error('FETCH projectsData ERROR', response);
        }
    };

    onMounted(fetchData);

    return {
        datas,
        fetchData, // exposing fetchData in case it needs to be called manually
    };
}

export function projectsDataSearch(params: {} | null = null) {
    const runtimeConfig = useRuntimeConfig();
    const API_BASE = runtimeConfig.public.api.base;
    const API_URL = `${API_BASE}/platform/portfolio/content/type/project`;
    const URL = params ? `${API_URL}?${new URLSearchParams(params).toString()}` : API_URL;

    fetch(URL, {
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(res => {
            datas.value = prepareData(res);
        })
        .catch(err => console.error('FETCH projectsDataSearch ERROR', err));
}
