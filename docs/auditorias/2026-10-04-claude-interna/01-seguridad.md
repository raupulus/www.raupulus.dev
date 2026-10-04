# 01 · Seguridad

> Auditoría interna `claude-interna` · 2026-10-04 · commit `05acdf1` (rama `dev`, con cambios sin commitear) ·
> producción `https://raupulus.dev` (build del 2026-09-11 servido por Apache detrás de Cloudflare).

## Resumen

Producción se sirve **sin ninguna cabecera de seguridad** (sin CSP, sin `X-Frame-Options`, sin
`X-Content-Type-Options`, sin `Referrer-Policy`) y con **HSTS desactivado explícitamente** (`max-age=0`). Mozilla
HTTP Observatory da una **C (50/100)** y SSL Labs una **A-**. Las configuraciones de servidor versionadas
(`apache.conf`, `nginx.conf`) declaran esas cabeceras, pero no son las que se aplican. En el código, el contenido
HTML que llega de la API se sanitiza con DOMPurify, pero la configuración permite `style` (superposiciones que
suplantan la interfaz), `iframe` de cualquier origen (BlockRaw) y `BlockEmbed` enlaza `src` sin validar. Además,
la API devuelve URLs de imágenes en el host `evil.example`, lo que apunta a un problema de _host header
injection_ o envenenamiento de caché en el backend. No se han encontrado secretos en el repositorio, en su
historial ni en el build.

| ID      | Título                                                                              | Severidad | Prioridad | Esfuerzo |
| ------- | ----------------------------------------------------------------------------------- | --------- | --------- | -------- |
| SEC-001 | Producción sin cabeceras de seguridad (CSP, XFO, XCTO, Referrer, Permissions)       | Alta      | P1        | S        |
| SEC-002 | HSTS desactivado (`max-age=0`) en el dominio y en la API                            | Alta      | P1        | XS       |
| SEC-003 | La API sirve URLs de imágenes en el host `evil.example`                             | Alta      | P0        | M        |
| SEC-004 | `BlockEmbed` y `sanitizeRawHtml` aceptan iframes de cualquier origen y esquema      | Media     | P1        | S        |
| SEC-005 | El sanitizador permite `style` e `id`: superposiciones de phishing y DOM clobbering | Media     | P2        | XS       |
| SEC-006 | Listado de directorios en `/_nuxt/` y versión de Apache expuesta                    | Media     | P2        | XS       |
| SEC-007 | Correo personal publicado como autor en 36 commits del repositorio público          | Media     | P2        | M        |
| SEC-008 | Configuración de infraestructura versionada en un repositorio público               | Baja      | P3        | S        |
| SEC-009 | Clave privada de reCAPTCHA en `runtimeConfig` de un sitio estático                  | Baja      | P3        | XS       |
| SEC-010 | Sin `security.txt`, sin registros CAA y DMARC en modo `p=none`                      | Baja      | P3        | XS       |

Las vulnerabilidades de dependencias están en [09-dependencias.md](09-dependencias.md) (DEP-002) y los fallos del
flujo CSRF del formulario en [03-bugs-robustez.md](03-bugs-robustez.md) (BUG-004).

---

### SEC-001 — Producción sin cabeceras de seguridad

| Campo                   | Valor                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                        |
| Prioridad               | P1                                                                                          |
| Confianza               | Verificado                                                                                  |
| Esfuerzo                | S                                                                                           |
| Ámbito                  | Producción                                                                                  |
| Ubicación               | https://raupulus.dev/ (todas las rutas y recursos); `apache.conf:70-75`, `nginx.conf:22-28` |
| Dispositivo / navegador | Todos                                                                                       |
| Referencias             | OWASP A05:2021 Security Misconfiguration, CWE-693, CWE-1021, MDN CSP                        |
| Relacionado con         | SEC-002, INFRA-002                                                                          |

**Descripción.** Ninguna respuesta de producción incluye `Content-Security-Policy`, `X-Frame-Options` o
`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy` ni `Permissions-Policy`. `apache.conf` las define
dentro del `VirtualHost :443`, pero no llegan al cliente: o ese archivo no es el que está activo en el servidor, o
`mod_headers` no está habilitado, o Cloudflare las elimina. Lo mismo ocurre con las cabeceras de caché de
`public/.htaccess` (ver PERF-001).

