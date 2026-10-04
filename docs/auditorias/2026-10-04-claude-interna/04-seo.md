# 04 · SEO técnico, on-page e identidad

## Resumen

El SEO de producción está muy por debajo de lo que el código actual ya resuelve. Producción no tiene canonical ni
datos estructurados y pinta dos `h1` por página. Además, **41 de las 42 URLs de su sitemap responden con una
redirección 301** (barra final) y **toda URL inexistente devuelve 200 con la home** (soft-404). El código actual
corrige el canonical, el `h1` único y el JSON-LD, pero mantiene el problema de fondo: las 34 páginas de proyecto
**no tienen contenido propio en el HTML**. Se prerenderizan como copias del listado, con el mismo título y la
misma descripción, y el detalle solo aparece en un modal tras cargar datos en el navegador. Esto, junto con
BUG-002, pone en riesgo la indexación de todo el contenido de proyectos, que es el más valioso del portfolio.

| ID      | Título                                                                                                 | Severidad | Prioridad | Esfuerzo       |
| ------- | ------------------------------------------------------------------------------------------------------ | --------- | --------- | -------------- |
| SEO-001 | Las páginas de proyecto no tienen contenido propio en el HTML y duplican metadatos                     | Alta      | P1        | L              |
| SEO-002 | 41 de 42 URLs del sitemap redirigen (barra final) y el canonical apunta a la URL redirigida            | Alta      | P1        | S              |
| SEO-003 | Producción sin canonical ni JSON-LD, con dos `h1` por página y `og:url` erróneos (corregido en código) | Media     | P1        | XS (desplegar) |
| SEO-004 | Soft-404: toda URL inexistente responde 200 con la home                                                | Alta      | P1        | XS             |
| SEO-005 | Imágenes sociales relativas, cuadradas o externas; `twitter:card` incoherente                          | Media     | P2        | S              |
| SEO-006 | `lastmod` del sitemap = fecha del build en las páginas estáticas                                       | Media     | P2        | XS             |
| SEO-007 | JSON-LD incompleto: `sameAs` desactualizado y sin `BreadcrumbList`, `ProfilePage` ni proyectos         | Media     | P2        | S              |
| SEO-008 | Títulos y descripciones demasiado largos y rol inconsistente («Backend» frente a «Full Stack Backend») | Baja      | P2        | XS             |
| SEO-009 | Jerarquía de encabezados con saltos (`h1` → `h3`) en 5 plantillas                                      | Baja      | P3        | XS             |
| SEO-010 | 50 imágenes de la galería con `alt` genérico                                                           | Baja      | P3        | S              |
| SEO-011 | `og:locale:alternate = en_US` sin versión en inglés                                                    | Baja      | P3        | XS             |

---

### SEO-001 — Las páginas de proyecto no tienen contenido propio en el HTML

| Campo                   | Valor                                                                                                                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                                                                                                                |
| Prioridad               | P1                                                                                                                                                                                                  |
| Confianza               | Verificado                                                                                                                                                                                          |
| Esfuerzo                | L                                                                                                                                                                                                   |
| Ámbito                  | Ambos                                                                                                                                                                                               |
| Ubicación               | `pages/projects/[...slugs].vue:13-48` (metadatos fijos en el `setup`), `composables/projectsData.ts:135-139` (carga en `onMounted`), `components/grid/Projects.vue:81-85` (detalle solo en cliente) |
| Dispositivo / navegador | Rastreadores (Googlebot, Bingbot) y previsualizaciones sociales                                                                                                                                     |
| Referencias             | Google Search Central: «JavaScript SEO basics», «Consolidate duplicate URLs»                                                                                                                        |
| Relacionado con         | BUG-002, BUG-003, SEO-007, A11Y-002                                                                                                                                                                 |

**Descripción.** Cada URL `/projects/:slug` y `/projects/:slug/:page` se prerenderiza con el **mismo componente y los
mismos metadatos que `/projects`**. El listado se carga en `onMounted` y el detalle se pide en el cliente para
mostrarlo en un modal. El título y la descripción específicos solo se fijan en el cliente (`handleChangeMetatags`)
cuando termina la petición.

