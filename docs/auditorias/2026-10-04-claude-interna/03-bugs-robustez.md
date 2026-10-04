# 03 · Bugs ocultos, robustez y errores visibles al usuario

## Resumen

**Producción está rota funcionalmente.** El build desplegado (2026-09-11) consulta `https://api.fryntiz.dev/api/v1`,
que redirige a `api.raupulus.dev/api/v1`. Esa API ya responde `410 Gone`, y la redirección no lleva cabeceras CORS,
así que el navegador bloquea todas las peticiones. Resultado: la página de proyectos está vacía, cada página lanza
errores en consola y el enlace de descarga del CV acaba en un 410. El código actual ya migra a la API v2, pero
**esa API devuelve 0 proyectos** y el build termina en verde sin ninguna ruta de proyecto, así que desplegarlo hoy
eliminaría las 34 URLs de proyectos del sitio y del sitemap.

En el código hay además fallos de navegación en el modal de proyectos (el botón atrás deja el modal abierto con el
scroll bloqueado), un flujo CSRF que no puede funcionar entre subdominios, bloques de código que se renderizan como
HTML y ningún estado de error cuando la API falla.

| ID      | Título                                                                                                 | Severidad | Prioridad | Esfuerzo |
| ------- | ------------------------------------------------------------------------------------------------------ | --------- | --------- | -------- |
| BUG-001 | Producción consume una API retirada: proyectos vacíos, errores en consola y CV roto                    | Crítica   | P0        | S        |
| BUG-002 | El build termina en verde sin ningún proyecto (API v2 vacía y errores silenciados)                     | Crítica   | P0        | S        |
| BUG-003 | El modal de proyectos rompe el historial: «atrás» deja el modal abierto y el scroll bloqueado          | Alta      | P1        | M        |
| BUG-004 | El token CSRF no es legible entre subdominios: el formulario de contacto no puede enviarse             | Alta      | P1        | S        |
| BUG-005 | Sin estados de error, vacío ni «no encontrado» cuando la API falla o el proyecto no existe             | Media     | P1        | S        |
| BUG-006 | `BlockCode` sanitiza el código como HTML en lugar de escaparlo                                         | Media     | P2        | XS       |
| BUG-007 | El formulario rechaza datos válidos y el mensaje usa un `contenteditable` frágil                       | Media     | P2        | S        |
| BUG-008 | `srcset` inválido (`0w`) en las 50 miniaturas de la galería de `/about`                                | Media     | P2        | XS       |
| BUG-009 | La búsqueda de proyectos no cancela peticiones ni refleja el estado en la URL                          | Media     | P2        | S        |
| BUG-010 | Error de consola `requestStorageAccess: Permission denied.` en todas las páginas                       | Baja      | P2        | XS       |
| BUG-011 | El web manifest referencia iconos que no existen                                                       | Baja      | P2        | XS       |
| BUG-012 | `router.afterEach` se registra en cada visita a `/contact` y nunca se elimina                          | Baja      | P3        | XS       |
| BUG-013 | Restos de una API anterior en el modal de envío (`errors.captcha`, `errors.testeando`) y `alt` erróneo | Baja      | P3        | XS       |

---

### BUG-001 — Producción consume una API retirada

| Campo                   | Valor                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Crítica                                                                                                                                                    |
| Prioridad               | P0                                                                                                                                                         |
| Confianza               | Verificado                                                                                                                                                 |
| Esfuerzo                | S (redesplegar con la configuración y los datos correctos; depende de BUG-002)                                                                             |
| Ámbito                  | Producción                                                                                                                                                 |
| Ubicación               | https://raupulus.dev/ (todas las páginas); `window.__NUXT__.config.public.api = {domain:"https://api.fryntiz.dev", base:"https://api.fryntiz.dev/api/v1"}` |
| Dispositivo / navegador | Todos                                                                                                                                                      |
| Referencias             | —                                                                                                                                                          |
| Relacionado con         | BUG-002, INFRA-006, SEO-001                                                                                                                                |