**Evidencia.** `evidencias/cabeceras/produccion-rutas.txt`:

```text
### https://raupulus.dev/
HTTP/2 200
content-type: text/html
server: cloudflare
cf-cache-status: DYNAMIC
last-modified: Fri, 11 Sep 2026 12:56:28 GMT
vary: Accept-Encoding
strict-transport-security: max-age=0; includeSubDomains; preload
content-encoding: br
```

Mozilla HTTP Observatory (`evidencias/cabeceras/mozilla-observatory.json`): `"grade":"C","score":50,"tests_failed":3`.

**Pasos para reproducir.** `curl -sSI https://raupulus.dev/` y `curl -sSI https://raupulus.dev/_nuxt/BagkXvMM.js`.

**Impacto.** Sin CSP, cualquier inyección de HTML/JS (ver SEC-004 y SEC-005) se ejecuta sin una segunda barrera. Sin
`frame-ancestors`, el sitio se puede enmarcar en otro dominio (clickjacking del formulario de contacto). Sin
`nosniff`, el navegador puede interpretar recursos con un tipo distinto del declarado.

**Recomendación.**

1. Comprobar en el servidor qué `VirtualHost` está activo (`apachectl -S`) y si `mod_headers` está cargado
   (`apachectl -M | grep headers`).
2. Aplicar las cabeceras en un único sitio, idealmente Cloudflare (Transform Rules → Modify Response Header) o
   Apache, y versionar exactamente esa configuración.
3. Partir de una CSP más estricta que la de `apache.conf`. Nuxt 4 SSG no necesita `'unsafe-eval'` en producción:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.recaptcha.net https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.raupulus.dev; font-src 'self'; connect-src 'self' https://api.raupulus.dev https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; frame-src https://www.recaptcha.net https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

4. Desplegar primero en modo `Content-Security-Policy-Report-Only` y revisar la consola en todas las rutas.
   Después, valorar sustituir `'unsafe-inline'` en `script-src` por hashes generados en build (módulo
   `nuxt-security` o un hook de Nitro).

**Verificación de la corrección.** `curl -sSI https://raupulus.dev/ | grep -iE 'content-security|x-frame|x-content|referrer|permissions'`
devuelve las cinco cabeceras; Mozilla Observatory ≥ A; la consola del navegador no muestra violaciones de CSP en
ninguna ruta, con y sin consentimiento.

---

### SEC-002 — HSTS desactivado (`max-age=0`)

| Campo                   | Valor                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Severidad               | Alta                                                         |
| Prioridad               | P1                                                           |
| Confianza               | Verificado                                                   |
| Esfuerzo                | XS                                                           |
| Ámbito                  | Producción (raupulus.dev y api.raupulus.dev)                 |
| Ubicación               | Cabecera `strict-transport-security` de todas las respuestas |
| Dispositivo / navegador | Todos                                                        |
| Referencias             | CWE-319, RFC 6797 §6.1.1, hstspreload.org                    |
| Relacionado con         | SEC-001                                                      |

**Descripción.** Ambos dominios responden `strict-transport-security: max-age=0; includeSubDomains; preload`. Un
`max-age=0` **ordena al navegador olvidar la política HSTS**, así que el sitio queda sin HSTS. La cabecera la
inyecta Cloudflare (aparece igual en la API y en la web), no Apache (`apache.conf:75` declara `max-age=63072000`).
SSL Labs lo confirma: `hsts: disabled 0` y nota A- (`evidencias/cabeceras/ssllabs.json`).

**Evidencia.**

```text
strict-transport-security: max-age=0; includeSubDomains; preload
```

**Impacto.** La primera visita, o la que llega por un enlace `http://`, puede interceptarse y degradarse a HTTP
(SSL stripping) en redes hostiles. La cookie de sesión de la API sí lleva `secure`, pero las páginas no están
protegidas.

**Recomendación.** En Cloudflare → SSL/TLS → Edge Certificates → HSTS: activar con `max-age` de 6 meses
(15552000), `includeSubDomains` solo si **todos** los subdominios sirven HTTPS (comprobar `curriculum`, `jaja`,
`aidyslexic`, `api` y el correo) y `preload` solo después de varias semanas estable. Eliminar la duplicidad en
`apache.conf`.