**Evidencia.** HTML servido (sin JavaScript):

```text
producción  projects_weather-station-raspberry-pi_.html          title="Proyectos de Raúl Caro Pastorino" og:url=https://raupulus.dev/projects  words=45 (idéntico a /projects)
producción  projects_weather-station-raspberry-pi_hardware_.html title="Proyectos de Raúl Caro Pastorino" og:url=https://raupulus.dev/projects  words=45
código      projects/weather-station-raspberry-pi/index.html     title="Proyectos de Raúl Caro Pastorino" canonical=…/projects/weather-station-raspberry-pi  og:url=…/projects  words=78  h1="Mis Proyectos"
```

En el navegador, el título correcto («Estación Meteorológica con Raspberry Pi - Presentación del proyecto») solo
aparece segundos después y dentro de un modal (escenario 3).

Además, **el listado no enlaza a los proyectos**: las tarjetas son `<div @click>` (`components/card/ProjectVertical.vue:25-28`,
`ProjectHorizontal.vue`) y en el DOM de `/projects` hay **0 elementos `<a href="/projects/…">`**. Las 34 URLs de
proyecto solo se descubren por el sitemap: son páginas huérfanas sin enlazado interno (ver también A11Y-002).

**Impacto.** Google renderiza JavaScript, pero con retraso y presupuesto limitado. Aquí, además, el contenido depende
de una API externa con CORS y de un modal. Hoy hay 34 URLs que en el HTML son duplicados casi exactos (mismo título,
descripción y texto) con canonicals distintos, lo que suele acabar en «Duplicada: Google ha elegido otra URL
canónica» o en contenido de poco valor. Las previsualizaciones en LinkedIn, X o Telegram (que no ejecutan JS)
muestran siempre «Proyectos de Raúl Caro Pastorino».

**Recomendación.**

1. Obtener los datos en el `setup` con `useAsyncData` (se serializan en `_payload.json` durante `nuxt generate`):

```ts
const { data: project } = await useAsyncData(`project-${slug}`, () => useGetProjectBySlug(slug), { server: true });
if (slug && !project.value)
    throw createError({ statusCode: 404, statusMessage: 'Proyecto no encontrado', fatal: true });
useSeoMeta({
    title: () => project.value?.title,
    description: () => project.value?.excerpt,
    ogImage: () => imageUrl(project.value?.image, 'large'),
});
```

2. Convertir cada tarjeta en un enlace real (`<NuxtLink :to="`/projects/${project.slug}`">`), lo que además
   resuelve A11Y-002.
3. Renderizar el detalle como **página** (con `h1` = título del proyecto, contenido de la página en HTML, migas de
   pan y enlaces a sus otras páginas). Si se quiere conservar el modal desde el listado, debe ser una mejora
   progresiva sobre una URL que ya tiene su contenido.
4. Separar la visita contada por la API (`useGetProjectBySlug` «suma una visita») de la lectura en build: usar un
   endpoint o parámetro que no cuente visitas durante el prerender.

**Verificación de la corrección.** `curl -sS https://raupulus.dev/projects/weather-station-raspberry-pi/ | grep -o '<title>[^<]*'`
devuelve el título del proyecto; el HTML contiene el texto de la primera página; Rich Results Test sin errores.

---

### SEO-002 — 41 de 42 URLs del sitemap redirigen

| Campo                   | Valor                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                           |
| Prioridad               | P1                                                                                                             |
| Confianza               | Verificado                                                                                                     |
| Esfuerzo                | S                                                                                                              |
| Ámbito                  | Producción (+ código: canonical y sitemap sin barra)                                                           |
| Ubicación               | `https://raupulus.dev/sitemap.xml`; `app.vue:23` (canonical sin barra); Apache `mod_dir` (`DirectorySlash On`) |
| Dispositivo / navegador | Rastreadores                                                                                                   |
| Referencias             | Google Search Central: «Build and submit a sitemap» (solo URLs canónicas), «Redirects and Google Search»       |
| Relacionado con         | SEO-004, INFRA-002                                                                                             |

