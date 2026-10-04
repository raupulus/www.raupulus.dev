# 6.3 Bugs ocultos, robustez y errores visibles (BUG) — Auditoría externa deepsek-externo

Resumen: el fallo más grave en producción es que **toda la carga de datos en cliente está rota**: el bundle
desplegado llama a `https://api.fryntiz.dev/api/v1/...`, que redirige a `api.raupulus.dev/api/v1` (410 Gone)
y, además, es bloqueado por CORS. El listado de proyectos y la ficha de plataforma no se muestran y generan
errores de consola en todas las páginas. A esto se suma el soft-404 general, el `404.html` generado vacío y
la ausencia de 404 en la ruta catch-all.

| ID      | Título                                                                    | Sev.  | Prior. | Esf. |
| ------- | ------------------------------------------------------------------------- | ----- | ------ | ---- |
| BUG-001 | API cliente de producción rota (CORS + v1 eliminada): sin datos           | Alta  | P0     | S    |
| BUG-002 | `404.html` generado vacío (sin contenido de `error.vue`)                  | Media | P2     | S    |
| BUG-003 | Contacto: cookie CSRF cross-site ilegible/no enviable → 419 probable      | Alta  | P1     | M    |
| BUG-004 | Catch-all `/projects/**` no devuelve 404 ni valida slugs/segmentos        | Alta  | P1     | M    |
| BUG-005 | `useHead` invocado dentro de un handler, no en `setup`                    | Media | P2     | S    |
| BUG-006 | Build no falla si la API no responde (sitio sin proyectos, sitemap vacío) | Media | P2     | S    |
| BUG-007 | Manifest referencia `/assets/favicons/*` inexistentes (404)               | Media | P2     | XS   |
| BUG-008 | Carga de plataforma en cliente sin estado de error visible                | Media | P2     | S    |
| BUG-009 | Búsqueda de proyectos sin debounce/AbortController (carreras)             | Baja  | P3     | S    |
| BUG-010 | `BlockCode` renderiza HTML del código en lugar de texto                   | Baja  | P3     | S    |
| BUG-011 | `BlockImage` muta props y hace swap a imagen completa (CLS)               | Baja  | P3     | S    |
| BUG-012 | Año del footer con `new Date()` (hidratación en cambio de año)            | Baja  | P3     | XS   |

---

### BUG-001 — API cliente de producción rota (CORS + v1 eliminada)

| Campo       | Valor                                                                             |
| ----------- | --------------------------------------------------------------------------------- |
| Severidad   | Alta                                                                              |
| Prioridad   | P0                                                                                |
| Confianza   | Verificado (Lighthouse, consola)                                                  |
| Esfuerzo    | S                                                                                 |
| Ámbito      | Producción                                                                        |
| Ubicación   | Bundle de producción (`window.__NUXT__.config.public.api`), https://raupulus.dev/ |
| Referencias | CORS, HTTP 410                                                                    |
| Relacionado | CODE-001, LEGAL-008, PERF-003                                                     |

**Descripción.** El bundle desplegado resuelve `api.domain = https://api.fryntiz.dev` y
`api.base = https://api.fryntiz.dev/api/v1`. Las peticiones del cliente a
`api.fryntiz.dev/api/v1/platform/portfolio/info` y `.../content/type/project?page=1&quantity=10` son
bloqueadas por CORS, y `api.raupulus.dev/api/v1/*` responde `410 Gone` («La API V1 está obsoleta»). En
consecuencia, el listado de proyectos (home/about no, pero `/projects`) no carga datos y hay errores de
consola en todas las rutas.

**Evidencia.**

```
# Consola (Lighthouse prod-home-mobile, errors-in-console)
Access to fetch at 'https://api.fryntiz.dev/api/v1/platform/portfolio/info' from origin
'https://raupulus.dev' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
# y
Failed to load resource: net::ERR_FAILED  https://api.fryntiz.dev/api/v1/platform/portfolio/info
# prod-project-mobile
.../content/type/project?page=1&quantity=10  -> CORS blocked
```

```
$ curl -sS https://api.raupulus.dev/api/v1/platform/portfolio/info
{"success":false,"message":"La API V1 está obsoleta y ha sido eliminada...","status":410}
```

