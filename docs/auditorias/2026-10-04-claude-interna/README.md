# Auditoría integral de www.raupulus.dev — 2026-10-04 (interna)

## 1. Ficha

| Campo                 | Valor                                                                                                                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha                 | 2026-10-04, 18:44–19:45 CEST                                                                                                                                                                                                                                                                       |
| Auditor               | `claude-interna` (Claude Code, modelo Opus 5.5)                                                                                                                                                                                                                                                    |
| Modo                  | `interno` (prompt `docs/auditorias/PROMPT-AUDITORIA.md`; se han contrastado los 24 indicios preliminares, sección 10)                                                                                                                                                                              |
| Commit                | `05acdf145484a640a2df12ed39a94a236e6ab0ae` (rama `dev`)                                                                                                                                                                                                                                            |
| Cambios sin commitear | 43 modificados, 2 eliminados, 5 nuevos al inicio. Durante la auditoría se modificaron además 2 componentes de tarjeta y 12 archivos de documentación (ver limitaciones)                                                                                                                            |
| URL auditada          | `https://raupulus.dev` (build en producción con `last-modified` 2026-09-11, Apache 2.4.68 detrás de Cloudflare)                                                                                                                                                                                    |
| Builds locales        | A: árbol de trabajo + API pública v2 (sin proyectos) · B: árbol de trabajo + backend local con 16 proyectos                                                                                                                                                                                        |
| Herramientas          | Node 26.10.0, npm 11.19.1, Playwright 1.63.0 (Chromium y WebKit), axe-core 4.13.0, Lighthouse 12.8.2, serve 14.2.6, linkinator 6, knip 5.88.1, license-checker-rseidelsohn 4, W3C Nu HTML Checker (en línea), Mozilla HTTP Observatory (API v2), SSL Labs (API v3), curl 8.7.1, OpenSSL 4.0.3, dig |
| Evidencias            | `evidencias/` (≈ 17 MB): entorno, logs de build, cabeceras, JSON de Lighthouse y axe, matriz responsive, capturas y scripts                                                                                                                                                                        |

## 2. Resumen ejecutivo

**Hoy el portfolio no muestra proyectos.** La versión publicada (de hace un mes) pide los datos a una dirección de
la API que ya no existe: la página de proyectos aparece vacía, cada página registra errores y el botón de descarga
del CV no funciona. Nadie lo ha detectado porque no hay ninguna monitorización.

**El código nuevo, aún sin publicar ni guardar en el repositorio, resuelve gran parte de eso, pero no se puede
desplegar tal cual.** La nueva versión de la API no tiene proyectos cargados, y el proceso de construcción genera
la web «con éxito» aunque no encuentre ninguno. Desplegar ahora borraría las 34 páginas de proyectos de Google.
Además, el pipeline automático de despliegue está mal configurado y no puede ejecutarse.

**En seguridad y privacidad** la web publicada no envía ninguna de las cabeceras de protección habituales (nota C
en Mozilla Observatory), el HTTPS estricto está desactivado y la API devuelve enlaces a un dominio de pruebas de
ataques (`evil.example`), algo que conviene investigar cuanto antes. El banner de cookies da por aceptado el
consentimiento si el usuario sigue navegando, Google Analytics y reCAPTCHA se cargan antes de aceptar, y la
política de privacidad no incluye la información que exige el RGPD.

**Para buscadores, móviles y accesibilidad**, las páginas de proyecto no tienen contenido propio para Google (todas
parecen la misma página), casi todas las URLs del sitemap redirigen y cualquier dirección inexistente devuelve la
portada. En móvil, la portada se desplaza en horizontal y la ventana de un proyecto queda con su botón de cerrar
oculto bajo la cabecera. Con teclado no se puede abrir ningún proyecto.

**Lo positivo:** el código nuevo es limpio (0 errores de lint y de tipos, 45 tests en verde) y rápido en
escritorio (Lighthouse 96–100). En móvil pasa de ~50 a ~93 puntos de rendimiento frente a producción. No hay
secretos expuestos. La mayoría de los problemas tienen correcciones pequeñas: el [plan de remediación](plan-remediacion.md)
devuelve el sitio a un estado funcional en 1–2 días y lo lleva a un nivel excelente en unas 3 semanas.

## 3. Puntuación por área

Rúbrica del prompt: 10 = cumple todos los umbrales y sin hallazgos de severidad media o superior; 8–9 = sin altos ni
críticos y pocos medios; 6–7 = algún alto; 4–5 = varios altos o un crítico; < 4 = varios críticos.