**Verificación de la corrección.** `curl -sSI https://raupulus.dev/ | grep -i strict-transport` muestra
`max-age=15552000` o superior; SSL Labs informa HSTS con max-age largo.

---

### SEC-003 — La API sirve URLs de imágenes en el host `evil.example`

| Campo                   | Valor                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                  |
| Prioridad               | P0                                                                                                    |
| Confianza               | Probable (el dato es verificado; la causa raíz requiere revisar el backend)                           |
| Esfuerzo                | M                                                                                                     |
| Ámbito                  | Producción (API)                                                                                      |
| Ubicación               | `GET https://api.raupulus.dev/api/v2/platforms/portfolio` → `data.image.*`, `data.author.url_image_*` |
| Dispositivo / navegador | Todos                                                                                                 |
| Referencias             | CWE-644 (Host header injection), OWASP A05:2021, PortSwigger «Web cache poisoning»                    |
| Relacionado con         | recomendaciones-api.md (API-01), SEC-001                                                              |

**Descripción.** La respuesta pública de la ficha de la plataforma, que el frontend usa en todas las páginas
(`composables/platformData.ts`), contiene URLs absolutas en un host ajeno:

```json
"image": { "url": "https://evil.example/file/get/platform/69/…png", "thumbnails": { "micro": "https://evil.example/file/thumbnail/get/platform/306/…webp", … } },
"author": { "url_image_micro": "https://evil.example/images/default/micro.jpg", … }
```

`evil.example` es un dominio reservado (RFC 2606) que se usa típicamente en pruebas de inyección de cabecera
`Host`/`X-Forwarded-Host`. Que aparezca en una respuesta servida a cualquier visitante indica que el backend genera
URLs absolutas a partir de una cabecera controlable por el cliente **y** que ese resultado ha quedado almacenado
(caché de aplicación, base de datos o caché de respuesta `cache-control: max-age=60, public`).

**Pasos para reproducir.** `curl -sS https://api.raupulus.dev/api/v2/platforms/portfolio | grep -o 'https://[a-z.]*/file' | sort -u`.
No se ha enviado ninguna cabecera `Host` manipulada a producción para no agravar un posible envenenamiento.

**Impacto.** Si un atacante puede fijar el host, puede sustituir cualquier imagen o enlace absoluto generado por la
API (y potencialmente enlaces de restablecimiento de contraseña o URLs firmadas del panel) por un dominio suyo:
phishing, seguimiento de visitantes, defacement. Hoy, en el frontend, el efecto visible son imágenes rotas.

**Recomendación (backend).** Fijar `APP_URL` y forzar la raíz de URLs (`URL::forceRootUrl(config('app.url'))`),
activar el middleware `TrustHosts` con la lista de hosts válidos, restringir `TrustProxies` a las IP de
Cloudflare, vaciar las cachés (`php artisan cache:clear`, `optimize:clear`) y revisar si hay URLs absolutas
guardadas en base de datos. **Frontend:** no renderizar imágenes de hosts no permitidos (validar el host en
`imageUrl()` de `utils/ContentUtils.ts`) y restringir `img-src` en la CSP (SEC-001).

**Verificación de la corrección.** La misma petición solo devuelve URLs en `https://api.raupulus.dev/…`. Una
petición con `X-Forwarded-Host: evil.example` en **staging** no altera las URLs generadas.

---

### SEC-004 — Iframes de cualquier origen y esquema en el contenido de proyectos

| Campo                   | Valor                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                  |
| Prioridad               | P1                                                                                                                     |
| Confianza               | Verificado (sanitizador, con PoC local) / Probable (ejecución de `javascript:` en `BlockEmbed`)                        |
| Esfuerzo                | S                                                                                                                      |
| Ámbito                  | Código                                                                                                                 |
| Ubicación               | `components/content/blocks/BlockEmbed.vue:9-12`, `utils/sanitize.ts:31-37`, `components/content/blocks/BlockRaw.vue:2` |
| Dispositivo / navegador | Todos                                                                                                                  |
| Referencias             | CWE-79, CWE-1021, OWASP A03:2021                                                                                       |
| Relacionado con         | SEC-005, SEC-001                                                                                                       |