**Pasos para reproducir.** 1. Abrir DevTools en https://raupulus.dev/projects. 2. Observar peticiones a
`api.fryntiz.dev/api/v1/...` en rojo (CORS/ERR_FAILED).

**Impacto.** La página de proyectos no muestra datos para ningún usuario y las consolas acumulan errores;
la web parece averiada.

**Recomendación.** Recompilar y redeployar con el `.env` de producción correcto
(`API_DOMAIN_URL`/`API_BASE_URL` apuntando a la API V2 vigente) y alinear dominio/ruta. Añadir una
verificación en el CI que falle si el bundle público contiene `api.fryntiz.dev` o `/api/v1`.

**Verificación de la corrección.** En `/projects`, la red muestra `200` del endpoint V2 y 0 errores de
consola; el bundle no contiene `api.fryntiz.dev`.

---

### BUG-002 — `404.html` generado vacío

| Campo       | Valor                                  |
| ----------- | -------------------------------------- |
| Severidad   | Media                                  |
| Prioridad   | P2                                     |
| Confianza   | Verificado                             |
| Esfuerzo    | S                                      |
| Ámbito      | Ambos                                  |
| Ubicación   | `.output/public/404.html`, `error.vue` |
| Relacionado | SEC-002, BUG-004, SEO-001              |

**Descripción.** El `404.html` generado (7 KB) es una cáscara `__nuxt` **sin** el contenido de `error.vue`:
sin título de error, sin `noindex`, sin canonical y sin textos. La página de error solo existe tras
hidratar; en acceso directo el HTML servido está vacío.

**Evidencia.**

```
$ wc -c .output/public/404.html .output/public/index.html
  7198 .output/public/404.html         # solo shell
 44677 .output/public/index.html
$ grep -oE 'Página no encontrada|Error [0-9]+|Algo ha salido mal' .output/public/404.html | wc -l
0
$ grep -oE '<meta name="robots"[^>]*>' .output/public/404.html   # (vacío)
```

**Impacto.** Con el soft-404 actual (SEC-002) da igual, pero al arreglarlo se serviría una página en blanco
hasta hidratar. Penaliza la experiencia y, con JS deshabilitado, no hay mensaje.

**Recomendación.** Verificar el render de `error.vue` en el `404.html` estático (Nuxt `nuxt generate` debería
usar la página de error; revisar que no se esté generando antes de que se resuelva el layout). Asegurar
`<meta name="robots" content="noindex">` en el HTML estático del 404.

**Verificación de la corrección.** `grep -c "Página no encontrada" .output/public/404.html` ≥ 1 y presencia
de `noindex`.

---

### BUG-003 — Contacto: cookie CSRF cross-site ilegible/no enviable

| Campo       | Valor                                                                      |
| ----------- | -------------------------------------------------------------------------- |
| Severidad   | Alta                                                                       |
| Prioridad   | P1                                                                         |
| Confianza   | Probable (verificado por inspección de cookies; no se envió el formulario) |
| Esfuerzo    | M                                                                          |
| Ámbito      | Código                                                                     |
| Ubicación   | `composables/fetchPostData.ts:9-36`, `utils/apiClient.ts:82-100`           |
| Referencias | Laravel Sanctum, SameSite, RFC 6265bis                                     |
| Relacionado | BUG-001, SEC-001                                                           |

**Descripción.** `fetchCsrfToken()` pide `${apiDomain}/sanctum/csrf-cookie` con `credentials:'include'` y
luego lee `document.cookie` buscando `XSRF-TOKEN`. Pero la API responde `Set-Cookie: XSRF-TOKEN=…;
domain=api.raupulus.dev; SameSite=Lax`. Al ser un dominio distinto de `raupulus.dev`, el JavaScript del sitio
**no puede leer** esa cookie, y en una petición fetch cross-site `SameSite=Lax` impide enviarla. El token
enviado en `X-XSRF-TOKEN` sería vacío → el backend respondería `419`.

**Evidencia.**

```
$ curl -sSI https://api.raupulus.dev/ | grep -i set-cookie
set-cookie: XSRF-TOKEN=...; domain=api.raupulus.dev; secure; samesite=lax
set-cookie: api_raupulus_session=...; domain=api.raupulus.dev; secure; httponly; samesite=lax
```

