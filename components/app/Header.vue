<script setup>
const responsiveMenuActive = ref(false);
const emit = defineEmits(['disablescroll'])

/**
 * @description Check the dimensions of the window to close the menu
 */
const checkDimensions = () => {
    if (window.innerWidth > 690) {
        responsiveMenuActive.value = false;
        emit('disablescroll', responsiveMenuActive.value);
        window.removeEventListener("resize", checkDimensions)
    }
};

//onMounted(() => {
//window.addEventListener("resize", checkDimensions);
//});

//onUnmounted(() => window.removeEventListener("resize", checkDimensions));


/**
 * @description Toggle the responsive menu
 */
const toggleMenu = () => {
    responsiveMenuActive.value = !responsiveMenuActive.value;
    emit('disablescroll', responsiveMenuActive.value);

    if (!responsiveMenuActive.value) {
        console.log('Evento eliminado, quitando el listener')
        window.removeEventListener("resize", checkDimensions);
    } else {
        console.log('Evento agregado, agregando el listener')
        window.addEventListener("resize", checkDimensions);
    }
}

const buttons = [
    {
        text: 'Home',
        to: '/',
        title: 'Página principal del Portfolio',
    },
    {
        text: 'Projects',
        to: '/projects',
        title: 'Mis proyectos',
    },
    {
        text: 'About',
        to: '/about',
        title: 'Información sobre Mi',
    },
    {
        text: 'Collaborations',
        to: '/collaborations',
        title: 'Proyectos en los que he colaborado',
    },
    {
        text: 'Services',
        to: '/services',
        title: 'Servicios que ofrezco',
    },
    {
        text: 'Contact',
        to: '/contact',
        title: 'Contáctame',
    },
    {
        text: 'Blog',
        to: '/blog',
        title: 'Mi blog'
    },
]

</script>

<template>
    <header class="header-container">
        <div class="box-header">
            <div class="header-section-left">
                <div class="header-section-left-img">
                    <NuxtLink to="/" class="inline-block">
                        <img src="@/assets/images/logo.webp"
                            alt="Logotipo para el portfolio del programador Raúl Caro Pastorino, autor de la web (nick en redes sociales @raupulus)">
                    </NuxtLink>
                </div>

                <h1 class="inline-block text-primary m-0 font-title">
                    Raúl Caro Pastorino
                    <span class="block subtitle-header text-warning">
                        Desarrollador web
                    </span>
                </h1>
            </div>


            <nav class="header-section-right">
                <!-- Desktop menu -->
                <div class="box-desktop-menu">
                    <div class="inline-block">
                        <template v-for="button in buttons.slice(0, 4)" class="inline-block">
                            <BtnGeneric :menu="true" :to="button.to" :text="button.text" :title="button.title" />
                        </template>
                    </div>

                    <div class="inline-block">
                        <template v-for="button in buttons.slice(4, 7)" class="inline-block">
                            <BtnGeneric :menu="true" :to="button.to" :text="button.text" :title="button.title" />
                        </template>
                    </div>
                </div>

                <!-- Responsive menu -->
                <div class="box-responsive-menu">
                    <span class="box-icon-menu" @click="toggleMenu">
                        <svg v-if="!responsiveMenuActive" class="icon-full" viewBox="0 0 8.47 8.47"
                            xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <circle cx="4.23" cy="4.23" r="4.23" fill="#3272b8" stroke-width=".0141" />
                                <g transform="translate(.0165 .0992)" fill="#fff" stroke-width=".0126">
                                    <rect x="1.79" y="2.07" width="4.81" height=".928" ry=".367" />
                                    <rect x="1.83" y="5.27" width="4.81" height=".928" ry=".367" />
                                    <rect x="1.83" y="3.67" width="4.81" height=".928" ry=".367" />
                                </g>
                            </g>
                        </svg>

                        <svg v-if="responsiveMenuActive" class="icon-full" viewBox="0 0 8.47 8.47"
                            xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4.23" cy="4.23" r="4.23" fill="#3272b8" stroke-width=".0141" />
                            <g transform="matrix(.56 0 0 .56 1.9 1.9)" fill="#fff" stroke-width=".0168">
                                <rect transform="rotate(49.8)" x="1.28" y="-.991" width="9.24" height=".988"
                                    ry=".494" />
                                <rect transform="matrix(-.645 .764 .764 .645 0 0)" x="-4.11" y="5.47" width="9.24"
                                    height=".988" ry=".494" />
                            </g>
                        </svg>
                    </span>

                    <div class="box-responsive-menu-active" v-if="responsiveMenuActive">
                        <div v-for="button in buttons">
                            <BtnGeneric :menu="true" @click="toggleMenu" width="80%" :to="button.to"
                                :title="button.title" :text="button.text" />
                        </div>
                    </div>

                </div>

            </nav>

        </div>
    </header>
</template>


<style lang="css" scoped>
.header-container {
    margin: auto;
    width: 100%;
    max-width: 1200px;
}

.box-header {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 5px;
    color: #E6E6E6;
    padding: 10px;
}

.header-section-left {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-self: start;
    vertical-align: middle;
    border-radius: 8px;
}

.header-section-left-img img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    object-position: center;
}

.header-section-right {
    align-self: start;
    justify-self: right;
    text-align: right;
}

.subtitle-header {
    margin: 0;
    padding: 0;
    font-size: 1.4rem;
    translate: 0 -9px;
    font-weight: bold;
}

/**** Menú Responsive  ****/

.box-responsive-menu {
    display: none;
}


.box-icon-menu {
    position: fixed;
    top: 15px;
    right: 15px;
    width: 48px;
    height: 48px;
    cursor: pointer;
    z-index: 11;
}

.box-responsive-menu-active {
    position: fixed;
    display: grid;
    margin: 0;
    padding: 80px 20px;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    text-align: left;
    color: red;
    text-align: center;
    background-color: #000000cc;
    overflow: hidden;
    z-index: 10;
    box-sizing: border-box;
    opacity: 0;
    animation: fadein 0.8s;
}

.icon-full {
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .header-section-left {
        display: block;
        text-align: center;
    }
}

@media (max-width: 690px) {
    .box-header {
        grid-template-columns: 1fr;
    }

    .header-section-left {
        margin: auto;
    }

    .box-desktop-menu {
        display: none;
    }

    .box-responsive-menu {
        display: block;
    }

    .box-responsive-menu-active {
        opacity: 1;
        animation: fadein 0.5s;
    }
}
</style>
