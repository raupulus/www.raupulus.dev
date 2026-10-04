# Cobertura de la Auditoría — www.raupulus.dev

> **Auditor:** `gemini-externo`  
> **Modo:** `externo` (segunda opinión independiente y ciega)  
> **Fecha:** 2026-10-04  
> **Estado:** 100% Completado

Leyenda:

- ✅ **Verificado y correcto:** Comprobado exhaustivamente, sin defectos.
- ❌ **Hallazgo (ID):** Defecto identificado, documentado con evidencia y reproducibilidad.
- ⚠️ **No verificable:** Limitación técnica documentada con justificación.
- ➖ **No aplica:** Criterio no aplicable al contexto de la aplicación.

---

## 6.1 Seguridad (`SEC`)

### Secretos y exposición de información

- [x] ❌ **SEC-005**: Secretos en el repo y en historial de git: Correo personal privado expuesto en `apache.conf:7` y `apache_dev.conf:15` (`ServerAdmin`).
- [x] ✅ **Verificado y correcto**: Secretos o datos internos en el build (`.output/public`): no se exponen tokens privados en el bundle JS ni en `_payload.json`.
- [x] ❌ **SEC-004**: `runtimeConfig`: presencia innecesaria de `captcha.secretKey` y `CAPTCHA_SITE_PRIVATE_KEY` en configuración de frontend estático.
- [x] ❌ **SEC-005**: Repositorio público: exposición de infraestructura y rutas/correos privados en configuraciones versionadas.
- [x] ✅ **Verificado y correcto**: Archivos sensibles (`.git`, `.env`, `package.json`) no se sirven en el build estático público.

### Inyección y contenido dinámico

- [x] ❌ **SEC-001**: Inventario de `v-html` y sanitización: DOMPurify en `utils/sanitize.ts` permite inyección CSS (atributo `style`) e iframes arbitrarios sin sandbox ni whitelist en `sanitizeRawHtml`.
- [x] ❌ **SEC-001**: Configuración de DOMPurify en `utils/sanitize.ts`.
- [x] ❌ **SEC-001**: `sanitizeRawHtml` (BlockRaw) y `BlockEmbed`: ausencia de lista blanca de dominios y atributo `sandbox`.
- [x] ❌ **SEC-006**: `BlockCode`, `BlockLinkTool`: validación deficiente de esquemas de protocolo (`javascript:`, `data:`).
- [x] ✅ **Verificado y correcto**: JSON-LD y metadatos construidos con escape de caracteres especiales adecuado.
- [x] ✅ **Verificado y correcto**: Construcción de URLs de API a partir de slugs usa encoding de Nuxt.
- [x] ❌ **SEC-006**: Enlaces externos sin `rel="noopener noreferrer"` forzado en ciertos bloques EditorJS.

### Formulario de contacto

- [x] ❌ **BUG-001**: Flujo CSRF de Sanctum entre `raupulus.dev` y `api.raupulus.dev` roto por configuración de dominio de cookie.
- [x] ❌ **UX-001**, ❌ **A11Y-002**: Validación en cliente hiper-restrictiva y falta de botón submit nativo.
- [x] ❌ **LEGAL-003**: Inyección incondicional no consentida de reCAPTCHA v3.
- [x] ✅ **Verificado y correcto**: CORS de la API configurado para dominios específicos.
- [x] ✅ **Verificado y correcto**: Proxy de desarrollo `/_proxy/**` solo activo en dev server de Vite, no expuesto en producción.

### Cabeceras, TLS y DNS

- [x] ❌ **SEC-002**: Ausencia total de CSP, `X-Content-Type-Options`, `X-Frame-Options` y `Referrer-Policy` en producción.
- [x] ❌ **SEC-003**: HSTS deshabilitado con `max-age=0` en producción.
- [x] ❌ **INFRA-001**: Discrepancias graves entre `apache.conf`, `nginx.conf`, `.htaccess` y producción.
- [x] ❌ **SEO-002**: Subdominio `www.raupulus.dev` sin resolución DNS (NXDOMAIN).
- [x] ❌ **SEC-007**: Ausencia de registro DNS CAA; política DMARC permisiva (`p=none`).
- [x] ❌ **SEC-008**: Ausencia de archivo estandarizado `/.well-known/security.txt`.
- [x] ❌ **PERF-005**: Imagen `og:image` alojada externamente en `raw.githubusercontent.com`.

