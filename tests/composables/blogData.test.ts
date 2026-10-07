import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('blogData', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
    });

    it('useBlogData debe ser una función exportada', async () => {
        const module = await import('~/composables/blogData');
        expect(typeof module.useBlogData).toBe('function');
    });

    it('blogDataSearch debe ser una función exportada', async () => {
        const module = await import('~/composables/blogData');
        expect(typeof module.blogDataSearch).toBe('function');
    });

    it('useGetBlogPostBySlug debe ser una función exportada', async () => {
        const module = await import('~/composables/blogData');
        expect(typeof module.useGetBlogPostBySlug).toBe('function');
    });

    it('useGetRelatedBlogPosts debe ser una función exportada', async () => {
        const module = await import('~/composables/blogData');
        expect(typeof module.useGetRelatedBlogPosts).toBe('function');
    });

    it('useFetchBlogPaginated debe ser una función exportada', async () => {
        const module = await import('~/composables/blogData');
        expect(typeof module.useFetchBlogPaginated).toBe('function');
    });
});

describe('useFetchBlogPaginated (API V2)', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
    });

    it('pagina el listado con meta y añade el índice de páginas de cada artículo', async () => {
        const post = (slug: string, pages_count: number) => ({
            id: 1,
            slug,
            title: slug,
            excerpt: null,
            image: null,
            pages_count,
        });
        const responses: Record<string, unknown> = {
            'contents?type=blog&page=1&per_page=100': {
                success: true,
                message: 'ok',
                data: [post('post-uno', 2)],
                meta: { total: 2, per_page: 1, current_page: 1, last_page: 2, from: 1, to: 1 },
            },
            'contents?type=blog&page=2&per_page=100': {
                success: true,
                message: 'ok',
                data: [post('post-dos', 0)],
                meta: { total: 2, per_page: 1, current_page: 2, last_page: 2, from: 2, to: 2 },
            },
            'contents/post-uno/pages?limit=100': {
                success: true,
                message: 'ok',
                data: [
                    { id: 10, order: 1, title: 'Intro', slug: 'intro', format: 'editorjs' },
                    { id: 11, order: 2, title: 'Práctica', slug: 'practica', format: 'editorjs' },
                ],
            },
        };

        const fetchMock = vi.fn((input: RequestInfo | URL) => {
            const url = String(input);
            const matchingKey = Object.keys(responses).find((key) => url.endsWith(key));
            const body = matchingKey ? responses[matchingKey] : { success: true, data: [] };
            return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
        });
        vi.stubGlobal('fetch', fetchMock);

        const { useFetchBlogPaginated } = await import('~/composables/blogData');
        const result = await useFetchBlogPaginated('http://api.local/api/v2');

        expect(result).toHaveLength(2);
        expect(result[0]?.slug).toBe('post-uno');
        expect(result[0]?.pages).toHaveLength(2);
        expect(result[0]?.pages?.[0]?.slug).toBe('intro');
        expect(result[1]?.slug).toBe('post-dos');
        expect(result[1]?.pages).toBeUndefined();
    });
});
