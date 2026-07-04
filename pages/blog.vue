<template>
    <div class="min-h-screen bg-background">
        <!-- Cabecera de la sección -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <span class="font-label text-secondary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                <span class="w-8 h-[1px] bg-secondary"/>
                Artículos Técnicos
            </span>
            <h1 class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6 max-w-4xl">
                Mi <span class="text-on-surface-variant font-light">Blog</span> Personal
            </h1>
            <p class="text-on-surface-variant text-lg max-w-2xl border-l-2 border-secondary pl-6 py-2">
                Artículos técnicos, guías en profundidad y casos de estudio sobre arquitectura backend, IoT y sistemas distribuidos.
            </p>
        </div>

        <!-- Contenido principal -->
        <section class="px-8 pb-24 max-w-7xl mx-auto">
            <!-- Estado Work In Progress con diseño nuevo -->
            <div class="mt-8 p-12 bg-surface-container-low rounded-xl border border-outline-variant/20 text-center">
                <div class="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                    <UiMaterialIcon class="text-secondary text-3xl" name="construction" />
                </div>
                <h2 class="font-headline text-3xl font-bold tracking-tight mb-4">
                    EN CONSTRUCCIÓN
                </h2>
                <p class="text-on-surface-variant max-w-lg mx-auto mb-8 leading-relaxed">
                    Actualmente estoy trabajando en la implementación para crear las entradas desde mi panel backend
                    y poder mostrar aquí todo el blog completo.
                </p>
                <div class="flex items-center justify-center gap-3">
                    <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"/>
                    <span class="font-label text-xs text-outline uppercase tracking-widest">Despliegue en progreso...</span>
                </div>
            </div>

            <!-- Preview de artículos futuros -->
            <div class="mt-16">
                <h3 class="font-label text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-8">
                    Próximos Artículos
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <article
                        v-for="article in upcomingArticles"
                        :key="article.title"
                        class="group relative flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden opacity-60"
                    >
                        <div class="p-8">
                            <div class="flex items-center gap-2 mb-6">
                                <span class="text-[10px] font-label text-secondary uppercase tracking-[0.2em] font-bold">
                                    {{ article.type }}
                                </span>
                                <span class="w-1 h-1 bg-outline-variant rounded-full"/>
                                <span class="text-[10px] font-label text-outline uppercase tracking-[0.1em]">
                                    {{ article.readTime }}
                                </span>
                            </div>
                            <h3 class="font-headline text-xl font-bold mb-4 text-on-surface">
                                {{ article.title }}
                            </h3>
                            <p class="text-on-surface-variant text-sm mb-8 leading-relaxed">
                                {{ article.description }}
                            </p>
                            <div class="space-y-3">
                                <div
                                    v-for="tag in article.tags"
                                    :key="tag.label"
                                    class="flex items-center gap-4 text-xs font-label text-outline"
                                >
                                    <UiMaterialIcon class="text-tertiary text-sm" :name="tag.icon" />
                                    <span>{{ tag.label }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-auto p-8 pt-0">
                            <span class="inline-flex items-center gap-2 text-outline text-sm font-bold tracking-widest uppercase">
                                Próximamente <UiMaterialIcon class="text-sm" name="schedule" />
                            </span>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
// SEO de la página de blog
useHead({
    title: 'Blog Técnico | Raúl Caro Pastorino',
    meta: [
        { name: 'description', content: 'Artículos técnicos sobre backend, IoT, sistemas distribuidos y arquitectura de software por Raúl Caro Pastorino.' },
        { name: 'keywords', content: 'blog, artículos técnicos, backend, IoT, sistemas distribuidos, Raúl Caro Pastorino' },
        // noindex temporal: la página está en construcción sin contenido real.
        // Cambiar a 'index, follow' cuando se publiquen las primeras entradas.
        { name: 'robots', content: 'noindex, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Blog Técnico | Raúl Caro Pastorino' },
        { property: 'og:description', content: 'Artículos técnicos sobre backend, IoT y arquitectura de software.' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Blog Técnico | Raúl Caro Pastorino' },
        { name: 'twitter:description', content: 'Artículos técnicos sobre backend, IoT y arquitectura de software.' },
    ]
})

// Artículos próximos de ejemplo
const upcomingArticles = [
    {
        type: 'Guía en Profundidad',
        readTime: '12 min de lectura',
        title: 'El Futuro del Edge Computing',
        description: 'Analizando el cambio de aplicaciones cloud-centric a edge-native. Por qué WebAssembly se está convirtiendo en el runtime de elección para sistemas distribuidos.',
        tags: [
            { icon: 'animation', label: 'WEBASSEMBLY' },
            { icon: 'cloud_sync', label: 'EDGE COMPUTING' },
        ],
    },
    {
        type: 'Caso de Estudio',
        readTime: '20 min de lectura',
        title: 'Lecciones de un Refactoring de 2 Años',
        description: 'Desglose técnico de la descomposición de un monolito PHP legacy en un sistema distribuido usando Go y gRPC. Por qué elegimos el patrón strangler fig.',
        tags: [
            { icon: 'link', label: 'GRPC PROTOCOLS' },
            { icon: 'architecture', label: 'SYSTEM DESIGN' },
        ],
    },
    {
        type: 'Tutorial',
        readTime: '8 min de lectura',
        title: 'MQTT con Laravel y Vue.js',
        description: 'Implementación práctica de un sistema de mensajería IoT en tiempo real usando MQTT, Laravel como backend y Vue.js para el dashboard de monitorización.',
        tags: [
            { icon: 'settings_ethernet', label: 'MQTT' },
            { icon: 'hub', label: 'IOT SYSTEMS' },
        ],
    },
]
</script>
