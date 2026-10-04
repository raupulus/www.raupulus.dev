# 03 — Bugs Ocultos, Robustez y Errores Visibles (`BUG`)

> **Resumen del área:** Se han descubierto fallos arquitectónicos críticos que afectan directamente a la funcionalidad principal del portfolio. Sobresalen la rotura insalvable del envío del formulario de contacto debido a la imposibilidad del navegador de leer la cookie de CSRF interdominio en `document.cookie` (desembocando en error HTTP 419 de Laravel Sanctum), la degradación a soft-404 con HTTP 200 de todas las rutas inexistentes por la regla de reescritura de `.htaccess`, la omisión del contenido de los proyectos en el HTML estático prerenderizado (renderizado exclusivamente en un modal cliente), el enmascaramiento silencioso de fallos de la API durante `npm run generate` y el bloqueo accidental del scroll del documento al salir de modales.

---

## Tabla de Hallazgos

| ID          | Título                                                                                                                               | Severidad | Prioridad | Esfuerzo | Ámbito     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------- | --------- | -------- | ---------- |
| **BUG-001** | Rotura del flujo CSRF entre dominios distintos: `document.cookie` no puede leer la cookie de `api.raupulus.dev`, provocando HTTP 419 | Crítica   | P0        | M        | Código     |
| **BUG-002** | Respuestas soft-404 con código HTTP 200 en producción para URLs inexistentes debido a `.htaccess`                                    | Alta      | P1        | S        | Producción |
| **BUG-003** | Páginas dinámicas de proyectos no prerenderizan su contenido en el HTML estático de Nuxt SSG                                         | Alta      | P1        | M        | Código     |
| **BUG-004** | Slugs de proyecto inexistentes devuelven la página de listado sin mensaje de error ni código 404                                     | Alta      | P1        | S        | Código     |
| **BUG-005** | Captura silenciosa de errores de la API en el build (`prerender:routes` y sitemap) que publica el sitio sin proyectos                | Alta      | P1        | S        | Código     |
| **BUG-006** | Peticiones redundantes con errores de CORS y consola tras la hidratación en cliente (`usePlatformData`)                              | Media     | P2        | S        | Código     |
| **BUG-007** | Bloqueo persistente del scroll del body (`disable-scroll`) tras navegar atrás con modal abierto                                      | Media     | P2        | XS       | Código     |
| **BUG-008** | Manipulación manual de URL mediante `window.history.pushState` desincronizando Vue Router                                            | Media     | P2        | S        | Código     |
| **BUG-009** | Typo en modelo de datos y formulario: `privacity` en lugar de `privacy` o `privacidad`                                               | Baja      | P3        | XS       | Código     |

---

## Hallazgos Detallados

### BUG-001 — Rotura del flujo CSRF entre dominios distintos: `document.cookie` no puede leer la cookie de `api.raupulus.dev`, provocando HTTP 419

| Campo                   | Valor                                                                          |
| ----------------------- | ------------------------------------------------------------------------------ |
| Severidad               | Crítica                                                                        |
| Prioridad               | P0                                                                             |
| Confianza               | Verificado                                                                     |
| Esfuerzo                | M                                                                              |
| Ámbito                  | Código                                                                         |
| Ubicación               | `composables/fetchPostData.ts:9-17, 35, 60`, `pages/contact.vue:367`           |
| Dispositivo / navegador | Todos los navegadores en producción                                            |
| Referencias             | RFC 6265 (Same-Origin Policy para cookies); Laravel Sanctum SPA Authentication |
| Relacionado con         | SEC-001, API-003                                                               |

**Descripción.** La arquitectura de contacto confía en el mecanismo estándar de Laravel Sanctum para SPAs. Sin embargo, existe una contradicción fundamental entre la política de cookies del navegador y el código del frontend:

1. En producción, el frontend se ejecuta en `https://raupulus.dev` y el backend en `https://api.raupulus.dev`.
2. Al llamar a `/sanctum/csrf-cookie`, el backend devuelve la cabecera:
   `Set-Cookie: XSRF-TOKEN=...; domain=api.raupulus.dev; secure; samesite=lax`.
