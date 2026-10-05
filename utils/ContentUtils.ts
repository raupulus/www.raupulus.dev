import type { ApiMetaType, ApiResponseType } from '../types/ApiResponse';
import type { BlocksType } from '../types/BlocksType';
import type { ContentPageType } from '../types/ContentPageType';
import type { ContentType } from '../types/ContentType';
import type { ImageSizeType, ImageType } from '../types/ImageType';

/**
 * Slug de la plataforma de este portfolio en la API V2.
 */
export const PLATFORM_SLUG = 'portfolio';

/**
 * Devuelve la URL de una imagen de la API en el tamaño pedido, cayendo a la
 * imagen original si no existe esa miniatura.
 */
export function imageUrl(image: ImageType | null | undefined, size?: ImageSizeType): string | undefined {
    if (!image) {
        return undefined;
    }

    return (size && image.thumbnails?.[size]) || image.url;
}

/**
 * Formatea una fecha ISO para mostrarla (ej. "20 de agosto de 2026").
 */
export function formatDate(iso: string | null | undefined, locale = 'es-ES'): string {
    if (!iso) {
        return '';
    }

    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Indica si una colección paginada tiene más páginas tras la actual.
 */
export function hasNextPage(meta: ApiMetaType | undefined): boolean {
    return !!meta && meta.current_page < meta.last_page;
}

/**
 * Garantiza que el `body` de una página sea un objeto de bloques Editor.js.
 *
 * La web pide siempre `?format=editorjs`, pero por seguridad se admite que
 * llegue como texto JSON o vacío.
 */
export function normalizePage(page: ContentPageType): ContentPageType {
    let body: unknown = page.body;

    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch {
            body = null;
        }
    }

    const blocks = (body as BlocksType | null)?.blocks;

    return {
        ...page,
        body: {
            ...(body as BlocksType),
            blocks: Array.isArray(blocks) ? blocks : [],
        },
    };
}

/**
 * Extrae los mensajes de error de una respuesta de la API V2 en una lista
 * plana: primero los de validación (`errors`) y, si no hay, el `message`.
 */
export function apiErrorMessages(response: Partial<ApiResponseType<unknown>> | null | undefined): string[] {
    const errors = response?.errors ? Object.values(response.errors).flat().filter(Boolean) : [];

    if (errors.length) {
        return errors;
    }

    return response?.message ? [response.message] : [];
}

export type ContentMetatagsType = {
    title: string;
    description: string | undefined;
    keywords: string;
    url: string | undefined;
    image: string | undefined;
};

/**
 * Prepara los metatags de un proyecto abierto en el modal (y su página actual).
 */
export function buildProjectMetatags(
    project: ContentType | undefined,
    page: ContentPageType | undefined,
    urlBase: string,
): ContentMetatagsType {
    const taxonomies = project?.taxonomies;

    const keywords = [
        ...(taxonomies?.categories ?? []),
        ...(taxonomies?.subcategories ?? []),
        ...(taxonomies?.tags ?? []),
        ...(project?.technologies ?? []),
    ].map((item) => item.name);

    let url: string | undefined = undefined;

    if (project?.slug && page?.slug) {
        url = `${urlBase}/projects/${project.slug}/${page.slug}/`;
    } else if (project?.slug) {
        url = `${urlBase}/projects/${project.slug}/`;
    }

    const title = [project?.seo_title || project?.title, page?.title].filter(Boolean).join(' - ');

    return {
        title,
        description: project?.seo_description || project?.excerpt || undefined,
        keywords: [...new Set(keywords)].join(','),
        url,
        image: imageUrl(project?.image, 'large'),
    };
}

/**
 * Elemento de lista Editor.js normalizado (formato antiguo o 2.x).
 */
export type NormalizedListItemType = {
    content: string;
    checked: boolean;
    items: NormalizedListItemType[];
};

/**
 * Normaliza los elementos de un bloque `list` de Editor.js: admite el formato
 * antiguo (array de textos) y el de `@editorjs/list` 2.x (objetos anidados).
 */
export function normalizeListItems(items: unknown): NormalizedListItemType[] {
    if (!Array.isArray(items)) {
        return [];
    }

    return items.map((item) => {
        if (typeof item === 'string') {
            return { content: item, checked: false, items: [] };
        }

        const obj = (item ?? {}) as { content?: unknown; meta?: { checked?: unknown }; items?: unknown };

        return {
            content: typeof obj.content === 'string' ? obj.content : '',
            checked: obj.meta?.checked === true,
            items: normalizeListItems(obj.items),
        };
    });
}

/**
 * Etiqueta de un elemento de lista ordenada según el `counterType` de
 * `@editorjs/list` 2.x (`numeric`, `lower-roman`, `upper-roman`,
 * `lower-alpha`, `upper-alpha`).
 */
export function listCounterLabel(position: number, counterType = 'numeric'): string {
    if (position < 1) {
        return String(position);
    }

    switch (counterType) {
        case 'lower-roman':
            return toRoman(position).toLowerCase();
        case 'upper-roman':
            return toRoman(position);
        case 'lower-alpha':
            return toAlpha(position);
        case 'upper-alpha':
            return toAlpha(position).toUpperCase();
        default:
            return String(position);
    }
}

function toRoman(num: number): string {
    const numerals: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
    ];
    let result = '';

    for (const [value, symbol] of numerals) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
}

function toAlpha(num: number): string {
    let result = '';

    while (num > 0) {
        const rest = (num - 1) % 26;
        result = String.fromCharCode(97 + rest) + result;
        num = Math.floor((num - 1) / 26);
    }

    return result;
}
