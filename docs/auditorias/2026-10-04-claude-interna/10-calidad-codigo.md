# 10 · Calidad de código, tests y mantenibilidad

## Resumen

Las puertas de calidad básicas están en verde: **ESLint 0 errores (38 avisos)**, **`vue-tsc --noEmit` 0 errores** y
**45/45 tests** (10 archivos). El código migrado es legible, con comentarios en español y composables bien
separados. Los riesgos están en lo que no se prueba ni se mide: la cobertura no funciona, no hay tests de páginas ni
del formulario, y conviven **11 archivos muertos** (10 componentes y `utils/apiClient.ts`) con la documentación que
los describe como activos. El hallazgo más relevante es que **el build lee la URL de la API desde dos fuentes
distintas**, y en una misma ejecución el prerender y el sitemap usaron APIs diferentes.

| ID       | Título                                                                                             | Severidad | Prioridad | Esfuerzo |
| -------- | -------------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| CODE-001 | El build obtiene la URL de la API de dos fuentes distintas y mezcla datos en una misma ejecución   | Media     | P1        | S        |
| CODE-002 | 11 archivos muertos (10 componentes y `utils/apiClient.ts`), uno con imports a assets inexistentes | Media     | P2        | S        |
| CODE-003 | Sin tests en las zonas críticas (rutas de proyectos, formulario, embeds, código) ni cobertura      | Media     | P2        | M        |
| CODE-004 | 38 avisos de ESLint, 24 de ellos en props sin tipo o mal declaradas                                | Baja      | P3        | S        |
| CODE-005 | Documentación (`AGENTS.md`, `docs/info`) con componentes muertos y comandos rotos                  | Baja      | P3        | XS       |
| CODE-006 | CSS inválido o residual (`align-items: top`, `.material-symbols-outlined`, `vars.css`)             | Baja      | P3        | XS       |

---

### CODE-001 — El build obtiene la URL de la API de dos fuentes distintas

| Campo                   | Valor                                                                                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                                                                                                       |
| Prioridad               | P1                                                                                                                                                                                                                          |
| Confianza               | Verificado (efecto) / Probable (causa exacta)                                                                                                                                                                               |
| Esfuerzo                | S                                                                                                                                                                                                                           |
| Ámbito                  | Código                                                                                                                                                                                                                      |
| Ubicación               | `composables/projectsData.ts:225` (`process.env.API_BASE_URL \|\| 'https://api.raupulus.dev/api/v2'`), `nuxt.config.ts:147-176` (hook en el contexto de Nuxt) y `nuxt.config.ts:186-210` (sitemap, en el contexto de Nitro) |
| Dispositivo / navegador | —                                                                                                                                                                                                                           |
| Referencias             | Nuxt «Runtime config» (variables `NUXT_*`)                                                                                                                                                                                  |
| Relacionado con         | BUG-002                                                                                                                                                                                                                     |

**Descripción.** `usefetchProjectsPaginated` no usa `runtimeConfig`: lee `process.env.API_BASE_URL` y, si no existe,
usa una URL fija. La llaman dos contextos distintos: el hook `prerender:routes` (proceso de Nuxt) y la función
`sitemap.urls` (ejecutada por Nitro durante el prerender, que vuelve a cargar `.env`).

**Evidencia.** Build en el repositorio con las variables exportadas en la shell (API pública) y un `.env` local que
apunta a `localhost:8000` (backend con datos):

```text
cachedRoutes.json (hook prerender)  → ["/"]                      ← API pública v2 (0 proyectos)
sitemap.xml (sitemap.urls)          → 34 URLs /projects/…        ← API local de .env
runtimeConfig.public.api.base       → http://localhost:8000/api/v2
```

En un clon sin `.env` y con las variables exportadas, todo se resuelve con la misma API: la mezcla depende de qué
fuente gana en cada contexto.

