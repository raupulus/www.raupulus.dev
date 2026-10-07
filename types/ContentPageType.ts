import type { BlocksType } from '@/types/BlocksType';

/**
 * Página completa de un contenido (`ContentPageResource`).
 *
 * La web siempre la pide con `?format=editorjs`, por lo que `body` llega
 * como objeto de bloques Editor.js.
 */
export type ContentPageType = {
    id: number;
    content_id: number;
    order: number;
    title: string;
    slug: string;
    format: ContentPageFormatType;
    source_format?: ContentPageFormatType;
    body: BlocksType;
    current_page_raw_id?: number | null;
    created_at?: string;
    updated_at?: string;
};

/**
 * Entrada del índice de páginas del detalle de un contenido (sin texto).
 */
export type ContentPageIndexType = {
    id: number;
    order: number;
    title: string;
    slug: string;
    format: ContentPageFormatType;
};

export type ContentPageFormatType = 'editorjs' | 'markdown' | 'html';
