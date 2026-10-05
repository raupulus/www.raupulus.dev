# Bloques de Contenido (EditorJS)

Sistema de renderizado de bloques de contenido procedentes del editor EditorJS del backend. Cada tipo de bloque tiene su componente Vue correspondiente y un dispatcher central.

## Archivos (`components/content/blocks/`)

| Componente | Tipo de bloque | Descripción |
|-----------|---------------|-------------|
| `Block.vue` | (dispatcher) | Componente dispatcher que renderiza el bloque correcto según `block.type`. Incluye fallback seguro y estilizado con tokens de diseño para bloques no soportados |
| `BlockParagraph.vue` | `paragraph` | Párrafo con HTML sanitizado y estilos scoped compatibles con tema oscuro. Soporta variantes vía `tunes.textVariant`: `citation` (renderiza `<cite>` estilizado), `call-out` (bloque destacado con acento) y `details` (renderiza `<details>/<summary>` plegable como elemento raíz accesible) |
| `BlockHeader.vue` | `header` | Encabezado h1-h6 según `level` con soporte de formato HTML enriquecido sanitizado |
| `BlockCode.vue` | `code` | Bloque de código con lenguaje, numeración de líneas, escape seguro de entidades, icono Material (`content_copy`/`check`) y botón accesible de copiado al portapapeles con confirmación visual |
| `BlockImage.vue` | `image` | Imagen responsive sin saltos de layout (CLS), pie de foto permanente y tokens Silicon Architect |
| `BlockList.vue` | `list` | Lista ordenada, desordenada o checklist con salto de línea natural (`overflow-wrap: break-word`). Admite el formato antiguo (textos) y el de `@editorjs/list` 2.x; delega en `BlockListItems.vue` (recursivo) con tokens Tailwind |
| `BlockCheckList.vue` | `checklist` | Lista de verificación accesible con atributos ARIA (`role="checkbox"`, `aria-checked`), iconos Material y diseño Silicon Architect |
| `BlockQuote.vue` | `quote` | Cita estilizada con tokens Silicon Architect, borde de acento secundario y tipografía fluida |
| `BlockWarning.vue` | `warning` | Mensaje de advertencia con icono Material de alerta y tokens `bg-error-container/15 border-error/30 text-error` sin mutación de props |
| `BlockAlert.vue` | `alert` | Alerta accesible con `role="alert"`, soporte tipográfico y tokens de diseño oscuros adaptativos para tipos `primary`, `secondary`, `info`, `success`, `warning`, `danger`, `light` y `dark` |
| `BlockDelimiter.vue` | `delimiter` | Separador visual horizontal moderno y minimalista adaptado al design system |
| `BlockTable.vue` | `table` | Tabla responsive con scroll horizontal suave, tokens de diseño oscuros, soporte de `caption` tipado y cabeceras opcionales |
| `BlockEmbed.vue` | `embed` | Contenido embebido (YouTube, Vimeo, etc.) con contenedor responsivo `aspect-video`, `title` accesible, `sandbox` restringido, `loading="lazy"` y `referrerpolicy="strict-origin-when-cross-origin"` |
| `BlockLinkTool.vue` | `linkTool` | Tarjeta de previsualización de enlace externo con tokens Silicon Architect, hover states y badges |
| `BlockAttaches.vue` | `attaches` | Archivo adjunto descargable con metadatos tipográficos, icono Material `download` y botón accesible con `aria-label` |
| `BlockRaw.vue` | `raw` | HTML crudo (usa `sanitizeRawHtml` para protección contra XSS) |

## Flujo de renderizado

```
ContentPageType.content (BlocksType)
  └─ blocks[] (BlockType[])
      └─ Block.vue (dispatcher)
          ├─ type === 'paragraph' → BlockParagraph.vue
          ├─ type === 'header'    → BlockHeader.vue
          ├─ type === 'code'      → BlockCode.vue
          ├─ type === 'image'     → BlockImage.vue
          ├─ type === 'list'      → BlockList.vue
          ├─ type === 'embed'     → BlockEmbed.vue
          ├─ type === 'raw'       → BlockRaw.vue
          └─ ... (otros 9 tipos)
```

## Sanitización de HTML

- **`BlockParagraph`**, **`BlockHeader`**, **`BlockQuote`** y otros con texto → `sanitizeHtml()` (tags seguros)
- **`BlockRaw`** → `sanitizeRawHtml()` (permite iframe, video, audio, source)
- Ambas funciones están en `utils/sanitize.ts` y usan `isomorphic-dompurify`

## Tipos asociados

Todos definidos en `types/BlocksType.ts`. Ver → [types.md](./types.md) para detalle completo de cada `Block*Type`.

## Relaciones con otros módulos

- → [types.md](./types.md): todos los `Block*Type` desde `BlocksType.ts`
- → [utils.md](./utils.md): `sanitizeHtml()`, `sanitizeRawHtml()`
- → [composables.md](./composables.md): `usePageData()` carga las páginas con `BlocksType`
- → [pagina-proyectos.md](./pagina-proyectos.md): la página de detalle `/projects/:slug/` renderiza las páginas con estos bloques
- → [componentes-modals.md](./componentes-modals.md): `ModalsProjectShow` para vistas modales si procede