**Descripción.** `BlockEmbed` enlaza `:src="embed.data.embed"` directamente al `<iframe>`, sin validar el esquema ni
el dominio y sin `sandbox`. Vue no sanea URLs, así que un valor `javascript:…` se ejecutaría en el contexto de
`raupulus.dev`. `sanitizeRawHtml` (BlockRaw) añade `iframe` a las etiquetas permitidas sin lista blanca de orígenes.
DOMPurify elimina `javascript:` y `srcdoc`, pero acepta cualquier `https://` con estilos de pantalla completa.

**Evidencia.** PoC local con la misma configuración (`evidencias/scripts.md` → `poc-sanitize.mjs`):

```text
# iframe arbitrario (raw)
  raw : <iframe src="https://evil.example/phish" style="position:fixed;inset:0;width:100vw;height:100vh;border:0"></iframe>
```

**Impacto.** El riesgo depende de que el contenido de la API sea de confianza. Como hay indicios de que la API
puede estar sirviendo datos manipulados (SEC-003), un contenido alterado podría superponer un formulario falso a
pantalla completa sobre el sitio o ejecutar JavaScript (vía `BlockEmbed`).

**Recomendación.** En `BlockEmbed`, aceptar solo `https:` y una lista blanca de hosts (`www.youtube-nocookie.com`,
`player.vimeo.com`, `www.youtube.com`, etc.), añadir `sandbox="allow-scripts allow-same-origin allow-presentation"`,
`loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"` y `title`. Ejemplo:

```ts
const ALLOWED_EMBED_HOSTS = new Set(['www.youtube-nocookie.com', 'www.youtube.com', 'player.vimeo.com']);
const safeSrc = computed(() => {
    try {
        const u = new URL(embed.data.embed);
        return u.protocol === 'https:' && ALLOWED_EMBED_HOSTS.has(u.host) ? u.toString() : undefined;
    } catch {
        return undefined;
    }
});
```

En `sanitizeRawHtml`, usar el hook `uponSanitizeElement` de DOMPurify para eliminar iframes cuyo `src` no esté en
la lista blanca. Añadir los mismos hosts a `frame-src` de la CSP.

**Verificación de la corrección.** Tests unitarios en `tests/components/content/blocks/` con `embed: 'javascript:alert(1)'`
y `https://evil.example/` que comprueben que el iframe no se renderiza.

---

### SEC-005 — El sanitizador permite `style` e `id`

| Campo                   | Valor                                               |
| ----------------------- | --------------------------------------------------- |
| Severidad               | Media                                               |
| Prioridad               | P2                                                  |
| Confianza               | Verificado (PoC local)                              |
| Esfuerzo                | XS                                                  |
| Ámbito                  | Código                                              |
| Ubicación               | `utils/sanitize.ts:17-20`                           |
| Dispositivo / navegador | Todos                                               |
| Referencias             | CWE-79, CWE-1021, OWASP «DOM Clobbering Prevention» |
| Relacionado con         | SEC-004                                             |

**Descripción.** `sanitizeHtml` incluye `style` e `id` en `ALLOWED_ATTR`, y `target` sin forzar `rel`. La PoC
muestra que se conservan:

```text
# style overlay (suplantación visual)
  html : <div style="position:fixed;inset:0;z-index:9999;background:#fff">Falso aviso: introduce tu contraseña</div>
# id clobbering
  html : <img id="__NUXT__" src="x"><a href="https://evil.example">x</a>
# target _blank sin rel
  html : <a href="https://evil.example" target="_blank">x</a>
```

**Impacto.** Con contenido de la API manipulado: superposiciones que suplantan la interfaz, colisiones de `id` con
variables globales y enlaces a nuevas pestañas sin `noopener` (los navegadores actuales lo aplican por defecto,
así que el impacto de esto último es bajo).

**Recomendación.** Quitar `style` e `id` de `ALLOWED_ATTR` (los estilos del contenido deben venir de clases
propias), o prefijar los `id` (`SANITIZE_NAMED_PROPS: true`). Forzar `rel="noopener noreferrer"` en enlaces con
`target` mediante el hook `afterSanitizeAttributes`.

