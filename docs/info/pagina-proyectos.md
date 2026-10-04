# Página de Proyectos

Página con listado paginado de proyectos consumidos desde la API, con búsqueda por texto, filtrado por tecnología y visualización de detalle con páginas internas. Usa ruta catch-all para resolver slug de proyecto y slug de página.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/projects/[...slugs].vue` | Página principal (catch-all route) |
| `composables/projectsData.ts` | Lógica de datos: carga, paginación, búsqueda |
| `composables/fetchPageData.ts` | Carga de páginas individuales de un proyecto |
| `composables/platformData.ts` | Datos de plataforma (tecnologías para filtros) |
| `components/grid/Projects.vue` | Grid de tarjetas de proyectos |
| `components/grid/Technologies.vue` | Grid de tecnologías para filtrado |
| `components/card/Project.vue` | Tarjeta de proyecto |
| `components/card/ProjectHorizontal.vue` | Tarjeta horizontal |
| `components/card/ProjectVertical.vue` | Tarjeta vertical |
| `components/modals/projectShow.vue` | Modal de detalle de proyecto |
| `components/content/blocks/*.vue` | Bloques de contenido del proyecto |
| `utils/TechnologyUtils.ts` | `getTechnologyBySlug()` |

## Rutas

| URL | Parámetros | Comportamiento |
|-----|-----------|----------------|
| `/projects` | — | Listado completo de proyectos |
| `/projects/:slugContent` | `slugs[0]` | Abre modal del proyecto con ese slug |
| `/projects/:slugContent/:slugPage` | `slugs[0]`, `slugs[1]` | Abre proyecto y navega a la página indicada |

## Flujo de datos

1. `useProjectsData()` carga la primera página al montar (`onMounted`)
2. "Cargar más" invoca `fetchNextPage()` que incrementa `currentPage` y concatena resultados
3. **Búsqueda**: `projectsDataSearch({ search, technology })` limpia datos y carga todas las páginas de resultados
4. **Filtrado por tecnología**: `handleClickTechnology()` → `projectsDataSearch()`
5. **Abrir proyecto** (`GridProjects.openProject()`): pinta el modal con los datos del listado, descarga el detalle y muestra la página de la URL (busca su `order` por slug en `pages`) o la primera (`first_page`, sin otra petición). Al entrar por URL (`/projects/:slug[/:page]`) se abre en `onMounted` (sólo cliente: el detalle suma visitas)
6. **Cambio de página**: `ContentPaginator` → `usePageData(order, slug)`
7. **URL dinámica**: al abrir un proyecto, `handleChangeUrlSlug()` actualiza la URL con `window.history.pushState()` sin recarga
8. **SEO dinámico**: `buildProjectMetatags()` (título SEO + página, descripción SEO, keywords de categorías/subcategorías/etiquetas/tecnologías, URL e imagen grande) y `handleChangeMetatags()` actualiza title, description, keywords, og:* y twitter:*

## Endpoints API consumidos (API V2)

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/platforms/portfolio` | GET | Ficha de la plataforma (tecnologías del filtro) |
| `/platforms/portfolio/contents?type=project` | GET | Listado paginado / búsqueda de proyectos |
| `/platforms/portfolio/contents/:slug?include=technologies,metadata,taxonomies&format=editorjs` | GET | Detalle de un proyecto (suma una visita) |
| `/platforms/portfolio/contents/:slug/pages/:order?format=editorjs` | GET | Página de un proyecto por su número |
| `/platforms/portfolio/contents/:slug/pages?limit=100` | GET | Índice de páginas para prerender/sitemap |

## Parámetros del listado (query string)

| Param | Tipo | Descripción |
|-------|------|-------------|
| `type` | string | Siempre `project` |
| `page` | number | Página actual de paginación |
| `per_page` | number | Cantidad por página (20 en carga, 25 en búsqueda, 100 en build; máx. 100) |
| `q` | string | Texto a buscar en título o extracto (desde el input de búsqueda) |
| `technology` | string | Slug de la tecnología para filtrar |

La respuesta trae `meta` (`total`, `current_page`, `last_page`…): el contador muestra `meta.total`.

> El listado no incluye tecnologías ni metadatos: las tarjetas los muestran sólo si vienen en los datos; el modal sí los tiene (detalle con `include`).

## Componentes del template

- **Indicador de tecnología activa**: muestra badge con nombre e icono de la tecnología filtrada
- **Barra de búsqueda**: input + botones buscar/limpiar
- **`GridTechnologies`**: grid de tecnologías disponibles desde `platformData.technologies`
- **`GridProjects`**: grid de tarjetas de proyectos con eventos `@slugchange` y `@metatagchange`
- **Botón "Cargar más"**: visible cuando `hasMorePages`, deshabilitado cuando `isLoading`

## SEO

- Metatags reactivos con `reactive()` que se actualizan dinámicamente
- Open Graph y Twitter Cards con imagen `/social/projects.webp`
- Al abrir un proyecto se actualizan todos los metatags al contexto del proyecto

## Relaciones con otros módulos

- → [composables.md](./composables.md): `useProjectsData()`, `projectsDataSearch()`, `getPlatformData()`
- → [types.md](./types.md): `ContentType`, `ApiMetaType`, `TechnologyType`, `MetadataType`
- → [componentes-ui.md](./componentes-ui.md): `GridProjects`, `GridTechnologies`
- → [componentes-modals.md](./componentes-modals.md): `ModalsProjectShow`
- → [componentes-content-blocks.md](./componentes-content-blocks.md): bloques de contenido dentro del modal del proyecto
- → [utils.md](./utils.md): `getTechnologyBySlug()`
