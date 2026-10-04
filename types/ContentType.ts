import type { ImageType } from "@/types/ImageType"
import type { MetadataType } from "@/types/MetadataType"
import type { TechnologyType } from "@/types/TechnologyType"
import type { ContentPageIndexType, ContentPageType } from "@/types/ContentPageType"

/**
 * Contenido de la API V2 (`ContentResource`).
 *
 * El listado devuelve sólo los campos base. El detalle añade el índice de
 * páginas (`pages`), la primera página con su texto (`first_page`) y las
 * partes pedidas con `?include=` (`metadata`, `technologies`, `taxonomies`…).
 */
export type ContentType = {
    id: number,
    title: string,
    slug: string,
    excerpt: string | null,
    type?: ContentTypeRefType,
    status?: { id: number, slug: string, name: string },
    is_featured?: boolean,
    image: ImageType | null,
    seo_title?: string | null,
    seo_description?: string | null,
    pages_count?: number,
    views_count?: number,
    published_at?: string | null,
    created_at?: string,
    updated_at?: string,

    // Sólo en el detalle
    pages?: ContentPageIndexType[],
    first_page?: ContentPageType | null,

    // Sólo con ?include=
    metadata?: MetadataType | null,
    technologies?: TechnologyType[],
    taxonomies?: ContentTaxonomiesType,
}

export type ContentTypeRefType = {
    id: number,
    slug: string,
    name: string,
    plural_name?: string,
}

export type ContentTaxonomyType = {
    id: number,
    slug: string,
    name: string,
    color?: string | null,
    icon?: string | null,
    is_main?: boolean,
    parent?: string,
}

export type ContentTaxonomiesType = {
    categories: ContentTaxonomyType[],
    subcategories: ContentTaxonomyType[],
    tags: ContentTaxonomyType[],
}
