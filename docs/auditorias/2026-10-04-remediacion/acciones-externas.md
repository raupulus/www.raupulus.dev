# Acciones externas — Auditoría consolidada 2026-10-04

> **Destinatario:** Raúl Caro Pastorino (@raupulus), propietario de la plataforma.  
> **Fecha:** 2026-10-05  
> **Rama de remediación:** `remediacion/auditoria-2026-10-04`  
> **Objetivo:** Este documento detalla todas las actuaciones que **no pueden ejecutarse desde el código del repositorio** (backend Laravel, Cloudflare, DNS, servidor web de producción, configuración de CI y decisiones personales/legales), ordenadas por estricta prioridad de despliegue.

---

## Índice de acciones

1. [Prioridad 0 — Bloqueantes para el despliegue a producción](#1-prioridad-0--bloqueantes-para-el-despliegue-a-producción)
   - 1.1 Poblar y publicar proyectos en la API v2 (`U-BUG-001`, `U-BUG-002`)
   - 1.2 Investigar y blindar `evil.example` en la API Laravel (`U-SEC-003`)
   - 1.3 Resolver el envío de contacto: endpoint stateless o `SESSION_DOMAIN` (`U-BUG-003`)
   - 1.4 Eliminar sesiones y cookies en lecturas públicas de la API (`U-LEGAL-009`)
2. [Prioridad 1 — Seguridad de red, Cloudflare y DNS](#2-prioridad-1--seguridad-de-red-cloudflare-y-dns)
   - 2.1 Cabeceras de seguridad HTTP en Cloudflare Edge (`U-SEC-001`)
   - 2.2 Activar HSTS en Cloudflare y en el origen (`U-SEC-002`)
   - 2.3 Reglas de caché (Cache Rules) en Cloudflare (`U-PERF-001`)
   - 2.4 Registro DNS para `www.raupulus.dev` (`U-INFRA-004`)
   - 2.5 Registros DNS CAA y endurecimiento DMARC (`U-SEC-011`)
3. [Prioridad 2 — Servidor web e infraestructura](#3-prioridad-2--servidor-web-e-infraestructura)
   - 3.1 Sincronizar configuración de Apache/Nginx en producción (`U-INFRA-002`)
   - 3.2 Ocultar firmas de versión del servidor (`ServerTokens`, `ServerSignature`)
   - 3.3 Configurar variables seguras en GoCD (`U-INFRA-001`)
   - 3.4 Configurar monitorización externa de disponibilidad (`U-INFRA-005`)
4. [Prioridad 3 — Textos legales y datos personales](#4-prioridad-3--textos-legales-y-datos-personales)
   - 4.1 Revisión de marcadores `[[COMPLETAR]]` en textos legales (`U-LEGAL-005`, `U-LEGAL-007`)
5. [Prioridad 4 — Decisiones de repositorio e historia](#5-prioridad-4--decisiones-de-repositorio-e-historia)
   - 5.1 Reescritura del historial git con `git-filter-repo` (`U-SEC-008`)
   - 5.2 Decisión sobre repositorio privado para infraestructura (`U-SEC-009`)
   - 5.3 Planificación de migración de reCAPTCHA a Cloudflare Turnstile (`U-DEP-004`)
6. [Orden cronológico recomendado para el despliegue](#6-orden-cronológico-recomendado-para-el-despliegue)

---

## 1. Prioridad 0 — Bloqueantes para el despliegue a producción

### 1.1 Poblar y publicar proyectos en la API v2 (`U-BUG-001`, `U-BUG-002`)
- **Ámbito:** Backend Laravel (`api.raupulus.dev`).
- **Problema:** La API v2 (`/api/v2/platforms/portfolio/contents?type=project`) actualmente devuelve `total: 0`. Como el build del frontend ahora exige proyectos reales (salvo que se fuerce `ALLOW_EMPTY_PROJECTS=1`), `pnpm generate` fallará en el pipeline de CI si no hay contenidos.
- **Acción requerida:**
  1. Ejecutar las migraciones y seeders de la API v2 en el servidor de producción:
     ```bash
     php artisan migrate --force
     # Poblar o migrar los contenidos históricos desde la base de datos v1 a las tablas v2
     ```
  2. Asegurar que la plataforma `portfolio` tiene contenidos asociados de tipo `project` con estado publicado (`is_published = true`).
  3. Verificar que el endpoint `/cv/pdf` devuelve el archivo PDF correctamente.
- **Verificación:**
  Se ha preparado el script automatizado `scripts/backend/check-api-v2.sh`:
  ```bash
  ./scripts/backend/check-api-v2.sh
  ```
  O manualmente:
  ```bash
  curl -s "https://api.raupulus.dev/api/v2/platforms/portfolio/contents?type=project" | jq '.data | length'
  # Debe devolver un número mayor que 0
  curl -I -s "https://api.raupulus.dev/cv/pdf" | grep -E "HTTP|content-type"
  # Debe responder 200 OK con application/pdf
  ```

---

### 1.2 Investigar y blindar `evil.example` en la API Laravel (`U-SEC-003`)
- **Ámbito:** Backend Laravel (`api.raupulus.dev`).
- **Problema:** Durante la auditoría se detectó que la API sirvió una URL de imagen con host `evil.example` (`http://evil.example/storage/...`), indicio de envenenamiento de caché o falta de validación de `Host` en peticiones entrantes.
- **Acción requerida:**
  1. En `app/Http/Middleware/TrustProxies.php` (o `bootstrap/app.php` en Laravel 11), definir de forma estricta los proxies de confianza (especialmente los rangos IP de Cloudflare):
     ```php
     protected $proxies = '*'; // O la lista de IPs de Cloudflare: https://www.cloudflare.com/ips/
     protected $headers = Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_HOST | Request::HEADER_X_FORWARDED_PORT | Request::HEADER_X_FORWARDED_PROTO;
     ```
  2. En `app/Http/Middleware/TrustHosts.php` habilitar y fijar los hosts permitidos:
     ```php
     public function hosts(): array
     {
         return [
             $this->allSubdomainsOfApplicationUrl(),
             'api.raupulus.dev',
             'raupulus.dev',
         ];
     }
     ```
  3. Forzar `URL::forceRootUrl(config('app.url'))` y `URL::forceScheme('https')` en `AppServiceProvider::boot()` para que la generación de URLs de assets nunca dependa de la cabecera `Host` HTTP recibida.
- **Verificación:**
  ```bash
  curl -s -H "Host: evil.example" "https://api.raupulus.dev/api/v2/platforms/portfolio" -I
  # Debe responder 400 Bad Request o redirigir/ignorar el host en las URLs devueltas en el payload.
  ```

---

### 1.3 Resolver el envío de contacto: endpoint stateless o `SESSION_DOMAIN` (`U-BUG-003`)
- **Ámbito:** Backend Laravel (`api.raupulus.dev`).
- **Problema:** Sanctum utiliza cookies de sesión para CSRF. Las cookies no cruzan entre `raupulus.dev` y `api.raupulus.dev` salvo que la cookie esté configurada a nivel de dominio `.raupulus.dev` y se compartan cookies SameSite; o mejor aún, que el endpoint sea **stateless**.
- **Acción requerida (opción recomendada: Stateless):**
  1. Mover la ruta `POST /api/v2/contact-messages` fuera del grupo middleware `web` / `auth:sanctum`.
  2. Colocarla en `routes/api.php` con middleware `api`, protegido exclusivamente por validación de reCAPTCHA v3 en el controlador (`recaptcha_token`), rate limiting (`throttle:5,1`) y sanitización.
  3. En caso de preferir mantener CSRF Sanctum:
     - En `.env` del backend: `SESSION_DOMAIN=.raupulus.dev` y `SANCTUM_STATEFUL_DOMAINS=raupulus.dev,www.raupulus.dev`.
     - `SESSION_SAME_SITE=none` y `SESSION_SECURE_COOKIE=true`.
- **Verificación:**
  ```bash
  # Enviar petición POST de prueba con token mock para validar que no responde 419 Page Expired
  curl -X POST "https://api.raupulus.dev/api/v2/contact-messages" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"public@raupulus.dev","subject":"Test","message":"Mensaje de prueba suficiente","recaptcha_token":"test"}' \
    -s | jq '.success, .message'
  ```

---

### 1.4 Eliminar sesiones y cookies en lecturas públicas de la API (`U-LEGAL-009`)
- **Ámbito:** Backend Laravel (`api.raupulus.dev`).
- **Problema:** En cada lectura GET pública (`/api/v2/platforms/portfolio`), la API Laravel responde con cabeceras `Set-Cookie: laravel_session=...; XSRF-TOKEN=...`, lo cual crea sesiones innecesarias en base de datos/Redis y viola el principio de minimización de cookies en lecturas públicas de una API REST.
- **Acción requerida:**
  1. Asegurar que las rutas de la API en `routes/api.php` **no** ejecuten el middleware `\Illuminate\Session\Middleware\StartSession::class` ni `\Illuminate\View\Middleware\ShareErrorsFromSession::class`.
  2. Comprobar que el grupo `api` en `app/Http/Kernel.php` (o `bootstrap/app.php`) solo contenga:
     - `throttle:api`
     - `\Illuminate\Routing\Middleware\SubstituteBindings::class`
- **Verificación:**
  ```bash
  curl -I -s "https://api.raupulus.dev/api/v2/platforms/portfolio" | grep -i "set-cookie"
  # No debe devolver ninguna línea Set-Cookie
  ```

---

## 2. Prioridad 1 — Seguridad de red, Cloudflare y DNS

### 2.1 Cabeceras de seguridad HTTP en Cloudflare Edge (`U-SEC-001`)
- **Ámbito:** Panel Cloudflare (`raupulus.dev`).
- **Problema:** Producción no emite actualmente cabeceras de seguridad HTTP en las respuestas.
- **Acción requerida:**
  1. Ir a **Rules** → **Transform Rules** → **Modify Response Header**.
  2. Crear una regla aplicada a todas las peticiones entrantes (`ssl eq true`):
     - `Content-Security-Policy`:
       ```text
       default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api.raupulus.dev https://www.google-analytics.com https://region1.google-analytics.com https://www.google.com; frame-src 'self' https://www.google.com https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;
       ```
     - `X-Frame-Options`: `DENY`
     - `X-Content-Type-Options`: `nosniff`
     - `Referrer-Policy`: `strict-origin-when-cross-origin`
     - `Permissions-Policy`: `camera=(), microphone=(), geolocation=(), payment=(), usb=()`
     - `Cross-Origin-Opener-Policy`: `same-origin`
     - `Cross-Origin-Resource-Policy`: `same-origin`
- **Verificación:**
  Se ha preparado la definición declarativa en `scripts/cloudflare/security-headers.json` y el script de aprovisionamiento perimetral `scripts/cloudflare/setup-dns.sh`:
  ```bash
  CLOUDFLARE_API_TOKEN='...' CLOUDFLARE_ZONE_ID='...' ./scripts/cloudflare/setup-dns.sh
  ```
  O manualmente comprobando con curl:
  ```bash
  curl -I -s "https://raupulus.dev/" | grep -E -i "content-security-policy|x-frame-options|x-content-type-options"
  ```

---

### 2.2 Activar HSTS en Cloudflare y en el origen (`U-SEC-002`)
- **Ámbito:** Panel Cloudflare (`raupulus.dev`) y servidor de la API.
- **Problema:** En producción se detectó HSTS con `max-age=0`.
- **Acción requerida:**
  1. En Cloudflare: **SSL/TLS** → **Edge Certificates** → **HTTP Strict Transport Security (HSTS)** (o ejecutando `scripts/cloudflare/setup-dns.sh`):
     - Enable HSTS: **Sí**
     - Max Age Header: **1 year (31536000)** (o 2 años 63072000)
     - Apply HSTS policy to subdomains (`includeSubDomains`): **Sí**
     - Preload: **Sí**
     - No-sniff header: **Sí**
  2. En el servidor de la API (`api.raupulus.dev`), en la configuración de Nginx/Apache añadir:
     ```nginx
     add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
     ```
- **Verificación:**
  ```bash
  curl -I -s "https://raupulus.dev/" | grep -i "strict-transport-security"
  # Debe responder: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  ```

---

### 2.3 Reglas de caché (Cache Rules) en Cloudflare (`U-PERF-001`)
- **Ámbito:** Panel Cloudflare (`raupulus.dev`).
- **Problema:** Los assets estáticos generados con hash (`_nuxt/*`) deben cachearse 1 año con `immutable`, mientras que los documentos HTML (`/`, `/projects/`, etc.) deben validarse con `no-cache`.
- **Acción requerida:**
  1. Ir a **Caching** → **Cache Rules**.
  2. Crear Regla 1 — *Assets con hash inmutables*:
     - Expresión: `starts_with(http.request.uri.path, "/_nuxt/") or starts_with(http.request.uri.path, "/_fonts/")`
     - Edge TTL: 1 año (31536000 s).
     - Browser TTL: 1 año.
  3. Crear Regla 2 — *Documentos HTML y datos*:
     - Expresión: `ends_with(http.request.uri.path, "/") or ends_with(http.request.uri.path, ".html") or http.request.uri.path eq "/sitemap.xml"`
     - Edge TTL: 10 minutos (con revalidación al desplegar vía purga).
     - Browser TTL: Respetar cabecera de origen (`no-cache, must-revalidate`).
- **Verificación:**
  ```bash
  curl -I -s "https://raupulus.dev/" | grep -i "cache-control"
  curl -I -s "https://raupulus.dev/_nuxt/..." | grep -i "cache-control"
  ```

---

### 2.4 Registro DNS para `www.raupulus.dev` (`U-INFRA-004`)
- **Ámbito:** Cloudflare DNS (`raupulus.dev`).
- **Problema:** El subdominio `www.raupulus.dev` no resuelve actualmente en DNS.
- **Acción requerida:**
  1. En **DNS** → **Records**:
     - Tipo: `CNAME`
     - Nombre: `www`
     - Destino: `raupulus.dev`
     - Proxy status: **Proxied (Nube naranja activada)**
  2. En **Rules** → **Redirect Rules**:
     - Nombre: `Redirigir www a raíz`
     - Expresión: `http.host eq "www.raupulus.dev"`
     - Tipo: **Dynamic** / **301 (Permanent Redirect)**
     - URL de destino: `concat("https://raupulus.dev", http.request.uri.path)`
- **Verificación:**
  ```bash
  curl -I -s "https://www.raupulus.dev/about/"
  # Debe devolver 301 Moved Permanently con Location: https://raupulus.dev/about/
  ```

---

### 2.5 Registros DNS CAA y endurecimiento DMARC (`U-SEC-011`)
- **Ámbito:** Cloudflare DNS (`raupulus.dev`).
- **Problema:** Falta registro CAA y el registro DMARC está configurado en modo pasivo `p=none`.
- **Acción requerida:**
  1. Añadir registros `CAA` para limitar qué autoridades certificadoras pueden emitir certificados para el dominio:
     ```text
     raupulus.dev.  IN  CAA  0 issue "letsencrypt.org"
     raupulus.dev.  IN  CAA  0 issue "digicert.com"
     raupulus.dev.  IN  CAA  0 issuewild "letsencrypt.org"
     raupulus.dev.  IN  CAA  0 iodef "mailto:public@raupulus.dev"
     ```
  2. Endurecer el registro `TXT` para `_dmarc.raupulus.dev`:
     - Cambiar `v=DMARC1; p=none; ...` a:
     ```text
     v=DMARC1; p=quarantine; sp=quarantine; rua=mailto:public@raupulus.dev; aspf=r; adkim=r;
     ```
- **Verificación:**
  ```bash
  dig +short CAA raupulus.dev
  dig +short TXT _dmarc.raupulus.dev
  ```

---

## 3. Prioridad 2 — Servidor web e infraestructura

### 3.1 Sincronizar configuración de Apache/Nginx en producción (`U-INFRA-002`)
- **Ámbito:** Servidor de producción (`/etc/apache2/sites-available/` o `/etc/nginx/sites-available/`).
- **Problema:** Las configuraciones versionadas en el repositorio (`apache.conf`, `apache_dev.conf`, `public/.htaccess`) no estaban desplegadas en el servidor de producción.
- **Acción requerida:**
  1. Si se usa Apache en producción:
     - Copiar `apache.conf` actualizado al VirtualHost correspondiente en `/etc/apache2/sites-available/www.raupulus.dev.conf`.
     - Habilitar módulos necesarios:
       ```bash
       sudo a2enmod rewrite headers expires ssl
       sudo systemctl reload apache2
       ```
  2. Si se usa Nginx como reverse proxy o servidor principal:
     - Configurar la raíz en el directorio activo apuntado por el symlink atómico: `/var/www/raupulus.dev/current`.
     - Comprobar que maneja la barra final (`trailing slash`) coherente con la configuración del build.
- **Verificación:**
  ```bash
  curl -I -s "https://raupulus.dev/non-existent-page"
  # Debe responder 404 real, no 200 con la home (soft-404 U-BUG-004 corregido)
  ```

---

### 3.2 Ocultar firmas de versión del servidor
- **Ámbito:** Configuración global del servidor web.
- **Problema:** Divulgación de versión del sistema operativo y servidor web en cabeceras `Server`.
- **Acción requerida:**
  - En Apache (`/etc/apache2/conf-available/security.conf`):
    ```apache
    ServerTokens Prod
    ServerSignature Off
    ```
  - En Nginx (`/etc/nginx/nginx.conf`):
    ```nginx
    server_tokens off;
    ```
- **Verificación:**
  ```bash
  curl -I -s "https://raupulus.dev/" | grep -i "server"
  # Solo debe mostrar Cloudflare en el borde, o nombre genérico sin números de versión en peticiones directas.
  ```

---

### 3.3 Configurar variables seguras en GoCD (`U-INFRA-001`)
- **Ámbito:** Servidor de CI/CD GoCD.
- **Problema:** El pipeline en `gocd.yaml` fue migrado a `pnpm`, con generación atómica y purga de Cloudflare, pero requiere que las variables seguras estén declaradas en el servidor de GoCD.
- **Acción requerida:**
  En el pipeline de GoCD para `www.raupulus.dev`, configurar las siguientes variables de entorno (las marcadas como `[SECRET]` deben cifrarse en la UI de GoCD):
  - `APP_URL`: `https://raupulus.dev`
  - `APP_DOMAIN`: `raupulus.dev`
  - `API_DOMAIN_URL`: `https://api.raupulus.dev`
  - `API_BASE_URL`: `https://api.raupulus.dev/api/v2`
  - `API_PATH_CONTACT`: `contact-messages`
  - `GTAG_ID`: `[SECRET]` (ID de Google Analytics, ej. `G-XXXXXXXXXX`)
  - `CAPTCHA_SITE_KEY`: `[SECRET]` (Clave pública de reCAPTCHA v3)
  - `CLOUDFLARE_ZONE_ID`: `[SECRET]` (Zone ID de `raupulus.dev` en Cloudflare)
  - `CLOUDFLARE_API_TOKEN`: `[SECRET]` (API Token con permiso `Zone.Cache Purge`)
- **Verificación:**
  Ejecutar un build de prueba en GoCD y verificar que las variables se inyectan sin mostrar valores sensibles en los logs.

---

### 3.4 Configurar monitorización externa de disponibilidad (`U-INFRA-005`)
- **Ámbito:** Servicio externo de monitorización (UptimeRobot, BetterUptime, Checkly o Cloudflare Health Checks).
- **Problema:** Actualmente no existe monitorización externa de disponibilidad ni alertas ante caídas de la web o de la API.
- **Acción requerida:**
  1. Configurar monitores HTTP(S) cada 3-5 minutos:
     - `https://raupulus.dev/` (debe esperar `200 OK`).
     - `https://api.raupulus.dev/api/v2/platforms/portfolio` (debe esperar `200 OK` y validar JSON `{ "success": true }`).
     - `https://raupulus.dev/cv/pdf` (debe esperar `200 OK`).
  2. Configurar alertas a `public@raupulus.dev` o canal de Telegram/Discord.
- **Verificación:**
  Comprobar que el monitor recibe respuestas correctas y emite alertas de prueba exitosas.

---

## 4. Prioridad 3 — Textos legales y datos personales

### 4.1 Revisión de marcadores `[[COMPLETAR]]` en textos legales (`U-LEGAL-005`, `U-LEGAL-007`)
- **Ámbito:** Repositorio de código (`pages/privacy.vue`, `pages/legal.vue`, `pages/cookies.vue`).
- **Problema:** Por regla estricta de no inventar datos personales o fiscales, se incluyeron marcadores `[[COMPLETAR: ...]]` para que el titular revise y complete antes o después del despliegue.
- **Marcadores a revisar:**
  1. En `pages/privacy.vue`:
     - `[[COMPLETAR: Plazo exacto de conservación, ej. 12 meses o prescripción legal civil de 5 años]]`: Validar el plazo de conservación de consultas de contacto.
     - `[[COMPLETAR: Proveedor de infraestructura y ubicación física del servidor, ej. Hetzner Cloud (Núremberg/Falkenstein, Alemania)]]`: Indicar el hosting real donde reside la API y los servidores.
  2. En `pages/legal.vue`:
     - `[[COMPLETAR: Número de identificación fiscal o NIF/NIE si aplica por actividad comercial/mercantil]]`: Si la web tiene naturaleza puramente personal y de portfolio no comercial, la AEPD y LSSI no exigen publicar el DNI personal si no hay facturación directa; si la hay, debe constar el NIF.
     - `[[COMPLETAR: Domicilio a efectos de notificaciones o dirección postal profesional/despacho si aplica]]`.
- **Verificación:**
  Revisar en navegador `/privacy/` y `/legal/` tras sustituir los marcadores por los datos validados.

---

## 5. Prioridad 4 — Decisiones de repositorio e historia

### 5.1 Reescritura del historial git con `git-filter-repo` (`U-SEC-008`)
- **Ámbito:** Repositorio Git local y remoto.
- **Problema:** Existen 36 commits históricos en el repositorio público que contienen la dirección de correo personal anterior. En el código actual y ramas activas se ha purgado totalmente (`ServerAdmin` y menciones), pero la historia git previa conserva los metadatos de autor.
- **Decisión requerida:**
  El parámetro de remediación fue `REESCRIBIR_HISTORIA = no` porque reescribir la historia exige `git push --force` e invalida clones existentes.
- **Procedimiento si el propietario decide purgarlo:**
  Se ha preparado el script `scripts/maintenance/git-filter-repo-clean-emails.sh`, que automatiza la creación de una rama de respaldo previa y la verificación de 0 ocurrencias:
  ```bash
  OLD_EMAIL="correo-personal-a-reemplazar" ./scripts/maintenance/git-filter-repo-clean-emails.sh
  ```
  O manualmente:
  1. Hacer una copia de seguridad completa del repositorio:
     ```bash
     cp -r /Users/fryntiz/git/3-Raupulus/www.raupulus.dev /tmp/www.raupulus.dev.backup
     ```
  2. Ejecutar `git-filter-repo`:
     ```bash
     git-filter-repo --mailmap <(echo "Raul Caro Pastorino <public@raupulus.dev> <CORREO_PERSONAL_A_REEMPLAZAR>")
     ```
  3. Revisar el historial resultante:
     ```bash
     git log --format='%an <%ae>' | sort -u
     ```
  4. Si es conforme, sincronizar con el remoto mediante push forzado de todas las ramas (`git push origin --force --all`).

---

### 5.2 Decisión sobre repositorio privado para infraestructura (`U-SEC-009`)
- **Ámbito:** Repositorio Git.
- **Problema:** El repositorio incluye archivos como `gocd.yaml`, `apache.conf` y scripts de despliegue que revelan la topología interna del servidor.
- **Decisión requerida:**
  - **Opción A (Recomendada):** Mantenerlos en el repositorio parametrizados con variables de entorno y sin secretos ni IPs internas en texto plano (como ya está estructurado).
  - **Opción B:** Mover la infraestructura a un repositorio privado independiente de Ansible/IaC y dejar en este repo únicamente el código de la aplicación estática.

---

### 5.3 Planificación de migración de reCAPTCHA a Cloudflare Turnstile (`U-DEP-004`)
- **Ámbito:** Roadmap técnico (Frontend + Backend).
- **Problema:** `vue-recaptcha-v3` está sin mantenimiento desde 2022 y depende de Google.
- **Planificación recomendada:**
  - En la siguiente iteración del backend Laravel, incorporar validación de Cloudflare Turnstile (`https://challenges.cloudflare.com/turnstile/v0/siteverify`).
  - En el frontend, reemplazar `vue-recaptcha-v3` por `@nuxtjs/turnstile` (100 % integrable con Nuxt 4, sin dependencias obsoletas y respetuoso con la privacidad sin cookies de rastreo).

---

## 6. Orden cronológico recomendado para el despliegue

Para un despliegue seguro y sin indisponibilidad, seguir estrictamente este orden:

```text
[Paso 1: Backend API v2]
  └─ 1. Migrar y poblar contenidos en la API v2 de producción (U-BUG-001, U-BUG-002)
  └─ 2. Aplicar TrustHosts y TrustProxies en Laravel (U-SEC-003)
  └─ 3. Configurar endpoint stateless o SESSION_DOMAIN en Laravel (U-BUG-003, U-LEGAL-009)
  └─ 4. Verificar que /api/v2/... responde proyectos con HTTP 200 y sin Set-Cookie

[Paso 2: Cloudflare & Red]
  └─ 1. Configurar Transform Rules con cabeceras de seguridad (U-SEC-001)
  └─ 2. Habilitar HSTS en Cloudflare (U-SEC-002)
  └─ 3. Configurar DNS CNAME www.raupulus.dev y redirección 301 (U-INFRA-004)
  └─ 4. Configurar registros CAA y DMARC (U-SEC-011)

[Paso 3: Servidor de CI/CD (GoCD)]
  └─ 1. Cargar las variables seguras y secretos en GoCD (U-INFRA-001)

[Paso 4: Integración del código]
  └─ 1. Fusionar la rama `remediacion/auditoria-2026-10-04` en `dev` y luego en `main`
  └─ 2. Ejecutar el pipeline de GoCD:
        - pnpm lint
        - pnpm exec vue-tsc --noEmit
        - pnpm test:run
        - pnpm generate (compilación estática con datos reales de la API)
        - Despliegue atómico con symlink a /var/www/raupulus.dev/current
        - Purga de caché en Cloudflare

[Paso 5: Verificación post-despliegue (Smoke Test)]
  └─ 1. Comprobar que https://raupulus.dev/ carga en < 1.5 s
  └─ 2. Comprobar que el catálogo /projects/ lista los proyectos reales
  └─ 3. Comprobar que el detalle estático /projects/:slug/ carga sin errores de consola
  └─ 4. Comprobar que una ruta inexistente responde 404 real
  └─ 5. Enviar mensaje de prueba en /contact/
  └─ 6. Verificar que la consola del navegador está completamente limpia de errores
```
