# 6.11 Infraestructura, CI/CD y operación (INFRA) — Auditoría externa deepsek-externo

Resumen: existe una contradicción directa entre las configuraciones versionadas y lo que sirve producción.
`apache.conf` define cabeceras de seguridad y `ErrorDocument 404`, pero `public/.htaccess` (con
`AllowOverride All`) fuerza el fallback SPA a `index.html`, que es lo que se observa en producción. El
pipeline de GoCD no obtiene el artefacto `.output/public` en la etapa de deploy, su verificación no aborta el
job y usa npm con un repo pnpm. `scripts/deploy.sh` hace `rsync --delete` no atómico.

| ID        | Título                                                                     | Sev.  | Prior. | Esf. |
| --------- | -------------------------------------------------------------------------- | ----- | ------ | ---- |
| INFRA-001 | Contradicción `.htaccess` (SPA) vs `apache.conf` (`ErrorDocument 404`)     | Alta  | P1     | S    |
| INFRA-002 | `gocd.yaml`: deploy sin artefacto, verificación sin `set -e`, sin purga CF | Alta  | P1     | M    |
| INFRA-003 | `deploy.sh`: `rsync --delete` no atómico y verificación insuficiente       | Alta  | P1     | M    |
| INFRA-004 | CI con npm en repo pnpm                                                    | Alta  | P1     | S    |
| INFRA-005 | Configs nginx/apache obsoletas y CSP incompleta                            | Media | P2     | M    |
| INFRA-006 | Sin observabilidad, alertas ni purga de caché                              | Baja  | P3     | M    |
| INFRA-007 | `docs/info/deploy-cicd.md` desactualizado                                  | Media | P2     | S    |

---

### INFRA-001 — Contradicción `.htaccess` vs `apache.conf`

| Campo       | Valor                                        |
| ----------- | -------------------------------------------- |
| Severidad   | Alta                                         |
| Prioridad   | P1                                           |
| Confianza   | Verificado                                   |
| Esfuerzo    | S                                            |
| Ámbito      | Ambos                                        |
| Ubicación   | `public/.htaccess:5-13`, `apache.conf:39-49` |
| Relacionado | SEC-001, SEC-002, BUG-004                    |

**Descripción.** `apache.conf` (vhost 443) comenta explícitamente que debe devolverse el 404 real con
`ErrorDocument 404 /404.html`, pero el `<Directory>` tiene `AllowOverride All` y `public/.htaccess` aplica
`RewriteRule . /index.html [L]`, que prevalece y convierte todo en un 200 con la portada (soft-404). Además
las cabeceras de `apache.conf` no llegan a producción. Es la causa raíz de SEC-001/SEC-002.

**Recomendación.** Eliminar el fallback SPA de `.htaccess` (todas las rutas válidas son ficheros) y apoyarse
en `ErrorDocument 404 /404.html`. Confirmar qué servidor sirve realmente producción (Apache/nginx/Cloudflare)
y dejar una única fuente de verdad para cabeceras y errores.

**Verificación de la corrección.** `curl -I https://raupulus.dev/no-existe` → `404`; cabeceras de seguridad presentes.

---

### INFRA-002 — `gocd.yaml`: deploy sin artefacto y verificación no bloqueante

| Campo       | Valor                   |
| ----------- | ----------------------- |
| Severidad   | Alta                    |
| Prioridad   | P1                      |
| Confianza   | Verificado              |
| Esfuerzo    | M                       |
| Ámbito      | Código                  |
| Ubicación   | `gocd.yaml:44-58,60-78` |
| Relacionado | BUG-006, INFRA-004      |

**Descripción.** La etapa `build` publica el artefacto `dist` (origen `.output/public`), pero el job de
`deploy` **no lo descarga** (no hay `<fetchartifact>`) y hace `rsync -avz --delete .output/public/ ...` sobre
su propio workspace, donde el directorio puede no existir o estar obsoleto. La verificación
`curl … | grep -q "200"` no está protegida con `set -e`/`pipefail`, así que aunque falle, el job continúa
exitoso. Tampoco purga la caché de Cloudflare ni ejecuta `vue-tsc`, `pnpm audit`, `format:check`, Lighthouse
CI, comprobación de enlaces o axe. La rama es `main` mientras el trabajo está en `dev`.

**Recomendación.** Añadir `fetchartifact` del `dist`, `set -euo pipefail`, verificación robusta (código 200
**y** contenido), purga de Cloudflare, y las puertas que faltan. Documentar la rama de despliegue.

**Verificación de la corrección.** Una verificación que devuelva ≠ 200 debe hacer fallar el job; el deploy usa
el artefacto de la etapa build.

---

### INFRA-003 — `deploy.sh` no atómico

| Campo       | Valor                     |
| ----------- | ------------------------- |
| Severidad   | Alta                      |
| Prioridad   | P1                        |
| Confianza   | Verificado                |
| Esfuerzo    | M                         |
| Ámbito      | Código                    |
| Ubicación   | `scripts/deploy.sh:19-43` |
| Relacionado | PERF-004, INFRA-002       |

