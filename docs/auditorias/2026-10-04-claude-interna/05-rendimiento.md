# 05 · Rendimiento y Core Web Vitals

> Lighthouse 12.8.2 (Chrome local en modo headless, throttling simulado de Lighthouse: móvil «Moto G Power / 4G
> lenta», escritorio por defecto). **3 ejecuciones por URL y estrategia** en las 5 plantillas principales (1 en las
> secundarias); se toma la **mediana** de Performance. «Producción» = `https://raupulus.dev` (build del 2026-09-11);
> «Código» = build A del árbol de trabajo, servido en local con `serve` (sin las cabeceras ni la caché de producción y
> sin proyectos, porque la API v2 está vacía). JSON de las medianas en `evidencias/lighthouse/` (sin capturas, para
> reducir tamaño). **No hay datos de campo (CrUX):** la API de PageSpeed Insights devolvió `429 Quota exceeded`.

## Resultados

### Móvil

| Plantilla   | Perf. prod. | Perf. código | LCP prod. | LCP código | FCP prod. | FCP código | CLS prod. | CLS código | TBT código | A11y código | BP código | SEO código |
| ----------- | ----------- | ------------ | --------- | ---------- | --------- | ---------- | --------- | ---------- | ---------- | ----------- | --------- | ---------- |
| `/`         | 57          | 93           | 9,1 s     | 2,7 s      | 7,9 s     | 2,4 s      | 0,057     | 0,001      | 40 ms      | 96          | 96        | 100        |
| `/projects` | 83          | 93           | 4,1 s     | 2,6 s      | 2,6 s     | 2,6 s      | 0,024     | 0,005      | 50 ms      | 93          | 96        | 100        |
| `/about`    | 43          | 94           | 8,3 s     | 2,6 s      | 7,7 s     | 2,3 s      | 0,288     | 0,046      | 40 ms      | 94          | 96        | 100        |
| `/contact`  | 53          | 86           | 8,8 s     | 3,9 s      | 7,6 s     | 2,3 s      | 0,127     | 0          | 50 ms      | 90          | 96        | 100        |
| `/social`   | 49          | 94           | 8,1 s     | 2,6 s      | 7,6 s     | 2,3 s      | 0,191     | 0          | 50 ms      | 94          | 96        | 100        |
| `/webs`     | 44          | 95           | 7,6 s     | 2,4 s      | 7,6 s     | 2,3 s      | 0,285     | 0,018      | 50 ms      | 96          | 96        | 100        |
| `/privacy`  | 95          | 96           | 1,7 s     | 2,3 s      | 1,7 s     | 2,3 s      | 0,122     | 0,019      | 40 ms      | 96          | 96        | 100        |
| `/blog`     | 78          | 89           | 3,7 s     | 2,6 s      | 1,7 s     | 2,3 s      | 0,217     | 0,14       | 70 ms      | 95          | 96        | 66¹        |
| proyecto    | 58          | — ²          | 8,2 s     | —          | 7,7 s     | —          | 0,05      | —          | —          | —           | —         | —          |

### Escritorio

| Plantilla                    | Perf. prod. | Perf. código | LCP código | CLS prod.   | CLS código  |
| ---------------------------- | ----------- | ------------ | ---------- | ----------- | ----------- |
| `/`                          | 100         | 100          | 0,6 s      | 0,039       | 0,001       |
| `/projects`                  | 99          | 100          | 0,6 s      | 0,003       | 0,002       |
| `/about`                     | 82          | 96           | 0,7 s      | **0,386**   | **0,122**   |
| `/contact`                   | 99          | 100          | 0,8 s      | 0,027       | 0,003       |
| `/social`                    | 99          | 100          | 0,6 s      | 0,044       | 0           |
| `/webs`, `/privacy`, `/blog` | 99          | 100          | 0,5 s      | 0,011–0,052 | 0,001–0,003 |

¹ `/blog` tiene `noindex` a propósito (auditoría `is-crawlable`): no es un defecto.
² El build A no tiene proyectos (API v2 vacía, BUG-002).

**Lectura.** En escritorio todo está por encima de 95, salvo el CLS de `/about`. En móvil, el código actual mejora
mucho a producción (Performance mediana de ~50 a ~93), pero **no alcanza los umbrales de excelencia**: Performance
86–96 (objetivo ≥ 95) y LCP 2,3–3,9 s (objetivo ≤ 2,0 s; umbral «bueno» 2,5 s). Best Practices se queda en 96 en todas
las páginas por los errores de consola de reCAPTCHA (BUG-010). Además, la medición local subestima el coste real de
producción, que hoy no tiene caché de navegador (PERF-001).