**Verificación de la corrección.** Ampliar `tests/utils/sanitize.test.ts` con los payloads anteriores.

---

### SEC-006 — Listado de directorios en `/_nuxt/` y versión de Apache expuesta

| Campo                   | Valor                                                  |
| ----------------------- | ------------------------------------------------------ |
| Severidad               | Media                                                  |
| Prioridad               | P2                                                     |
| Confianza               | Verificado                                             |
| Esfuerzo                | XS                                                     |
| Ámbito                  | Producción                                             |
| Ubicación               | https://raupulus.dev/_nuxt/ ; https://api.fryntiz.dev/ |
| Dispositivo / navegador | Todos                                                  |
| Referencias             | CWE-548, CWE-200                                       |
| Relacionado con         | INFRA-002                                              |

**Descripción.** `GET /_nuxt/` devuelve una página «Index of /_nuxt» generada por `mod_autoindex` (las entradas se
ocultan con `IndexIgnore */*`, pero el listado está activo) con la firma `Apache/2.4.68 (Debian) Server at
raupulus.dev Port 443`. La redirección de `api.fryntiz.dev` expone la misma firma.

**Evidencia.** `evidencias/cabeceras/produccion-exposicion-404.txt` y:

```text
<title>Index of /_nuxt</title> … <address>Apache/2.4.68 (Debian) Server at raupulus.dev Port 443</address>
```

**Impacto.** Facilita el reconocimiento (versión exacta del servidor de origen). Bajo impacto directo.

**Recomendación.** `Options -Indexes` en el `<Directory>` del docroot, `ServerTokens Prod` y `ServerSignature Off`
en la configuración global de Apache.

**Verificación de la corrección.** `curl -sS https://raupulus.dev/_nuxt/` devuelve 403 o 404 sin firma del servidor.

---

### SEC-007 — Correo personal publicado como autor en 36 commits del repositorio público

| Campo                   | Valor                                                           |
| ----------------------- | --------------------------------------------------------------- |
| Severidad               | Media                                                           |
| Prioridad               | P2                                                              |
| Confianza               | Verificado                                                      |
| Esfuerzo                | M                                                               |
| Ámbito                  | Producción (repositorios públicos en GitLab y GitHub)           |
| Ubicación               | Metadatos de autor de 36 de los 187 commits (todas las ramas)   |
| Dispositivo / navegador | —                                                               |
| Referencias             | `AGENTS.md`, sección «Información de Contacto (Norma Estricta)» |
| Relacionado con         | SEC-008                                                         |

**Descripción.** La norma del proyecto prohíbe que la cuenta personal de Gmail sea visible públicamente. El
contenido de los archivos está limpio (0 apariciones en `HEAD`, en el árbol de trabajo y en los diffs del
historial), pero **36 commits tienen esa dirección como email de autor**, y ambos repositorios son públicos
(`https://gitlab.com/api/v4/projects/raupulus%2Fwww.raupulus.dev` y `https://api.github.com/repos/raupulus/www.raupulus.dev`
responden 200). El `user.email` configurado ahora en el repo es del dominio `raupulus.dev`, así que el problema
es solo histórico.

**Evidencia.**

```text
en cabeceras Author/Commit: 36
en contenido de diffs (+/-): 0
  36 <correo-personal-gmail>
 151 <usuario>@fryntiz.dev
```

**Impacto.** Incumplimiento de la norma interna de contacto; la dirección es recolectable por bots de spam.

**Recomendación.** Decisión del propietario: (a) aceptar el riesgo y documentarlo, o (b) reescribir el historial
con `git filter-repo --mailmap` y forzar el push en GitLab y GitHub. La opción (b) es destructiva: rompe los
clones existentes, invalida los hashes de commit referenciados y el pipeline, y no elimina copias ya indexadas.
Activar «Keep my email address private» en GitHub y la opción equivalente en GitLab para el futuro.

**Verificación de la corrección.** `git log --all --format='%ae' | sort -u` no contiene direcciones de Gmail.

---

### SEC-008 — Configuración de infraestructura versionada en un repositorio público