**Descripción.** Cadena de fallo verificada:

1. El HTML de producción (último `last-modified`: 2026-09-11) tiene la API configurada en `api.fryntiz.dev/api/v1`.
2. `api.fryntiz.dev` responde `301` hacia `api.raupulus.dev/api/v1/…` (firma `Apache/2.4.68 (Debian)`) **sin
   cabeceras CORS**, así que el navegador bloquea la petición antes de seguir la redirección.
3. Aunque la siguiera, `api.raupulus.dev/api/v1/*` responde `410 Gone`.

**Evidencia.** `evidencias/cabeceras/produccion-navegador.json` (Chromium, sin interacción):

```text
/projects/  console: error: Access to fetch at 'https://api.fryntiz.dev/api/v1/platform/portfolio/content/type/project?page=1&quantity=10'
                     from origin 'https://raupulus.dev' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header…
                     error: TypeError: Failed to fetch  at i (https://raupulus.dev/_nuxt/BI2kBj6i.js:1:36980) …
/about/     cvLink:  "https://api.fryntiz.dev/cv/get/pdf/raupulus/default"   → 301 → …/api/v1/cv/get/pdf/raupulus/default → 410
```

Captura `evidencias/capturas/produccion__projects__1280x800__chromium.jpg`: la página «Mis Proyectos» solo muestra el
buscador vacío y un aviso «En mantenimiento temporalmente».

**Pasos para reproducir.** Abrir https://raupulus.dev/projects/ con DevTools → Console y Network.

**Impacto.** Cualquier visitante (reclutador, cliente) ve un portfolio sin proyectos y no puede descargar el CV.
Todas las páginas tienen errores en consola. Las páginas de proyecto prerenderizadas siguen indexadas, pero su
contenido real nunca llega a mostrarse.

**Recomendación.** Corregir BUG-002 y desplegar el código actual contra la API v2 **solo cuando la API v2 tenga los
proyectos migrados**. Mientras tanto, como medida temporal: devolver CORS en la redirección de `api.fryntiz.dev` o
reactivar `api/v1` en modo solo lectura, y cambiar el enlace del CV a `https://api.raupulus.dev/cv/pdf` (verificado:
responde 200 `application/pdf`).

**Verificación de la corrección.** La consola de `/projects/` sin errores; el listado muestra los proyectos; el
enlace del CV descarga un PDF.

---

### BUG-002 — El build termina en verde sin ningún proyecto

| Campo                   | Valor                                                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Crítica                                                                                                                                                     |
| Prioridad               | P0                                                                                                                                                          |
| Confianza               | Verificado                                                                                                                                                  |
| Esfuerzo                | S                                                                                                                                                           |
| Ámbito                  | Ambos (código + datos de la API v2)                                                                                                                         |
| Ubicación               | `composables/projectsData.ts:224-271` (`usefetchProjectsPaginated`), `nuxt.config.ts:147-176` (hook `prerender:routes`), `nuxt.config.ts:186-210` (sitemap) |
| Dispositivo / navegador | —                                                                                                                                                           |
| Referencias             | Nitro `prerender.failOnError`                                                                                                                               |
| Relacionado con         | BUG-001, SEO-001, INFRA-001                                                                                                                                 |

**Descripción.** `usefetchProjectsPaginated` captura cualquier error (`console.error` + `break`, o un `catch`
genérico con `console.warn`) y devuelve una lista vacía. Ni el hook de prerender ni el sitemap comprueban el
resultado, y Nitro no tiene `failOnError`. Hoy la API v2 pública responde
`{"data":[],"meta":{"total":0,…}}` para `GET /api/v2/platforms/portfolio/contents?type=project`, y el commit
`HEAD` (sin los cambios locales) llama a un endpoint que da 404.

**Evidencia.**

- Build del árbol de trabajo contra la API pública (`evidencias/build/generate.txt` y copia en directorio temporal):
  `Rutas generadas:` (lista vacía), `cachedRoutes.json = ["/"]`, sitemap con **7 URLs** (producción tiene 42), `exit=0`.
