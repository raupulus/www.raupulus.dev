<template>
    <!-- Barra de navegación principal fija -->
    <header
        class="fixed top-0 w-full z-50 transition-all duration-300 border-b border-outline-variant/10"
        :class="isScrolled ? 'bg-[#091421]/95 backdrop-blur-xl shadow-lg' : 'bg-[#091421]/40 backdrop-blur-xl'"
    >
        <nav aria-label="Navegación principal" class="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
            <!-- Logo / Nombre -->
            <NuxtLink
                to="/"
                class="text-xl font-black tracking-tighter text-primary font-headline hover:opacity-80 transition-opacity"
            >
                RAÚL CARO PASTORINO
            </NuxtLink>

            <!-- Navegación escritorio -->
            <div class="hidden md:flex gap-4 lg:gap-6 items-center flex-wrap">
                <NuxtLink
                    v-for="link in navLinks"
                    :key="link.to"
                    :to="link.to"
                    class="font-headline tracking-tight text-sm font-bold uppercase transition-colors"
                    :class="isActiveRoute(link.to)
                        ? 'text-primary border-b-2 border-primary pb-1'
                        : 'text-primary/60 hover:text-primary'"
                >
                    {{ link.label }}
                </NuxtLink>
            </div>

            <!-- Botón CTA escritorio -->
            <NuxtLink
                to="/contact"
                class="hidden md:block bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-md font-headline text-xs font-bold tracking-widest uppercase hover:scale-95 transition-all duration-300"
            >
                Contacto
            </NuxtLink>

            <!-- Botón menú móvil -->
            <button
                class="md:hidden text-primary p-2"
                :aria-label="isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
                :aria-expanded="isMobileMenuOpen"
                aria-controls="mobile-menu"
                @click="toggleMobileMenu"
            >
                <UiMaterialIcon class="text-2xl" :name="isMobileMenuOpen ? 'close' : 'menu'" />
            </button>
        </nav>

        <!-- Menú móvil desplegable -->
        <Transition name="slide-down">
            <div
                v-if="isMobileMenuOpen"
                id="mobile-menu"
                class="md:hidden bg-[#121c2a] border-t border-outline-variant/20 px-8 py-6"
            >
                <div class="flex flex-col gap-4">
                    <NuxtLink
                        v-for="link in navLinks"
                        :key="link.to"
                        :to="link.to"
                        class="font-headline tracking-tight text-sm font-bold uppercase transition-colors py-2"
                        :class="isActiveRoute(link.to) ? 'text-primary' : 'text-primary/60 hover:text-primary'"
                        @click="isMobileMenuOpen = false"
                    >
                        {{ link.label }}
                    </NuxtLink>
                    <NuxtLink
                        to="/contact"
                        class="mt-2 bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-md font-headline text-xs font-bold tracking-widest uppercase text-center"
                        @click="isMobileMenuOpen = false"
                    >
                        Contacto
                    </NuxtLink>
                </div>
            </div>
        </Transition>
    </header>
</template>

<script setup lang="ts">
// Enlace de navegación
interface NavLink {
    to: string
    label: string
}

// Rutas de navegación principal
const navLinks: NavLink[] = [
    { to: '/', label: 'Inicio' },
    { to: '/projects', label: 'Proyectos' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'Sobre Mí' },
    { to: '/webs', label: 'Webs' },
    { to: '/social', label: 'Social' },
    { to: '/contact', label: 'Contacto' },
]

const route = useRoute()
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

// Detecta si la ruta actual coincide con el enlace
const isActiveRoute = (path: string): boolean => {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
}

// Alterna el menú móvil
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Detecta el scroll para cambiar el estilo del header
onMounted(() => {
    const handleScroll = () => {
        isScrolled.value = window.scrollY > 20
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
