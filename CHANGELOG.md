# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [Sin publicar]

### Seguridad
- Sanitización de HTML con DOMPurify en todos los `v-html` (BlockRaw, BlockParagraph, BlockAlert, BlockList, BlockCheckList, BlockQuote, BlockLinkTool, BlockCode).
- Cabeceras de seguridad HTTP configuradas en Apache y Nginx (X-Content-Type-Options, X-Frame-Options, CSP, HSTS, Referrer-Policy, Permissions-Policy).
- HSTS configurado sin `includeSubDomains` para no afectar otros subdominios.
- Devtools de Nuxt deshabilitado en producción.
- Console.log del CSRF token condicionado a entorno de desarrollo.
- Consentimiento GDPR corregido (`ad_user_data` denied por defecto).
- Cookie de analytics sin preselección (`isPreselected: false`).
- `rel="noopener noreferrer"` y `aria-label` añadidos a todos los enlaces externos.

### Corregido
- Bug en `.catch()` de `fetchPageData.ts` (se evaluaba inmediatamente en lugar de como callback).
- Doble parsing JSON en formulario de contacto (`contact.vue`).
- Datos de prueba hardcodeados eliminados del formulario de contacto.
- Manejo de errores del captcha mejorado con feedback al usuario.
- State leak en SSR corregido (refs a nivel de módulo → `useState`).
- Manejo de errores añadido en `usefetchProjectsPaginated` con try/catch y verificación de `response.ok`.
- Promesa no esperada en `platformData.ts` corregida con async/await.
- Locale OG corregido (`en_EN` → `en_US`).
- Regex de validación de email mejorada para soportar dominios modernos.
- Textos en inglés restaurados al español en todas las páginas (index, blog, contact, about, social, webs).
- Textos en inglés traducidos en Header (navegación), Footer (copyright, estado) y componentes.

### Añadido
- Layout por defecto (`layouts/default.vue`).
- Cliente API centralizado (`utils/apiClient.ts`).
- Utilidad de sanitización HTML (`utils/sanitize.ts`) con DOMPurify.
- Middleware scroll-to-top global (`middleware/scroll-to-top.global.ts`).
- Configuración Nginx para producción (`nginx.conf`) y desarrollo (`nginx_dev.conf`).
- ESLint configurado con `@nuxt/eslint` (`eslint.config.mjs`).
- Prettier configurado (`.prettierrc`, `.prettierignore`).
- Tests unitarios con Vitest (`vitest.config.ts`, `tests/utils/sanitize.test.ts`).
- Pipeline CI/CD con GoCD (`gocd.yaml`).
- Script de despliegue con backup y rollback (`scripts/deploy.sh`).
- Tipos TypeScript para respuestas API (`types/ApiResponse.ts`).
- Botón "Cargar más proyectos" con carga bajo demanda.
- Soporte de teclado en modal de proyecto (Escape para cerrar, focus trap).
- ARIA roles y labels en modal de proyecto.

### Cambiado
- `platformData.ts` migrado a `$fetch` con caché via `useState`.
- `projectsData.ts` refactorizado con carga bajo demanda, `useState` y `$fetch`.
- `fetchPageData.ts` reescrito con `useState`, `$fetch` y manejo de errores.
- `projectsDataSearch` y `useGetProjectBySlug` migrados a `$fetch`.
- `contentPaginator.vue` y `Projects.vue` convertidos a async/await.
- Imágenes migradas de `<img>` a `<NuxtImg>` con lazy loading y formato WebP.
- Dominio `api.raupulus.dev` añadido a dominios permitidos de `@nuxt/image`.
- Scripts de npm ampliados con lint, format y test.
- `BlockAttaches.vue` e `ImageSlide.vue` migrados a `<NuxtImg>`.
- Accesibilidad mejorada: `role="dialog"`, `aria-modal`, `aria-label` en modales.
- Escape key handler añadido a todos los modales (projectShow, ImageSlide, submitContact).
- `nav aria-label` añadido al Header, `role="contentinfo"` al Footer.

### Eliminado
- Console.logs de depuración en formulario de contacto y app.vue.
- Datos de prueba hardcodeados en campos del formulario.
- Líneas SSL comentadas innecesarias en `apache.conf`.

## [1.0.0] - 2026-03-29

### Añadido
- Versión inicial del portfolio personal en Nuxt 3.
- SSR con generación estática.
- Integración con API `api.raupulus.dev`.
- Formulario de contacto con reCAPTCHA v3.
- Sección de proyectos con modal de detalle.
- Sitemap dinámico.
- Google Analytics con control de consentimiento de cookies.
