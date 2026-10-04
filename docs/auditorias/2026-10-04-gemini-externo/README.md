# Informe Ejecutivo de Auditoría Externa — www.raupulus.dev

> **Auditoría Externa Independiente (Segunda Opinión Ciega)**  
> **Auditor:** `gemini-externo`  
> **Modo:** `externo`  
> **Fecha:** 2026-10-04

---

## 1. Ficha Técnica del Entorno

| Parámetro                     | Valor                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Fecha y Hora**              | 2026-10-04T19:00:00+02:00                                                                                       |
| **Auditor / Modelo**          | Gemini (agente de auditoría externa independiente)                                                              |
| **Modo de Ejecución**         | `externo` (segunda opinión ciega sin acceso a auditorías previas)                                               |
| **Commit Auditado**           | `05acdf145484a640a2df12ed39a94a236e6ab0ae`                                                                      |
| **Rama Git**                  | `dev`                                                                                                           |
| **Cambios sin commitear**     | Directorio git con archivos no versionados documentados en `evidencias/entorno.txt`                             |
| **URL Producción**            | `https://raupulus.dev`                                                                                          |
| **API Backend Evaluada**      | `https://api.raupulus.dev` (v1 y v2)                                                                            |
| **Sistema Operativo**         | macOS (Darwin ARM64 24.6.0)                                                                                     |
| **Node.js / npm**             | Node.js v26.10.0 / npm v11.19.1                                                                                 |
| **Herramientas de Auditoría** | Lighthouse 12.3.0, axe-core / pa11y 9.1.1, linkinator 6.1.4, Knip 5.43.0, ESLint 9, vue-tsc 2.2.0, Vitest 3.0.4 |

---

## 2. Resumen Ejecutivo

El sitio web **www.raupulus.dev** es el portfolio y plataforma personal de ingeniería de software de Raúl Caro Pastorino (@raupulus). Construido sobre **Nuxt 4**, **Vue 3** y **TailwindCSS 3** bajo la estética _"Silicon Architect"_, el proyecto destaca visualmente por un diseño cuidado, una estructura de componentes clara, tipado estricto en TypeScript (0 errores en `vue-tsc`) y un rendimiento en escritorio sobresaliente (**99/100 en Lighthouse**, FCP 0.6 s, CLS 0.00).

Sin embargo, la evaluación técnica externa en profundidad ha identificado **64 hallazgos** (3 críticos, 23 altos, 25 medios y 13 bajos) que comprometen aspectos esenciales de operatividad, seguridad, privacidad legal y visibilidad en buscadores:

1. **Inoperatividad funcional del canal de contacto:** El flujo CSRF de Laravel Sanctum entre el dominio principal (`raupulus.dev`) y el subdominio de la API (`api.raupulus.dev`) está roto por aislamiento de cookies de dominio. Cualquier visitante que intenta enviar un mensaje recibe un error HTTP 419 bloqueante, dejando el sitio sin canal de contacto directo.
2. **Vulnerabilidades de seguridad críticas y altas:** La configuración de sanitización en `utils/sanitize.ts` permite inyección CSS y carga de `iframe` sin aislamiento `sandbox` ni lista blanca de dominios. En producción faltan todas las cabeceras de seguridad HTTP básicas (sin CSP, HSTS deshabilitado con `max-age=0`, sin `X-Frame-Options` ni `nosniff`). Asimismo, el árbol de dependencias incluye una vulnerabilidad crítica de Ejecución Remota de Código (RCE) en `@nuxt/devtools` (CVSS 9.6).
3. **Privacidad y cumplimiento legal (RGPD / AEPD):** Al aceptar cookies analíticas en el banner, el sistema otorga de forma no consentida señales publicitarias en Consent Mode v2 (`ad_*`). La revocación de cookies no funciona en caliente y el script de Google reCAPTCHA v3 se descarga indiscriminadamente en todas las páginas sin consentimiento previo.
4. **Problemas graves de SEO técnico y renderizado:** Las páginas individuales de proyectos prerenderizadas en el build estático comparten exactamente el mismo título, descripción y canonical que la portada general. El detalle de los proyectos no está en el HTML estático sino supeditado a un modal de cliente, y el servidor web reescribe rutas inexistentes con estado 200 (Soft-404). Además, `www.raupulus.dev` devuelve `NXDOMAIN` en DNS.
5. **Rendimiento móvil y accesibilidad:** Mientras el escritorio vuela, la experiencia móvil en redes 4G cae a **58/100** con un LCP de 8.2 s debido al peso de 10 fuentes tipográficas y scripts bloqueantes. En accesibilidad, textos del pie de página tienen un ratio de contraste de 1.98:1 (frente al 4.5:1 exigido por WCAG AA) y los modales carecen de atrapamiento de foco.

