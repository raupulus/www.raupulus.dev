import { test, expect } from '@playwright/test';

test.describe('Consola Limpia de Errores JavaScript', () => {
    test('navegación completa por páginas principales sin excepciones no controladas', async ({ page }) => {
        const errors: string[] = [];

        page.on('pageerror', (err) => {
            errors.push(`PageError: ${err.message}`);
        });

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                const text = msg.text();
                // Ignorar advertencias benignas o fallos de red en modo test sin API/turnstile local levantado
                if (
                    text.includes('Failed to load resource') ||
                    text.includes('recaptcha') ||
                    text.includes('turnstile') ||
                    text.includes('challenges.cloudflare.com') ||
                    text.includes('favicon.ico') ||
                    text.includes('ERR_CONNECTION_REFUSED')
                ) {
                    return;
                }
                errors.push(`ConsoleError: ${text}`);
            }
        });

        const routesToVisit = ['/', '/projects/', '/about/', '/webs/', '/social/', '/contact/', '/legal/'];

        for (const route of routesToVisit) {
            await page.goto(route, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(200);
        }

        expect(errors).toEqual([]);
    });
});