| Área                 | Peso | Nota         | Justificación                                                                                                    |
| -------------------- | ---- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Seguridad            | 15   | 4            | Tres altos: sin cabeceras, HSTS desactivado y host `evil.example` en la API. Sin secretos ni XSS directos.       |
| Bugs / robustez      | 15   | 3            | Dos críticos: producción sin datos y build en verde sin proyectos.                                               |
| SEO                  | 15   | 4            | Proyectos sin contenido propio ni enlaces internos, soft-404 y sitemap con redirecciones.                        |
| Rendimiento          | 15   | 5            | Código: móvil 86–96 y escritorio 96–100. Producción: móvil 43–95, sin caché y con terceros en todas las páginas. |
| Responsive           | 10   | 5            | Home desbordada en todos los móviles y modal imposible de cerrar en móvil.                                       |
| Accesibilidad        | 10   | 4            | No cumple WCAG 2.2 nivel A: tarjetas sin teclado, modal y formulario inaccesibles, contraste.                    |
| Privacidad / legal   | 8    | 4            | Banner no conforme, terceros antes del consentimiento y política incompleta.                                     |
| UX / contenido       | 5    | 7            | Diseño coherente salvo el modal y el formulario; contenido con inconsistencias menores.                          |
| Dependencias         | 3    | 5            | pnpm frente a npm, 35 avisos de `npm audit` (exposición real baja).                                              |
| Calidad de código    | 2    | 7            | Puertas en verde; código muerto, fuentes de configuración duplicadas y tests escasos.                            |
| Infra / CI-CD        | 2    | 3            | Pipeline que no puede ejecutarse, configuraciones que no son las reales y sin monitorización.                    |
| **Global ponderada** | 100  | **4,3 / 10** |                                                                                                                  |

## 4. Métricas clave

| Métrica                                                           | Producción                           | Código actual (build local)                                                     | Objetivo                             |
| ----------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------ |
| Lighthouse móvil: Performance (mediana de 3, rango por plantilla) | 43–95 (home 57)                      | 86–96 (home 93)                                                                 | ≥ 95                                 |
| Lighthouse móvil: Accessibility / Best Practices / SEO            | 77–95 / 96 / 92–100                  | 90–96 / 96 / 100 (`/blog` 66 por `noindex` intencionado)                        | 100 / 100 / 100                      |
| Lighthouse escritorio: Performance                                | 82–100                               | 96–100                                                                          | ≥ 98                                 |
| LCP móvil (laboratorio)                                           | 1,7–9,1 s                            | 2,3–3,9 s                                                                       | ≤ 2,0 s                              |
| CLS (peor plantilla)                                              | 0,386 (`/about` escritorio)          | 0,14 (`/blog` móvil)                                                            | ≤ 0,05                               |
| TBT (aproximación a INP)                                          | 0–50 ms                              | 0–70 ms                                                                         | ≤ 200 ms                             |
| TTFB                                                              | 130–170 ms                           | —                                                                               | ≤ 600 ms                             |
| Peso de la home (móvil)                                           | 1.110 KB                             | 915 KB (564 KB de terceros)                                                     | ≤ 1 MB                               |
| Violaciones de axe (serious / moderate)                           | —                                    | 3 tipos / 2 tipos (color-contrast en todas las páginas)                         | 0                                    |
| Criterios WCAG 2.2 A/AA incumplidos                               | —                                    | 13 de 55 (8 A + 5 AA)                                                           | 0                                    |
| Mozilla HTTP Observatory                                          | **C (50/100)**                       | —                                                                               | ≥ A                                  |
| SSL Labs                                                          | **A-** (HSTS desactivado)            | —                                                                               | A+                                   |
| Vulnerabilidades (`npm audit`)                                    | —                                    | 1 crítica (dev), 27 altas, 5 moderadas, 2 bajas; 4 en dependencias de ejecución | 0 altas/críticas con exposición real |
| URLs del sitemap con 200 directo                                  | **1 de 42** (41 redirigen)           | 7 de 7 (sin proyectos)                                                          | 100 %                                |
| 404 real para URL inexistente                                     | **No** (200 con la home)             | Sí (con `serve`)                                                                | Sí                                   |
| Enlaces rotos                                                     | `blog.raupulus.dev` (DNS) y CV (410) | 0 (7 falsos positivos anti-bot)                                                 | 0                                    |
| Errores de consola por página                                     | 2–8 (CORS, `TypeError`, reCAPTCHA)   | 1 (reCAPTCHA) + 50 avisos de `srcset` en `/about`                               | 0                                    |
| Scroll horizontal a 320 px                                        | —                                    | Home (437 px)                                                                   | Ninguno                              |
| Lint / tipos / tests                                              | —                                    | 0 errores (38 avisos) / 0 / 45 de 45                                            | 0 / 0 / 100 %                        |