**Descripción.** `rsync -avz --delete .output/public/ "$DEPLOY_DIR/.output/public/"` sustituye el docroot en
caliente: durante el proceso coexisten HTML nuevo con chunks antiguos (o viceversa). La verificación solo
consulta la home y da por bueno cualquier `200` (que, con soft-404, siempre ocurre). El rollback solo se
dispara si el HTTP no es 200.

**Recomendación.** Despliegue atómico: publicar en un directorio nuevo (`release-<ts>`) y cambiar un enlace
simbólico; verificar varias rutas + integridad, y purgar caché. Conservar el backup como ahora.

**Verificación de la corrección.** Durante un despliegue, no hay ventana con 404 de chunks; rollback probado.

---

### INFRA-004 — CI con npm en repo pnpm

| Campo       | Valor                                                        |
| ----------- | ------------------------------------------------------------ |
| Severidad   | Alta                                                         |
| Prioridad   | P1                                                           |
| Confianza   | Verificado                                                   |
| Esfuerzo    | S                                                            |
| Ámbito      | Código                                                       |
| Ubicación   | `gocd.yaml:29,41,57`, `scripts/deploy.sh:20`, `AGENTS.md:19` |
| Relacionado | DEP-001                                                      |

**Descripción.** CI y deploy usan `npm ci`, pero el repo versiona `pnpm-lock.yaml`/`pnpm-workspace.yaml` y
`.npmrc`. `npm ci` con `package-lock.json` presente puede divergir de lo que se instala localmente con pnpm.

**Recomendación.** Unificar en pnpm: `pnpm install --frozen-lockfile` y `pnpm run …`, con
`packageManager` fijado; o migrar todo a npm eliminando los ficheros de pnpm.

**Verificación de la corrección.** El CI instala con el mismo gestor y lockfile que el desarrollo.

---

### INFRA-005 — Configs obsoletas y CSP incompleta

| Campo       | Valor                                   |
| ----------- | --------------------------------------- |
| Severidad   | Media                                   |
| Prioridad   | P2                                      |
| Confianza   | Verificado                              |
| Esfuerzo    | M                                       |
| Ámbito      | Código                                  |
| Ubicación   | `nginx.conf:12-32`, `apache.conf:57-74` |
| Relacionado | SEC-001                                 |

**Descripción.** `nginx.conf`/`apache.conf` apuntan a certificados Let's Encrypt, pero producción usa TLS de
Cloudflare (emisor Google Trust Services). `nginx.conf` mantiene el fallback SPA y `X-XSS-Protection`
(obsoleto). Las CSP incluyen `'unsafe-eval'` y `img-src https:` (muy amplio), y `nginx.conf` no define
`frame-ancestors`, `form-action`, `base-uri` ni `object-src`.

**Recomendación.** Declarar qué configuración es la real; unificar cabeceras y CSP; quitar `unsafe-eval` si
no es necesario y acotar `img-src` a los dominios de la API/autorizadas.

**Verificación de la corrección.** Una sola config vigente, coherente con producción; CSP sin violaciones.

---

### INFRA-006 — Sin observabilidad ni purga de caché

| Campo     | Valor      |
| --------- | ---------- |
| Severidad | Baja       |
| Prioridad | P3         |
| Confianza | Verificado |
| Esfuerzo  | M          |
| Ámbito    | Código     |

**Descripción.** No hay monitorización de disponibilidad, alertas, captura de errores JS de usuarios ni
informes CSP. El despliegue no purga la caché de Cloudflare.

**Recomendación.** Añadir uptime/alertas, `Sentry` o similar (respetando privacidad), `report-to` en CSP y
purga de caché en el pipeline.

**Verificación de la corrección.** Alertas configuradas; purga tras cada despliegue.

---

### INFRA-007 — `docs/info/deploy-cicd.md` desactualizado

| Campo       | Valor                         |
| ----------- | ----------------------------- |
| Severidad   | Media                         |
| Prioridad   | P2                            |
| Confianza   | Verificado                    |
| Esfuerzo    | S                             |
| Ámbito      | Código                        |
| Ubicación   | `docs/info/deploy-cicd.md:98` |
| Relacionado | CODE-001, INFRA-004           |

**Descripción.** La documentación de despliegue menciona `API_BASE_URL=http://localhost:8000/api/v1` (v1) y
no refleja el estado real (pnpm, cabeceras, Cloudflare, rama de despliegue).

**Recomendación.** Reescribir el documento tras decidir gestor, servidor y estrategia de despliegue.

**Verificación de la corrección.** El documento coincide con `gocd.yaml`, `deploy.sh` y el `.env` reales.

---

## Verificado y correcto

- `apache.conf` incluye (en el vhost 443) CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y `ErrorDocument 404` correctos como intención.
- `apache.conf` define `Cache-Control: immutable` para `/_nuxt/` y `/_fonts/`.
- `scripts/deploy.sh` hace backup antes de desplegar y mantiene los 5 últimos.
- TLS de producción válido, HTTP/2 y HTTP/3 activos; DNS con A y AAAA (IPv6).
- `robots.txt` y sitemap correctos a nivel de formato.