**Descripción.** `nuxt generate` crea `about/index.html`. Apache, al pedir `/about`, encuentra un directorio y
responde `301 → /about/`. El sitemap, los enlaces internos (`NuxtLink to="/projects"`) y el canonical del código
actual usan la forma **sin** barra. Resultado: cada URL del sitemap y cada clic interno pasan por una redirección,
y el canonical apunta a una URL que no es la final.

**Evidencia.** `evidencias/cabeceras/produccion-sitemap-status.txt`:

```text
   1 200
  41 301
301 https://raupulus.dev/projects/ https://raupulus.dev/projects
```

**Impacto.** Señales canónicas contradictorias (sitemap y canonical frente a la URL final), presupuesto de rastreo
desperdiciado y un salto de red extra (~100-200 ms) en cada navegación con recarga completa.

**Recomendación.** Elegir una forma y aplicarla en todo. La más sencilla con SSG y Apache es **sin barra**:

```apache
DirectorySlash Off
RewriteEngine On
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}/index.html -f
RewriteRule ^(.+?)/?$ /$1/index.html [L]
# Redirigir la forma con barra a la canónica sin barra
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^(.+)/$ /$1 [R=301,L]
```

Alternativa: `nitro.prerender.autoSubfolderIndex: false` (genera `about.html`) más `Options +MultiViews` o una regla
de reescritura a `.html`. Si se prefiere **con** barra, configurar `site.trailingSlash: true` en
`@nuxtjs/sitemap`/`nuxt-site-config` y en el canonical de `app.vue`.

**Verificación de la corrección.** Todas las `<loc>` del sitemap devuelven 200 sin redirección
(`while read u; do curl -s -o /dev/null -w '%{http_code}\n' "$u"; done`), y el canonical coincide con la URL final.

---

### SEO-003 — Producción sin canonical ni JSON-LD y con dos `h1` (corregido en código)

| Campo                   | Valor                                               |
| ----------------------- | --------------------------------------------------- |
| Severidad               | Media                                               |
| Prioridad               | P1                                                  |
| Confianza               | Verificado                                          |
| Esfuerzo                | XS (desplegar, una vez resueltos BUG-002 y SEO-001) |
| Ámbito                  | Producción                                          |
| Ubicación               | HTML de producción (build del 2026-09-11)           |
| Dispositivo / navegador | Rastreadores                                        |
| Referencias             | —                                                   |
| Relacionado con         | INFRA-006                                           |

**Descripción.** En producción, ninguna página tiene `<link rel="canonical">` ni JSON-LD. Todas repiten un `h1` en el
header («Raúl Caro Pastorino Desarrollador web») además del de la página. `/webs` declara
`og:url=https://raupulus.dev/social` y `/blog` usa el título y la descripción de la home.

**Evidencia.** Extracción de `<head>` de las 11 páginas de producción descargadas (ver tabla del resumen ejecutivo):

```text
webs_.html  ogurl=["https://raupulus.dev/social"]  h1=["Raúl Caro Pastorino Desarrollador web","Mis Sitios Webs"]  canon=[]  ld=0
blog_.html  title=["Portfolio de Raúl Caro Pastorino Web Developer (@raupulus)"]  ogimg=["/logo_512x512.png"]
```

El código actual ya genera canonical absoluto, un único `h1`, JSON-LD `Person` + `WebSite` y `og:url` correctos.

**Recomendación.** Desplegar el código actual en cuanto se resuelvan BUG-002 y SEO-001.

**Verificación de la corrección.** Repetir `node headinfo.mjs` sobre las páginas de producción.

---

### SEO-004 — Soft-404: toda URL inexistente responde 200 con la home

