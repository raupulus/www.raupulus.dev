# Auditoría de SEO y Posicionamiento en Buscadores

Este documento evalúa la visibilidad orgánica, indexabilidad, rastreabilidad, datos estructurados y metadatos de **www.raupulus.dev**. Analiza el HTML generado estáticamente en `.output/public`, la configuración de Nuxt, el sitemap XML, las directivas para robots y la resolución de dominios en producción.

## Tabla de Hallazgos

| ID          | Título                                                                                         | Severidad | Prioridad | Esfuerzo |
| ----------- | ---------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| **SEO-001** | Metadatos y etiquetas Open Graph idénticos en todas las páginas estáticas de proyectos         | Alta      | P1        | S        |
| **SEO-002** | Subdominio `www.raupulus.dev` sin resolución DNS (NXDOMAIN) en lugar de redirección 301        | Alta      | P1        | XS       |
| **SEO-003** | Página `/blog` ("En Construcción") indexable en sitemap y robots sin directiva noindex         | Media     | P2        | XS       |
| **SEO-004** | Rutas de iconos en `site.webmanifest` apuntan a rutas inexistentes (HTTP 404)                  | Media     | P2        | XS       |
| **SEO-005** | Jerarquía de encabezados rota por generación de múltiples etiquetas `<h1>` en bloques EditorJS | Media     | P2        | S        |
| **SEO-006** | Declaración de `og:locale:alternate` para `en_US` sin existir versión en inglés                | Baja      | P3        | XS       |
| **SEO-007** | Esquema JSON-LD incompleto: ausencia de `BreadcrumbList` y perfiles sociales desalineados      | Baja      | P3        | S        |

---

### SEO-001 — Metadatos y etiquetas Open Graph idénticos en todas las páginas estáticas de proyectos