- Build de un clon limpio de `HEAD` con `npm ci` (equivalente al CI):

```text
 ERROR  Error fetching projects page 1: HTTP 404
 ERROR  Error fetching projects page 1: HTTP 404
generate exit=0
[nitro] ✔ You can preview this build using npx serve .output/public
```

**Impacto.** El pipeline (`gocd.yaml`) generaría y, tras la aprobación manual, desplegaría un sitio sin
`/projects/*`. Las 34 URLs de proyectos indexadas pasarían a ser soft-404 (SEO-004) y desaparecerían del sitemap.

**Recomendación.**

1. Hacer que el build falle si no hay proyectos: en el hook `prerender:routes`, `if (!projects.length) throw new Error('La API no devolvió proyectos')`,
   salvo con una variable explícita (`ALLOW_EMPTY_PROJECTS=1`) para desarrollo local.
2. `nitro: { prerender: { failOnError: true } }`.
3. En `usefetchProjectsPaginated`, propagar los errores HTTP en lugar de hacer `break`.
4. Migrar los datos de proyectos a la plataforma `portfolio` de la API v2 antes de desplegar (ver `recomendaciones-api.md`, API-02).

**Verificación de la corrección.** `API_BASE_URL=https://api.invalida.example npm run generate` termina con código
distinto de 0; con la API correcta, `cachedRoutes.json` contiene las 34+ rutas.

---

### BUG-003 — El modal de proyectos rompe el historial

| Campo                   | Valor                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                                                                                            |
| Prioridad               | P1                                                                                                                                                                              |
| Confianza               | Verificado                                                                                                                                                                      |
| Esfuerzo                | M                                                                                                                                                                               |
| Ámbito                  | Código                                                                                                                                                                          |
| Ubicación               | `pages/projects/[...slugs].vue:84-96` (`window.history.pushState`), `pages/projects/[...slugs].vue:8-10` (slugs leídos una sola vez), `components/modals/projectShow.vue:80-93` |
| Dispositivo / navegador | Todos                                                                                                                                                                           |
| Referencias             | Vue Router «history.state seems to have been manually replaced»                                                                                                                 |
| Relacionado con         | BUG-005, A11Y-003                                                                                                                                                               |

**Descripción.** Al abrir un proyecto, la página cambia la URL con `window.history.pushState({}, '', newUrl)`, al
margen de Vue Router y sobrescribiendo el `history.state` que el router necesita. Los slugs se leen de
`route.params` una única vez en el `setup`, y el modal solo se cierra con el botón «X», que emite `slugchange`.

**Evidencia.** `evidencias/escenarios-funcionales.json`, escenario 3:

```text
modal-open    url=/projects/proyecto-gadget-monitor-…/about  title="Proyecto Gadget Monitor… - About"  bodyClass="disable-scroll"  histState="{}"
after-back-1  url=/projects  title="Proyecto Gadget Monitor… - About"  bodyClass="disable-scroll"  modal=true    ← URL cambia, modal sigue abierto
after-escape  url=/projects/proyecto-gadget-monitor-…/about  title="Proyecto…"  modal=false                      ← Esc cierra pero no restaura URL ni título
```

**Pasos para reproducir.** `/projects` → abrir un proyecto → botón «atrás» del navegador o del móvil. Después, abrir
otro proyecto y pulsar Esc.

**Impacto.** En móvil el gesto «atrás» es la forma natural de cerrar el modal y aquí no funciona: el usuario queda
con un modal a pantalla completa sobre una URL que no le corresponde y el scroll de la página bloqueado. Tras Esc,
la URL y el título muestran un proyecto que ya no está abierto, y al compartir la URL se comparte otro contenido.

