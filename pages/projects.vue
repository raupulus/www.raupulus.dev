<script setup>
import { ref } from 'vue';
import { projectsData, projectsDataSearch } from '@/composables/projectsData';
import { getPlatformData } from '@/composables/platformData';

let datas = projectsData();
let platformData = getPlatformData();

let searchInput = '';
let technologySelect = '';
let clearSelectOption = false;

function btnSearch() {
    clearSelectOption = technologySelect ? false : true;
    projectsDataSearch({
        search: searchInput,
        technology: technologySelect,
    })
}

function btnClear() {
    searchInput = '';
    technologySelect = '';
    clearSelectOption = true;
    projectsDataSearch();
}
</script>

<template>
    <!-- Mi trayectoria -->
    <section class="box-search">
        <div class="box-search-title text-center">
            <h2>
                Mis
                <span class="text-primary font-bold">
                    Mis Proyectos
                </span>
            </h2>
        </div>

        <!-- Buscador -->
        <div class="box-search-fields text-center">

            <div class="form-select">
                <select v-model="technologySelect" v-on:change="btnSearch">
                    <option value="" :selected="clearSelectOption">Cualquier Tecnología</option>
                    <option v-for="(ele, key) in platformData?.technologies ?? []" :key="key" :value="ele.slug">
                        {{ ele.name }}
                    </option>
                </select>
            </div>

            <!-- Input de búsqueda -->
            <div class="category-input">
                <input type="search" name="search" placeholder="Buscar Proyecto" v-model="searchInput">

                <span></span>
            </div>

            <!-- Botón de búsqueda -->
            <div>
                <BtnGeneric text="Buscar" :callback="btnSearch" />
                <BtnGeneric text="Limpiar" :callback="btnClear" />
            </div>
        </div>
    </section>

    <section class="box-projects">
        <!-- Grid de proyectos -->
        <div>
            {{ datas.pagination?.totalElements ? 'Hay ' + datas.pagination.totalElements + ' proyectos' : '' }}
        </div>

        <div>
            {{ 'Mostrando ' + (datas.contents?.length ?? 0) + ' Proyectos' }}
        </div>

        <div class="box-grid-projects">
            <CardProject v-for=" project  in  datas.contents " :key="project.slug" :data="project" />
        </div>
    </section>
</template>


<style scoped>
/** TODO: background select cambiar color **/
.box-search {}

.box-search-title {}

.box-search-fields {}

.form-select>select {
    margin: 0 auto 35px auto;
    width: 200px;
    padding: 0 10px;
    cursor: pointer;
    font-size: 1rem;
    color: var(--black);
    background-color: var(--yellow);
    border: none;
    border-radius: 50px;
}

.category-input>input {
    margin: 0 auto 35px auto;
    padding: 10px 15px;
    width: 80%;
    max-width: 600px;
    height: 40px;
    font-size: 1.3rem;
    font-weight: bold;
    color: rgba(20, 20, 20, 0.64);
    background-color: var(--gray);
    border: none;
    border-radius: 40px;
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

.box-grid-projects {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
    grid-template-rows: 1fr;
    align-items: top;
    box-sizing: border-box;
}
</style>