| Campo                   | Valor                                                                                               |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                |
| Prioridad               | P1                                                                                                  |
| Confianza               | Verificado                                                                                          |
| Esfuerzo                | XS                                                                                                  |
| Ámbito                  | Producción (configuración versionada en el repo)                                                    |
| Ubicación               | `public/.htaccess:5-13` (fallback SPA a `/index.html`), `nginx.conf:32` (`try_files … /index.html`) |
| Dispositivo / navegador | Todos                                                                                               |
| Referencias             | Google Search Central: «Soft 404 errors»                                                            |
| Relacionado con         | SEO-002, BUG-011, SEC-010                                                                           |

**Descripción.** `public/.htaccess` (copiado a `.output/public`) reescribe cualquier ruta inexistente a
`/index.html`, así que se sirve el HTML de la **home** con estado 200 para cualquier URL. Contradice
`apache.conf:49` (`ErrorDocument 404 /404.html`), cuyo comentario explica precisamente que se quería evitar esto.

**Evidencia.** `evidencias/cabeceras/produccion-exposicion-404.txt`:

```text
200 | text/html | 69246B | https://raupulus.dev/no-existe-1791132468
200 | text/html | 69246B | https://raupulus.dev/projects/proyecto-inexistente-xyz
200 | text/html | 69246B | https://raupulus.dev/.env
200 | text/html | 69246B | https://raupulus.dev/assets/favicons/android-chrome-192x192.png
```

En el navegador, `/no-existe-auditoria/` muestra la home completa (`evidencias/cabeceras/produccion-navegador.json`).

**Impacto.** URLs basura indexables con contenido duplicado de la home; los proyectos eliminados nunca devuelven 404
ni 410; los recursos que faltan (iconos, `security.txt`) se enmascaran como HTML; y las herramientas de
monitorización no detectan enlaces rotos.

**Recomendación.** Eliminar el bloque `mod_rewrite` de `public/.htaccess` (todas las rutas válidas están
prerenderizadas) y dejar `ErrorDocument 404 /404.html`. Asegurarse de que `404.html` incluye
`<meta name="robots" content="noindex">` y un título de error; hoy el `404.html` generado es el shell vacío de la
SPA, con el título de la home y la imagen `og` de GitHub.

**Verificación de la corrección.** `curl -s -o /dev/null -w '%{http_code}' https://raupulus.dev/no-existe` → `404`.

---

### SEO-005 — Imágenes sociales relativas, cuadradas o externas

| Campo                   | Valor                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                                             |
| Prioridad               | P2                                                                                                                                                                |
| Confianza               | Verificado                                                                                                                                                        |
| Esfuerzo                | S                                                                                                                                                                 |
| Ámbito                  | Ambos                                                                                                                                                             |
| Ubicación               | `app.vue:7-17` (`ogImage: '/logo_512x512.png'`, `twitterCard: 'summary'`), `nuxt.config.ts:68-72` (imagen en `raw.githubusercontent.com`), `public/social/*.webp` |
| Dispositivo / navegador | LinkedIn, X, Mastodon, Bluesky, Telegram, WhatsApp, Slack                                                                                                         |
| Referencias             | Open Graph protocol (URL absoluta), X Cards (`summary_large_image` ≥ 300×157, ratio 2:1)                                                                          |
| Relacionado con         | SEO-001                                                                                                                                                           |

**Descripción.**

- La home y `/blog` publican `og:image="/logo_512x512.png"` (relativa: muchos parsers la ignoran) y
  `twitter:card="summary"`.
- El resto de páginas usan `summary_large_image` con imágenes de **512×512** (`public/social/*.webp`), que las redes
  recortan a 1,91:1. `social/projects.webp` pesa 332 KB.
- `404.html` y las páginas sin `useHead` heredan la imagen de `raw.githubusercontent.com`, un dominio fuera del control
  del sitio.
- No hay `og:image:alt`, `og:image:width` ni `og:image:height`.

