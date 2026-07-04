# SEO y Sitemap

Estrategia SEO del portfolio con metatags dinámicos por página, Open Graph, Twitter Cards y sitemap XML generado automáticamente con rutas dinámicas de proyectos.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `app.vue` | SEO global (`useSeoMeta`, `useHead`) |
| `nuxt.config.ts` | Metatags por defecto en `app.head.meta`, config de sitemap |
| Cada `pages/*.vue` | SEO específico por página con `useHead()` |

## SEO Global (`app.vue`)

```typescript
useSeoMeta({
  description: webDescription,
  ogTitle: webTitle,
  ogDescription: webDescription,
  ogImage: '/logo_512x512.png',
  ogUrl: 'https://raupulus.dev',
  twitterTitle: webTitle,
  twitterDescription: webDescription,
  twitterImage: '/logo_512x512.png',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: { lang: 'es' },
  link: [{ rel: 'icon', type: 'image/ico', href: '/favicon.ico' }]
})
```

## Metatags por Defecto (`nuxt.config.ts → app.head.meta`)

| Meta | Contenido |
|------|-----------|
| `description` | Portfolio de presentación con la información de Raúl Caro Pastorino... |
| `application-name` | raupulus.dev |
| `keywords` | Raúl Caro Pastorino, raupulus, desarrollador, ... |
| `author` | Raúl Caro Pastorino |
| `twitter:card` | summary_large_image |
| `twitter:site` | @raupulus |
| `twitter:creator` | @raupulus |
| `og:type` | website |
| `og:url` | https://raupulus.dev |
| `og:locale` | es_ES |
| `og:locale:alternate` | en_US |

## Datos estructurados JSON-LD (`app.vue`)

`app.vue` inyecta un bloque `application/ld+json` global con un `@graph` de dos entidades:

- **`Person`** (`#person`): nombre, alias, foto, `jobTitle`, `knowsAbout` y `sameAs` con los perfiles sociales
- **`WebSite`** (`#website`): nombre del sitio, idioma y `publisher` → `#person`

## Página de error y noindex

- `error.vue` (raíz del proyecto) renderiza el 404/500 con el design system, `robots: noindex` y CTAs a inicio/proyectos. En SSG genera `.output/public/404.html`, que Apache sirve con `ErrorDocument 404` (sin soft-404)
- `/blog` está en `noindex, follow` **temporalmente** mientras no tenga contenido real; revertir a `index, follow` al publicar entradas

## Canonical y og:url dinámicos (`app.vue`)

`app.vue` genera para **cada ruta** un `<link rel="canonical">` y un `og:url` calculados como `APP_URL + route.path` (la home usa la URL raíz sin barra final). Esto cubre todas las páginas prerenderizadas, incluidas las rutas dinámicas de proyectos. Las páginas no necesitan declarar su propio canonical.

## SEO por Página

Cada página define `useHead()` con:

| Página | Title | Imagen OG |
|--------|-------|-----------|
| `/` | Raúl Caro Pastorino - Desarrollador Web Backend | (global) |
| `/projects` | Proyectos de Raúl Caro Pastorino | `/social/projects.webp` |
| `/about` | Sobre mí - Raúl Caro Pastorino | `/social/about.webp` |
| `/blog` | Blog Técnico \| Raúl Caro Pastorino | (global) |
| `/contact` | Contacto - Raúl Caro Pastorino | `/social/contact.webp` |
| `/social` | Redes Sociales de Raúl Caro Pastorino | `/social/social.webp` |
| `/webs` | Sitios webs creados por Raúl Caro Pastorino | `/social/webs.webp` |
| `/privacy` | Política de Privacidad - Raúl Caro Pastorino | `/social/privacy.webp` |

## SEO Dinámico (Proyectos)

La página de proyectos actualiza metatags dinámicamente al abrir un proyecto:

```typescript
const handleChangeMetatags = (newTitle, newDescription, newKeywords, newUrl, newImage) => {
  metadatas.title = newTitle || defaultTitle;
  // ...
  useHead({ title: metadatas.title, meta: [...] });
};
```

## Sitemap XML (`@nuxtjs/sitemap`)

### Configuración

```typescript
sitemap: {
  exclude: ['/admin/**', '/login'],
  urls: async () => {
    const projects = await usefetchProjectsPaginated();
    return projects.flatMap(project => [
      { loc: `/projects/${project.slug}`, changefreq: 'weekly', priority: 0.9, lastmod: project.updated_at },
      ...project.pages_slug?.map(pageSlug => ({
        loc: `/projects/${project.slug}/${pageSlug}`, changefreq: 'weekly', priority: 0.7, lastmod: project.updated_at
      })) ?? []
    ]);
  },
  defaults: { changefreq: 'weekly', priority: 0.5, lastmod: new Date() }
}
```

### Prioridades

| Tipo | Prioridad | Frecuencia |
|------|-----------|------------|
| Páginas estáticas | 0.5 | weekly |
| Proyectos | 0.9 | weekly |
| Páginas de proyecto | 0.7 | weekly |

## Imágenes OG

Las imágenes para Open Graph están en `public/social/`:
- `about.webp`, `contact.webp`, `projects.webp`, `social.webp`, `webs.webp`, `privacy.webp`

## Favicons

Ubicados en `public/favicons/`:
- `favicon.ico`, `apple-touch-icon.png`, `favicon-32x32.png`, `favicon-16x16.png`, `site.webmanifest`
- También: `android-chrome-192x192.png`, `android-chrome-512x512.png`

## Relaciones con otros módulos

- → [nuxt-config.md](./nuxt-config.md): configuración de sitemap y metatags globales
- → [composables.md](./composables.md): `usefetchProjectsPaginated()` para URLs del sitemap
- → [pagina-proyectos.md](./pagina-proyectos.md): SEO dinámico por proyecto