## 5. Cumplimiento de los umbrales de excelencia

| Umbral                                                                                               | Estado                                                              |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Lighthouse móvil ≥ 95 / 100 / 100 / 100                                                              | ❌ (código: 86–96 / 90–96 / 96 / 100)                               |
| Lighthouse escritorio ≥ 98 / 100 / 100 / 100                                                         | ❌ (código: 96–100 / 90–96 / 96 / 100)                              |
| LCP ≤ 2,0 s, INP ≤ 200 ms, CLS ≤ 0,05                                                                | ❌ LCP · ✅ INP (TBT de laboratorio) · ❌ CLS                       |
| TTFB ≤ 0,6 s / FCP ≤ 1,5 s                                                                           | ✅ / ❌ (2,3 s en el código)                                        |
| JS inicial ≤ 120 KB br / peso de la home ≤ 1 MB                                                      | ❌ (131 KB propios + 564 KB de terceros) / ✅ (915 KB)              |
| axe 0 violaciones / WCAG 2.2 AA                                                                      | ❌ / ❌                                                             |
| Observatory ≥ A / SSL Labs A+                                                                        | ❌ (C) / ❌ (A-)                                                    |
| 0 secretos / 0 vulnerabilidades altas o críticas con exposición real                                 | ✅ / ❌ (`@nuxt/devtools` en el equipo de desarrollo)               |
| 100 % del sitemap con 200 y canonical correcto                                                       | ❌                                                                  |
| 404 reales / 0 enlaces rotos / datos estructurados sin errores / sin títulos duplicados              | ❌ / ❌ (producción) / ⚠️ no validado / ❌ (34 páginas de proyecto) |
| 0 errores de consola / 0 peticiones fallidas / 0 hydration mismatch / sin scroll horizontal a 320 px | ❌ / ❌ / ✅ / ❌                                                   |
| Lint 0 errores / vue-tsc 0 errores / tests en verde                                                  | ✅ / ✅ / ✅                                                        |

## 6. Recuento de hallazgos

| Área                                                  | Crítica | Alta   | Media  | Baja   | Total  |
| ----------------------------------------------------- | ------- | ------ | ------ | ------ | ------ |
| [Seguridad](01-seguridad.md)                          | 0       | 3      | 4      | 3      | 10     |
| [Privacidad y legal](02-privacidad-legal.md)          | 0       | 4      | 2      | 1      | 7      |
| [Bugs y robustez](03-bugs-robustez.md)                | 2       | 2      | 5      | 4      | 13     |
| [SEO](04-seo.md)                                      | 0       | 3      | 4      | 4      | 11     |
| [Rendimiento](05-rendimiento.md)                      | 0       | 2      | 3      | 1      | 6      |
| [Responsive](06-responsive-compatibilidad.md)         | 0       | 2      | 4      | 2      | 8      |
| [UX/UI y contenido](07-ux-ui-contenido.md)            | 0       | 0      | 4      | 6      | 10     |
| [Accesibilidad](08-accesibilidad.md)                  | 0       | 4      | 2      | 3      | 9      |
| [Dependencias](09-dependencias.md)                    | 0       | 2      | 3      | 2      | 7      |
| [Calidad de código](10-calidad-codigo.md)             | 0       | 0      | 3      | 3      | 6      |
| [Infraestructura y CI/CD](11-infraestructura-cicd.md) | 0       | 3      | 3      | 0      | 6      |
| **Total**                                             | **2**   | **25** | **37** | **29** | **93** |

Además hay 9 recomendaciones para el backend en [recomendaciones-api.md](recomendaciones-api.md). Listado completo y
legible por máquina en [hallazgos.json](hallazgos.json). Estado de cada punto de la checklist en
[cobertura.md](cobertura.md) y resultados por ruta, viewport y motor en [matriz-pruebas.md](matriz-pruebas.md).

## 7. Top 10 de riesgos

