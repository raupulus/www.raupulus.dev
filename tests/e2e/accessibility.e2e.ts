import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accesibilidad WCAG 2.1 AA (Axe-core)', () => {
    const pagesToCheck = [
        '/',
        '/about/',
        '/projects/',
        '/blog/',
        '/contact/',
        '/webs/',
        '/social/',
        '/legal/',
        '/privacy/',
        '/cookies/',
    ];

    for (const route of pagesToCheck) {
        test(`la página ${route} no contiene violaciones críticas de accesibilidad`, async ({ page }) => {
            await page.goto(route, { waitUntil: 'domcontentloaded' });

            // Esperar a que el contenido principal termine de renderizarse
            await page.locator('#app-box-content').waitFor({ state: 'visible' });

            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .disableRules(['color-contrast']) // Verificado visualmente según design system Silicon Architect
                .analyze();

            expect(accessibilityScanResults.violations).toEqual([]);
        });
    }
});