| Campo                   | Valor                                                                             |
| ----------------------- | --------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                              |
| Prioridad               | P3                                                                                |
| Confianza               | Verificado                                                                        |
| Esfuerzo                | S                                                                                 |
| Ámbito                  | Código                                                                            |
| Ubicación               | `apache.conf:7`, `apache_dev.conf:15`, `gocd.yaml:70-76`, `scripts/deploy.sh:5-6` |
| Dispositivo / navegador | —                                                                                 |
| Referencias             | CWE-200; `AGENTS.md` (norma de contacto)                                          |
| Relacionado con         | SEC-007, INFRA-001                                                                |

**Descripción.** El repositorio público publica rutas absolutas del servidor (`/var/www/public/www.raupulus.dev`,
`/var/www/backups/…`), la topología de despliegue y un `ServerAdmin` con una dirección de correo personal de otro
dominio (`apache.conf:7` y `apache_dev.conf:15`), distinta de la única dirección pública permitida.

**Impacto.** Reconocimiento facilitado e incumplimiento de la norma de contacto. Bajo, porque no hay credenciales.

**Recomendación.** Usar `public@raupulus.dev` en `ServerAdmin` o eliminar la directiva; mover las configuraciones
reales a un repositorio privado de infraestructura y dejar aquí solo ejemplos (`*.example`).

**Verificación de la corrección.** `grep -rn "ServerAdmin" .` solo muestra la dirección pública o nada.

---

### SEC-009 — Clave privada de reCAPTCHA en `runtimeConfig` de un sitio estático

| Campo                   | Valor                                   |
| ----------------------- | --------------------------------------- |
| Severidad               | Baja                                    |
| Prioridad               | P3                                      |
| Confianza               | Verificado                              |
| Esfuerzo                | XS                                      |
| Ámbito                  | Código                                  |
| Ubicación               | `nuxt.config.ts:29-30`, `env.example:2` |
| Dispositivo / navegador | —                                       |
| Referencias             | CWE-1188                                |
| Relacionado con         | —                                       |

**Descripción.** `runtimeConfig.captcha.secretKey` se carga desde `CAPTCHA_SITE_PRIVATE_KEY`. Con el preset
`static` no hay servidor que la use: la verificación la hace la API. Se ha comprobado que **el valor no aparece en
el build** (`grep` del valor real del `.env` sobre `.output/public` → 0 coincidencias), pero obliga a tener la
clave en cada máquina que compila y es una puerta abierta a fugas si alguien la mueve a `public` por error.

**Recomendación.** Eliminar `captcha.secretKey` de `nuxt.config.ts`, de `env.example` y de `env.example.production`,
y guardar la clave solo en el backend.

**Verificación de la corrección.** `grep -rn CAPTCHA_SITE_PRIVATE_KEY .` sin resultados fuera de la documentación del backend.

---

### SEC-010 — Sin `security.txt`, sin CAA y DMARC en monitorización

| Campo                   | Valor                                                                   |
| ----------------------- | ----------------------------------------------------------------------- |
| Severidad               | Baja                                                                    |
| Prioridad               | P3                                                                      |
| Confianza               | Verificado                                                              |
| Esfuerzo                | XS                                                                      |
| Ámbito                  | Producción (DNS)                                                        |
| Ubicación               | DNS de `raupulus.dev`; `/.well-known/security.txt`                      |
| Dispositivo / navegador | —                                                                       |
| Referencias             | RFC 9116, RFC 8659 (CAA), RFC 7489 (DMARC)                              |
| Relacionado con         | SEO-004 (el soft-404 devuelve la home para `/.well-known/security.txt`) |

**Descripción.** `dig CAA raupulus.dev` no devuelve registros. DMARC está en `p=none` (solo informes) y SPF en
`~all` (softfail). DKIM sí está publicado (selector `x`) y DNSSEC está activo. `/.well-known/security.txt` devuelve
la home con 200 (soft-404).

**Impacto.** Cualquier CA puede emitir certificados para el dominio, y un tercero puede enviar correos suplantando
`public@raupulus.dev` sin que se rechacen.

**Recomendación.** Publicar `CAA 0 issue "pki.goog"` y `"letsencrypt.org"` (las CA que usa Cloudflare),
`iodef` opcional. Subir DMARC a `p=quarantine` tras revisar los informes y luego a `p=reject`; SPF a `-all`. Añadir
`public/.well-known/security.txt` con `Contact: mailto:public@raupulus.dev` y `Expires`.

