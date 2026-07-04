<template>
    <!-- Pie de página principal -->
    <footer role="contentinfo" class="bg-background w-full border-t border-outline-variant/20">
        <div class="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
            <!-- Columna izquierda: nombre y copyright -->
            <div class="text-center md:text-left">
                <div class="text-primary font-bold font-headline tracking-tighter text-lg mb-2">
                    RAÚL CARO PASTORINO
                </div>
                <div class="font-body text-xs tracking-widest uppercase text-outline-variant">
                    © {{ currentYear }} RAÚL CARO PASTORINO. DISEÑADO CON PRECISIÓN. HECHO CON AMOR.
                </div>
            </div>

            <!-- Columna derecha: enlaces legales y estado del sistema -->
            <div class="flex flex-wrap justify-center gap-8">
                <NuxtLink
                    to="/privacy"
                    class="font-body text-xs tracking-widest uppercase text-outline-variant hover:text-tertiary transition-colors"
                >
                    Política de Privacidad
                </NuxtLink>
                <NuxtLink
                    to="/contact"
                    class="font-body text-xs tracking-widest uppercase text-outline-variant hover:text-tertiary transition-colors"
                >
                    Contacto
                </NuxtLink>
                <!-- Indicador de estado del sistema -->
                <div class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"/>
                    <span class="font-body text-xs tracking-widest uppercase text-primary">Sistema Activo</span>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
// Año actual para el copyright
const currentYear = new Date().getFullYear()
</script>
