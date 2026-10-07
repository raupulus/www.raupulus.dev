import { test, expect } from '@playwright/test';

test.describe('Página de Error 404', () => {
    test('muestra página 404 personalizada ante ruta inexistente y permite volver al inicio', async ({ page }) => {
        await page.goto('/ruta-totalmente-inexistente-404-test/', { waitUntil: 'domcontentloaded' });

        // Verificar encabezado y texto de error 404
        await expect(page.locator('h1')).toContainText('404');
        await expect(page.locator('h2')).toContainText('Página no encontrada');

        // Verificar presencia del botón volver al inicio
        const homeBtn = page.getByRole('button', { name: /volver al inicio/i });
        await expect(homeBtn).toBeVisible();

        // Hacer click y comprobar redirección a '/'
        await homeBtn.click();
        await expect(page).toHaveURL(/\/(?:#.*)?$/);
    });
});
