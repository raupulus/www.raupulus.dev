import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('projectsData', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
    });

    it('useProjectsData debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData');
        expect(typeof module.useProjectsData).toBe('function');
    });

    it('projectsDataSearch debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData');
        expect(typeof module.projectsDataSearch).toBe('function');
    });

    it('useGetProjectBySlug debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData');
        expect(typeof module.useGetProjectBySlug).toBe('function');
    });

    it('usefetchProjectsPaginated debe ser una función exportada', async () => {
        const module = await import('~/composables/projectsData');
        expect(typeof module.usefetchProjectsPaginated).toBe('function');
    });
});

describe('usefetchProjectsPaginated (API V2)', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
    });

    it('pagina el listado con meta y añade el índice de páginas de cada proyecto', async () => {
        const project = (slug: string, pages_count: number) => ({
            id: 1,
            slug,
            title: slug,
            excerpt: null,
            image: null,
            pages_count,
        });
        const responses: Record<string, unknown> = {
            'contents?type=project&page=1&per_page=100': {
                success: true,
                message: 'ok',
                data: [project('uno', 2)],
                meta: { total: 2, per_page: 1, current_page: 1, last_page: 2, from: 1, to: 1 },
            },
            'contents?type=project&page=2&per_page=100': {
                success: true,
                message: 'ok',
                data: [project('dos', 0)],
                meta: { total: 2, per_page: 1, current_page: 2, last_page: 2, from: 2, to: 2 },
            },
            'contents/uno/pages?limit=100': {
                success: true,
                message: 'ok',
                data: [
                    { id: 10, order: 1, title: 'About', slug: 'about', format: 'editorjs', body: { blocks: [] } },
                    { id: 11, order: 2, title: 'Hardware', slug: 'hardware', format: 'editorjs', body: { blocks: [] } },
                ],
            },
        };

        const fetchMock = vi.fn().mockImplementation(async (url: string) => {
            const key = Object.keys(responses).find((k) => url.endsWith(`/platforms/portfolio/${k}`));
            return { ok: !!key, status: key ? 200 : 404, json: async () => (key ? responses[key] : {}) };
        });
        vi.stubGlobal('fetch', fetchMock);

        const { usefetchProjectsPaginated } = await import('~/composables/projectsData');
        const projects = await usefetchProjectsPaginated();

        expect(projects.map((p) => p.slug)).toEqual(['uno', 'dos']);
        expect(projects[0]!.pages).toEqual([
            { id: 10, order: 1, title: 'About', slug: 'about', format: 'editorjs' },
            { id: 11, order: 2, title: 'Hardware', slug: 'hardware', format: 'editorjs' },
        ]);
        // Sin páginas no se piden (y nunca se llama al detalle, que suma visitas)
        expect(projects[1]!.pages).toBeUndefined();
        expect(fetchMock).toHaveBeenCalledTimes(3);

        vi.unstubAllGlobals();
    });

    it('lanza error si la API falla y no está ALLOW_EMPTY_PROJECTS', async () => {
        delete process.env.ALLOW_EMPTY_PROJECTS;
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({}),
        });
        vi.stubGlobal('fetch', fetchMock);

        const { usefetchProjectsPaginated } = await import('~/composables/projectsData');
        await expect(usefetchProjectsPaginated('http://fake-api/api/v2')).rejects.toThrow();

        vi.unstubAllGlobals();
    });

    it('devuelve array vacío si la API falla y ALLOW_EMPTY_PROJECTS está activo', async () => {
        process.env.ALLOW_EMPTY_PROJECTS = '1';
        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({}),
        });
        vi.stubGlobal('fetch', fetchMock);

        const { usefetchProjectsPaginated } = await import('~/composables/projectsData');
        const projects = await usefetchProjectsPaginated('http://fake-api/api/v2');
        expect(projects).toEqual([]);

        delete process.env.ALLOW_EMPTY_PROJECTS;
        vi.unstubAllGlobals();
    });
});
