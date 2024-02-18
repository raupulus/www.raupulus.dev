import { type SocialNetworkType } from "@/types/SocialNetworkType"

export type AuthorType = {
    name: string,
    nick: string,
    url_image_micro: string,
    url_image_small: string,
    profession: string,
    web: string,
    social_networks: SocialNetworkType[]
}
