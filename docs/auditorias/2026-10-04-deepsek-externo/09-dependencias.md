# 6.9 Dependencias y cadena de suministro (DEP) — Auditoría externa deepsek-externo

Resumen: el proyecto **no tiene un gestor de paquetes coherente**. La documentación (`AGENTS.md`), el CI
(`gocd.yaml`) y `scripts/deploy.sh` usan **npm**, pero el repositorio versiona `pnpm-lock.yaml`,
`pnpm-workspace.yaml` y un `.npmrc` con `shamefully-hoist`, además de `package-lock.json`. Eso hace el build
no reproducible. `pnpm audit` reporta 1 vulnerabilidad crítica y 47 altas, casi todas en herramientas de
desarrollo/build, con la excepción reseñable de `@nuxt/devtools` (RCE) y `sharp`/`nuxt`. `pnpm run
test:coverage` está roto por falta de dependencia.

| ID      | Título                                                                | Sev.  | Prior. | Esf. |
| ------- | --------------------------------------------------------------------- | ----- | ------ | ---- |
| DEP-001 | Incoherencia de gestor: npm (docs/CI) vs pnpm (lock/workspace/.npmrc) | Alta  | P1     | S    |
| DEP-002 | `pnpm audit`: 1 crítica (@nuxt/devtools RCE) y 47 altas               | Alta  | P1     | M    |
| DEP-003 | `pnpm run test:coverage` falla (falta `@vitest/coverage-v8`)          | Media | P2     | XS   |
| DEP-004 | Dependencias desactualizadas (varias con salto mayor)                 | Media | P2     | M    |
| DEP-005 | `@nuxt/devtools` 2.7 no cubre el fix crítico (≥ 3.3.1)                | Media | P2     | M    |
| DEP-006 | Versión de Node no fijada                                             | Media | P2     | XS   |
| DEP-007 | `.npmrc` con `shamefully-hoist` no soportado por npm (warning)        | Baja  | P3     | XS   |
| DEP-008 | Licencias del árbol no verificadas                                    | —     | —      | —    |

---

### DEP-001 — Incoherencia de gestor de paquetes

| Campo       | Valor                                                                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad   | Alta                                                                                                                                    |
| Prioridad   | P1                                                                                                                                      |
| Confianza   | Verificado                                                                                                                              |
| Esfuerzo    | S                                                                                                                                       |
| Ámbito      | Ambos                                                                                                                                   |
| Ubicación   | `AGENTS.md:19`, `gocd.yaml:29,41,57`, `scripts/deploy.sh:20-21`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, `package-lock.json` |
| Relacionado | INFRA-004                                                                                                                               |

**Descripción.** `AGENTS.md` indica explícitamente «Usar npm, nunca npm ni yarn. Instalar con `npm install`…».
Pero el repo contiene `pnpm-lock.yaml` + `pnpm-workspace.yaml` + `.npmrc` (`shamefully-hoist=true`) y también
`package-lock.json`. El CI y el script de despliegue usan `npm ci`. Dos lockfiles y dos gestores = build no
reproducible y resolución de dependencias divergente entre local y CI.

**Evidencia.**

```
$ ls -la pnpm-lock.yaml pnpm-workspace.yaml .npmrc package-lock.json
-rw-rw----  1 ...  21 .npmrc                       # shamefully-hoist=true
-rw-rw----@ 1 ... 759797 package-lock.json
-rw-rw----@ 1 ... 434816 pnpm-lock.yaml
-rw-r--r--@ 1 ... 176 pnpm-workspace.yaml
```

**Recomendación.** Elegir un único gestor. Si es **pnpm** (lo que confirma el propietario): actualizar
`AGENTS.md`, `gocd.yaml` y `deploy.sh` para usar `pnpm install --frozen-lockfile` / `pnpm run …`, eliminar
`package-lock.json` y fijar `packageManager` en `package.json`. Si es npm: eliminar los ficheros de pnpm y
`shamefully-hoist`.

**Verificación de la corrección.** Un solo lockfile versionado; el CI usa el mismo gestor; `git ls-files | grep -E 'lock'`
no muestra ambos.

---

### DEP-002 — `pnpm audit`: 1 crítica y 47 altas

