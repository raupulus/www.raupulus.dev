# 6.4 SEO técnico, on-page e identidad (SEO) — Auditoría externa deepsek-externo

Resumen: el scraping de producción pasa el bloque SEO básico (Lighthouse SEO 100 en home e /blog), pero el
listado de proyectos **no está en el HTML estático** (0 enlaces de proyecto en `/projects`), `/blog` está en
el sitemap pese a ser `noindex`, el `og:image` de la home es relativo y no de 1200×630, el `lastmod` del
sitemap es la fecha de build, y no hay datos estructurados por proyecto. El soft-404 (SEC-002) impide 404
reales. La identidad (Person/WebSite) sí está bien construida.

| ID      | Título                                                                | Sev.  | Prior. | Esf. |
| ------- | --------------------------------------------------------------------- | ----- | ------ | ---- |
| SEO-001 | `/projects` sin listado en el HTML estático (no indexable)            | Alta  | P1     | L    |
| SEO-002 | `/blog` en el sitemap pero con `noindex`                              | Media | P2     | XS   |
| SEO-003 | `og:image`/`twitter:image` relativas y no 1200×630                    | Media | P2     | S    |
| SEO-004 | Producción sin `rel=canonical` (HTML desplegado)                      | Media | P2     | S    |
| SEO-005 | `lastmod` del sitemap = fecha de build en páginas sin cambios         | Media | P2     | S    |
| SEO-006 | `twitter:card` `summary` (global) vs `summary_large_image` por página | Baja  | P3     | XS   |
| SEO-007 | Sin JSON-LD por proyecto (`BreadcrumbList`/`CreativeWork`)            | Media | P2     | M    |
| SEO-008 | `BlockHeader` puede introducir `h1` adicionales en el contenido       | Media | P2     | S    |
| SEO-009 | Sin `theme-color`; enlaces de favicon duplicados                      | Baja  | P3     | XS   |
| SEO-010 | `og:image` alojado en `raw.githubusercontent.com` en `nuxt.config`    | Baja  | P3     | S    |
| SEO-011 | `og:locale:alternate` sin versión alternativa real (`en_EN` inválido) | Baja  | P3     | XS   |

---

### SEO-001 — `/projects` sin listado en el HTML estático

| Campo       | Valor                                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| Severidad   | Alta                                                                                                        |
| Prioridad   | P1                                                                                                          |
| Confianza   | Verificado                                                                                                  |
| Esfuerzo    | L                                                                                                           |
| Ámbito      | Código                                                                                                      |
| Ubicación   | `composables/projectsData.ts:135-139` (`onMounted` → `fetchNextPage`), `.output/public/projects/index.html` |
| Referencias | Google Search Central (JavaScript SEO, contenido en HTML)                                                   |
| Relacionado | BUG-001                                                                                                     |

**Descripción.** El listado de proyectos se carga en cliente (`onMounted`), por lo que el HTML estático de
`/projects` no contiene ni un solo enlace a proyecto. Google puede renderizar JS, pero el descubrimiento de
las URLs de proyecto queda a merced de la API en tiempo de rastreo (y en producción está rota por BUG-001).

**Evidencia.**

```
$ grep -oE '/projects/[a-z0-9-]+' .output/public/projects/index.html | sort -u | wc -l
0
```

Además, en producción las peticiones fallan por CORS (BUG-001), así que el listado no aparece ni con JS.

**Impacto.** El hub de proyectos no aporta enlaces ni contenido indexable; el enlazado interno y la
profundidad de rastreo se degradan. Contradice el objetivo de SEO excelente.

**Recomendación.** Prerenderizar el primer listado (SSG/`useAsyncData` con payload) para que el HTML
contenga las tarjetas y `<a href>` de los proyectos; dejar la paginación/búsqueda en cliente. Alternativa:
generar en build un índice estático de proyectos enlazado desde `/projects`.