| ID       | Título                                                                                        | Severidad | Prioridad | Esfuerzo |
| -------- | --------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| PERF-001 | Producción sin política de caché (`Cache-Control`) en HTML, JS, CSS, fuentes ni imágenes      | Alta      | P1        | XS       |
| PERF-002 | reCAPTCHA y Google Tag Manager en todas las páginas: 526 KB de 915 KB y 300 KB de JS sin usar | Alta      | P1        | S        |
| PERF-003 | LCP móvil de 2,3–3,9 s por CSS bloqueante y fuentes sin precarga                              | Media     | P2        | S        |
| PERF-004 | Desplazamientos de layout por el cambio de fuente (CLS 0,122 en `/about` y 0,14 en `/blog`)   | Media     | P2        | S        |
| PERF-005 | Imágenes pesadas o sin optimizar (GIF de 289 KB, `og` de 332 KB, galería sin `srcset` válido) | Media     | P2        | S        |
| PERF-006 | La lógica de datos en cliente añade una cascada de peticiones tras la hidratación             | Baja      | P3        | M        |

---

### PERF-001 — Producción sin política de caché

| Campo                   | Valor                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                  |
| Prioridad               | P1                                                                                                    |
| Confianza               | Verificado                                                                                            |
| Esfuerzo                | XS                                                                                                    |
| Ámbito                  | Producción                                                                                            |
| Ubicación               | Respuestas de `https://raupulus.dev/*`; `apache.conf:78-80` y `public/.htaccess:15-33` (no aplicados) |
| Dispositivo / navegador | Todos (visitas repetidas y navegación entre páginas)                                                  |
| Referencias             | web.dev «Serve static assets with an efficient cache policy»; Lighthouse `uses-long-cache-ttl`        |
| Relacionado con         | INFRA-002, INFRA-003                                                                                  |

**Descripción.** Ninguna respuesta lleva `Cache-Control` ni `Expires` (`evidencias/cabeceras/produccion-rutas.txt`):
ni el HTML ni los chunks con hash de `/_nuxt/`, que deberían ser `immutable`. Lighthouse marca 14–44 recursos por
página en producción. El navegador aplica caché heurística (10 % de la antigüedad de `last-modified`), con lo que
puede reutilizar HTML antiguo varios días tras un despliegue, o revalidar cada recurso con una petición.

**Recomendación.**

```text
/_nuxt/*, /_fonts/*, /_ipx/*        Cache-Control: public, max-age=31536000, immutable
/*.html y rutas sin extensión       Cache-Control: public, max-age=0, must-revalidate   (+ caché en el edge de Cloudflare con purga al desplegar)
/images/*, /social/*, /favicons/*   Cache-Control: public, max-age=604800
```

Aplicarlo en Cloudflare (Cache Rules + Browser Cache TTL) o activando `mod_headers`/`mod_expires` en Apache
(INFRA-002).

**Verificación de la corrección.** `curl -sSI https://raupulus.dev/_nuxt/<chunk>.js | grep -i cache-control` →
`immutable`; Lighthouse sin `uses-long-cache-ttl` para recursos propios.

---

### PERF-002 — reCAPTCHA y Google Tag Manager en todas las páginas

| Campo                   | Valor                                                                             |
| ----------------------- | --------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                              |
| Prioridad               | P1                                                                                |
| Confianza               | Verificado                                                                        |
| Esfuerzo                | S                                                                                 |
| Ámbito                  | Ambos                                                                             |
| Ubicación               | `plugins/google-recaptcha.ts`, `nuxt.config.ts:219-231` (`gtag.initMode: 'auto'`) |
| Dispositivo / navegador | Móvil sobre todo                                                                  |
| Referencias             | web.dev «Reduce the impact of third-party code»                                   |
| Relacionado con         | LEGAL-002, DEP-004, BUG-010                                                       |

**Descripción.** En la home (código, móvil), de 915 KB transferidos:

| Origen                                          | Transferido | JS sin usar      | Hilo principal |
| ----------------------------------------------- | ----------- | ---------------- | -------------- |
| reCAPTCHA (`www.gstatic.com` + `recaptcha.net`) | 390 KB      | 184 KB de 352 KB | 380 ms         |
| Google Tag Manager (`gtag/js`)                  | 174 KB      | 73 KB            | 139 ms         |
| Fuente Roboto de Google (la carga reCAPTCHA)    | 34 KB       | —                | —              |
| `entry.js` propio                               | 127 KB      | 57 KB            | —              |

