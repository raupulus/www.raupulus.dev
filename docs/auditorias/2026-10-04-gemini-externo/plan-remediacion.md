# Plan de Remediación Integral

Este plan de remediación organiza cronológicamente la resolución de los 48 hallazgos identificados en la auditoría técnica externa de **www.raupulus.dev**, estructurado en fases según criticidad, dependencias técnicas y retorno de inversión en esfuerzo.

---

## Fase 0 — Urgente (Plazo: ≤ 24 horas)

_Enfoque: Vulnerabilidades críticas explotables, fallos bloqueantes de servicio y exposición de seguridad._

| ID          | Hallazgo                                    | Acción de Remediación                                                                                                                                                  | Esfuerzo |
| ----------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **DEP-001** | RCE en `@nuxt/devtools` (CVSS 9.6)          | Actualizar `@nuxt/devtools` a `^2.8.1+` en `package.json` para neutralizar el vector de ejecución remota de código en local.                                           | XS       |
| **SEC-001** | Inyección CSS y bypass en `sanitizeRawHtml` | Restringir `utils/sanitize.ts`: eliminar `iframe` de `ALLOWED_TAGS` o aplicar sandbox estricto y lista blanca de dominios; retirar atributo `style` de `sanitizeHtml`. | S        |
| **BUG-001** | Rotura de CSRF en formulario de contacto    | Configurar en backend `SESSION_DOMAIN=.raupulus.dev` y `SANCTUM_STATEFUL_DOMAINS`; ajustar lectura de credenciales en `pages/contact.vue`.                             | M        |

---

## Fase 1 — Quick Wins (Plazo: Sprint Inmediato / ≤ 3 días)

_Enfoque: Correcciones de alto impacto sobre SEO, accesibilidad, privacidad y estabilidad con esfuerzo mínimo (XS o S)._

