# Componentes UI Reutilizables

Componentes de interfaz compartidos entre páginas: tarjetas, badges, formularios, grids y alertas.

## Índice

| Componente              | Archivo                                 | Descripción                                             |
| ----------------------- | --------------------------------------- | ------------------------------------------------------- |
| `StackBadgeHexagon`     | `components/StackBadgeHexagon.vue`      | Badge hexagonal SVG con slot para imagen/icono          |
| `CardProjectHorizontal` | `components/card/ProjectHorizontal.vue` | Tarjeta de proyecto horizontal                          |
| `CardProjectVertical`   | `components/card/ProjectVertical.vue`   | Tarjeta de proyecto vertical                            |
| `GridProjects`          | `components/grid/Projects.vue`          | Grid de tarjetas de proyectos con eventos de navegación |
| `GridTechnologies`      | `components/grid/Technologies.vue`      | Grid de tecnologías para filtrado                       |
| `UiMaterialIcon`        | `components/ui/MaterialIcon.vue`        | Icono Material Symbols SVG inline self-hosted           |

## Componentes clave

### `StackBadgeHexagon`

Badge hexagonal con SVG y slot. Usado en la página home para mostrar el stack tecnológico.

**Props**: `text: string`, `color: string`, `colorLight: string`
**Slot**: contenido interior (generalmente `<NuxtImg>` con icono de tecnología)

### `GridProjects`

Grid que renderiza tarjetas de proyectos y gestiona apertura de modales.

**Props**:

- `projects: ContentType[]` — array de proyectos
- `slugContent: string` — slug del proyecto activo
- `slugPage: string` — slug de la página activa
- `openProjetOnLoad: boolean` — si debe abrir un proyecto al cargar

**Eventos emitidos**:

- `@slugchange(contentSlug, pageSlug)` — al cambiar de proyecto/página
- `@metatagchange(title, description, keywords, url, image)` — al cambiar metatags

### `GridTechnologies`

Grid de tecnologías disponibles para filtrado en la página de proyectos.

**Props**:

- `technologies: TechnologyType[]` — lista de tecnologías
- `technologySelect: string` — slug de la tecnología seleccionada

**Eventos emitidos**:

- `@clickTechnologySelect({ technologySelect: slug })` — al seleccionar una tecnología

## Convenciones de nomenclatura

- Auto-importados por Nuxt con nombre PascalCase basado en directorio + nombre
- Ejemplo: `components/card/ProjectVertical.vue` → `<CardProjectVertical />`
- Ejemplo: `components/grid/Technologies.vue` → `<GridTechnologies />`

## Relaciones con otros módulos

- → [types.md](./types.md): usan `ContentType`, `TechnologyType`, `MetadataType`
- → [pagina-proyectos.md](./pagina-proyectos.md): `GridProjects` y `GridTechnologies` usados en la página de proyectos
- → [pagina-home.md](./pagina-home.md): `StackBadgeHexagon` usado en el hero
- → [design-system.md](./design-system.md): todos usan tokens del design system
