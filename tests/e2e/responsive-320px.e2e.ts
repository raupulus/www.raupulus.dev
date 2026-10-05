import { test, expect } from '@playwright/test';

test.use({
    viewport: { width: 320, height: 640 },
});

test.describe('Responsive en 320px (Mobile Estricto)', () => {
    const pagesToCheck = ['/', '/projects/', '/about/', '/contact/', '/legal/'];

    for (const route of pagesToCheck) {
        test(`la página ${route} no tiene desbordamiento horizontal en 320px`, async ({ page }) => {
            await page.goto(route, { waitUntil: 'domcontentloaded' });

            // Verificar ausencia de overflow horizontal
            const hasHorizontalScroll = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });

            expect(hasHorizontalScroll).toBe(false);
        });
    }

    test('el menú móvil se puede abrir y cerrar correctamente en 320px', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });

        const mobileBtn = page.locator('button[aria-controls="mobile-menu"]');
        await expect(mobileBtn).toBeVisible();
        await expect(mobileBtn).toHaveAttribute('aria-expanded', 'false');

        // Abrir menú
        await mobileBtn.click();
        await expect(mobileBtn).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('#mobile-menu')).toBeVisible();

        // Cerrar menú con botón
        await mobileBtn.click();
        await expect(mobileBtn).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('#mobile-menu')).not.toBeVisible();
    });
});
