<template>
    <header class="header-container">
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
                <BtnGeneric selected text="Home" to="/" />
                <BtnGeneric text="Projects" to="/projects" />
            </div>

            <div class="inline-block">
                <BtnGeneric text="About" />
                <BtnGeneric text="Collaboration" />
            </div>

            <div class="inline-block">
                <BtnGeneric text="Services" />
                <BtnGeneric text="Contact" />
                <BtnGeneric text="Api" />
            </div>

        </nav>
    </header>
</template>


<style lang="css" scoped>
.header-container {
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
    overflow: hidden;
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

.subtitle-header {
    font-size: 1.1rem;
    font-weight: bold;
}
</style>
