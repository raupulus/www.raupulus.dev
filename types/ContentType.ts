import { MetadataType } from "./MetadataType"
import { TechnologyType } from "./TechnologyType"

export type ContentType = {
    title: string,
    slug: string,
    is_featured?: string,
    urlImageSmall?: string,
    urlImageMedium: string,
    urlImage: string,
    total_pages?: number,
    categories?: string[],
    tags?: string[],
    metadata?: MetadataType,
    technologies?: TechnologyType[],
}
