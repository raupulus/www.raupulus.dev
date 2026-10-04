import type { ImageType } from "@/types/ImageType";
import type { TechnologyType } from "@/types/TechnologyType";
import type { AuthorType } from "@/types/Platform/AuthorType";
import type { ContentPageResumeType } from "@/types/Platform/ContentPageResumeType";
import type { ContentResumeType } from "@/types/Platform/ContentResumeType";
import type { PlatformSocialNetworkType } from '@/types/Platform/PlatformSocialNetworkType';

/**
 * Ficha de una plataforma (`GET /platforms/{slug}`).
 */
export type PlatformDataType = {
    id: number
    name: string
    title: string
    slug: string
    description: string | null
    domain: string | null
    url_about?: string | null
    image?: ImageType
    social_networks?: PlatformSocialNetworkType
    author?: AuthorType
    technologies: TechnologyType[]
    contents: ContentResumeType
    pages: ContentPageResumeType[]
    created_at?: string
}