Es decir, **~60 % del peso y la mayor parte del JavaScript sin usar son de terceros**, en páginas que no tienen
formulario. En producción ocurre lo mismo con reCAPTCHA («Google CDN 387 KB»), además del beacon de Cloudflare.

**Recomendación.** Cargar reCAPTCHA (o Turnstile) solo en `/contact` y al interactuar con el formulario (LEGAL-002);
cargar `gtag` solo tras el consentimiento (`initMode: 'manual'`), lo que además lo saca de la ruta crítica de quien
no acepta.

**Verificación de la corrección.** Lighthouse móvil de `/`: transferencia < 400 KB, sin `unused-javascript` de
terceros y sin peticiones a `gstatic`/`recaptcha` fuera de `/contact`.

---

### PERF-003 — LCP móvil de 2,3–3,9 s

| Campo                   | Valor                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                         |
| Prioridad               | P2                                                                                                            |
| Confianza               | Verificado (laboratorio)                                                                                      |
| Esfuerzo                | S                                                                                                             |
| Ámbito                  | Código                                                                                                        |
| Ubicación               | CSS enlazado (`/_nuxt/entry.*.css`, 81 KB sin comprimir / 11 KB br), `nuxt.config.ts:128-133` (`@nuxt/fonts`) |
| Dispositivo / navegador | Móvil                                                                                                         |
| Referencias             | web.dev «Optimize LCP»                                                                                        |
| Relacionado con         | PERF-002, PERF-004                                                                                            |

**Descripción.** El elemento LCP es siempre **texto** (el `<p>` introductorio o el `h1`): no depende de imágenes, sino
del CSS y de las fuentes. Lighthouse estima entre 300 y 450 ms de bloqueo por tres hojas de estilo
(`entry.css` 11 KB br, `Twitch.css` y `MaterialIcon.css`, que se cargan en todas las páginas). No hay `preload` de
las dos fuentes críticas (Space Grotesk 700 y Plus Jakarta Sans 400). En `/contact`, el LCP de 3,9 s coincide con
la carga de reCAPTCHA.

**Recomendación.** Mantener `features.inlineStyles` para el CSS crítico de los componentes (Nuxt 4) y revisar qué
añade el CSS global y el de los iconos al `entry`; precargar las dos fuentes del primer render (`@nuxt/fonts`
admite `preload`); reducir pesos (300 y 600 apenas se usan) y eliminar reCAPTCHA de la ruta crítica (PERF-002).

**Verificación de la corrección.** LCP móvil ≤ 2,0 s (mediana de 3 ejecuciones) en las 5 plantillas principales.

---

### PERF-004 — Desplazamientos de layout por el cambio de fuente

| Campo                   | Valor                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                              |
| Prioridad               | P2                                                                                                                                                 |
| Confianza               | Verificado (Lighthouse `layout-shifts`)                                                                                                            |
| Esfuerzo                | S                                                                                                                                                  |
| Ámbito                  | Ambos                                                                                                                                              |
| Ubicación               | `pages/about.vue:107-109` (`h1` con `<span class="font-light">`), `pages/blog.vue:18`; en producción `.box-about-information` y `#app-box-content` |
| Dispositivo / navegador | Escritorio (`/about`) y móvil (`/blog`)                                                                                                            |
| Referencias             | web.dev «Optimize CLS» (fuentes web)                                                                                                               |
| Relacionado con         | RESP-006                                                                                                                                           |

**Descripción.** Código: CLS 0,122 en `/about` (escritorio). El elemento que se desplaza es el `<span class="font-light">`
del `h1` «Sobre Mí» al sustituir la fuente de respaldo por Space Grotesk 300. En `/blog` (móvil, 0,14) se desplaza la
sección principal. Producción: hasta 0,386 en `/about` y 0,285 en `/webs`.

**Recomendación.** Comprobar que `@nuxt/fonts` genera métricas de fallback (`size-adjust`, `ascent-override`) para
**cada** peso usado en titulares (incluido el 300) o fijar `font-display: optional` en los titulares; reservar la
altura de los bloques que dependen de datos (RESP-006).

**Verificación de la corrección.** CLS ≤ 0,05 en todas las plantillas (objetivo de excelencia).

---

### PERF-005 — Imágenes pesadas o sin optimizar