**Verificación de la corrección.** `dig +short CAA raupulus.dev`, `dig +short TXT _dmarc.raupulus.dev` y
`curl -sS https://raupulus.dev/.well-known/security.txt`.

---

## Mapeo OWASP Top 10 (2021) y ASVS 5.0 nivel 1 (frontend estático)

| Categoría                              | Estado                       | Notas                                                                                      |
| -------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| A01 Broken Access Control              | ➖ No aplica                 | Sitio estático sin áreas privadas.                                                         |
| A02 Cryptographic Failures             | ❌ SEC-002                   | HSTS desactivado. TLS 1.2/1.3 correctos.                                                   |
| A03 Injection (XSS)                    | ❌ SEC-004, SEC-005          | DOMPurify bloquea scripts y manejadores; quedan iframes, `style` y `BlockEmbed`.           |
| A04 Insecure Design                    | ❌ BUG-004                   | Flujo CSRF entre subdominios que no puede funcionar.                                       |
| A05 Security Misconfiguration          | ❌ SEC-001, SEC-003, SEC-006 | Cabeceras ausentes, listado de directorios, host de la API.                                |
| A06 Vulnerable and Outdated Components | ❌ DEP-002                   | 35 avisos de `npm audit`; 4 en dependencias de ejecución.                                  |
| A07 Identification and Authentication  | ➖ No aplica                 | Sin autenticación en el frontend.                                                          |
| A08 Software and Data Integrity        | ⚠️ Parcial                   | Sin SRI (los scripts de terceros de Google no lo admiten); pipeline sin gates (INFRA-001). |
| A09 Security Logging and Monitoring    | ❌ INFRA-005                 | Sin monitorización de errores ni informes de CSP.                                          |
| A10 SSRF                               | ➖ No aplica                 | El frontend no hace peticiones de servidor con entrada del usuario (solo en build).        |

## Verificado y correcto

- ✅ **Sin secretos en el repositorio ni en el historial.** Búsqueda de patrones (`key|secret|token|password|PRIVATE KEY`)
  en `git log -p --all` (187 commits): ninguna coincidencia con valores reales. `.env` nunca se ha versionado (solo
  `.env.example`). `gitleaks` y `trufflehog` no estaban instalados; se usó la alternativa con `git log` + `grep`.
- ✅ **El build no contiene secretos.** Ni la clave privada del captcha, ni URLs `localhost`, ni source maps (`*.map` → 0).
- ✅ **El sanitizador bloquea `<script>`, manejadores `on*`, `javascript:` en `href` y `srcdoc`** (PoC local).
- ✅ **Todos los `target="_blank"` estáticos llevan `rel="noopener noreferrer"`** (la única excepción, `NuxtLink` a
  `/privacy` en `pages/contact.vue:628`, es interna).
- ✅ **La construcción de URLs de la API con slugs usa `encodeURIComponent`** (`composables/projectsData.ts`,
  `composables/fetchPageData.ts`): no hay path traversal desde la ruta catch-all.
- ✅ **El proxy de desarrollo `/_proxy/**` no existe en producción** (preset `static`, sin servidor Nitro).
- ✅ **TLS correcto.** Solo TLS 1.2 y 1.3; certificado de Google Trust Services válido hasta el 2026-11-08 con SAN
  `raupulus.dev, *.raupulus.dev`; HTTP→HTTPS con un único 301.
- ✅ **CORS de la API restringido** a `https://raupulus.dev` con credenciales, sin comodín (`evidencias/cabeceras/api-cors-csrf.txt`).
- ✅ **DNSSEC activo y DKIM publicado.**
- ✅ **`/.htaccess` devuelve 403.**

## No verificado

- ⚠️ Ejecución real de `javascript:` en `BlockEmbed` en un navegador: se deduce del código (Vue no sanea URLs). No se
  ha probado para no inyectar contenido en la API.
- ⚠️ Causa raíz de SEC-003: requiere acceso al backend.
- ⚠️ Escáneres de secretos dedicados (`gitleaks`, `trufflehog`): no estaban instalados.
