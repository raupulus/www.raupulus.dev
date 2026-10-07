import { defineEventHandler, setHeader } from 'h3';
import fs from 'fs';
import path from 'path';
import { usefetchProjectsPaginated } from '../../composables/projectsData';
import { useFetchBlogPaginated } from '../../composables/blogData';
import type { ContentType } from '../../types/ContentType';

interface SitemapEntry {
    loc: string;
    lastmod: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: string;
}

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function getPriorityAndFreq(route: string): { priority: string; changefreq: SitemapEntry['changefreq'] } {
    if (route === '/') return { priority: '1.0', changefreq: 'weekly' };
    if (route === '/projects/' || route === '/blog/') return { priority: '0.9', changefreq: 'daily' };
    if (route === '/about/') return { priority: '0.8', changefreq: 'monthly' };
    if (route.startsWith('/projects/') && route.split('/').filter(Boolean).length === 2) {
        return { priority: '0.8', changefreq: 'weekly' };
    }
    if (route.startsWith('/blog/') && route.split('/').filter(Boolean).length >= 2) {
        return { priority: '0.8', changefreq: 'weekly' };
    }
    if (route === '/contact/') return { priority: '0.7', changefreq: 'monthly' };
    if (route.startsWith('/projects/')) return { priority: '0.7', changefreq: 'weekly' };
    if (route === '/webs/') return { priority: '0.6', changefreq: 'monthly' };
    if (route === '/social/') return { priority: '0.5', changefreq: 'monthly' };
    if (route === '/privacy/' || route === '/cookies/' || route === '/legal/') {
        return { priority: '0.3', changefreq: 'yearly' };
    }
    return { priority: '0.5', changefreq: 'weekly' };
}

export async function generateSitemapXml(): Promise<string> {
    const config = useRuntimeConfig();
    const siteUrl = ((config.public?.app?.url as string) || process.env.APP_URL || 'https://raupulus.dev').replace(
        /\/$/,
        '',
    );
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
        '/',
        '/about/',
        '/projects/',
        '/blog/',
        '/contact/',
        '/webs/',
        '/social/',
        '/privacy/',
        '/cookies/',
        '/legal/',
    ];

    const routeSet = new Set<string>(staticPages);

    // Si cachedRoutes.json existe (creado durante prerender:routes de Nitro), usamos esas rutas directamente
    const cachedRoutesPath = path.resolve('cachedRoutes.json');
    if (fs.existsSync(cachedRoutesPath)) {
        try {
            const cached: string[] = JSON.parse(fs.readFileSync(cachedRoutesPath, 'utf8'));
            for (const r of cached) {
                if (!r.endsWith('.xml') && !r.includes('/feed') && !r.includes('/rss')) {
                    routeSet.add(r.endsWith('/') ? r : `${r}/`);
                }
            }
        } catch {
            // Ignorar y continuar con fallback
        }
    } else {
        // Fallback dinámico (útil en dev o cuando no existe cachedRoutes.json)
        const apiBase =
            (config.public?.api?.base as string) ||
            process.env.API_BASE_URL ||
            (process.env.API_DOMAIN_URL ? `${process.env.API_DOMAIN_URL}/api/v2` : 'http://127.0.0.1:8000/api/v2');

        try {
            const projects: ContentType[] = await usefetchProjectsPaginated(apiBase);
            for (const project of projects) {
                routeSet.add(`/projects/${project.slug}/`);
                project.pages?.forEach((p) => routeSet.add(`/projects/${project.slug}/${p.slug}/`));
            }
        } catch {
            // Continuar
        }

        try {
            const blogPosts: ContentType[] = await useFetchBlogPaginated(apiBase);
            for (const post of blogPosts) {
                post.pages?.forEach((p) => routeSet.add(`/blog/${post.slug}/${p.slug}/`));
            }
        } catch {
            // Continuar
        }
    }

    const sortedRoutes = Array.from(routeSet).sort();

    const urlsXml = sortedRoutes
        .map((route) => {
            const fullUrl = `${siteUrl}${route}`;
            const { priority, changefreq } = getPriorityAndFreq(route);
            return `  <url>
    <loc>${escapeXml(fullUrl)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`.trim();
}

export default defineEventHandler(async (event) => {
    const xml = await generateSitemapXml();
    setHeader(event, 'content-type', 'application/xml; charset=utf-8');
    setHeader(event, 'cache-control', 'public, max-age=86400, must-revalidate');
    return xml;
});