**Recomendación.** Convertir el estado del modal en estado de ruta: `navigateTo('/projects/' + slug)` (o
`router.push`) y derivar `slugContent` y `slugPage` de `route.params` con `computed`. El modal se abre o cierra
reaccionando a la ruta (`watch(() => route.params.slugs, …)`), y cerrarlo con X o Esc hace `router.back()` si se
llegó desde el listado, o `navigateTo('/projects')` si se entró directamente. Quitar el bloqueo de scroll en
`onBeforeUnmount` del modal.

**Verificación de la corrección.** Test E2E: abrir proyecto → atrás → el modal se cierra, `body` sin
`disable-scroll` y el título es el del listado. Abrir → Esc → URL `/projects`.

---

### BUG-004 — El token CSRF no es legible entre subdominios

| Campo                   | Valor                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                                                                  |
| Prioridad               | P1                                                                                                                                                    |
| Confianza               | Probable (cookie verificada; no se ha enviado el formulario a producción por norma de la auditoría)                                                   |
| Esfuerzo                | S (configuración del backend)                                                                                                                         |
| Ámbito                  | Ambos (código + API)                                                                                                                                  |
| Ubicación               | `composables/fetchPostData.ts:9-17` (`getXsrfTokenFromCookie` lee `document.cookie`), respuesta de `GET https://api.raupulus.dev/sanctum/csrf-cookie` |
| Dispositivo / navegador | Todos                                                                                                                                                 |
| Referencias             | Laravel Sanctum «SPA Authentication» (`SESSION_DOMAIN`, `SANCTUM_STATEFUL_DOMAINS`)                                                                   |
| Relacionado con         | recomendaciones-api.md (API-03), UX-002                                                                                                               |

**Descripción.** El frontend pide `/sanctum/csrf-cookie` y luego lee `XSRF-TOKEN` de `document.cookie` para
enviarlo en `X-XSRF-TOKEN`. La API emite la cookie con `domain=api.raupulus.dev`, y una página servida desde
`raupulus.dev` **no puede leer** cookies de otro host. `getXsrfTokenFromCookie()` devuelve `''` y el POST sale con
la cabecera vacía, que Laravel rechaza con 419 si el endpoint pasa por `VerifyCsrfToken`.

**Evidencia.** `evidencias/cabeceras/api-cors-csrf.txt`:

```text
set-cookie: XSRF-TOKEN=<redactado>; …; path=/; domain=api.raupulus.dev; secure; samesite=lax
```

**Impacto.** El formulario de contacto no puede enviarse en producción (ya muestra un aviso de «fuera de servicio»,
ver UX-002). Si se solucionara desactivando la protección CSRF en la API sin otra medida, se abriría la puerta a
envíos automatizados.

**Recomendación (backend).** `SESSION_DOMAIN=.raupulus.dev` para que la cookie sea legible desde `raupulus.dev`, y
`SANCTUM_STATEFUL_DOMAINS=raupulus.dev`. Alternativa más simple para un formulario público sin sesión: endpoint
stateless protegido solo por captcha y límite de peticiones, y eliminar el flujo CSRF del frontend.

**Verificación de la corrección.** En staging, tras `fetchCsrfToken()`, `document.cookie` contiene `XSRF-TOKEN` y el
POST devuelve 201/200 con un captcha válido.

---

### BUG-005 — Sin estados de error, vacío ni «no encontrado»

| Campo                   | Valor                                                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                                                        |
| Prioridad               | P1                                                                                                                                                                           |
| Confianza               | Verificado                                                                                                                                                                   |
| Esfuerzo                | S                                                                                                                                                                            |
| Ámbito                  | Ambos                                                                                                                                                                        |
| Ubicación               | `composables/projectsData.ts:126-131` (catch silencioso), `composables/platformData.ts:20-22`, `components/grid/Projects.vue:51-56`, `pages/projects/[...slugs].vue:213-250` |
| Dispositivo / navegador | Todos                                                                                                                                                                        |
| Referencias             | Heurística de Nielsen n.º 1 (visibilidad del estado del sistema) y n.º 9 (ayudar a reconocer y recuperarse de errores)                                                       |
| Relacionado con         | BUG-001, BUG-003                                                                                                                                                             |

