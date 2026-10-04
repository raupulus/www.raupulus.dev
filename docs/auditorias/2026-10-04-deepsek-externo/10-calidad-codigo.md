# 6.10 Calidad de código, tests y mantenibilidad (CODE) — Auditoría externa deepsek-externo

Resumen: las puertas estáticas están en verde (`eslint` 0 errores / 38 warnings, `vue-tsc` 0 errores, 45
tests OK), pero la cobertura de tests no se puede medir (`@vitest/coverage-v8` ausente) y faltan pruebas en
áreas críticas (routing de slugs, sanitización XSS, formulario, manejo de errores). La documentación está
desincronizada con el código en lo más básico: versión y endpoints de la API.

| ID       | Título                                                            | Sev.  | Prior. | Esf. |
| -------- | ----------------------------------------------------------------- | ----- | ------ | ---- |
| CODE-001 | Documentación desincronizada: API v1 (docs) vs v2 (código)        | Alta  | P1     | S    |
| CODE-002 | Cobertura de tests rota y sin cobertura en áreas críticas         | Media | P2     | M    |
| CODE-003 | Código/configuración muertos (`secretKey` sin uso, `plugins: []`) | Media | P2     | S    |
| CODE-004 | Uso de `any` en handlers                                          | Baja  | P3     | XS   |
| CODE-005 | 38 warnings de lint (props sin tipo/default, `v-html`)            | Baja  | P3     | M    |
| CODE-006 | Mutación de props (`BlockImage`)                                  | Baja  | P3     | XS   |
| CODE-007 | `useHead` fuera de setup (ver BUG-005)                            | Media | P2     | S    |

---

### CODE-001 — Documentación desincronizada con el código

| Campo       | Valor                                                                                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad   | Alta                                                                                                                                                                                                                                        |
| Prioridad   | P1                                                                                                                                                                                                                                          |
| Confianza   | Verificado                                                                                                                                                                                                                                  |
| Esfuerzo    | S                                                                                                                                                                                                                                           |
| Ámbito      | Código                                                                                                                                                                                                                                      |
| Ubicación   | `AGENTS.md:13,52,63`, `README.md:19`, `docs/info/nuxt-config.md:38,62`, `docs/info/utils.md:40`, `docs/info/composables.md:26`, `docs/info/deploy-cicd.md:98` frente a `composables/useApiBase.ts:7`, `utils/apiClient.ts:8`, `env.example` |
| Relacionado | BUG-001                                                                                                                                                                                                                                     |

**Descripción.** `AGENTS.md`, `README.md` y varios `docs/info/*.md` documentan **API v1**
(`api.raupulus.dev/api/v1`), pero el código usa **v2** (`/api/v2`) y endpoints distintos. Además los docs
listan endpoints que ya no existen (`/platforms/portfolio/info`) frente a los actuales
(`/platforms/{slug}`). También `deploy-cicd.md` documenta `API_BASE_URL=.../api/v1`.

**Evidencia.** `grep -rn "api/v1" AGENTS.md README.md docs/info/*.md` → múltiples coincidencias;
`grep -n "api/v2" composables/*.ts utils/*.ts` → uso real. `api.raupulus.dev/api/v1/*` responde `410 Gone`.

**Impacto.** Cualquiera (o cualquier agente) que siga la documentación configura un entorno roto; el propio
despliegue pudo partir de esa confusión (BUG-001).

**Recomendación.** Actualizar `AGENTS.md`, `README.md` y `docs/info/*` a v2 y a los endpoints vigentes;
corregir `deploy-cicd.md`.

**Verificación de la corrección.** `grep -rn "api/v1" --include=*.md .` → 0 coincidencias (fuera del prompt de auditoría).

---

### CODE-002 — Cobertura de tests rota y sin áreas críticas

| Campo       | Valor                                                             |
| ----------- | ----------------------------------------------------------------- |
| Severidad   | Media                                                             |
| Prioridad   | P2                                                                |
| Confianza   | Verificado                                                        |
| Esfuerzo    | M                                                                 |
| Ámbito      | Código                                                            |
| Ubicación   | `tests/` (10 ficheros, 45 tests), `evidencias/build/coverage.txt` |
| Relacionado | DEP-003                                                           |

**Descripción.** `pnpm run test:coverage` falla por falta de `@vitest/coverage-v8`. Los tests existentes
cubren composables y algunos bloques, pero **no** hay tests de: routing de slugs/404, `sanitizeHtml`/
`sanitizeRawHtml` frente a payloads XSS, flujo del formulario de contacto, ni manejo de errores de `apiGet`.

**Recomendación.** Añadir `@vitest/coverage-v8`, fijar umbrales y crear tests para sanitización (reutilizando
la PoC de SEC-003), catch-all/404, formulario y errores de red.

