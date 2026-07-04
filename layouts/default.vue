<script setup lang="ts">
</script>

<template>
    <div id="app" class="bg-background text-on-background font-body min-h-screen flex flex-col">
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
    min-height: calc(100vh - 80px);
}
</style>