La puntuación global ponderada del proyecto se sitúa en **5.3 / 10**. No obstante, gracias a la sólida base técnica del código, **15 Quick Wins de bajo esfuerzo (XS/S)** permitirán elevar drásticamente la calidad y subsanar las principales brechas en menos de 72 horas.

---

## 3. Scorecard por Área y Nota Global Ponderada

| Área                        | Peso | Puntuación (0–10) | Justificación                                                                                           |
| --------------------------- | ---- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Seguridad**               | 15%  | **4.5 / 10**      | 1 crítico (bypass en sanitización) y 2 altos (sin cabeceras de seguridad, HSTS anulado).                |
| **Bugs y Robustez**         | 15%  | **4.0 / 10**      | 1 crítico (formulario de contacto inoperativo por CSRF) y 4 altos (soft-404, proyectos vacíos en HTML). |
| **SEO**                     | 15%  | **5.5 / 10**      | 2 altos (metadatos duplicados en 200+ proyectos, NXDOMAIN en www) y thin content en `/blog`.            |
| **Rendimiento**             | 15%  | **6.0 / 10**      | 2 altos (Lighthouse móvil 58/100, caché HTML a 1 mes en .htaccess); compensado por desktop 99/100.      |
| **Responsive**              | 10%  | **7.5 / 10**      | Sin críticos ni altos; excelente fluidez general, salvo desajustes a 320 px y `100vh`.                  |
| **Accesibilidad**           | 10%  | **5.0 / 10**      | 3 altos (contraste 1.98:1 en footer, sin botón submit, foco descontrolado en modales).                  |
| **Privacidad y Legal**      | 8%   | **4.5 / 10**      | 3 altos (Consent Mode v2 publicitario no consentido, reCAPTCHA incondicional, sin revocación).          |
| **UX y Contenido**          | 5%   | **7.5 / 10**      | Sin críticos ni altos; diseño de alta fidelidad, con validaciones de formulario a pulir.                |
| **Dependencias**            | 3%   | **4.0 / 10**      | 1 crítico (RCE en Nuxt Devtools CVSS 9.6) y 1 alto (lockfile desincronizado con 103 discrepancias).     |
| **Calidad de Código**       | 2%   | **7.0 / 10**      | 0 errores en vue-tsc y 45 tests verdes; penalizado por desfase de documentación hacia API v1.           |
| **Infraestructura y CI/CD** | 2%   | **4.5 / 10**      | 3 altos (confs de Apache/Nginx desalineadas, variables ausentes en GoCD, deploys no atómicos).          |

### **Nota Global Ponderada: 5.3 / 10**

---

## 4. Métricas Clave

### 4.1 Auditoría Lighthouse (Mediana de 3 ejecuciones)

| Plantilla / URL | Estrategia | Performance | Accessibility | Best Practices | SEO | LCP   | FCP   | TBT   | CLS  |
| --------------- | ---------- | ----------- | ------------- | -------------- | --- | ----- | ----- | ----- | ---- |
| **`/` (Home)**  | Móvil (4G) | **58**      | 96            | 96             | 100 | 8.2 s | 7.6 s | 20 ms | 0.00 |
| **`/` (Home)**  | Escritorio | **99**      | 96            | 96             | 100 | 0.9 s | 0.6 s | 0 ms  | 0.00 |
| **`/projects`** | Escritorio | **98**      | 96            | 96             | 100 | 1.0 s | 0.7 s | 0 ms  | 0.00 |
| **`/about`**    | Escritorio | **99**      | 96            | 96             | 100 | 0.8 s | 0.6 s | 0 ms  | 0.00 |
| **`/contact`**  | Escritorio | **98**      | 91            | 96             | 100 | 1.1 s | 0.7 s | 10 ms | 0.00 |
| **`/privacy`**  | Escritorio | **100**     | 96            | 96             | 100 | 0.7 s | 0.5 s | 0 ms  | 0.00 |

### 4.2 Indicadores Complementarios

