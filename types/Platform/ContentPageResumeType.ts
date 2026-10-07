import type { ImageType } from '@/types/ImageType';
import type { ContentTypeRefType } from '@/types/ContentType';

/**
 * Forma compacta de un contenido (páginas de la plataforma, relacionados y
 * destacados).
 */
export type ContentPageResumeType = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image: ImageType | null;
    type: ContentTypeRefType;
    is_featured: boolean;
    published_at: string | null;
};
