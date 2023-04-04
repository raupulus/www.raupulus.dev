<script setup>

/**
 * Deshabilita el scroll en el body
 *
 * @param {boolean} disabled
 */
function scrollToggle(disabled) {
    if (disabled) {
        document.body.classList.add('disable-scroll');
    } else {
        document.body.classList.remove('disable-scroll');
    }
}
</script>

<template>
    <div id="app">
        <AppHeader @disablescroll="(disabled) => scrollToggle(disabled)" />

        <div id="app-box-content">
            <NuxtPage />
        </div>

        <AppFooter />
    </div>
</template>

<style>
body.disable-scroll {
    height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
}
</style>
