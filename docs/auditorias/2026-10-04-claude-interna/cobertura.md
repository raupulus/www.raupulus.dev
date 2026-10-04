# Cobertura de la checklist (sección 6 del prompt)

Leyenda: ✅ verificado y correcto · ❌ hallazgo (ID) · ⚠️ no verificable (motivo) · ➖ no aplica (motivo).

## 6.1 Seguridad

| Ítem                                                                      | Estado | Detalle                                                                                          |
| ------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| Secretos en el repo y en todo el historial                                | ✅     | `git log -p --all` + patrones; `.env` nunca versionado. Sin gitleaks/trufflehog (no instalados). |
| Secretos o datos internos en el build                                     | ✅     | Sin clave privada, sin `localhost`, sin `*.map` en el build A.                                   |
| `runtimeConfig` sin datos privados en `public`                            | ❌     | SEC-009 (clave privada innecesaria en un SSG; no se filtra).                                     |
| Información de infraestructura en el repositorio público                  | ❌     | SEC-008, SEC-007                                                                                 |
| Archivos que no deberían servirse                                         | ❌     | SEC-006 (`/_nuxt/` indexado); `.htaccess` 403 ✅; `.env`/`.git` → soft-404 (SEO-004).            |
| Inventario de `v-html`, `innerHTML`, `useHead` con script                 | ✅     | 14 `v-html` (13 sanitizados + `MaterialIcon` con SVG propio) y 1 JSON-LD estático.               |
| Configuración de DOMPurify (`style`, esquemas, `target`, `id`)            | ❌     | SEC-005 (PoC local)                                                                              |
| `sanitizeRawHtml` y `BlockEmbed` (iframes)                                | ❌     | SEC-004                                                                                          |
| `BlockCode`, `BlockQuote`, `BlockLinkTool`, `BlockImage`, `BlockAttaches` | ❌     | BUG-006 (`BlockCode`). `BlockQuote` sanitizado ✅.                                               |
| JSON-LD con datos de la API (escape de `</script>`)                       | ➖     | El JSON-LD actual es estático (no usa datos de la API).                                          |
| URLs de la API a partir de slugs                                          | ✅     | `encodeURIComponent` en todas.                                                                   |
| `target="_blank"` con `rel`                                               | ✅     | Estáticos correctos; contenido de la API, ver SEC-005.                                           |
| CSRF de Sanctum entre subdominios                                         | ❌     | BUG-004                                                                                          |
| Validación en cliente, anti-spam y doble envío                            | ❌     | BUG-007 (validaciones); honeypot, tiempo mínimo y bloqueo de doble envío ✅.                     |
| Requisitos del backend del formulario                                     | ❌     | `recomendaciones-api.md` API-05                                                                  |
| CORS de la API                                                            | ✅     | Restringido a `https://raupulus.dev` con credenciales.                                           |
| Proxy de desarrollo `/_proxy/**`                                          | ✅     | No existe en producción (preset `static`).                                                       |
| CSP (necesidad de `unsafe-*`, `img-src`, `frame-src`, `connect-src`…)     | ❌     | SEC-001 (no hay CSP en producción)                                                               |
| HSTS, XFO, XCTO, Referrer, Permissions, COOP/CORP, cabeceras obsoletas    | ❌     | SEC-001, SEC-002, API-07                                                                         |
| Discrepancias entre configuraciones versionadas y producción              | ❌     | INFRA-002                                                                                        |
| TLS, redirecciones, CAA, `security.txt`                                   | ❌     | SEC-010 (CAA, `security.txt`); TLS 1.2/1.3 y certificado ✅; HTTP→HTTPS ✅.                      |
| SPF, DMARC y DKIM                                                         | ❌     | SEC-010 (DMARC `p=none`, SPF `~all`); DKIM ✅.                                                   |
| Recursos de terceros y SRI                                                | ❌     | SEC-003 (host de la API); SRI no aplicable a los scripts de Google.                              |
| Mapeo OWASP Top 10 y ASVS L1                                              | ✅     | Tabla en `01-seguridad.md`.                                                                      |

## 6.2 Privacidad y cumplimiento legal

