<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProjectsData, projectsDataSearch } from '@/composables/projectsData';
import { getPlatformData } from '@/composables/platformData';

const config = useRuntimeConfig();
const route = useRoute();
const slugContent = ref(route.params.slugs[0]);
const slugPage = ref(route.params.slugs[1]);


const url = config.public.app.url;
const title = 'Proyectos de Raúl Caro Pastorino';
const description = 'Explora una colección de proyectos destacados realizados por Raúl Caro Pastorino. Descubre innovaciones y desarrollos tecnológicos en diferentes áreas.';
const keywords = 'proyectos, Raúl Caro Pastorino, desarrollo, tecnología, innovaciones';

useHead({
    title: title,
    meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url + '/projects' },
        { property: 'og:image', content: url + '/social/projects.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: url + '/social/projects.webp' }
    ]
});


let platformData = getPlatformData();
const { datas } = useProjectsData();



let searchInput = '';
let clearSelectOption = false;
const technologySelect = ref(''); // Slug de la tecnología actual
const currentTechnology = ref(); // Tecnología actual

/*
 * When the technology slug changes, update the current technology.
 */
watch(technologySelect, (currentSlug) => {
    currentTechnology.value = getTechnologyBySlug(currentSlug);
});

function btnSearch() {
    clearSelectOption = !technologySelect.value;
    projectsDataSearch({
        search: searchInput,
        technology: technologySelect.value,
    });
}

function btnClear() {
    searchInput = '';
    technologySelect.value = '';
    clearSelectOption = true;
    projectsDataSearch();
}

function handleClickTechnology(params: any) {
    technologySelect.value = params.technologySelect;
    clearSelectOption = !technologySelect.value;
    projectsDataSearch({
        search: searchInput,
        technology: technologySelect.value,
    });
}











// En desarrollo -->

// Función para cambiar el slug en la URL
// Posteriormente se deberán detectar los slug de entrada para abrir el modal con el proyecto correspondiente.
const handleChangeUrlSlug = (contentSlug: string | undefined, pageSlug: string | undefined) => {
    let newUrl = window.location.origin + '/projects';

    if (contentSlug) {
        slugContent.value = contentSlug;
        slugPage.value = pageSlug ?? '';

        const newSlug = pageSlug ? contentSlug + '/' + pageSlug : contentSlug;
        newUrl = window.location.origin + '/projects/' + newSlug;
    } else {
        slugContent.value = '';
        slugPage.value = '';
    }



    window.history.pushState({}, '', newUrl);
};





</script>

<template>
    <div>
        <section class="box-search">
            <div class="box-search-title text-center">
                <h2>
                    Mis
                    <span class="text-primary font-bold">
                        Proyectos
                    </span>
                </h2>
            </div>

            <div class="box-search-fields text-center">
                <div v-if="technologySelect && currentTechnology?.name">
                    Buscando por tecnología
                    <img v-if="currentTechnology?.urlImageSmall" class="img-technology-search"
                        :src="currentTechnology.urlImageSmall" :alt="currentTechnology.name"
                        :title="currentTechnology.name">
                    <span class="technology-select-feature" :style="'color:' + (currentTechnology?.color ?? '#E29244')">
                        {{ currentTechnology?.name }}
                    </span>
                </div>

                <div class="category-input">
                    <input type="search" name="search" placeholder="Buscar Proyecto" v-model="searchInput">
                    <span></span>
                </div>

                <GridTechnologies :technologies="platformData?.technologies"
                    @clickTechnologySelect="handleClickTechnology" :technologySelect="technologySelect" />

                <div>
                    <BtnGeneric text="Buscar" :callback="btnSearch" title="Buscar Proyectos" />
                    <BtnGeneric text="Limpiar" :callback="btnClear" title="Limpiar Filtro" />
                </div>
            </div>
        </section>

        <section class="box-projects">
            <div class="projects-content-resume">
                <img v-if="currentTechnology?.urlImageSmall" class="img-technology-search"
                    :src="currentTechnology.urlImageSmall" :alt="currentTechnology.name"
                    :title="currentTechnology.name">
                {{ datas.pagination?.totalElements ? 'Hay ' + datas.pagination.totalElements + ' proyectos' : '' }}
            </div>

            <GridProjects v-if="datas?.contents" :projects="datas?.contents" @slugchange="handleChangeUrlSlug" />
        </section>
    </div>
</template>


<style scoped>
/** TODO: background select cambiar color **/
/*
.box-search {}

.box-search-title {}

.box-search-fields {}
*/

.img-technology-search {
    margin-left: 2px;
    margin-right: 1px;
    width: 17px;
    height: 17px;
    translate: 0 3px;
}

.technology-select-feature {
    font-weight: bold;
    font-size: 1.1rem;
    text-shadow: 1px 1px 1px #000;
}

.category-input>input {
    margin: 0 auto;
    padding: 10px 15px;
    width: 80%;
    max-width: 600px;
    height: 40px;
    font-size: 1.3rem;
    font-weight: bold;
    color: rgba(20, 20, 20, 0.64);
    background-color: var(--gray);
    border: none;
    border-radius: 8px;
    box-sizing: border-box;
}

.category-input>input::placeholder {
    font-style: italic;
}

.category-input>span {
    position: absolute;
    width: 40px;
    height: 40px;
    padding: 0;
    margin: 0;
    translate: -60px;
    border: 1px solid transparent;
    border-radius: inherit;
    background: transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E") no-repeat center;
    cursor: pointer;
    opacity: 0.5;
}

.category-input>span:hover {
    opacity: 1;
}

.category-input>span:focus,
.category-input>input:focus {
    box-shadow: 0 0 3px 0 var(--primary);
    border-color: var(--primary);
    outline: none;
}

/*** Proyectos ***/
.box-projects {
    margin-top: 4rem;
    padding: 2rem 1.3rem
}

.projects-content-resume {
    text-align: right;
}

@media (max-width: 880px) {
    .box-projects {
        margin-top: 0.6rem;
        padding: 1.3rem 0.6rem;
    }
}
</style>
