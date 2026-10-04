<script setup lang="ts">
</script>

<template>
    <div id="app" class="bg-background text-on-background font-body min-h-screen flex flex-col">
        <!-- Enlace para saltar al contenido principal (U-A11Y-008) -->
        <a
            href="#app-box-content"
            class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-md focus:shadow-lg focus:outline-none font-bold"
        >
            Saltar al contenido principal
        </a>

        <!-- Cabecera fija -->
        <AppHeader />

        <!-- Contenido principal con padding para el header fijo -->
        <main id="app-box-content" class="flex-1 pt-20">
            <slot />
        </main>

        <!-- Pie de página -->
        <AppFooter />

        <!-- Control de cookies -->
        <CookieControl locale="es" />
    </div>
</template>

<style>
#app-box-content {
    min-height: calc(100dvh - 80px);
}
</style>
