<template>
    <div class="header-container">
        <div class="header-section header-section-left">
            <img src="@/assets/images/logo.webp">
        </div>

        <div class="header-section header-section-right">
            <BtnGeneric selected text="Home" />

            <BtnGeneric text="Projects" />

            <BtnGeneric text="About" />

            <BtnGeneric text="Collaboration" />

            <BtnGeneric text="Services" />

            <BtnGeneric text="Contact" />

            <BtnGeneric text="Api" />
        </div>
    </div>
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
