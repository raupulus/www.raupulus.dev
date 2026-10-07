# Página de Política de Cookies (`pages/cookies.vue`)

> Política de cookies conforme al RGPD, LSSI-CE y directrices del Comité Europeo de Protección de Datos (CEPD/AEPD).

## Resumen

Proporciona información completa, transparente y detallada sobre las cookies utilizadas en el sitio web (cookies técnicas y analíticas), las herramientas de terceros asociadas (Google Analytics 4 vía Consent Mode v2) y un botón interactivo que permite al usuario reabrir el panel de preferencias y revocar o conceder su consentimiento en cualquier momento.

Cumple estrictamente con el art. 22.2 de la LSSI-CE, el RGPD (UE 2016/679) y la Guía sobre el uso de cookies de la AEPD (actualizada conforme a las directrices del CEPD):

- **Primera capa (banner)**: ofrece opciones simétricas en el mismo nivel y con idéntica visibilidad: «Aceptar todas», «Rechazar todas» y «Configurar».
- **Sin consentimiento tácito**: no se infiere consentimiento por mera navegación.
- **Persistencia respetuosa**: el rechazo se recuerda mediante la cookie técnica `ncc_c` (`declineAllAcceptsNecessary: true`), evitando reiteraciones intrusivas (cookie fatigue).
- **Segunda capa (modal)**: panel de selección granular con tema oscuro integrado («Silicon Architect»), con analítica desactivada por defecto (opt-in estricto).
- **Consent Mode v2 y ciclo de vida**: watcher reactivo con `immediate: true` en `app.vue` para inicializar analítica en usuarios recurrentes con consentimiento y purgar cookies (`_ga*`, `_gid`) al revocar.

## Archivos involucrados

- `pages/cookies.vue` — Vista principal de la política de cookies
- `components/app/Footer.vue` — Enlace a `/cookies/` en el pie de página
- `nuxt.config.ts` — Configuración del módulo `@dargmuesli/nuxt-cookie-control` (colores oscuros, textos de locales, `declineAllAcceptsNecessary`, `isAcceptNecessaryButtonEnabled`)
- `assets/css/styles.css` — Estilos complementarios para el banner, modal y botón flotante acorde al design system
- `app.vue` — Watcher reactivo de consentimiento con Consent Mode v2 y purga de cookies

## Estructura de la página

1. **Definición y finalidad de las cookies**: explicación clara y accesible para el usuario.
2. **Tipos de cookies utilizadas**:
    - **Técnicas / Necesarias**: `ncc_c`, `ncc_e` del módulo de cookies (duración 1 año) y `XSRF-TOKEN` (sesión).
    - **Analíticas (opcionales)**: `_ga`, `_gid`, `_ga_*` de Google Analytics 4 (sujetas a consentimiento explícito).
3. **Opciones de consentimiento, revocación y persistencia**:
    - Detalle de los tres botones del banner («Aceptar todas», «Rechazar todas», «Configurar»).
    - Botón directo para reabrir el modal de preferencias (`useCookieControl().isModalActive = true`).
    - Botón flotante permanente para gestionar o revocar en cualquier momento.
    - Instrucciones para configurar o bloquear cookies en los principales navegadores (Chrome, Firefox, Safari, Edge).
4. **Transferencias internacionales**: información sobre Google LLC, Cloudflare y marco regulatorio de garantías (SCC).
