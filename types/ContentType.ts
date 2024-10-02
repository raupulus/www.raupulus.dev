import { type MetadataType } from "@/types/MetadataType"
import { type TechnologyType } from "@/types/TechnologyType"

export type ContentType = {
    title: string,
    slug: string,
    excerpt: string,
    is_featured?: string,
    urlImageSmall?: string,
    urlImageMedium: string,
    urlImage: string,
    created_at?: string,
    updated_at?: string,
    created_at_human?: string,
    total_pages?: number,
    categories?: string[],
    tags?: string[],
    metadata?: MetadataType,
    technologies?: TechnologyType[],
    pages_slug?: string[],
}
