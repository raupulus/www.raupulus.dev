# 11 · Infraestructura, CI/CD y operación

## Resumen

La operación es el área con más riesgo estructural. **El pipeline de GoCD no puede ejecutarse tal como está
escrito**: define `NODE_ENV=production` para todo el pipeline, y con esa variable `npm ci` no instala las
devDependencies (Nuxt, ESLint, Vitest). Aunque se corrigiera, el despliegue no recupera el artefacto, la
verificación posterior nunca falla y no hay puertas de calidad. Las configuraciones de servidor versionadas no
coinciden con lo que sirve producción (Apache detrás de Cloudflare), producción lleva un build de hace un mes
apuntando a una API retirada sin que ninguna monitorización lo haya detectado, y **toda la migración de la plantilla
está sin commitear** (50 archivos modificados, eliminados o nuevos en `dev` al iniciar la auditoría).

| ID        | Título                                                                                                | Severidad | Prioridad | Esfuerzo |
| --------- | ----------------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| INFRA-001 | El pipeline de GoCD no puede ejecutarse y su despliegue no es fiable                                  | Alta      | P0        | S        |
| INFRA-002 | Las configuraciones de servidor versionadas no reflejan producción                                    | Alta      | P1        | S        |
| INFRA-003 | `scripts/deploy.sh` despliega en caliente, sin atomicidad, y verifica solo una URL que siempre da 200 | Media     | P2        | S        |
| INFRA-004 | `www.raupulus.dev` no resuelve en DNS                                                                 | Media     | P2        | XS       |
| INFRA-005 | Sin monitorización de disponibilidad ni de errores de usuario                                         | Media     | P1        | S        |
| INFRA-006 | Producción desfasada, sin trazabilidad de versión y con la migración sin commitear                    | Alta      | P0        | S        |

---

### INFRA-001 — El pipeline de GoCD no puede ejecutarse y su despliegue no es fiable

| Campo                   | Valor                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                    |
| Prioridad               | P0                                                                                                      |
| Confianza               | Verificado (`NODE_ENV`, verificación con `curl`) / Probable (artefacto: depende del agente de GoCD)     |
| Esfuerzo                | S                                                                                                       |
| Ámbito                  | Código                                                                                                  |
| Ubicación               | `gocd.yaml:15-16` (`NODE_ENV: production`), `gocd.yaml:29,41,57` (`npm ci`), `gocd.yaml:60-79` (deploy) |
| Dispositivo / navegador | —                                                                                                       |
| Referencias             | npm docs: `omit` vale `dev` por defecto si `NODE_ENV=production`; GoCD «Fetch artifact task»            |
| Relacionado con         | BUG-002, DEP-001, DEP-007, INFRA-006                                                                    |

**Descripción.**

1. **Las devDependencies no se instalan.** `NODE_ENV: production` se aplica a todas las etapas. Todo lo necesario
   para lint, tests y build está en `devDependencies`.
2. **El job de despliegue no recupera el artefacto.** La etapa `build` publica `.output/public` como artefacto, pero
   `deploy` no tiene una tarea `fetch`. Hace `rsync` desde su propio directorio de trabajo, que solo contiene
   `.output/public` si el agente reutiliza el workspace de la etapa anterior.
3. **La verificación nunca falla.** `curl … | grep -q "200"` va seguido de `echo "Despliegue completado
exitosamente"`; sin `set -e`/`pipefail`, el código de salida es el del `echo` (0). Además, con el soft-404
   (SEO-004), la home siempre responde 200.
4. **Faltan puertas:** no hay `vue-tsc` (con `typeCheck: false` en `nuxt.config.ts`, el CI no comprueba tipos),
   `npm audit`, `format:check`, ni pruebas E2E, axe, Lighthouse o enlaces. Tampoco se comprueba que el build tenga
   proyectos (BUG-002).
5. No se purga la caché de Cloudflare tras desplegar.

**Evidencia.**

```text
$ NODE_ENV=production npm config get omit
dev
$ NODE_ENV=production npm ci --ignore-scripts      (package.json + package-lock.json del proyecto)
added 71 packages in 1s
sin eslint/nuxi/vitest en node_modules/.bin
```

**Impacto.** El pipeline no puede producir un despliegue válido, lo que probablemente explica que producción se
despliegue a mano y esté desfasada (INFRA-006). Si se arreglara solo `NODE_ENV`, se podría desplegar un sitio sin
proyectos (BUG-002) con la verificación en verde.

**Recomendación.**

```yaml
environment_variables:
    NUXT_TELEMETRY_DISABLED: 1 # sin NODE_ENV=production a nivel de pipeline
stages:
    - quality: # npm ci → lint → vue-tsc → test:run → npm audit --omit=dev --audit-level=high
    - build: # NODE_ENV=production npm run generate → comprobar nº de rutas de proyectos → publicar artefacto
    - e2e: # serve .output/public → Playwright smoke + axe + linkinator
    - deploy: # fetch artifact → rsync a releases/<id> → enlace simbólico atómico → purga de Cloudflare → smoke test que falle (set -euo pipefail)
```

