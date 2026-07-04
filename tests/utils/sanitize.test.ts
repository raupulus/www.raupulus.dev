import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeRawHtml } from '~/utils/sanitize';

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
