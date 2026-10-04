# Plan de remediación — Auditoría externa deepsek-externo

Priorizado por severidad, esfuerzo y dependencias. Cada grupo tiene criterio de aceptación.

## Fase 0 — Urgente (≤ 24 h)

1. **BUG-001 — API cliente de producción rota.** Recompilar/redesplegar con `API_DOMAIN_URL`/`API_BASE_URL`
   correctos (API V2 vigente) y verificar que el bundle no contiene `api.fryntiz.dev` ni `/api/v1`.
   _Aceptación:_ `/projects` carga datos, 0 errores de consola.
2. **PERF-003 — LCP móvil ~8 s.** Revisar TTFB de origen y caché de HTML en Cloudflare; habilitar brotli.
   _Aceptación:_ LCP móvil p75 ≤ 2,5 s (objetivo 2,0 s).
3. **SEC-001 + INFRA-001 — Cabeceras y 404 reales.** Corregir el servidor real (quitar fallback SPA, aplicar
   CSP/HSTS/nosniff/Referrer-Policy/Permissions-Policy, `ErrorDocument 404 /404.html`).
   _Aceptación:_ `curl -I /no-existe` → 404; cabeceras presentes; HSTS `max-age≥31536000`.
4. **LEGAL-001/002/003 — Consentimiento.** Conceder solo lo aceptado, permitir revocación y quitar el
   premarcado/texto AEPD del banner. _Aceptación:_ aceptar solo analítica no concede `ad_*`; revocar elimina `_ga*`.

## Fase 1 — Quick wins (alto impacto, esfuerzo XS/S)

- **SEC-005** publicar `security.txt`; **BUG-007/SEO-009** arreglar manifest/favicons/theme-color.
- **SEO-002** excluir `/blog` del sitemap; **BUG-005** mover `useHead` a `setup` reactivo.
- **DEP-003** añadir `@vitest/coverage-v8`; **DEP-006** fijar Node (`engines` + `.nvmrc`).
- **PAY-007/PERF-007** quitar `Content-Type` en GET; **PERF-004** cachear HTML corto y `/_nuxt/` immutable.
- **A11Y-003** nombre accesible al campo de mensaje; **A11Y-006** enlace «saltar al contenido».
- **A11Y-008** cerrar menú con Esc y gestionar foco; **A11Y-009** `scope`/`caption` en tablas.
- **CONT-001** revisión editorial; **UX-001/UX-002** retirar banners de mantenimiento y coherencia del formulario.
- **LEGAL-008** no habilitar gtag si `ID` vacío.

## Fase 2 — SEO y datos (dependencia: BUG-001)

- **SEO-001** prerenderizar el primer listado de `/projects` (HTML con tarjetas y enlaces).
- **SEO-003/006** `og:image` absoluto 1200×630 + `og:image:alt`; unificar `twitter:card`.
- **SEO-004** desplegar canonical; **SEO-005** `lastmod` real; **SEO-007** JSON-LD por proyecto + breadcrumb.
- **SEO-008/A11Y-004** limitar `BlockHeader` a h2+.
- _Aceptación:_ Lighthouse SEO 100 en todas las plantillas; sitemap sin `noindex`.

## Fase 3 — Seguridad de contenido y robustez

- **SEC-003** endurecer `sanitizeHtml` (quitar `style`/`id`, forzar `rel`) + tests.
- **SEC-004** allowlist/sandbox para iframes en `BlockRaw`/`BlockEmbed`.
- **BUG-003** CSRF same-origin (proxy en el borde) y reactivar el formulario.
- **BUG-004** 404 real en catch-all; **BUG-002** contenido de `error.vue` en `404.html`.
- **BUG-006** hacer fallar el build si la API no responde; **BUG-008/009/010/011/012** robustez y bloqueos.
- _Aceptación:_ tests de sanitización en verde; `/projects/inexistente` → 404; build falla con API caída.

## Fase 4 — Rendimiento

- **PERF-002/LEGAL-004** diferir reCAPTCHA solo a `/contact`; **PERF-001** reducir JS inicial ≤ 120 KB.
- **PERF-005** reducir fuentes y subconjuntos; **PERF-006** iconos Material bajo demanda.
- **PERF-008** dimensiones/aspect-ratio en imágenes y CLS ≤ 0,05 (revisar `/about`).
- _Aceptación:_ presupuestos en CI (Lighthouse CI).

## Fase 5 — Accesibilidad AA

- **A11Y-002** corregir contrastes de tokens (`text-outline-variant`, `text-warning`).
- **A11Y-001/005** desplegar `<main>` con alt en imágenes; **A11Y-007** ARIA en errores.
- Pasada manual con teclado y VoiceOver; completar la tabla WCAG.
- _Aceptación:_ 0 violaciones `critical`/`serious` en axe; contraste ≥ 4,5:1.

## Fase 6 — CI/CD e infraestructura

- **DEP-001/INFRA-004** unificar en pnpm (scripts, CI, docs) y un solo lockfile.
- **INFRA-002** descargar el artefacto en deploy, `set -euo pipefail`, purga de Cloudflare, puertas
  (`vue-tsc`, `pnpm audit`, `format:check`, Lighthouse CI, link checker, axe).
- **INFRA-003** despliegue atómico con symlink y verificación multi-ruta.
- **INFRA-007/CODE-001** actualizar `docs/info` y `AGENTS.md`/`README.md` (v2, pnpm, endpoints).
- _Aceptación:_ un despliegue fallido aborta el job; documentación coherente con el código.

## Fase 7 — Cumplimiento legal y contenido

- **LEGAL-005** tabla de cookies; **LEGAL-006** aviso legal y declaración de accesibilidad.
- **LEGAL-007** información RGPD capa 1; **SEC-006** decidir visibilidad del repo y limpiar el correo del historial.
- **SEC-007** CAA y DMARC más estricto; **UX-005** refuerzo E-E-A-T.

## Controles preventivos

- CI obligatorio: `pnpm lint`, `pnpm exec vue-tsc --noEmit`, `pnpm test:run` (con cobertura y umbral),
  `pnpm audit`, `prettier --check`, Lighthouse CI con presupuestos, `linkinator`, `axe` y comprobación de
  rutas generadas (mínimo). Bloquear el merge si falla.
- Renovate/Dependabot para dependencias; fijar Node y `packageManager`.
- Verificación post-despliegue de varias rutas + integridad de chunks + purga de caché.
- Monitorización de disponibilidad, errores JS y `report-to` de CSP.
- Plantilla de PR con checklist de accesibilidad, seguridad y SEO.
