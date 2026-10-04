# 09 · Dependencias y cadena de suministro

## Resumen

`npm audit` (basado en `package-lock.json`, el que usa el CI) informa de **35 vulnerabilidades: 1 crítica, 27 altas,
5 moderadas y 2 bajas**. La exposición real es menor: en un sitio estático casi todas afectan al **build o al
servidor de desarrollo**, no al visitante. Solo 4 están en dependencias de ejecución (`dompurify`, `nanoid`,
`postcss`, `undici`), y las de `dompurify` dependen de opciones que el proyecto no usa. El problema más serio es de
**reproducibilidad**: el `node_modules` local lo instaló **pnpm** (1.259 paquetes en `node_modules/.pnpm`), mientras
el CI y `scripts/deploy.sh` usan `npm ci`. Lint y tests se ejecutan en local sobre un árbol distinto del que valida
el pipeline. Además, `test:coverage` está roto y `vue-recaptcha-v3` no se publica desde 2022.

| ID      | Título                                                                                        | Severidad | Prioridad | Esfuerzo |
| ------- | --------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| DEP-001 | `node_modules` local instalado con pnpm, CI con npm: entornos no reproducibles                | Alta      | P1        | S        |
| DEP-002 | 35 vulnerabilidades conocidas (1 crítica en desarrollo; 4 en dependencias de ejecución)       | Alta      | P1        | M        |
| DEP-003 | `npm run test:coverage` falla: falta `@vitest/coverage-v8`                                    | Media     | P2        | XS       |
| DEP-004 | `vue-recaptcha-v3` sin mantenimiento desde mayo de 2022                                       | Media     | P2        | S        |
| DEP-005 | Versión de Node sin fijar y avisos del toolchain (`"type"`, scripts de instalación de npm 11) | Baja      | P2        | XS       |
| DEP-006 | Dependencias declaradas sin uso (`ts-node`, `tsconfig-paths`) y saltos mayores pendientes     | Baja      | P3        | S        |
| DEP-007 | Sin actualización automática (Renovate/Dependabot) ni `npm audit` en el CI                    | Media     | P2        | S        |

---

### DEP-001 — `node_modules` local instalado con pnpm, CI con npm

| Campo                   | Valor                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                      |
| Prioridad               | P1                                                                                                        |
| Confianza               | Verificado                                                                                                |
| Esfuerzo                | S                                                                                                         |
| Ámbito                  | Código / entorno                                                                                          |
| Ubicación               | `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc` (`shamefully-hoist=true`), `node_modules/.modules.yaml` |
| Dispositivo / navegador | —                                                                                                         |
| Referencias             | `AGENTS.md` («Usar npm… No introducir `pnpm-lock.yaml`»)                                                  |
| Relacionado con         | DEP-005, INFRA-001                                                                                        |

**Descripción.** El repositorio versiona `pnpm-lock.yaml` y `pnpm-workspace.yaml` a pesar de la norma de `AGENTS.md`.
El `node_modules` del equipo local tiene la estructura de pnpm (`node_modules/.pnpm/…`, `.modules.yaml` del
2026-07-04). `npm ls --all` sobre él informa de **9.367 líneas `invalid`** y **2.070 `extraneous`**. Cada comando npm
avisa: `npm warn Unknown project config "shamefully-hoist"`.

**Evidencia.** `evidencias/dependencias/npm-ls-resumen.txt`, y la comparación de ejecuciones:

```text
local (pnpm)        lint: 38 warnings · tests: 10 archivos / 45 tests
clon limpio (npm ci) lint: 37 warnings · tests:  8 archivos / 32 tests (HEAD sin los tests nuevos sin commitear)
```

**Impacto.** Lo que funciona en local puede fallar en el CI (o al revés) por versiones resueltas distintas. La
resolución de dependencias transitivas difiere entre lockfiles, así que el inventario de vulnerabilidades de
`npm audit` no describe el árbol con el que se desarrolla.

**Recomendación.** `rm -rf node_modules && npm ci`; eliminar `pnpm-lock.yaml`, `pnpm-workspace.yaml` y `.npmrc` (o
dejar solo opciones válidas para npm); añadir `"packageManager": "npm@11.x"` y `engines` en `package.json`. Si se
prefiere pnpm, migrar también `gocd.yaml`, `scripts/deploy.sh` y `AGENTS.md`.

**Verificación de la corrección.** `npm ls --all` sin `invalid` ni `extraneous`; sin avisos de configuración.

---

### DEP-002 — 35 vulnerabilidades conocidas

| Campo                   | Valor                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                            |
| Prioridad               | P1                                                                              |
| Confianza               | Verificado                                                                      |
| Esfuerzo                | M                                                                               |
| Ámbito                  | Código (dependencias)                                                           |
| Ubicación               | `package.json`, `package-lock.json`                                             |
| Dispositivo / navegador | —                                                                               |
| Referencias             | `evidencias/dependencias/npm-audit.json`, `npm-audit-prod.json`; OWASP A06:2021 |
| Relacionado con         | DEP-007                                                                         |

**Descripción.** Resumen por exposición real:

