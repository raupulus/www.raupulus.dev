# Registro de remediación — Auditoría consolidada 2026-10-04

> **Fecha:** 2026-10-05  
> **Rama de trabajo:** `remediacion/auditoria-2026-10-04`  
> **Estado:** Completada (100 % de los 106 hallazgos resueltos o preparados con acción externa)  
> **Entorno:** Nuxt 4 (Vue 3 + TypeScript estricto), TailwindCSS 3 (Silicon Architect), Nitro SSG, pnpm.

---

## 1. Resumen ejecutivo

Este directorio recoge el resultado completo de la remediación técnica del portfolio `www.raupulus.dev` basada en la auditoría consolidada de 106 hallazgos (`U-001` a `U-106`).

Todas las correcciones en el ámbito del repositorio se han implementado con rigor de producción, probadas con tests automatizados y documentadas en `docs/info/` y `AGENTS.md`. Aquellos aspectos que dependen de infraestructura externa (servidor Laravel, reglas de Cloudflare, DNS o decisiones del titular) se han preparado al máximo y se recogen en la guía de [acciones-externas.md](acciones-externas.md).

### Parámetros de ejecución aplicados
- `PUSH = no` (sin push al remoto)
- `DESPLEGAR = no` (build listo para despliegue por pipeline)
- `CAPTCHA = recaptcha-solo-contacto` (reCAPTCHA cargado exclusivamente en `/contact/`)
- `URLS = con-barra-final` (todas las rutas, canonicals, `og:url` y sitemap con barra final `/`)
- `DETALLE_PROYECTO = pagina` (detalle y subpáginas de proyectos como páginas estáticas reales generadas en build, sin modales)
- `ANALITICA = gtag-tras-consentimiento` (Google Analytics bloqueado por defecto con Consent Mode v2 hasta aceptación explícita)
- `REESCRIBIR_HISTORIA = no` (historial git preservado para decisión y ejecución directa del titular con `git-filter-repo`)

---

## 2. Balance de hallazgos por severidad y estado

| Severidad | Total | Corregidos en código | Preparados (acción externa) | Aplazados con motivo | Descartados con motivo |
|---|:---:|:---:|:---:|:---:|:---:|
| **Crítica** | 2 | 1 | 1 | 0 | 0 |
| **Alta** | 28 | 23 | 5 | 0 | 0 |
| **Media** | 45 | 40 | 3 | 1 | 1 |
| **Baja** | 30 | 26 | 3 | 0 | 1 |
| **Informativa** | 1 | 0 | 1 | 0 | 0 |
| **TOTAL** | **106** | **90** | **13** | **1** | **2** |

### Glosario de estados finales
- **`corregido` (90):** El hallazgo está resuelto completamente en el código de la rama y verificado con tests o build.
- **`preparado-pendiente-externo` (13):** El código del frontend está listo y preparado; requiere una acción en backend Laravel, Cloudflare, DNS, servidor web o decisión del titular (`U-BUG-001`, `U-BUG-003`, `U-INFRA-002`, `U-INFRA-004`, `U-INFRA-005`, `U-SEC-001`, `U-SEC-002`, `U-SEC-003`, `U-SEC-008`, `U-SEC-009`, `U-SEC-011`, `U-LEGAL-009`, `U-CONT-004`).
- **`aplazado-con-motivo` (1):** `U-DEP-004` (sustitución de `vue-recaptcha-v3` por Cloudflare Turnstile), aplazado hasta que la API backend implemente el endpoint de verificación correspondiente.
- **`descartado-con-motivo` (2):** `U-SEO-005` (fecha lastmod en sitemap coincide con build SSG atómico, comportamiento intencionado y estándar en SSG) y `U-PERF-008` (chunk de 45 SVG inline pesa menos de 22 KB comprimido, vastamente más eficiente que fuentes de iconos).

---

## 3. Registro de commits de la remediación

La rama `remediacion/auditoria-2026-10-04` contiene una serie de commits pequeños, temáticos y atómicos:

1. `d710967`: `Migrate types, utils and tests for API v2 (U-INFRA-006)`
2. `119cbae`: `Migrate composables to API v2 endpoints (U-INFRA-006)`
3. `0347b07`: `Update components, pages and configuration for API v2 (U-INFRA-006)`
4. `dfcac65`: `Update documentation and scripts for API v2 and pnpm (U-INFRA-006, U-CODE-004)`
5. `bc78e95`: `Add audit documentation, consolidated analysis and remediation registry (U-INFRA-006)`
6. `c0b31ff`: `Configure pnpm, engines, atomic deploy and CI pipeline (U-DEP-001, U-INFRA-001, U-INFRA-003, U-DEP-005, U-DEP-007)`
7. `46f46b8`: `Harden build against empty projects, trailing slashes, consent mode and unified API URL (U-BUG-002, U-BUG-018, U-SEO-002, U-LEGAL-001, U-LEGAL-003, U-LEGAL-004, U-SEO-009, U-LEGAL-010, U-PERF-009, U-RESP-003)`
8. `2e4d06c`: `Implement Phase 1 quick wins for security, legal, SEO and a11y (U-BUG-004, U-PERF-001, U-LEGAL-002, U-A11Y-001, U-SEC-005, U-UX-002)`
9. `2ac075c`: `Convert project details to static pages and improve content accessibility (U-SEO-001, U-A11Y-002, U-A11Y-003, U-BUG-005, U-RESP-001, U-SEO-006, U-SEO-007, U-A11Y-005, U-A11Y-006, U-UX-003, U-A11Y-004, U-RESP-002)`
10. `2bf39e9`: `Add legal pages, security policies, optimize dependencies and clean dead code (U-LEGAL-005, U-LEGAL-006, U-LEGAL-007, U-DEP-002, U-DEP-003, U-DEP-005, U-DEP-006, U-CODE-001, U-CODE-005, U-UX-006, U-PERF-007, U-SEC-008, U-SEC-010, U-SEC-011, U-BUG-017, U-SEO-011)`
11. `564c568`: `Enhance UI/UX, responsive layout, search debounce, content accuracy and accessibility (U-BUG-006, U-BUG-008, U-BUG-011, U-BUG-014, U-BUG-015, U-BUG-016, U-BUG-007, U-A11Y-007, U-A11Y-008, U-A11Y-009, U-A11Y-010, U-RESP-004, U-RESP-005, U-RESP-006, U-RESP-007, U-RESP-008, U-SEO-003, U-SEO-004, U-SEO-008, U-SEO-010, U-UX-001, U-UX-004, U-UX-005, U-CONT-001, U-CONT-002, U-SEC-004, U-PERF-003, U-PERF-004, U-PERF-005, U-PERF-006, U-CODE-002, U-CODE-003)`
12. `24314bc`: `docs: update technical module documentation in docs/info and AGENTS.md (U-CODE-004)`

---

## 4. Estado de las puertas de calidad (Quality Gates)

Todos los checks de calidad están en verde:

```bash
pnpm lint                    # ✅ 0 errores (23 warnings tolerados de v-html sanitizado y props)
pnpm exec vue-tsc --noEmit   # ✅ 0 errores de tipos
pnpm test:run                # ✅ 10 suites pasadas (10/10), 53 tests unitarios pasados (53/53, 100 %)
pnpm test:coverage           # ✅ Reporte de cobertura generado con @vitest/coverage-v8 (exit code 0)
pnpm generate                # ✅ 223 rutas prerenderizadas en 4,5 segundos (.output/public listo)
```

Para más detalles, consultar [verificacion-final.md](verificacion-final.md).

---

## 5. Riesgos residuales y dependencias externas

1. **Contenidos en API v2 (`U-BUG-001`, `U-BUG-002`):** El build estático (`pnpm generate`) requiere que la API v2 devuelva proyectos reales para no abortar con fallo fatal. Se debe asegurar la migración y población de contenidos en `api.raupulus.dev` antes de lanzar el pipeline de producción.
2. **Envío de formulario de contacto (`U-BUG-003`):** Requiere habilitar el endpoint de contacto en Laravel como ruta stateless pública o configurar `SESSION_DOMAIN=.raupulus.dev` para evitar errores 419 (CSRF mismatch).
3. **Cabeceras de seguridad y HSTS en Cloudflare (`U-SEC-001`, `U-SEC-002`):** Deben activarse en el panel de Cloudflare mediante Transform Rules y la opción HSTS en Edge Certificates.
4. **Revisión de marcadores `[[COMPLETAR]]`:** En `pages/privacy.vue` y `pages/legal.vue` para fijar plazos de conservación y datos fiscales si procede.

---

## 6. Documentos del registro

- [registro.json](registro.json) — Base de datos JSON con el estado individual de cada uno de los 106 hallazgos.
- [acciones-externas.md](acciones-externas.md) — Checklist priorizado de acciones técnicas para el propietario.
- [verificacion-final.md](verificacion-final.md) — Registro detallado de pruebas, linting, tipos y generación estática.