| Ítem                                                                            | Estado | Detalle                                         |
| ------------------------------------------------------------------------------- | ------ | ----------------------------------------------- |
| Cookies, almacenamiento y terceros antes del consentimiento                     | ❌     | LEGAL-002                                       |
| Consent Mode v2 (defecto, actualización, revocación, persistencia)              | ❌     | LEGAL-003                                       |
| Banner: rechazar en la primera capa, sin preselección, accesible y no intrusivo | ❌     | LEGAL-001, RESP-003                             |
| Política de privacidad (art. 13)                                                | ❌     | LEGAL-004                                       |
| Política de cookies con inventario real                                         | ❌     | LEGAL-005                                       |
| Aviso legal (LSSI art. 10)                                                      | ❌     | LEGAL-005 (aplicabilidad no verificada)         |
| Información junto al formulario y consentimiento granular                       | ❌     | LEGAL-006                                       |
| Licencias de código y recursos                                                  | ✅     | OFL y Apache 2.0, compatibles con GPL-3.0.      |
| Declaración de accesibilidad                                                    | ⚠️     | Recomendada, no obligatoria para un particular. |

## 6.3 Bugs ocultos y robustez

| Ítem                                                            | Estado | Detalle                                                                                                                          |
| --------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Mapa de datos build frente a cliente                            | ❌     | SEO-001, BUG-005 (listado y plataforma solo en cliente)                                                                          |
| Simulación de fallos de la API                                  | ❌     | BUG-005 (producción ya está en ese estado: BUG-001). Latencia > 10 s ⚠️ no simulada.                                             |
| Build resiliente si falla la API                                | ❌     | BUG-002, CODE-001                                                                                                                |
| Ruta catch-all: slugs inexistentes, segmentos extra, mayúsculas | ❌     | SEO-004 (200 en producción), BUG-005 (sin aviso en cliente)                                                                      |
| Páginas de error                                                | ❌     | UX-004, SEO-004 (`404.html` sin `noindex`)                                                                                       |
| Hidratación                                                     | ✅     | Sin «Hydration mismatch» en 300 cargas ni en los escenarios.                                                                     |
| Datos duplicados y carreras                                     | ❌     | BUG-009                                                                                                                          |
| Estado global entre rutas (scroll bloqueado)                    | ❌     | BUG-003                                                                                                                          |
| Fugas de listeners e intervals                                  | ❌     | BUG-012 (`router.afterEach`); el resto se limpia ✅.                                                                             |
| Middleware de scroll                                            | ❌     | A11Y-007 (`reduced-motion`); anclas ✅.                                                                                          |
| Enlaces reales y enlaces rotos                                  | ❌     | A11Y-002 (tarjetas sin `<a>`); sin enlaces externos rotos ✅.                                                                    |
| Consola limpia                                                  | ❌     | BUG-001 (producción), BUG-010, BUG-008                                                                                           |
| Redespliegues y caché (chunks inexistentes)                     | ❌     | INFRA-003, PERF-001                                                                                                              |
| Tipos frente a respuestas reales                                | ✅     | Respuestas v2 (`platforms/portfolio`, `contents`) coherentes con `types/`; sin validación en tiempo de ejecución (mejora menor). |
| Fechas, números y ordenación                                    | ✅     | `Intl` con `es-ES` en `formatDate`.                                                                                              |
| Descarga del CV                                                 | ❌     | BUG-001 (producción: 410); código actual `/cv/pdf` → 200 ✅.                                                                     |
| Componentes y assets muertos                                    | ❌     | CODE-002                                                                                                                         |

## 6.4 SEO