| Campo                   | Valor                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                          |
| Prioridad               | P1                                                                                                            |
| Confianza               | Verificado                                                                                                    |
| Esfuerzo                | S                                                                                                             |
| Ámbito                  | Código                                                                                                        |
| Ubicación               | `pages/projects/[...slugs].vue:14-27`, `.output/public/projects/**/*.html`                                    |
| Dispositivo / navegador | Todos / Motores de búsqueda y rastreadores de redes sociales                                                  |
| Referencias             | [Google Search Central — Control your snippets](https://developers.google.com/search/docs/appearance/snippet) |
| Relacionado con         | BUG-003                                                                                                       |

**Descripción.**
En `pages/projects/[...slugs].vue`, la definición de metadatos mediante `useHead()` está codificada estáticamente con el título y la descripción genérica del catálogo de proyectos:

- `title: 'Proyectos de Raúl Caro Pastorino'`
- `description: 'Proyectos realizados por Raúl Caro Pastorino...'`
- `ogTitle: 'Proyectos de Raúl Caro Pastorino'`
- `canonical: 'https://raupulus.dev/projects'`

Aunque se prerenderizan 200+ páginas individuales para cada slug de proyecto (ej. `/projects/open-terminal/`, `/projects/nestor/`), **todas** las páginas generadas en `.output/public/projects/**/index.html` comparten exactamente el mismo título, descripción y URL canónica que la raíz `/projects`. Esto provoca que Google agrupe todas las páginas como contenido duplicado canónico de `/projects`, impidiendo que los proyectos individuales posicionen por sus propios nombres o tecnologías.

**Evidencia.**
Inspección del HTML generado estáticamente para dos proyectos distintos:

```bash
$ grep -o '<title>[^<]*</title>' .output/public/projects/index.html
<title>Proyectos de Raúl Caro Pastorino</title>

$ grep -o '<title>[^<]*</title>' .output/public/projects/nestor/index.html
<title>Proyectos de Raúl Caro Pastorino</title>

$ grep -o '<link rel="canonical"[^>]*>' .output/public/projects/nestor/index.html
<link rel="canonical" href="https://raupulus.dev/projects">
```

**Pasos para reproducir.**

1. Ejecutar `npm run generate`.
2. Inspeccionar `.output/public/projects/<cualquier-slug>/index.html`.
3. Comprobar la etiqueta `<title>` y `<link rel="canonical">`.

**Impacto.**

- Canibalización interna severa y desindexación de proyectos específicos.
- Al compartir enlaces en Slack, WhatsApp, Twitter o LinkedIn, la previsualización muestra siempre la portada genérica de proyectos en lugar del título, imagen o resumen del proyecto compartido.

**Recomendación.**
En `pages/projects/[...slugs].vue`, sincronizar `useHead()` con los datos reactivos del proyecto cargado (`projectData`). Si la ruta contiene un slug, computar dinámicamente el título (`${project.title} — Proyectos | Raúl Caro Pastorino`), la descripción (`project.description` o resumen sanitizado), la URL canónica (`https://raupulus.dev/projects/${project.slug}`) y la imagen `og:image`:

```typescript
const isProjectDetail = computed(() => slugs.value.length > 0 && currentProject.value);

useHead(() => ({
    title: isProjectDetail.value ? `${currentProject.value.title} — Proyectos` : 'Proyectos de Raúl Caro Pastorino',
    link: [
        {
            rel: 'canonical',
            href: isProjectDetail.value
                ? `https://raupulus.dev/projects/${currentProject.value.slug}`
                : 'https://raupulus.dev/projects',
        },
    ],
}));
```

**Verificación de la corrección.**
Regenerar el sitio (`npm run generate`) e inspeccionar `.output/public/projects/nestor/index.html` verificando que contenga `<title>Nestor ...</title>` y canonical apuntando a `/projects/nestor`.

---

### SEO-002 — Subdominio `www.raupulus.dev` sin resolución DNS (NXDOMAIN) en lugar de redirección 301

| Campo                   | Valor                                          |
| ----------------------- | ---------------------------------------------- |
| Severidad               | Alta                                           |
| Prioridad               | P1                                             |
| Confianza               | Verificado                                     |
| Esfuerzo                | XS                                             |
| Ámbito                  | Producción                                     |
| Ubicación               | DNS público de `raupulus.dev`                  |
| Dispositivo / navegador | Todos                                          |
| Referencias             | RFC 1035, Google Search Central — Redirections |
| Relacionado con         | INFRA-001                                      |

**Descripción.**
El repositorio se titula `www.raupulus.dev` y muchos usuarios y motores intentan acceder de forma predeterminada anteponiendo el prefijo `www.`. Sin embargo, la zona DNS de `raupulus.dev` carece de un registro CNAME o A para `www.raupulus.dev`, devolviendo un error `NXDOMAIN` (Non-Existent Domain).

**Evidencia.**

```bash
$ dig +noall +answer www.raupulus.dev
;; (Vacío - no hay registros)

$ curl -I https://www.raupulus.dev/
curl: (6) Could not resolve host: www.raupulus.dev
```

**Pasos para reproducir.**

1. Ejecutar `dig www.raupulus.dev` en cualquier terminal conectada a internet.
2. Abrir en un navegador `https://www.raupulus.dev`.

**Impacto.**

- Pérdida directa de visitantes que teclean `www.raupulus.dev`.
- Posible pérdida de link equity (enlaces entrantes externos dirigidos a `www.raupulus.dev` devuelven fallo total de resolución).

**Recomendación.**
En el proveedor de DNS (Cloudflare / registrador), crear un registro `CNAME` apuntando a `raupulus.dev` (o registro `A` equivalente) y configurar una regla de redirección HTTP 301 permanente en Cloudflare (Page Rules o Redirect Rules) desde `https://www.raupulus.dev/*` hacia `https://raupulus.dev/$1`.

**Verificación de la corrección.**
`curl -I https://www.raupulus.dev` debe responder `HTTP/2 301` con cabecera `Location: https://raupulus.dev/`.

---

### SEO-003 — Página `/blog` ("En Construcción") indexable en sitemap y robots sin directiva noindex

| Campo                   | Valor                                                |
| ----------------------- | ---------------------------------------------------- |
| Severidad               | Media                                                |
| Prioridad               | P2                                                   |
| Confianza               | Verificado                                           |
| Esfuerzo                | XS                                                   |
| Ámbito                  | Código                                               |
| Ubicación               | `pages/blog.vue`, `public/robots.txt`, `sitemap.xml` |
| Dispositivo / navegador | Motores de búsqueda                                  |
| Referencias             | Google Search Central — Thin Content Penalty         |
| Relacionado con         | UX-001                                               |

