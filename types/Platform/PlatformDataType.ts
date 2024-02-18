import { type TechnologyType } from "@/types/TechnologyType";
import { type ContentPageResumeType } from "@/types/Platform/ContentPageResumeType";
import { type ContentResumeType } from "@/types/Platform/ContentResumeType";
import { type PlatformSocialNetworkType } from '@/types/Platform/PlatformSocialNetworkType';

export type PlatformDataType = {
    title: string
    slug: string
    description: string
    domain: string
    url_about?: string
    technologies: TechnologyType[]
    contents: ContentResumeType
    pages: ContentPageResumeType
    social_networks?: PlatformSocialNetworkType,
}