**Descripción.** Todos los errores de red se tragan con `console.error` y el estado queda vacío:

- Listado: si la API falla, `hasMorePages = false` y `datas.contents` queda `undefined`. No se muestra ni la rejilla
  ni ningún mensaje (es lo que ve hoy producción, BUG-001).
- Proyecto inexistente (`/projects/proyecto-inexistente-xyz`): la API responde 404, el modal no se abre y se ve el
  listado como si nada, con el título genérico y sin aviso (escenario 3: `nonexistent-project`).
- Filtro de tecnologías: si falla la ficha de la plataforma, el bloque «Filtrar por tecnología» queda vacío.
- No hay indicador de carga en la primera carga del listado (solo en «Cargar más»).

**Impacto.** El usuario no sabe si no hay proyectos, si está cargando o si algo ha fallado, y no tiene forma de
reintentar.

**Recomendación.** Exponer un estado `error` en `useProjectsData()` y `usePlatformData()`; mostrar un aviso con botón
«Reintentar» y un enlace alternativo (GitLab). Para slugs inexistentes, `showError({ statusCode: 404 })` o un aviso
dentro del listado. Añadir skeletons para la carga inicial.

**Verificación de la corrección.** Con la API caída (interceptando en Playwright), `/projects` muestra el mensaje de
error y el botón de reintento; `/projects/no-existe` muestra «Proyecto no encontrado».

---

### BUG-006 — `BlockCode` sanitiza el código como HTML en lugar de escaparlo

| Campo                   | Valor                                               |
| ----------------------- | --------------------------------------------------- |
| Severidad               | Media                                               |
| Prioridad               | P2                                                  |
| Confianza               | Verificado (PoC local)                              |
| Esfuerzo                | XS                                                  |
| Ámbito                  | Código                                              |
| Ubicación               | `components/content/blocks/BlockCode.vue:30`, `:52` |
| Dispositivo / navegador | Todos                                               |
| Referencias             | CWE-116                                             |
| Relacionado con         | SEC-005                                             |

**Descripción.** `codeHtml = sanitizeHtml(code.data.code.replace(/\n|\r/g, '<br>'))` interpreta el código fuente como
HTML: las etiquetas permitidas se **renderizan** y las demás desaparecen. En un portfolio con proyectos de Laravel,
Vue y Bash, cualquier ejemplo con `<div>`, `<template>`, `<?php` o `<script>` se muestra mal.

**Evidencia.** PoC local:

```text
entrada : &lt;div class="x"&gt; vs <div class="x">hola</div> <?php echo 1; ?> <script>let a=1</script>
html    : &lt;div class="x"&gt; vs <div class="x">hola</div>            ← el <div> se renderiza; <?php…?> y <script> desaparecen
```

Además, `\r\n` se convierte en dos `<br>`, lo que duplica los saltos de línea y descuadra la numeración.

**Recomendación.** Renderizar como texto: `<pre><code>{{ code.data.code }}</code></pre>` con `white-space: pre` (sin
`v-html`), y calcular las líneas con `code.data.code.split(/\r?\n/).length`. Si se quiere resaltado de sintaxis,
usar Shiki en build.

**Verificación de la corrección.** Test de componente: un bloque con `<div>hola</div>` muestra literalmente
`<div>hola</div>`.

---

### BUG-007 — El formulario rechaza datos válidos y el mensaje usa un `contenteditable` frágil

| Campo                   | Valor                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                                            |
| Prioridad               | P2                                                                                                                                                               |
| Confianza               | Verificado (revisión de código)                                                                                                                                  |
| Esfuerzo                | S                                                                                                                                                                |
| Ámbito                  | Código                                                                                                                                                           |
| Ubicación               | `pages/contact.vue:122-196` (validaciones), `pages/contact.vue:288-295` (`handleKeyup`), `pages/contact.vue:586-606` (textarea oculto + `span[contenteditable]`) |
| Dispositivo / navegador | Todos (más visible en móvil con dictado o autocompletado)                                                                                                        |
| Referencias             | WCAG 3.3.1, 3.3.3, 4.1.2                                                                                                                                         |
| Relacionado con         | A11Y-005, LEGAL-006                                                                                                                                              |