| Paquete (vía)                                        | Severidad         | Aviso principal                                                                          | Exposición real                                                                                          |
| ---------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `@nuxt/devtools` 2.7.0 (directa)                     | Crítica           | RPC sin autenticar permite ejecutar comandos en el host del desarrollador (< 3.3.1)      | **Equipo del desarrollador** durante `npm run dev`. `devtools.enabled` es `true` fuera de producción.    |
| `nuxt` 4.4.8 (directa)                               | Alta              | OOM en _island rendering_; `routeRules` ignoradas con mayúsculas (< 4.5.1)               | Baja: el sitio es estático (sin servidor Nitro ni islands).                                              |
| `dompurify` ≤ 3.4.12 (vía `isomorphic-dompurify`)    | Moderada          | Bypass con hooks `IN_PLACE` y `CUSTOM_ELEMENT_HANDLING`                                  | **Bundle de cliente**, pero el proyecto no usa esas opciones: riesgo bajo. Actualizar igualmente.        |
| `postcss`, `nanoid`, `undici`                        | Altas             | Path traversal en source maps, bucle con tamaño negativo, desincronización de respuestas | Build y prerender (Node), con entradas de confianza: riesgo bajo.                                        |
| `sharp`/`ipx` (libvips, libheif)                     | Altas             | CVE de libvips de 2026                                                                   | Build: procesa solo imágenes propias de `public/`. Bajo.                                                 |
| `tailwindcss` 3 → `chokidar`, `braces`, `micromatch` | Altas             | DoS por patrones                                                                         | Build y desarrollo. La corrección exige Tailwind 4 (cambio mayor bloqueado por `@nuxtjs/tailwindcss` 6). |
| `vitest`, `@vitest/mocker`, `esbuild`                | Moderadas y bajas | Lectura de archivos en el servidor de desarrollo o tests                                 | Solo desarrollo.                                                                                         |

Recuento: `{"low":2,"moderate":5,"high":27,"critical":1,"total":35}`; dependencias de producción (`--omit=dev`):
`{"moderate":1,"high":3,"total":4}`.

**Recomendación.**

1. `@nuxt/devtools` ≥ 3.3.1 (o desactivarlo: `devtools: { enabled: false }`) y no exponer `nuxt dev` fuera de
   `localhost`.
2. `nuxt` 4.5.x, `isomorphic-dompurify` ≥ 3.19 (que trae `dompurify` corregido), `@nuxt/image` 2.1 y `vitest` 4.1.11.
   Ninguno es un salto mayor (`npm outdated`: «Wanted»).
3. `npm audit fix` (sin `--force`) en una rama, con lint, tests y build en verde.
4. Planificar la migración a Tailwind 4 cuando `@nuxtjs/tailwindcss` lo soporte, o usar `@tailwindcss/vite`.

**Verificación de la corrección.** `npm audit --omit=dev` = 0 y `npm audit` sin críticas ni altas fuera de Tailwind 3.

---

### DEP-003 — `npm run test:coverage` falla

| Campo                   | Valor                                                          |
| ----------------------- | -------------------------------------------------------------- |
| Severidad               | Media                                                          |
| Prioridad               | P2                                                             |
| Confianza               | Verificado                                                     |
| Esfuerzo                | XS                                                             |
| Ámbito                  | Código                                                         |
| Ubicación               | `package.json:17` (`"test:coverage": "vitest run --coverage"`) |
| Dispositivo / navegador | —                                                              |
| Referencias             | `AGENTS.md` (documenta `npm run test:coverage`)                |
| Relacionado con         | CODE-003                                                       |

**Descripción.** El script de cobertura documentado en `AGENTS.md` y `docs/info` no funciona porque falta el
proveedor de cobertura de Vitest. No se puede medir qué parte del código cubren los tests.

**Evidencia.** `evidencias/build/coverage-raw.txt`:

```text
 MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-v8'
exit=1
```

**Recomendación.** `npm i -D @vitest/coverage-v8@4` y fijar umbrales mínimos en `vitest.config.ts` para `utils/` y
`composables/`.

---

### DEP-004 — `vue-recaptcha-v3` sin mantenimiento

| Campo                   | Valor                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                 |
| Prioridad               | P2                                                                                    |
| Confianza               | Verificado (`npm view`)                                                               |
| Esfuerzo                | S                                                                                     |
| Ámbito                  | Código                                                                                |
| Ubicación               | `package.json:44`, `plugins/google-recaptcha.ts`, `composables/useGoogleRecaptcha.ts` |
| Dispositivo / navegador | —                                                                                     |
| Referencias             | —                                                                                     |
| Relacionado con         | LEGAL-002, PERF-002                                                                   |

**Descripción.** Última publicación: `2.0.1` el 2022-05-23. El plugin carga el script en todas las páginas
(LEGAL-002). `TODO.md` ya propone sustituir reCAPTCHA por Cloudflare Turnstile.

**Recomendación.** Sustituirlo por Turnstile (sin cookies de Google; el sitio ya está en Cloudflare) o cargar
reCAPTCHA manualmente solo en `/contact`, sin dependencia.

---

### DEP-005 — Versión de Node sin fijar y avisos del toolchain

