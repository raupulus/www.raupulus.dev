# Cobertura de la checklist (sección 6) — Auditoría externa deepsek-externo

Estado: ✅ verificado y correcto · ❌ hallazgo (ID) · ⚠️ no verificable (motivo) · ➖ no aplica (motivo).

## 6.1 Seguridad (SEC)

- ❌ Secretos en repo/historial: no hay en el árbol; en historial 9 coincidencias de patrón revisadas como
  falsos positivos (ejemplos/lockfiles). `.env` nunca versionado. → **SEC-006** (correo personal en commits).
- ✅ Secretos/datos internos en el build: sin `secretKey`, sin `localhost` productivo, sin `.map`, sin sourcemaps.
- ✅ `runtimeConfig`: lo privado no se publica; `secretKey` es superficie innecesaria (→ CODE-003).
- ❌ Repositorio público expone infraestructura y correo → **SEC-006**.
- ❌ Archivos que no deberían servirse: devuelven 200 pero por **soft-404** (**SEC-002**); `.htaccess` da 403.
- ✅ Inventario de `v-html`/`innerHTML`/`useHead(script)`: acotado a `MaterialIcon` (SVG propio) y bloques EditorJS.
- ❌ DOMPurify: permite `style`/`id`/`target` → **SEC-003**.
- ❌ `sanitizeRawHtml`/`BlockEmbed`: iframes de cualquier origen sin sandbox → **SEC-004**.
- ✅ `BlockCode`/`BlockQuote`/`BlockLinkTool`/`BlockImage`/`BlockAttaches`: usan `sanitizeHtml` (revisados).
- ✅ JSON-LD con datos propios; sin `</script>` inyectable relevante.
- ✅ Construcción de URLs desde slugs con `encodeURIComponent` (sin path traversal trivial).
- ✅ `target="_blank"` en plantillas con `rel="noopener noreferrer"` (salvo sanitize, que no lo fuerza).
- ⚠️ Formulario: CSRF observado por inspección de cookies; **no se envió** en producción (prohibido). → **BUG-003**.
- ⚠️ Validación cliente revisada en código; anti-spam (reCAPTCHA v3, honeypot, tiempo) presente.
- ❌ Requisitos del backend → `recomendaciones-api.md`.
- ✅ CORS de la API: `ACAO: https://raupulus.dev` + `Allow-Credentials: true` (correcto).
- ✅ Proxy `/_proxy/**`: solo aplica en dev (routeRules no se materializa en SSG).
- ❌ CSP del sitio: ausente en producción y débil en configs → **SEC-001**, **INFRA-005**.
- ❌ HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`: ausentes en producción → **SEC-001**.
- ❌ Discrepancias `apache.conf`/`nginx.conf`/`.htaccess`/producción → **INFRA-001**, **INFRA-005**.
- ⚠️ TLS: protocolos/cifrados no enumerados; certificado vigente verificado. `security.txt` ausente → **SEC-005**.
- ❌ CAA ausente y DMARC `p=none` → **SEC-007**.
- ❌ Recursos de terceros: `og:image` en `raw.githubusercontent.com` → **SEO-010**.
- ⚠️ Mapeo OWASP Top 10 / ASVS L1: realizado de forma cualitativa a partir de los hallazgos (no asvs checklist completa).

## 6.2 Privacidad y cumplimiento legal (LEGAL)

- ⚠️ Navegador limpio antes de tocar el banner: revisado a nivel de bundle/config; no se ejecutó navegador manual.
- ❌ Consent Mode v2: al aceptar analítica concede `ad_*` → **LEGAL-001**; sin revocación → **LEGAL-002**.
- ❌ Banner: analítica premarcada en producción y texto AEPD → **LEGAL-003**.
- ⚠️ Política de privacidad: existe y cubre responsable/finalidades; tabla de cookies ausente → **LEGAL-005**.
- ❌ Política de cookies sin tabla real → **LEGAL-005**.
- ❌ Aviso legal LSSI ausente → **LEGAL-006**.
- ⚠️ Información art. 13 junto al formulario, mejorable → **LEGAL-007**.
- ✅ Licencias de fuentes (OFL) e iconos (Apache 2.0) documentadas; licencia de contenido a revisar.
- ❌ Declaración de accesibilidad ausente → **LEGAL-006**.
- ❌ reCAPTCHA cargado en todas las páginas → **LEGAL-004**.
- ❌ `gtag` sin ID → **LEGAL-008**.

## 6.3 Bugs ocultos, robustez y errores visibles (BUG)

- ❌ Mapa de datos: listado en cliente, sin SEO/CLS control y roto en producción → **BUG-001**, **SEO-001**.
- ⚠️ Simulación de fallos (500/404/timeout/JSON malformado): no ejecutada con interceptación; revisada por código.
- ❌ Build no falla si la API cae → **BUG-006**.
- ❌ Catch-all sin 404 ni validación → **BUG-004**.
- ❌ `error.vue`/`404.html`: generado vacío; producción 200 → **BUG-002**, **SEC-002**.
- ⚠️ Hidratación: no se detectaron warnings en Lighthouse; no se probó en modo dev exhaustivamente.
- ⚠️ Datos duplicados/carreras: riesgo por falta de debounce/AbortController → **BUG-009**.
- ✅ Estado global (`useState`): `disable-scroll` gestionado; sin fugas evidentes del flag.
- ✅ Fugas de listeners: `Header` limpia el listener de scroll en `onUnmounted`.
- ⚠️ Middleware `scroll-to-top`: interacción con anclas/reduced-motion no verificada → **A11Y-011**.
- ✅ Enlaces internos con `NuxtLink`; recursos principales OK. Enlaces externos no auditados con linkinator (⚠️).
- ❌ Consola: errores en producción por CORS → **BUG-001**.
- ❌ Redespliegues/caché: HTML cacheado 1 mes → **PERF-004**.
- ⚠️ Tipos frente a realidad: comparación parcial con la API local V2; sin muestreo exhaustivo de nulos.
- ✅ Fechas formateadas con `Intl` (`formatDate`, locale `es-ES`).
- ❌ Descarga del CV: funciona en la API actual (200), pero depende del dominio correcto; riesgo con config obsoleta.
- ⚠️ Componentes/assets muertos: `types/ImageType.ts` nuevo sin seguimiento; revisión parcial.

## 6.4 SEO técnico, on-page e identidad (SEO)

- ❌ Contenido principal en HTML estático: `/projects` sin listado → **SEO-001**.
- ✅ Códigos HTTP de URLs del sitemap: 200; inexistentes **no** dan 404 → **SEC-002**.
- ❌ Canonical: ausente en producción → **SEO-004**.
- ✅ Metaetiquetas duplicadas: 1 `description` por página en el build actual.
- ❌ `og:*`/`twitter:*`: imágenes relativas/no 1200×630 → **SEO-003**, **SEO-006**.
- ❌ Encabezados: riesgo de `h1` múltiple por contenido → **SEO-008**, **A11Y-004**.
- ✅ `robots.txt` correcto; `/blog` `noindex` coherente salvo sitemap → **SEO-002**.
- ❌ Sitemap: incluye `noindex`; `lastmod` de build → **SEO-002**, **SEO-005**.
- ❌ Datos estructurados: falta JSON-LD por proyecto → **SEO-007**.
- ✅ i18n: `lang=es`, locale coherente; `og:locale:alternate` sin alternativa → **SEO-011**.
- ⚠️ Enlazado interno/profundidad: no medido con crawl; `/projects` sin enlaces estáticos.
- ✅ Imágenes con `alt` en el build actual; en producción faltan algunas → **A11Y-005**.
- ⚠️ Contenido duplicado/escaso: no medido; `og` por defecto repetido por plantilla.
- ⚠️ HTML válido (W3C): no ejecutado.
- ❌ Manifest/favicons: rutas rotas y `theme-color` incoherente → **BUG-007**, **SEO-009**.
- ⚠️ Identidad/perfiles: `sameAs` correcto; coherencia entre perfiles no verificada.
- ⚠️ Búsqueda/`site:` y optimización de keywords: no disponible en esta sesión.
- ✅ Preparación para buscadores con IA: datos estructurados Person/WebSite; `llms.txt` opcional no presente.
- ⚠️ Recomendaciones para Search Console/Bing: no verificadas (sin acceso).

## 6.5 Rendimiento y Core Web Vitals (PERF)

- ❌ Lighthouse por plantilla: ejecutado 1× (no 3× mediana); producción móvil muy lenta → **PERF-003**.
- ❌ Datos de campo CrUX: sin datos disponibles (⚠️), laboratorio usado.
- ❌ Elemento LCP: TTFB/latencia dominante; sin preload explícito → **PERF-003**.
- ⚠️ CLS: bajo en general; picos en about (0,341) y contact móvil → **PERF-008**.
- ⚠️ INP: TBT bajo en general; no medido en interacción.
- ❌ JavaScript: inicial ~155 KB gzip > 120 KB → **PERF-001**; reCAPTCHA en todas las páginas → **PERF-002**.
- ❌ Terceros: gtag y reCAPTCHA cargados sin control → **LEGAL-004**, **LEGAL-008**.
- ✅ Imágenes IPX: variantes webp pre-generadas y servidas 200 (no originales).
- ❌ Fuentes: 2 familias × 5 pesos → **PERF-005**.
- ❌ CSS: `unused-javascript`/CSS no medido a fondo; banner de cookies pesado.
- ⚠️ Red: brotli no confirmado; caché de HTML incorrecta → **PERF-004**; preflight innecesario → **PERF-007**.
- ⚠️ Cascada 4G: no simulada explícitamente (Lighthouse móvil la aproxima).
- ⚠️ Prefetch con `NuxtLink`: no evaluado.

## 6.6 Responsive y compatibilidad (RESP)

- ⚠️ Matriz de viewports × motores: **no ejecutada** (RESP-001).
- ⚠️ Header fijo/menú móvil: análisis estático → RESP-002.
- ⚠️ `100vh` vs `dvh/svh`, teclado virtual: no probado.
- ⚠️ Hover/táctil, tamaño de objetivos: no medido.
- ⚠️ Tablas/código/embeds a 320 px: análisis estático → RESP-002.
- ⚠️ Modales/galería: no probados.
- ⚠️ Banner/reCAPTCHA no tapan CTAs: no verificado.
- ⚠️ Zoom 200/400% y text-spacing: no probado.
- ⚠️ Móvil horizontal: no probado.
- ⚠️ Pantallas grandes: no probado.
- ⚠️ `forced-colors`/`color-scheme`: no probado.
- ⚠️ Sin JavaScript: no probado (el listado de proyectos requeriría JS → SEO-001).
- ⚠️ Soporte CSS/JS (`backdrop-filter`, `:has()`): no verificado.
- ⚠️ Estilos de impresión: no verificados.

## 6.7 UX/UI y contenido (UX/CONT)

- ⚠️ Arquitectura de la información: menú y CTA revisados; breadcrumbs no existen (proyectos usan modal).
- ✅ Estados de carga/vacío/error: mensajes coherentes en formulario y “Cargar más”.
- ✅ Formulario: labels visibles, validación en línea, conserva datos, botón deshabilitado.
- ❌ Búsqueda/filtros no en URL → **UX-003**.
- ✅ Coherencia design system: tokens correctos; sin clases globales con nombres de utilidad Tailwind.
- ✅ Animaciones con `prefers-reduced-motion` global.
- ❌ Contenido: erratas y datos desactualizados en producción → **CONT-001**; `/blog` en construcción → **SEO-002**.
- ⚠️ Credibilidad E-E-A-T: mejorable → **UX-005**.
- ❌ Banner de mantenimiento y formulario “fuera de servicio” → **UX-001**, **UX-002**.

## 6.8 Accesibilidad WCAG 2.2 AA (A11Y)

- ❌ axe/Lighthouse: fallos de contraste, nombre de campo, landmark y alt → tablas en `08-accesibilidad.md`.
- ⚠️ Teclado completo: no ejecutado.
- ❌ Modales/menú/galería (foco, Esc): menú sin Esc/foco → **A11Y-008**.
- ⚠️ Landmarks: producción sin `main` → **A11Y-001**; `nav` con nombre OK.
- ❌ Semántica: tabla sin scope/caption → **A11Y-009**.
- ❌ Imágenes: sin alt en producción → **A11Y-005**.
- ⚠️ Enlaces/botones: aviso de nueva pestaña, no verificado exhaustivamente.
- ❌ Contraste: ratios insuficientes en tokens usados → **A11Y-002**.
- ❌ Formularios: sin `aria-invalid`/`aria-live` → **A11Y-007**; campo sin nombre → **A11Y-003**.
- ⚠️ Movimiento/GIF: no verificado; scroll JS smooth → **A11Y-011**.
- ⚠️ Reflow/text-spacing/zoom/orientación/tamaño objetivo: no probado.
- ⚠️ Lector de pantalla (VoiceOver): no ejecutado.
- ⚠️ Barreras de terceros (banner/reCAPTCHA): no probadas.
- ⚠️ HTML de la API que rompa semántica: `BlockHeader` h1 → **SEO-008**.

## 6.9 Dependencias y cadena de suministro (DEP)

- ❌ `pnpm audit`: 1 crítica, 47 altas → **DEP-002**.
- ❌ `pnpm outdated`: varias desactualizadas → **DEP-004**.
- ⚠️ Estado de mantenimiento de cada dependencia: revisión cualitativa (módulos Nuxt activos).
- ❌ Compatibilidad y `compatibilityDate` antiguo (2024-09-10) → nota en CODE/DEP.
- ⚠️ `npm ls`/peers/duplicados: no ejecutado con pnpm.
- ❌ Coherencia de gestor (npm vs pnpm) → **DEP-001**.
- ❌ Node no fijado → **DEP-006**.
- ⚠️ Clasificación deps/devDeps y `knip`/`depcheck`: no ejecutado.
- ⚠️ Licencias del árbol: no verificado → **DEP-008**.
- ❌ Automatización (Renovate/Dependabot, audit en CI): ausente → **DEP-002**, **INFRA-002**.
- ❌ `test:coverage` roto → **DEP-003**.

## 6.10 Calidad de código y mantenibilidad (CODE)

- ✅ `lint` 0 errores/38 warnings, `vue-tsc` 0 errores, 45 tests OK; ❌ cobertura no medible → **DEP-003**.
- ❌ Calidad/áreas sin tests (routing, formulario, sanitización) → **CODE-002**.
- ✅ Convenciones de `AGENTS.md` mayoritariamente cumplidas (revisado con búsquedas).
- ✅ SSR: accesos a `window`/`document` en `onMounted` o `import.meta.client`.
- ❌ TypeScript: uso de `any` → **CODE-004**.
- ⚠️ Duplicación/código muerto/comentado/TODO: parcialmente revisado → **CODE-003**.
- ✅ Manejo de errores: `apiGet` distingue null/error; el formulario distingue 4xx.
- ❌ Documentación desincronizada (v1 vs v2) → **CODE-001**.
- ✅ Config de herramientas coherente (ESLint flat, Prettier, Vitest) salvo cobertura.

## 6.11 Infraestructura, CI/CD y operación (INFRA)

- ❌ Servidor real vs configs → **INFRA-001**, **INFRA-005**.
- ❌ `gocd.yaml`: artefacto, `set -e`, puertas, rama → **INFRA-002**, **INFRA-004**.
- ❌ `deploy.sh`: atomicidad/verificación → **INFRA-003**.
- ⚠️ Build reproducible desde clon limpio: no ejecutado (solo build local con `node_modules` existente).
- ❌ Observabilidad → **INFRA-006**.
- ⚠️ DNS/red: A/AAAA verificados; CAA ausente → **SEC-007**; HTTP/3 OK.
- ❌ `docs/info/deploy-cicd.md` desactualizado → **INFRA-007**.