**Verificación de la corrección.** `grep -oE '/projects/[a-z0-9-]+' .output/public/projects/index.html | sort -u | wc -l` > 0;
Rich Results/inspección de URL ve los enlaces sin ejecutar JS.

---

### SEO-002 — `/blog` en el sitemap pero `noindex`

| Campo       | Valor                                                   |
| ----------- | ------------------------------------------------------- |
| Severidad   | Media                                                   |
| Prioridad   | P2                                                      |
| Confianza   | Verificado                                              |
| Esfuerzo    | XS                                                      |
| Ámbito      | Código                                                  |
| Ubicación   | `nuxt.config.ts:181-216` (sitemap), `pages/blog.vue:96` |
| Relacionado | CONT-001                                                |

**Descripción.** `pages/blog.vue` declara `robots: noindex, follow`, pero el sitemap incluye
`https://raupulus.dev/blog` (excluye solo `/admin/**` y `/login`). Un sitemap no debe incluir URLs `noindex`.

**Evidencia.**

```
$ curl -sS https://raupulus.dev/sitemap.xml | grep -o '<loc>[^<]*blog</loc>'
<loc>https://raupulus.dev/blog</loc>
```

**Recomendación.** Excluir `/blog` del sitemap mientras siga en construcción (o quitar `noindex` cuando
tenga contenido). Añadir a `sitemap.exclude`.

**Verificación de la corrección.** El sitemap generado no contiene `/blog`.

---

### SEO-003 — `og:image`/`twitter:image` relativas y no 1200×630

| Campo       | Valor                                                                |
| ----------- | -------------------------------------------------------------------- |
| Severidad   | Media                                                                |
| Prioridad   | P2                                                                   |
| Confianza   | Verificado                                                           |
| Esfuerzo    | S                                                                    |
| Ámbito      | Ambos                                                                |
| Ubicación   | `app.vue:11,15` (rutas relativas), `nuxt.config.ts:68,72` (terceros) |
| Referencias | Open Graph Protocol, Twitter Cards                                   |

**Descripción.** En la home, `og:image` y `twitter:image` son `/logo_512x512.png` (ruta relativa y 512×512).
Open Graph exige URL absoluta y recomienda 1200×630. Otras páginas (`/about`, `/contact`, `/projects`) sí
construyen la URL absoluta con `url + '/social/<x>.webp'`, pero el tamaño no es `og:image:alt` ni se declaran
`og:image:width/height`.

**Evidencia.**

```
$ grep -oE '<meta property="og:image"[^>]*>' .output/public/index.html
<meta property="og:image" content="/logo_512x512.png">
```

**Recomendación.** Usar URL absoluta y una imagen 1200×630 por plantilla; añadir `og:image:width`,
`og:image:height` y `og:image:alt`. Unificar el patrón de `app.vue` con el de las páginas.

**Verificación de la corrección.** `og:image` empieza por `https://raupulus.dev/`; validar previsualización
con el inspector de enlaces de LinkedIn/Telegram.

---

### SEO-004 — Producción sin `rel=canonical`

| Campo       | Valor                             |
| ----------- | --------------------------------- |
| Severidad   | Media                             |
| Prioridad   | P2                                |
| Confianza   | Verificado                        |
| Esfuerzo    | S                                 |
| Ámbito      | Producción                        |
| Ubicación   | HTML desplegado (todas las rutas) |
| Referencias | Google Search Central (canonical) |
| Relacionado | SEO-003                           |

**Descripción.** El HTML de producción no incluye `<link rel="canonical">`. El código actual sí lo añade en
`app.vue:29-39`, pero no está desplegado (producción data del 2026-09-11).

**Evidencia.** `curl -sS https://raupulus.dev/ | grep -c '<link rel="canonical"'` → `0`.

**Recomendación.** Desplegar el código actual (que ya genera canonical absoluto vía `config.public.app.url`).
Verificar que `APP_URL` de producción es `https://raupulus.dev`.