3. La función `getXsrfTokenFromCookie()` en `composables/fetchPostData.ts` intenta leer dicha cookie inspeccionando `document.cookie`.
4. **Por especificación de seguridad del navegador (RFC 6265), JavaScript ejecutado en el origen `raupulus.dev` tiene estrictamente prohibido leer cookies asociadas al subdominio `api.raupulus.dev`**.
5. Por consiguiente, `getXsrfTokenFromCookie()` devuelve siempre una cadena vacía `""`.
6. En `fetchPost`, la cabecera `'X-XSRF-TOKEN': csrfToken` se envía vacía (`""`), lo que ocasiona que el backend Laravel rechace sistemáticamente la petición POST del formulario con un error **HTTP 419 (CSRF Token Mismatch)**.

**Evidencia.**
`composables/fetchPostData.ts:9-17`:

```typescript
function getXsrfTokenFromCookie(): string {
    if (typeof document === 'undefined') {
        return '';
    }

    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

    return match?.[1] ? decodeURIComponent(match[1]) : '';
}
```

Cabeceras reales devueltas por `api.raupulus.dev`:

```http
set-cookie: XSRF-TOKEN=...; domain=api.raupulus.dev; secure; samesite=lax
```

Al estar asignada a `domain=api.raupulus.dev`, `document.cookie` en `raupulus.dev` nunca la contiene.

**Pasos para reproducir.**

1. En un navegador en `https://raupulus.dev`, ejecutar en la consola `document.cookie`.
2. Observar que `XSRF-TOKEN` no figura en las cookies accesibles por JavaScript del frontend.
3. Al llamar a `fetchCsrfToken()`, la promesa resuelve devolviendo `""`.

**Impacto.** Imposibilidad total para los visitantes de enviar mensajes a través del formulario de contacto en el entorno de producción.

**Recomendación.**
Para resolver la autenticación CSRF interdominio existen dos soluciones:

1. **Recomendada (Backend):** Configurar en el backend Laravel (`config/session.php`) `SESSION_DOMAIN=.raupulus.dev` para que la cookie sea compartida con el dominio padre y todos sus subdominios.
2. **Alternativa (Frontend/Backend):** Habilitar un endpoint dedicado en la API que devuelva el token CSRF dentro de la carga útil JSON (payload), permitiendo al cliente almacenarlo en memoria y adjuntarlo a `X-XSRF-TOKEN` sin depender de `document.cookie`.

**Verificación de la corrección.**
Test en entorno staging/local con subdominios cruzados simulando envío y validando que el token CSRF viaje correctamente en la cabecera `X-XSRF-TOKEN`.

---

### BUG-002 — Respuestas soft-404 con código HTTP 200 en producción para URLs inexistentes debido a `.htaccess`

| Campo                   | Valor                                     |
| ----------------------- | ----------------------------------------- |
| Severidad               | Alta                                      |
| Prioridad               | P1                                        |
| Confianza               | Verificado                                |
| Esfuerzo                | S                                         |
| Ámbito                  | Producción                                |
| Ubicación               | `public/.htaccess:9-12`, `apache.conf:22` |
| Dispositivo / navegador | Todos los navegadores y rastreadores web  |
| Referencias             | Google Search Central: Errores soft-404   |
| Relacionado con         | SEO-001, INFRA-001                        |

**Descripción.** En sitios con generación estática (SSG), cada ruta válida cuenta con su correspondiente archivo `index.html` generado en disco. Las rutas que no existen deben devolver un código de estado HTTP 404 real.
Actualmente, el archivo `public/.htaccess` incluye una regla de reescritura clásica de Single Page Application (SPA):

```apache
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
```

Cuando un cliente o motor de búsqueda solicita una URL inexistente (ej. `/ruta-inexistente-12345`), Apache no encuentra el archivo y ejecuta la regla de reescritura, sirviendo la página principal `/index.html` con un código de estado **HTTP 200 OK**.
Esto constituye un **error soft-404**, penalizado gravemente por Googlebot y otros buscadores al desindexar o indexar contenido duplicado accidentalmente.

**Evidencia.**
Salida real de petición curl a producción:

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://raupulus.dev/no-existe-12345
# Salida:
200
```

Por el contrario, en el servidor estático local sin la regla errónea de `.htaccess`:

```bash
curl -sSI http://localhost:4173/no-existe-12345
# Salida:
HTTP/1.1 404 Not Found
Content-Disposition: inline; filename="404.html"
```

**Pasos para reproducir.**

1. Ejecutar `curl -sS -o /dev/null -w "%{http_code}\n" https://raupulus.dev/url-falsa`.
2. Comprobar que devuelve `200` en lugar de `404`.

