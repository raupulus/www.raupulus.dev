export default defineNuxtRouteMiddleware((to, from) => {
    // Solo hacer scroll to top si cambia la ruta (no el hash)
    if (to.path !== from.path) {
        if (import.meta.client) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    }
});