---

## 6.2 Privacidad y cumplimiento legal (`LEGAL`)

- [x] ❌ **LEGAL-003**: Carga incondicional de Google reCAPTCHA v3 antes del consentimiento y en páginas ajenas al formulario.
- [x] ❌ **LEGAL-001**: Consent Mode v2 otorga señales publicitarias (`ad_*`) al consentir cookies analíticas.
- [x] ❌ **LEGAL-002**: Imposibilidad técnica de revocar consentimiento analítico en runtime.
- [x] ❌ **LEGAL-004**: Política de privacidad incompleta e inconforme con el art. 13 del RGPD.
- [x] ❌ **LEGAL-005**: Ausencia de tabla informativa detallada de cookies en `/privacy`.
- [x] ❌ **LEGAL-006**: Formulario de contacto no disocia el envío del consentimiento ni provee primera capa informativa.
- [x] ❌ **LEGAL-007**: Ausencia de Aviso Legal formal (LSSI-CE art. 10) y Declaración de Accesibilidad.
- [x] ✅ **Verificado y correcto**: Banner de cookies implementado con `@dargmuesli/nuxt-cookie-control`.
- [x] ✅ **Verificado y correcto**: Fuentes de Google descargadas y servidas localmente mediante `@nuxt/fonts`.

---

## 6.3 Bugs ocultos, robustez y errores visibles al usuario (`BUG`)

- [x] ❌ **BUG-001**: Formulario de contacto permanentemente inoperativo (fallo 419 CSRF de Sanctum).
- [x] ❌ **BUG-002**: Soft-404 generalizado: `.htaccess` reescribe rutas inexistentes a 200 OK.
- [x] ❌ **BUG-003**: Contenido de proyectos no prerenderizado en el cuerpo estático de la página.
- [x] ❌ **BUG-004**: Slugs de proyecto inexistentes devuelven estado 200 sin modal ni 404 real.
- [x] ❌ **BUG-005**: Captura silenciosa de errores de red en `usefetchProjectsPaginated` genera sitemaps vacíos en build.
- [x] ❌ **BUG-006**: Fallo de hidratación en `usePlatformData` dispara petición con error CORS en cliente en desarrollo.
- [x] ❌ **BUG-007**: Bloqueo permanente del scroll del body (`disable-scroll`) al cerrar modal con botón atrás.
- [x] ❌ **BUG-008**: Manipulación directa con `history.pushState` en lugar de Vue Router.
- [x] ❌ **BUG-009**: Error tipográfico `privacity` en modelo de datos.
- [x] ✅ **Verificado y correcto**: Descarga de CV en PDF operativa en botón de cabecera.
- [x] ✅ **Verificado y correcto**: Formato de fechas y números consistente con `es-ES`.

---

## 6.4 SEO técnico, on-page y de identidad (`SEO`)

- [x] ❌ **SEO-001**: Metadatos y Open Graph idénticos en todas las páginas de proyectos en el build estático.
- [x] ❌ **SEO-002**: Subdominio `www.raupulus.dev` devuelve NXDOMAIN en lugar de 301.
- [x] ❌ **SEO-003**: Página `/blog` ("En Construcción") indexable en sitemap y robots sin noindex.
- [x] ❌ **SEO-004**: Rutas de iconos en `site.webmanifest` apuntan a rutas inexistentes (404).
- [x] ❌ **SEO-005**: Múltiples etiquetas `<h1>` generadas en páginas de proyectos por `BlockHeader.vue`.
- [x] ❌ **SEO-006**: `og:locale:alternate` para `en_US` declarado sin existir versión en inglés.
- [x] ❌ **SEO-007**: Marcado JSON-LD incompleto: falta `BreadcrumbList` y perfiles sociales desalineados.
- [x] ✅ **Verificado y correcto**: `robots.txt` presente y apuntando al sitemap oficial.
- [x] ✅ **Verificado y correcto**: URLs canónicas presentes en todas las páginas principales.
- [x] ✅ **Verificado y correcto**: Puntuación Lighthouse SEO de 100/100 en todas las páginas.

