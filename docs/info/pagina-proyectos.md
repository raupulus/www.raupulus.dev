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
5. **URL dinámica**: al abrir un proyecto, `handleChangeUrlSlug()` actualiza la URL con `window.history.pushState()` sin recarga
6. **SEO dinámico**: `handleChangeMetatags()` actualiza title, description, keywords, og:* y twitter:* al abrir un proyecto

## Endpoints API consumidos

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/platform/portfolio/content/type/project` | GET | Listado paginado de proyectos |
| `/content/portfolio/:slug/get` | GET | Detalle de un proyecto por slug |
| `/content/:slug/get/page/:order/json` | GET | Página individual de un proyecto |

## Parámetros de búsqueda (query string)

| Param | Tipo | Descripción |
|-------|------|-------------|
| `page` | number | Página actual de paginación |
| `quantity` | number | Cantidad por página (default 20 en carga, 15 en búsqueda) |
| `search` | string | Texto de búsqueda libre |
| `technology` | string | Slug de la tecnología para filtrar |

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
- → [types.md](./types.md): `ContentType`, `PaginationType`, `SearchParamsType`, `TechnologyType`, `MetadataType`
- → [componentes-ui.md](./componentes-ui.md): `GridProjects`, `GridTechnologies`
- → [componentes-modals.md](./componentes-modals.md): `ModalsProjectShow`
- → [componentes-content-blocks.md](./componentes-content-blocks.md): bloques de contenido dentro del modal del proyecto
- → [utils.md](./utils.md): `getTechnologyBySlug()`
