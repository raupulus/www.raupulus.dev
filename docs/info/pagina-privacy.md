# Política de Privacidad (`pages/privacy.vue`)

> Política de privacidad conforme al Reglamento General de Protección de Datos (RGPD, Reglamento UE 2016/679) y Ley Orgánica 3/2018 (LOPDGDD).

## Resumen

Página informativa obligatoria según el artículo 13 del RGPD que detalla los tratamientos de datos personales que tienen lugar en el sitio web (formulario de contacto y analítica web consentida), sus bases jurídicas, plazos de conservación, transferencias internacionales y el ejercicio de derechos ARCO-POL ante la Agencia Española de Protección de Datos (AEPD).

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/privacy.vue` | Página principal de política de privacidad |
| `components/app/Footer.vue` | Enlace canónico en el footer (`/privacy/`) |

## Ruta y SEO

- **URL**: `/privacy/` (con barra final)
- **Metatags**: `useHead()` completo con `canonical`, Open Graph y Twitter Cards (`/social/privacy.webp`)
- **Datos**: estáticos, con marcadores `[[COMPLETAR: descripción]]` para datos pendientes de validación por el titular.

## Secciones detalladas (Art. 13 RGPD)

1. **Responsable del tratamiento**: identificación de Raúl Caro Pastorino y canal de contacto (`public@raupulus.dev`).
2. **Finalidad y legitimación**:
   - Gestión de consultas mediante formulario de contacto: base de consentimiento explícito e interés legítimo precontractual (Art. 6.1.a y 6.1.b RGPD).
   - Analítica web agregada mediante Google Analytics: base de consentimiento previo (Art. 6.1.a RGPD).
3. **Plazos de conservación de los datos**: criterios de retención conforme a prescripción de responsabilidades legales.
4. **Destinatarios y transferencias internacionales**: proveedores de infraestructura, Cloudflare y Google LLC bajo el EU-US Data Privacy Framework.
5. **Derechos de las personas interesadas (ARCO-POL)**: acceso, rectificación, supresión, oposición, limitación y portabilidad mediante correo a `public@raupulus.dev`, con derecho a reclamar ante la AEPD (`www.aepd.es`).
6. **Medidas de seguridad**: cifrado TLS, headers HTTP de seguridad, control estricto de accesos.

## Relaciones con otros módulos

- → [pagina-cookies.md](./pagina-cookies.md): detalle complementario de cookies y panel de preferencias
- → [pagina-legal.md](./pagina-legal.md): aviso legal y términos de uso
- → [pagina-contact.md](./pagina-contact.md): formulario de contacto
- → [layout-navegacion.md](./layout-navegacion.md): enlace desde el pie de página
