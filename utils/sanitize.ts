import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitiza HTML para prevenir XSS.
 * Permite solo etiquetas y atributos seguros.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
      'span', 'div', 'img', 'figure', 'figcaption', 'table', 'thead',
      'tbody', 'tr', 'th', 'td', 'mark', 'del', 'ins', 'sub', 'sup',
      'hr', 'dl', 'dt', 'dd',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class',
      'width', 'height', 'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Valida que una URL utilice HTTP o HTTPS de forma segura (previene javascript:, data:, etc.).
 */
export function isSafeHttpUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Valida que una URL de incrustación (iframe) provenga de un origen permitido por HTTPS.
 */
export function isSafeEmbedUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    const allowedHosts = [
      'youtube.com',
      'www.youtube.com',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
      'youtu.be',
      'player.vimeo.com',
      'vimeo.com',
      'codepen.io',
      'platform.twitter.com',
    ];
    return allowedHosts.some(allowed => host === allowed || host.endsWith('.' + allowed));
  } catch {
    return false;
  }
}

/**
 * Sanitiza HTML permitiendo contenido más amplio (para BlockRaw).
 * Usa con precaución — solo para contenido de confianza.
 */
export function sanitizeRawHtml(html: string): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['iframe', 'video', 'audio', 'source'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'autoplay', 'controls', 'loop', 'muted'],
    ALLOW_DATA_ATTR: false,
  });
}
