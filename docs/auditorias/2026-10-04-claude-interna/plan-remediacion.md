# Plan de remediación

> Ordenado por dependencias técnicas: hay que hacer cada fase antes de la siguiente. Las estimaciones suman los
> esfuerzos de los hallazgos (XS < 30 min, S < 2 h, M < 1 día, L 1–3 días) y son orientativas para una persona.

## Fase 0 — Urgente (≤ 24-48 h): recuperar un producción funcional y no empeorarlo

Objetivo: que el portfolio vuelva a mostrar proyectos y que ningún despliegue pueda borrarlos.

| Orden | Hallazgos         | Acción                                                                                                                                                                                     | Esfuerzo    |
| ----- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| 1     | INFRA-006         | Commitear la migración pendiente en `dev` (commits temáticos) y subirla. Etiquetar el estado de producción actual.                                                                         | S           |
| 2     | API-02, BUG-001   | Migrar los proyectos a la plataforma `portfolio` de la API v2 (o reactivar `api/v1` en solo lectura mientras tanto). Arreglo inmediato: enlace del CV a `https://api.raupulus.dev/cv/pdf`. | M (backend) |
| 3     | BUG-002, CODE-001 | El build debe fallar si no hay proyectos (`failOnError`, comprobación en `prerender:routes`) y leer la API desde una única fuente.                                                         | S           |
| 4     | SEC-003, API-01   | Investigar el host `evil.example` en la API (`TrustHosts`, `forceRootUrl`, vaciar cachés).                                                                                                 | M (backend) |
| 5     | INFRA-001         | Arreglar el pipeline: quitar `NODE_ENV=production` global, `fetch` del artefacto y verificación con `set -euo pipefail`.                                                                   | S           |

**Criterio de aceptación.** `https://raupulus.dev/projects/` lista los proyectos sin errores de consola; un build con la
API caída falla; el pipeline completo pasa en verde.

## Fase 1 — Quick wins (1-2 días): alto impacto, poco esfuerzo

| Hallazgos                             | Acción                                                                                            | Esfuerzo |
| ------------------------------------- | ------------------------------------------------------------------------------------------------- | -------- |
| SEC-002                               | Activar HSTS en Cloudflare (6 meses, sin `preload` al principio).                                 | XS       |
| SEO-004, BUG-011                      | Quitar el fallback SPA de `public/.htaccess` (404 reales) y corregir las rutas del manifest.      | XS       |
| SEO-002                               | `DirectorySlash Off` + reescritura, o canonical y sitemap con barra final: una sola forma de URL. | S        |
| PERF-001                              | Cabeceras de caché (`immutable` en `/_nuxt`, `/_fonts`, `/_ipx`; revalidación en el HTML).        | XS       |
| SEC-001                               | Cabeceras de seguridad en Cloudflare o Apache (CSP primero en `Report-Only`).                     | S        |
| SEC-006                               | `Options -Indexes`, `ServerTokens Prod`, `ServerSignature Off`.                                   | XS       |
| LEGAL-001                             | `isAcceptNecessaryButtonEnabled: true` y texto propio del banner.                                 | XS       |
| LEGAL-003                             | Consent Mode: solo `analytics_storage` y rama de revocación.                                      | S        |
| LEGAL-002, PERF-002, BUG-010, DEP-004 | reCAPTCHA solo en `/contact` (o Turnstile) y `gtag` solo tras el consentimiento.                  | S        |
| RESP-001                              | `z-index` del modal por encima del header.                                                        | XS       |
| RESP-002                              | Tamaño responsive del título «ESPECIALIZACIONES».                                                 | XS       |
| A11Y-001                              | Tokens con contraste suficiente en el footer, `/blog`, los hovers y los bordes.                   | XS       |
| BUG-008                               | Sintaxis correcta de `sizes` en la galería.                                                       | XS       |
| UX-002, CONT-004                      | Deshabilitar el formulario mientras no funcione y enlazar `mailto:public@raupulus.dev`.           | XS       |
| INFRA-004                             | DNS de `www` con redirección 301.                                                                 | XS       |

## Fase 2 — Sprint 1 (1 semana): proyectos indexables y accesibles

Dependencia: Fase 0 completada (hay datos en la API v2).

| Hallazgos                                     | Acción                                                                                                                                | Esfuerzo |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| SEO-001, PERF-006, API-08                     | Página de detalle de proyecto con `useAsyncData` en build (contenido, `h1`, metadatos y JSON-LD propios).                             | L        |
| SEO-003                                       | Desplegar el código actual (canonical, `h1` único, JSON-LD) cuando estén listas las fases 0 y 2.                                      | XS       |
| A11Y-002                                      | Tarjetas como `NuxtLink` y filtros como `<button aria-pressed>`.                                                                      | S        |
| BUG-003, A11Y-003, UX-003, RESP-004, RESP-005 | Modal convertido en estado de ruta (o eliminado a favor de la página), `<dialog>` nativo, tokens del tema, `overflow-wrap`, `100dvh`. | M        |
| BUG-005, BUG-009                              | Estados de carga, vacío y error; búsqueda cancelable y reflejada en la URL.                                                           | S        |
| BUG-006, A11Y-009                             | `BlockCode` como texto escapado y botón «Copiar» accesible.                                                                           | XS       |
| SEC-004, SEC-005                              | Lista blanca de iframes en `BlockEmbed` y `sanitizeRawHtml`; quitar `style`/`id` del sanitizador.                                     | S        |
| SEO-005, SEO-007                              | Imágenes `og` 1200×630 absolutas; JSON-LD completo (`ProfilePage`, `BreadcrumbList`, `CreativeWork`).                                 | S        |