| ID           | Hallazgo                                         | Acción de Remediación                                                                                                            | Esfuerzo |
| ------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **SEC-003**  | HSTS deshabilitado (`max-age=0`)                 | Configurar en Cloudflare / servidor web la cabecera `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.   | XS       |
| **SEC-005**  | Correo personal expuesto en Apache conf          | Sustituir `ServerAdmin` en `apache.conf` y `apache_dev.conf` por `public@raupulus.dev` conforme a la regla global de privacidad. | XS       |
| **SEO-002**  | NXDOMAIN en `www.raupulus.dev`                   | Crear registro CNAME para `www` en Cloudflare con regla de redirección 301 permanente hacia `raupulus.dev`.                      | XS       |
| **SEO-003**  | Página `/blog` indexable vacía                   | Añadir `noindex, nofollow` a `pages/blog.vue` y excluir `/blog` en la configuración de `@nuxtjs/sitemap`.                        | XS       |
| **SEO-004**  | Rutas erróneas en `site.webmanifest`             | Corregir rutas de iconos a `/favicons/android-chrome-*.png` y fijar `theme_color: "#091421"`.                                    | XS       |
| **PERF-002** | Caché HTML agresiva a 1 mes                      | Añadir `ExpiresByType text/html "access plus 0 seconds"` y `Cache-Control: no-cache` en `public/.htaccess`.                      | S        |
| **PERF-003** | 10 pesos de fuentes cargados                     | Reducir pesos a `[400, 700]` para Space Grotesk y Plus Jakarta Sans en `nuxt.config.ts`.                                         | S        |
| **A11Y-001** | Contraste insuficiente en pie de página (1.98:1) | Cambiar clase `text-outline-variant` por `text-on-surface-variant` en `components/app/Footer.vue`.                               | XS       |
| **A11Y-002** | Formulario sin botón `submit`                    | Cambiar `<button type="button">` por `<button type="submit">` en `pages/contact.vue`.                                            | XS       |
| **A11Y-006** | Botón de cierre en modales inaccesible           | Reemplazar `<span>✕</span>` por `<button aria-label="Cerrar modal">` con icono SVG.                                              | XS       |
| **DEP-002**  | Lockfile desincronizado (103 discrepancias)      | Ejecutar `npm install --package-lock-only` y commitear `package-lock.json` alineado.                                             | S        |
| **DEP-004**  | Conflictos de pnpm y `.npmrc`                    | Eliminar `pnpm-lock.yaml`, `pnpm-workspace.yaml` y `.npmrc`.                                                                     | XS       |
| **DEP-005**  | Falta `@vitest/coverage-v8`                      | Instalar `@vitest/coverage-v8` en devDependencies para habilitar `npm run test:coverage`.                                        | XS       |
| **UX-001**   | Validaciones absurdas en formulario              | Relajar validaciones de longitud: nombre min 2 caracteres, asunto min 3, correo hasta 254.                                       | XS       |
| **UX-004**   | Imagen huérfana de 471 KB                        | Eliminar `public/patterns/a.png`.                                                                                                | XS       |

---

## Fase 2 — Privacidad, RGPD y Cumplimiento Legal (Plazo: 1–2 semanas)

_Enfoque: Alineación total con RGPD, ePrivacy y directrices de la AEPD._

| ID            | Hallazgo                                     | Acción de Remediación                                                                                                                                                                               | Esfuerzo |
| ------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **LEGAL-001** | Consent Mode v2 otorga señales publicitarias | Corregir watcher en `app.vue:133`: otorgar exclusivamente `analytics_storage: 'granted'` al aceptar cookies analíticas; mantener `ad_user_data`, `ad_personalization` y `ad_storage` en `'denied'`. | S        |
| **LEGAL-002** | Imposibilidad de revocar consentimiento      | Añadir bloque `else` en watcher de `app.vue` para revocar a `'denied'` y restaurar `targetCookieIds: ['_ga', '_gid']` en `nuxt.config.ts`.                                                          | S        |
| **LEGAL-003** | Inyección incondicional de reCAPTCHA v3      | Retirar inyección global en `plugins/google-recaptcha.ts`; cargar el script de reCAPTCHA dinámicamente solo en `pages/contact.vue` al interactuar con el formulario.                                | M        |
| **LEGAL-004** | Política de privacidad incompleta            | Actualizar `/privacy` incorporando base legal (art. 6 RGPD), transferencias internacionales a EE.UU. (Google), plazos de conservación y ejercicio de derechos ARCO.                                 | S        |
| **LEGAL-005** | Ausencia de tabla informativa de cookies     | Añadir tabla detallada de cookies en `/privacy` especificando nombre (`_ga`, `ncc_c`), finalidad, proveedor y caducidad.                                                                            | S        |
| **LEGAL-006** | Formulario no disocia consentimientos        | Separar el envío del formulario del consentimiento de privacidad; añadir bloque informativo de primera capa.                                                                                        | S        |
| **LEGAL-007** | Falta Aviso Legal y Accesibilidad            | Crear página o sección de Aviso Legal (LSSI-CE art. 10) y Declaración de Accesibilidad (UNE-EN 301 549).                                                                                            | S        |

---

## Fase 3 — SEO, Renderizado Estático y Routing (Plazo: 2 semanas)

_Enfoque: Indexabilidad orgánica real de proyectos y eliminación de soft-404._

| ID          | Hallazgo                                        | Acción de Remediación                                                                                                                                                                | Esfuerzo |
| ----------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| **BUG-002** | Soft-404 generalizado en `.htaccess`            | Corregir `public/.htaccess` para servir la página de error personalizada de Nuxt con estado HTTP 404 real en rutas estáticas inexistentes.                                           | S        |
| **BUG-003** | Contenido de proyectos ausente en HTML estático | Refactorizar `pages/projects/[...slugs].vue` para prerenderizar el marcado semántico completo del proyecto en el HTML estático en lugar de depender únicamente del modal de cliente. | L        |
| **BUG-004** | Slugs inválidos devuelven 200 sin modal         | Invocar `showError(createError({ statusCode: 404, statusMessage: 'Proyecto no encontrado', fatal: true }))` si el slug no coincide con ningún proyecto.                              | S        |
| **BUG-005** | API caída genera sitemap vacío en build         | Modificar `usefetchProjectsPaginated` para propagar el error y fallar el proceso de build (`process.exit(1)`) si la API no responde durante `npm run generate`.                      | S        |
| **SEO-001** | Metadatos y OG tags duplicados en proyectos     | Sincronizar dinámicamente `useHead()` con los datos del proyecto activo en `[...slugs].vue`.                                                                                         | S        |
| **SEO-005** | Múltiples `<h1>` generados en EditorJS          | Mapear encabezados de contenido desplazando niveles (`level 1` a `<h2>`, etc.) en `BlockHeader.vue`.                                                                                 | S        |

---

## Fase 4 — Accesibilidad Universal WCAG 2.2 AA (Plazo: 2 semanas)

_Enfoque: Eliminación de barreras para teclado y lectores de pantalla._

| ID           | Hallazgo                                | Acción de Remediación                                                                                                                                                    | Esfuerzo |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| **A11Y-003** | Foco escapa de los modales              | Implementar atrapamiento de foco (`focus-trap`), `role="dialog"`, `aria-modal="true"` y atributo `inert` en contenedor de fondo en `projectShow.vue` y `ImageSlide.vue`. | M        |
| **A11Y-004** | Bloques de lista en `<div>`             | Refactorizar `BlockListItems.vue` a etiquetas semánticas `<ul>` / `<ol>` y `<li>`.                                                                                       | S        |
| **A11Y-005** | Tablas de datos sin semántica           | Añadir `scope="col"` a cabeceras y elemento `<caption>` en `BlockTable.vue`.                                                                                             | S        |
| **A11Y-007** | Botones de solo icono sin `aria-label`  | Añadir etiquetas accesibles en botones de copiado (`BlockCode.vue`) y descargas.                                                                                         | S        |
| **A11Y-008** | Scroll suave forzado sin reduced-motion | Condicionar `window.scrollTo({ behavior })` según `matchMedia('(prefers-reduced-motion: reduce)')` en `middleware/scroll-to-top.global.ts`.                              | XS       |
| **UX-002**   | Campo mensaje con `contenteditable`     | Reemplazar `span[contenteditable]` por `<textarea>` accesible en `pages/contact.vue`.                                                                                    | S        |

---

## Fase 5 — Infraestructura, Operaciones y CI/CD (Plazo: 2–3 semanas)

_Enfoque: Despliegues reproducibles, atómicos y cabeceras de seguridad perimetrales._

| ID            | Hallazgo                              | Acción de Remediación                                                                                                                                                   | Esfuerzo |
| ------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **SEC-002**   | Ausencia de cabeceras de seguridad    | Configurar en Cloudflare / servidor web cabeceras CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` y `Referrer-Policy: strict-origin-when-cross-origin`. | M        |
| **INFRA-001** | Configuraciones de servidor obsoletas | Sincronizar y depurar `apache.conf` y `nginx.conf` eliminando configuraciones divergentes.                                                                              | M        |
| **INFRA-002** | Variables de entorno ausentes en GoCD | Inyectar `APP_URL`, `API_DOMAIN_URL`, `API_BASE_URL` en `gocd.yaml`.                                                                                                    | S        |
| **INFRA-003** | Despliegue en caliente no atómico     | Implementar despliegue por enlaces simbólicos versionados (`ln -sfn`) en `scripts/deploy.sh`.                                                                           | M        |
| **INFRA-004** | Falta purga de CDN en despliegues     | Añadir llamada de purga a la API de Cloudflare tras despliegue en GoCD y `deploy.sh`.                                                                                   | S        |

