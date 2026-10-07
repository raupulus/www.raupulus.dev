# Página del Blog (Catálogo y Artículos)

Sección de blog técnico que consume contenidos de la API REST V2 (`type=blog`), con soporte de páginas múltiples por artículo (Opción B de enrutado), barra horizontal superior de páginas, navegación lateral sticky con tarjetitas de lectura, paginador secuencial y bloque de artículos relacionados al pie.

## Archivos principales

| Archivo                        | Rol                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `pages/blog/[...slugs].vue`    | Catch-all: gestiona catálogo (`/blog/`), redirección (`/blog/:slug/`) y lectura (`/blog/:slug/:page/`) |
| `composables/blogData.ts`      | Composable de datos: listado, búsqueda, detalle, artículos relacionados y prerender de sitemap         |
| `components/card/BlogCard.vue` | Tarjeta visual de artículo para el catálogo y carrusel inferior de relacionados                        |

## Estructura de Rutas (Opción B)

- **Catálogo / Listado**: `/blog/` (`slugs = []`)
- **Redirección de conveniencia**: `/blog/:contentSlug/` (`slugs.length === 1`) → redirige 301 a `/blog/:contentSlug/:firstPageSlug/`
- **Lectura de artículo**: `/blog/:contentSlug/:pageSlug/` (`slugs.length === 2`)

## Secciones del template

### Modo Catálogo (`/blog/`)

- **Cabecera**: Título "Mi Blog Personal", subtítulo y descripción.
- **Buscador con debounce**: Input de búsqueda reactivo sincronizado con query string (`?q=`).
- **Contador de resultados**: Total de artículos publicados devueltos por la API.
- **Grid de tarjetas**: Grid responsive con `CardBlogCard` (miniatura, categoría, fecha, tiempo de lectura, total de páginas y lecturas).
- **Carga bajo demanda**: Botón "Cargar más artículos" paginado.

### Modo Detalle (`/blog/:contentSlug/:pageSlug/`)

- **Breadcrumbs**: Migas de pan estructuradas con enlaces jerárquicos.
- **Cabecera del artículo**: Fondo difuminado con imagen del post, categoría, fecha de publicación, tiempo estimado de lectura, contador de vistas, H1 de la sección, extracto y badges tecnológicos.
- **Pestañas superiores de páginas**: Navegación horizontal rápida visible antes de comenzar la lectura (idéntica a Proyectos).
- **Layout de lectura**:
    - **Columna principal (8 cols)**: Bloques estructurados de EditorJS (`ContentBlocksBlock`: párrafos, encabezados, bloques de código con syntax highlighting, citas, tablas, imágenes, etc.).
    - **Paginador secuencial al pie**: Botones `← Anterior: [Título]` y `Siguiente: [Título] →`.
    - **Sidebar lateral sticky (4 cols)**:
        - Tarjetero con pequeñas tarjetas numeradas de cada página del artículo, resaltando la página activa con indicador de lectura y enlace directo a cada una.
        - Ficha de autor compacta con acceso al perfil.
- **Artículos relacionados**: Consulta a `/contents/:slug/related?limit=3` y renderizado de un grid de 3 tarjetas compactas al pie de la lectura para retención del usuario.

## SEO y Datos Estructurados

- Directiva de indexación: `index, follow` activa.
- Canónicas dinámicas con trailing slash (`/blog/:contentSlug/:pageSlug/`).
- **Schema.org**:
    - Catálogo: `Blog` con `ItemList`.
    - Detalle: `TechArticle` con autor `Raúl Caro Pastorino`, fecha de publicación, fecha de modificación, headline e imagen OpenGraph.

## Relaciones con otros módulos

- → [composables.md](./composables.md): `useBlogData()`, `useGetBlogPostBySlug()`, `useGetRelatedBlogPosts()`, `useFetchBlogPaginated()`.
- → [componentes-content-blocks.md](./componentes-content-blocks.md): renderizado de bloques EditorJS.
- → [layout-navegacion.md](./layout-navegacion.md): enlace a `/blog/` en `Header.vue`.
- → [seo-sitemap.md](./seo-sitemap.md): generación estática y sitemap dinámico.