`fetchPostData.ts:14` lee `document.cookie` del contexto `raupulus.dev`, que no incluye cookies de
`api.raupulus.dev`. En desarrollo funciona porque todo va por `/_proxy` (same-origin).

**Impacto.** El formulario de contacto (cuando se reactive) fallará con 419/errores genéricos en producción.

**Recomendación.** Servir la API bajo el mismo origen (proxy en el borde: `raupulus.dev/api/**` →
`api.raupulus.dev/api/**` y `/sanctum/**`) como ya se hace en desarrollo con `/_proxy`, y usar rutas
relativas. Alternativa: `SameSite=None; Secure` en la cookie CSRF (requiere que el navegador acepte cookies
de terceros, cada vez más restringido). Lo correcto y robusto es el proxy same-origin.

**Verificación de la corrección.** En `/contact` (local con proxy), comprobar que el POST devuelve 200/422
(no 419) y que `X-XSRF-TOKEN` va informado.

---

### BUG-004 — Catch-all `/projects/**` no devuelve 404 ni valida slugs

| Campo       | Valor                                                                         |
| ----------- | ----------------------------------------------------------------------------- |
| Severidad   | Alta                                                                          |
| Prioridad   | P1                                                                            |
| Confianza   | Verificado                                                                    |
| Esfuerzo    | M                                                                             |
| Ámbito      | Código                                                                        |
| Ubicación   | `pages/projects/[...slugs].vue:7-15`, `pages/projects/[...slugs].vue:131-251` |
| Relacionado | SEC-002, SEO-001                                                              |

**Descripción.** La página catch-all no comprueba si el slug existe ni el número de segmentos. Cualquier
`/projects/<loquesea>`, `/projects/a/b/c` o incluso `/projects/<slug>/<pagina-inexistente>` renderiza el
listado (200). No se llama a `createError({ statusCode: 404 })` ni en servidor ni en cliente.

**Evidencia.**

```
$ curl -sS -o /dev/null -w "%{http_code}\n" https://raupulus.dev/projects/no-existe-xyz   -> 200
$ curl -sS -o /dev/null -w "%{http_code}\n" https://raupulus.dev/projects/a/b/c           -> 200 (no verificado 3 niveles, previsible)
```

**Impacto.** Soft-404 (SEO) y UX pobre: se muestra el listado como si la URL fuese válida. No hay página
de “proyecto no encontrado”.

**Recomendación.** Validar `slugs.length` (máx. 2) y, si no existe el proyecto/página tras cargar los datos,
`throw createError({ statusCode: 404, statusMessage: 'Proyecto no encontrado' })`. En SSG, marcar rutas no
generadas para el `404.html` (no prerenderizarlas) y evitar el fallback SPA (SEC-002) para que el 404 sea real.

**Verificación de la corrección.** Acceso directo a `/projects/no-existe` → HTTP 404 y mensaje de error; en
navegación cliente, `showError` con 404.

---

### BUG-005 — `useHead` invocado dentro de un handler

| Campo       | Valor                                  |
| ----------- | -------------------------------------- |
| Severidad   | Media                                  |
| Prioridad   | P2                                     |
| Confianza   | Verificado                             |
| Esfuerzo    | S                                      |
| Ámbito      | Código                                 |
| Ubicación   | `pages/projects/[...slugs].vue:99-128` |
| Relacionado | CODE-001                               |

**Descripción.** `handleChangeMetatags` (evento emitido por `GridProjects`) llama a `useHead()` fuera de
`setup`/contexto reactivo. Eso provoca el aviso de Vue/Nuxt («composables must be called at the top of
setup») y los metatags pueden no actualizarse de forma fiable.

**Recomendación.** Reemplazar por `useHead`/`useSeoMeta` reactivo: definir refs (`title`, `description`,
`image`…) en `setup` y pasarlas a `useHead({ title: computed(...), meta: [...] })`, actualizándolas desde el
handler.

**Verificación de la corrección.** Sin warnings en consola al abrir un proyecto; al cambiar de proyecto, el
`<title>` y `og:*` del DOM se actualizan.