**Impacto.** Builds no deterministas: sitemap, rutas prerenderizadas y datos de cliente pueden venir de APIs o
versiones distintas sin ningún aviso.

**Recomendación.** Una sola fuente: leer la URL base de `useRuntimeConfig()` (o de una función común que lea
`process.env` una vez en `nuxt.config.ts` y la pase como argumento), eliminar la URL fija de respaldo y registrar en
el log del build la URL usada.

**Verificación de la corrección.** Build con `.env` y variables de shell distintas: `cachedRoutes.json`, `sitemap.xml`
y `window.__NUXT__.config.public.api` coinciden.

---

### CODE-002 — 11 archivos muertos

| Campo                   | Valor                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Severidad               | Media                                                                                                                                                                                                                                                                                                                                                        |
| Prioridad               | P2                                                                                                                                                                                                                                                                                                                                                           |
| Confianza               | Verificado (knip + búsqueda de uso, descartando falsos positivos)                                                                                                                                                                                                                                                                                            |
| Esfuerzo                | S                                                                                                                                                                                                                                                                                                                                                            |
| Ámbito                  | Código                                                                                                                                                                                                                                                                                                                                                       |
| Ubicación               | `components/Alert.vue`, `components/HeaderImage.vue`, `components/Trajectory.vue`, `components/SpecializationBadge.vue` (solo lo usa `Trajectory`), `components/StackBadge.vue`, `components/card/Project.vue`, `components/card/Skill.vue`, `components/card/Vertical.vue`, `components/form/Select.vue`, `components/icons/Info.vue`, `utils/apiClient.ts` |
| Dispositivo / navegador | —                                                                                                                                                                                                                                                                                                                                                            |
| Referencias             | `evidencias/dependencias/knip.txt`                                                                                                                                                                                                                                                                                                                           |
| Relacionado con         | CODE-005, DEP-006                                                                                                                                                                                                                                                                                                                                            |

**Descripción.** Ninguna página, layout ni componente usado referencia estos archivos. `HeaderImage.vue:24` importa
`@/assets/images/technologies/vuejs_60x60.webp`, que **no existe**: si alguien vuelve a usar el componente, el build
falla. `utils/apiClient.ts` (125 líneas, con `apiPost`, que tiene su propio flujo CSRF) no lo usa nadie;
`docs/info/utils.md:48` lo reconoce. knip también marca `assets/css/tailwind.css`, `BlockListItems.vue` y
`useApiDomain`, pero son **falsos positivos** (los usan `@nuxtjs/tailwindcss` y los auto-imports de Nuxt).

**Impacto.** Ruido de mantenimiento, avisos de lint, falsas pistas para quien lee el código (dos clientes API, dos
flujos CSRF) y documentación inflada.

**Recomendación.** Eliminar los 11 archivos y sus entradas en `docs/info/componentes-ui.md` y `docs/info/utils.md`.
Añadir `knip` (con configuración para Nuxt) al CI.

---

### CODE-003 — Sin tests en las zonas críticas

| Campo                   | Valor                                       |
| ----------------------- | ------------------------------------------- |
| Severidad               | Media                                       |
| Prioridad               | P2                                          |
| Confianza               | Verificado                                  |
| Esfuerzo                | M                                           |
| Ámbito                  | Código                                      |
| Ubicación               | `tests/` (10 archivos, 45 tests)            |
| Dispositivo / navegador | —                                           |
| Referencias             | —                                           |
| Relacionado con         | DEP-003, BUG-002, BUG-003, BUG-006, SEC-004 |

**Descripción.** Los tests cubren `utils/sanitize.ts` (9), `utils/ContentUtils.ts` (8), los composables de datos
(17) y cuatro bloques (11). No hay tests de:

- Rutas de `pages/projects/[...slugs].vue` (slug inexistente, historial, metadatos): BUG-003.
- Formulario de contacto (validaciones, honeypot, errores de la API): BUG-007.
- `BlockEmbed` y `BlockCode` (los dos bloques con hallazgos): SEC-004, BUG-006.
- Hooks de `nuxt.config.ts` (build sin proyectos): BUG-002.
- Ninguna prueba E2E (Playwright) ni de accesibilidad (axe).

La cobertura no se puede medir (DEP-003).

**Recomendación.** Priorizar tests que fijen los hallazgos corregidos: un test por bug de severidad alta o superior.
Añadir un smoke test E2E (Playwright) sobre el build estático en el CI: carga de cada ruta sin errores de consola,
apertura de un proyecto, 404 real y axe sin violaciones `serious`.

---

### CODE-004 — 38 avisos de ESLint

| Campo                   | Valor                                                                         |
| ----------------------- | ----------------------------------------------------------------------------- |
| Severidad               | Baja                                                                          |
| Prioridad               | P3                                                                            |
| Confianza               | Verificado                                                                    |
| Esfuerzo                | S                                                                             |
| Ámbito                  | Código                                                                        |
| Ubicación               | `evidencias/build/lint.txt`                                                   |
| Dispositivo / navegador | —                                                                             |
| Referencias             | `AGENTS.md` (se toleran `v-html`, `any` y `no-console` si están justificados) |
| Relacionado con         | CODE-002                                                                      |

**Descripción.** 14 `vue/no-v-html` (13 en bloques EditorJS con `sanitizeHtml`, más `MaterialIcon` con comentario de
justificación), 4 `no-console` (`nuxt.config.ts` y `utils/apiClient.ts`), 3 `no-explicit-any` y **17 avisos de props**
(`vue/require-prop-types`, `vue/no-required-prop-with-default`, `vue/require-default-prop`), concentrados en
`contentPaginator.vue`, `ImageSlide.vue`, `StackBadge*.vue` y las tarjetas. `AGENTS.md` no justifica estos últimos.

**Recomendación.** Tipar las props con `defineProps<…>()` + `withDefaults`, y documentar los `v-html` restantes con un
comentario `eslint-disable-next-line` justificado (como ya hace `MaterialIcon`).

---

### CODE-005 — Documentación con componentes muertos y comandos rotos

| Campo                   | Valor                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                                                          |
| Prioridad               | P3                                                                                                                            |
| Confianza               | Verificado (estado a las 19:20; la documentación se actualizó durante la auditoría)                                           |
| Esfuerzo                | XS                                                                                                                            |
| Ámbito                  | Código                                                                                                                        |
| Ubicación               | `AGENTS.md:41,100-114,181`, `docs/info/componentes-ui.md:10,14`, `docs/info/deploy-cicd.md:55`, `docs/info/nuxt-config.md:93` |
| Dispositivo / navegador | —                                                                                                                             |
| Referencias             | `AGENTS.md` («Documentación técnica de módulos — OBLIGATORIO mantener actualizada»)                                           |
| Relacionado con         | CODE-002, DEP-003                                                                                                             |

**Descripción.** Durante la auditoría, `AGENTS.md`, `README.md` y 10 archivos de `docs/info/` se actualizaron a la API
v2, lo que resuelve el desfase de endpoints detectado al inicio. Quedan:

- La estructura de componentes de `AGENTS.md` lista los componentes muertos de CODE-002 y omite `components/ui/`
  (`MaterialIcon.vue`).
- `npm run test:coverage` aparece documentado en 3 sitios, pero falla (DEP-003).
- `docs/info/componentes-ui.md` describe `HeaderImage` y `Trajectory` como componentes activos.

**Recomendación.** Actualizar al eliminar el código muerto.

---

### CODE-006 — CSS inválido o residual