**Recomendación.** Generar imágenes 1200×630 (WebP o PNG < 300 KB) por plantilla, publicarlas con URL absoluta
(`siteUrl + '/social/…'`) y añadir `og:image:alt`, `og:image:width` y `og:image:height` en un único lugar
(`useSeoMeta` por página, eliminando los valores por defecto contradictorios de `nuxt.config.ts`). Valorar
`nuxt-og-image` para generar una imagen por proyecto.

**Verificación de la corrección.** LinkedIn Post Inspector y opengraph.xyz muestran la imagen grande en todas las
plantillas.

---

### SEO-006 — `lastmod` del sitemap = fecha del build

| Campo                   | Valor                                                                |
| ----------------------- | -------------------------------------------------------------------- |
| Severidad               | Media                                                                |
| Prioridad               | P2                                                                   |
| Confianza               | Verificado                                                           |
| Esfuerzo                | XS                                                                   |
| Ámbito                  | Ambos                                                                |
| Ubicación               | `nuxt.config.ts:211-215` (`defaults.lastmod: new Date()`)            |
| Dispositivo / navegador | Rastreadores                                                         |
| Referencias             | Google: «lastmod debe reflejar la última modificación significativa» |
| Relacionado con         | —                                                                    |

**Descripción.** Todas las páginas estáticas reciben `lastmod` = momento del build
(`7 <lastmod>2026-10-04T16:58:44Z</lastmod>`), aunque no hayan cambiado. `changefreq` y `priority` los ignora Google.

**Impacto.** Google deja de confiar en `lastmod` si siempre cambia, y se pierde la señal útil de los proyectos (que
sí usan `updated_at`).

**Recomendación.** Quitar `defaults.lastmod`, `changefreq` y `priority`; usar el `lastmod` de git por página
(`sitemap.autoLastmod` o fecha manual) y `updated_at` en proyectos.

**Verificación de la corrección.** Dos builds consecutivos sin cambios generan el mismo `lastmod`.

---

### SEO-007 — JSON-LD incompleto

| Campo                   | Valor                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| Severidad               | Media                                                                                      |
| Prioridad               | P2                                                                                         |
| Confianza               | Verificado                                                                                 |
| Esfuerzo                | S                                                                                          |
| Ámbito                  | Código                                                                                     |
| Ubicación               | `app.vue:43-81`                                                                            |
| Dispositivo / navegador | Google (Knowledge Graph), buscadores con IA                                                |
| Referencias             | schema.org `Person`, `ProfilePage`, `BreadcrumbList`, `CreativeWork`, `SoftwareSourceCode` |
| Relacionado con         | SEO-001, CONT-002                                                                          |

**Descripción.**

- `sameAs` incluye 7 perfiles, pero `/social` enlaza además Bluesky, Telegram, Instagram, Printables, npm, Stack
  Overflow, CodePen y Facebook. Usa `twitter.com` en lugar de `x.com`.
- `Person.image` es el logotipo, no una foto.
- `jobTitle: 'Desarrollador Web Backend'` no coincide con los títulos de las páginas («Desarrollador Web Full Stack
  Backend»).
- No hay `ProfilePage` (para `/about`), `ContactPage`, `BreadcrumbList` ni un tipo por proyecto (`CreativeWork` o
  `SoftwareSourceCode` con `codeRepository`, `programmingLanguage`, `dateModified`).
- No se ha podido pasar el validador de schema.org (servicio interactivo). La sintaxis del JSON es correcta y los
  tipos y propiedades existen.

**Recomendación.** Completar `sameAs` desde una fuente única (la misma lista que `/social`), añadir `ProfilePage` en
`/about` con `mainEntity: { '@id': '/#person' }`, y `BreadcrumbList` + `CreativeWork` en cada proyecto (cuando
SEO-001 lo permita).

**Verificación de la corrección.** Rich Results Test y validator.schema.org sin errores en `/`, `/about` y un proyecto.

---

### SEO-008 — Títulos y descripciones demasiado largos y rol inconsistente