## Fase 3 — Sprint 2 (1 semana): formulario, legal y calidad

| Hallazgos                                                | Acción                                                                                                                                                                           | Esfuerzo    |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| BUG-004, API-03, API-05                                  | CSRF entre subdominios (`SESSION_DOMAIN`) o endpoint stateless; validación en el servidor.                                                                                       | S (backend) |
| BUG-007, A11Y-005, LEGAL-006, BUG-012, BUG-013           | Formulario con `<textarea>`, validaciones realistas, errores accesibles y casillas separadas; quitar el `router.afterEach` que se acumula y el código muerto del modal de envío. | S           |
| LEGAL-004, LEGAL-005, LEGAL-007                          | Política de privacidad completa, `/legal`, `/cookies`; API sin sesiones en lecturas públicas.                                                                                    | M           |
| DEP-001, DEP-005                                         | Solo npm (`npm ci`), sin restos de pnpm, Node fijado.                                                                                                                            | S           |
| DEP-002, DEP-003, DEP-006                                | Actualizar Nuxt 4.5, `isomorphic-dompurify`, devtools ≥ 3.3.1; instalar `@vitest/coverage-v8`; quitar dependencias sin uso.                                                      | M           |
| CODE-002, CODE-005, CODE-006                             | Eliminar los 11 archivos muertos y CSS residual; actualizar la documentación.                                                                                                    | S           |
| A11Y-004, A11Y-006, A11Y-007, A11Y-008, SEO-009, SEO-010 | `alt` descriptivos, jerarquía de encabezados, `reduced-motion` en JS, enlace «saltar al contenido» y Esc en el menú.                                                             | S           |
| PERF-003, PERF-004, PERF-005                             | Precarga de fuentes, métricas de fallback, GIF a CSS/vídeo, recompresión de imágenes.                                                                                            | S           |

## Fase 4 — Mejoras estructurales (continuo)

| Hallazgos                                                                                                                       | Acción                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| INFRA-002, SEC-008                                                                                                              | Inventariar y versionar la configuración real (Apache + Cloudflare) en un repositorio privado de infraestructura. |
| INFRA-003                                                                                                                       | Releases atómicas con enlace simbólico, smoke test multi-ruta y purga de Cloudflare.                              |
| INFRA-005                                                                                                                       | Monitor con aserción de contenido, captura de errores JS y `report-to` de la CSP.                                 |
| SEC-007                                                                                                                         | Decidir si se reescribe el historial (correo personal en commits) o se acepta el riesgo.                          |
| SEC-009, SEC-010                                                                                                                | Quitar la clave privada del frontend; CAA, DMARC `quarantine`→`reject`, `security.txt`.                           |
| SEO-006, SEO-008, SEO-011, CONT-001, CONT-002, CONT-003, UX-001, UX-004, UX-005, UX-006, RESP-003, RESP-006, RESP-007, RESP-008 | Pulido de contenido, metadatos y design system.                                                                   |
| DEP-007, CODE-003, CODE-004                                                                                                     | Renovate, tests de regresión por cada bug corregido y props tipadas.                                              |

## Controles preventivos (para que no reaparezcan)

1. **Puertas del CI** (INFRA-001): `npm ci` → `lint` (0 errores) → `vue-tsc --noEmit` → `test:run` con cobertura mínima
   → `npm audit --omit=dev --audit-level=high` → `generate` con comprobación del número de rutas de proyecto →
   smoke E2E con Playwright sobre el build (cada ruta 200, 404 real, sin errores de consola, sin scroll horizontal a
   320 px) → axe sin violaciones `serious`/`critical` → `linkinator` → Lighthouse CI con presupuestos (móvil:
   Performance ≥ 90, LCP ≤ 2,5 s, CLS ≤ 0,1, Accessibility ≥ 95, SEO = 100).
2. **Despliegue verificado** (INFRA-003): smoke test que falle de verdad, purga de caché y rollback automático.
3. **Monitorización** (INFRA-005): disponibilidad con aserción de contenido, errores JS e informes de CSP, Search
   Console con alertas.
4. **Renovate** (DEP-007) con agrupación semanal.
5. **Checklist de revisión de MR**: contraste de los colores nuevos, `aria-label` en botones solo-icono, elementos
   clicables como `<button>`/`<a>`, responsive a 320 px y `useHead` completo en páginas nuevas.
6. **Coordinación API–frontend** (API-06): no retirar versiones de la API sin un periodo de convivencia y sin
   desplegar antes el frontend.
