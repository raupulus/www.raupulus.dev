<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: {
        type: Object as PropType<NuxtError>,
        required: true,
    },
})

const is404 = computed(() => props.error?.statusCode === 404)

useHead({
    title: computed(() => (is404.value ? 'Página no encontrada' : 'Error') + ' | Raúl Caro Pastorino'),
    meta: [
        { name: 'robots', content: 'noindex, follow' },
    ],
})

const handleClearError = () => clearError({ redirect: '/' })
</script>

<template>
    <div class="min-h-screen bg-background text-on-background font-body flex flex-col circuit-pattern">
        <main class="flex-1 flex items-center justify-center px-8 py-24">
            <div class="max-w-2xl w-full text-center">
                <!-- Código de error -->
                <p class="font-label text-tertiary tracking-[0.3em] uppercase text-xs mb-6 flex items-center justify-center gap-3">
                    <span class="w-8 h-[1px] bg-tertiary" />
                    Error {{ error?.statusCode ?? 500 }}
                    <span class="w-8 h-[1px] bg-tertiary" />
                </p>

                <h1 class="font-headline text-6xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-primary mb-8">
                    {{ error?.statusCode ?? 500 }}
                </h1>

                <h2 class="font-headline text-2xl md:text-3xl font-bold tracking-tight mb-4">
                    {{ is404 ? 'Página no encontrada' : 'Algo ha salido mal' }}
                </h2>

                <p class="text-on-surface-variant text-lg leading-relaxed max-w-lg mx-auto mb-12">
                    {{ is404
                        ? 'La ruta que buscas no existe o ha cambiado de sitio. Puedes volver al inicio o explorar mis proyectos.'
                        : 'Se ha producido un error inesperado. Puedes volver al inicio e intentarlo de nuevo.' }}
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        type="button"
                        class="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-widest uppercase rounded-lg hover:scale-95 transition-all duration-300"
                        @click="handleClearError"
                    >
                        Volver al Inicio
                    </button>
                    <NuxtLink
                        to="/projects"
                        class="px-8 py-4 border border-outline-variant hover:border-primary transition-all rounded-lg font-headline font-bold text-on-surface tracking-widest uppercase text-sm"
                    >
                        Ver Proyectos
                    </NuxtLink>
                </div>
            </div>
        </main>
    </div>
</template>
