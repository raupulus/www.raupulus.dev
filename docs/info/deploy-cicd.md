# Despliegue y CI/CD

Scripts de despliegue, configuración de servidores web y pipeline de CI/CD con GoCD.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `scripts/deploy.sh` | Script principal de despliegue |
| `scripts/functions.sh` | Funciones auxiliares compartidas |
| `scripts/generate_env.sh` | Generación de archivo `.env` desde plantilla |
| `nginx.conf` | Configuración Nginx para producción |
| `nginx_dev.conf` | Configuración Nginx para desarrollo |
| `apache.conf` | Configuración Apache para producción |
| `apache_dev.conf` | Configuración Apache para desarrollo |
| `gocd.yaml` | Pipeline de GoCD para despliegue automatizado |

## Generación Estática

El proyecto se despliega como sitio estático:

```bash
# Instalar dependencias
npm install

# Generar sitio estático
npm run generate
```

El output se genera en `.output/public/` (preset `static` de Nitro).

## Prerender de Rutas Dinámicas

En el build, el hook `prerender:routes` de Nitro:

1. Obtiene todos los proyectos desde la API (`usefetchProjectsPaginated()`)
2. Genera rutas `/projects/:slug` y `/projects/:slug/:pageSlug`
3. Cachea las rutas en `cachedRoutes.json`
4. Añade cada URL al set de rutas de prerender

## Scripts npm relevantes

| Script | Comando | Uso |
|--------|---------|-----|
| `dev` | `nuxt dev -p 3020` | Desarrollo local |
| `build` | `nuxt build` | Build para producción |
| `generate` | `nuxt generate` | Generación estática (SSG) |
| `preview` | `nuxt preview` | Preview del build |
| `lint` | `eslint .` | Linting |
| `lint:fix` | `eslint . --fix` | Linting con fix automático |
| `format` | `prettier --write "**/*.{vue,ts,js,css,json,md}"` | Formateo |
| `format:check` | `prettier --check "**/*.{vue,ts,js,css,json,md}"` | Verificación de formato |
| `test` | `vitest` | Tests en modo watch |
| `test:run` | `vitest run` | Tests ejecución única |
| `test:coverage` | `vitest run --coverage` | Tests con cobertura |

## Configuración de Servidores Web

### Nginx (producción)

- Servir archivos estáticos desde `.output/public/`
- SPA fallback para rutas no encontradas
- Compresión gzip
- Headers de caché para assets estáticos

### Apache (producción) — `apache.conf`

- Sirve `.output/public/` estático; rutas inexistentes → `ErrorDocument 404 /404.html` (404 real, sin fallback SPA soft-404)
- Redirección 80 → 443 y TLS endurecido (sin SSLv3/TLS1.0/1.1)
- **Cabeceras de seguridad**: `Content-Security-Policy` (ajustada a reCAPTCHA en `www.recaptcha.net`, GA4 y API propia), `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
- **Caché**: `Cache-Control: public, max-age=31536000, immutable` para `/_nuxt/` y `/_fonts/` (assets con hash)
- Requiere módulos: `mod_headers`, `mod_ssl`, `mod_rewrite`

## CI/CD con GoCD

El archivo `gocd.yaml` define el pipeline de despliegue automatizado (`www-raupulus-dev`), lanzado desde la rama `main` del repositorio de GitLab. Usa **npm** (`npm ci`) como gestor de paquetes en todas las etapas:

| Etapa | Comando | Descripción |
|-------|---------|-------------|
| `lint` | `npm ci && npm run lint` | Verificación de ESLint |
| `test` | `npm ci && npm run test:run` | Tests con Vitest |
| `build` | `npm ci && npm run generate` | Genera el sitio estático; artefacto: `.output/public` → `dist` |

> ⚠️ El pipeline y `scripts/deploy.sh` dependen de `package-lock.json` (npm). Si se cambia de gestor de paquetes hay que actualizar también estos archivos.

## Variables de Entorno

### Desarrollo (`env.example`)

```
APP_NAME=
APP_DESCRIPTION=
APP_URL=http://localhost:3020
APP_DOMAIN=localhost
APP_LOCALE=es_ES
APP_LOCALE_ALTERNATE=en_US
API_DOMAIN_URL=http://localhost:8000
API_BASE_URL=http://localhost:8000/api/v1
API_PATH_CONTACT=contact
CAPTCHA_SITE_KEY=
CAPTCHA_SITE_PRIVATE_KEY=
GTAG_ID=
```

### Producción (`env.example.production`)

Las mismas variables pero con valores de producción (dominio real, API real, etc.)

## Relaciones con otros módulos

- → [nuxt-config.md](./nuxt-config.md): las variables de entorno configuran el runtimeConfig
- → [composables.md](./composables.md): `usefetchProjectsPaginated()` usado en prerender
