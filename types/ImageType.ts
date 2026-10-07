/**
 * Imagen de la API V2 (`SocialImageResource`). Las claves vacías se omiten.
 */
export type ImageType = {
    url: string;
    width?: number;
    height?: number;
    type?: string;
    alt?: string;
    thumbnails?: ImageThumbnailsType;
};

export type ImageThumbnailsType = {
    micro?: string;
    small?: string;
    medium?: string;
    large?: string;
};

export type ImageSizeType = keyof ImageThumbnailsType;