---

### BUG-006 — Build no falla si la API no responde

| Campo       | Valor                                 |
| ----------- | ------------------------------------- |
| Severidad   | Media                                 |
| Prioridad   | P2                                    |
| Confianza   | Verificado (código)                   |
| Esfuerzo    | S                                     |
| Ámbito      | Código                                |
| Ubicación   | `composables/projectsData.ts:224-268` |
| Relacionado | INFRA-002, INFRA-003                  |

**Descripción.** `usefetchProjectsPaginated()` captura cualquier error de conexión y devuelve `[]` con un
`console.warn`. En `nuxt.config.ts` el hook `prerender:routes` y el sitemap usan esa función: si la API cae
en el build, se genera un sitio **sin rutas de proyecto y con sitemap sin URLs**, y `npm run generate`
termina con **exit 0**. Nadie se entera hasta que el sitio desplegado está vacío.

**Evidencia.**

```javascript
} catch {
  console.warn(`[proyectos] No se pudo conectar con la API (${API_BASE}). ...`);
}
return allProjects;   // []
```

**Impacto.** Despliegue silencioso de un sitio degradado (SEO y contenido). No hay `failOnError` en
`nitro.prerender`.

**Recomendación.** En el hook de prerender, si `projects.length === 0` (o si falla la primera petición),
`throw` para abortar el build, o al menos fijar `nitro.prerender.failOnError = true` y diferenciar “API sin
proyectos” de “API inaccesible”. En CI, comparar el número de rutas generadas con un mínimo.

**Verificación de la corrección.** Con la API caída, `npm run generate` debe fallar (exit ≠ 0) con un mensaje
claro.

---

### BUG-007 — Manifest referencia iconos inexistentes

| Campo       | Valor                                   |
| ----------- | --------------------------------------- |
| Severidad   | Media                                   |
| Prioridad   | P2                                      |
| Confianza   | Verificado                              |
| Esfuerzo    | XS                                      |
| Ámbito      | Código                                  |
| Ubicación   | `public/favicons/site.webmanifest:6,12` |
| Relacionado | SEO-009                                 |

**Descripción.** El manifest apunta a `/assets/favicons/android-chrome-192x192.png` y `...-512x512.png`, pero
los iconos se sirven en `/favicons/…`. `/assets/` no se publica (es carpeta de fuentes compiladas), así que
las rutas del manifest dan 404 (y en producción, soft-404 con HTML).

**Evidencia.**

```
$ curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:4173/assets/favicons/android-chrome-192x192.png -> 404
$ curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:4173/favicons/android-chrome-192x192.png       -> 200
```

**Recomendación.** Cambiar las `src` del manifest a `/favicons/...` y añadir un icono `"purpose":"maskable"`.
Alinear `theme_color`/`background_color` (`#ffffff`) con el tema oscuro.

**Verificación de la corrección.** Los dos iconos del manifest responden 200; validar con Lighthouse PWA/manifest.

---

### BUG-008 — Carga de plataforma en cliente sin estado de error visible

| Campo       | Valor                                                  |
| ----------- | ------------------------------------------------------ |
| Severidad   | Media                                                  |
| Prioridad   | P2                                                     |
| Confianza   | Verificado                                             |
| Esfuerzo    | S                                                      |
| Ámbito      | Código                                                 |
| Ubicación   | `app.vue:106-115`, `composables/platformData.ts:14-22` |
| Relacionado | BUG-001                                                |

**Descripción.** `app.vue` ejecuta `await usePlatformData()` en `onNuxtReady` en **cada** página. Si falla,
solo hay `console.error`; las tecnologías del filtro y otros datos no aparecen sin feedback al usuario.

**Recomendación.** Exponer un estado de error (`useState`) y mostrar un contexto mínimo (p. ej. ocultar el
filtro de tecnologías o un aviso discreto). Evitar repetir la carga si ya se intentó y falló.

**Verificación de la corrección.** Con la API caída, no hay errores de consola no controlados y la UI degrada
con elegancia.

---

### BUG-009 — Búsqueda sin debounce/AbortController