| #   | ID                                | Riesgo                                                                                                  | Prioridad |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------- | --------- |
| 1   | BUG-001                           | Producción sin proyectos, con errores en todas las páginas y el CV roto (API v1 retirada).              | P0        |
| 2   | BUG-002                           | Un despliegue del código actual borraría las 34 páginas de proyectos sin que el build falle.            | P0        |
| 3   | INFRA-006                         | Toda la migración sin commitear y producción sin trazabilidad de versión.                               | P0        |
| 4   | SEC-003                           | La API sirve URLs en `evil.example`: posible _host header injection_ o caché envenenada.                | P0        |
| 5   | INFRA-001                         | Pipeline de CI inutilizable (`NODE_ENV=production` sin devDependencies) y verificación que nunca falla. | P0        |
| 6   | SEC-001 / SEC-002                 | Sin cabeceras de seguridad y con HSTS desactivado.                                                      | P1        |
| 7   | SEO-001 / SEO-004                 | Proyectos sin contenido indexable ni enlaces internos; soft-404 generalizado.                           | P1        |
| 8   | A11Y-002 / A11Y-003 / RESP-001    | Proyectos inaccesibles con teclado; en móvil, el modal no se puede cerrar.                              | P1        |
| 9   | LEGAL-001 / LEGAL-002 / LEGAL-003 | Consentimiento de cookies no válido y terceros antes del consentimiento.                                | P1        |
| 10  | BUG-004                           | El formulario de contacto no puede enviarse (CSRF entre subdominios).                                   | P1        |

## 8. Quick wins (alto impacto, esfuerzo XS/S)

1. Activar HSTS en Cloudflare (SEC-002).
2. Quitar el fallback SPA de `.htaccess` para tener 404 reales (SEO-004) y corregir el manifest (BUG-011).
3. Cabeceras de caché y de seguridad en Cloudflare (PERF-001, SEC-001).
4. `z-[60]` en el modal de proyecto (RESP-001) y título responsive en la home (RESP-002).
5. Banner de cookies con «Rechazar» y texto propio (LEGAL-001); Consent Mode correcto (LEGAL-003).
6. reCAPTCHA solo en `/contact` (LEGAL-002, PERF-002, BUG-010): −390 KB y −380 ms de hilo principal por página.
7. Colores del footer y de `/blog` con contraste suficiente (A11Y-001).
8. Corregir `sizes` de la galería (BUG-008): 50 errores de HTML y 100 avisos de consola menos.
9. Enlace `mailto:` al correo público y formulario deshabilitado mientras no funcione (CONT-004, UX-002).
10. DNS de `www.raupulus.dev` (INFRA-004).

## 9. Alcance, metodología y limitaciones

**Alcance.** Código del árbol de trabajo (rama `dev` con cambios sin commitear), dos builds locales y producción en
modo pasivo, siguiendo la metodología de triple contraste del prompt: código, build y ejecución. Muestra manual
profunda: home, `/projects`, el proyecto `weather-station-raspberry-pi` (deep link y su página `informacion`), un
proyecto inexistente, `/about`, `/webs`, `/social`, `/contact`, `/privacy`, `/blog` y una URL inexistente. Las pruebas
automáticas cubrieron las 10 rutas en 15 viewports y 2 motores (300 cargas), axe en 21 combinaciones de ruta y
estado, y Lighthouse en 9 plantillas de producción y 8 locales (74 ejecuciones).

**Restricciones respetadas.** No se ha modificado código ni configuración (solo `docs/auditorias/`). No se ha enviado
el formulario de contacto ni ninguna cabecera manipulada a producción. Las peticiones a producción y a la API han
sido de bajo volumen. Los secretos encontrados en `.env` no se han transcrito.

**Limitaciones y no verificado.**

- **El árbol de trabajo cambió durante la auditoría.** A las 19:17 se modificaron `components/card/ProjectVertical.vue`
  y `ProjectHorizontal.vue` (tratamiento de imágenes; siguen siendo `<div @click>`), y a las 19:19 `AGENTS.md`,
  `README.md` y 10 archivos de `docs/info/` (actualización a la API v2). Las pruebas en navegador se hicieron sobre
  builds generados a las 18:50–18:58, y los hallazgos de documentación reflejan el estado de las 19:20.
- **Firefox:** Playwright Firefox 155 no arranca en macOS 27; solo se probaron Chromium y WebKit.
- **Sin dispositivos reales** (iOS Safari, Android) ni lector de pantalla real.
- **Sin datos de campo** (CrUX: cuota de PageSpeed agotada) ni acceso a Search Console, Cloudflare o el servidor.
- **Sin búsqueda web** (`site:` y SERP de marca no comprobados).
- **El build equivalente a producción no tiene proyectos** (la API v2 está vacía); el rendimiento de las páginas de
  proyecto se midió solo en producción.
- **gitleaks y trufflehog no estaban instalados**; el escaneo de secretos se hizo con `git log -p` y patrones.

## 10. Contraste con los indicios preliminares

