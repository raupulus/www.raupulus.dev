# Plan de remediación consolidado

> Sustituye a los planes de las tres auditorías. Usa los ID unificados (`U-…`) de [hallazgos.json](hallazgos.json); el
> detalle técnico de cada uno está en el informe de referencia indicado en su campo `informe_referencia`. Gestor de
> paquetes: **pnpm** (decisión del propietario). Esfuerzos orientativos para una persona.

## Fase 0 — Urgente (24–48 h): recuperar producción y blindar el despliegue

| Orden | Hallazgos              | Acción                                                                                                                                                                                                                                                        | Esfuerzo    |
| ----- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 1     | U-INFRA-006            | Commitear la migración pendiente (commits temáticos: API v2, tipos y tests, componentes, docs y pnpm) y subirla. Etiquetar la versión desplegada actual.                                                                                                      | S           |
| 2     | U-BUG-001, U-BUG-002   | Cargar los proyectos en la plataforma `portfolio` de la API v2 (o reactivar `api/v1` en solo lectura temporalmente). Arreglo inmediato: enlace del CV a `https://api.raupulus.dev/cv/pdf`.                                                                    | M (backend) |
| 3     | U-BUG-002, U-BUG-018   | El build debe fallar si no hay proyectos (`nitro.prerender.failOnError` + comprobación en `prerender:routes`) y leer la URL de la API de una sola fuente.                                                                                                     | S           |
| 4     | U-INFRA-001, U-DEP-001 | Pipeline con pnpm: `pnpm install --frozen-lockfile` en lugar de `npm ci`; variables de build (`APP_URL`, `API_*`); `fetch` del artefacto; verificación con `set -euo pipefail`; eliminar `package-lock.json`; `packageManager` y `engines` en `package.json`. | S           |
| 5     | U-SEC-003              | Revisar en la API `TrustHosts`/`TrustProxies`, forzar `APP_URL`, vaciar cachés y buscar en los logs peticiones con Host o X-Forwarded-Host anómalos.                                                                                                          | M (backend) |

**Criterio de aceptación.** `/projects/` lista los proyectos sin errores de consola; un build con la API caída falla; el
pipeline completo pasa en verde con pnpm.

## Fase 1 — Quick wins (1–2 días)

| Hallazgos                                     | Acción                                                                                                                                                                                      | Esfuerzo |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| U-SEC-002                                     | HSTS en Cloudflare (6 meses, sin `preload` al principio).                                                                                                                                   | XS       |
| U-BUG-004, U-BUG-013, U-SEO-012               | Quitar el fallback SPA de `public/.htaccess` (404 reales, `404.html` con `noindex`); manifest con rutas, `theme_color` y `start_url` correctos; `meta theme-color`; un solo favicon `.ico`. | XS       |
| U-SEO-002                                     | Una sola forma de URL (sin barra final y `DirectorySlash Off`, o canonical y sitemap con barra).                                                                                            | S        |
| U-PERF-001                                    | `Cache-Control` `immutable` en `/_nuxt`, `/_fonts` y `/_ipx`; revalidación en el HTML; quitar `ExpiresDefault` del `.htaccess`.                                                             | XS       |
| U-SEC-001, U-SEC-007                          | Cabeceras de seguridad (CSP primero en `Report-Only`); `Options -Indexes`, `ServerTokens Prod`.                                                                                             | S        |
| U-LEGAL-001, U-LEGAL-003, U-LEGAL-004         | Banner con «Rechazar» y texto propio; Consent Mode solo con `analytics_storage`; rama de revocación que borre `_ga*`.                                                                       | S        |
| U-LEGAL-002, U-PERF-002, U-BUG-012, U-DEP-004 | reCAPTCHA (o Turnstile) solo en `/contact`; `gtag` solo tras el consentimiento.                                                                                                             | S        |
| U-RESP-001, U-RESP-002                        | `z-[60]` en el modal de proyecto; título «ESPECIALIZACIONES» responsive.                                                                                                                    | XS       |
| U-A11Y-001                                    | Tokens con contraste suficiente en el footer, `/blog`, hovers y bordes.                                                                                                                     | XS       |
| U-BUG-010                                     | Sintaxis correcta de `sizes` en la galería.                                                                                                                                                 | XS       |
| U-UX-002, U-CONT-003                          | Deshabilitar el formulario mientras no funcione y enlazar `mailto:public@raupulus.dev`.                                                                                                     | XS       |
| U-INFRA-004                                   | DNS de `www` con redirección 301.                                                                                                                                                           | XS       |
| U-SEC-005                                     | Aceptar solo `https:` (y lista blanca de hosts en embeds) en `BlockEmbed :src` y `BlockLinkTool :href`.                                                                                     | XS       |