| Campo     | Valor                                 |
| --------- | ------------------------------------- |
| Severidad | Baja                                  |
| Prioridad | P3                                    |
| Confianza | Probable                              |
| Esfuerzo  | S                                     |
| Ámbito    | Código                                |
| Ubicación | `composables/projectsData.ts:153-190` |

**Descripción.** `projectsDataSearch` itera páginas sin `AbortController`; búsquedas rápidas consecutivas
pueden pisarse (respuestas fuera de orden) y no hay debounce.

**Recomendación.** Cancelar peticiones previas con `AbortController`/`$fetch` con `signal` y aplicar debounce
en el input.

**Verificación de la corrección.** Escribir/borrar rápido: siempre se ve el resultado del último término.

---

### BUG-010 — `BlockCode` renderiza HTML del código

| Campo     | Valor                                        |
| --------- | -------------------------------------------- |
| Severidad | Baja                                         |
| Prioridad | P3                                           |
| Confianza | Verificado                                   |
| Esfuerzo  | S                                            |
| Ámbito    | Código                                       |
| Ubicación | `components/content/blocks/BlockCode.vue:52` |

**Descripción.** `code.data.code.replace(/\n|\r/g,'<br>')` y luego `sanitizeHtml`, que permite etiquetas. Un
fragmento de código con `<div>` se renderiza como HTML en vez de mostrarse literal (y `<script>` se elimina
silenciosamente), rompiendo la fidelidad del snippet.

**Recomendación.** Escapar primero (`<`→`&lt;`, etc.) y aplicar solo `\n`→`<br>`, o usar `<pre>` con texto
escapado en lugar de `v-html`.

**Verificación de la corrección.** Un bloque con `<div>` en el código se muestra como texto `<div>`.

---

### BUG-011 — `BlockImage` muta props

| Campo     | Valor                                            |
| --------- | ------------------------------------------------ |
| Severidad | Baja                                             |
| Prioridad | P3                                               |
| Confianza | Verificado                                       |
| Esfuerzo  | S                                                |
| Ámbito    | Código                                           |
| Ubicación | `components/content/blocks/BlockImage.vue:35-40` |

**Descripción.** En `setup` se escribe `image.data.caption = ...` (mutación del objeto recibido por prop) y
`@load` cambia `src` a la imagen completa, lo que puede provocar CLS y rompe la inmutabilidad de props.

**Recomendación.** No mutar props (usar un `computed`), y usar `srcset`/`sizes` en lugar del swap por JS.

**Verificación de la corrección.** Sin mutaciones de props; imágenes con `srcset`.

---

### BUG-012 — Año del footer con `new Date()`

| Campo     | Valor                          |
| --------- | ------------------------------ |
| Severidad | Baja                           |
| Prioridad | P3                             |
| Confianza | Hipótesis                      |
| Esfuerzo  | XS                             |
| Ámbito    | Código                         |
| Ubicación | `components/app/Footer.vue:45` |

**Descripción.** `new Date().getFullYear()` se evalúa en build (SSG) y al hidratar; si el año cambia entre
build y visita (Año Nuevo), puede producirse un hydration mismatch del texto del copyright.

**Recomendación.** Pasar el año como constante de build (`new Date(buildTime)`) o envolverlo en
`ClientOnly`/`useState`, o calcularlo en un `ref` y marcarlo como dato de cliente.

**Verificación de la corrección.** Sin warnings de hidratación en la consola en fechas límite (simular con
`Date` mockeado en test).

---

## Verificado y correcto

- `vue-tsc --noEmit`: 0 errores. Lint: 0 errores (38 warnings justificados). Tests: 45/45 en verde.
- `usePageData`/`useGetProjectBySlug` codifican el slug con `encodeURIComponent` (sin path traversal trivial).
- `normalizePage` tolera `body` como string/null y garantiza `blocks` como array (robustez ante formato).
- `apiGet`/`fetchPost` diferencian “sin datos” de “error” en el flujo del formulario (`apiErrorMessages`).
- El build local (`serve`, sin fallback SPA) devuelve 404 real para rutas inexistentes.
- No hay warnings de hidratación detectados por Lighthouse en las rutas probadas.
- Los enlaces internos usan `NuxtLink` (excepto el `pushState` manual de la URL del modal).