| Campo                   | Valor                                                                                                                                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                                                                                                                        |
| Prioridad               | P2                                                                                                                                                                                                                                           |
| Confianza               | Verificado                                                                                                                                                                                                                                   |
| Esfuerzo                | S                                                                                                                                                                                                                                            |
| Ámbito                  | Ambos                                                                                                                                                                                                                                        |
| Ubicación               | `assets/images/gifs/pc-load.gif` (154 KB), `assets/images/gifs/email-send.gif` (135 KB), `public/social/projects.webp` (332 KB, 512×512), `public/images/pages/about/` (9,7 MB en el build), `pages/about.vue:246` (fondo CSS sin optimizar) |
| Dispositivo / navegador | Todos                                                                                                                                                                                                                                        |
| Referencias             | web.dev «Use video formats for animated content», «Serve responsive images»                                                                                                                                                                  |
| Relacionado con         | BUG-008, SEO-005                                                                                                                                                                                                                             |

**Descripción.**

- Los dos GIF del modal de envío suman 289 KB (se descargan al abrir el modal).
- `social/projects.webp` pesa 332 KB para 512×512 (el resto de imágenes sociales pesan 32 KB).
- La galería de `/about` publica 50 imágenes de 1280 px (9,7 MB en total, se cargan bajo demanda) y las miniaturas
  no tienen `srcset` válido (BUG-008). En móviles de alta densidad se muestran miniaturas de 250 px en huecos de
  ~195 CSS px (×3 DPR).
- El fondo de «Entorno de trabajo» se carga con `style="background-image: url(...)"`, fuera de `@nuxt/image`.
- `/about` en escritorio transfiere 1,5 MB (Lighthouse `uses-responsive-images`: 203 KB ahorrables en producción).

**Recomendación.** Sustituir los GIF por un spinner CSS o un vídeo WebM/MP4 corto; recomprimir `projects.webp`;
`sizes`/`densities` correctos en la galería; `<NuxtImg>` con `fetchpriority` adecuado para el fondo.

---

### PERF-006 — Cascada de peticiones tras la hidratación

| Campo                   | Valor                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                          |
| Prioridad               | P3                                                                                            |
| Confianza               | Verificado (revisión de código + red)                                                         |
| Esfuerzo                | M (depende de SEO-001)                                                                        |
| Ámbito                  | Código                                                                                        |
| Ubicación               | `app.vue:106-115` (`usePlatformData` en `onNuxtReady`), `composables/projectsData.ts:135-139` |
| Dispositivo / navegador | Móvil                                                                                         |
| Referencias             | —                                                                                             |
| Relacionado con         | SEO-001, BUG-005                                                                              |

**Descripción.** Todas las páginas piden la ficha de la plataforma a la API **después** de hidratar, y `/projects`
pide además el listado. En `/projects` (con datos) la secuencia es HTML → JS → hidratación → API → imágenes de la API.
No hay `preconnect` a `api.raupulus.dev` (en producción, Lighthouse sugiere `uses-rel-preconnect` con ~330 ms de
ahorro). Hoy no penaliza el LCP (es texto), pero retrasa el contenido útil y provoca saltos al aparecer.

**Recomendación.** Resolver estos datos en el build (`useAsyncData` → payload estático, SEO-001) y, si alguno debe
seguir en cliente, añadir `<link rel="preconnect" href="https://api.raupulus.dev" crossorigin>`.

---

## Verificado y correcto

- ✅ **TBT ≤ 70 ms** en todas las plantillas y estrategias (aproximación de laboratorio a un buen INP).
- ✅ **DOM pequeño** (252 elementos en la home).
- ✅ **Fuentes self-hosted** (`/_fonts/`, 11 archivos `woff2` con subconjuntos); solo se descargan 2 en el primer render
  (22 KB + 27 KB).
- ✅ **Compresión** brotli o gzip y HTTP/3 en producción.
- ✅ **Sin source maps** publicados ni JS en línea excesivo; `_payload.json` de 69 bytes en la home.
- ✅ **DOMPurify (77 KB) solo se carga en `/projects`**, en un chunk separado.
- ✅ **Escritorio**: Performance 96–100 en el código actual.

## No verificado

- ⚠️ **Datos de campo (CrUX):** cuota de la API agotada; revisar Search Console → «Core Web Vitals».
- ⚠️ **INP real:** solo hay TBT de laboratorio.
- ⚠️ **Rendimiento del código actual con las cabeceras y la caché de producción:** se ha medido en local.
- ⚠️ **bfcache:** Lighthouse informa «Internal error» en headless; no concluyente.
