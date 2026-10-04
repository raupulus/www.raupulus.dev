# 6.5 Rendimiento y Core Web Vitals (PERF) — Auditoría externa deepsek-externo

Resumen: producción es **muy lenta en móvil** (LCP 7,7–8,6 s, FCP ~7,8 s) por la latencia de respuesta
(TTFB alto con Cloudflare en modo dinámico), muy por encima del objetivo. El JS inicial ronda los ~155 KB
gzip (presupuesto 120 KB), con un chunk de ~128 KB que corresponde a reCAPTCHA y se carga en **todas** las
páginas. La caché de HTML (`ExpiresDefault` 1 mes) arriesga chunks obsoletos tras un despliegue. El build
local es razonable (LCP móvil 2,7 s home).

> Nota metodológica: se ejecutó Lighthouse **1 vez** por URL y estrategia (móvil/escritorio) sobre producción
> y build local, en lugar de 3 veces con mediana, por el tiempo disponible. Los valores son indicativos; los
> de producción incluyen la latencia de red de la ubicación de la auditoría. JSON en `evidencias/lighthouse/`.

| ID       | Título                                                            | Sev.  | Prior. | Esf. |
| -------- | ----------------------------------------------------------------- | ----- | ------ | ---- |
| PERF-001 | JS inicial ~155 KB gzip > presupuesto 120 KB (chunk de 128 KB)    | Alta  | P1     | M    |
| PERF-002 | reCAPTCHA (~128 KB) cargado en todas las páginas                  | Alta  | P1     | M    |
| PERF-003 | Producción móvil: LCP 7,7–8,6 s (TTFB/latencia de origen)         | Alta  | P0     | M    |
| PERF-004 | `.htaccess` cachea HTML 1 mes → riesgo de chunks obsoletos        | Alta  | P1     | S    |
| PERF-005 | 10 ficheros de fuente (2 familias × 5 pesos)                      | Media | P2     | S    |
| PERF-006 | `MaterialIcon` con `import.meta.glob` eager (45 SVG en el bundle) | Baja  | P3     | S    |
| PERF-007 | GET con `Content-Type: application/json` → preflight innecesario  | Media | P2     | XS   |
| PERF-008 | Imágenes sin `width`/`height` (unsized-images) y CLS asociado     | Media | P2     | S    |

## Métricas Lighthouse (1 ejecución)

| Plantilla / estrategia | Perf | A11y | BP  | SEO | LCP (ms) | FCP (ms) | TBT (ms) | CLS   |
| ---------------------- | ---- | ---- | --- | --- | -------- | -------- | -------- | ----- |
| prod-home-mobile       | 57   | 92   | 96  | 100 | 8432     | 7853     | 12       | 0.057 |
| prod-home-desktop      | 99   | 92   | 96  | 100 | 795      | 628      | 0        | 0.039 |
| prod-projects-mobile   | 58   | 80   | 96  | 92  | 7778     | 7778     | 0        | 0.050 |
| prod-projects-desktop  | 100  | 86   | 96  | 92  | 687      | 624      | 0        | 0.002 |
| prod-project-mobile    | 89   | 80   | 96  | 92  | 3063     | 2726     | 35       | 0.050 |
| prod-project-desktop   | 100  | 80   | 96  | 92  | 689      | 626      | 0        | 0.002 |
| prod-about-mobile      | 58   | 77   | 96  | 92  | 8145     | 7897     | 0        | 0.000 |
| prod-about-desktop     | 83   | 84   | 96  | 92  | 584      | 574      | 0        | 0.341 |
| prod-contact-mobile    | 53   | 88   | 96  | 100 | 8627     | 7800     | 0        | 0.127 |
| prod-contact-desktop   | 100  | 91   | 96  | 100 | 594      | 594      | 0        | 0.026 |
| prod-blog-mobile       | 47   | 89   | 96  | 100 | 7731     | 7731     | 0        | 0.225 |
| prod-blog-desktop      | 100  | 92   | 96  | 100 | 679      | 612      | 0        | 0.011 |
| local-home-mobile      | 93   | 96   | 100 | 100 | 2709     | 2409     | 57       | 0.001 |
| local-home-desktop     | 100  | 96   | 100 | 100 | 634      | 552      | 0        | 0.001 |
| local-contact-mobile   | 86   | 91   | 100 | 100 | 3912     | 2256     | 45       | 0.000 |
| local-contact-desktop  | 100  | 91   | 100 | 100 | 732      | 507      | 0        | 0.003 |

Observaciones: los valores móviles de producción son homogéneos (~7,8 s FCP) en **todas** las plantillas, lo
que apunta a latencia de respuesta del documento (TTFB), no a un problema de cada página. El build local
(sin CDN) da LCP muy inferior. No hay datos de campo CrUX disponibles para el origen en el momento del informe
(`⚠️ no verificado`).

---

### PERF-001 — JS inicial ~155 KB gzip > presupuesto 120 KB

