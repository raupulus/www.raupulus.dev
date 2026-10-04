# Recomendaciones para el backend (API) — Auditoría externa deepsek-externo

El backend Laravel queda fuera del alcance de corrección del frontend, pero el frontend depende de él. Estos
requisitos van al equipo de la API.

## Datos observados

- `https://api.raupulus.dev/api/v1/*` responde **410 Gone** con mensaje «La API V1 está obsoleta…».
- `https://api.raupulus.dev/api/v2/{rutas antiguas}` responde **404** («API V2 - Endpoint no encontrado»)
  para `/platform/portfolio/*`.
- CORS en `api.raupulus.dev`: `access-control-allow-origin: https://raupulus.dev` con
  `access-control-allow-credentials: true` (correcto, pero solo si la cookie CSRF puede leerse, ver abajo).
- Cookies: `XSRF-TOKEN` (`domain=api.raupulus.dev; secure; samesite=lax`, sin httponly) y
  `api_raupulus_session` (`httponly; secure; samesite=lax`).
- `api.fryntiz.dev/*` responde `301` → `api.raupulus.dev` (no envía CORS), lo que rompe los fetch del sitio.
- `https://api.raupulus.dev/cv/pdf` responde 200.

## Requisitos y recomendaciones

1. **Un solo dominio y versión vigentes.** Dejar de exponer v1 (410 es correcto) y asegurar que el frontend
   use el dominio canónico (`api.raupulus.dev`) y la versión actual (v2). Documentar en `AGENTS.md`/`docs/info`.
2. **CSRF entre sitios.** Con cookies `SameSite=Lax` en un dominio distinto (`api.raupulus.dev`), el
   `XSRF-TOKEN` no puede leerse ni enviarse desde `raupulus.dev` (BUG-003). Opciones:
    - **Recomendado:** exponer la API bajo el mismo origen de la web (proxy en el borde: `raupulus.dev/api/**`
      → `api.raupulus.dev/api/**` y `/sanctum/**`), como ya se hace en desarrollo con `/_proxy`.
    - Alternativa: `SameSite=None; Secure` (requiere cookies de terceros, en declive).
3. **Verificación del captcha en servidor.** El endpoint de contacto debe verificar `g-recaptcha-response`
   contra Google comprobando `action` (`contact`), `score` mínimo y `hostname`; rechazar si falta o es
   sospechoso. Nunca confiar en el token del cliente sin verificar.
4. **Validación y límites.** Validar y normalizar todas las entradas (longitudes, email, `privacity`),
   aplicar _rate limiting_ por IP y por contenido, y devolver 422/429 con el envelope
   `{success, message, errors}` que el frontend ya interpreta (`apiErrorMessages`).
5. **Headers de la API.** Añadir `X-Content-Type-Options: nosniff` (ya presente), `Referrer-Policy`,
   `Permissions-Policy` y `Cache-Control: no-store` en respuestas con datos de usuario. Eliminar el obsoleto
   `X-XSS-Protection`. HSTS con `max-age` > 0.
6. **CV.** Mantener `/cv/pdf` accesible y con `Content-Disposition` y `Content-Type: application/pdf`
   adecuados; considerar cacheo corto.
7. **Versión de la API en la respuesta.** Incluir la versión y, si es posible, un `Sunset`/RFC 8594 al retirar
   v1 para dar margen a los clientes.
8. **Estabilidad de tipos.** Documentar el envelope y campos opcionales/nulos de `/platforms/{slug}/contents`
   y `/pages` para alinear `types/**` con la realidad (ver CODE-001 y `types.md`).
