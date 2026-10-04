# Bloques de Contenido (EditorJS)

Sistema de renderizado de bloques de contenido procedentes del editor EditorJS del backend. Cada tipo de bloque tiene su componente Vue correspondiente y un dispatcher central.

## Archivos (`components/content/blocks/`)

| Componente | Tipo de bloque | Descripción |
|-----------|---------------|-------------|
| `Block.vue` | (dispatcher) | Componente dispatcher que renderiza el bloque correcto según `block.type` |
| `BlockParagraph.vue` | `paragraph` | Párrafo con HTML sanitizado. Soporta variantes vía `tunes.textVariant`: `citation` (renderiza `<cite>`), `call-out` (bocadillo destacado) y `details` (renderiza `<details>/<summary>` plegable como elemento raíz, fuera del `<p>`, por validez HTML) |
| `BlockHeader.vue` | `header` | Encabezado h1-h6 según `level` |
| `BlockCode.vue` | `code` | Bloque de código con lenguaje, numeración de líneas, escape seguro de entidades y botón accesible de copiado al portapapeles con confirmación visual |
| `BlockImage.vue` | `image` | Imagen con caption computada sin mutación de props, borde, background y stretched opcionales |
| `BlockList.vue` | `list` | Lista ordenada, desordenada o checklist con salto de línea natural (`overflow-wrap: break-word`). Admite el formato antiguo (textos) y el de `@editorjs/list` 2.x (anidada, `meta.counterType`/`meta.start`); delega en `BlockListItems.vue` (recursivo) |
| `BlockCheckList.vue` | `checklist` | Lista de verificación con checks y ajuste de palabras accesible |
| `BlockQuote.vue` | `quote` | Cita con texto, caption y alineación, con texto fluido sin ruptura indiscriminada de palabras |
| `BlockWarning.vue` | `warning` | Mensaje de aviso con título |
| `BlockAlert.vue` | `alert` | Alerta con tipo (info/success/warning/danger), título, mensaje y alineación |
| `BlockDelimiter.vue` | `delimiter` | Separador visual horizontal |
| `BlockTable.vue` | `table` | Tabla con cabeceras opcionales. Con `withHeadings`, la primera fila de `content` se renderiza en `<thead>` y el resto (`bodyRows`) en `<tbody>`, prefijando cada celda con su cabecera para vista responsive |
| `BlockEmbed.vue` | `embed` | Contenido embebido (YouTube, Vimeo, Twitter, etc.) con `title` accesible, `sandbox` restringido, `loading="lazy"` y `referrerpolicy="strict-origin-when-cross-origin"` |
| `BlockLinkTool.vue` | `linkTool` | Preview de enlace externo con meta (título, descripción, imagen) |
| `BlockAttaches.vue` | `attaches` | Archivo adjunto descargable con metadatos |
| `BlockRaw.vue` | `raw` | HTML crudo (usa `sanitizeRawHtml` para XSS) |

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