| Campo       | Valor                          |
| ----------- | ------------------------------ |
| Severidad   | Alta                           |
| Prioridad   | P1                             |
| Confianza   | Verificado                     |
| Esfuerzo    | M                              |
| Ámbito      | Ambos                          |
| Ubicación   | `pnpm-audit.json` (evidencias) |
| Referencias | CVE/GHSA, OWASP A06            |

**Descripción.** `pnpm audit` devuelve `{critical:1, high:47, moderate:24, low:6}`. Casi todas son DoS de
herramientas de build (brace-expansion, undici, browserslist, fast-uri) o de `jsdom`. Las relevantes por
exposición:

- **Crítica — `@nuxt/devtools` < 3.3.1**: RPC no autenticado que permite ejecución arbitraria en el host del
  desarrollador. Es devDependency y `devtools.enabled` es `false` en producción, pero se ejecuta en el
  servidor de desarrollo y en el build.
- **Alta — `nuxt` < 4.5.1**: RCE por _Runtime Template Injection_ en Server Islands, disclosure de payload,
  OOM; la mayoría **no aplican al runtime** de un sitio SSG estático, pero sí conviene actualizar (build).
- **Alta — `sharp` < 0.35.x** (vía `@nuxt/image > ipx`): procesa imágenes en build.
- **Alta — `undici` < 7.29.x** (vía `jsdom`, arrastrado por `isomorphic-dompurify` y por tests).

**Evidencia.** `docs/auditorias/2026-10-04-deepsek-externo/evidencias/dependencias/pnpm-audit.json`
(`metadata.vulnerabilities` y `advisories`).

**Recomendación.** Actualizar `nuxt` a ≥ 4.5.1, `@nuxt/devtools` a la línea que corrija la RCE, `sharp` y
`undici`. Clasificar cada aviso por exposición (bundle cliente / build / dev) y añadir `pnpm audit` al CI.

**Verificación de la corrección.** `pnpm audit` sin críticas ni altas con exposición real.

---

### DEP-003 — `test:coverage` roto

| Campo       | Valor                                              |
| ----------- | -------------------------------------------------- |
| Severidad   | Media                                              |
| Prioridad   | P2                                                 |
| Confianza   | Verificado                                         |
| Esfuerzo    | XS                                                 |
| Ámbito      | Código                                             |
| Ubicación   | `package.json:17`, `evidencias/build/coverage.txt` |
| Relacionado | CODE-005                                           |

**Descripción.** `pnpm run test:coverage` termina con exit 1 por dependencia ausente:

```
MISSING DEPENDENCY  Cannot find dependency '@vitest/coverage-v8'
```

El script está documentado en `AGENTS.md` como puerta de calidad.

**Recomendación.** Añadir `@vitest/coverage-v8` como devDependency (coherente con Vitest 4) y fijar umbral
de cobertura.

**Verificación de la corrección.** `pnpm run test:coverage` exit 0 y reporte por archivo.

---

### DEP-004 — Dependencias desactualizadas

| Campo     | Valor                                  |
| --------- | -------------------------------------- |
| Severidad | Media                                  |
| Prioridad | P2                                     |
| Confianza | Verificado                             |
| Esfuerzo  | M                                      |
| Ámbito    | Código                                 |
| Ubicación | `evidencias/dependencias/outdated.txt` |

**Descripción.** Varias dependencias directas están por detrás, algunas con salto mayor:

| Paquete                         | Actual | Latest  | Salto |
| ------------------------------- | ------ | ------- | ----- |
| isomorphic-dompurify            | 3.18.0 | 4.4.0   | mayor |
| nuxt-gtag                       | 4.1.0  | 5.0.0   | mayor |
| nuxt                            | 4.4.8  | 4.5.2   | minor |
| @nuxt/image                     | 2.0.0  | 2.1.0   | minor |
| @nuxtjs/sitemap                 | 8.2.2  | 8.6.1   | minor |
| @nuxt/test-utils                | 4.0.3  | 4.3.3   | minor |
| @dargmuesli/nuxt-cookie-control | 9.2.0  | 9.3.8   | minor |
| eslint                          | 10.6.0 | 10.12.0 | minor |
| typescript                      | 6.0.3  | 7.0.2   | mayor |
| vitest                          | 4.1.9  | 5.0.3   | mayor |

(`tailwindcss` 3.4.19 → 4.x es intencionadamente fijo por el módulo `@nuxtjs/tailwindcss` 6.)