| Ítem                                          | Estado | Detalle                                                                       |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| Contenido en el HTML estático                 | ❌     | SEO-001                                                                       |
| Códigos HTTP del sitemap, 404 y redirecciones | ❌     | SEO-002, SEO-004                                                              |
| Canonical                                     | ❌     | SEO-002 (sin barra frente a la URL final), SEO-003 (producción sin canonical) |
| Metaetiquetas duplicadas o contradictorias    | ✅     | Una por tipo en el HTML final; contradicciones de valor en SEO-005.           |
| Title, description, `og:*`, `twitter:*`       | ❌     | SEO-005, SEO-008                                                              |
| Encabezados                                   | ❌     | SEO-009                                                                       |
| `robots.txt` y `meta robots`                  | ✅     | `/blog` con `noindex` ✅                                                      |
| `sitemap.xml`                                 | ❌     | SEO-002, SEO-006                                                              |
| Datos estructurados                           | ❌     | SEO-007 (validadores externos ⚠️)                                             |
| Internacionalización                          | ❌     | SEO-011                                                                       |
| Enlazado interno y profundidad                | ❌     | SEO-001 (proyectos huérfanos)                                                 |
| Imágenes (`alt`, dimensiones, formatos)       | ❌     | SEO-010, RESP-006                                                             |
| Contenido duplicado o escaso                  | ❌     | SEO-001                                                                       |
| HTML válido                                   | ❌     | BUG-008, CODE-006 (home sin errores ✅)                                       |
| Web manifest y favicons                       | ❌     | BUG-011                                                                       |
| Coherencia de identidad entre perfiles        | ⚠️     | No verificable perfil a perfil (anti-bot).                                    |
| `site:` y SERP de marca                       | ⚠️     | Sin búsqueda web en el entorno.                                               |
| Palabras clave e intención                    | ✅     | Recomendaciones en `04-seo.md` (sin volúmenes inventados).                    |
| Buscadores con IA                             | ✅     | Recomendaciones en `04-seo.md`.                                               |
| Search Console y Bing Webmaster               | ⚠️     | Sin acceso; recomendaciones incluidas.                                        |

## 6.5 Rendimiento

| Ítem                                                                 | Estado | Detalle                                                             |
| -------------------------------------------------------------------- | ------ | ------------------------------------------------------------------- |
| Lighthouse móvil y escritorio por plantilla (3 ejecuciones, mediana) | ❌     | PERF (tabla en `05-rendimiento.md`)                                 |
| Datos de campo (CrUX)                                                | ⚠️     | API de PageSpeed sin cuota (`429 Quota exceeded`).                  |
| Elemento LCP                                                         | ❌     | PERF-003                                                            |
| CLS                                                                  | ❌     | PERF-004, RESP-006                                                  |
| INP                                                                  | ✅     | TBT ≤ 50 ms en todas las plantillas (aproximación de laboratorio).  |
| JavaScript (tamaño, chunks, código no usado)                         | ❌     | PERF-002                                                            |
| Terceros                                                             | ❌     | PERF-002, LEGAL-002                                                 |
| Imágenes                                                             | ❌     | PERF-005, BUG-008                                                   |
| Fuentes                                                              | ❌     | PERF-003 (sin precarga), PERF-004 (CLS por cambio de fuente)        |
| CSS                                                                  | ✅     | 81 KB sin comprimir / 9 KB br en `entry.css`; aceptable.            |
| Red (compresión, HTTP/3, caché, preconnect, preflights)              | ❌     | PERF-001 (caché); brotli y HTTP/3 ✅                                |
| Cascada de la home en 4G lenta                                       | ❌     | PERF-002, PERF-006                                                  |
| Prefetch de rutas                                                    | ✅     | `NuxtLink` con prefetch por defecto en enlaces visibles; sin abuso. |

## 6.6 Responsive y compatibilidad

| Ítem                                                  | Estado | Detalle                                                                                 |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| Sin scroll horizontal ni elementos fuera del viewport | ❌     | RESP-002                                                                                |
| Header fijo, anclas y menú móvil                      | ❌     | RESP-001, A11Y-008                                                                      |
| `100vh` en iOS y teclado virtual                      | ❌     | RESP-005 (probable)                                                                     |
| Hover sin equivalente táctil y tamaño de objetivos    | ✅     | Sin interacciones solo-hover detectadas; botones ≥ 24 px.                               |
| Tablas, código y embeds a 320 px                      | ⚠️     | No hay proyectos con tablas en los datos locales; los bloques tienen `overflow` propio. |
| Modales y galería en móvil                            | ❌     | RESP-001, RESP-005                                                                      |
| Banner de cookies e insignia de reCAPTCHA             | ❌     | RESP-003                                                                                |
| Zoom 200/400 % y tamaño de texto del sistema          | ⚠️     | No automatizado.                                                                        |
| Móvil en horizontal                                   | ⚠️     | No automatizado (cubierto parcialmente con 1024×768 y 1366×768).                        |
| Pantallas grandes                                     | ✅     | 1920 y 2560 correctos.                                                                  |
| `forced-colors` y `color-scheme`                      | ⚠️     | No probado; `color-scheme` no declarado (los controles nativos usan el esquema claro).  |
| Sin JavaScript                                        | ⚠️     | Por revisión de código: el listado de proyectos y el formulario dependen de JS.         |
| Soporte de CSS/JS en los navegadores objetivo         | ✅     | `backdrop-filter` con prefijo `-webkit-`; sin `:has()` crítico.                         |
| Impresión                                             | ⚠️     | No probado.                                                                             |
| Firefox                                               | ⚠️     | Playwright Firefox no arranca en macOS 27.                                              |

