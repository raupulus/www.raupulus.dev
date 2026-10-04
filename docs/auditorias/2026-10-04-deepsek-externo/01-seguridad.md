# 6.1 Seguridad (SEC) — Auditoría externa deepsek-externo

Resumen: la superficie de seguridad del frontend estático es reducida, pero producción no aplica
las cabeceras de seguridad que sí están definidas en `apache.conf`. El problema transversal más grave
es el fallback SPA de `public/.htaccess`, que convierte cualquier ruta inexistente (incluidas `/.env`,
`/.git/HEAD` y `/.well-known/security.txt`) en un `200` con la portada. La configuración de DOMPurify y
los bloques `Raw`/`Embed` permiten `style`, `id` e `iframe` de cualquier origen. No se encontraron
secretos versionados ni publicados en el bundle.

| ID      | Título                                                                  | Sev.  | Prior. | Esf. |
| ------- | ----------------------------------------------------------------------- | ----- | ------ | ---- |
| SEC-001 | Producción sin CSP ni cabeceras de seguridad; HSTS max-age=0            | Alta  | P1     | M    |
| SEC-002 | Soft-404 universal: toda ruta devuelve `index.html` con 200             | Alta  | P1     | S    |
| SEC-003 | DOMPurify permite `style`, `id` y `target` (CSS injection / clobbering) | Media | P2     | M    |
| SEC-004 | `sanitizeRawHtml`/`BlockEmbed`: iframes de cualquier origen sin sandbox | Media | P2     | S    |
| SEC-005 | No existe `security.txt` real (el 200 es el fallback)                   | Media | P2     | XS   |
| SEC-006 | Repositorio público expone infraestructura y correo personal en git     | Media | P2     | S    |
| SEC-007 | Sin CAA y DMARC en `p=none`                                             | Media | P3     | S    |

---

### SEC-001 — Producción no aplica CSP ni cabeceras de seguridad; HSTS max-age=0

| Campo                   | Valor                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                |
| Prioridad               | P1                                                                                  |
| Confianza               | Verificado                                                                          |
| Esfuerzo                | M                                                                                   |
| Ámbito                  | Producción                                                                          |
| Ubicación               | https://raupulus.dev/ , `apache.conf:70-80`, `nginx.conf:22-28`, `public/.htaccess` |
| Dispositivo / navegador | Todos                                                                               |
| Referencias             | OWASP Secure Headers, MDN CSP, RFC 6797 (HSTS)                                      |
| Relacionado con         | INFRA-001                                                                           |

**Descripción.** En producción, `curl -sSI https://raupulus.dev/` **no devuelve** `Content-Security-Policy`,
`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` ni `Permissions-Policy`. HSTS llega como
`max-age=0`, es decir, desactivado. Sin embargo, `apache.conf` define todas esas cabeceras y
`nginx.conf` también, con lo que la configuración versionada no es la que sirve producción
(probablemente Cloudflare delante de un origen que no las añade, o el `.htaccess` con `AllowOverride All`).

**Evidencia.**

```
$ curl -sSI https://raupulus.dev/ | grep -iE "content-security|x-content|x-frame|referrer|permissions|strict-transport"
strict-transport-security: max-age=0; includeSubDomains; preload
(no aparecen CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
```

**Pasos para reproducir.** 1. `curl -sSI https://raupulus.dev/`. 2. Observar la ausencia de cabeceras. 3. Comparar con `apache.conf:70-80`.

**Impacto.** Sin CSP, cualquier XSS reflejado/inyectado tendría impacto pleno; sin `X-Content-Type-Options`
hay riesgo de MIME sniffing; sin `frame-ancestors`/`X-Frame-Options` el sitio es embebible (clickjacking);
HSTS inefectivo permite downgrade a HTTP.

**Recomendación.** Aplicar las cabeceras en el borde real (Cloudflare Transform Rules o el origen que
sirva, sin que Cloudflare las elimine). Empezar por `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`Permissions-Policy`, `frame-ancestors 'none'` y `HSTS: max-age=63072000; includeSubDomains; preload`.
La CSP de `apache.conf` sirve de base, pero endurecerla (ver SEC-003 y nota de `unsafe-eval`).
Alternativa sin `unsafe-inline`: CSP con hashes generados en build (Nuxt `useHead` / nitro).

**Verificación de la corrección.** `curl -sSI https://raupulus.dev/ >/dev/null` configurando grep de las
5 cabeceras; todas deben aparecer, y HSTS con `max-age>=31536000`. En la consola del navegador, 0
violaciones CSP en todas las rutas y estados.

---

### SEC-002 — Soft-404 universal: toda ruta devuelve `index.html` con 200

