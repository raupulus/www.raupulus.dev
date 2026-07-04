# Sistema de Tipos TypeScript

Todos los tipos TypeScript del proyecto, organizados en `types/`. Modelan los datos de la API y la aplicación.

## Índice de tipos

### Tipos principales (`types/`)

| Archivo | Tipo(s) | Descripción |
|---------|---------|-------------|
| `ContentType.ts` | `ContentType` | Proyecto/contenido de la plataforma |
| `ContentPageType.ts` | `ContentPageType`, `ContentPageImageType` | Página individual de un contenido |
| `BlocksType.ts` | `BlocksType` + 15 subtipos | Bloques de contenido del editor (EditorJS) |
| `MetadataType.ts` | `MetadataType` | Enlaces externos de un proyecto |
| `PaginationType.ts` | `PaginationType` | Respuesta de paginación de la API |
| `TechnologyType.ts` | `TechnologyType` | Tecnología con nombre, slug y colores |
| `SearchParamsType.ts` | `SearchParamsType` | Parámetros de búsqueda |
| `GalleryPathType.ts` | `GalleryPathType` | Par thumbnail/image para galerías |
| `SocialNetworkType.ts` | `SocialNetworkType` | Red social del autor |
| `ApiResponse.ts` | `ApiPaginatedResponse<T>`, `ApiSingleResponse<T>` | Wrappers genéricos de respuesta API |

### Tipos de plataforma (`types/Platform/`)

| Archivo | Tipo | Descripción |
|---------|------|-------------|
| `PlatformDataType.ts` | `PlatformDataType` | Datos globales de la plataforma |
| `AuthorType.ts` | `AuthorType` | Datos del autor |
| `ContentResumeType.ts` | `ContentResumeType` | Resumen de contenidos por tipo |
| `ContentPageResumeType.ts` | `ContentPageResumeType` | Resumen de una página |
| `PlatformSocialNetworkType.ts` | `PlatformSocialNetworkType` | IDs de redes sociales de la plataforma |

---

## Detalle de cada tipo

### `ContentType`

```typescript
type ContentType = {
  title: string
  slug: string
  excerpt: string
  is_featured?: string
  urlImageSmall?: string
  urlImageMedium: string
  urlImage: string
  created_at?: string
  updated_at?: string
  created_at_human?: string
  total_pages?: number
  categories?: string[]
  tags?: string[]
  metadata?: MetadataType
  technologies?: TechnologyType[]
  pages_slug?: string[]
}
```

**Relaciones**: contiene `MetadataType` y `TechnologyType[]`. Usado en `projectsData.ts`, página de proyectos, tarjetas de proyecto.

### `ContentPageType`

```typescript
type ContentPageType = {
  id: number
  content: BlocksType          // Parseado desde JSON string
  title: string
  slug: string
  order?: number
  images?: ContentPageImageType // { medium, normal, large }
}
```

**Relaciones**: contiene `BlocksType`. Usado en `fetchPageData.ts` y modal de proyecto.

### `BlocksType` y subtipos (16 tipos)

Estructura de contenido del editor EditorJS:

```typescript
type BlocksType = {
  time: number
  blocks: BlockType[]
  version: string
}

type BlockType = {
  id: string
  type: string           // Discriminador: paragraph, header, code, image, etc.
  tunes?: BlockTunesType // { textVariant?: string }
}
```

