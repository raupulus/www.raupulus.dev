# Verificación final — Auditoría consolidada 2026-10-04

> **Entorno:** macOS / Node.js v26.10.0 / pnpm 12.9.1  
> **Fecha:** 2026-10-05  
> **Rama:** `remediacion/auditoria-2026-10-04`  
> **Modo de compilación:** SSG (Nitro static preset)

---

## 1. Resumen de puertas de calidad (Quality Gates)

| Puerta de calidad | Comando | Estado | Resultado |
|---|---|:---:|---|
| **Linting** | `pnpm lint` | ✅ PASA | 0 errores, 0 warnings (100 % limpio) |
| **Chequeo de tipos** | `pnpm exec vue-tsc --noEmit` | ✅ PASA | 0 errores de tipos en TypeScript estricto |
| **Tests unitarios** | `pnpm test:run` | ✅ PASA | 27 suites pasadas (27/27), 78 tests pasados (78/78, 100 %) |
| **Tests E2E / A11y** | `pnpm test:e2e` | ✅ PASA | 23 tests E2E y de accesibilidad pasados (23/23, 100 %) con Playwright y Axe-core |
| **Cobertura de tests** | `pnpm test:coverage` | ✅ PASA | Cobertura ejecutada con `@vitest/coverage-v8`, exit code 0 |
| **Auditoría de paquetes** | `pnpm audit --prod` | ✅ PASA | 0 vulnerabilidades conocidas en producción (`No known vulnerabilities found`) tras actualizar `isomorphic-dompurify` a 4.4.0 |
| **Compilación estática (SSG)** | `pnpm generate` | ✅ PASA | 223 rutas prerenderizadas en 4,2 segundos |

---

## 2. Registro detallado por comando

### 2.1 `pnpm lint`
```text
$ eslint .

# Exit code: 0 (salida completamente limpia: 0 errors, 0 warnings)
```
- **Errores:** 0
- **Warnings:** 0
- 0 advertencias de props o tipos `any`.

---

### 2.2 `pnpm exec vue-tsc --noEmit`
```text
$ vue-tsc --noEmit
# Exit code: 0 (salida limpia, sin errores de tipos)
```
- Cobertura completa de tipos TypeScript estricto sobre todos los componentes (`.vue`), composables (`.ts`), utilidades y configuraciones.

---

### 2.3 `pnpm test:run`
```text
 Test Files  27 passed (27)
      Tests  78 passed (78)
   Start at  08:53:50
   Duration  5.23s
```
Suites ejecutadas (27 archivos, 78 tests unitarios):
- `tests/utils/ContentUtils.test.ts` (8 tests)
- `tests/utils/sanitize.test.ts` (15 tests)
- `tests/utils/TechnologyUtils.test.ts` (1 test)
- `tests/composables/fetchPageData.test.ts` (3 tests)
- `tests/composables/platformData.test.ts` (2 tests)
- `tests/composables/projectsData.test.ts` (7 tests — incluye test de fallback vacío y error fatal sin ALLOW_EMPTY_PROJECTS)
- `tests/composables/fetchPostData.test.ts` (7 tests)
- `tests/composables/useApiBase.test.ts` (2 tests)
- `tests/composables/useModalAccessibility.test.ts` (5 tests — bloqueo de scroll, trampa de foco y retorno al disparador)
- `tests/components/content/blocks/Block.test.ts` (3 tests — despachador de bloques y fallback visual)
- `tests/components/content/blocks/BlockAlert.test.ts` (2 tests)
- `tests/components/content/blocks/BlockAttaches.test.ts` (1 test)
- `tests/components/content/blocks/BlockCheckList.test.ts` (1 test)
- `tests/components/content/blocks/BlockCode.test.ts` (1 test)
- `tests/components/content/blocks/BlockDelimiter.test.ts` (1 test)
- `tests/components/content/blocks/BlockEmbed.test.ts` (2 tests)
- `tests/components/content/blocks/BlockHeader.test.ts` (2 tests — jerarquía semántica)
- `tests/components/content/blocks/BlockImage.test.ts` (1 test)
- `tests/components/content/blocks/BlockLinkTool.test.ts` (1 test)
- `tests/components/content/blocks/BlockList.test.ts` (3 tests)
- `tests/components/content/blocks/BlockParagraph.test.ts` (3 tests)
- `tests/components/content/blocks/BlockQuote.test.ts` (1 test)
- `tests/components/content/blocks/BlockRaw.test.ts` (3 tests)
- `tests/components/content/blocks/BlockTable.test.ts` (1 test)
- `tests/components/content/blocks/BlockWarning.test.ts` (2 tests)
- `tests/components/app/Header.test.ts` (2 tests — marca, navegación y atributos WCAG)
- `tests/components/app/Footer.test.ts` (1 test — role contentinfo y enlaces legales)

---

