# Plugins y Middleware

Middleware global de scroll-to-top para transiciones de navegación.

## Middleware: Scroll to Top

**Archivo**: `middleware/scroll-to-top.global.ts`

Middleware global que hace smooth scroll to top al cambiar de ruta.

### Lógica

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path !== from.path) {
        // Solo si cambia la ruta (no el hash)
        if (import.meta.client) {
            // Solo en el cliente
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
```

### Características

- **Global**: se aplica a todas las rutas (sufijo `.global.ts`)
- **Solo ruta**: ignora cambios de hash (ej. `#section` → `#section2`)
- **Solo cliente**: no se ejecuta en SSR (`import.meta.client`)
- **Smooth scroll**: animación suave al ir arriba

## Relaciones con otros módulos

- → [layout-navegacion.md](./layout-navegacion.md): transiciones y navegación
- → [nuxt-config.md](./nuxt-config.md): configuración general de Nuxt