---

## 6.5 Rendimiento y Core Web Vitals (`PERF`)

- [x] ❌ **PERF-001**: Rendimiento móvil en Lighthouse de 58/100 con LCP de 8.2 s bajo red 4G simulada.
- [x] ❌ **PERF-002**: Política de caché agresiva a 1 mes para HTML en `.htaccess` expone a fallos de carga tras despliegues.
- [x] ❌ **PERF-003**: Sobrecarga de variantes y pesos tipográficos autohospedados (10 pesos compilados en `@nuxt/fonts`).
- [x] ❌ **PERF-004**: Tamaño del chunk JavaScript inicial (128.4 KB gzipped) supera el presupuesto de 120 KB.
- [x] ❌ **PERF-005**: Imagen `og:image` alojada en dominio externo no optimizado (`raw.githubusercontent.com`).
- [x] ✅ **Verificado y correcto**: Rendimiento de escritorio extraordinario: 99/100 en Lighthouse, LCP 0.9 s.
- [x] ✅ **Verificado y correcto**: Total Blocking Time (TBT) de 20 ms en móvil y 0 ms en escritorio.
- [x] ✅ **Verificado y correcto**: Cumulative Layout Shift (CLS) de 0.00 en todas las vistas.
- [x] ✅ **Verificado y correcto**: Compresión Brotli y Gzip activa en Cloudflare en producción.

---

## 6.6 Responsive y compatibilidad entre dispositivos y navegadores (`RESP`)

- [x] ❌ **RESP-001**: Tipografía `text-5xl` en el hero desproporcionada en viewports mínimos de 320 px.
- [x] ❌ **RESP-002**: Ausencia de `color-scheme: dark` provoca barras de desplazamiento y controles nativos en modo claro.
- [x] ❌ **RESP-003**: Uso de unidades rígidas `100vh` en contenedores de menús móviles y modales en lugar de `100dvh`.
- [x] ✅ **Verificado y correcto**: Cero scroll horizontal (`scrollWidth === clientWidth`) entre 320 px y 2560 px.
- [x] ✅ **Verificado y correcto**: Menú móvil de navegación abre y colapsa correctamente en iOS y Android.
- [x] ✅ **Verificado y correcto**: Rejillas elásticas con CSS Grid en proyectos y tecnologías.
- [x] ✅ **Verificado y correcto**: Compatibilidad funcional en motores Chromium, WebKit y Firefox.

---

## 6.7 UX/UI y contenido (`UX` / `CONT`)

- [x] ❌ **UX-001**: Validaciones excesivamente restrictivas en formulario de contacto (nombre min 5, asunto min 10, email max 50).
- [x] ❌ **UX-002**: Campo de mensaje de contacto implementado con `contenteditable` en vez de `<textarea>` nativo.
- [x] ❌ **UX-003**: Enlace roto en `/social` hacia Stack Overflow en español (devuelve HTTP 403).
- [x] ❌ **UX-004**: Archivo gráfico huérfano de 471 KB (`public/patterns/a.png`) publicado innecesariamente.
- [x] ✅ **Verificado y correcto**: Identidad visual coherente con el design system "Silicon Architect".
- [x] ✅ **Verificado y correcto**: Estados de hover y foco claros en componentes interactivos.
- [x] ✅ **Verificado y correcto**: Jerarquía visual y legibilidad óptimas en pantallas de escritorio y tableta.

---

## 6.8 Accesibilidad — WCAG 2.2 AA (`A11Y`)