| Campo                   | Valor                                     |
| ----------------------- | ----------------------------------------- |
| Severidad               | Baja                                      |
| Prioridad               | P2                                        |
| Confianza               | Verificado                                |
| Esfuerzo                | XS                                        |
| Ámbito                  | Código                                    |
| Ubicación               | `useHead` de cada página en `pages/*.vue` |
| Dispositivo / navegador | SERP                                      |
| Referencias             | Google: «Influencing title links»         |
| Relacionado con         | SEO-007                                   |

**Descripción.** Longitudes medidas en el build:

| Página      | Título (car.) | Descripción (car.) |
| ----------- | ------------- | ------------------ |
| `/`         | 48            | 139                |
| `/about`    | 71            | 186                |
| `/projects` | 33            | 195                |
| `/contact`  | 70            | 213                |
| `/social`   | 77            | 206                |
| `/webs`     | 83            | 218                |
| `/privacy`  | 85            | 170                |
| `/blog`     | 36            | 115                |

Cinco títulos superan ~60 caracteres y seis descripciones superan ~160, así que se truncarán. El sufijo
«| Desarrollador Web Full Stack Backend» se repite y contradice el «Backend» de la home y del JSON-LD. Se mantiene
`meta keywords` (Google la ignora) y `robots: index, follow` (es el valor por defecto).

**Recomendación.** Patrón `«Página» · Raúl Caro Pastorino` (`titleTemplate`), descripciones de 120-155 caracteres
orientadas a la intención y un rol único en todo el sitio. Eliminar `keywords`.

---

### SEO-009 — Jerarquía de encabezados con saltos

| Campo                   | Valor                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                |
| Prioridad               | P3                                                                                  |
| Confianza               | Verificado (axe `heading-order` + W3C Nu Checker)                                   |
| Esfuerzo                | XS                                                                                  |
| Ámbito                  | Código                                                                              |
| Ubicación               | `/projects` (h1→h3 en tarjetas), `/about`, `/social`, `/contact`, modal de proyecto |
| Dispositivo / navegador | Rastreadores y lectores de pantalla                                                 |
| Referencias             | WCAG 1.3.1 (ver A11Y-006)                                                           |
| Relacionado con         | A11Y-006                                                                            |

**Descripción.** Secuencias observadas en el DOM: `/projects` `H1 H3 H3 …`, `/social` `H1 H3 H3 …`, `/contact`
`H1 H3 H2`, `/about` `H1 H3 H3 H3 H3 H2`. Además, los títulos del contenido EditorJS (`BlockHeader`) pueden
introducir otros `h1`.

**Recomendación.** Usar `h2` para los títulos de sección y de tarjeta, y mapear los niveles de `BlockHeader` a
`h2`-`h4` dentro de un proyecto.

---

### SEO-010 — 50 imágenes de la galería con `alt` genérico

| Campo                   | Valor                                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| Severidad               | Baja                                                                        |
| Prioridad               | P3                                                                          |
| Confianza               | Verificado                                                                  |
| Esfuerzo                | S                                                                           |
| Ámbito                  | Código                                                                      |
| Ubicación               | `pages/about.vue:321` (`'Imagen ' + (idx + 1) + ' de la galería sobre mí'`) |
| Dispositivo / navegador | Google Imágenes y lectores de pantalla                                      |
| Referencias             | WCAG 1.1.1; Google «Image SEO best practices»                               |
| Relacionado con         | A11Y-004                                                                    |

**Descripción.** Las 50 fotos comparten un `alt` sin información, y los nombres de archivo son `N_250px.webp`.

**Recomendación.** Un array con `alt` descriptivo por foto («Taller con Raspberry Pi y estación meteorológica…») y
nombres de archivo descriptivos.

---

### SEO-011 — `og:locale:alternate = en_US` sin versión en inglés