**Descripción.**

- `name.minLength = 5` rechaza nombres reales cortos («Ana», «Luis»).
- `email.minLength = 8` rechaza correos válidos de 6 o 7 caracteres (usuario y dominio de una letra), `maxLength = 50` rechaza
  direcciones largas válidas y la regex no admite TLD internacionalizados.
- El mensaje es un `<span role="textbox" contenteditable>` cuyo valor solo se actualiza en `keyup` con
  `innerText`. Pegar con el ratón o el menú contextual, el dictado por voz o el autocompletado no disparan `keyup`,
  así que el texto visible no llega al modelo. Pegar texto con formato introduce HTML en el campo. El `<textarea>`
  real está oculto con `class="hidden"`.
- El botón «Enviar» es `type="button"`: pulsar Enter en un campo no envía el formulario.

**Impacto.** Usuarios legítimos que no pueden contactar o que envían un mensaje vacío sin saberlo.

**Recomendación.** Usar un `<textarea>` visible con `v-model`, `maxlength="1000"` y contador. Relajar las
validaciones (nombre ≥ 2, email con `type="email"` + validación del servidor, máximo 254 caracteres según RFC
5321). Botón `type="submit"`. Validar en `input`/`blur`, no en `keyup`.

**Verificación de la corrección.** Pegar texto con el ratón en el mensaje habilita el envío; «Ana» y un correo válido de 6 caracteres pasan
la validación.

---

### BUG-008 — `srcset` inválido (`0w`) en la galería de `/about`

| Campo                   | Valor                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| Severidad               | Media                                                            |
| Prioridad               | P2                                                               |
| Confianza               | Verificado                                                       |
| Esfuerzo                | XS                                                               |
| Ámbito                  | Código                                                           |
| Ubicación               | `pages/about.vue:315-323` (`sizes="(max-width: 768px) 50vw, …"`) |
| Dispositivo / navegador | Todos                                                            |
| Referencias             | `@nuxt/image` v2 — prop `sizes` (sintaxis `sm:50vw md:25vw`)     |
| Relacionado con         | PERF-005                                                         |

**Descripción.** `@nuxt/image` no entiende la sintaxis CSS de media queries en `sizes` y genera
`sizes="20vw" srcset="/_ipx/s_250x141/…/1_250px.webp 0w"`. El navegador descarta el candidato (50 avisos en consola
por visita) y usa `src`, sin imágenes responsive.

**Evidencia.** HTML generado (`about/index.html`) y consola (escenario 3):

```text
warning: Failed parsing 'srcset' attribute value since its 'w' descriptor is invalid.
warning: Dropped srcset candidate "/_ipx/s_250x141/images/pages/about/gallery/1_250px.webp"
```

**Recomendación.** `sizes="50vw md:25vw lg:20vw"` (sintaxis de `@nuxt/image`) y `densities="x1 x2"`, o quitar
`sizes` y servir la miniatura a 2× (500 px).

**Verificación de la corrección.** El `srcset` generado contiene descriptores `NNNw` válidos y la consola de
`/about` no muestra avisos.

---

### BUG-009 — La búsqueda de proyectos no cancela peticiones ni refleja el estado en la URL

| Campo                   | Valor                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                               |
| Prioridad               | P2                                                                                                  |
| Confianza               | Verificado (revisión de código)                                                                     |
| Esfuerzo                | S                                                                                                   |
| Ámbito                  | Código                                                                                              |
| Ubicación               | `composables/projectsData.ts:153-191` (`projectsDataSearch`), `pages/projects/[...slugs].vue:62-81` |
| Dispositivo / navegador | Todos                                                                                               |
| Referencias             | —                                                                                                   |
| Relacionado con         | UX-004                                                                                              |

