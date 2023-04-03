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
                <div class="inline-block">
                    <BtnGeneric :menu="true" text="Home" to="/" />

                    <BtnGeneric :menu="true" text="Projects" to="/projects" />
                </div>

                <div class="inline-block">
                    <BtnGeneric :menu="true" to="/about" text="About" />
                    <BtnGeneric :menu="true" text="Collaborations" />
                </div>

                <div class="inline-block">
                    <BtnGeneric :menu="true" to="services" text="Services" />
                    <BtnGeneric :menu="true" to="/contact" text="Contact" />
                    <BtnGeneric :menu="true" text="Blog" />
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

@media (max-width: 768px) {
    .header-section-left {
        display: block;
        text-align: center;
    }
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

@keyframes subtitle_animation {

    0%,
    100% {
        position: absolute;
        font-size: 1.4rem;
        translate: 0 -9px;
        transform: rotate(0deg);
        color: var(--warning);
    }


    25% {
        position: absolute;
        translate: -3px -9px;
        font-size: 1.6rem;
        transform: rotate(1deg);
        color: var(--primary);
    }

    50% {
        position: absolute;
        translate: -5px 15px;
        font-size: 1.8rem;
        transform: rotate(-1deg);
        color: #2F3239;
    }
}

.subtitle-header {
    position: absolute;
    margin: 0;
    padding: 0;
    font-size: 1.4rem;
    translate: 0 -9px;
    transform: rotate(0deg);

    animation-name: subtitle_animation;
    animation-duration: 2s;
    /*animation-iteration-count: infinite;*/
    font-weight: bold;


}
</style>
