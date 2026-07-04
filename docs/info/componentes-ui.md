# Componentes UI Reutilizables

Componentes de interfaz compartidos entre páginas: tarjetas, badges, formularios, grids y alertas.

## Índice

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `Alert` | `components/Alert.vue` | Alerta con tipo y mensaje |
| `HeaderImage` | `components/HeaderImage.vue` | Imagen de cabecera de sección |
| `SpecializationBadge` | `components/SpecializationBadge.vue` | Badge de especialización |
| `StackBadge` | `components/StackBadge.vue` | Badge de tecnología (rectangular) |
| `StackBadgeHexagon` | `components/StackBadgeHexagon.vue` | Badge hexagonal SVG con slot para imagen/icono |
| `Trajectory` | `components/Trajectory.vue` | Componente de trayectoria profesional |
| `BtnGeneric` | `components/btn/Generic.vue` | Botón genérico estilizado |
| `CardProject` | `components/card/Project.vue` | Tarjeta de proyecto (base) |
| `CardProjectHorizontal` | `components/card/ProjectHorizontal.vue` | Tarjeta de proyecto horizontal |
| `CardProjectVertical` | `components/card/ProjectVertical.vue` | Tarjeta de proyecto vertical |
| `CardSkill` | `components/card/Skill.vue` | Tarjeta de skill/habilidad |
| `CardVertical` | `components/card/Vertical.vue` | Tarjeta vertical genérica |
| `FormSelect` | `components/form/Select.vue` | Select personalizado |
| `GridProjects` | `components/grid/Projects.vue` | Grid de tarjetas de proyectos con eventos de navegación |
| `GridTechnologies` | `components/grid/Technologies.vue` | Grid de tecnologías para filtrado |
| `ContentPaginator` | `components/content/contentPaginator.vue` | Paginador de contenido |

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

### `FormSelect`

Selector personalizado estilizado con el design system.

## Convenciones de nomenclatura

- Auto-importados por Nuxt con nombre PascalCase basado en directorio + nombre
- Ejemplo: `components/card/Project.vue` → `<CardProject />`
- Ejemplo: `components/grid/Technologies.vue` → `<GridTechnologies />`

## Relaciones con otros módulos

- → [types.md](./types.md): usan `ContentType`, `TechnologyType`, `MetadataType`
- → [pagina-proyectos.md](./pagina-proyectos.md): `GridProjects` y `GridTechnologies` usados en la página de proyectos
- → [pagina-home.md](./pagina-home.md): `StackBadgeHexagon` usado en el hero
- → [componentes-modals.md](./componentes-modals.md): `GridProjects` abre `ModalsProjectShow`
- → [design-system.md](./design-system.md): todos usan tokens del design system
