# 01 — Seguridad (`SEC`)

> **Resumen del área:** La auditoría de seguridad ha identificado vulnerabilidades críticas en la política de sanitización de contenido dinámico (DOMPurify con iframe arbitrario sin sandbox ni lista blanca de dominios e inyección CSS permitida), ausencia total de cabeceras de seguridad HTTP esenciales en producción (sin Content-Security-Policy ni X-Content-Type-Options), desactivación explícita de HSTS con `max-age=0`, filtración de dirección de correo personal en configuraciones de Apache y exposición innecesaria de la clave secreta de reCAPTCHA en la configuración de un frontend puramente estático.

---

## Tabla de Hallazgos

| ID          | Título                                                                                                                                          | Severidad | Prioridad | Esfuerzo | Ámbito |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------- | --------- | -------- | ------ |
| **SEC-001** | Inyección XSS y contenido embebido no restringido en `sanitizeRawHtml` e inyección CSS en `sanitizeHtml`                                        | Crítica   | P0        | S        | Ambos  |
| **SEC-002** | Ausencia total de cabeceras de seguridad HTTP esenciales (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`) en producción | Alta      | P1        | M        | Ambos  |
| **SEC-003** | Política HSTS deshabilitada en producción mediante cabecera con `max-age=0`                                                                     | Alta      | P1        | XS       | Ambos  |
| **SEC-004** | Exposición de clave privada de reCAPTCHA en `runtimeConfig` y `.env` en frontend estático                                                       | Media     | P2        | S        | Código |
| **SEC-005** | Exposición de dirección de correo electrónico personal en configuraciones versionadas de servidor web                                           | Media     | P2        | S        | Código |
| **SEC-006** | Ausencia de validación de esquemas de protocolo (`javascript:`, `data:`) en enlaces y previsualizaciones                                        | Media     | P2        | S        | Código |
| **SEC-007** | Ausencia de registros CAA en DNS y política DMARC permisiva (`p=none`)                                                                          | Baja      | P3        | XS       | Ambos  |
| **SEC-008** | Ausencia de archivo de contacto de seguridad estándar `/.well-known/security.txt` (RFC 9116)                                                    | Baja      | P3        | XS       | Ambos  |

---

## Hallazgos Detallados

### SEC-001 — Inyección XSS y contenido embebido no restringido en `sanitizeRawHtml` e inyección CSS en `sanitizeHtml`

| Campo                   | Valor                                                                        |
| ----------------------- | ---------------------------------------------------------------------------- |
| Severidad               | Crítica                                                                      |
| Prioridad               | P0                                                                           |
| Confianza               | Verificado                                                                   |
| Esfuerzo                | S                                                                            |
| Ámbito                  | Ambos                                                                        |
| Ubicación               | `utils/sanitize.ts:19-21, 34-37`, `components/content/blocks/BlockRaw.vue:2` |
| Dispositivo / navegador | Todos los navegadores                                                        |
| Referencias             | CWE-79 (Cross-Site Scripting), CWE-1021, OWASP Top 10 A03:2021-Injection     |
| Relacionado con         | SEC-006, DEP-003                                                             |

**Descripción.** La función `sanitizeRawHtml` utilizada por el componente `BlockRaw.vue` añade `iframe`, `video`, `audio` y `source` a la lista de etiquetas permitidas de DOMPurify, pero **no impone ninguna restricción sobre el origen (dominio) del iframe ni aplica el atributo `sandbox`**. Cualquier contenido que provenga de la API o que sea introducido a través de un bloque `raw` puede incrustar un iframe apuntando a cualquier dominio arbitrario (phishing, malware o suplantación de identidad). Asimismo, la función general `sanitizeHtml` permite el atributo `style` sin sanitizar propiedades CSS críticas, permitiendo ataques de inyección CSS (superposición de elementos a pantalla completa con `position: fixed`, suplantación visual de interfaces o exfiltración de tokens mediante selectores CSS).

**Evidencia.**
Ejecución de prueba de concepto (PoC) sobre la configuración real de DOMPurify:

```text
Raw iframe output: <iframe src="https://evil.example/phishing" width="500" height="300"></iframe>
Style injection output: <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:red;z-index:999999;">Defaced</div>
```

**Pasos para reproducir.**

1. Enviar desde la API un bloque de tipo `raw` con el payload: `<iframe src="https://evil.example/login"></iframe>`.
2. Visitar el proyecto que renderiza dicho bloque.
3. Comprobar que el iframe se renderiza en el DOM sin restricción de dominio y sin atributo `sandbox`.

**Impacto.** Exposición de los usuarios a páginas de suplantación de identidad (phishing), descarga de contenido malicioso y desfiguración visual completa del sitio web mediante inyección CSS.

**Recomendación.**

1. En `sanitizeRawHtml`, implementar un hook `uponSanitizeElement` de DOMPurify que valide el atributo `src` de los `iframe` contra una lista blanca estricta de dominios de confianza (ej. `youtube.com`, `vimeo.com`, `codepen.io`).
2. Exigir automáticamente en todo iframe los atributos `sandbox="allow-scripts allow-same-origin"` (o restrictivo), `loading="lazy"` y `referrerpolicy="strict-origin-when-cross-origin"`.
3. En `sanitizeHtml`, eliminar `style` de `ALLOWED_ATTR` o utilizar un analizador de estilos CSS seguro que prohíba `position: fixed`, `position: absolute`, `z-index` y URLs externas en `background-image`.

**Verificación de la corrección.**
Añadir tests unitarios en `tests/utils/sanitize.test.ts` que comprueben que iframes con dominios no autorizados son eliminados o neutralizados, y que reglas CSS que alteran el posicionamiento son bloqueadas.

---

### SEC-002 — Ausencia total de cabeceras de seguridad HTTP esenciales en producción

| Campo                   | Valor                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| Severidad               | Alta                                                                   |
| Prioridad               | P1                                                                     |
| Confianza               | Verificado                                                             |
| Esfuerzo                | M                                                                      |
| Ámbito                  | Ambos                                                                  |
| Ubicación               | Producción (`https://raupulus.dev`), `apache.conf`, `public/.htaccess` |
| Dispositivo / navegador | Todos los navegadores                                                  |
| Referencias             | CWE-1021, CWE-693, OWASP Top 10 A05:2021-Security Misconfiguration     |
| Relacionado con         | INFRA-001, SEC-003                                                     |

**Descripción.** La inspección activa de las cabeceras HTTP devueltas por `https://raupulus.dev` evidencia que el servidor en producción no envía ninguna de las cabeceras defensivas fundamentales:

- Falta `Content-Security-Policy` (CSP).
- Falta `X-Content-Type-Options: nosniff`.
- Falta `X-Frame-Options` o `frame-ancestors`.
- Falta `Referrer-Policy`.
- Falta `Permissions-Policy`.

Aunque en el repositorio existen archivos de configuración como `apache.conf` y `nginx.conf` que definen estas cabeceras, en la infraestructura de producción real (Cloudflare / servidor de origen) no están siendo emitidas.

**Evidencia.**
Salida real de `curl -sSI https://raupulus.dev`:

```http
HTTP/2 200
date: Sun, 04 Oct 2026 16:47:34 GMT
content-type: text/html
server: cloudflare
last-modified: Fri, 11 Sep 2026 12:56:28 GMT
vary: Accept-Encoding
strict-transport-security: max-age=0; includeSubDomains; preload
cf-cache-status: DYNAMIC
```

**Pasos para reproducir.**

1. Ejecutar `curl -sSI https://raupulus.dev`.
2. Verificar la ausencia de `content-security-policy`, `x-content-type-options` y `x-frame-options`.

**Impacto.** El sitio carece de defensa en profundidad contra ataques XSS, clickjacking (enmarcado en iframes de terceros), sniffing de tipos MIME y fugas de referrer hacia dominios de terceros.

**Recomendación.**
Configurar las cabeceras en el archivo `public/.htaccess` para que se apliquen en el servidor de origen Apache, o configurar reglas de transformación de cabeceras de respuesta (Transform Rules) directamente en Cloudflare.

**Verificación de la corrección.**
`curl -sSI https://raupulus.dev | grep -iE 'content-security-policy|x-content-type-options|x-frame-options'` debe devolver las cabeceras correspondientes con código 200.

---

### SEC-003 — Política HSTS deshabilitada en producción mediante cabecera con `max-age=0`

| Campo                   | Valor                                                    |
| ----------------------- | -------------------------------------------------------- |
| Severidad               | Alta                                                     |
| Prioridad               | P1                                                       |
| Confianza               | Verificado                                               |
| Esfuerzo                | XS                                                       |
| Ámbito                  | Ambos                                                    |
| Ubicación               | Producción (`https://raupulus.dev`), Cloudflare SSL/TLS  |
| Dispositivo / navegador | Todos los navegadores                                    |
| Referencias             | RFC 6797, CWE-319, OWASP A02:2021-Cryptographic Failures |
| Relacionado con         | SEC-002, INFRA-001                                       |

**Descripción.** El servidor de producción responde con la cabecera `strict-transport-security: max-age=0; includeSubDomains; preload`. Un valor de `max-age=0` ordena explícitamente al navegador que elimine el dominio de su lista interna de sitios HSTS, anulando por completo la protección de transporte seguro e impidiendo la precarga en listas de HSTS de los navegadores.

**Evidencia.**
Cabecera obtenida de producción:

```http
strict-transport-security: max-age=0; includeSubDomains; preload
```

**Pasos para reproducir.**

1. Ejecutar `curl -sSI https://raupulus.dev | grep -i strict-transport-security`.
2. Observar `max-age=0`.

**Impacto.** Los usuarios pueden ser vulnerables a ataques de degradación SSL (SSL stripping) y ataques de intermediario (MitM) en redes no seguras si intentan acceder mediante HTTP.

**Recomendación.**
En el panel de control de Cloudflare (SSL/TLS > Edge Certificates > HTTP Strict Transport Security), activar HSTS con una duración mínima de un año (`max-age=31536000`), incluyendo subdominios y preload, en consonancia con lo definido en `apache.conf` (`max-age=63072000`).

**Verificación de la corrección.**
Comprobar con `curl -sSI https://raupulus.dev` que el valor de `max-age` sea al menos `31536000`.

---

### SEC-004 — Exposición de clave privada de reCAPTCHA en `runtimeConfig` y `.env` en frontend estático

| Campo                   | Valor                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Severidad               | Media                                                        |
| Prioridad               | P2                                                           |
| Confianza               | Verificado                                                   |
| Esfuerzo                | S                                                            |
| Ámbito                  | Código                                                       |
| Ubicación               | `nuxt.config.ts:30`, `.env:2`, `docs/info/nuxt-config.md:24` |
| Dispositivo / navegador | Servidor / Entorno de desarrollo                             |
| Referencias             | CWE-200, OWASP A05:2021-Security Misconfiguration            |
| Relacionado con         | INFRA-002                                                    |

**Descripción.** `nuxt.config.ts` declara en `runtimeConfig.captcha.secretKey` el valor de la variable de entorno `CAPTCHA_SITE_PRIVATE_KEY`. Al ser un proyecto estático (SSG) sin servidor Nitro en producción, el frontend nunca realiza la verificación del token de reCAPTCHA en el servidor (la verificación debe ser realizada exclusivamente por el backend Laravel). Mantener una clave secreta en la configuración del frontend es una superficie de riesgo innecesaria.

**Evidencia.**
`nuxt.config.ts:28-31`:

```typescript
    runtimeConfig: {
        captcha: {
            secretKey: process.env.CAPTCHA_SITE_PRIVATE_KEY,
        },
```

Búsqueda de uso: la clave nunca se utiliza en ningún punto del código fuente.

**Pasos para reproducir.**

1. Revisar `nuxt.config.ts` línea 30.
2. Comprobar que ningún archivo en `server/`, `composables/` ni `components/` hace uso de `secretKey`.

**Impacto.** Riesgo de filtración accidental de credenciales privadas en bundles o registros de build.

**Recomendación.**
Eliminar `CAPTCHA_SITE_PRIVATE_KEY` de `.env`, `env.example`, `env.example.production` y `nuxt.config.ts`. La verificación del token corresponde al backend en `api.raupulus.dev`.

**Verificación de la corrección.**
`git grep -n "CAPTCHA_SITE_PRIVATE_KEY"` no debe arrojar ninguna coincidencia tras la limpieza.

---

### SEC-005 — Exposición de dirección de correo electrónico personal en configuraciones versionadas de servidor web

| Campo                   | Valor                                 |
| ----------------------- | ------------------------------------- |
| Severidad               | Media                                 |
| Prioridad               | P2                                    |
| Confianza               | Verificado                            |
| Esfuerzo                | S                                     |
| Ámbito                  | Código                                |
| Ubicación               | `apache.conf:7`, `apache_dev.conf:15` |
| Dispositivo / navegador | Repositorio público                   |
| Referencias             | CWE-200, Regla de Privacidad Global   |
| Relacionado con         | LEGAL-004                             |

**Descripción.** Las configuraciones de Apache versionadas contienen una dirección de correo electrónico personal no autorizada en la directiva `ServerAdmin` en lugar de la única dirección pública permitida (`public@raupulus.dev`). Al estar alojado el repositorio en plataformas públicas (GitLab / mirror de GitHub), este dato personal queda expuesto a recopiladores de spam e indexadores.

**Evidencia.**

```text
apache.conf:7:    ServerAdmin [correo_personal_omitido]
apache_dev.conf:15:    ServerAdmin [correo_personal_omitido]
```

**Pasos para reproducir.**

1. Inspeccionar `apache.conf` en la línea 7 y `apache_dev.conf` en la línea 15.

**Impacto.** Vulneración de la directriz de privacidad del proyecto y exposición de datos personales a scrapers.

**Recomendación.**
Modificar la directiva `ServerAdmin` en ambos archivos para utilizar exclusivamente `public@raupulus.dev`.

**Verificación de la corrección.**
`git grep -En "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"` solo debe listar `public@raupulus.dev` y `tu@email.com` (placeholder).

---

### SEC-006 — Ausencia de validación de esquemas de protocolo en enlaces y previsualizaciones

| Campo                   | Valor                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                          |
| Prioridad               | P2                                                                                             |
| Confianza               | Verificado                                                                                     |
| Esfuerzo                | S                                                                                              |
| Ámbito                  | Código                                                                                         |
| Ubicación               | `components/content/blocks/BlockEmbed.vue:12`, `components/content/blocks/BlockLinkTool.vue:4` |
| Dispositivo / navegador | Todos los navegadores                                                                          |
| Referencias             | CWE-79, CWE-601                                                                                |
| Relacionado con         | SEC-001                                                                                        |

**Descripción.** En `BlockLinkTool.vue`, el atributo `:href="linkTool.data.link"` se enlaza directamente sin verificar que comience por `http://` o `https://`. Si un enlace contiene `javascript:`, hacer clic en la tarjeta ejecutará script en el contexto del origen. En `BlockLinkTool.vue:4`, además, el enlace tiene `target="_blank"` pero su atributo `rel="nofollow noindex noreferrer"` carece de `noopener`.

**Evidencia.**
`BlockLinkTool.vue:4`:

```html
<a class="r-web-preview-link" target="_blank" rel="nofollow noindex noreferrer" :href="linkTool.data.link"></a>
```

**Pasos para reproducir.**

1. Enviar desde la API un bloque linkTool con `link: "javascript:alert(document.domain)"`.
2. Hacer clic en la tarjeta de previsualización.

**Impacto.** Ejecución de código malicioso mediante esquemas no autorizados y potencial reverse tabnabbing por falta de `noopener`.

**Recomendación.**
Validar que `link` comience estrictamente por `https://` o `http://` antes de renderizar el atributo `href`. Añadir `noopener` al atributo `rel`.

**Verificación de la corrección.**
Test unitario verificando que URLs con esquemas no HTTP son rechazadas o deshabilitadas.

---

### SEC-007 — Ausencia de registros CAA en DNS y política DMARC permisiva

| Campo                   | Valor                      |
| ----------------------- | -------------------------- |
| Severidad               | Baja                       |
| Prioridad               | P3                         |
| Confianza               | Verificado                 |
| Esfuerzo                | XS                         |
| Ámbito                  | Ambos                      |
| Ubicación               | DNS de `raupulus.dev`      |
| Dispositivo / navegador | DNS / Servidores de correo |
| Referencias             | RFC 8659, RFC 7489         |
| Relacionado con         | INFRA-005                  |

**Descripción.** La consulta DNS sobre el dominio revela:

1. Ausencia total de registros CAA (`Certification Authority Authorization`). Cualquier autoridad certificadora pública podría emitir certificados para el dominio si es vulnerada.
2. El registro DMARC está configurado con política `p=none` (`v=DMARC1; p=none; rua=mailto:...`), lo que significa que el servidor no exige rechazar ni poner en cuarentena correos falsificados que suplanten al dominio.

**Evidencia.**

```text
dig +short CAA raupulus.dev -> (vacío)
dig +short TXT _dmarc.raupulus.dev -> "v=DMARC1;  p=none; rua=mailto:fae3bb72c3094edaa5f80c5ba554a1d8@dmarc-reports.cloudflare.net"
```

**Pasos para reproducir.**

1. Ejecutar `dig +short CAA raupulus.dev`.
2. Ejecutar `dig +short TXT _dmarc.raupulus.dev`.

**Impacto.** Riesgo residual de emisión fraudulenta de certificados TLS y posibilidad de suplantación de identidad en correos enviados en nombre del dominio.

**Recomendación.**

1. Publicar registros CAA que restrinjan la emisión a las autoridades autorizadas (ej. Google Trust Services y Let's Encrypt).
2. Evolucionar la política DMARC de `p=none` a `p=quarantine` y posteriormente a `p=reject`.

**Verificación de la corrección.**
`dig +short CAA raupulus.dev` devuelve las CA permitidas.

---

### SEC-008 — Ausencia de archivo de contacto de seguridad estándar `/.well-known/security.txt`

| Campo                   | Valor                             |
| ----------------------- | --------------------------------- |
| Severidad               | Baja                              |
| Prioridad               | P3                                |
| Confianza               | Verificado                        |
| Esfuerzo                | XS                                |
| Ámbito                  | Ambos                             |
| Ubicación               | `public/.well-known/security.txt` |
| Dispositivo / navegador | N/A                               |
| Referencias             | RFC 9116                          |
| Relacionado con         | INFRA-001                         |

**Descripción.** El sitio web carece de un archivo `security.txt` conforme al estándar RFC 9116 accesible en `https://raupulus.dev/.well-known/security.txt`. Este archivo permite a investigadores de seguridad contactar de manera responsable ante el hallazgo de vulnerabilidades.

**Evidencia.**
Petición HTTP a `https://raupulus.dev/.well-known/security.txt` devuelve soft-404 / 200 con la página de inicio, sin contenido plano de seguridad.

**Pasos para reproducir.**

1. Comprobar que no existe el archivo en `public/.well-known/security.txt`.

**Impacto.** Dificultad para la divulgación coordinada de vulnerabilidades por parte de la comunidad.

**Recomendación.**
Crear `public/.well-known/security.txt` con los campos `Contact: mailto:public@raupulus.dev`, `Expires`, `Preferred-Languages: es, en` y `Canonical: https://raupulus.dev/.well-known/security.txt`.

**Verificación de la corrección.**
`curl -sS https://raupulus.dev/.well-known/security.txt` devuelve el archivo plano válido según RFC 9116.

---

## Verificado y Correcto

- ✅ **Historial de git libre de secretos:** La inspección exhaustiva de todo el historial de git (`git log -p --all`) no contiene claves privadas SSH, tokens de API ni certificados SSL.
- ✅ **Sin filtración de `.env` en control de versiones:** Ningún archivo `.env` o `.env.production` ha sido nunca versionado en git (únicamente los ejemplos `.env.example`).
- ✅ **Build estático libre de source maps publicados:** La carpeta `.output/public` no contiene archivos `*.map` expuestos al público.
- ✅ **Sanitización de párrafos y textos simples:** `BlockParagraph.vue` y `BlockAlert.vue` aplican correctamente `sanitizeHtml` antes de renderizar texto enriquecido con formato básico.
