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
      'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
      'width', 'height', 'style', 'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
  });
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
