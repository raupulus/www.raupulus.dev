import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeRawHtml, isSafeHttpUrl, isSafeEmbedUrl } from '~/utils/sanitize';

describe('sanitizeHtml', () => {
    it('debe permitir etiquetas HTML seguras', () => {
        const input = '<p>Texto <strong>negrita</strong> y <em>cursiva</em></p>';
        const result = sanitizeHtml(input);
        expect(result).toBe(input);
    });

    it('debe eliminar scripts maliciosos', () => {
        const input = '<p>Texto</p><script>alert("xss")</script>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('<script>');
        expect(result).toContain('<p>Texto</p>');
    });

    it('debe eliminar atributos onclick', () => {
        const input = '<p onclick="alert(1)">Texto</p>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('onclick');
        expect(result).toContain('<p>Texto</p>');
    });

    it('debe eliminar javascript: en href', () => {
        const input = '<a href="javascript:alert(1)">click</a>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('javascript:');
    });

    it('debe eliminar atributo style para prevenir inyecciones CSS', () => {
        const input = '<p style="color: red; position: fixed;">Texto</p>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('style=');
        expect(result).toContain('<p>Texto</p>');
    });

    it('debe eliminar atributo id para prevenir DOM clobbering', () => {
        const input = '<h2 id="window">Título</h2>';
        const result = sanitizeHtml(input);
        expect(result).not.toContain('id=');
        expect(result).toContain('<h2>Título</h2>');
    });

    it('debe retornar cadena vacía para entrada vacía', () => {
        expect(sanitizeHtml('')).toBe('');
        expect(sanitizeHtml(null as unknown as string)).toBe('');
    });

    it('debe permitir enlaces seguros', () => {
        const input = '<a href="https://raupulus.dev" target="_blank">Mi web</a>';
        const result = sanitizeHtml(input);
        expect(result).toContain('href="https://raupulus.dev"');
    });
});

describe('isSafeHttpUrl', () => {
    it('acepta URLs con protocolo http y https', () => {
        expect(isSafeHttpUrl('https://raupulus.dev')).toBe(true);
        expect(isSafeHttpUrl('http://localhost:8000')).toBe(true);
    });

    it('rechaza esquemas inseguros o nulos', () => {
        expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
        expect(isSafeHttpUrl('data:text/html;base64,...')).toBe(false);
        expect(isSafeHttpUrl('file:///etc/passwd')).toBe(false);
        expect(isSafeHttpUrl('')).toBe(false);
        expect(isSafeHttpUrl(null)).toBe(false);
    });
});

describe('isSafeEmbedUrl', () => {
    it('acepta proveedores de embed permitidos por HTTPS', () => {
        expect(isSafeEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
        expect(isSafeEmbedUrl('https://youtube-nocookie.com/embed/xyz')).toBe(true);
        expect(isSafeEmbedUrl('https://player.vimeo.com/video/12345')).toBe(true);
        expect(isSafeEmbedUrl('https://codepen.io/pen/embed/xyz')).toBe(true);
    });

    it('rechaza URLs sin HTTPS o de hosts no autorizados', () => {
        expect(isSafeEmbedUrl('http://www.youtube.com/embed/test')).toBe(false);
        expect(isSafeEmbedUrl('https://evil-site.com/embed')).toBe(false);
        expect(isSafeEmbedUrl('javascript:alert(1)')).toBe(false);
        expect(isSafeEmbedUrl('')).toBe(false);
        expect(isSafeEmbedUrl(null)).toBe(false);
    });
});

describe('sanitizeRawHtml', () => {
    it('debe permitir iframes', () => {
        const input = '<iframe src="https://www.youtube.com/embed/test" allowfullscreen></iframe>';
        const result = sanitizeRawHtml(input);
        expect(result).toContain('<iframe');
    });

    it('debe eliminar scripts maliciosos incluso en modo raw', () => {
        const input = '<div>Contenido</div><script>alert("xss")</script>';
        const result = sanitizeRawHtml(input);
        expect(result).not.toContain('<script>');
        expect(result).toContain('<div>Contenido</div>');
    });

    it('debe retornar cadena vacía para entrada vacía', () => {
        expect(sanitizeRawHtml('')).toBe('');
    });
});
