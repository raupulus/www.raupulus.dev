import { ref } from 'vue'
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
//const searchParams = ref<SearchParamsType>({});

function prepareData(res: ResponseContentType) {
    if (res.contents) {
        res.contents.forEach(ele => ele = prepareDataContent(ele));
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

    if (metadata && Object.keys(metadata).length) {
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


    // TODO: Compone y añade la url a los usuarios recibidos.

    //console.log(metadata);
    //console.log(results);

    return results;
}

export function projectsData() {
    const runtimeConfig = useRuntimeConfig()

    const API_BASE = runtimeConfig.public.api.base

    let API_URL = API_BASE + '/v1/platform/portfolio/content/type/project'

    useFetch(API_URL, {
        lazy: true,
        onResponse({ request, response, options }) {
            const res = prepareData(response._data)
            datas.value = res
        },
        onResponseError({ request, response, options }) {
            console.log('FETCH projectsData ERROR', response, options)
        }

        /*

        onRequestError({ request, options, error }) {
            // Handle the request errors
        },
        onResponse({ request, response, options }) {
            // Process the response data
            localStorage.setItem('token', response._data.token)
        },
        onResponseError({ request, response, options }) {
            // Handle the response errors
        }
        */
    })

    return datas
}

export function projectsDataSearch(params: {} | null = null) {
    const runtimeConfig = useRuntimeConfig()
    const API_BASE = runtimeConfig.public.api.base
    const API_URL = API_BASE + '/v1/platform/portfolio/content/type/project'
    const URL = params ? API_URL + '?' + new URLSearchParams(params).toString() : API_URL

    fetch(URL, {
        'mode': 'cors',
        'cache': 'no-cache',
        //'credentials': 'include',
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'Access-Control-Allow-Origin': 'true',
            //"Access-Control-Allow-Credentials": 'true',
            //'X-CSRF-TOKEN': useCookie('XSRF-TOKEN').value ?? '',
        },
    })
        .then(response => response.json())
        .then(res => datas.value = prepareData(res))
        .catch(err => console.log('FETCH 3', err));

}
