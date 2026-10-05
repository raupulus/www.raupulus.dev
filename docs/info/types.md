# Sistema de Tipos TypeScript

Todos los tipos TypeScript del proyecto, organizados en `types/`. Modelan los datos de la **API V2** (`/api/v2`) y la aplicación.

## Índice de tipos

### Tipos principales (`types/`)

| Archivo                | Tipo(s)                                                                             | Descripción                                                          |
| ---------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `ApiResponse.ts`       | `ApiResponseType<T>`, `ApiMetaType`                                                 | Envelope común de la API V2 y paginación (`meta`)                    |
| `ContentType.ts`       | `ContentType`, `ContentTypeRefType`, `ContentTaxonomyType`, `ContentTaxonomiesType` | Contenido (`ContentResource`) con las partes del detalle e `include` |
| `ContentPageType.ts`   | `ContentPageType`, `ContentPageIndexType`, `ContentPageFormatType`                  | Página completa e índice de páginas de un contenido                  |
| `ImageType.ts`         | `ImageType`, `ImageThumbnailsType`, `ImageSizeType`                                 | Imagen de la API (`SocialImageResource`) con miniaturas              |
| `BlocksType.ts`        | `BlocksType` + subtipos                                                             | Bloques de contenido del editor (EditorJS)                           |
| `MetadataType.ts`      | `MetadataType`                                                                      | Enlaces externos de un proyecto                                      |
| `TechnologyType.ts`    | `TechnologyType`                                                                    | Tecnología con nombre, slug, color e imagen                          |
| `GalleryPathType.ts`   | `GalleryPathType`                                                                   | Par thumbnail/image para galerías                                    |
| `SocialNetworkType.ts` | `SocialNetworkType`                                                                 | Red social del autor                                                 |

### Tipos de plataforma (`types/Platform/`)

| Archivo                        | Tipo                        | Descripción                                                        |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------ |
| `PlatformDataType.ts`          | `PlatformDataType`          | Ficha de la plataforma (`GET /platforms/{slug}`)                   |
| `AuthorType.ts`                | `AuthorType`                | Autor de la plataforma                                             |
| `ContentResumeType.ts`         | `ContentResumeType`         | Total de contenidos publicados y por tipo                          |
| `ContentPageResumeType.ts`     | `ContentPageResumeType`     | Forma compacta de un contenido (páginas, relacionados, destacados) |
| `PlatformSocialNetworkType.ts` | `PlatformSocialNetworkType` | IDs de redes sociales de la plataforma                             |

---

## Detalle de cada tipo

### `ApiResponseType<T>` / `ApiMetaType`

```typescript
type ApiResponseType<T> = {
    success: boolean;
    message: string;
    data: T;
    meta?: ApiMetaType; // sólo en colecciones paginadas
    errors?: Record<string, string[]>; // sólo en errores con detalle (422)
};

type ApiMetaType = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
};
```

### `ImageType`

```typescript
type ImageType = {
    url: string; // original (puede pesar varios MB)
    width?: number;
    height?: number;
    type?: string;
    alt?: string;
    thumbnails?: { micro?: string; small?: string; medium?: string; large?: string }; // webp
};
```

Usar `imageUrl(image, 'small' | 'medium' | 'large')` (`utils/ContentUtils.ts`) para elegir miniatura con caída al original.

### `ContentType`

```typescript
type ContentType = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    type?: { id; slug; name; plural_name? };
    status?: { id; slug; name };
    is_featured?: boolean;
    image: ImageType | null;
    seo_title?: string | null; // og_title del SEO o el título
    seo_description?: string | null; // descripción del SEO o el extracto
    pages_count?: number;
    views_count?: number;
    published_at?: string | null;
    created_at?: string;
    updated_at?: string;

    // Sólo en el detalle
    pages?: ContentPageIndexType[]; // índice sin texto
    first_page?: ContentPageType | null; // primera página con su texto

    // Sólo con ?include=
    metadata?: MetadataType | null;
    technologies?: TechnologyType[];
    taxonomies?: { categories; subcategories; tags }; // ContentTaxonomyType[]
};
```

**Relaciones**: contiene `ImageType`, `MetadataType`, `TechnologyType[]`, `ContentPageIndexType[]`. Usado en `projectsData.ts`, página de proyectos, tarjetas y modal de proyecto.

### `ContentPageType` / `ContentPageIndexType`

```typescript
type ContentPageType = {
    id: number;
    content_id: number;
    order: number;
    title: string;
    slug: string;
    format: 'editorjs' | 'markdown' | 'html'; // formato de body
    source_format?: ContentPageFormatType;
    body: BlocksType; // la web pide siempre ?format=editorjs
    current_page_raw_id?: number | null;
    created_at?: string;
    updated_at?: string;
};

type ContentPageIndexType = { id; order; title; slug; format }; // sin texto
```

**Relaciones**: contiene `BlocksType`. Usado en `fetchPageData.ts`, `projectsData.ts` y modal de proyecto.

### `BlocksType` y subtipos (16 tipos)

Estructura de contenido del editor EditorJS:

```typescript
type BlocksType = {
    time: number;
    blocks: BlockType[];
    version: string;
};

type BlockType = {
    id: string;
    type: string; // Discriminador: paragraph, header, code, image, etc.
    tunes?: BlockTunesType; // { textVariant?: string }
};
```

| Subtipo              | type        | Campos data                                                                                                                                                                                               |
| -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BlockParagraphType` | `paragraph` | `text`                                                                                                                                                                                                    |
| `BlockHeaderType`    | `header`    | `text`, `level`                                                                                                                                                                                           |
| `BlockCodeType`      | `code`      | `code`, `language`, `showlinenumbers`                                                                                                                                                                     |
| `BlockImageType`     | `image`     | `file` (con urls, meta), `caption`, `withBorder`, `withBackground`, `stretched`                                                                                                                           |
| `BlockListType`      | `list`      | `style` (ordered/unordered/checklist), `meta?` (`counterType`, `start`), `items[]`: textos (formato antiguo) o `BlockListItemType` `{ content, meta?.checked, items[] }` anidables (`@editorjs/list` 2.x) |
| `BlockCheckListType` | `checklist` | `items[{ text, checked }]`                                                                                                                                                                                |
| `BlockQuoteType`     | `quote`     | `text`, `caption`, `alignment`                                                                                                                                                                            |
| `BlockWarningType`   | `warning`   | `title`, `message`                                                                                                                                                                                        |
| `BlockAlertType`     | `alert`     | `type` (info/success/warning/danger/...), `title`, `message`, `align`                                                                                                                                     |
| `BlockDelimiterType` | `delimiter` | (vacío)                                                                                                                                                                                                   |
| `BlockTableType`     | `table`     | `content[][]`, `withHeadings`                                                                                                                                                                             |
| `BlockEmbedType`     | `embed`     | `link`, `service`, `source`, `embed`, `width`, `height`, `caption`                                                                                                                                        |
| `BlockLinkToolType`  | `linkTool`  | `link`, `meta` (title, description, keywords, image, content_page_id)                                                                                                                                     |
| `BlockAttachesType`  | `attaches`  | `file` (url, title, name, extension, mime, size, ...), `title`                                                                                                                                            |
| `BlockRawType`       | `raw`       | `html`                                                                                                                                                                                                    |

### `MetadataType`

```typescript
type MetadataType = {
    web?: string | null;
    telegram_channel?: string | null;
    youtube_channel?: string | null;
    youtube?: string | null; // unificado por prepareDataMetadata()
    youtube_video?: string | null;
    youtube_video_id?: string | null;
    gitlab?: string | null;
    github?: string | null;
    mastodon?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    twitch?: string | null;
};
```

### `TechnologyType`

```typescript
type TechnologyType = {
    id?: number;
    name: string;
    slug: string;
    color?: string | null;
    image: string | null; // miniatura pequeña
};
```

### `GalleryPathType`

```typescript
interface GalleryPathType {
    thumbnail: string;
    image: string;
}
```

### `SocialNetworkType`

```typescript
type SocialNetworkType = {
    slug: string;
    name: string;
    color: string;
    nick: string;
    url: string;
    url_image: string;
};
```

### `PlatformDataType`

```typescript
type PlatformDataType = {
    id: number;
    name: string;
    title: string;
    slug: string;
    description: string | null;
    domain: string | null;
    url_about?: string | null;
    image?: ImageType;
    social_networks?: PlatformSocialNetworkType;
    author?: AuthorType;
    technologies: TechnologyType[];
    contents: ContentResumeType;
    pages: ContentPageResumeType[];
    created_at?: string;
};
```

### `AuthorType`

```typescript
type AuthorType = {
    name: string;
    nick: string;
    image: string | null;
    url_image_micro: string;
    url_image_small: string;
    profession: string | null;
    web: string | null;
    social_networks: SocialNetworkType[];
};
```

### `ContentResumeType`

```typescript
type ContentResumeType = {
    total: number;
    types: { id; slug; name; plural_name; description; total }[];
};
```

### `ContentPageResumeType`

```typescript
type ContentPageResumeType = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image: ImageType | null;
    type: ContentTypeRefType;
    is_featured: boolean;
    published_at: string | null;
};
```

### `PlatformSocialNetworkType`

```typescript
type PlatformSocialNetworkType = {
    youtube_channel_id: string | null;
    youtube_presentation_video_id: string | null;
    twitter: string | null;
    mastodon: string | null;
    twitch: string | null;
    tiktok: string | null;
    instagram: string | null;
};
```

## Relaciones con otros módulos

- → [composables.md](./composables.md): todos los composables importan y usan estos tipos
- → [utils.md](./utils.md): `ContentUtils.ts` trabaja sobre `ImageType`, `ContentType`, `ContentPageType` y `ApiResponseType`
- → [componentes-content-blocks.md](./componentes-content-blocks.md): los bloques usan `Block*Type`
- → [componentes-ui.md](./componentes-ui.md): tarjetas usan `ContentType`, `TechnologyType`
- → [pagina-proyectos.md](./pagina-proyectos.md): usa `ContentType`, `ApiMetaType`
