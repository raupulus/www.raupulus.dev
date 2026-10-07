import { test, expect } from '@playwright/test';

test.describe('Cookies y Consentimiento (E2E)', () => {
    test.beforeEach(async ({ context }) => {
        // Limpiar todas las cookies antes de cada prueba para simular una visita limpia
        await context.clearCookies();
    });

    test('muestra el banner de cookies en la primera visita con las 3 opciones conformes a la AEPD', async ({
        page,
    }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const cookieBar = page.locator('.cookieControl__Bar');
        await expect(cookieBar).toBeVisible();

        // Título del banner
        await expect(cookieBar.locator('h2')).toContainText('Configuración de Cookies y Privacidad');

        // Botones al mismo nivel y simétricos
        const buttons = cookieBar.locator('.cookieControl__BarButtons button');
        await expect(buttons).toHaveCount(3);
        await expect(buttons.nth(0)).toContainText('Aceptar todas');
        await expect(buttons.nth(1)).toContainText('Rechazar todas');
        await expect(buttons.nth(2)).toContainText('Configurar');
    });

    test('al pulsar "Rechazar todas" se guarda la preferencia y el banner no reaparece al recargar', async ({
        page,
        context,
    }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const cookieBar = page.locator('.cookieControl__Bar');
        await expect(cookieBar).toBeVisible();

        // Pulsar botón de rechazar
        const declineBtn = cookieBar.locator('button', { hasText: 'Rechazar todas' });
        await declineBtn.click();

        // El banner debe cerrarse
        await expect(cookieBar).not.toBeVisible();

        // Verificar que se ha fijado la cookie de consentimiento técnico
        const cookies = await context.cookies();
        const consentCookie = cookies.find((c) => c.name === 'ncc_c');
        expect(consentCookie).toBeDefined();

        // Recargar la página: el banner no debe reaparecer (evita cookie fatigue)
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(page.locator('.cookieControl__Bar')).not.toBeVisible();
    });

    test('al pulsar "Aceptar todas" se guarda el consentimiento y se activa el botón flotante', async ({
        page,
        context,
    }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const cookieBar = page.locator('.cookieControl__Bar');
        await expect(cookieBar).toBeVisible();

        // Pulsar botón de aceptar
        const acceptBtn = cookieBar.locator('button', { hasText: 'Aceptar todas' });
        await acceptBtn.click();

        await expect(cookieBar).not.toBeVisible();

        // Verificar cookies de consentimiento y categorías habilitadas
        const cookies = await context.cookies();
        const consentCookie = cookies.find((c) => c.name === 'ncc_c');
        const enabledIdsCookie = cookies.find((c) => c.name === 'ncc_e');
        expect(consentCookie).toBeDefined();
        expect(enabledIdsCookie).toBeDefined();
        expect(enabledIdsCookie?.value).toContain('google-analytics');

        // Botón flotante permanente visible
        const controlBtn = page.locator('.cookieControl__ControlButton');
        await expect(controlBtn).toBeVisible();
    });

    test('el enlace de "Preferencias de Cookies" del Footer abre el modal de configuración', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        // Enlace en el footer
        const footerPrefBtn = page.locator('footer button', { hasText: 'Preferencias de Cookies' });
        await expect(footerPrefBtn).toBeVisible();
        await footerPrefBtn.click();

        // El modal debe abrirse
        const modal = page.locator('.cookieControl__Modal');
        await expect(modal).toBeVisible();
        await expect(modal.locator('.cookieControl__ModalContent')).toBeVisible();

        // Contiene las dos secciones de cookies
        await expect(modal).toContainText('Cookies técnicas y obligatorias');
        await expect(modal).toContainText('Cookies analíticas opcionales');

        // Botón cerrar
        const closeBtn = modal.locator('button', { hasText: 'Cerrar' });
        await closeBtn.click();
        await expect(modal).not.toBeVisible();
    });

    test('en la página /cookies/ el botón "Gestionar Consentimiento" abre el modal', async ({ page }) => {
        await page.goto('/cookies/', { waitUntil: 'domcontentloaded' });

        const manageBtn = page.locator('button', { hasText: 'Gestionar Consentimiento' });
        await expect(manageBtn).toBeVisible();
        await manageBtn.click();

        const modal = page.locator('.cookieControl__Modal');
        await expect(modal).toBeVisible();
    });
});