| Campo                   | Valor                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Severidad               | Baja                                                                |
| Prioridad               | P2                                                                  |
| Confianza               | Verificado                                                          |
| Esfuerzo                | XS                                                                  |
| Ámbito                  | Código                                                              |
| Ubicación               | `package.json` (sin `engines` ni `packageManager`); no hay `.nvmrc` |
| Dispositivo / navegador | —                                                                   |
| Referencias             | —                                                                   |
| Relacionado con         | DEP-001, INFRA-001                                                  |

**Descripción.** El equipo local usa Node v26.10.0 y npm 11.19.1. El CI y el servidor no fijan versión. En cada
build aparecen:

- `[MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of …/tailwind.config.ts is not specified`.
- npm 11: `6 packages have install scripts not yet covered by allowScripts` (`sharp`, `esbuild`, `@parcel/watcher`,
  `unrs-resolver`, `fsevents`).
- `nuxt:module-preload-polyfill` _sourcemap is likely to be incorrect_ (inofensivo).

**Recomendación.** `.nvmrc` con la LTS que use el servidor (Node 24) y `"engines": { "node": ">=24 <27" }`; aprobar
los scripts de instalación necesarios (`npm install-scripts approve sharp esbuild`) o declararlos en la
configuración; renombrar `tailwind.config.ts` a `.mts` o añadir `"type": "module"` tras comprobar los scripts.

---

### DEP-006 — Dependencias sin uso y saltos mayores pendientes

| Campo                   | Valor                                                  |
| ----------------------- | ------------------------------------------------------ |
| Severidad               | Baja                                                   |
| Prioridad               | P3                                                     |
| Confianza               | Verificado (knip + grep; descartados falsos positivos) |
| Esfuerzo                | S                                                      |
| Ámbito                  | Código                                                 |
| Ubicación               | `package.json:36-37`                                   |
| Dispositivo / navegador | —                                                      |
| Referencias             | `evidencias/dependencias/knip.txt`, `npm-outdated.txt` |
| Relacionado con         | CODE-002                                               |

**Descripción.** `ts-node` y `tsconfig-paths` no se usan en ningún script ni configuración (knip los marca; `vue-tsc`
y `@nuxt/devtools` también, pero son falsos positivos). Saltos mayores disponibles: `nuxt-gtag` 5, `isomorphic-dompurify`
4, TypeScript 7, Vitest 5, Tailwind 4 y `@types/node` 26. `compatibilityDate: '2024-09-10'` tiene dos años y no
activa los cambios de comportamiento posteriores de Nitro/Nuxt.

**Recomendación.** Eliminar `ts-node` y `tsconfig-paths`; planificar los mayores de uno en uno (empezando por
`nuxt-gtag` 5 e `isomorphic-dompurify` 4); revisar `compatibilityDate` tras actualizar Nuxt.

---

### DEP-007 — Sin actualización automática ni auditoría en el CI

| Campo                   | Valor                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                    |
| Prioridad               | P2                                                                                       |
| Confianza               | Verificado                                                                               |
| Esfuerzo                | S                                                                                        |
| Ámbito                  | Código / CI                                                                              |
| Ubicación               | `gocd.yaml` (sin etapa de auditoría); no hay `renovate.json` ni `.github/dependabot.yml` |
| Dispositivo / navegador | —                                                                                        |
| Referencias             | —                                                                                        |
| Relacionado con         | DEP-002, INFRA-001                                                                       |

**Descripción.** No hay ninguna herramienta que proponga actualizaciones (no existe `renovate.json` ni configuración
de Dependabot) y el pipeline no ejecuta `npm audit`. Las 35 vulnerabilidades de DEP-002 se han acumulado sin aviso.

**Recomendación.** Renovate (GitLab) con agrupación de parches y `npm audit --omit=dev --audit-level=high` como
puerta del CI.

---

## Licencias

`license-checker` sobre el árbol de `npm ci` (`evidencias/dependencias/licencias.txt`): MIT 880, ISC 57, Apache-2.0 46,
BSD-2/3 39, BlueOak 14, MIT-0 5, CC0 4, MPL-2.0 2, LGPL-3.0-or-later 1 (`libvips` vía `sharp`, solo en build),
CC-BY-4.0 1, CC-BY-3.0 1, Python-2.0 1 y otras duales. **Ninguna es incompatible** con la licencia GPL-3.0 del
proyecto. `UNLICENSED` corresponde al propio paquete (`"private": true`).

## Verificado y correcto

- ✅ `package-lock.json` sincronizado: `npm ci` en un clon limpio termina sin errores.
- ✅ Solo dos dependencias de ejecución declaradas (`isomorphic-dompurify`, `vue-recaptcha-v3`); el resto son de build,
  como corresponde a un SSG.
- ✅ Tailwind fijado en v3 y `@nuxt/devtools` en una versión estable, según `AGENTS.md`.
- ✅ `@types/dompurify` no está instalado (correcto: `dompurify` incluye sus propios tipos).
- ✅ Módulos Nuxt mantenidos activamente (cookie-control, sitemap, image, tailwindcss y nuxt publicados en agosto o
  septiembre de 2026).