**Impacto.** Pérdida de reputación SEO, rastreo ineficiente de Googlebot e indexación accidental de URLs erróneas.

**Recomendación.**
Eliminar la regla `RewriteRule . /index.html [L]` de `public/.htaccess`. Configurar en su lugar la directiva de error nativa:

```apache
ErrorDocument 404 /404.html
```

Nuxt ya genera `.output/public/404.html` en el build; el servidor web simplemente debe entregar este archivo con el código de estado 404.

**Verificación de la corrección.**
`curl -sS -o /dev/null -w "%{http_code}\n" https://raupulus.dev/no-existe` debe devolver exactamente `404`.

---

### BUG-003 — Páginas dinámicas de proyectos no prerenderizan su contenido en el HTML estático de Nuxt SSG

| Campo                   | Valor                                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| Severidad               | Alta                                                                        |
| Prioridad               | P1                                                                          |
| Confianza               | Verificado                                                                  |
| Esfuerzo                | M                                                                           |
| Ámbito                  | Código                                                                      |
| Ubicación               | `pages/projects/[...slugs].vue:8-15`, `components/modals/projectShow.vue:2` |
| Dispositivo / navegador | Rastreadores web y usuarios sin JavaScript                                  |
| Referencias             | Nuxt 4 Prerendering Documentation                                           |
| Relacionado con         | SEO-001, BUG-004                                                            |

**Descripción.** Nuxt genera 212 rutas en tiempo de compilación gracias al hook `prerender:routes` (creando archivos como `.output/public/projects/smart-plant-3d.../index.html`). Sin embargo, al inspeccionar el código HTML de dichos archivos generados en disco, **el contenido del proyecto no existe en el HTML estático**.
La página `pages/projects/[...slugs].vue` renderiza únicamente el listado general de proyectos (`Buscar`, `Filtrar por tecnología`, `Cargar más proyectos`) y maneja la visualización del proyecto mediante un modal cliente (`<ModalsProjectShow v-if="slugContent" ...>`).
Durante la ejecución de `nuxt generate`, el detalle del proyecto no se inyecta en el árbol DOM del HTML prerenderizado. Los motores de búsqueda que descargan el HTML sin ejecutar JavaScript solo ven el buscador de proyectos y ningún texto, imagen ni bloque EditorJS del proyecto en cuestión.

**Evidencia.**
Inspección del archivo `.output/public/projects/smart-plant-3d-con-sensor-de-humedad-en-tierra-y-farola-led-indicando-estado/index.html`:

- El DOM contiene los elementos del buscador de proyectos (`Buscar`, `Filtrar`).
- No contiene ninguna mención a la descripción, fotos ni características del proyecto "Smart Plant 3D".
- El contenido solo se descarga en el cliente tras la hidratación mediante peticiones asíncronas de JavaScript.

**Pasos para reproducir.**

1. Ejecutar `npm run generate`.
2. Inspeccionar el archivo HTML generado en `.output/public/projects/<slug>/index.html`.
3. Buscar el texto del cuerpo del proyecto en el archivo y verificar que no se encuentra en el HTML.

**Impacto.** Inutilidad del prerenderizado estático (SSG) para SEO en proyectos; los proyectos son invisibles para cualquier rastreador o agente que no evalúe JavaScript completo.

**Recomendación.**
Reestructurar la plantilla `pages/projects/[...slugs].vue` para que, cuando `slugContent` esté presente, renderice directamente los bloques del contenido en el cuerpo principal del HTML (con semántica completa de artículo), en lugar de ocultarlo dentro de un modal que depende de hidratación de cliente.

**Verificación de la corrección.**
`grep -i "texto descriptivo del proyecto" .output/public/projects/<slug>/index.html` debe encontrar el contenido directamente en el archivo HTML prerenderizado.

---

### BUG-004 — Slugs de proyecto inexistentes devuelven la página de listado sin mensaje de error ni código 404

| Campo                   | Valor                                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| Severidad               | Alta                                                                        |
| Prioridad               | P1                                                                          |
| Confianza               | Verificado                                                                  |
| Esfuerzo                | S                                                                           |
| Ámbito                  | Código                                                                      |
| Ubicación               | `pages/projects/[...slugs].vue:8-15`, `components/modals/projectShow.vue:2` |
| Dispositivo / navegador | Todos los navegadores                                                       |
| Referencias             | Nuxt 4 Error Handling (`createError`)                                       |
| Relacionado con         | BUG-002, BUG-003                                                            |

