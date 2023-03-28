<template>
    <header class="header-container">
        <div class="header-section header-section-left">
            <NuxtLink to="/">
                <img src="@/assets/images/logo.webp"
                    alt="Logotipo de Raúl Caro Pastorino, autor de la web (nick @raupulus)">
            </NuxtLink>
        </div>

        <nav class="header-section header-section-right">
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
            </div>

            <div class="inline-block">
                <BtnGeneric text="Api" />
            </div>
        </nav>
    </header>
</template>


<style lang="css" scoped>
.header-container {
    display: grid;
    grid-template-columns: repeat(2, auto);
    gap: 5px;
    color: #E6E6E6;
    padding: 10px;
}

.header-section {
    display: inline-block;
}

.header-section-left {
    width: 80px;
    height: 80px;
    justify-self: start;
    vertical-align: middle;
    overflow: hidden;
    text-align: center;
    align-self: center;
    border-radius: 8px;
}

.header-section-left img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.header-section-right {
    justify-self: end;
    vertical-align: middle;
    align-self: center;
}
</style>