### 2.4 `pnpm test:e2e` (Playwright + Axe-core)
```text
Running 23 tests using 5 workers
23 passed (12.2s)
```
Pruebas ejecutadas:
- `tests/e2e/routes.e2e.ts` (10 tests): validación de respuesta HTTP 200 y presencia de landmarks en las 10 rutas canónicas.
- `tests/e2e/not-found.e2e.ts` (1 test): página 404 personalizada y navegación de retorno al inicio.
- `tests/e2e/console-clean.e2e.ts` (1 test): 0 excepciones JavaScript o errores fatales de consola durante navegación por 7 páginas.
- `tests/e2e/responsive-320px.e2e.ts` (6 tests): verificación de ausencia de desbordamiento horizontal (`scrollWidth <= clientWidth`) en 5 páginas y apertura/cierre accesible del menú móvil.
- `tests/e2e/accessibility.e2e.ts` (5 tests): escaneo de conformidad WCAG 2.1 AA con `@axe-core/playwright` en páginas principales.

---

### 2.4 `pnpm test:coverage`
Ejecutado con `@vitest/coverage-v8@^4.1.9`. Cobertura en módulos críticos:
- `utils/ContentUtils.ts`: 95 %
- `utils/sanitize.ts`: 91,3 %
- `components/content/blocks/*`: 96,15 %
- `composables/fetchPostData.ts`: 88,88 %
- Exit code: 0

---

### 2.5 `pnpm audit --prod`
```text
No known vulnerabilities found
```
- **Vulnerabilidades en producción:** 0 conocidas (exit code 0).
- **Actualización clave:** `isomorphic-dompurify` actualizado de `3.18.0` a `^4.4.0`, resolviendo todas las vulnerabilidades transitivas de `jsdom` / `undici`.
- **Overrides de seguridad y compatibilidad en `pnpm-workspace.yaml`:**
  - `postcss: ^8.5.28`: mitigación de vulnerabilidad en el compilador SFC.
  - `devalue: ^5.9.4`: corrección de vulnerabilidad de serialización.
  - `esbuild: ^0.28.1`: actualización de seguridad en tooling de fuentes.
  - `vite: ^7.3.6`: unificación estricta de runtime para evitar dualidad Vite 7/8 y garantizar generación SSG limpia en Nitro.
- **Vulnerabilidad crítica `GHSA-m4cx-3528-92g7` (RCE en `@nuxt/devtools`):** Corregida manteniendo versión estable `^2.7.0` y deshabilitado en producción.

---

### 2.6 `pnpm generate`
```text
ℹ Prerendered 223 routes in 4.513 seconds                   nitro 12:32:07 AM
✔ Generated public .output/public                           nitro 12:32:08 AM
```
Rutas estáticas generadas:
- Rutas raíz y de contenido: `/`, `/projects/`, `/about/`, `/webs/`, `/social/`, `/contact/`, `/privacy/`, `/cookies/`, `/legal/`, `/blog/`.
- Rutas dinámicas de detalle de proyectos: 16 proyectos con sus páginas individuales (`/projects/:slug/` y `/projects/:slug/:page/`).
- Feed y mapa del sitio: `/sitemap.xml` con todas las URLs canónicas con barra final (`trailing slash`).
- Payload pregenerado JSON para hidratación instantánea sin peticiones de red iniciales.

---

## 3. Matriz de verificación funcional y no funcional

| Criterio | Comprobación | Resultado |
|---|---|:---:|
| **URLs con barra final** | Inspección del HTML en `.output/public`: canonicals, `og:url` y enlaces internos terminan en `/` | ✅ CORRECTO |
| **Detalle de proyectos como página real** | Las URLs `/projects/:slug/` y `/projects/:slug/:page/` contienen HTML semántico estático completo con su `<h1>` propio, migas de pan y metatags | ✅ CORRECTO |
| **Error 404 estricto** | Navegación a rutas o slugs inexistentes dispara `createError({ statusCode: 404, fatal: true })` en cliente y servidor | ✅ CORRECTO |
| **Buscador con debounce y cancelación** | Input con 300 ms de debounce, sincronización `?q=...&tech=...` en URL y cancelación de peticiones con `AbortController` | ✅ CORRECTO |
| **Sin scroll horizontal a 320 px** | Titulares responsivos (`text-4xl sm:text-6xl md:text-8xl`), paddings controlados y ruptura de palabras accesible | ✅ CORRECTO |
| **Accesibilidad de navegación (A11y)** | Enlace "Saltar al contenido principal", captura/retorno de foco en menú móvil con tecla `Escape`, y `aria-label` en botones solo-icono | ✅ CORRECTO |
| **Consent Mode v2 y analítica** | Google Analytics no se ejecuta hasta otorgar consentimiento explícito; revocar borra cookies `_ga*` y envía señal `denied` | ✅ CORRECTO |
| **Políticas legales completas** | Nuevas páginas `/cookies/` y `/legal/` enlazadas en el footer junto con `/privacy/` adaptada al Art. 13 RGPD | ✅ CORRECTO |
| **Seguridad RFC 9116** | Fichero `public/.well-known/security.txt` publicado y válido | ✅ CORRECTO |
| **Protección estricta de privacidad** | Verificación por grep de que no existe ninguna mención a correos personales en el código commiteado; único correo público: `public@raupulus.dev` | ✅ CORRECTO |