| #   | Indicio                                                         | Resultado                                                                                                             |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | Manifest con iconos inexistentes y colores blancos              | ✅ Confirmado → BUG-011                                                                                               |
| 2   | `og:image` relativa y `twitter:card` contradictoria             | ✅ Confirmado → SEO-005 (unhead deduplica: no hay etiquetas duplicadas)                                               |
| 3   | Consent Mode concede señales `ad_*` y no gestiona la revocación | ✅ Confirmado → LEGAL-003                                                                                             |
| 4   | reCAPTCHA global sin consentimiento                             | ✅ Confirmado → LEGAL-002, PERF-002                                                                                   |
| 5   | Datos de plataforma y proyectos solo en cliente                 | ✅ Confirmado → SEO-001, PERF-006                                                                                     |
| 6   | `lastmod` = fecha del build                                     | ✅ Confirmado → SEO-006                                                                                               |
| 7   | `og:locale:alternate` sin versión inglesa                       | ✅ Confirmado → SEO-011                                                                                               |
| 8   | `.htaccess`: soft-404 y `ExpiresDefault`                        | ✅ Soft-404 confirmado → SEO-004. `mod_expires` **no** se aplica en producción (no hay caché alguna → PERF-001)       |
| 9   | CSP con `unsafe-*` y sin `frame-src` para embeds                | 🔁 Reformulado: en producción **no hay CSP** → SEC-001; embeds → SEC-004                                              |
| 10  | Sanitizador con `style`/`id` e iframes libres                   | ✅ Confirmado con PoC → SEC-005, SEC-004                                                                              |
| 11  | `ServerAdmin` con correo personal en repo público               | ✅ Confirmado → SEC-008 (y SEC-007: correo en commits)                                                                |
| 12  | Clave privada del captcha en `runtimeConfig`                    | ✅ Confirmado (no se filtra al build) → SEC-009                                                                       |
| 13  | `apiPost` lee la cookie antes de pedirla                        | 🔁 `apiClient.ts` es código muerto (CODE-002); el flujo activo falla por otra causa: cookie de otro dominio → BUG-004 |
| 14  | (ver 8)                                                         | —                                                                                                                     |
| 15  | Build en verde sin proyectos si la API falla                    | ✅ Confirmado (ocurre hoy) → BUG-002                                                                                  |
| 16  | Preflight CORS innecesario en `apiGet`                          | ❌ Descartado: `apiGet` no se usa; los composables usan `$fetch` sin `Content-Type`                                   |
| 17  | `HeaderImage.vue` muerto con assets inexistentes                | ✅ Confirmado → CODE-002                                                                                              |
| 18  | GIF sin dimensiones en el modal de envío                        | ✅ Confirmado → PERF-005, A11Y-007                                                                                    |
| 19  | `100vh` en iOS                                                  | ⚠️ Probable (sin dispositivo real) → RESP-005                                                                         |
| 20  | Scroll suave sin `prefers-reduced-motion`                       | ✅ Confirmado → A11Y-007                                                                                              |
| 21  | Restos de pnpm                                                  | ✅ Confirmado y agravado: `node_modules` local instalado con pnpm → DEP-001                                           |
| 22  | GoCD: verificación que no falla, sin artefacto, sin etapas      | ✅ Confirmado y agravado: `NODE_ENV=production` impide instalar las devDependencies → INFRA-001                       |
| 23  | Documentación con API v1 frente a código con v2                 | ✅ Resuelto durante la auditoría (19:19); quedan desfases menores → CODE-005                                          |
| 24  | Node sin fijar                                                  | ✅ Confirmado → DEP-005                                                                                               |

**Hallazgos relevantes que no estaban entre los indicios:** BUG-001 (producción sin datos), SEC-003 (`evil.example`),
SEC-002 (HSTS `max-age=0`), SEC-001 (producción sin cabeceras), RESP-001 (modal tapado por el header), RESP-002
(desbordamiento de la home), A11Y-002 (tarjetas sin teclado), A11Y-001 (contraste), BUG-003 (historial del modal),
BUG-006 (`BlockCode`), CODE-001 (fuentes de configuración duplicadas) e INFRA-004 (`www` sin DNS).

## 11. Verificado y correcto (resumen)

Sin secretos en el repo, el historial ni el build · TLS 1.2/1.3 con certificado válido y DNSSEC · CORS de la API
restringido · sanitización eficaz contra scripts y manejadores · sin errores de hidratación · lint, tipos y tests en
verde · escritorio rápido · fuentes self-hosted · galería de `/about` accesible · HTML de la home válido · licencias
compatibles · `noindex` correcto en `/blog` y en la página de error. Detalle en la sección «Verificado y correcto» de
cada informe.