| Campo                   | Valor                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                            |
| Prioridad               | P1                                                                              |
| Confianza               | Verificado                                                                      |
| Esfuerzo                | S                                                                               |
| Ámbito                  | Ambos                                                                           |
| Ubicación               | `public/.htaccess:5-13`, `nginx.conf:31-33`, https://raupulus.dev/no-existe-xyz |
| Dispositivo / navegador | Todos                                                                           |
| Referencias             | Google Search Central (soft 404); CWE-754                                       |
| Relacionado con         | BUG-004, INFRA-001, SEO-001                                                     |

**Descripción.** `public/.htaccess` reescribe **cualquier** ruta a `/index.html` (`RewriteRule . /index.html [L]`)
y `nginx.conf` usa `try_files $uri $uri/ /index.html`. Resultado: `GET /no-existe`, `/projects/no-existe`,
`/.env`, `/.git/HEAD`, `/package.json`, `/cachedRoutes.json` y `/.well-known/security.txt` devuelven
**200 con la portada**, ocultando los 404 y enmascarando la existencia/inexistencia real de recursos.

**Evidencia.**

```
$ for p in ".git/HEAD" ".env" "package.json" "cachedRoutes.json" ".well-known/security.txt"; do
    echo -n "/$p -> "; curl -sS -o /dev/null -w "%{http_code}\n" "https://raupulus.dev/$p"; done
/.git/HEAD -> 200
/.env -> 200
/package.json -> 200
/cachedRoutes.json -> 200
/.well-known/security.txt -> 200
# El cuerpo de todos es el HTML de la portada (fallback), no el recurso pedido.
```

El build local generado (`404.html` real, servido con `serve`) sí devuelve 404: el fallo es de producción.

**Pasos para reproducir.** 1. `curl -sS https://raupulus.dev/no-existe-<ts> -o /dev/null -w "%{http_code}"`. 2. Repetir con `/.env`.

**Impacto.** Soft-404 masivo (SEO), imposibilidad de detectar recursos inexistentes, y falsos positivos en
comprobaciones de seguridad (un escáner de rutas vería 200 en todo). No expone secretos, pero engaña.

**Recomendación.** Eliminar el fallback SPA (no es una SPA con rutas servidor; todas las rutas válidas son
ficheros). En Apache: quitar `RewriteRule . /index.html [L]` y usar `ErrorDocument 404 /404.html`
(como ya hace `apache.conf:49`). En nginx: `try_files $uri $uri/ =404;` y `error_page 404 /404.html;`.
`try_files ... /404.html` NO basta: hay que devolver el código 404.

**Verificación de la corrección.** `curl -sS -o /dev/null -w "%{http_code}" https://raupulus.dev/no-existe`
debe devolver `404`, y `curl -sS https://raupulus.dev/no-existe | grep -c "Página no encontrada"` ≥ 1.

---

### SEC-003 — DOMPurify permite `style`, `id` y `target` sin restricciones adicionales

| Campo                   | Valor                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Severidad               | Media                                                        |
| Prioridad               | P2                                                           |
| Confianza               | Verificado (config + PoC)                                    |
| Esfuerzo                | M                                                            |
| Ámbito                  | Código                                                       |
| Ubicación               | `utils/sanitize.ts:18-21`, `components/content/blocks/*.vue` |
| Dispositivo / navegador | Todos                                                        |
| Referencias             | CWE-79, CWE-1021, OWASP XSS Cheat Sheet                      |
| Relacionado con         | SEC-004                                                      |

**Descripción.** `sanitizeHtml` incluye `style`, `id` y `target` en `ALLOWED_ATTR`. DOMPurify bloquea
`javascript:` y `on*` (PoC abajo), pero conserva CSS arbitrario e `id`, lo que permite inyección de estilos,
superposición de UI (redressing) y clobbering de `id`/ancestores DOM. Los enlaces con `target="_blank"`
no reciben `rel` forzado.

**Evidencia.** PoC local con la misma configuración (`node --input-type=module`, ver `evidencias/scripts.md`):

```
SAN: <a href="javascript:alert(1)">x</a>              => <a>x</a>                      (OK, eliminado)
SAN: <img src=x onerror=alert(1)>                     => <img src="x">                 (OK)
SAN: <div style="position:fixed;inset:0;z-index:99999">overlay</div>
     => <div style="position:fixed;inset:0;z-index:99999">overlay</div>   (CSS conservado)
SAN: <span id="__nuxt">clobber</span>                 => <span id="__nuxt">clobber</span>  (id conservado)
SAN: <a href="https://x" target="_blank">t</a>        => <a href="https://x" target="_blank">t</a> (sin rel)
```

**Pasos para reproducir.** Ejecutar el fragmento de `evidencias/scripts.md` con el `isomorphic-dompurify` del proyecto.

