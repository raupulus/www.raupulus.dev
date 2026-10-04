# Página de Proyectos

Página con listado paginado de proyectos consumidos desde la API, con búsqueda por texto, filtrado por tecnología y visualización de detalle con páginas estáticas completas prerenderizadas en SSG. Usa ruta catch-all para resolver el catálogo, slug de proyecto y subpáginas.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/projects/[...slugs].vue` | Página principal (catch-all route: catálogo y páginas de detalle) |
| `composables/projectsData.ts` | Lógica de datos: carga, paginación, búsqueda y obtención de proyecto |
| `composables/fetchPageData.ts` | Normalización y carga de páginas individuales |
| `composables/platformData.ts` | Datos de plataforma (tecnologías para filtros) |
| `components/grid/Projects.vue` | Grid semántico de tarjetas de proyectos |
| `components/grid/Technologies.vue` | Botones de tecnologías para filtrado accesible con `aria-pressed` |
| `components/card/Project.vue` | Tarjeta de proyecto |
| `components/card/ProjectHorizontal.vue` | Tarjeta horizontal semántica con stretched link `NuxtLink` |
| `components/card/ProjectVertical.vue` | Tarjeta vertical semántica con stretched link `NuxtLink` |
| `components/content/blocks/*.vue` | Bloques de contenido EditorJS renderizados en el detalle estático |
| `utils/TechnologyUtils.ts` | `getTechnologyBySlug()` |

## Rutas

| URL | Parámetros | Comportamiento |
|-----|-----------|----------------|
| `/projects/` | `slugs = []` | Listado completo de proyectos con buscador y filtros |
| `/projects/:slugContent/` | `slugs[0]` | Página estática completa del proyecto (detalle y primera página) |
| `/projects/:slugContent/:slugPage/` | `slugs[0]`, `slugs[1]` | Página estática completa de la subpágina del proyecto |

## Flujo de datos

1. **Modo Catálogo (`/projects/`)**:
   - `useProjectsData()` carga la primera página de proyectos.
   - "Cargar más" invoca `fetchNextPage()` que incrementa `currentPage` y concatena resultados.
   - **Búsqueda**: `projectsDataSearch({ search, technology })` limpia datos y carga todas las páginas de resultados.
   - **Filtrado por tecnología**: `handleClickTechnology()` conmuta el filtro con botones `<button :aria-pressed="...">`.
2. **Modo Detalle (`/projects/:slug/` y `/projects/:slug/:page/`)**:
   - Prerenderizado estático (SSG) mediante `useAsyncData('project-detail-' + slug, ...)`.
   - Si no existe el proyecto o subpágina en servidor, lanza error 404 (`createError`).
   - Carga la página activa y sus bloques de contenido EditorJS normalizados con `normalizePage()`.
   - Renderiza un único `<h1>` por página (el título del proyecto o subpágina), migas de pan semánticas y enlaces entre páginas.
3. **SEO y Metadatos**:
   - `useHead()` reactivo con título contextualizado, descripción, canonical exacto con barra final y `og:image`.
   - Esquemas JSON-LD Schema.org embebidos: `BreadcrumbList` y `SoftwareSourceCode` (o `CreativeWork`).

## Endpoints API consumidos (API V2)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/platforms/portfolio` | GET | Ficha de la plataforma (tecnologías del filtro) |
| `/platforms/portfolio/contents?type=project` | GET | Listado paginado / búsqueda de proyectos |
| `/platforms/portfolio/contents/:slug?include=pages,taxonomies,technologies,metadata,first_page&format=editorjs` | GET | Detalle de un proyecto y primera página |
| `/platforms/portfolio/contents/:slug/pages/:order?format=editorjs` | GET | Subpágina de un proyecto por su número de orden |
| `/platforms/portfolio/contents/:slug/pages?limit=100` | GET | Índice de páginas para prerender/sitemap |

## Relaciones con otros módulos

- → [composables.md](./composables.md): `useProjectsData()`, `projectsDataSearch()`, `getPlatformData()`
- → [types.md](./types.md): `ContentType`, `ApiMetaType`, `TechnologyType`, `MetadataType`
- → [componentes-ui.md](./componentes-ui.md): `GridProjects`, `GridTechnologies`
- → [componentes-content-blocks.md](./componentes-content-blocks.md): bloques de contenido del proyecto
- → [utils.md](./utils.md): `getTechnologyBySlug()`, `buildProjectMetatags()`