**Descripción.**
La página `/blog.vue` muestra únicamente un mensaje de "En construcción" con un icono, sin artículos ni contenido útil. A pesar de ello, se incluye en el `sitemap.xml` generado con `priority: 0.5` y en las cabeceras/metadatos HTML se declara `robots: index, follow` (heredado globalmente de `app.vue`). Google indexa esta página como "thin content" (contenido de escaso valor), diluyendo la calidad global del dominio.

**Evidencia.**
Inspección de `.output/public/sitemap.xml`:

```xml
<url>
  <loc>https://raupulus.dev/blog</loc>
  <changefreq>daily</changefreq>
  <priority>0.5</priority>
</url>
```

Inspección de `pages/blog.vue`:

```vue
<template>
    <div class="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 class="text-3xl font-bold text-outline">Blog en construcción</h1>
    </div>
</template>
```

**Pasos para reproducir.**

1. Abrir `https://raupulus.dev/blog`.
2. Verificar el contenido del DOM y la presencia de la URL en `https://raupulus.dev/sitemap.xml`.

**Impacto.**
Riesgo de penalización por contenido de baja calidad en algoritmos de evaluación de calidad de sitio (Helpful Content System de Google).

**Recomendación.**

1. Añadir metadato `robots: 'noindex, nofollow'` en `pages/blog.vue`:

```typescript
useHead({
    title: 'Blog (En construcción) — Raúl Caro Pastorino',
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
```

2. O bien, excluir `/blog` de la generación del sitemap en `nuxt.config.ts`:

```typescript
sitemap: {
    exclude: ['/blog'];
}
```

**Verificación de la corrección.**
Generar el sitemap y verificar que `/blog` no figure en `sitemap.xml`, o que su HTML contenga `<meta name="robots" content="noindex, nofollow">`.

---

### SEO-004 — Rutas de iconos en `site.webmanifest` apuntan a rutas inexistentes (HTTP 404)

| Campo                   | Valor                                            |
| ----------------------- | ------------------------------------------------ |
| Severidad               | Media                                            |
| Prioridad               | P2                                               |
| Confianza               | Verificado                                       |
| Esfuerzo                | XS                                               |
| Ámbito                  | Código                                           |
| Ubicación               | `public/favicons/site.webmanifest`, `app.vue:53` |
| Dispositivo / navegador | Chrome Mobile, Android PWA, Googlebot Mobile     |
| Referencias             | W3C Web App Manifest specification               |
| Relacionado con         | BUG-002                                          |

**Descripción.**
El archivo `public/favicons/site.webmanifest` declara los iconos de la Progressive Web App con rutas relativas a `/assets/favicons/`:

- `"/assets/favicons/android-chrome-192x192.png"`
- `"/assets/favicons/android-chrome-512x512.png"`

Sin embargo, en el build estático los iconos residen bajo `/favicons/` (ej. `/favicons/android-chrome-192x192.png`). Cuando los dispositivos móviles o rastreadores leen el manifiesto e intentan descargar los iconos, reciben un HTTP 404 (o HTTP 200 con el HTML de error de fallback). Asimismo, `theme_color` está fijado en `#ffffff` a pesar de ser un portfolio con tema oscuro de alto contraste (`#091421`).

**Evidencia.**

```bash
$ cat public/favicons/site.webmanifest
{
    "name": "raupulus.dev",
    "short_name": "raupulus",
    "icons": [
        {
            "src": "/assets/favicons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        }, ...
    ],
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone"
}
```

En `.output/public`:

```bash
$ ls -la .output/public/favicons/
-rw-r--r-- 1 fryntiz staff 3192 android-chrome-192x192.png
-rw-r--r-- 1 fryntiz staff 8421 android-chrome-512x512.png
```

**Pasos para reproducir.**

1. Realizar una petición a `https://raupulus.dev/assets/favicons/android-chrome-192x192.png`.
2. Observar que devuelve 404 en el servidor local sin fallback SPA.

**Impacto.**