| Campo       | Valor                                                           |
| ----------- | --------------------------------------------------------------- |
| Severidad   | Alta                                                            |
| Prioridad   | P1                                                              |
| Confianza   | Verificado                                                      |
| Esfuerzo    | M                                                               |
| Ámbito      | Ambos                                                           |
| Ubicación   | `.output/public/index.html`, `.output/public/_nuxt/MS9LlKKP.js` |
| Referencias | web.dev (JavaScript), Core Web Vitals                           |
| Relacionado | PERF-002                                                        |

**Descripción.** Sumando los `.js` referenciados en `index.html` (gzip), el JS inicial es de ~154,6 KB, por
encima del presupuesto orientativo de 120 KB. Un único chunk (`MS9LlKKP.js`) pesa 128 KB gzip.

**Evidencia.**

```
$ for u in $(grep -oE '/_nuxt/[A-Za-z0-9_.-]+\.js' .output/public/index.html | sort -u); do
    gzip -c ".output/public$u" | wc -c; done
   5314 /_nuxt/B0xvHFnu.js
   3590 /_nuxt/BpW0u3gR.js
    114 /_nuxt/DlAUqK2U.js
 128138 /_nuxt/MS9LlKKP.js      <-- vue-recaptcha-v3 + deps
   6892 /_nuxt/R-5r4ysv.js
   5729 /_nuxt/ZPCAEugz.js
   4840 /_nuxt/_RzPpSny.js
TOTAL gzip: 154617 bytes
```

Lighthouse marca `unused-javascript` (score 0) en todas las páginas.

**Recomendación.** Diferir reCAPTCHA (PERF-002) y cargar el resto de dependencias pesadas de forma
dinámica por ruta. Revisar si `isomorphic-dompurify` arrastra `jsdom` (aparece la marca `jsdom` en el chunk).
Medir con `npx nuxi analyze` y fijar un presupuesto en CI.

**Verificación de la corrección.** JS inicial gzip ≤ 120 KB; `unused-javascript` mejora; `nuxi analyze`
sin dependencias de cliente no usadas.

---

### PERF-002 — reCAPTCHA cargado en todas las páginas

| Campo       | Valor                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| Severidad   | Alta                                                                     |
| Prioridad   | P1                                                                       |
| Confianza   | Verificado                                                               |
| Esfuerzo    | M                                                                        |
| Ámbito      | Código / producción                                                      |
| Ubicación   | `plugins/google-recaptcha.ts`, `nuxt.config.ts:125`, chunk `MS9LlKKP.js` |
| Relacionado | PERF-001, LEGAL-004                                                      |

**Descripción.** `vue-recaptcha-v3` es un plugin global y su chunk (128 KB gzip) está en el camino crítico de
todas las rutas, además de cargar el script de Google. Solo es necesario en `/contact`.

**Recomendación.** Convertir el plugin en client-only y cargarlo con `import()` dentro de `pages/contact.vue`
(no en el `app`). Comprobar que home/about/projects no descargan ni el chunk ni el script de Google.

**Verificación de la corrección.** En home, el chunk de reCAPTCHA no aparece en la pestaña de red; solo en /contact.

---

### PERF-003 — Producción móvil con LCP ~8 s (latencia de respuesta)

| Campo       | Valor                                   |
| ----------- | --------------------------------------- |
| Severidad   | Alta                                    |
| Prioridad   | P0                                      |
| Confianza   | Verificado (Lighthouse)                 |
| Esfuerzo    | M                                       |
| Ámbito      | Producción                              |
| Ubicación   | https://raupulus.dev/ (todas las rutas) |
| Referencias | web.dev (LCP, TTFB), Cloudflare         |
| Relacionado | PERF-004, INFRA-001                     |

**Descripción.** Tanto FCP como LCP móviles rondan 7,7–8,6 s de forma uniforme en todas las plantillas, con
`document-latency-insight` y `cache-insight` a 0. El patrón apunta a TTFB alto por latencia de origen/CDN,
no a render.

**Evidencia.** Ver tabla superior; `cf-cache-status: DYNAMIC` en las cabeceras de HTML.

**Recomendación.** Servir el HTML con caché en el borde (Cloudflare) con revalidación, optimizar el TTFB del
origen y habilitar compresión brotli además de gzip. Medir TTFB con `curl -w "%{time_starttransfer}"` antes y
después.

**Verificación de la corrección.** PSI/CrUX con LCP móvil p75 ≤ 2,0 s; TTFB ≤ 0,6 s.

---

### PERF-004 — `.htaccess` cachea HTML 1 mes

| Campo       | Valor                                                             |
| ----------- | ----------------------------------------------------------------- |
| Severidad   | Alta                                                              |
| Prioridad   | P1                                                                |
| Confianza   | Verificado                                                        |
| Esfuerzo    | S                                                                 |
| Ámbito      | Producción / código                                               |
| Ubicación   | `public/.htaccess:15-32` (`ExpiresDefault "access plus 1 month"`) |
| Referencias | Nuxt deploy, web.dev (caché)                                      |
| Relacionado | INFRA-005                                                         |

