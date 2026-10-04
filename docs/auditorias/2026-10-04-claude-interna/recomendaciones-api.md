# Recomendaciones para la API (`api.raupulus.dev`)

> La API Laravel queda fuera del alcance de la corrección de este repositorio, pero varios hallazgos del frontend
> dependen de ella. Todo lo de esta página se ha observado **de forma pasiva** (peticiones GET y OPTIONS públicas, de
> bajo volumen). No se ha enviado ningún POST ni ninguna cabecera manipulada a producción.

| ID     | Recomendación                                                                                        | Severidad | Hallazgos del frontend |
| ------ | ---------------------------------------------------------------------------------------------------- | --------- | ---------------------- |
| API-01 | Investigar y corregir las URLs con host `evil.example` (posible _host header injection_ + caché)     | Alta      | SEC-003                |
| API-02 | Migrar los proyectos a la plataforma `portfolio` de la v2 (hoy 0 contenidos) antes de retirar la v1  | Crítica   | BUG-001, BUG-002       |
| API-03 | Hacer legible la cookie `XSRF-TOKEN` desde `raupulus.dev` o usar un endpoint de contacto stateless   | Alta      | BUG-004                |
| API-04 | No crear sesión ni cookies en los GET públicos; no combinar `Set-Cookie` con `Cache-Control: public` | Media     | LEGAL-007              |
| API-05 | Requisitos de validación del formulario de contacto en el servidor                                   | Alta      | BUG-007, A11Y-005      |
| API-06 | Retirada ordenada de versiones y dominios (`api.fryntiz.dev`, `/api/v1`)                             | Media     | BUG-001, INFRA-006     |
| API-07 | Cabeceras de seguridad de la API (HSTS, `X-XSS-Protection`, firma de Apache)                         | Media     | SEC-002, SEC-006       |
| API-08 | No contar visitas en un GET que también usan el prerender y los bots                                 | Baja      | SEO-001                |
| API-09 | Normalizar las URLs de imágenes del contenido (host legacy `api.fryntiz.dev` y terceros)             | Baja      | SEC-003                |

---

### API-01 — URLs con host `evil.example`

`GET /api/v2/platforms/portfolio` devuelve `image.url`, `image.thumbnails.*` y `author.url_image_*` en
`https://evil.example/…`. Comprobar:

1. Si las URLs se generan con `url()`/`asset()`/`Storage::url()` a partir de la petición actual (`Request::getHost()`),
   y si `TrustProxies` acepta `X-Forwarded-Host` de cualquier origen (`$proxies = '*'`).
2. Si hay una caché de aplicación (Redis o archivo) o un _response cache_ que guardó una respuesta generada con un
   host manipulado.
3. Si hay URLs absolutas guardadas en base de datos.

Corrección: `APP_URL=https://api.raupulus.dev`, `URL::forceRootUrl()` y `URL::forceScheme('https')` en un service
provider, middleware `TrustHosts` con `^api\.raupulus\.dev$`, `TrustProxies` limitado a los rangos de Cloudflare, y
vaciado de cachés. Verificarlo en staging con `curl -H 'X-Forwarded-Host: evil.example'`.

### API-02 — La plataforma `portfolio` de la v2 no tiene contenidos

```text
GET /api/v2/platforms/portfolio/contents?type=project → {"data":[],"meta":{"total":0,…}}
GET /api/v2/platforms/portfolio                       → "contents":{"total":0,"types":[]}, "technologies":[]
GET /api/v1/platform/portfolio/info                   → 410 Gone
```

El backend local de desarrollo (`localhost:8000`) sí tiene 16 proyectos en la v2: falta migrar los datos a
producción o asociar los contenidos existentes a la plataforma `portfolio`. Hasta entonces, el frontend no puede
desplegarse sin perder todas las páginas de proyectos (BUG-002).

### API-03 — Cookie CSRF entre subdominios

`/sanctum/csrf-cookie` emite `XSRF-TOKEN` con `domain=api.raupulus.dev`, que JavaScript en `raupulus.dev` no puede
leer. Opciones:

- `SESSION_DOMAIN=.raupulus.dev` y `SANCTUM_STATEFUL_DOMAINS=raupulus.dev` (la cookie pasa a ser legible desde ambos
  subdominios).
- O bien, para un formulario público sin login, un endpoint **stateless** sin CSRF de sesión, protegido por captcha
  (verificado en el servidor), límite de peticiones por IP y validación estricta.

### API-04 — Sesiones y cookies en lecturas públicas

Todas las respuestas GET observadas (`/api/v2/platforms/portfolio`, `/api/v1/*` 410) incluyen
`set-cookie: XSRF-TOKEN` y `api_raupulus_session` (10 h, `samesite=lax`), y algunas además
`cache-control: max-age=60, public`. Mover los endpoints de lectura a un grupo sin `StartSession` ni
`EncryptCookies`, y no emitir `Set-Cookie` en respuestas cacheables (riesgo de que una caché compartida sirva la
sesión de un usuario a otro).

### API-05 — Validación del formulario de contacto en el servidor

Se ha comprobado el preflight `OPTIONS /api/v2/contact-messages` (permite `POST` con `content-type, x-xsrf-token`
desde `https://raupulus.dev`, `max-age=3600`). El servidor debe:

- Verificar el token de reCAPTCHA v3 (o Turnstile) con `secret`, comprobando `success`, `action === 'contact'`,
  `score` ≥ umbral y `hostname === 'raupulus.dev'`.
- Validar longitudes coherentes con el frontend corregido (nombre 2–100, email RFC hasta 254, asunto 3–150,
  mensaje 10–5000) y rechazar HTML.
- Limitar peticiones por IP (las cabeceras `x-ratelimit-limit: 1200` de los GET sugieren un límite global, que es
  demasiado alto para un POST de contacto).
- Devolver errores en el envelope `{ success:false, message, errors }` sin detalles internos.
- Registrar el consentimiento (`privacity`) con fecha y versión de la política (RGPD art. 7.1).

### API-06 — Retirada ordenada de versiones y dominios

`api.fryntiz.dev` responde 301 sin cabeceras CORS (el navegador bloquea la petición) y `/api/v1` responde 410. Para
futuras retiradas: periodo de convivencia, cabeceras `Deprecation`/`Sunset`, CORS también en las redirecciones y
coordinación con el despliegue del frontend.

### API-07 — Cabeceras de seguridad de la API

HSTS `max-age=0` (SEC-002). `X-XSS-Protection: 1; mode=block` es obsoleta y conviene eliminarla. `api.fryntiz.dev`
expone `Apache/2.4.68 (Debian)`. Las demás cabeceras (`nosniff`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`) son correctas.

### API-08 — Visitas contadas en GET

`GET /platforms/portfolio/contents/:slug` «suma una visita» (comentario en `composables/projectsData.ts:193-200`).
Cualquier bot o prefetch infla el contador. Para hacer SEO-001 hay que leer el detalle en el build sin contar visitas
(por ejemplo con `?track=0` autenticado, o con un `POST /contents/:slug/visits` explícito desde el cliente).

### API-09 — URLs de imágenes del contenido

En los datos del backend local, el contenido de los proyectos referencia imágenes en `api.fryntiz.dev` (dominio
legacy que redirige), `gitlab.com`, `repository-images.githubusercontent.com` y `media.printables.com`. Normalizar a
`api.raupulus.dev` (o a un CDN propio) para que la CSP `img-src` pueda ser restrictiva y para no depender de
redirecciones.

## Verificado y correcto en la API

- ✅ CORS restringido a `https://raupulus.dev` (y a `http://localhost:3020` en local) con credenciales, sin comodín.
- ✅ `Vary: Origin` y `Access-Control-Max-Age: 3600` en los preflights.
- ✅ La cookie de sesión lleva `HttpOnly`, `Secure` y `SameSite=Lax`.
- ✅ Hay cabeceras de límite de peticiones (`x-ratelimit-*`) y las respuestas JSON son pequeñas y rápidas (~0,2 s).
- ✅ `/cv/pdf` responde 200 `application/pdf`.
