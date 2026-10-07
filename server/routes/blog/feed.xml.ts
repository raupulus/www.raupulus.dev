import { defineEventHandler, setHeader } from 'h3';
import { useFetchBlogPaginated } from '../../../composables/blogData';
import type { ContentType } from '../../../types/ContentType';

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function generateBlogFeedXml(): Promise<string> {
    const config = useRuntimeConfig();
    const siteUrl = (config.public?.app?.url as string) || process.env.APP_URL || 'https://raupulus.dev';
    const apiBase =
        (config.public?.api?.base as string) ||
        process.env.API_BASE_URL ||
        (process.env.API_DOMAIN_URL ? `${process.env.API_DOMAIN_URL}/api/v2` : 'http://127.0.0.1:8000/api/v2');

    let posts: ContentType[] = [];
    try {
        posts = await useFetchBlogPaginated(apiBase);
    } catch (e) {
        console.error('Error fetching blog posts for RSS feed:', e);
    }

    const itemsXml = posts
        .map((post) => {
            const firstPageSlug = post.pages?.[0]?.slug || '1';
            const postUrl = `${siteUrl}/blog/${post.slug}/${firstPageSlug}/`;
            const pubDate = new Date(
                post.published_at || post.created_at || post.updated_at || Date.now(),
            ).toUTCString();
            const description = post.excerpt ? `<![CDATA[${post.excerpt}]]>` : escapeXml(post.title);

            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog · Raúl Caro Pastorino</title>
    <link>${siteUrl}/blog/</link>
    <description>Artículos técnicos, guías y notas sobre desarrollo backend con Laravel, IA aplicada, redes LoRa/Meshtastic y GNU/Linux por Raúl Caro Pastorino (@raupulus).</description>
    <language>es-ES</language>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${siteUrl}/social/blog.webp</url>
      <title>Blog · Raúl Caro Pastorino</title>
      <link>${siteUrl}/blog/</link>
    </image>
${itemsXml}
  </channel>
</rss>`.trim();
}

export default defineEventHandler(async (event) => {
    const feedXml = await generateBlogFeedXml();
    setHeader(event, 'content-type', 'application/xml; charset=utf-8');
    return feedXml;
});
