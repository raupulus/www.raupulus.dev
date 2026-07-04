# Plugins y Middleware

Plugin de Google reCAPTCHA v3 y middleware global de scroll-to-top.

## Plugin: Google reCAPTCHA v3

**Archivo**: `plugins/google-recaptcha.ts`

Registra `vue-recaptcha-v3` como plugin de Vue en la aplicación Nuxt.

### Configuración

```typescript
const options: IReCaptchaOptions = {
  siteKey: runtimeConfig.public.captcha.siteKey,
  loaderOptions: {
    useRecaptchaNet: true,       // Usa recaptcha.net en lugar de google.com
    autoHideBadge: true,         // Oculta badge por defecto
    explicitRenderParameters: {
      badge: 'bottomleft',       // Posición del badge: abajo-izquierda
    },
  },
};
```

### Comportamiento

- Se carga en cliente y servidor (sin restricción `ssr: false`)
- La `siteKey` se lee de `runtimeConfig.public.captcha.siteKey` (env `CAPTCHA_SITE_KEY`)
- El badge se oculta por defecto y se muestra/oculta explícitamente en `/contact`

### Dependencias

| Paquete | Versión | Uso |
|---------|---------|-----|
| `vue-recaptcha-v3` | ^2.0.1 | Plugin de reCAPTCHA v3 para Vue |

---

## Middleware: Scroll to Top

**Archivo**: `middleware/scroll-to-top.global.ts`

Middleware global que hace smooth scroll to top al cambiar de ruta.

### Lógica

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path !== from.path) {       // Solo si cambia la ruta (no el hash)
    if (import.meta.client) {         // Solo en el cliente
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

- → [pagina-contact.md](./pagina-contact.md): reCAPTCHA usado en el formulario de contacto
- → [composables.md](./composables.md): `useGoogleRecaptcha()` wrapper del plugin
- → [nuxt-config.md](./nuxt-config.md): `CAPTCHA_SITE_KEY` en runtimeConfig
