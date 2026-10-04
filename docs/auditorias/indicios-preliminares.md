# Indicios preliminares — solo para `MODO=interno`

> **No leer en `MODO=externo`.** Generado el 2026-10-04 a partir de una lectura rápida del código al preparar
> `PROMPT-AUDITORIA.md`. **No son hallazgos verificados**: son hipótesis que la auditoría interna debe confirmar
> o descartar con evidencia y reflejar en `cobertura.md` (con su ID de hallazgo o como «descartado»).

## SEO y metadatos

1. `public/favicons/site.webmanifest` referencia iconos en `/assets/favicons/*.png`, ruta que no existe en
   `public/` (¿iconos 404?). Además `theme_color` y `background_color` son blancos con un tema oscuro.
2. `app.vue` define `ogImage` y `twitterImage` relativos (`/logo_512x512.png`) y `twitterCard: 'summary'`,
   mientras `nuxt.config.ts` (`app.head`) define `og:image` y `twitter:image` en `raw.githubusercontent.com`
   con `summary_large_image`. ¿Hay metaetiquetas duplicadas o contradictorias en el HTML final?
3. `nuxt.config.ts` → `sitemap.defaults.lastmod: new Date()`: el `lastmod` sería la fecha del build.
4. `og:locale:alternate = en_US` sin versión en inglés (ya reconocido en `TODO.md`).
5. JSON-LD de `app.vue`: `sameAs` usa `twitter.com` y no incluye Bluesky (añadida recientemente al sitio).
6. `app.vue` carga `usePlatformData()` en `onNuxtReady` y `composables/projectsData.ts` carga en `onMounted`:
   ¿faltan en el HTML estático las tecnologías, las redes o el listado de proyectos? (SEO, CLS y dependencia de
   la API en tiempo de ejecución).

## Seguridad y privacidad

7. `utils/sanitize.ts`: `sanitizeHtml` permite los atributos `style` e `id`, y `sanitizeRawHtml` admite
   `iframe` de cualquier origen.
8. CSP (`apache.conf` y `nginx.conf`) con `'unsafe-inline'`, `'unsafe-eval'` e `img-src https:`. `frame-src` no
   incluye proveedores de embeds (YouTube, etc.): ¿se bloquean los embeds o hay que ajustar la CSP? `nginx.conf`
   envía `X-XSS-Protection`; HSTS sin `includeSubDomains`.
9. `apache.conf` contiene en `ServerAdmin` una dirección de correo distinta de la pública, en un repositorio con
   mirror de push a GitHub. Comprobar contra la norma de contacto de `AGENTS.md`.
10. `app.vue`: al aceptar la analítica también se conceden `ad_user_data` y `ad_personalization`, y no se
    gestiona la revocación del consentimiento.
11. `plugins/google-recaptcha.ts` se registra globalmente: ¿se carga reCAPTCHA (y sus cookies) en todas las
    páginas y sin consentimiento?
12. `nuxt.config.ts` define `runtimeConfig.captcha.secretKey` en un sitio estático sin servidor.
13. `utils/apiClient.ts` → `apiPost`: lee `useCookie('XSRF-TOKEN')` antes de pedir la cookie CSRF. ¿Se
    actualiza la ref tras la petición? ¿Puede el dominio `raupulus.dev` leer una cookie emitida por
    `api.raupulus.dev` (dominio de la cookie)? Posible cabecera `X-XSRF-TOKEN` vacía en el primer envío.

## Robustez, rendimiento y responsive

14. `public/.htaccess`: fallback a `/index.html` (soft-404 con código 200) y `ExpiresDefault "access plus
1 month"`, que también afecta al HTML (¿chunks inexistentes tras un redespliegue?). Contradice el
    `ErrorDocument 404` de `apache.conf`; `nginx.conf` también hace fallback SPA. ¿Qué configuración es la real?
15. Hooks `prerender:routes` y `sitemap.urls` de `nuxt.config.ts`: si la API falla, `apiFetchRaw` devuelve
    `null`. ¿Puede salir un build «verde» sin proyectos ni sitemap?
16. `utils/apiClient.ts` → `apiGet` envía `Content-Type: application/json` en peticiones GET (preflight CORS
    innecesario) y devuelve `null` en silencio ante cualquier error.
17. `components/HeaderImage.vue` no se usa en ningún sitio y referencia `assets/images/technologies/*.webp`, que
    no existe.
18. `components/modals/submitContact.vue` usa GIF animados (`pc-load.gif`, `email-send.gif`) con `<img>` sin
    dimensiones.
19. `app.vue` (`body.disable-scroll { height: 100vh }`) y `layouts/default.vue`
    (`min-height: calc(100vh - 80px)`): comportamiento con la barra dinámica de iOS.
20. `middleware/scroll-to-top.global.ts` usa `behavior: 'smooth'` sin comprobar `prefers-reduced-motion`.

## Dependencias, CI/CD y documentación

21. `pnpm-lock.yaml`, `pnpm-workspace.yaml` y `.npmrc` (`shamefully-hoist`) están versionados, aunque
    `AGENTS.md` exige npm y prohíbe `pnpm-lock.yaml`.
22. `gocd.yaml`, stage `deploy`: la verificación `curl … | grep -q "200"` no hace fallar el job (sin
    `set -e`/`pipefail`, y el `echo` final siempre acaba con éxito). El job no recupera el artefacto
    `.output/public` del stage `build`. No hay stages de `vue-tsc` ni de `npm audit`, y no se purga la caché de
    Cloudflare.
23. Versión de la API: `AGENTS.md` documenta `/api/v1`, pero `composables/useApiBase.ts`, `utils/apiClient.ts`
    y `env.example` usan `/api/v2`.
24. Node local v26 sin versión fijada en el proyecto (`engines`, `.nvmrc`).