**Verificación de la corrección.** Cada URL del sitemap devuelve un canonical absoluto y único.

---

### SEO-005 — `lastmod` del sitemap = fecha de build

| Campo       | Valor                                                     |
| ----------- | --------------------------------------------------------- |
| Severidad   | Media                                                     |
| Prioridad   | P2                                                        |
| Confianza   | Verificado                                                |
| Esfuerzo    | S                                                         |
| Ámbito      | Código                                                    |
| Ubicación   | `nuxt.config.ts:211-215` (`defaults.lastmod: new Date()`) |
| Referencias | Sitemaps.org (`lastmod`)                                  |

**Descripción.** Las páginas estáticas reciben `lastmod` igual a la fecha del build, no a la de su último
cambio real. Los proyectos usan `project.updated_at` (correcto). Google desconfía de `lastmod` poco fiable.

**Evidencia.** Sitemap de producción: home/about/blog/contact/privacy/projects/social/webs con
`lastmod 2026-09-11T12:55:44Z` (fecha de build).

**Recomendación.** Para páginas sin `updated_at`, omitir `lastmod` o usar una fecha curada del contenido en
lugar de `new Date()`.

**Verificación de la corrección.** `lastmod` de las páginas estáticas no cambia en cada build.

---

### SEO-006 — `twitter:card` incoherente

| Campo       | Valor                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| Severidad   | Baja                                                                    |
| Prioridad   | P3                                                                      |
| Confianza   | Verificado                                                              |
| Esfuerzo    | XS                                                                      |
| Ámbito      | Ambos                                                                   |
| Ubicación   | `app.vue:16` (`summary`) vs `nuxt.config.ts:63` (`summary_large_image`) |
| Referencias | Twitter Cards                                                           |

**Descripción.** `app.vue` fija `twitterCard:'summary'` (sobreescribe el `summary_large_image` de
`nuxt.config`) mientras varias páginas usan `summary_large_image`. Es incoherente y con imagen 512×512 el
resultado es pobre.

**Recomendación.** Unificar en `summary_large_image` con imagen 1200×630.

**Verificación de la corrección.** `twitter:card` consistente en todas las rutas.

---

### SEO-007 — Sin JSON-LD por proyecto

| Campo       | Valor                                                             |
| ----------- | ----------------------------------------------------------------- |
| Severidad   | Media                                                             |
| Prioridad   | P2                                                                |
| Confianza   | Verificado                                                        |
| Esfuerzo    | M                                                                 |
| Ámbito      | Código                                                            |
| Ubicación   | `app.vue:43-81` (solo `Person`/`WebSite`), `types/ContentType.ts` |
| Referencias | Schema.org, Google Rich Results                                   |

**Descripción.** Solo hay `Person` y `WebSite` globales. No hay `BreadcrumbList` ni `CreativeWork`/
`SoftwareSourceCode`/`WebPage` por proyecto, ni `ProfilePage` en `/about` ni `ContactPage`.

**Recomendación.** Generar JSON-LD por proyecto con `@type: CreativeWork` + `author` (`Person`),
`dateModified`, `keywords`, `image`, y `BreadcrumbList` en las páginas de proyecto. Validar en
validator.schema.org.

**Verificación de la corrección.** Rich Results Test reconoce Breadcrumb y el tipo de proyecto sin errores.

---

### SEO-008 — `BlockHeader` puede introducir `h1` adicionales

| Campo       | Valor                                           |
| ----------- | ----------------------------------------------- |
| Severidad   | Media                                           |
| Prioridad   | P2                                              |
| Confianza   | Verificado                                      |
| Esfuerzo    | S                                               |
| Ámbito      | Código                                          |
| Ubicación   | `components/content/blocks/BlockHeader.vue:1-4` |
| Relacionado | A11Y-004                                        |

**Descripción.** Un bloque EditorJS de nivel 1 se renderiza como `<h1>` dentro del contenido, sumando un
segundo `h1` a la página del proyecto (que ya tiene el suyo).

