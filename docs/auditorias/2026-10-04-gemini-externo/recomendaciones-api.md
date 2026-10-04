# Recomendaciones y Requisitos para el Backend (API Laravel)

Este documento recoge los problemas, anomalías y requisitos identificados durante la auditoría externa del frontend (**www.raupulus.dev**) cuya causa raíz o solución reside en el backend externo (**api.raupulus.dev**). Dado que el código del backend queda fuera del repositorio del frontend, estas especificaciones se documentan de forma independiente para su traslado al equipo de API / infraestructura backend.

---

## 1. Anomalías Críticas Observadas en la API de Producción

### API-001 — Catálogo de proyectos vacío en producción (`/api/v2/platforms/portfolio/contents`)

- **Endpoint:** `GET https://api.raupulus.dev/api/v2/platforms/portfolio/contents`
- **Comportamiento observado:** La respuesta devuelve `{"data": [], "meta": {"total": 0}}`.
- **Impacto en Frontend:** Si Nuxt genera el sitio estático contra la API pública de producción, el catálogo de proyectos se compila con 0 elementos, generando un sitemap sin proyectos y un catálogo desértico.
- **Recomendación Backend:** Verificar en la base de datos de producción el estado de publicación de los proyectos (ej. columna `is_active`, `published_at`, `status = 'published'`) o los filtros de plataforma asociados al token o llamada pública.

### API-002 — Presencia de URLs de prueba y vectores maliciosos en la respuesta de producción (`evil.example`)

- **Endpoint:** `GET https://api.raupulus.dev/api/v2/platforms/portfolio`
- **Comportamiento observado:** Los campos de imágenes y assets de la plataforma devuelven URLs apuntando al dominio de prueba RFC 2606 `https://evil.example/image.png`.
- **Impacto en Frontend:** Intentos de carga fallidos, advertencias en consolas de desarrolladores y activación de filtros de seguridad en navegadores.
- **Recomendación Backend:** Higienizar la base de datos productiva para sustituir semillas (seeders) de prueba por URLs legítimas del CDN de producción (ej. `https://api.raupulus.dev/storage/...`).

### API-003 — Configuración de dominio en cookies de sesión y CSRF (Sanctum)

- **Endpoint:** `GET https://api.raupulus.dev/auth/csrf-cookie`
- **Comportamiento observado:** La cabecera `Set-Cookie` emite `XSRF-TOKEN` fijada al host `api.raupulus.dev` sin comodín de dominio ni dominio raíz (`domain=.raupulus.dev`).
- **Impacto en Frontend:** El navegador de los clientes ejecuta la aplicación bajo el dominio `raupulus.dev`. Por la política de cookies del estándar RFC 6265, un script JavaScript que corre en `raupulus.dev` **no puede leer** una cookie asignada exclusivamente al subdominio `api.raupulus.dev`. En consecuencia, `document.cookie` no tiene acceso a `XSRF-TOKEN`, el formulario envía una cabecera vacía y el backend devuelve `419 CSRF Token Mismatch`.
- **Recomendación Backend:**
  En la configuración de Laravel (`config/session.php` y `config/sanctum.php`):
    1. Configurar `SESSION_DOMAIN=.raupulus.dev` (con punto prefijo) para permitir compartir cookies de primer nivel entre `raupulus.dev` y `api.raupulus.dev`.
    2. En `config/sanctum.php`, añadir `raupulus.dev` y `www.raupulus.dev` en el arreglo `stateful`:
        ```php
        'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
            '%s%s%s',
            'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
            env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : '',
            ',raupulus.dev,www.raupulus.dev'
        ))),
        ```
    3. Asegurar `SameSite=Lax` y `Secure=true`.

---

## 2. Requisitos de Seguridad en el Endpoint de Contacto (`/contact`)

El formulario de contacto delega la validación final y el envío de correos al backend. Para garantizar una protección eficaz contra abusos, spam y ataques automatizados, el backend debe implementar las siguientes medidas:

### 2.1 Verificación Estricta del Token reCAPTCHA v3

El backend debe verificar el token suministrado por el frontend invocando la API de Google:

- **URL de verificación:** `POST https://www.google.com/recaptcha/api/siteverify`
- **Comprobaciones obligatorias:**
    1. `success === true`.
    2. `action === 'contact'` (verificar que el token fue generado para la acción de contacto y no reutilizado de otra pantalla).
    3. `score >= 0.5` (o el umbral de confianza definido para descartar tráfico bot automatizado).
    4. `hostname === 'raupulus.dev'` (evitar que tokens emitidos en dominios de atacantes sean aceptados).
    5. Descartar la petición con código HTTP 422 si la validación de reCAPTCHA falla.

### 2.2 Limitación de Tasa (Rate Limiting)

Evitar bombardeo de correos electrónicos y consumo indebido del servicio SMTP mediante middleware de limitación en la ruta de contacto:

```php
Route::post('/contact', [ContactController::class, 'send'])
    ->middleware(['throttle:5,1']); // Máximo 5 peticiones por minuto por IP
```

Adicionalmente, se recomienda limitar a un máximo de 3 envíos exitosos por hora por dirección de correo remitente.

### 2.3 CORS con Credenciales

Dado que el frontend envía cabeceras de credenciales (`credentials: 'include'`), la configuración CORS de Laravel (`config/cors.php`) debe evitar comodines:

```php
'paths' => ['api/*', 'auth/csrf-cookie'],
'allowed_methods' => ['GET', 'POST', 'OPTIONS'],
'allowed_origins' => [
    'https://raupulus.dev',
    'https://www.raupulus.dev',
    'http://localhost:3020'
],
'supports_credentials' => true,
```

---

## 3. Resumen de Acciones para el Equipo de Backend

| Prioridad | Tarea                                                                   | Impacto                                                          |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **P0**    | Configurar `SESSION_DOMAIN=.raupulus.dev` y `SANCTUM_STATEFUL_DOMAINS`  | Corrige fallo 419 CSRF y permite recibir mensajes de contacto    |
| **P0**    | Publicar contenidos válidos en `/api/v2/platforms/portfolio/contents`   | Permite generar el catálogo estático real en producción          |
| **P1**    | Higienizar URLs en base de datos (eliminar `evil.example`)              | Corrige enlaces e imágenes rotas en la plataforma                |
| **P1**    | Implementar verificación server-side de reCAPTCHA v3 con score y action | Protege el servicio de correo frente a spam automatizado         |
| **P2**    | Ajustar limitador de tasa `throttle:5,1` en la ruta de contacto         | Previene ataques de denegación de servicio en el envío de emails |