**Verificación de la corrección.** Una ejecución completa del pipeline en verde; forzar un fallo (API inválida) y
comprobar que se detiene antes de `deploy`.

---

### INFRA-002 — Las configuraciones de servidor versionadas no reflejan producción

| Campo                   | Valor                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Severidad               | Alta                                                                                 |
| Prioridad               | P1                                                                                   |
| Confianza               | Verificado (comportamiento observado frente a archivos)                              |
| Esfuerzo                | S                                                                                    |
| Ámbito                  | Producción + código                                                                  |
| Ubicación               | `apache.conf`, `apache_dev.conf`, `nginx.conf`, `nginx_dev.conf`, `public/.htaccess` |
| Dispositivo / navegador | —                                                                                    |
| Referencias             | —                                                                                    |
| Relacionado con         | SEC-001, SEC-002, SEC-006, SEO-002, SEO-004, PERF-001                                |

**Descripción.** Lo que se observa en producción frente a lo versionado:

| Aspecto                                  | Versionado                                            | Producción (observado)                                    |
| ---------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
| Servidor de origen                       | `apache.conf` y `nginx.conf` (ambos)                  | Apache/2.4.68 (Debian), según la firma de `mod_autoindex` |
| Cabeceras de seguridad                   | Definidas en `apache.conf:70-75` y `nginx.conf:22-28` | **Ninguna** (SEC-001)                                     |
| HSTS                                     | `max-age=63072000`                                    | `max-age=0` (Cloudflare, SEC-002)                         |
| 404                                      | `ErrorDocument 404 /404.html` (`apache.conf:49`)      | 200 con la home (`.htaccess` reescribe, SEO-004)          |
| Caché de `/_nuxt/` y `/_fonts/`          | `immutable` 1 año (`apache.conf:78-80`)               | **Sin `Cache-Control`** (PERF-001)                        |
| `mod_expires` (`public/.htaccess:15-33`) | 1 mes para todo                                       | Sin `Expires` (módulo inactivo)                           |
| Listado de directorios                   | `IndexIgnore */*` (oculta entradas)                   | «Index of /_nuxt» visible (SEC-006)                       |
| `www.raupulus.dev`                       | `ServerAlias` y redirección en `nginx.conf:3`         | No existe en DNS (INFRA-004)                              |

**Impacto.** Quien lea el repositorio cree que el sitio tiene cabeceras de seguridad, 404 reales y caché correcta.
Ninguna corrección aplicada en estos archivos llega a producción si no se sabe cuál es la configuración real.

**Recomendación.** Inventariar en el servidor la configuración activa (`apachectl -S`, `apachectl -M`) y la de
Cloudflare (Transform Rules, Cache Rules, HSTS). Versionar solo esa, en un repositorio privado de infraestructura
(SEC-008), y eliminar la de nginx si no se usa.

---

### INFRA-003 — `scripts/deploy.sh` despliega en caliente

| Campo                   | Valor                           |
| ----------------------- | ------------------------------- |
| Severidad               | Media                           |
| Prioridad               | P2                              |
| Confianza               | Verificado (revisión de código) |
| Esfuerzo                | S                               |
| Ámbito                  | Código                          |
| Ubicación               | `scripts/deploy.sh:18-44`       |
| Dispositivo / navegador | —                               |
| Referencias             | —                               |
| Relacionado con         | INFRA-001, PERF-001             |

**Descripción.** `rsync -avz --delete` sobre el docroot activo: durante la copia hay HTML nuevo que referencia chunks
`/_nuxt/*.js` aún no copiados, y chunks antiguos ya borrados que un HTML en caché sigue pidiendo («Failed to fetch
dynamically imported module»). La verificación solo pide `https://raupulus.dev`, que siempre da 200 (SEO-004). El
build se ejecuta en el propio servidor de producción.

**Recomendación.** Releases versionadas (`releases/<timestamp>`) y cambio atómico del enlace simbólico `current`;
conservar los chunks de la release anterior durante un tiempo; smoke test sobre varias rutas (`/projects/<slug>`,
`/sitemap.xml`, un 404) y purga de Cloudflare. Compilar en el CI, no en producción.

---

### INFRA-004 — `www.raupulus.dev` no resuelve en DNS

| Campo                   | Valor                                   |
| ----------------------- | --------------------------------------- |
| Severidad               | Media                                   |
| Prioridad               | P2                                      |
| Confianza               | Verificado                              |
| Esfuerzo                | XS                                      |
| Ámbito                  | Producción (DNS)                        |
| Ubicación               | Zona DNS de `raupulus.dev` (Cloudflare) |
| Dispositivo / navegador | Todos                                   |
| Referencias             | —                                       |
| Relacionado con         | INFRA-002                               |