**Descripción.** Cuando un usuario navega a una URL con un slug inexistente como `/projects/proyecto-que-no-existe`, el componente `pages/projects/[...slugs].vue` asigna `slugContent.value = 'proyecto-que-no-existe'` y activa `openProjetOnLoad.value = true`.
El componente hijo `ModalsProjectShow` solicita los datos a la API. Al recibir 404 o `null`, la directiva `v-if="visible && project"` evalúa a `false` y el modal simplemente no se dibuja.
Como consecuencia, **el usuario permanece en la pantalla de proyectos con la URL errónea visible, sin ningún modal, sin ningún mensaje informativo y sin que se lance `createError({ statusCode: 404 })`**.
El comportamiento es silencioso y desconcertante.

**Evidencia.**
`components/modals/projectShow.vue:2`:

```html
<div v-if="visible && project" ref="modalRef" tabindex="-1" class="modal-project-show" ...></div>
```

Si `project` es `undefined`, el modal desaparece silenciosamente.

**Pasos para reproducir.**

1. Cargar en el navegador `http://localhost:4173/projects/slug-totalmente-falso`.
2. Observar que no se muestra ningún error y que la pantalla muestra la lista general de proyectos.

**Impacto.** Pésima experiencia de usuario (UX) y soft-404 en el cliente sin feedback visual.

**Recomendación.**
En `pages/projects/[...slugs].vue`, tras intentar cargar el proyecto y comprobar que no existe, invocar de inmediato `showError(createError({ statusCode: 404, statusMessage: 'Proyecto no encontrado', fatal: true }))` para que Nuxt renderice la vista de error `error.vue`.

**Verificación de la corrección.**
Navegar a `/projects/slug-inexistente` y comprobar que la aplicación muestra la página `error.vue` con código 404.

---

### BUG-005 — Captura silenciosa de errores de la API en el build (`prerender:routes` y sitemap) que publica el sitio sin proyectos

| Campo                   | Valor                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| Severidad               | Alta                                                             |
| Prioridad               | P1                                                               |
| Confianza               | Verificado                                                       |
| Esfuerzo                | S                                                                |
| Ámbito                  | Código                                                           |
| Ubicación               | `composables/projectsData.ts:257-265`, `nuxt.config.ts:151, 187` |
| Dispositivo / navegador | Entorno de CI/CD                                                 |
| Referencias             | Buenas prácticas de CI/CD y despliegue continuo                  |
| Relacionado con         | INFRA-002, API-001                                               |

**Descripción.** La función `usefetchProjectsPaginated()` en `composables/projectsData.ts` incluye un bloque `try/catch` que captura cualquier error de conexión o fallo HTTP con la API externa:

```typescript
    } catch {
        console.warn(
            `[proyectos] No se pudo conectar con la API (${API_BASE}). ` +
            'Se continúa sin las rutas dinámicas de proyectos. '
        );
    }
```

Si durante el build en el pipeline de CI/CD la API externa falla, responde con error o está temporalmente inaccesible, la función devuelve un array vacío `[]`.
El proceso de generación (`npm run generate`) finaliza con código de salida **0 (éxito)**, y el pipeline GoCD continúa y **despliega a producción un sitio web vacío, sin ninguna página de proyecto y con un sitemap.xml mutilado**, sin que nadie reciba ninguna alerta de fallo.

**Evidencia.**
`composables/projectsData.ts:257-265` y `gocd.yaml:57-58`.

**Pasos para reproducir.**

1. Simular la caída de la API configurando `API_BASE_URL=http://localhost:9999/api/v2`.
2. Ejecutar `npm run generate`.
3. Comprobar que el comando finaliza con éxito (código 0), pero no se ha generado ninguna ruta de proyecto en `.output/public`.

**Impacto.** Riesgo crítico de desplegar un portfolio roto y desindexar todos los proyectos en motores de búsqueda ante un corte temporal de la API.

**Recomendación.**
Configurar en `nuxt.config.ts` la opción `nitro.prerender.failOnError = true` y, en `usefetchProjectsPaginated`, relanzar la excepción (`throw error`) si el entorno es de producción (`process.env.NODE_ENV === 'production'`) para que el job de build aborte de inmediato y no prosiga el despliegue.