- **Violaciones de accesibilidad (pa11y / axe):** 7 errores en home, about y privacy; 10 errores en `/contact` (contraste y controles).
- **Calificación de Cabeceras HTTP:** Calificación **F** en Mozilla HTTP Observatory (ausencia de CSP, HSTS, XFO, nosniff).
- **Calificación TLS:** Calificación **A** (Cloudflare Edge con TLS 1.3 / TLS 1.2).
- **Vulnerabilidades `npm audit`:** 35 totales (1 crítica RCE, 27 altas); 4 en bundle de producción (`dompurify`, `nanoid`, `postcss`, `undici`).
- **Enlaces rotos (`linkinator`):** 1 enlace roto (`https://es.stackoverflow.com/users/82651/raupulus` devuelve HTTP 403).
- **Errores de compilación y tipos:** **0 errores** en `vue-tsc`, **0 errores** en ESLint (38 warnings).

---

## 5. Tabla de Cumplimiento de Umbrales de Excelencia

| Área                      | Métrica / Control                 | Objetivo                     | Valor Medido                          | Estado               |
| ------------------------- | --------------------------------- | ---------------------------- | ------------------------------------- | -------------------- |
| **Lighthouse Móvil**      | Perf / A11y / BP / SEO            | ≥ 95 / 100 / 100 / 100       | 58 / 96 / 96 / 100                    | ❌ No cumple         |
| **Lighthouse Escritorio** | Perf / A11y / BP / SEO            | ≥ 98 / 100 / 100 / 100       | 99 / 96 / 96 / 100                    | ⚠️ Parcial (A11y/BP) |
| **Core Web Vitals**       | LCP móvil / CLS / TBT             | ≤ 2.0 s / ≤ 0.05 / ≤ 200 ms  | 8.2 s / 0.00 / 20 ms                  | ❌ No cumple (LCP)   |
| **Tiempos de Carga**      | TTFB / FCP móvil                  | ≤ 0.6 s / ≤ 1.5 s            | 0.2 s / 7.6 s                         | ❌ No cumple (FCP)   |
| **Presupuesto JS**        | Entry chunk comprimido            | ≤ 120 KB gzipped             | 128.4 KB gzipped                      | ❌ No cumple         |
| **Accesibilidad**         | Violaciones axe / WCAG            | 0 violaciones / AA completo  | 10 violaciones / No cumple AA         | ❌ No cumple         |
| **Seguridad HTTP**        | HTTP Observatory / SSL            | ≥ A / A+                     | Grado F / Grado A                     | ❌ No cumple         |
| **Seguridad Código**      | Secretos / RCE / Vulns altas      | 0 / 0 / 0                    | 1 secreto (correo) / 1 RCE / 27 altas | ❌ No cumple         |
| **SEO Técnico**           | 404 real / Canonical / Sitemaps   | 404 real / 100% canónicos    | Soft-404 (200) / Canónicos duplicados | ❌ No cumple         |
| **Robustez**              | Hydration mismatch / Scroll 320px | 0 / Cero scroll              | 1 mismatch / 0 scroll horiz.          | ⚠️ Parcial           |
| **Calidad Código**        | Lint / vue-tsc / Tests            | 0 errores / 0 errores / 100% | 0 errores / 0 errores / 45 verdes     | ✅ Cumple            |

---

## 6. Recuento de Hallazgos por Severidad y Área

```
┌─────────────────────────┬─────────┬──────┬───────┬──────┬─────────┐
│ Área                    │ Crítica │ Alta │ Media │ Baja │ TOTAL   │
├─────────────────────────┼─────────┼──────┼───────┼──────┼─────────┤
│ 01. Seguridad           │    1    │  2   │   3   │  2   │    8    │
│ 02. Privacidad y Legal  │    0    │  3   │   3   │  1   │    7    │
│ 03. Bugs y Robustez     │    1    │  4   │   3   │  1   │    9    │
│ 04. SEO                 │    0    │  2   │   3   │  2   │    7    │
│ 05. Rendimiento         │    0    │  2   │   2   │  1   │    5    │
│ 06. Responsive          │    0    │  0   │   3   │  0   │    3    │
│ 07. UX y Contenido      │    0    │  0   │   2   │  2   │    4    │
│ 08. Accesibilidad       │    0    │  3   │   4   │  1   │    8    │
│ 09. Dependencias        │    1    │  1   │   2   │  1   │    5    │
│ 10. Calidad de Código   │    0    │  0   │   2   │  2   │    4    │
│ 11. Infra y CI/CD       │    0    │  3   │   1   │  0   │    4    │
├─────────────────────────┼─────────┼──────┼───────┼──────┼─────────┤
│ TOTAL GLOBAL            │    3    │  20  │  28   │  13  │   64    │
└─────────────────────────┴─────────┴──────┴───────┴──────┴─────────┘
```

