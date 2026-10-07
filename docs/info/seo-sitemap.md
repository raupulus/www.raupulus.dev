# SEO y Sitemap

Estrategia SEO del portfolio con metatags dinámicos por página, Open Graph, Twitter Cards y sitemap XML generado automáticamente con rutas dinámicas de proyectos.

## Archivos principales

| Archivo            | Rol                                                        |
| ------------------ | ---------------------------------------------------------- |
| `app.vue`          | SEO global (`useSeoMeta`, `useHead`)                       |
| `nuxt.config.ts`   | Metatags por defecto en `app.head.meta`, config de sitemap |
| Cada `pages/*.vue` | SEO específico por página con `useHead()`                  |

## SEO Global (`app.vue`)

```typescript
useSeoMeta({
    description: webDescription,
    ogTitle: webTitle,
    ogDescription: webDescription,
    ogImage: '/social/home.webp',
    ogUrl: 'https://raupulus.dev',
    twitterTitle: webTitle,
    twitterDescription: webDescription,
    twitterImage: '/social/home.webp',
    twitterCard: 'summary_large_image',
});

useHead({
    htmlAttrs: { lang: 'es' },
    link: [{ rel: 'icon', type: 'image/ico', href: '/favicon.ico' }],
});
```

## Metatags por Defecto (`nuxt.config.ts → app.head.meta`)

| Meta                  | Contenido                                                              |
| --------------------- | ---------------------------------------------------------------------- |
| `description`         | Portfolio de presentación con la información de Raúl Caro Pastorino... |
| `application-name`    | raupulus.dev                                                           |
| `keywords`            | Raúl Caro Pastorino, raupulus, desarrollador, ...                      |
| `author`              | Raúl Caro Pastorino                                                    |
| `twitter:card`        | summary_large_image                                                    |
| `twitter:site`        | @raupulus                                                              |
| `twitter:creator`     | @raupulus                                                              |
| `og:type`             | website                                                                |
| `og:url`              | https://raupulus.dev                                                   |
| `og:locale`           | es_ES                                                                  |
| `og:locale:alternate` | en_US                                                                  |

## Datos estructurados JSON-LD

Además del bloque global `@graph` en `app.vue` (`Person` enriquecida con `knowsAbout`, `sameAs` y `WebSite`), cada página inyecta su propio esquema JSON-LD tipado para mejorar el SEO y los fragmentos enriquecidos:

- **Home (`/`)**: `ProfilePage` con entidad principal `Person`, `jobTitle`, `sameAs` y contacto.
- **Proyectos (`/projects/...`)**: `CollectionPage` con `ItemList` en catálogo; `SoftwareSourceCode` o `CreativeWork` en vista de detalle con `BreadcrumbList`.
- **Sobre Mí (`/about/`)**: `ProfilePage` con metadatos profesionales del desarrollador.
- **Contacto (`/contact/`)**: `ContactPage` con canal oficial de contacto.
- **Redes Sociales (`/social/`)**: `CollectionPage` con perfiles y canales de comunicación.
- **Sitios Web (`/webs/`)**: `CollectionPage` con la selección de plataformas y aplicaciones.
- **Blog (`/blog/...`)**: `Blog` con `ItemList` en catálogo; `TechArticle` con `BreadcrumbList` en cada artículo y lectura.

## Robots.txt y Directivas de Indexación

- `public/robots.txt` permite el rastreo general del sitio (`Allow: /`) e incluye directivas `Disallow` explícitas para artefactos técnicos no destinados a indexación (`/_proxy/`, `/200.html`, `/404.html`, `/_payload.json`, `/*_payload.json`).
- `error.vue` (raíz del proyecto) renderiza el 404/500 con el design system, `robots: noindex` y CTAs a inicio/proyectos. En SSG genera `.output/public/404.html`, que Apache sirve con `ErrorDocument 404` (sin soft-404)
- `/blog` y todas sus subpáginas (`/blog/:slug/:page`) tienen `robots: 'index, follow'` y están completamente indexadas al disponer de contenidos reales y estructura dinámica.

## Canonical y og:url dinámicos (`app.vue`)

`app.vue` genera para **cada ruta** un `<link rel="canonical">` y un `og:url` calculados como `APP_URL + route.path` (la home usa la URL raíz sin barra final). Esto cubre todas las páginas prerenderizadas, incluidas las rutas dinámicas de proyectos. Las páginas no necesitan declarar su propio canonical.

## SEO por Página

Cada página define `useHead()` con:

| Página      | Title                                           | Imagen OG               |
| ----------- | ----------------------------------------------- | ----------------------- |
| `/`         | Raúl Caro Pastorino - Desarrollador Web Backend | (global)                |
| `/projects` | Proyectos de Raúl Caro Pastorino                | `/social/projects.webp` |
| `/about`    | Sobre mí - Raúl Caro Pastorino                  | `/social/about.webp`    |
| `/blog`     | Blog Técnico \| Raúl Caro Pastorino             | `/social/blog.webp`     |
| `/contact`  | Contacto - Raúl Caro Pastorino                  | `/social/contact.webp`  |
| `/social`   | Redes Sociales de Raúl Caro Pastorino           | `/social/social.webp`   |
| `/webs`     | Sitios webs creados por Raúl Caro Pastorino     | `/social/webs.webp`     |
| `/privacy`  | Política de Privacidad - Raúl Caro Pastorino    | `/social/privacy.webp`  |

## SEO Dinámico (Proyectos y Blog)

Tanto en proyectos como en blog, las páginas actualizan metatags dinámicamente al abrir un contenido o página específica:

- Título enriquecido: `"{Título página} - {Título artículo} | Raúl Caro Pastorino"`
- Descripción, keywords y URLs canónicas específicas
- Open Graph y Twitter Cards enriquecidas con la imagen de portada y fecha de publicación
- Esquema Schema.org estructurado (`SoftwareSourceCode` o `TechArticle`)
- Descubrimiento automático de RSS: etiqueta `<link rel="alternate" type="application/rss+xml" title="Blog de Raúl Caro Pastorino (RSS)" href="/blog/feed.xml">` en todas las páginas del blog

## Feed RSS 2.0 (`/blog/feed.xml` y `/blog/rss.xml`)

El blog ofrece un feed RSS 2.0 estándar generado por Nitro que sindica todas las publicaciones con título, enlace permanente, fecha UTC, resumen y carátula social (`/social/blog.webp`), optimizado para lectores de feeds (Feedly, Thunderbird, Newsboat, etc.).

## Sitemap XML (`@nuxtjs/sitemap`)

### Configuración

```typescript
sitemap: {
  exclude: ['/admin/**', '/login'],
  urls: async () => {
    const projects = await usefetchProjectsPaginated();
    const blogPosts = await useFetchBlogPaginated();

    const projectUrls = projects.flatMap(project => [
      { loc: `/projects/${project.slug}`, changefreq: 'weekly', priority: 0.9, lastmod: project.updated_at },
      ...project.pages?.map(page => ({
        loc: `/projects/${project.slug}/${page.slug}`, changefreq: 'weekly', priority: 0.7, lastmod: project.updated_at
      })) ?? []
    ]);

    const blogUrls = blogPosts.flatMap(post => [
      ...post.pages?.map(page => ({
        loc: `/blog/${post.slug}/${page.slug}`, changefreq: 'weekly', priority: 0.8, lastmod: post.updated_at
      })) ?? []
    ]);

    const catalogUrls = [
      { loc: '/projects/', changefreq: 'daily', priority: 0.9, lastmod: new Date().toISOString() },
      { loc: '/blog/', changefreq: 'daily', priority: 0.9, lastmod: new Date().toISOString() }
    ];

    return [...catalogUrls, ...projectUrls, ...blogUrls];
  },
  defaults: { changefreq: 'weekly', priority: 0.5, lastmod: new Date() }
}
```

### Prioridades

| Tipo                | Prioridad | Frecuencia |
| ------------------- | --------- | ---------- |
| Páginas estáticas   | 0.5       | weekly     |
| Proyectos           | 0.9       | weekly     |
| Páginas de proyecto | 0.7       | weekly     |
| Artículos de blog   | 0.8       | weekly     |

## Imágenes OG

Las imágenes para Open Graph están en `public/social/`:

- `about.webp`, `contact.webp`, `projects.webp`, `social.webp`, `webs.webp`, `privacy.webp`

## Favicons

Ubicados en `public/favicons/`:

- `favicon.ico`, `apple-touch-icon.png`, `favicon-32x32.png`, `favicon-16x16.png`, `site.webmanifest`
- También: `android-chrome-192x192.png`, `android-chrome-512x512.png`

## Relaciones con otros módulos

- → [nuxt-config.md](./nuxt-config.md): configuración de sitemap y metatags globales
- → [composables.md](./composables.md): `usefetchProjectsPaginated()` y `useFetchBlogPaginated()` para URLs del sitemap
- → [pagina-proyectos.md](./pagina-proyectos.md): SEO dinámico por proyecto
- → [pagina-blog.md](./pagina-blog.md): SEO dinámico por artículo de blog