**Recomendación.** Bajar a `<h2>` como máximo dentro del contenido (mapear `level 1 → h2`) o forzar que las
páginas de proyecto no tengan `h1` propio.

**Verificación de la corrección.** `grep -c '<h1'` = 1 en cada página generada.

---

### SEO-009 — Sin `theme-color`; favicon duplicado

| Campo       | Valor                                                                       |
| ----------- | --------------------------------------------------------------------------- |
| Severidad   | Baja                                                                        |
| Prioridad   | P3                                                                          |
| Confianza   | Verificado                                                                  |
| Esfuerzo    | XS                                                                          |
| Ámbito      | Código                                                                      |
| Ubicación   | `nuxt.config.ts:83-91`, `app.vue:30-34`, `public/favicons/site.webmanifest` |
| Relacionado | BUG-007                                                                     |

**Descripción.** No hay `<meta name="theme-color">`; el manifest usa `theme_color:#ffffff` (claro) para un
tema oscuro. Además se declaran dos favicons `.ico` (`/favicons/favicon.ico` y `/favicon.ico`).

**Recomendación.** Añadir `theme-color` acorde al tema (`#091421`) y unificar el favicon.

**Verificación de la corrección.** `theme-color` presente y coherente; sin favicon duplicado.

---

### SEO-010 — `og:image` en `raw.githubusercontent.com` (nuxt.config)

| Campo     | Valor                  |
| --------- | ---------------------- |
| Severidad | Baja                   |
| Prioridad | P3                     |
| Confianza | Verificado             |
| Esfuerzo  | S                      |
| Ámbito    | Código                 |
| Ubicación | `nuxt.config.ts:68,72` |

**Descripción.** El `app.head` fija `og:image`/`twitter:image` a una URL de
`raw.githubusercontent.com/raupulus/raupulus/...`. Es una imagen en un dominio ajeno, no controlable ni
medible, y puede desaparecer o cambiar. En la práctica lo sobreescriben `app.vue` y las páginas, pero sigue
siendo un valor por defecto frágil.

**Recomendación.** Alojar la imagen social en el propio dominio (`/social/...`) y usar esa ruta como default.

**Verificación de la corrección.** Ninguna meta social apunta a `raw.githubusercontent.com`.

---

### SEO-011 — `og:locale:alternate` sin alternativa real

| Campo     | Valor                                   |
| --------- | --------------------------------------- |
| Severidad | Baja                                    |
| Prioridad | P3                                      |
| Confianza | Verificado                              |
| Esfuerzo  | XS                                      |
| Ámbito    | Ambos                                   |
| Ubicación | `nuxt.config.ts:76`, HTML de producción |

**Descripción.** Se declara `og:locale:alternate` (`en_US` en código, `en_EN` en producción) sin que exista
versión en otro idioma ni `hreflang`. `en_EN` no es un locale BCP-47 válido.

**Recomendación.** Eliminar `og:locale:alternate` mientras no haya i18n real (o corregir a `en_US` si se
publica la versión en inglés).

**Verificación de la corrección.** Sin `og:locale:alternate` o con locale válido y página alternativa real.

---

## Verificado y correcto

- `robots.txt` accesible, sintaxis válida, con `Sitemap` absoluto y sin `Disallow` que bloquee recursos.
- Sitemap con 41 URLs (build actual), incluye home y todas las páginas de proyecto; excluye `/admin` y `/login`.
- `htmlAttrs.lang=es`, `og:locale=es_ES` coherentes.
- Contenido principal de home, `/about`, `/contact`, `/privacy`, `/webs`, `/social` presente en el HTML estático.
- Un único `<h1>` por página en las plantillas estáticas (el riesgo es solo por contenido EditorJS).
- `Person` y `WebSite` JSON-LD bien formados (URLs absolutas, `sameAs` completo).
- 42 URLs del sitemap de producción devuelven 200 (aunque sea por soft-404; ver SEC-002).
