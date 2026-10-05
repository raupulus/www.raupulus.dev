import { test, expect } from '@playwright/test';

const routes = [
    { path: '/', titleRegex: /Raúl Caro Pastorino/i },
    { path: '/projects/', titleRegex: /Proyectos/i },
    { path: '/about/', titleRegex: /Sobre m[ií]/i },
    { path: '/webs/', titleRegex: /Sitios web|Webs/i },
    { path: '/social/', titleRegex: /Social/i },
    { path: '/contact/', titleRegex: /Contacto/i },
    { path: '/blog/', titleRegex: /Blog/i },
    { path: '/privacy/', titleRegex: /Privacidad/i },
    { path: '/cookies/', titleRegex: /Cookies/i },
    { path: '/legal/', titleRegex: /Aviso Legal/i },
];

test.describe('Navegación y Rutas Principales', () => {
    for (const route of routes) {
        test(`ruta ${route.path} responde con 200 y carga contenido principal`, async ({ page }) => {
            const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });
            expect(response?.status()).toBe(200);

            // Header (banner) y Footer deben estar siempre presentes
            await expect(page.getByRole('banner')).toBeVisible();
            await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();

            // Main box de contenido principal
            await expect(page.locator('#app-box-content')).toBeVisible();

            // Título de la página
            const title = await page.title();
            expect(title).toMatch(route.titleRegex);
        });
    }
});