| Campo                   | Valor                       |
| ----------------------- | --------------------------- |
| Severidad               | Baja                        |
| Prioridad               | P3                          |
| Confianza               | Verificado                  |
| Esfuerzo                | XS                          |
| Ámbito                  | Ambos                       |
| Ubicación               | `nuxt.config.ts:76`         |
| Dispositivo / navegador | Redes sociales              |
| Referencias             | `TODO.md` (ya identificado) |
| Relacionado con         | —                           |

**Descripción.** Se anuncia una alternativa en inglés que no existe.

**Recomendación.** Eliminar la etiqueta hasta tener la versión `/en` con hreflang (plan en `TODO.md`).

---

## Identidad de marca y presencia

- La búsqueda web no está disponible en el entorno de la auditoría: **no se ha podido comprobar `site:raupulus.dev`**
  ni las SERP de marca. Recomendación: revisar en Google Search Console los informes «Páginas» (soft-404,
  duplicadas, redirecciones) y «Rendimiento» por consultas de marca («Raúl Caro Pastorino», «raupulus»).
- Los perfiles de `/social` deberían enlazar a `https://raupulus.dev` (enlaces recíprocos), y el nombre, la foto y
  el rol deberían ser idénticos en todos ellos. No se ha podido verificar perfil a perfil (anti-bot).
- **Oportunidades de contenido** (sin volúmenes inventados): el blog está en construcción y el valor diferencial del
  sitio son los proyectos IoT (estación meteorológica, medidor de consumo, detector de rayos…). Publicar cada
  proyecto como página indexable (SEO-001) con guías paso a paso es la palanca principal. Las búsquedas de nicho del
  tipo «estación meteorológica Raspberry Pi Pico» o «medidor de consumo eléctrico ESP32» encajan con ese contenido.
- **Buscadores con IA:** el contenido de proyectos en HTML, el JSON-LD completo y un `llms.txt` opcional (prioridad
  baja) facilitan que el sitio se cite.
- **Search Console y Bing Webmaster Tools:** enviar `sitemap.xml`, revisar la cobertura tras corregir SEO-002 y
  SEO-004 y activar alertas.

## Verificado y correcto

- ✅ `robots.txt` permite todo y declara el sitemap con URL absoluta; no bloquea `/_nuxt/`.
- ✅ `/blog` (en construcción) lleva `noindex, follow` en el código actual y `@nuxtjs/sitemap` lo excluye
  automáticamente del sitemap (7 URLs en el build sin proyectos).
- ✅ `error.vue` declara `noindex, follow`.
- ✅ Un único `<title>` y una única `meta description` por página en el HTML final (unhead deduplica bien las
  definiciones de `nuxt.config.ts`, `app.vue` y cada página).
- ✅ Atributo `lang="es"` en `<html>`.
- ✅ HTML válido en la home (W3C Nu Checker: 0 errores). En otras páginas hay errores menores: `srcset` de la
  galería (BUG-008), CSS inválido `align-items: top` y `line-clamp` en `components/grid/Projects.vue` y
  `projectShow.vue`, y saltos de encabezado (`evidencias/validacion-html-w3c.txt`).
- ✅ Todas las imágenes del DOM tienen atributo `alt` (axe y extracción DOM: `imgsNoAlt = 0`).
- ✅ Enlaces internos y externos del build: sin enlaces rotos reales (`evidencias/enlaces-linkinator.tsv`); los 7
  avisos de LinkedIn (999), npm, CodePen, Printables, Stack Overflow (403) y Facebook (400) son bloqueos anti-bot.
  Verificados manualmente con agente de navegador: Telegram, Bluesky, Mastodon y las webs de `/webs` responden 200.
- ✅ HTTP→HTTPS con un único 301.

## No verificado

- ⚠️ SERP reales e indexación (`site:`), Search Console y Bing Webmaster: sin acceso.
- ⚠️ Rich Results Test y validator.schema.org: herramientas interactivas no automatizables desde el entorno.
- ⚠️ Previsualizaciones reales en LinkedIn, X o WhatsApp: se ha analizado el marcado, no el resultado en cada red.