**Verificación de la corrección.** `test:coverage` exit 0 con umbral mínimo y nuevas suites en verde.

---

### CODE-003 — Código/configuración muertos

| Campo     | Valor                                                      |
| --------- | ---------------------------------------------------------- |
| Severidad | Media                                                      |
| Prioridad | P2                                                         |
| Confianza | Verificado                                                 |
| Esfuerzo  | S                                                          |
| Ámbito    | Código                                                     |
| Ubicación | `nuxt.config.ts:14-16,28-31`, `app.vue:106-115`, `pages/*` |

**Descripción.** `runtimeConfig.captcha.secretKey` no se usa en ningún sitio (el sitio es SSG y la
verificación del captcha es del backend). El array `plugins: []` está vacío. Hay bloques de código comentado
(CSRF en `app.vue`, `watch` en `contact.vue`, imports). `apps` de `app.vue` llama a `usePlatformData` sin uso
visible de `platformData` en la home.

**Recomendación.** Eliminar `captcha.secretKey` de `runtimeConfig` (superficie innecesaria) y limpiar código
comentado/valores muertos.

**Verificación de la corrección.** `grep -rn "secretKey" .` sin usos; sin bloques comentados.

---

### CODE-004 — Uso de `any`

| Campo     | Valor                                                                         |
| --------- | ----------------------------------------------------------------------------- |
| Severidad | Baja                                                                          |
| Prioridad | P3                                                                            |
| Confianza | Verificado                                                                    |
| Esfuerzo  | XS                                                                            |
| Ámbito    | Código                                                                        |
| Ubicación | `pages/projects/[...slugs].vue:75`, `pages/contact.vue:239`, warnings de lint |

**Descripción.** `handleClickTechnology(params: any)` y `isFormField(field: any)` usan `any`. Hay warnings de
`@typescript-eslint/no-explicit-any` en el lint.

**Recomendación.** Tipar parámetros con los tipos existentes (`TechnologyType`, `FormField | boolean`).

**Verificación de la corrección.** Sin warnings de `no-explicit-any`.

---

### CODE-005 — 38 warnings de lint

| Campo     | Valor                       |
| --------- | --------------------------- |
| Severidad | Baja                        |
| Prioridad | P3                          |
| Confianza | Verificado                  |
| Esfuerzo  | M                           |
| Ámbito    | Código                      |
| Ubicación | `evidencias/build/lint.txt` |

**Descripción.** 0 errores, 38 warnings: `vue/no-required-prop-with-default` y `vue/require-prop-types` en
varios bloques/componentes (`contentPaginator`, `card/*`), `vue/no-v-html` (esperado) y algún `any`. Se
toleran según `AGENTS.md`, pero conviene reducirlos.

**Recomendación.** Tipar/opcionalizar props (usar `default` con función donde aplique) y documentar los
`v-html` justificados con `eslint-disable-next-line` y comentario.

**Verificación de la corrección.** `pnpm run lint` con 0 errores y warnings acotados a `v-html`/`any`
justificados.

---

### CODE-006 — Mutación de props en `BlockImage`

| Campo       | Valor                                         |
| ----------- | --------------------------------------------- |
| Severidad   | Baja                                          |
| Prioridad   | P3                                            |
| Confianza   | Verificado                                    |
| Esfuerzo    | XS                                            |
| Ámbito      | Código                                        |
| Ubicación   | `components/content/blocks/BlockImage.vue:35` |
| Relacionado | BUG-011                                       |

**Descripción.** `image.data.caption = ...` muta el objeto recibido por prop en `setup`.

**Recomendación.** Usar un `computed` para el caption sin mutar props.

**Verificación de la corrección.** Sin mutaciones de props (revisión de código/tests).

---

### CODE-007 — `useHead` fuera de setup

Ver **BUG-005**. Se enlaza aquí por ser deuda de calidad en la página de proyectos.

---

## Verificado y correcto

- `pnpm run lint`: 0 errores (38 warnings tolerados por `AGENTS.md`).
- `pnpm exec vue-tsc --noEmit`: 0 errores con TypeScript estricto.
- `pnpm run test:run`: 10 ficheros / 45 tests en verde.
- Convenciones de `AGENTS.md` respetadas en su mayoría: `<script setup lang="ts">`, `:key` en `v-for`,
  single root en páginas, `NuxtImg` en imágenes locales, tokens Tailwind, `useApiBase`, `useState`.
- Tipos en `types/**` con sufijo `Type` y tipos de plataforma en `types/Platform/`.
- Sin `console.log` (solo `console.warn`/`console.error` permitidos).
- `utils/sanitize.ts` centraliza la sanitización y se usa en todos los bloques con `v-html` salvo `BlockCode`
  (que además convierte saltos).