**Verificación de la corrección.**
Ejecutar `npm run generate` con una API inválida en modo producción y verificar que el proceso aborta con código de salida distinto de cero.

---

### BUG-006 — Peticiones redundantes con errores de CORS y consola tras la hidratación en cliente (`usePlatformData`)

| Campo                   | Valor                               |
| ----------------------- | ----------------------------------- |
| Severidad               | Media                               |
| Prioridad               | P2                                  |
| Confianza               | Verificado                          |
| Esfuerzo                | S                                   |
| Ámbito                  | Código                              |
| Ubicación               | `composables/platformData.ts:16-22` |
| Dispositivo / navegador | Consola del navegador               |
| Referencias             | Nuxt 4 State Hydration              |
| Relacionado con         | PERF-001                            |

**Descripción.** Al cargar la página principal en el navegador, el log de auditoría de Lighthouse detectó errores en la consola del navegador:
`FetchError: [GET] "https://api.raupulus.dev/api/v2/platforms/portfolio": Access-Control-Allow-Origin missing`.
En `composables/platformData.ts`, el estado `platformData` no se conserva en el payload de hidratación de Nitro. Cuando la aplicación se hidrata en el navegador, evalúa que `platformData.value` es `undefined` y vuelve a realizar una petición HTTP directa a `API_BASE` en lugar de consumir los datos generados estáticamente.

**Evidencia.**
Captura del log de Lighthouse en `evidencias/lighthouse/lh-local-mobile.json`:

```text
Access to fetch at 'https://api.raupulus.dev/api/v2/platforms/portfolio' from origin 'http://localhost:4173' has been blocked by CORS policy.
Error fetching platform data: FetchError: Failed to fetch
```

**Pasos para reproducir.**

1. Cargar el build local en `http://localhost:4173/`.
2. Abrir las herramientas de desarrollo (DevTools) en la pestaña Console.
3. Observar los errores de consola en rojo al iniciar la página.

**Impacto.** Errores de consola visibles, peticiones de red duplicadas e innecesarias y fallo al cargar datos de tecnologías en entornos locales o si el backend bloquea CORS.

**Recomendación.**
Asegurar que los datos de la plataforma se serialicen correctamente en el payload de Nuxt durante el prerenderizado utilizando `useAsyncData('platformData', () => ...)` en lugar de un `useState` manual sin hidratación automática.

**Verificación de la corrección.**
Cargar cualquier página del build estático y verificar que la consola permanece completamente limpia (0 errores).

---

### BUG-007 — Bloqueo persistente del scroll del body (`disable-scroll`) tras navegar atrás con modal abierto

| Campo                   | Valor                                                       |
| ----------------------- | ----------------------------------------------------------- |
| Severidad               | Media                                                       |
| Prioridad               | P2                                                          |
| Confianza               | Verificado                                                  |
| Esfuerzo                | XS                                                          |
| Ámbito                  | Código                                                      |
| Ubicación               | `components/modals/projectShow.vue:80-86`, `app.vue:84-103` |
| Dispositivo / navegador | Todos los navegadores                                       |
| Referencias             | Patrones de accesibilidad y gestión de scroll en SPAs       |
| Relacionado con         | BUG-008                                                     |

**Descripción.** Cuando el modal de proyecto se abre, asigna `scrollDisabled.value = true`, lo que añade la clase `disable-scroll` a la etiqueta `document.body` (`overflow: hidden; height: 100vh;`).
Si el usuario pulsa el botón «Atrás» del navegador (o el gesto de deslizamiento en móvil) en lugar del botón de cierre del modal, la ruta cambia y el componente del modal se desmonta. Sin embargo, en el hook `onBeforeUnmount()` del modal no se restaura `scrollDisabled.value = false`.
Como consecuencia, la clase `disable-scroll` permanece aplicada al `body` en la página destino, impidiendo que el usuario pueda desplazarse verticalmente.

**Evidencia.**
`components/modals/projectShow.vue:99-101`:

```typescript
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
});
```

Falta la instrucción: `scrollDisabled.value = false;`.

**Pasos para reproducir.**

1. Abrir `/projects` y hacer clic en cualquier proyecto para abrir su modal.
2. Comprobar que el scroll del fondo queda bloqueado.
3. Pulsar el botón «Atrás» del navegador.
4. Intentar hacer scroll en la página de listado: la página queda completamente inmóvil.