| Subtipo | type | Campos data |
|---------|------|-------------|
| `BlockParagraphType` | `paragraph` | `text` |
| `BlockHeaderType` | `header` | `text`, `level` |
| `BlockCodeType` | `code` | `code`, `language`, `showlinenumbers` |
| `BlockImageType` | `image` | `file` (con urls, meta), `caption`, `withBorder`, `withBackground`, `stretched` |
| `BlockListType` | `list` | `style` (ordered/unordered), `items[]` |
| `BlockCheckListType` | `checklist` | `items[{ text, checked }]` |
| `BlockQuoteType` | `quote` | `text`, `caption`, `alignment` |
| `BlockWarningType` | `warning` | `title`, `message` |
| `BlockAlertType` | `alert` | `type` (info/success/warning/danger/...), `title`, `message`, `align` |
| `BlockDelimiterType` | `delimiter` | (vacío) |
| `BlockTableType` | `table` | `content[][]`, `withHeadings` |
| `BlockEmbedType` | `embed` | `link`, `service`, `source`, `embed`, `width`, `height`, `caption` |
| `BlockLinkToolType` | `linkTool` | `link`, `meta` (title, description, keywords, image, content_page_id) |
| `BlockAttachesType` | `attaches` | `file` (url, title, name, extension, mime, size, ...), `title` |
| `BlockRawType` | `raw` | `html` |

### `MetadataType`

```typescript
type MetadataType = {
  web?: string
  telegram_channel?: string
  youtube_channel?: string
  youtube?: string
  youtube_video?: string
  gitlab?: string
  github?: string
  mastodon?: string
  twitter?: string
  linkedin?: string
  twitch?: string
}
```

### `PaginationType`

```typescript
type PaginationType = {
  totalElements: number
  totalPages: number
  quantity_contents_current_page: number
  quantity_contents_per_page: number
  hasBackPage: boolean
  hasNextPage: boolean
  currentPage: number
}
```

### `TechnologyType`

```typescript
type TechnologyType = {
  name: string
  slug: string
  urlImageSmall: string
  color?: string
  colorLight?: string
}
```

### `SearchParamsType`

```typescript
type SearchParamsType = {
  search?: string
  page?: number
  quantity?: number
  technology?: number
  technology_id?: number
  category?: number
  category_id?: number
  orderBy?: []
  orderDirection?: string
}
```

### `GalleryPathType`

```typescript
interface GalleryPathType {
  thumbnail: string
  image: string
}
```

### `SocialNetworkType`

```typescript
type SocialNetworkType = {
  slug: string
  name: string
  color: string
  nick: string
  url: string
  url_image: string
}
```

### `ApiPaginatedResponse<T>` / `ApiSingleResponse<T>`

```typescript
interface ApiPaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

interface ApiSingleResponse<T> {
  data: T
  message?: string
}
```

### `PlatformDataType`

```typescript
type PlatformDataType = {
  title: string
  slug: string
  description: string
  domain: string
  url_about?: string
  technologies: TechnologyType[]
  contents: ContentResumeType
  pages: ContentPageResumeType
  social_networks?: PlatformSocialNetworkType
}
```

### `AuthorType`

```typescript
type AuthorType = {
  name: string
  nick: string
  url_image_micro: string
  url_image_small: string
  profession: string
  web: string
  social_networks: SocialNetworkType[]
}
```

### `ContentResumeType`

```typescript
type ContentResumeType = {
  total?: number
  types: { slug: string, name: string, plural_name: string, description: string, quantity: number }
}
```

### `ContentPageResumeType`

```typescript
type ContentPageResumeType = {
  title: string
  slug: string
  excerpt: string
  url_image_small: string
  url_image_medium: string
}
```

### `PlatformSocialNetworkType`

```typescript
type PlatformSocialNetworkType = {
  youtube_channel_id: string
  youtube_presentation_video_id: string
  twitter: string
  mastodon: string
  twitch: string
  tiktok: string
  instagram: string
}
```

## Relaciones con otros módulos

- → [composables.md](./composables.md): todos los composables importan y usan estos tipos
- → [componentes-content-blocks.md](./componentes-content-blocks.md): los bloques usan `Block*Type`
- → [componentes-ui.md](./componentes-ui.md): tarjetas usan `ContentType`, `TechnologyType`
- → [pagina-proyectos.md](./pagina-proyectos.md): usa `ContentType`, `PaginationType`, `SearchParamsType`
