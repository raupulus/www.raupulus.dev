import { ref } from 'vue'
import { ContentType } from '../types/ContentType';
import { MetadataType } from '~~/types/MetadataType';
import { PaginationType } from '~~/types/PaginationType';
import { SearchParamsType } from '~~/types/SearchParamsType';
const datas = ref([]);

const runtimeConfig = useRuntimeConfig()
const API_BASE = runtimeConfig.public.api.base

let API_URL = API_BASE + '/v1/platform/portfolio/content/type/project'

type ResponseContentType = {
    pagination: PaginationType,
    search_content: SearchParamsType,
    contents: ContentType[],
}


/* tslint:disable-next-line */
function prepareData(res: ResponseContentType) {
    /* tslint:disable-next-line */
    res.contents.forEach(ele => ele = prepareDataContent(ele));

    return res;
}

/* tslint:disable-next-line */
function prepareDataContent(content: ContentType) {

    if (content.metadata) {
        content.metadata = prepareDataMetadata(content.metadata);
    }

    return content;
}

/* tslint:disable-next-line */
function prepareDataMetadata(metadata: MetadataType) {
    const priority = [
        'web', 'youtube_channel', 'youtube_video', 'youtube', 'gitlab', 'github',
        'twitter', 'linkedin', 'mastodon', 'twitch',
        'telegram_channel',
    ];

    let results = {};

    let counter = 0;

    if (metadata && Object.keys(metadata).length) {
        priority.forEach(p => {
            if ((p === 'youtube_channel') || (p === 'youtube_video')) {
                if (metadata[p] && counter < 4) {

                    if (!results.youtube) {
                        counter++;
                    }

                    /* tslint:disable-next-line */
                    results.youtube = metadata[p];
                }
            } else if (metadata[p] && counter < 4) {
                counter++;

                /* tslint:disable-next-line */
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
    //const datas = ref<ProjectType | null>(null)
    fetch(API_URL)
        .then(response => response.json())
        .then(res => datas.value = prepareData(res));

    return datas
}

export function projectsDataSearch(params = null) {
    fetch(params ? API_URL + `?search=${params.search}` : API_URL)
        .then(response => response.json())
        .then(res => datas.value = prepareData(res));
}