---

## Fase 6 — Calidad de Código y Deuda Técnica (Plazo: Próximo Ciclo)

_Enfoque: Mantenibilidad, cobertura de pruebas y coherencia documental._

| ID           | Hallazgo                                  | Acción de Remediación                                                                          | Esfuerzo |
| ------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| **CODE-001** | Archivo huérfano `apiClient.ts`           | Eliminar `utils/apiClient.ts` y documentar el uso de `$fetch` y `useApiBase()`.                | XS       |
| **CODE-002** | Documentación técnica desfasada (API v1)  | Actualizar exhaustivamente `docs/info/` y `AGENTS.md` a la especificación de API v2.           | M        |
| **CODE-003** | 38 advertencias de ESLint                 | Corregir `console.log`, tipar props y documentar justificaciones de `v-html`.                  | S        |
| **CODE-004** | Suite de tests sin componentes UI         | Incorporar tests unitarios con `@vue/test-utils` para páginas, modales y layouts.              | L        |
| **BUG-006**  | Error de hidratación en `usePlatformData` | Corregir manejo SSR para evitar peticiones no autorizadas en cliente durante la hidratación.   | S        |
| **BUG-007**  | Bloqueo de scroll al usar botón atrás     | Añadir desbloqueo de scroll (`overflow: auto`) en hook `onBeforeUnmount` de `projectShow.vue`. | XS       |
| **BUG-008**  | Uso de `history.pushState` nativo         | Sustituir por `useRouter().push()` en `pages/projects/[...slugs].vue`.                         | XS       |
| **BUG-009**  | Typo `privacity` en modelo                | Refactorizar propiedad `privacity` a `privacy` en formularios y tipos.                         | XS       |

---

## Controles Preventivos de Calidad (Integración Continua)

Para garantizar que los defectos subsanados no reaparezcan en futuras iteraciones, se deben incorporar las siguientes puertas automatizadas en `gocd.yaml`:

1. **Chequeo de Tipos Estricto:** Ejecutar `npx vue-tsc --noEmit` previo al build.
2. **Auditoría de Vulnerabilidades:** Añadir `npm audit --omit=dev --audit-level=high` en la fase de test.
3. **Validación de Accesibilidad Automatizada:** Ejecutar `npx pa11y-ci` o pruebas con `@axe-core/playwright` sobre el build generado.
4. **Comprobación de Enlaces:** Ejecutar `npx linkinator .output/public --recurse` asegurando 0 enlaces rotos antes de desplegar.
5. **Presupuestos de Rendimiento (Lighthouse CI):** Añadir asserciones de LCP ≤ 2.5s y Accesibilidad = 100 mediante `.lighthouserc.json`.