---

## 7. Top 10 de Riesgos Priorizados

1. **DEP-001 (Crítica — P0):** Vulnerabilidad RCE en `@nuxt/devtools@2.7.0` (GHSA-279x-mwfv-vcqv, CVSS 9.6) que permite ejecución de código remoto en la máquina de desarrollo vía CSRF local.
2. **BUG-001 (Crítica — P0):** Flujo CSRF de Sanctum roto entre `raupulus.dev` y `api.raupulus.dev` que provoca fallos HTTP 419 permanentes al intentar enviar el formulario de contacto.
3. **SEC-001 (Crítica — P0):** Sanitización incompleta en `utils/sanitize.ts` que permite inyección de estilos CSS y carga arbitraria de iframes sin sandbox ni lista blanca.
4. **SEC-002 / SEC-003 (Alta — P1):** Ausencia total de cabeceras de seguridad en producción y HSTS explícitamente anulado con `max-age=0`.
5. **LEGAL-001 / LEGAL-002 (Alta — P1):** Consent Mode v2 otorga señales publicitarias (`ad_*`) no consentidas al aceptar cookies analíticas, sin posibilidad técnica de revocación.
6. **BUG-002 (Alta — P1):** Comportamiento Soft-404: `public/.htaccess` reescribe todas las rutas inexistentes a `index.html` con estado HTTP 200.
7. **BUG-003 / SEO-001 (Alta — P1):** Contenido de proyectos no prerenderizado en el HTML estático y metadatos duplicados en 200+ páginas de proyectos.
8. **A11Y-001 (Alta — P1):** Ratio de contraste deficiente de 1.98:1 en pie de página corporativo, incumpliendo el criterio 1.4.3 de WCAG 2.2 AA.
9. **PERF-001 / PERF-002 (Alta — P1):** Rendimiento móvil de 58/100 con LCP de 8.2 s y directiva de expiración de HTML a 1 mes en `.htaccess` que rompe hashes de chunks.
10. **INFRA-003 (Alta — P1):** Despliegue en caliente no atómico mediante `rsync --delete` directamente sobre el docroot en producción.

---

## 8. Quick Wins (Alto Impacto con Esfuerzo XS o S)

Las siguientes 12 acciones inmediatas pueden completarse en menos de un día y elevan la seguridad, accesibilidad y estabilidad de inmediato:

| ID           | Área          | Acción                                                                                             | Esfuerzo |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------- | -------- |
| **DEP-001**  | Dependencias  | Actualizar `@nuxt/devtools` a `^2.8.1+` en `package.json`                                          | XS       |
| **SEC-003**  | Seguridad     | Configurar `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` en Cloudflare | XS       |
| **SEC-005**  | Privacidad    | Sustituir correo privado en `apache.conf` por `public@raupulus.dev`                                | XS       |
| **SEO-002**  | SEO           | Añadir registro CNAME y redirección 301 de `www.raupulus.dev` a `raupulus.dev`                     | XS       |
| **SEO-003**  | SEO           | Añadir `noindex, nofollow` a `pages/blog.vue` y excluirlo del sitemap                              | XS       |
| **SEO-004**  | SEO           | Corregir rutas en `public/favicons/site.webmanifest` y fijar `theme_color: #091421`                | XS       |
| **PERF-002** | Rendimiento   | Añadir `ExpiresByType text/html "access plus 0 seconds"` en `public/.htaccess`                     | S        |
| **PERF-003** | Rendimiento   | Restringir pesos de fuentes a `[400, 700]` en `nuxt.config.ts`                                     | S        |
| **A11Y-001** | Accesibilidad | Cambiar clase `text-outline-variant` por `text-on-surface-variant` en `Footer.vue`                 | XS       |
| **A11Y-002** | Accesibilidad | Cambiar botón en `pages/contact.vue` de `type="button"` a `type="submit"`                          | XS       |
| **DEP-002**  | Dependencias  | Ejecutar `npm install --package-lock-only` para sincronizar el lockfile                            | S        |
| **DEP-004**  | Dependencias  | Eliminar `pnpm-lock.yaml`, `pnpm-workspace.yaml` y `.npmrc`                                        | XS       |

