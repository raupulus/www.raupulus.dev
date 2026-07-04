export default defineNuxtRouteMiddleware((to, from) => {
  // Solo hacer scroll to top si cambia la ruta (no el hash)
  if (to.path !== from.path) {
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
});
