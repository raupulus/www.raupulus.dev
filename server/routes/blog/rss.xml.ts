import { defineEventHandler, setHeader } from 'h3';
import { generateBlogFeedXml } from './feed.xml';

export default defineEventHandler(async (event) => {
    const feedXml = await generateBlogFeedXml();
    setHeader(event, 'content-type', 'application/xml; charset=utf-8');
    return feedXml;
});