**Impacto.** Cadena de confianza: el HTML viene de la API (EditorJS) que en principio solo edita el autor.
Si la cuenta del panel se ve comprometida o el contenido se importa de terceros, un payload con `style`
podría tapar la interfaz (p. ej. un falso banner de cookies) o clobberar nodos. Riesgo real moderado.

**Recomendación.** Quitar `style` e `id` de `ALLOW_DATA_ATTR`/`ALLOWED_ATTR` salvo necesidad justificada;
si se necesita `style`, sanearlo con una allowlist de propiedades. Añadir en un hook `afterSanitizeAttributes`
de DOMPurify: forzar `rel="noopener noreferrer"` en todo `target="_blank"`, y validar `href`/`src` con
esquemas permitidos (`https`, `mailto`, rutas relativas). Considerar `CSS.escape`/prefijos en `id`.

**Verificación de la corrección.** Test unitario en `tests/utils/sanitize.test.ts` con los payloads de la PoC:
no debe aparecer `style`, ni `id`, y todo `target="_blank"` debe incluir `rel`.

---

### SEC-004 — `sanitizeRawHtml`/`BlockEmbed`: iframes de cualquier origen sin sandbox

| Campo                   | Valor                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                  |
| Prioridad               | P2                                                                                                                     |
| Confianza               | Verificado (config + PoC)                                                                                              |
| Esfuerzo                | S                                                                                                                      |
| Ámbito                  | Código                                                                                                                 |
| Ubicación               | `utils/sanitize.ts:33-37`, `components/content/blocks/BlockRaw.vue:2`, `components/content/blocks/BlockEmbed.vue:9-12` |
| Dispositivo / navegador | Todos                                                                                                                  |
| Referencias             | CWE-1021, OWASP HTML5 Security Cheat Sheet                                                                             |
| Relacionado con         | SEC-003, PERF-008                                                                                                      |

**Descripción.** `BlockEmbed` construye `<iframe :src="embed.data.embed">` sin lista blanca de dominios,
sin `sandbox`, sin `referrerpolicy` y sin `loading="lazy"`. `sanitizeRawHtml` además permite `iframe`
desde cualquier origen (solo conserva `allow`/`allowfullscreen`). Cualquier URL de embed pasa.

**Evidencia.** PoC con la config de `sanitizeRawHtml`:

```
RAW: <iframe src="https://evil.example"></iframe>                 => <iframe src="https://evil.example"></iframe>
RAW: <iframe src="https://evil.example" sandbox="allow-scripts">  => <iframe src="https://evil.example"></iframe>
```

**Pasos para reproducir.** `grep -n "iframe" utils/sanitize.ts components/content/blocks/BlockEmbed.vue`.

**Impacto.** Contenido incrustado de orígenes no controlados puede rastrear al visitante, cargar recursos
pesados o intentar abusar de permisos si un día se habilita `allow`. Con `loading` ausente, penaliza CWV.

**Recomendación.** Lista blanca de dominios permitidos (YouTube, Vimeo, etc.) validada antes de renderizar;
añadir `sandbox` (sin `allow-same-origin`), `referrerpolicy="no-referrer"` y `loading="lazy"`. Aplicar
también en `BlockRaw` reduciendo `ADD_TAGS`/`ADD_ATTR` y saneando `src` contra la allowlist.

**Verificación de la corrección.** Test con `src` no permitido: el iframe no debe renderizarse (o quedar sin `src`).

---

### SEC-005 — No existe `security.txt` real

| Campo           | Valor                                         |
| --------------- | --------------------------------------------- |
| Severidad       | Media                                         |
| Prioridad       | P2                                            |
| Confianza       | Verificado                                    |
| Esfuerzo        | XS                                            |
| Ámbito          | Producción                                    |
| Ubicación       | https://raupulus.dev/.well-known/security.txt |
| Referencias     | RFC 9116                                      |
| Relacionado con | SEC-002                                       |

**Descripción.** `/.well-known/security.txt` devuelve 200 pero es el fallback SPA (HTML), no un `security.txt`.
No hay canal de divulgación responsable ni caducidad de contacto.

**Evidencia.** `curl -sS https://raupulus.dev/.well-known/security.txt | head -c 120` → `<!DOCTYPE html>...`.

**Recomendación.** Publicar `public/.well-known/security.txt` con `Contact: mailto:public@raupulus.dev`,
`Expires` (≤ 1 año), `Preferred-Languages: es, en` y, si aplica, `Canonical`. Al arreglar SEC-002 se
servirá con su content-type correcto.

**Verificación de la corrección.** `curl -sS -I https://raupulus.dev/.well-known/security.txt` → `200` y
`content-type: text/plain`; cuerpo con `Contact:`.

---

### SEC-006 — Repositorio público expone infraestructura y correo personal en el historial

