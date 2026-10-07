# TODO — Mejoras pendientes

Ideas aprobadas pero pospuestas, con contexto para retomarlas.

## Analytics sin cookies (Plausible o Umami)

Sustituir Google Analytics (`nuxt-gtag`) por una alternativa sin cookies permitiría
eliminar por completo el banner de cookies (`@dargmuesli/nuxt-cookie-control`) y el
consent mode, simplificando RGPD y aligerando el bundle.

- Umami puede auto-hospedarse (encaja con la infraestructura propia existente).
- Al hacerlo: quitar `nuxt-gtag` y `cookieControl` de `nuxt.config.ts`, limpiar el
  watch de consentimiento en `app.vue` y actualizar la CSP de `apache.conf`
  (eliminar dominios de Google Analytics/Tag Manager).

## Versión en inglés (i18n)

`og:locale:alternate` ya declara `en_US` pero no existe versión en inglés. Publicar
`/en` con `@nuxtjs/i18n` + hreflang duplicaría el alcance del portfolio.

Motivo de posponerlo: el contenido dinámico (proyectos y sus páginas) viene de la API
solo en español; publicar rutas `/en` con contenido en español perjudicaría el SEO
(hreflang inconsistente). Pasos cuando el backend soporte contenido multiidioma:

1. Añadir traducciones EN al contenido en la API (o decidir servir proyectos solo en ES).
2. `@nuxtjs/i18n` con `strategy: 'prefix_except_default'` (ES sin prefijo, `/en/...`).
3. Extraer los textos hardcodeados de páginas y componentes a ficheros de locale.
4. hreflang + sitemap multiidioma (integración i18n/sitemap) y canonical por idioma.