---

## 9. Alcance, Metodología y Limitaciones

### 9.1 Metodología

La auditoría se ejecutó bajo el principio del **triple contraste**:

1. **Análisis estático:** Inspección de la base de código (`pages/`, `components/`, `composables/`, `utils/`, configuración y dependencias).
2. **Análisis de build generado:** Evaluación de la salida estática en `.output/public` (archivos HTML, chunks JS/CSS, sitemaps y metadatos).
3. **Observación pasiva en ejecución:** Verificación en el entorno de producción (`https://raupulus.dev`, DNS, TLS y cabeceras) y pruebas dinámicas locales con build productivo servido en `http://localhost:4173`.

### 9.2 Limitaciones Explícitas y Lo Que No Se Pudo Verificar

- **Acceso a servidor e infraestructura backend:** La auditoría se centró exclusivamente en el frontend estático y la observación pasiva de la API pública. No se dispuso de acceso SSH al servidor de producción, ni al panel de control de Cloudflare, ni al código fuente del backend Laravel.
- **Pruebas invasivas de penetración:** De acuerdo con las normas éticas del prompt, no se ejecutaron ataques activos de fuerza bruta ni inyecciones contra el servidor de producción; las pruebas de XSS y CSRF se circunscribieron al análisis estático y reproducción en entornos de pruebas aislados.
- **Dispositivos móviles físicos reales:** Las pruebas responsivas y táctiles se realizaron mediante emulaciones fidedignas de Chromium y WebKit; no se dispuso de un dispositivo Android físico bajo red celular 3G nativa.

---

## 10. Estructura de Entregables de la Auditoría

Todos los informes y evidencias detalladas se encuentran organizados en este directorio:

- [`01-seguridad.md`](./01-seguridad.md) — Análisis de vulnerabilidades, secretos, inyecciones y cabeceras.
- [`02-privacidad-legal.md`](./02-privacidad-legal.md) — Consent Mode v2, cookies, RGPD, ePrivacy y formularios.
- [`03-bugs-robustez.md`](./03-bugs-robustez.md) — Errores de CSRF, Soft-404, SSR, hidratación y ciclo de vida.
- [`04-seo.md`](./04-seo.md) — Metadatos, sitemaps, indexabilidad, canonicals y datos estructurados.
- [`05-rendimiento.md`](./05-rendimiento.md) — Core Web Vitals, Lighthouse móvil/desktop y políticas de caché.
- [`06-responsive-compatibilidad.md`](./06-responsive-compatibilidad.md) — Matriz de viewports, controles oscuros y adaptación móvil.
- [`07-ux-ui-contenido.md`](./07-ux-ui-contenido.md) — Heurísticas de Nielsen, formulario de contacto y limpieza visual.
- [`08-accesibilidad.md`](./08-accesibilidad.md) — WCAG 2.2 AA y **tabla de conformidad completa A/AA**.
- [`09-dependencias.md`](./09-dependencias.md) — Vulnerabilidades npm, coherencia de lockfile y licencias.
- [`10-calidad-codigo.md`](./10-calidad-codigo.md) — TypeScript, convenciones, tests y actualización documental.
- [`11-infraestructura-cicd.md`](./11-infraestructura-cicd.md) — Pipeline GoCD, atomicidad de despliegues y CDN.
- [`recomendaciones-api.md`](./recomendaciones-api.md) — Requisitos técnicos y correcciones para el backend Laravel.
- [`cobertura.md`](./cobertura.md) — Lista de comprobación completa de la sección 6 con estado de cada ítem.
- [`matriz-pruebas.md`](./matriz-pruebas.md) — Matriz de rutas × viewports × motores de renderizado.
- [`plan-remediacion.md`](./plan-remediacion.md) — Plan cronológico de mitigación en Fases 0 a 6 y controles preventivos de CI.
- [`hallazgos.json`](./hallazgos.json) — Base de datos estructurada con los 64 hallazgos en formato JSON estándar.
- [`evidencias/`](./evidencias/) — Registros de ejecución de build, Lighthouse, pa11y, DNS, cabeceras y dependencias.
