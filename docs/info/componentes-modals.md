# Componentes Modales

Modales overlay para visualización de contenido y formularios. Ubicados en `components/modals/`.

## Índice

| Componente | Archivo | Usado en | Descripción |
|-----------|---------|----------|-------------|
| `ModalsImageSlide` | `components/modals/ImageSlide.vue` | `pages/about.vue` | Slideshow de galería con navegación |
| `ModalsProjectShow` | `components/modals/projectShow.vue` | `components/grid/Projects.vue` | Detalle de proyecto con páginas de contenido |
| `ModalsSubmitContact` | `components/modals/submitContact.vue` | `pages/contact.vue` | Confirmación y resultado del envío de contacto |

## `ModalsImageSlide` — Galería de imágenes

Slideshow modal para la galería de fotos de la página About.

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `show` | `boolean` | Visibilidad del modal |
| `galleryPaths` | `GalleryPathType[]` | Array de rutas thumbnail/image |
| `selectedIndex` | `number` | Índice de la imagen seleccionada |

### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `update:show` | `boolean` | Cierra el modal |

### Funcionalidad

- Navegación entre imágenes (anterior/siguiente)
- Muestra imagen a tamaño completo (`_1280px.webp`)
- Overlay con click para cerrar

## `ModalsProjectShow` — Detalle de proyecto

Modal que muestra el contenido completo de un proyecto con sus páginas internas.

### Funcionalidad

- Carga datos del proyecto via `useGetProjectBySlug(slug)`
- Renderiza páginas de contenido usando `usePageData()`
- Navegación entre páginas del proyecto
- Muestra metadata (enlaces a GitHub, GitLab, YouTube, etc.)
- Muestra tecnologías usadas
- Actualiza URL y metatags dinámicamente

### Relaciones

- Usa `ContentType` para datos del proyecto
- Usa `ContentPageType` y `BlocksType` para renderizar páginas
- Delega renderizado de bloques a `components/content/blocks/Block.vue`

## `ModalsSubmitContact` — Confirmación de contacto

Modal multi-paso para la confirmación y resultado del envío del formulario de contacto.

### Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `show` | `boolean` | Visibilidad del modal |
| `step` | `number` | Paso actual (1: resumen, 2: enviando, 3: resultado) |
| `messages` | `{ success: string[], errors: string[] }` | Mensajes de resultado |
| `dataForm` | `FormData` | Datos del formulario para mostrar resumen |

### Eventos

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `cancel` | — | Cancela y cierra el modal |
| `submit` | `Event` | Confirma el envío |
| `finished` | — | Finaliza y cierra |

## Gestión de Scroll

Todos los modales interactúan con `useScrollDisabled()`:
- Al abrir: `scrollDisabled.value = true` → `app.vue` añade `disable-scroll` al body
- Al cerrar: `scrollDisabled.value = false` → se restaura el scroll

## Relaciones con otros módulos

- → [composables.md](./composables.md): `useScrollDisabled()`, `useGetProjectBySlug()`, `usePageData()`
- → [types.md](./types.md): `GalleryPathType`, `ContentType`, `ContentPageType`, `BlocksType`
- → [componentes-content-blocks.md](./componentes-content-blocks.md): renderizado de bloques de contenido
- → [pagina-about.md](./pagina-about.md): `ModalsImageSlide` usado en galería
- → [pagina-contact.md](./pagina-contact.md): `ModalsSubmitContact` usado en formulario
- → [pagina-proyectos.md](./pagina-proyectos.md): `ModalsProjectShow` abierto desde `GridProjects`