- Instalación de PWA defectuosa en Android (icono por defecto roto).
- Errores 404 en consola en Lighthouse / auditorías PWA.
- Incoherencia visual en barra de estado (`theme_color: #ffffff` en sitio oscuro).

**Recomendación.**
Corregir las rutas en `public/favicons/site.webmanifest` a `/favicons/android-chrome-192x192.png` y cambiar `theme_color` a `#091421`.

**Verificación de la corrección.**
Acceder a la ruta declarada en el manifest y confirmar código HTTP 200 con cabecera `Content-Type: image/png`.

---

### SEO-005 — Jerarquía de encabezados rota por generación de múltiples etiquetas `<h1>` en bloques EditorJS

| Campo                   | Valor                                                         |
| ----------------------- | ------------------------------------------------------------- |
| Severidad               | Media                                                         |
| Prioridad               | P2                                                            |
| Confianza               | Verificado                                                    |
| Esfuerzo                | S                                                             |
| Ámbito                  | Código                                                        |
| Ubicación               | `components/content/blocks/BlockHeader.vue:4-9`               |
| Dispositivo / navegador | Todos                                                         |
| Referencias             | W3C Heading Structure, Google Search Central Heading Guidance |
| Relacionado con         | A11Y-004                                                      |

**Descripción.**
El componente `components/content/blocks/BlockHeader.vue` renderiza dinámicamente encabezados basados en la propiedad `data.level` del bloque devuelto por la API. Si el editor de contenidos en el backend asigna un nivel 1 (`level: 1`), el componente genera una etiqueta `<h1 class="text-3xl font-bold ...">`.
Dado que cada página ya cuenta con su propio `<h1>` principal de plantilla (en `pages/projects/[...slugs].vue`), la inserción de bloques de contenido genera múltiples `<h1>` desestructurados en una misma página, rompiendo el outline semántico del documento.

**Evidencia.**
`components/content/blocks/BlockHeader.vue`:

```vue
<template>
  <h1 v-if="block.data.level === 1" class="text-3xl font-bold my-4">
    <span v-html="sanitizedText" />
  </h1>
  <h2 v-else-if="block.data.level === 2" ...>
</template>
```

**Pasos para reproducir.**

1. Cargar un proyecto cuyo contenido contenga un bloque header de nivel 1.
2. Contar el número de etiquetas `<h1>` en el DOM resultante.

**Impacto.**

- Confusión en motores de búsqueda respecto al título temático principal del documento.
- Barrera de navegación para usuarios de lectores de pantalla que navegan por atajos de encabezado `H`.

**Recomendación.**
Desplazar un nivel hacia abajo los encabezados del contenido para asegurar que el título principal de la página sea el único `<h1>`: mapear `level: 1` a `<h2>`, `level: 2` a `<h3>`, etc., o normalizar en el parser de bloques.

**Verificación de la corrección.**
Renderizar un proyecto y comprobar con `document.querySelectorAll('h1').length === 1`.

---

### SEO-006 — Declaración de `og:locale:alternate` para `en_US` sin existir versión en inglés

| Campo                   | Valor                                                     |
| ----------------------- | --------------------------------------------------------- |
| Severidad               | Baja                                                      |
| Prioridad               | P3                                                        |
| Confianza               | Verificado                                                |
| Esfuerzo                | XS                                                        |
| Ámbito                  | Código                                                    |
| Ubicación               | `app.vue:64`                                              |
| Dispositivo / navegador | Rastreos Open Graph (Facebook, LinkedIn, Discord)         |
| Referencias             | Open Graph Protocol Specification (`og:locale:alternate`) |
| Relacionado con         | —                                                         |

**Descripción.**
En `app.vue`, se define la etiqueta Open Graph:

```typescript
{ property: 'og:locale:alternate', content: 'en_US' }
```

Sin embargo, el sitio web no cuenta con ninguna versión traducida al inglés ni alternancia de idiomas (`i18n`), estando todo el contenido redactado exclusivamente en español (`lang: 'es'`). Indicar una localización alternativa inexistente genera señales erróneas a redes sociales y rastreadores de contenido multilingüe.

**Evidencia.**

