# Página de Política de Cookies (`pages/cookies.vue`)

> Política de cookies conforme al RGPD, LSSI-CE y directrices del Comité Europeo de Protección de Datos (CEPD/AEPD).

## Resumen

Proporciona información completa, transparente y detallada sobre las cookies utilizadas en el sitio web (cookies técnicas y analíticas), las herramientas de terceros asociadas (Google Analytics vía Consent Mode v2) y un botón interactivo que permite al usuario reabrir el panel de preferencias y revocar o conceder su consentimiento en cualquier momento.

## Archivos involucrados

- `pages/cookies.vue` — Vista principal de la política de cookies
- `components/app/Footer.vue` — Enlace a `/cookies/` en el pie de página
- `nuxt.config.ts` — Configuración del módulo `@dargmuesli/nuxt-cookie-control`

## Estructura de la página

1. **Definición y finalidad de las cookies**: explicación clara y accesible para el usuario.
2. **Tipos de cookies utilizadas**:
    - **Técnicas / Necesarias**: `ncc_c`, `ncc_e` del módulo de cookies (duración 1 año).
    - **Analíticas (opcionales)**: `_ga`, `_gid` de Google Analytics 4 (sujetas a consentimiento explícito).
3. **Gestión y revocación**:
    - Botón directo para reabrir el modal de preferencias (`useCookieControl().isModalActive = true`).
    - Instrucciones para configurar o bloquear cookies en los principales navegadores (Chrome, Firefox, Safari, Edge).
4. **Transferencias internacionales**: advertencia sobre Google LLC y marco EU-US Data Privacy Framework.