## 6.7 UX/UI y contenido

| Ítem                                     | Estado | Detalle                               |
| ---------------------------------------- | ------ | ------------------------------------- |
| Arquitectura de la información y CTA     | ❌     | UX-001 (Blog vacío en el menú)        |
| Estados de carga, vacío, error y éxito   | ❌     | BUG-005                               |
| Formulario de contacto                   | ❌     | UX-002, BUG-007, A11Y-005             |
| Búsqueda y filtros                       | ❌     | BUG-009                               |
| Coherencia con el design system          | ❌     | UX-003, UX-005, UX-006, RESP-008      |
| Animaciones                              | ❌     | A11Y-007                              |
| Ortografía, tono y datos desactualizados | ❌     | CONT-001, CONT-002, CONT-003          |
| Credibilidad (E-E-A-T)                   | ❌     | CONT-001; `/about` con trayectoria ✅ |

## 6.8 Accesibilidad

Todos los ítems de la sección 6.8 del prompt están cubiertos en `08-accesibilidad.md`, con la tabla de conformidad
WCAG 2.2 A/AA completa (55 criterios). Lector de pantalla real: ⚠️ no disponible.

## 6.9 Dependencias

| Ítem                                                         | Estado | Detalle                 |
| ------------------------------------------------------------ | ------ | ----------------------- |
| `npm audit` (todo y producción) por exposición               | ❌     | DEP-002                 |
| `npm outdated`                                               | ❌     | DEP-006                 |
| Mantenimiento de dependencias directas                       | ❌     | DEP-004                 |
| Compatibilidad entre versiones mayores y `compatibilityDate` | ❌     | DEP-006                 |
| Errores del árbol (`npm ls`) y avisos de `npm ci`            | ❌     | DEP-001, DEP-005        |
| Coherencia del gestor de paquetes                            | ❌     | DEP-001                 |
| Versión de Node                                              | ❌     | DEP-005                 |
| Dependencias sin uso o no declaradas                         | ❌     | DEP-006                 |
| Licencias                                                    | ✅     | Sin incompatibilidades. |
| Renovate/Dependabot y auditoría en el CI                     | ❌     | DEP-007                 |

## 6.10 Calidad de código

| Ítem                             | Estado | Detalle                                          |
| -------------------------------- | ------ | ------------------------------------------------ |
| Lint, `vue-tsc` y tests          | ✅     | 0 errores / 0 errores / 45 de 45                 |
| Cobertura                        | ❌     | DEP-003                                          |
| Calidad y huecos de los tests    | ❌     | CODE-003                                         |
| Convenciones de `AGENTS.md`      | ❌     | Tabla en `10-calidad-codigo.md`                  |
| Seguridad SSR                    | ✅     | —                                                |
| TypeScript (`any`, `@ts-ignore`) | ✅     | 3 `any` con aviso; sin `@ts-ignore`.             |
| Duplicación y código muerto      | ❌     | CODE-002                                         |
| Manejo de errores coherente      | ❌     | BUG-005                                          |
| Documentación frente a código    | ❌     | CODE-005                                         |
| Configuración de herramientas    | ❌     | CODE-004 (sin plugin de accesibilidad en ESLint) |

## 6.11 Infraestructura y CI/CD

| Ítem                                                | Estado | Detalle                                   |
| --------------------------------------------------- | ------ | ----------------------------------------- |
| Servidor real y coherencia de las configuraciones   | ❌     | INFRA-002                                 |
| Pipeline (puertas, artefactos, verificación, purga) | ❌     | INFRA-001                                 |
| `scripts/deploy.sh`                                 | ❌     | INFRA-003                                 |
| Build reproducible                                  | ❌     | DEP-001, CODE-001, BUG-002                |
| Observabilidad                                      | ❌     | INFRA-005                                 |
| DNS y red                                           | ❌     | INFRA-004; IPv6, HTTP/3 y DNSSEC ✅       |
| `docs/info/deploy-cicd.md` al día                   | ❌     | CODE-005 (documenta `test:coverage` roto) |
