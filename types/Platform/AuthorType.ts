import type { SocialNetworkType } from '@/types/SocialNetworkType';

export type AuthorType = {
    name: string;
    nick: string;
    image: string | null;
    url_image_micro: string;
    url_image_small: string;
    profession: string | null;
    web: string | null;
    social_networks: SocialNetworkType[];
};