**Descripción.** `curl https://www.raupulus.dev/` → `Could not resolve host`; `dig www.raupulus.dev` sin respuesta.
El certificado (`*.raupulus.dev`) y las configuraciones prevén el alias.

**Impacto.** Quien escriba `www.` (algo habitual, también en tarjetas o CV impresos) obtiene un error de DNS.

**Recomendación.** Registro `CNAME www → raupulus.dev` (con proxy) y una Redirect Rule 301 de `www` a la raíz.

---

### INFRA-005 — Sin monitorización de disponibilidad ni de errores de usuario

| Campo                   | Valor                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                              |
| Prioridad               | P1                                                                                                 |
| Confianza               | Verificado (no hay configuración en el repo; los errores de BUG-001 llevan semanas sin detectarse) |
| Esfuerzo                | S                                                                                                  |
| Ámbito                  | Producción                                                                                         |
| Ubicación               | —                                                                                                  |
| Dispositivo / navegador | —                                                                                                  |
| Referencias             | OWASP A09:2021                                                                                     |
| Relacionado con         | BUG-001, SEC-001                                                                                   |

**Descripción.** No hay comprobaciones sintéticas (por ejemplo, «la página de proyectos contiene al menos una
tarjeta»), ni captura de errores JS de usuarios, ni recepción de informes CSP. Producción tiene el beacon de
Cloudflare Web Analytics (`static.cloudflareinsights.com`), pero solo mide visitas. Sin consentimiento previo y sin
mencionarse en la política de privacidad (LEGAL-004).

**Recomendación.** Monitor de disponibilidad con aserción de contenido (Uptime Kuma, autoalojable, o Better Stack)
sobre `/projects/` y un proyecto; captura de errores JS (Sentry o GlitchTip autoalojado); `report-to` de la CSP; y
alertas de Search Console.

---

### INFRA-006 — Producción desfasada, sin trazabilidad de versión y con la migración sin commitear

| Campo                   | Valor                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                   |
| Prioridad               | P0                                                                                     |
| Confianza               | Verificado                                                                             |
| Esfuerzo                | S                                                                                      |
| Ámbito                  | Ambos                                                                                  |
| Ubicación               | Ramas `main` (`4ab8b4b`, 2025-07-13) y `dev` (`05acdf1` + 50 entradas en `git status`) |
| Dispositivo / navegador | —                                                                                      |
| Referencias             | —                                                                                      |
| Relacionado con         | BUG-001, INFRA-001                                                                     |

**Descripción.**

- Producción sirve un build con `last-modified: 2026-09-11` que usa la interfaz antigua y la API
  `api.fryntiz.dev/api/v1`. `main` no recibe commits desde 2025-07-13. No hay tags, ni versión o `buildId` visible,
  así que no se puede saber qué commit está desplegado.
- La rama `dev` va 3 commits por delante de `main` y tiene **toda la migración** (API v2, nuevos tipos y tests,
  componentes) **sin commitear**: 43 archivos modificados, 2 eliminados y 5 nuevos al empezar la auditoría (sin contar
  `docs/auditorias/`), a los que se sumaron 12 archivos de documentación modificados durante la misma.
- La API retiró `v1` (410) antes de desplegar el frontend que usa `v2`, y la plataforma `portfolio` de `v2` no tiene
  contenidos (API-02).

**Impacto.** Riesgo de perder semanas de trabajo (un fallo de disco o un `git checkout` desafortunado), imposibilidad
de revertir a una versión conocida y descoordinación entre API y frontend que ya ha roto producción.

**Recomendación.** Commitear la migración en commits temáticos y abrir una MR `dev → main`; etiquetar cada despliegue
(`v1.2.0`) y exponer la versión en `<meta name="generator">` o en el footer; plan de retirada de APIs con un periodo
de convivencia v1+v2.

---

## Verificado y correcto

- ✅ Cloudflare delante del origen: HTTP/3 (`alt-svc: h3`), brotli para HTML y gzip para JS, IPv6 y certificado
  comodín válido.
- ✅ HTTP→HTTPS con un único 301.
- ✅ DNSSEC activo.
- ✅ `scripts/deploy.sh` hace copia de seguridad previa y tiene lógica de restauración (mejorable, INFRA-003).
- ✅ La etapa de despliegue de GoCD requiere aprobación manual de un rol `admin`.
- ✅ `.gitignore` excluye `.env`, `.output`, `node_modules`, `/template` y `/docs/planning`.

## No verificado

- ⚠️ Configuración real de Apache en el servidor y de Cloudflare: sin acceso (se infiere del comportamiento).
- ⚠️ Comportamiento real del agente de GoCD con el workspace entre etapas.
- ⚠️ Copias de seguridad del servidor y de la API.
