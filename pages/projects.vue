<script setup>
function btnSearch() {
    alert('Buscar');
}

function btnClear() {
    alert('Limpiar');
}

const projects = [
    {
        title: 'title1',
        description: 'description2',
        image: 'https://placeimg.com/400/280/arch',
        slug: 'slug1',
        links: [
            {
                icon: 'gitlab',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'github',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'twitter',
                url: 'https://raupulus.dev'
            },
        ]
    },
    {
        title: 'title2',
        description: 'description2',
        image: 'https://placeimg.com/400/280/nature',
        slug: 'slug2',
        links: [
            {
                icon: 'web',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'gitlab',
                url: 'https://raupulus.dev'
            },
        ]
    },
    {
        title: 'title3',
        description: 'description3',
        image: 'https://placeimg.com/400/280/people',
        slug: 'slug3',
        links: [
            {
                icon: 'youtube',
                url: 'https://raupulus.dev'
            },
        ]
    },
    {
        title: 'title4',
        description: 'description4',
        image: 'https://placeimg.com/400/280/animals',
        slug: 'slug4',
        links: [
            {
                icon: 'twitch',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'mastodon',
                url: 'https://raupulus.dev'
            },

            {
                icon: 'linkedin',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'gitlab',
                url: 'https://raupulus.dev'
            },
        ]
    },
    {
        title: 'title5',
        description: 'description5',
        image: 'https://placeimg.com/400/280/tech',
        slug: 'slug5',
        links: [
            {
                icon: 'gitlab',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'github',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'twitter',
                url: 'https://raupulus.dev'
            },
        ]
    },
    {
        title: 'title6',
        description: 'description6',
        image: 'https://placeimg.com/400/280/animals',
        slug: 'slug6',
        links: [
            {
                icon: 'gitlab',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'github',
                url: 'https://raupulus.dev'
            },
            {
                icon: 'twitter',
                url: 'https://raupulus.dev'
            },
        ]
    },

];

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

            <!-- Selector de categorías -->
            <div class="category-selector">
                <select>
                    <option value="0">Categoría</option>
                    <option value="1">Categoría 1</option>
                    <option value="2">Categoría 2</option>
                    <option value="3">Categoría 3</option>
                    <option value="4">Categoría 4</option>
                    <option value="5">Categoría 5</option>
                </select>
            </div>

            <!-- Input de búsqueda -->
            <div class="category-input">
                <input type="search" placeholder="Buscar Proyecto">

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
        <div class="box-grid-projects">
            <CardProject v-for="project in projects" :key="project.slug" :data="project" />
        </div>
    </section>
</template>


<style scoped>
/** TODO: background select cambiar color **/
.box-search {}

.box-search-title {}

.box-search-fields {}

.category-selector>select {
    margin: 0 auto 35px auto;
    width: 200px;
    padding: 0 10px;
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