**Impacto.** El sitio web queda inutilizable tras la navegación hasta que el usuario recarga manualmente la página.

**Recomendación.**
En `components/modals/projectShow.vue`, añadir en `onBeforeUnmount()`:

```typescript
onBeforeUnmount(() => {
    scrollDisabled.value = false;
    document.removeEventListener('keydown', handleKeydown);
});
```

**Verificación de la corrección.**
Abrir modal, pulsar atrás y comprobar que el scroll en la página resultante funciona con normalidad.

---

### BUG-008 — Manipulación manual de URL mediante `window.history.pushState` desincronizando Vue Router

| Campo                   | Valor                                  |
| ----------------------- | -------------------------------------- |
| Severidad               | Media                                  |
| Prioridad               | P2                                     |
| Confianza               | Verificado                             |
| Esfuerzo                | S                                      |
| Ámbito                  | Código                                 |
| Ubicación               | `pages/projects/[...slugs].vue:84-96`  |
| Dispositivo / navegador | Todos los navegadores                  |
| Referencias             | Documentación de Vue Router 4 / Nuxt 4 |
| Relacionado con         | BUG-007                                |

**Descripción.** En `pages/projects/[...slugs].vue`, la función `handleChangeUrlSlug` altera la barra de direcciones del navegador utilizando la API nativa del DOM:

```typescript
window.history.pushState({}, '', newUrl);
```

En aplicaciones Vue/Nuxt, manipular `window.history` de forma directa sin pasar por el router (`router.push` o `router.replace`) rompe el estado interno del enrutador de Vue, desincroniza el objeto `useRoute()` y no emite los hooks de navegación (`beforeRouteUpdate`, `afterEach`).

**Evidencia.**
`pages/projects/[...slugs].vue:95`:

```typescript
window.history.pushState({}, '', newUrl);
```

**Pasos para reproducir.**

1. Abrir un proyecto desde la lista de proyectos.
2. Observar la URL modificada mediante pushState.
3. Inspeccionar el valor reactivo de `route.fullPath` en Vue Devtools: no refleja la nueva URL.

**Impacto.** Inconsistencias de navegación y estados erráticos al interactuar con el historial del navegador.

**Recomendación.**
Sustituir la llamada nativa por `router.replace({ path: newPath })` de Nuxt/Vue Router.

**Verificación de la corrección.**
Verificar que la navegación actualiza tanto la barra de direcciones como el estado del router sin recargar la página.

---

### BUG-009 — Typo en modelo de datos y formulario: `privacity` en lugar de `privacy` o `privacidad`

| Campo                   | Valor                                  |
| ----------------------- | -------------------------------------- |
| Severidad               | Baja                                   |
| Prioridad               | P3                                     |
| Confianza               | Verificado                             |
| Esfuerzo                | XS                                     |
| Ámbito                  | Código                                 |
| Ubicación               | `pages/contact.vue:186, 360`, `types/` |
| Dispositivo / navegador | N/A                                    |
| Referencias             | Deuda técnica de código                |
| Relacionado con         | LEGAL-006                              |

**Descripción.** El campo de validación y envío del checkbox de privacidad en el formulario de contacto está nombrado como `privacity`, un término incorrecto en inglés (el término correcto es `privacy`, o `privacidad` en español).

**Evidencia.**
`pages/contact.vue:186`:

```typescript
privacity: {
    value: false,
    ...
```

**Pasos para reproducir.**

1. Buscar coincidencias de `privacity` en el código fuente.

**Impacto.** Deuda técnica y confusión en el mantenimiento de tipos y contratos de API.

**Recomendación.**
Normalizar el nombre del campo a `privacy` o `privacidad` en el formulario y en el tipo asociado.

**Verificación de la corrección.**
`git grep -n "privacity"` no debe arrojar coincidencias.

---

## Verificado y Correcto

- ✅ **Sin Hydration Mismatches:** La navegación cliente y la recarga de páginas en el build local no producen avisos de desajuste de hidratación en la consola.
- ✅ **Descarga del CV funcional:** El enlace a `/cv/pdf` en la página Sobre Mí conecta con la API externa y descarga correctamente el archivo PDF con su nombre descriptivo.
- ✅ **Sanitización básica en bloques EditorJS:** Los bloques de párrafo, cabecera y citas gestionan adecuadamente los saltos de línea y entidades HTML básicas.
