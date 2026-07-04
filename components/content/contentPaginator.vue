<template>
    <div v-if="totalpages" class="navigation-box">
        <span
:class="(currentpage <= 1) ? 'navigation-arrow-disabled' : 'navigation-arrow-pointer'"
            @click="(currentpage > 1) ? changePageEmit(currentpage - 1, contentslug) : null">
            <svg
:class="'navigation-arrow-left' + ((currentpage <= 1) ? ' navigation-arrow-disabled' : '')"
                fill="currentColor" viewBox="0 0 20 20">
                <path
fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"/>
            </svg>
        </span>

        <template v-if="totalpages <= 5">
            <span
                v-for="page of totalpages" :key="page"
                :class="'navigation-page' + (page === currentpage ? ' navigation-page-current' : '')"
                @click="() => (currentpage !== page) ? changePageEmit(page, contentslug) : null">
                {{ page }}
            </span>
        </template>

        <template v-else>
            <span
                v-for="pos in getArrayPaginationPositions()" :key="pos"
                :class="'navigation-page' + ((pos) === currentpage ? ' navigation-page-current' : '')"
                @click="() => (currentpage !== (pos)) ? changePageEmit(pos, contentslug) : null">
                {{ pos }}
            </span>
        </template>

        <span
:class="(currentpage >= totalpages) ? 'navigation-arrow-disabled' : 'navigation-arrow-pointer'"
            @click="(currentpage < totalpages) ? changePageEmit(currentpage + 1, contentslug) : null">
            <svg
:class="'navigation-arrow-right' + ((currentpage >= totalpages) ? ' navigation-arrow-disabled' : '')"
                fill="currentColor" viewBox="0 0 20 20">
                <path
fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"/>
            </svg>
        </span>

    </div>
</template>

<script lang="ts" setup>
import type { ContentType } from '@/types/ContentType';

const config = useRuntimeConfig();
const urlBase = config.public.app.url;

const emit = defineEmits(['slugchange', 'metatagchange']);

const props = defineProps({
    project: {
        required: true,
        type: Object as PropType<ContentType | undefined>,
    },
    contentslug: {
        required: true,
        default: ''
    },
    currentpage: {
        required: true,
        default: 1
    },
    totalpages: {
        required: true,
        default: 1
    },
})

const changePageEmit = async (page: number, projectSlug: string) => {
    const contentPage = await usePageData(page, projectSlug);

    // Emito evento al padre para actualizar el slug de la url
    emit('slugchange', projectSlug, contentPage.value?.slug)

    // Preparo datos para actualizar metatags
    const title = props.project?.title + ' - ' + contentPage.value?.title;
    const description = props.project?.excerpt;

    const categories = props.project?.categories ?? [];
    const tags = props.project?.tags ?? [];
    const technologies = props.project?.technologies?.map(technology => technology.name) ?? [];

    const keywords = [...categories, ...tags, ...technologies].join(',');

    let url = undefined;

    if (props.project?.slug && contentPage.value?.slug) {
        url = `${urlBase}/projects/${props.project?.slug}/${contentPage.value?.slug}`;
    } else if (props.project?.slug) {
        url = `${urlBase}/projects/${props.project?.slug}`;
    }

    const image = contentPage.value?.images?.large;

    // Cambio los metatags de la página
    emit('metatagchange', title, description, keywords, url, image);
}

/*
 * Devuelve la paginación cuando hay más de 5 páginas.
 */
const getArrayPaginationPositions = () => {
    const currentPage = props.currentpage;
    const totalpages = props.totalpages;

    if (currentPage === 1) {
        return [1, currentPage + 1, currentPage + 2, currentPage + 3, totalpages]
    } else if (currentPage === 2) {
        return [1, currentPage, currentPage + 1, currentPage + 2, totalpages]
    } else if (currentPage === totalpages) {
        return [1, currentPage - 3, currentPage - 2, currentPage - 1, totalpages]
    } else if (currentPage === totalpages - 1) {
        return [1, currentPage - 2, currentPage - 1, currentPage, totalpages]
    } else if (currentPage === totalpages - 2) {
        return [1, currentPage - 1, currentPage, currentPage + 1, totalpages]
    }


    return [1, currentPage - 1, currentPage, currentPage + 1, totalpages]
}

</script>

<style scoped>
.navigation-page {
    display: inline-flex;
    margin-left: -1px;
    padding: 0.5rem 1rem;
    text-align: center;
    align-items: center;
    background-color: #fff;
    color: #0056b3;
    font-size: 0.9rem;
    border: 1px solid rgba(209, 213, 219, 0.8);
    line-height: 1.25rem;
    font-weight: 500;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.navigation-page:hover {
    cursor: pointer;
    background-color: #0056b3;
    color: #fff;
}

.navigation-page-current {
    background-color: #0056b3;
    color: #fff;
}

.navigation-page-current:hover {
    cursor: not-allowed;
}

.navigation-page.navigation-page-points {
    color: rgba(55, 65, 81, 0.8);
}

.navigation-page.navigation-page-points:hover {
    cursor: not-allowed;
    background-color: #fff;
    color: #0056b3;
}

/* Flechas de navegación */

.navigation-arrow-left,
.navigation-arrow-right {
    display: inline-flex;
    margin: 0.3rem 0;
    width: 2.75rem;
    height: 3.75rem;
    vertical-align: middle;
}

.navigation-arrow-pointer {
    cursor: pointer;
}

.navigation-arrow-disabled {
    cursor: not-allowed;
}
</style>