**Descripción.** Cada búsqueda vacía el estado y recorre **todas** las páginas de resultados en un bucle `while`.
Dos búsquedas seguidas (o filtro + búsqueda) se ejecutan en paralelo y concatenan resultados en el mismo estado
(`[...datas.value.contents, ...contents]`): mezclan resultados o duplican tarjetas. No hay `AbortController`, ni
debounce, ni indicador de carga durante la búsqueda. La búsqueda y el filtro no se reflejan en la URL
(`?q=`, `?tech=`), así que no se pueden compartir ni sobreviven a una recarga.

**Recomendación.** Guardar un identificador de búsqueda y descartar respuestas obsoletas (o `AbortController`),
mostrar estado de carga y sincronizar con `route.query` mediante `router.replace`.

**Verificación de la corrección.** Test con dos búsquedas rápidas consecutivas: solo se muestran los resultados de la
última.

---

### BUG-010 — Error de consola `requestStorageAccess: Permission denied.` en todas las páginas

| Campo                   | Valor                                                         |
| ----------------------- | ------------------------------------------------------------- |
| Severidad               | Baja                                                          |
| Prioridad               | P2                                                            |
| Confianza               | Verificado                                                    |
| Esfuerzo                | XS (se resuelve con LEGAL-002)                                |
| Ámbito                  | Ambos                                                         |
| Ubicación               | iframe de reCAPTCHA cargado por `plugins/google-recaptcha.ts` |
| Dispositivo / navegador | Chromium                                                      |
| Referencias             | —                                                             |
| Relacionado con         | LEGAL-002, PERF-002                                           |

**Descripción.** Cada página registra `error: requestStorageAccess: Permission denied.` (escenarios 1 y 3, y
producción). Procede del iframe de reCAPTCHA, que se carga aunque la página no tenga formulario. Lighthouse lo
penaliza en «Best Practices» («Browser errors were logged to the console»).

**Recomendación.** Cargar reCAPTCHA solo en `/contact` (LEGAL-002).

**Verificación de la corrección.** Consola limpia en `/`, `/projects` y `/about`.

---

### BUG-011 — El web manifest referencia iconos que no existen

| Campo                   | Valor                                   |
| ----------------------- | --------------------------------------- |
| Severidad               | Baja                                    |
| Prioridad               | P2                                      |
| Confianza               | Verificado                              |
| Esfuerzo                | XS                                      |
| Ámbito                  | Ambos                                   |
| Ubicación               | `public/favicons/site.webmanifest:5-13` |
| Dispositivo / navegador | Android (instalación), Chrome           |
| Referencias             | web.dev «Add a web app manifest»        |
| Relacionado con         | SEO-004                                 |

**Descripción.** Los iconos apuntan a `/assets/favicons/android-chrome-*.png`, que no se publica (los ficheros están en
`/favicons/`). En producción, la URL devuelve la home con 200 por el soft-404, en vez del PNG. Además
`theme_color` y `background_color` son `#ffffff` en un sitio de tema oscuro y faltan `start_url`, `id`, `lang` e
iconos `maskable`.

**Evidencia.** `evidencias/cabeceras/produccion-exposicion-404.txt`:

```text
200 | text/html | 69246B | … | https://raupulus.dev/assets/favicons/android-chrome-192x192.png
200 | image/png | 26553B | … | https://raupulus.dev/favicons/android-chrome-192x192.png
```

**Recomendación.** `"src": "/favicons/android-chrome-192x192.png"`, `"theme_color": "#091421"`,
`"background_color": "#091421"`, `"start_url": "/"`, `"lang": "es"` y un icono con `"purpose": "maskable"`.

**Verificación de la corrección.** DevTools → Application → Manifest sin errores.

---

### BUG-012 — `router.afterEach` se registra en cada visita a `/contact`

