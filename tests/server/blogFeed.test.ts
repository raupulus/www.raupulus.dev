import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateBlogFeedXml } from '../../server/routes/blog/feed.xml';

const { postsMock } = vi.hoisted(() => ({
    postsMock: [
        {
            id: 1,
            title: 'Desarrollo con Laravel & Vue',
            slug: 'desarrollo-laravel-vue',
            excerpt: 'Una guía completa sobre microservicios.',
            published_at: '2026-10-01T10:00:00Z',
            pages: [{ id: 1, order: 1, title: 'Introducción', slug: 'introduccion', format: 'editorjs' }],
        },
        {
            id: 2,
            title: 'Arquitectura en GNU/Linux <Server>',
            slug: 'arquitectura-linux',
            excerpt: null,
            published_at: null,
            created_at: '2026-10-05T12:00:00Z',
            pages: [],
        },
    ],
}));

vi.mock('../../composables/blogData', () => ({
    useFetchBlogPaginated: vi.fn().mockImplementation(() => Promise.resolve(postsMock)),
}));

describe('RSS Feed Generator', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
    });

    it('genera un documento XML RSS 2.0 válido con los posts de la API', async () => {
        const xml = await generateBlogFeedXml();

        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
        expect(xml).toContain('<title>Blog · Raúl Caro Pastorino</title>');
        expect(xml).toContain('<link>https://raupulus.dev/blog/</link>');
        expect(xml).toContain(
            '<atom:link href="https://raupulus.dev/blog/feed.xml" rel="self" type="application/rss+xml" />',
        );
        expect(xml).toContain('/social/blog.webp</url>');

        // Post 1: Caracteres escapados en title y CDATA en excerpt
        expect(xml).toContain('<title>Desarrollo con Laravel &amp; Vue</title>');
        expect(xml).toContain('<link>https://raupulus.dev/blog/desarrollo-laravel-vue/introduccion/</link>');
        expect(xml).toContain('<![CDATA[Una guía completa sobre microservicios.]]>');

        // Post 2: Escape de <Server>
        expect(xml).toContain('&lt;Server&gt;');
    });
});