**Descripción.** `ExpiresDefault` aplica 1 mes también al **HTML**. Tras un redespliegue, un navegador con
HTML en caché pedirá chunks `/_nuxt/*.js` con hash antiguo que ya no existen → «Failed to fetch dynamically
imported module». Además no hay `immutable` para `/_nuxt/` en `.htaccess` (sí en `apache.conf`).

**Recomendación.** HTML con caché corta/revalidación (`Cache-Control: no-cache` o `max-age` bajo +
`ETag`); `/_nuxt/` y `/_fonts/` con `max-age=31536000, immutable`. Asegurar despliegue atómico.

**Verificación de la corrección.** `Cache-Control` del HTML ≠ 1 mes; `/_nuxt/x.js` con `immutable`.

---

### PERF-005 — 10 ficheros de fuente

| Campo     | Valor                    |
| --------- | ------------------------ |
| Severidad | Media                    |
| Prioridad | P2                       |
| Confianza | Verificado               |
| Esfuerzo  | S                        |
| Ámbito    | Código                   |
| Ubicación | `nuxt.config.ts:128-133` |

**Descripción.** Se descargan dos familias (`Space Grotesk`, `Plus Jakarta Sans`) × 5 pesos (300–700) = hasta
10 ficheros. Es posible que no todos los pesos se usen realmente; además falta estrategia de subconjunto
explícita y `size-adjust` para el fallback (CLS de fuentes).

**Recomendación.** Reducir a los pesos realmente usados, usar subconjuntos (latin/latin-ext) y métricas de
fallback (`@nuxt/fonts` soporta `fallbacks`). Preload solo de las fuentes críticas.

**Verificación de la corrección.** Nº de ficheros de fuente reducido; `font-display`/preload sin penalizar CWV.

---

### PERF-006 — `MaterialIcon` con glob eager

| Campo     | Valor                                  |
| --------- | -------------------------------------- |
| Severidad | Baja                                   |
| Prioridad | P3                                     |
| Confianza | Verificado                             |
| Esfuerzo  | S                                      |
| Ámbito    | Código                                 |
| Ubicación | `components/ui/MaterialIcon.vue:14-18` |

**Descripción.** `import.meta.glob(..., { eager: true })` inyecta los 45 SVG de `assets/icons/material`
(≈20 KB) en el JS de todas las páginas, aunque cada página use pocos.

**Recomendación.** Cargar los SVG bajo demanda (`import.meta.glob` sin `eager` + `await`) o generar un mapa
estático por icono usado.

**Verificación de la corrección.** El JS no contiene los 45 SVG; solo los usados por la ruta.

---

### PERF-007 — GET con `Content-Type: application/json`

| Campo       | Valor                      |
| ----------- | -------------------------- |
| Severidad   | Media                      |
| Prioridad   | P2                         |
| Confianza   | Verificado                 |
| Esfuerzo    | XS                         |
| Ámbito      | Código                     |
| Ubicación   | `utils/apiClient.ts:20-27` |
| Referencias | MDN CORS                   |

**Descripción.** `apiGet` envía `Content-Type: application/json` en un GET. Al ser una cabecera no simple,
dispara un preflight `OPTIONS` innecesario contra la API cross-origin.

**Recomendación.** En GET no enviar `Content-Type` (basta `Accept`), salvo que el servidor lo exija.

**Verificación de la corrección.** Sin petición `OPTIONS` previa en los GET a la API.

---

### PERF-008 — Imágenes sin dimensiones y CLS

| Campo       | Valor                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Severidad   | Media                                                                      |
| Prioridad   | P2                                                                         |
| Confianza   | Verificado (Lighthouse)                                                    |
| Esfuerzo    | S                                                                          |
| Ámbito      | Ambos                                                                      |
| Ubicación   | `unsized-images` en Lighthouse; `components/card/*`, `BlockImage.vue:7-13` |
| Relacionado | BUG-011                                                                    |

**Descripción.** Lighthouse detecta imágenes sin `width`/`height` explícitos (score 0,5). El CLS es bajo en
general, pero `prod-about-desktop` llega a **0,341** (contenido/galería) y `prod-contact-mobile` 0,127.

**Recomendación.** Añadir `width`/`height` o `aspect-ratio` a todas las imágenes (incluidas las de la API en
tarjetas y bloques) y revisar el culpable de CLS en `/about` (galería/reCAPTCHA).

**Verificación de la corrección.** `unsized-images` a 1; CLS ≤ 0,05 en todas las plantillas.

---

## Verificado y correcto

- Build estático con imágenes IPX pre-generadas: `/_ipx/...` devuelve 200 en producción (no sirve originales sin optimizar).
- Formato WebP en tecnologías e imágenes de bloques; `loading="lazy"` en la mayoría de imágenes.
- HTML y assets se sirven con HTTP/2 y HTTP/3 (`alt-svc h3`); compresión negociada (`vary: Accept-Encoding`).
- El HTML del build local es pequeño (`index.html` 44 KB, `_payload.json` raíz 69 B).
- Sin `sourceMappingURL` ni `.map` publicados.
- El CLS del build actual en home es ~0,001.