| Campo                   | Valor                                                                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Severidad               | Baja                                                                                                                                                                                                                                       |
| Prioridad               | P3                                                                                                                                                                                                                                         |
| Confianza               | Verificado (W3C Nu Checker y búsqueda)                                                                                                                                                                                                     |
| Esfuerzo                | XS                                                                                                                                                                                                                                         |
| Ámbito                  | Código                                                                                                                                                                                                                                     |
| Ubicación               | `components/grid/Projects.vue:116` (`align-items: top`), `components/modals/projectShow.vue:177,283` (`line-clamp` sin prefijo ni `display: -webkit-box`), `assets/css/theme.css:84` (`.material-symbols-outlined`), `assets/css/vars.css` |
| Dispositivo / navegador | —                                                                                                                                                                                                                                          |
| Referencias             | `evidencias/validacion-html-w3c.txt`                                                                                                                                                                                                       |
| Relacionado con         | UX-006                                                                                                                                                                                                                                     |

**Descripción.** `align-items: top` no es un valor válido (se ignora). `line-clamp` sin `display: -webkit-box` no
recorta. `.material-symbols-outlined` es un residuo de la fuente de iconos eliminada. `vars.css` es la paleta antigua
(UX-006).

**Recomendación.** `align-items: start`; `line-clamp-2` de Tailwind; eliminar las reglas residuales.

---

## Cumplimiento de las convenciones de `AGENTS.md`

| Convención                                                           | Estado | Notas                                                                                                         |
| -------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `<script setup lang="ts">` en componentes                            | ✅     | Todos los `.vue` revisados.                                                                                   |
| `v-for` con `:key`; no combinar `v-if` + `v-for`                     | ✅     | Se usa `<template v-for>` envolvente.                                                                         |
| Props Array/Object con `default: () => …`                            | ✅     | —                                                                                                             |
| Sin `const props = defineProps` sin usar                             | ✅     | Comprobado con búsqueda: todos los `props` se usan.                                                           |
| Un único elemento raíz en `pages/*.vue`                              | ✅     | 8/8 páginas.                                                                                                  |
| `useHead()` completo en cada página                                  | ⚠️     | `/blog` y la home sin `og:url`/`og:image` propios (SEO-005).                                                  |
| Imágenes con `<NuxtImg>`, webp, lazy y dimensiones                   | ⚠️     | Excepción justificada en las tarjetas (`<img>` con comentario); faltan dimensiones (RESP-006).                |
| Tokens del design system, sin clases globales tipo Tailwind          | ⚠️     | Sin clases globales conflictivas; sí colores fijos (UX-006).                                                  |
| Sanitización con `sanitizeHtml()`/`sanitizeRawHtml()`                | ⚠️     | Aplicada en todos los `v-html` de contenido, salvo `BlockEmbed` (`:src` sin validar) y `BlockCode` (BUG-006). |
| `useApiBase()` para la URL de la API                                 | ⚠️     | Excepto en el build (CODE-001).                                                                               |
| Estado global con `useState()`                                       | ✅     | `composables/states.ts`, `projectsData.ts` y `platformData.ts`.                                               |
| Accesos SSR seguros a `window`/`document`                            | ✅     | Solo en `onMounted`, manejadores de eventos o con `typeof document` comprobado.                               |
| Responsive desde 320 px                                              | ❌     | RESP-002                                                                                                      |
| Botones solo-icono con `aria-label`; clicables como `<button>`/`<a>` | ❌     | A11Y-002, A11Y-003, A11Y-009                                                                                  |

## Verificado y correcto

- ✅ `npm run lint`: 0 errores.
- ✅ `npx vue-tsc --noEmit`: 0 errores (en local y en el clon limpio).
- ✅ `npm run test:run`: 45/45 en local y 32/32 en el clon limpio de `HEAD`.
- ✅ Tipos en `types/` con el sufijo `Type` y un subdirectorio `Platform/` según la convención.
- ✅ Sin `@ts-ignore` en el código de la aplicación.
- ✅ Composables con estado por petición (`useState`) que evitan fugas entre peticiones en SSR.
