import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSitemapXml } from '../../server/routes/sitemap.xml';

const { projectsMock } = vi.hoisted(() => ({
    projectsMock: [
        {
            id: 1,
            title: 'Proyecto IoT',
            slug: 'proyecto-iot',
            first_page: { slug: 'informacion', order: 1 },
            pages: [
                { id: 10, order: 1, title: 'Información', slug: 'informacion', format: 'editorjs' },
                { id: 11, order: 2, title: 'Hardware', slug: 'hardware', format: 'editorjs' },
            ],
        },
    ],
}));

vi.mock('../../composables/projectsData', () => ({
    usefetchProjectsPaginated: vi.fn().mockImplementation(() => Promise.resolve(projectsMock)),
}));

vi.mock('../../composables/blogData', () => ({
    useFetchBlogPaginated: vi.fn().mockImplementation(() => Promise.resolve([])),
}));

vi.mock('fs', async (importOriginal) => {
    const actual = await importOriginal<typeof import('fs')>();
    return {
        ...actual,
        default: {
            ...actual,
            existsSync: vi.fn().mockImplementation((p: string) => {
                if (typeof p === 'string' && p.includes('cachedRoutes.json')) return false;
                return actual.existsSync(p);
            }),
        },
        existsSync: vi.fn().mockImplementation((p: string) => {
            if (typeof p === 'string' && p.includes('cachedRoutes.json')) return false;
            return actual.existsSync(p);
        }),
    };
});

describe('Sitemap XML Generator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('genera un sitemap XML omitiendo la primera subpágina (order === 1) para evitar contenido duplicado', async () => {
        const xml = await generateSitemapXml();

        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('<loc>https://raupulus.dev/projects/proyecto-iot/</loc>');
        expect(xml).toContain('<loc>https://raupulus.dev/projects/proyecto-iot/hardware/</loc>');
        // No debe incluir la subpágina informacion/ porque ya es la portada del proyecto
        expect(xml).not.toContain('<loc>https://raupulus.dev/projects/proyecto-iot/informacion/</loc>');
    });
});