**Recomendación.** Actualizar menores con seguridad (focus en `nuxt`, `@nuxtjs/sitemap`, `@nuxt/image`),
evaluar los mayores (`isomorphic-dompurify`, `nuxt-gtag`) con sus guías de migración. Usar Renovate/Dependabot.

**Verificación de la corrección.** `pnpm outdated` con solo los saltos mayores asumidos; tests en verde.

---

### DEP-005 — `@nuxt/devtools` no cubre el fix crítico

| Campo       | Valor                                       |
| ----------- | ------------------------------------------- |
| Severidad   | Media                                       |
| Prioridad   | P2                                          |
| Confianza   | Verificado                                  |
| Esfuerzo    | M                                           |
| Ámbito      | Código                                      |
| Ubicación   | `package.json:21` (`@nuxt/devtools ^2.7.0`) |
| Relacionado | DEP-002                                     |

**Descripción.** La corrección de la RCE de devtools es `>= 3.3.1`, pero `AGENTS.md` pide la última **estable**
y `pnpm outdated` ofrece `4.0.0-beta.3` como “latest”, señal de que la rama estable puede estar en 2.7.
`2.7.0` queda vulnerable si se expone el servidor de desarrollo.

**Recomendación.** Confirmar la última versión **estable** de devtools que incluya el parche (≥ 3.3.1) y
actualizar; si no existe estable parcheada, no exponer el dev server fuera de `localhost` y desactivar
devtools por defecto.

**Verificación de la corrección.** `pnpm audit` sin la crítica de devtools; devtools no accesible fuera de loopback.

---

### DEP-006 — Node sin fijar

| Campo     | Valor                                           |
| --------- | ----------------------------------------------- |
| Severidad | Media                                           |
| Prioridad | P2                                              |
| Confianza | Verificado                                      |
| Esfuerzo  | XS                                              |
| Ámbito    | Ambos                                           |
| Ubicación | Ausencia de `engines`, `.nvmrc`/`.node-version` |

**Descripción.** No hay `engines` en `package.json` ni `.nvmrc`. Local se usa **Node v26.10.0**; no se puede
garantizar la misma versión en CI/servidor, lo que agrava DEP-001 (build no reproducible).

**Recomendación.** Añadir `"engines": { "node": ">=20 <21" }` (o la LTS elegida) y `.nvmrc`.

**Verificación de la corrección.** `node -v` en local/CI/despliegue coincide con el rango declarado.

---

### DEP-007 — `shamefully-hoist` no soportado por npm

| Campo       | Valor      |
| ----------- | ---------- |
| Severidad   | Baja       |
| Prioridad   | P3         |
| Confianza   | Verificado |
| Esfuerzo    | XS         |
| Ámbito      | Código     |
| Ubicación   | `.npmrc`   |
| Relacionado | DEP-001    |

**Descripción.** Ejecutar con npm emite `npm warn Unknown project config "shamefully-hoist". This will stop
working in the next major version of npm.` Es un síntoma directo de la incoherencia de gestor.

**Recomendación.** Eliminar `.npmrc`/`shamefully-hoist` si se adopta npm, o asumir pnpm (DEP-001).

**Verificación de la corrección.** Sin warnings de config desconocida.

---

### DEP-008 — Licencias no verificadas

| Campo     | Valor         |
| --------- | ------------- |
| Severidad | —             |
| Prioridad | —             |
| Confianza | No verificado |
| Esfuerzo  | —             |
| Ámbito    | —             |
| Ubicación | —             |

**Descripción.** No se ejecutó `license-checker-rseidelsohn` (no incluido en el repo). La licencia del
proyecto (`LICENSE`) debe comprobarse frente a las del árbol (fuentes OFL, iconos Apache 2.0, DOMPurify
Apache/MPL, etc.).

**Recomendación.** Ejecutar `npx --yes license-checker-rseidelsohn --summary` y revisar incompatibilidades
en CI.

---

## Verificado y correcto

- `pnpm-lock.yaml` presente y coherente con `package.json` para instalaciones pnpm.
- Las dependencias están razonablemente acotadas (caret) y las críticas de UI/a11y están cubiertas.
- `tailwindcss` correctamente fijado en v3 (compatible con `@nuxtjs/tailwindcss` 6).
- `dompurify` no duplica tipos (`@types/dompurify` deprecado no instalado).
- `@nuxt/devtools` no usa versiones alpha en `package.json`.