| Campo                   | Valor                                                |
| ----------------------- | ---------------------------------------------------- |
| Severidad               | Baja                                                 |
| Prioridad               | P3                                                   |
| Confianza               | Verificado (revisión de código)                      |
| Esfuerzo                | XS                                                   |
| Ámbito                  | Código                                               |
| Ubicación               | `pages/contact.vue:47-55`                            |
| Dispositivo / navegador | Todos                                                |
| Referencias             | Vue Router — `afterEach` devuelve la función de baja |
| Relacionado con         | —                                                    |

**Descripción.** `router.afterEach(...)` se ejecuta en el `setup` de la página y nunca se da de baja. Cada visita a
`/contact` en la misma sesión añade otro hook global que se ejecuta en todas las navegaciones posteriores.

**Recomendación.** `const off = router.afterEach(...); onBeforeUnmount(off)`, o eliminarlo: `onMounted` y
`onBeforeUnmount` ya muestran y ocultan la insignia.

**Verificación de la corrección.** Visitar `/contact` cinco veces y comprobar que el hook se ejecuta una vez por
navegación.

---

### BUG-013 — Restos de una API anterior en el modal de envío y `alt` erróneo

| Campo                   | Valor                                                |
| ----------------------- | ---------------------------------------------------- |
| Severidad               | Baja                                                 |
| Prioridad               | P3                                                   |
| Confianza               | Verificado (revisión de código)                      |
| Esfuerzo                | XS                                                   |
| Ámbito                  | Código                                               |
| Ubicación               | `components/modals/submitContact.vue:95`, `:128-140` |
| Dispositivo / navegador | —                                                    |
| Referencias             | WCAG 1.1.1                                           |
| Relacionado con         | A11Y-004                                             |

**Descripción.** `messages.errors` es un array de cadenas, pero la plantilla consulta `messages.errors.captcha` y
`messages.errors.testeando` (restos de pruebas). El GIF de carga tiene `alt="Email Enviado"` mientras el correo aún
no se ha enviado. El texto «Por favor, espere uno instante» tiene una errata.

**Recomendación.** Eliminar las ramas muertas, usar `alt=""` en el GIF decorativo (con el estado anunciado en una
región `aria-live`) y corregir la errata.

---

## Verificado y correcto

- ✅ **Sin errores de hidratación** en los escenarios ejecutados con el build de producción (Chromium): no aparece
  ningún «Hydration mismatch» ni `pageerror` (`evidencias/escenarios-funcionales.json`). Los resultados de las tres
  motores están en [06-responsive-compatibilidad.md](06-responsive-compatibilidad.md).
- ✅ **Los metadatos se restauran al salir de `/projects`.** Tras abrir un proyecto y navegar a `/about`, `title`,
  `og:url`, `og:image` y `keywords` son los de `/about` (escenario 3: `about-after-project`).
- ✅ **Deep link a un proyecto:** `/projects/weather-station-raspberry-pi` abre el modal con la página «Presentación del
  proyecto» y 11 bloques de contenido.
- ✅ **404 real en el build local** para rutas inexistentes (`serve` responde 404 con `404.html`); el problema de
  producción es de configuración del servidor (SEO-004).
- ✅ **El middleware `scroll-to-top.global.ts`** solo actúa si cambia el `path` (no rompe las anclas `#hash`). La
  falta de respeto a `prefers-reduced-motion` está en A11Y-007.
- ✅ **Listeners de teclado y scroll** de Header, `projectShow` y `submitContact` se eliminan en `onUnmounted` u
  `onBeforeUnmount`.
- ✅ **Build sin source maps** publicados.
- ✅ **El honeypot y el tiempo mínimo de 3 s** del formulario funcionan como trampas anti-bot sin llamar a la API.

## No verificado

- ⚠️ Envío real del formulario de contacto (prohibido en producción; no hay copia del backend con captcha válido).
- ⚠️ Comportamiento con la API **lenta** (> 10 s): no se ha simulado latencia; se infiere del código que no hay
  timeout en `$fetch` ni indicador de carga inicial.