## Fase 2 — Sprint 1 (≈ 1 semana): proyectos indexables, accesibles y estables

Requiere la Fase 0 (datos en la API v2).

| Hallazgos                                                          | Acción                                                                                                                                                                                                       | Esfuerzo |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| U-SEO-001, U-SEO-003, U-PERF-009                                   | Página de detalle de proyecto generada en build (`useAsyncData`) con contenido, `h1`, metadatos y JSON-LD propios; listado con enlaces reales. Desplegar el código actual (canonical, `h1` único y JSON-LD). | L        |
| U-A11Y-002                                                         | Tarjetas como `NuxtLink` y filtros como `<button aria-pressed>`.                                                                                                                                             | S        |
| U-BUG-005, U-A11Y-003, U-UX-003, U-RESP-004, U-RESP-005, U-BUG-014 | Modal como estado de ruta (o eliminado a favor de la página), `<dialog>` nativo, tokens del tema, `overflow-wrap`, `100dvh`, metadatos con `useSeoMeta` reactivo en el `setup`.                              | M        |
| U-BUG-006, U-BUG-007, U-BUG-011                                    | Estados de carga, vacío, error y «no encontrado»; búsqueda cancelable y reflejada en la URL.                                                                                                                 | S        |
| U-BUG-008, U-A11Y-007                                              | `BlockCode` como texto escapado y botón «Copiar» accesible; revisar el resto de botones solo-icono.                                                                                                          | XS       |
| U-SEC-004, U-SEC-006                                               | Lista blanca de iframes en `sanitizeRawHtml`; quitar `style`/`id` del sanitizador y forzar `rel`.                                                                                                            | S        |
| U-A11Y-005, U-A11Y-006, U-SEO-007                                  | Listas con `<ul>`/`<ol>`/`<li>`; tablas con `<caption>` y `scope`; niveles de `BlockHeader` mapeados a `h2`–`h4`.                                                                                            | S        |
| U-SEO-004, U-SEO-006                                               | Imágenes `og` de 1200×630 absolutas; JSON-LD completo (`ProfilePage`, `BreadcrumbList`, `CreativeWork`).                                                                                                     | S        |

## Fase 3 — Sprint 2 (≈ 1 semana): formulario, legal, rendimiento y calidad