- [x] ❌ **A11Y-001**: Ratio de contraste insuficiente (1.98:1) en textos secundarios del pie de página (Criterio 1.4.3 AA).
- [x] ❌ **A11Y-002**: Formulario de contacto carece de botón semántico `type="submit"` e ignora Enter (Criterios 3.2.2 A, 4.1.2 A).
- [x] ❌ **A11Y-003**: Modales sin atrapamiento de foco (`focus trap`) ni `aria-modal="true"` (Criterio 2.4.3 A).
- [x] ❌ **A11Y-004**: Bloques de lista en contenidos renderizados con `<div>` en vez de `<ul>`/`<ol>` y `<li>` (Criterio 1.3.1 A).
- [x] ❌ **A11Y-005**: Tablas de datos sin elemento `<caption>` ni atributo `scope` en cabeceras (Criterio 1.3.1 A).
- [x] ❌ **A11Y-006**: Botón de cierre en modales carece de nombre accesible (`aria-label`) y elemento `<button>` (Criterio 4.1.2 A).
- [x] ❌ **A11Y-007**: Botones de solo icono carecen de etiqueta accesible `aria-label` en tarjetas y código (Criterio 4.1.2 A).
- [x] ❌ **A11Y-008**: Navegación con scroll forzado suave (`smooth`) sin respetar `prefers-reduced-motion` (Criterio 2.3.3).
- [x] ⚠️ **No verificable**: Criterio 2.4.1 (falta enlace "Saltar al contenido principal").
- [x] ✅ **Verificado y correcto**: Soporte de zoom al 200% sin roturas ni solapamientos.
- [x] ✅ **Verificado y correcto**: Atributo `lang="es"` declarado en `<html>`.
- [x] ✅ **Verificado y correcto**: Tabla de conformidad WCAG 2.2 A y AA completa generada en `08-accesibilidad.md`.

---

## 6.9 Dependencias y cadena de suministro (`DEP`)

- [x] ❌ **DEP-001**: Vulnerabilidad crítica de Ejecución Remota de Código (RCE) en `@nuxt/devtools@2.7.0` (CVSS 9.6).
- [x] ❌ **DEP-002**: Archivo `package-lock.json` desincronizado respecto a `package.json` (103 discrepancias en `npm ci`).
- [x] ❌ **DEP-003**: Vulnerabilidad de bypass XSS en dependencia productiva `dompurify` (GHSA-55q2-fjhq-7xh7).
- [x] ❌ **DEP-004**: Coexistencia conflictiva de artefactos de pnpm (`pnpm-lock.yaml`, `.npmrc`) con el estándar npm.
- [x] ❌ **DEP-005**: Ausencia del paquete `@vitest/coverage-v8` en devDependencies impide ejecutar la suite de cobertura.
- [x] ✅ **Verificado y correcto**: 100% de licencias permisivas de código abierto (MIT, ISC, Apache 2.0, BSD).
- [x] ✅ **Verificado y correcto**: Nuxt 4, Vue 3, Vite y Tailwind 3 en versiones estables.

---

## 6.10 Calidad de código, tests y mantenibilidad (`CODE`)

- [x] ❌ **CODE-001**: Archivo utilitario `utils/apiClient.ts` huérfano y en desuso a pesar de estar documentado.
- [x] ❌ **CODE-002**: Desfase crítico entre la documentación técnica en `docs/info/` (API v1) y el código real (API v2).
- [x] ❌ **CODE-003**: Presencia de 38 advertencias de ESLint por `v-html`, props implícitas y `console.log`.
- [x] ❌ **CODE-004**: Cobertura de tests nula en páginas, layout, modales y lógica del formulario de contacto.
- [x] ✅ **Verificado y correcto**: Chequeo estricto de tipos con `npx vue-tsc --noEmit` pasa con 0 errores.
- [x] ✅ **Verificado y correcto**: 45 tests unitarios pasan al 100% en `npm run test:run`.
- [x] ✅ **Verificado y correcto**: Componentes construidos homogéneamente con `<script setup lang="ts">`.

---

## 6.11 Infraestructura, CI/CD y operación (`INFRA`)

- [x] ❌ **INFRA-001**: Configuraciones de servidor versionadas (`apache.conf`, `nginx.conf`, `.htaccess`) desalineadas con producción.
- [x] ❌ **INFRA-002**: Pipeline `gocd.yaml` carece de inyección de variables de entorno de producción para el build.
- [x] ❌ **INFRA-003**: Despliegue en caliente no atómico mediante `rsync --delete` sobre el docroot en producción.
- [x] ❌ **INFRA-004**: Ausencia de purga automática de caché de CDN (Cloudflare) en el pipeline de CI/CD.
- [x] ✅ **Verificado y correcto**: Enrutamiento Anycast DNS con soporte IPv4 e IPv6 activo.
- [x] ✅ **Verificado y correcto**: Certificado TLS moderno válido con soporte TLS 1.3 y TLS 1.2.