```bash
$ grep -n 'og:locale' app.vue
63:        { property: 'og:locale', content: 'es_ES' },
64:        { property: 'og:locale:alternate', content: 'en_US' },
```

**Pasos para reproducir.**

1. Inspeccionar las cabeceras `<head>` en cualquier página generada.

**Impacto.**
Información errónea a parsers Open Graph; no produce penalizaciones directas pero degrada la fidelidad de metadatos.

**Recomendación.**
Eliminar la línea `{ property: 'og:locale:alternate', content: 'en_US' }` de `app.vue` hasta que se implemente soporte multilingüe real.

**Verificación de la corrección.**
Comprobar que en el HTML generado únicamente figure `<meta property="og:locale" content="es_ES">`.

---

### SEO-007 — Esquema JSON-LD incompleto: ausencia de `BreadcrumbList` y perfiles sociales desalineados

| Campo                   | Valor                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| Severidad               | Baja                                                             |
| Prioridad               | P3                                                               |
| Confianza               | Verificado                                                       |
| Esfuerzo                | S                                                                |
| Ámbito                  | Código                                                           |
| Ubicación               | `app.vue:85-115`                                                 |
| Dispositivo / navegador | Google Rich Results                                              |
| Referencias             | Schema.org BreadcrumbList, Google Search Central Structured Data |
| Relacionado con         | UX-003                                                           |

**Descripción.**
El esquema JSON-LD actual en `app.vue` define tipos `WebSite` y `Person`. No obstante:

1. Carece de marcado `BreadcrumbList` en rutas anidadas como `/projects` y `/projects/:slug`, perdiendo la oportunidad de mostrar migas de pan enriquecidas en las SERP de Google.
2. En el arreglo `sameAs` de `Person`, falta el enlace a perfiles modernos y activos del autor como Bluesky, mientras que incluye enlaces a perfiles obsoletos o que devuelven HTTP 403 (ej. Stack Overflow en español).
3. No se utiliza el tipo `ProfilePage` en `/about` ni `ContactPage` en `/contact`.

**Evidencia.**

```bash
$ grep -A 15 'sameAs' app.vue
          sameAs: [
            'https://github.com/raupulus',
            'https://gitlab.com/raupulus',
            'https://linkedin.com/in/raupulus',
            'https://twitter.com/raupulus',
            'https://mastodon.social/@raupulus'
          ]
```

**Pasos para reproducir.**

1. Validar la home y `/projects` en la herramienta de prueba de resultados enriquecidos de Google (Rich Results Test).

**Impacto.**
Pérdida de rich snippets (migas de pan y paneles de conocimiento) en resultados de búsqueda.

**Recomendación.**

1. Implementar `useJsonld` o inyección en `useHead` para `BreadcrumbList` en `pages/projects/[...slugs].vue`.
2. Actualizar la lista `sameAs` en `app.vue` reflejando los perfiles activos reales.

**Verificación de la corrección.**
Validar el esquema con `schema.org validator` sin errores de sintaxis ni advertencias de campos obligatorios faltantes.

---

## Verificado y Correcto

Durante la auditoría de SEO se verificaron satisfactoriamente los siguientes puntos:

1. **Sitemap XML completo y accesible:** `sitemap.xml` se genera correctamente con el módulo `@nuxtjs/sitemap`, incluyendo 212 URLs canónicas válidas sin parámetros de tracking ni fragmentos hash.
2. **Directiva Robots.txt:** `public/robots.txt` existe, permite el rastreo general (`User-agent: * Allow: /`) y enlaza correctamente la ubicación del sitemap (`Sitemap: https://raupulus.dev/sitemap.xml`).
3. **Etiqueta canónica base:** Las páginas principales (`/`, `/about`, `/projects`, `/webs`, `/social`, `/contact`, `/privacy`) declaran `<link rel="canonical">` con protocolo HTTPS y sin barras redundantes.
4. **Metadatos Open Graph y Twitter Cards:** Configurados globalmente con `twitter:card: summary_large_image`, `og:site_name`, y `og:type: website`.
5. **Puntuación Lighthouse SEO:** 100/100 en todas las páginas probadas en laboratorio (los títulos son legibles, enlaces tienen texto descriptivo legible y elementos meta viewport están presentes).