| Campo           | Valor                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| Severidad       | Media                                                                                |
| Prioridad       | P2                                                                                   |
| Confianza       | Verificado                                                                           |
| Esfuerzo        | S                                                                                    |
| Ámbito          | Ambos                                                                                |
| Ubicación       | GitHub `raupulus/www.raupulus.dev` (`private:false`), `apache.conf:7`, historial git |
| Referencias     | OWASP ASVS 1.8, CWE-200                                                              |
| Relacionado con | INFRA-002                                                                            |

**Descripción.** El repositorio en GitHub es **público** (`"visibility":"public"`). Eso expone rutas del
servidor (`/var/www/public/www.raupulus.dev/.output/public`), `ServerAdmin`, la topología de despliegue
(`gocd.yaml`, `scripts/deploy.sh`) y, en el historial de commits, una dirección de correo personal distinta
de `public@raupulus.dev` (`@gmail.com`), prohibida por `AGENTS.md`.

**Evidencia.**

```
$ curl -sS https://api.github.com/repos/raupulus/www.raupulus.dev | grep -E '"private"|"visibility"'
  "private": false,
  "visibility": "public",
$ git log --all --format='%ae%n%ce' | sort -u | sed -E 's/.*@/@/' | sort | uniq -c
   1 @fryntiz.dev
   1 @gmail.com        # dirección personal; no se transcribe su valor
```

**Impacto.** Enumeración de infraestructura y exposición de un correo personal. No se han encontrado
secretos (ni `.env`) versionados.

**Recomendación.** Decidir si el repo debe seguir público; si sí, mover `ServerAdmin` a un valor no personal,
revisar que no se versionen rutas internas innecesarias y reescribir/limpiar el correo personal del historial
(`git filter-repo`) o asumir la exposición. Rotar cualquier valor que pudiera haberse filtrado en el futuro.

**Verificación de la corrección.** `git log --all --format='%ae%n%ce' | sort -u` solo debe mostrar direcciones
del dominio del proyecto.

---

### SEC-007 — Sin CAA y DMARC en `p=none`

| Campo       | Valor                            |
| ----------- | -------------------------------- |
| Severidad   | Media                            |
| Prioridad   | P3                               |
| Confianza   | Verificado                       |
| Esfuerzo    | S                                |
| Ámbito      | Producción                       |
| Ubicación   | DNS de `raupulus.dev`            |
| Referencias | RFC 6844 (CAA), RFC 7489 (DMARC) |

**Descripción.** No hay registro CAA (cualquier CA puede emitir certificados para el dominio) y la política
DMARC es `p=none` (solo monitorización, no protege frente a suplantación del dominio que publica correo).

**Evidencia.**

```
$ dig +short CAA raupulus.dev      # (vacío)
$ dig +short TXT _dmarc.raupulus.dev
"v=DMARC1; p=none; rua=mailto:...@dmarc-reports.cloudflare.net"
$ dig +short TXT raupulus.dev | grep -i spf
"v=spf1 a mx include:mxroute.com ~all"
```

**Recomendación.** Añadir `CAA 0 issue "..."` para las CA usadas (p. ej. Cloudflare/Let's Encrypt/Google)
y `CAA 0 iodef "mailto:public@raupulus.dev"`. Endurecer DMARC a `p=quarantine` y luego `p=reject` tras
verificar SPF/DKIM. Publicar DKIM del proveedor de correo.

**Verificación de la corrección.** `dig +short CAA raupulus.dev` no vacío; `dig +short TXT _dmarc.raupulus.dev`
con `p=quarantine|reject`.

---

## Verificado y correcto

- No hay secretos en el árbol de trabajo (grep de `AKIA…`, `BEGIN … PRIVATE KEY`, `sk_live_`, `ghp_…`): 0 coincidencias.
- `.env` **nunca** estuvo versionado (`git log --all -- .env` vacío); solo `env.example`.
- El bundle estático no contiene `runtimeConfig.captcha.secretKey` ni claves privadas; no hay `.map` ni `sourceMappingURL` publicados.
- DOMPurify elimina `javascript:`, `on*` y otros vectores clásicos de XSS (PoC verificada).
- Todos los `target="_blank"` escritos en plantilla (Footer, about, blocks) llevan `rel="noopener noreferrer"`.
- `apiGet`/`$fetch` usan `Accept: application/json`; los slugs se codifican con `encodeURIComponent` en `projectsData.ts`/`fetchPageData.ts`.
- Cookies de sesión de la API marcadas `httponly` y `secure`; `XSRF-TOKEN` correctamente no-httponly.
- TLS: certificado válido (emisor Google Trust Services para Cloudflare), HTTP/2 y HTTP/3 (`alt-svc h3`).
- La respuesta de la API no filtra stack traces en los endpoints probados.