| Hallazgos                                                              | Acción                                                                                                                                                                                                                                    | Esfuerzo    |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| U-BUG-003                                                              | CSRF entre subdominios (`SESSION_DOMAIN=.raupulus.dev`) o endpoint de contacto stateless con captcha y límite de peticiones; validación en el servidor (ver `recomendaciones-api.md` de `claude-interna`, API-03 y API-05).               | S (backend) |
| U-BUG-009, U-A11Y-004, U-LEGAL-008, U-BUG-016                          | Formulario con `<textarea>` y `type="submit"`, validaciones realistas, errores accesibles (`aria-invalid`, `aria-describedby`, `aria-live`) y casillas de consentimiento separadas; limpieza del modal de envío y del `router.afterEach`. | S           |
| U-LEGAL-005, U-LEGAL-006, U-LEGAL-007, U-LEGAL-009                     | Política de privacidad completa, `/cookies` con inventario, `/legal` y declaración de accesibilidad; API sin sesiones en lecturas públicas.                                                                                               | M           |
| U-PERF-003, U-PERF-004, U-PERF-005, U-PERF-006, U-PERF-007, U-PERF-008 | Precarga de fuentes críticas y menos pesos; métricas de fallback; imágenes con dimensiones; GIF a CSS o vídeo; recompresión; iconos SVG bajo demanda; revisar el chunk de entrada.                                                        | M           |
| U-DEP-002, U-DEP-003, U-DEP-005, U-DEP-006                             | `@nuxt/devtools` ≥ 3.3.1, Nuxt 4.5, `isomorphic-dompurify` actualizado; `pnpm add -D @vitest/coverage-v8`; `.nvmrc` y `engines`; quitar `ts-node` y `tsconfig-paths`.                                                                     | M           |
| U-CODE-001, U-CODE-004, U-CODE-005, U-UX-006                           | Eliminar los 11 archivos muertos, `public/patterns/a.png` y el CSS residual; actualizar la documentación.                                                                                                                                 | S           |
| U-A11Y-008, U-A11Y-009, U-SEO-008                                      | Enlace «Saltar al contenido», Esc y foco en el menú móvil, `scroll-padding-top`; `reduced-motion` en el scroll por JS; `alt` descriptivos en la galería.                                                                                  | S           |

## Fase 4 — Mejora continua

| Hallazgos                                                                                                                                                                                                   | Acción                                                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| U-INFRA-002, U-SEC-009                                                                                                                                                                                      | Inventariar la configuración real de Apache y Cloudflare y versionarla en un repositorio privado de infraestructura. |
| U-INFRA-003                                                                                                                                                                                                 | Releases atómicas (enlace simbólico), smoke test de varias rutas y purga de Cloudflare.                              |
| U-INFRA-005                                                                                                                                                                                                 | Monitor con aserción de contenido sobre `/projects/`, captura de errores JS e informes de CSP.                       |
| U-SEC-008                                                                                                                                                                                                   | Decidir si se reescribe el historial (correo personal en commits) y cambiar `ServerAdmin` a `public@raupulus.dev`.   |
| U-SEC-010, U-SEC-011                                                                                                                                                                                        | Quitar la clave privada del frontend; CAA, DMARC `quarantine`→`reject` y `security.txt`.                             |
| U-SEO-005, U-SEO-009, U-SEO-010, U-SEO-011, U-UX-001, U-UX-004, U-UX-005, U-RESP-003, U-RESP-006, U-RESP-007, U-RESP-008, U-CONT-001, U-CONT-002, U-CONT-004, U-BUG-015, U-BUG-017, U-LEGAL-010, U-A11Y-010 | Pulido de contenido, metadatos, design system y detalles de producción que se corrigen al desplegar.                 |
| U-DEP-007, U-CODE-002, U-CODE-003                                                                                                                                                                           | Renovate, tests de regresión por cada bug corregido y props tipadas.                                                 |

## Controles preventivos

1. **CI con pnpm:** `pnpm install --frozen-lockfile` → `pnpm lint` (0 errores) → `pnpm exec vue-tsc --noEmit` →
   `pnpm test:run` con cobertura mínima → `pnpm audit --prod --audit-level high` → `pnpm generate` con comprobación
   del número de rutas de proyecto → smoke E2E con Playwright sobre el build (cada ruta 200, 404 real, consola limpia,
   sin scroll horizontal a 320 px) → axe sin violaciones `serious` → Lighthouse CI con presupuestos.
2. **Despliegue verificado:** smoke test que falle de verdad, purga de caché y rollback automático.
3. **Monitorización** de disponibilidad y contenido, errores JS, CSP y Search Console.
4. **Renovate** semanal agrupado.
5. **Checklist de revisión de MR:** contraste, botones y enlaces reales con nombre accesible, responsive a 320 px,
   `useHead` completo en páginas nuevas, nada de `npm` en scripts nuevos.
6. **Coordinación API–frontend:** no retirar versiones de la API sin periodo de convivencia ni sin desplegar antes el
   frontend.
