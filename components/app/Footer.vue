<template>
    <!-- Pie de página principal -->
    <footer role="contentinfo" class="bg-background w-full border-t border-outline-variant/20">
        <div class="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
            <!-- Columna izquierda: nombre y copyright -->
            <div class="text-center md:text-left">
                <div class="text-primary font-bold font-headline tracking-tighter text-lg mb-2">
                    RAÚL CARO PASTORINO
                </div>
                <div class="font-body text-xs tracking-widest uppercase text-on-surface-variant">
                    © {{ currentYear }} Raúl Caro Pastorino · Hecho con software libre
                </div>
            </div>

            <!-- Columna derecha: enlaces legales y estado del sistema -->
            <div class="flex flex-wrap justify-center gap-6 md:gap-8">
                <NuxtLink
                    to="/privacy/"
                    class="font-body text-xs tracking-widest uppercase text-on-surface-variant hover:text-tertiary transition-colors"
                >
                    Política de Privacidad
                </NuxtLink>
                <NuxtLink
                    to="/cookies/"
                    class="font-body text-xs tracking-widest uppercase text-on-surface-variant hover:text-tertiary transition-colors"
                >
                    Cookies
                </NuxtLink>
                <button
                    type="button"
                    class="font-body text-xs tracking-widest uppercase text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer bg-transparent border-none p-0"
                    @click="openCookiePreferences"
                >
                    Preferencias de Cookies
                </button>
                <NuxtLink
                    to="/legal/"
                    class="font-body text-xs tracking-widest uppercase text-on-surface-variant hover:text-tertiary transition-colors"
                >
                    Aviso Legal
                </NuxtLink>
                <NuxtLink
                    to="/contact/"
                    class="font-body text-xs tracking-widest uppercase text-on-surface-variant hover:text-tertiary transition-colors"
                >
                    Contacto
                </NuxtLink>
                <!-- Enlace al código fuente del portfolio -->
                <a
                    href="https://gitlab.com/raupulus/www.raupulus.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver código fuente en GitLab (abre en nueva pestaña)"
                    aria-label="Ver código fuente de este portfolio en GitLab (abre en nueva pestaña)"
                    class="font-body text-xs tracking-widest uppercase text-on-surface-variant hover:text-tertiary transition-colors"
                >
                    Código de esta web
                </a>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
    const cookieControl = useCookieControl();

    const openCookiePreferences = () => {
        cookieControl.isModalActive.value = true;
    };

    // Año actual para el copyright: fijado con base de compilación e hidratación cliente segura
    const currentYear = ref(2026);
    onMounted(() => {
        currentYear.value = new Date().getFullYear();
    });
</script>
