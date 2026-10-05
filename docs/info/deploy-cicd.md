# Despliegue y CI/CD

Scripts de despliegue, configuración de servidores web y pipeline de CI/CD con GoCD.

## Archivos principales

| Archivo                   | Rol                                           |
| ------------------------- | --------------------------------------------- |
| `scripts/deploy.sh`       | Script principal de despliegue                |
| `scripts/functions.sh`    | Funciones auxiliares compartidas              |
| `scripts/generate_env.sh` | Generación de archivo `.env` desde plantilla  |
| `nginx.conf`              | Configuración Nginx para producción           |
| `nginx_dev.conf`          | Configuración Nginx para desarrollo           |
| `apache.conf`             | Configuración Apache para producción          |
| `apache_dev.conf`         | Configuración Apache para desarrollo          |
| `gocd.yaml`               | Pipeline de GoCD para despliegue automatizado |

## Generación Estática

El proyecto se despliega como sitio estático:

```bash
# Instalar dependencias (pnpm, con el lockfile pnpm-lock.yaml)
pnpm install --frozen-lockfile

# Generar sitio estático
pnpm generate
```

El output se genera en `.output/public/` (preset `static` de Nitro).

## Prerender de Rutas Dinámicas

En el build, el hook `prerender:routes` de Nitro:

1. Obtiene todos los proyectos desde la API (`usefetchProjectsPaginated()`)
2. Genera rutas `/projects/:slug` y `/projects/:slug/:pageSlug`
3. Cachea las rutas en `cachedRoutes.json`
4. Añade cada URL al set de rutas de prerender

## Scripts relevantes (`pnpm <script>`)

| Script          | Comando                                           | Uso                                                             |
| --------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `dev`           | `nuxt dev -p 3020`                                | Desarrollo local                                                |
| `build`         | `nuxt build`                                      | Build para producción                                           |
| `generate`      | `nuxt generate`                                   | Generación estática (SSG)                                       |
| `preview`       | `nuxt preview`                                    | Preview del build                                               |
| `lint`          | `eslint .`                                        | Linting                                                         |
| `lint:fix`      | `eslint . --fix`                                  | Linting con fix automático                                      |
| `format`        | `prettier --write "**/*.{vue,ts,js,css,json,md}"` | Formateo                                                        |
| `format:check`  | `prettier --check "**/*.{vue,ts,js,css,json,md}"` | Verificación de formato                                         |
| `test`          | `vitest`                                          | Tests en modo watch                                             |
| `test:run`      | `vitest run`                                      | Tests ejecución única                                           |
| `test:coverage` | `vitest run --coverage`                           | Tests con cobertura                                             |
| `test:e2e`      | `playwright test`                                 | Tests E2E y accesibilidad WCAG 2.1 AA con Playwright y Axe-core |

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

## Tests End-to-End y Accesibilidad (Playwright + Axe-core)

La suite E2E se ubica en `tests/e2e/` y corre sobre Chromium headless:

- `routes.e2e.ts`: verifica que las 10 rutas canónicas respondan con HTTP 200, título correcto y layout completo (header, contentinfo, app-box-content).
- `not-found.e2e.ts`: comprueba la página 404 personalizada ante rutas inexistentes y la redirección de vuelta al inicio.
- `console-clean.e2e.ts`: monitorea la consola del navegador asegurando ausencia de excepciones no controladas en JavaScript durante la navegación.
- `responsive-320px.e2e.ts`: valida que en viewport de 320 px no exista desbordamiento horizontal (`scrollWidth <= clientWidth`) y que el menú móvil funcione con atributos WCAG.
- `accessibility.e2e.ts`: escanea las páginas con `@axe-core/playwright` bajo el estándar WCAG 2.1 AA.

## CI/CD con GoCD

El archivo `gocd.yaml` define el pipeline de despliegue automatizado (`www-raupulus-dev`), lanzado desde la rama `main` del repositorio de GitLab. Usa exclusivamente **pnpm** (`pnpm install --frozen-lockfile`) en todas las etapas:

| Etapa     | Comandos                                                                                                                           | Descripción                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `quality` | `pnpm lint`, `pnpm exec vue-tsc --noEmit`, `pnpm test:run`, `pnpm exec playwright install chromium`, `pnpm test:e2e`, `pnpm audit` | Puertas de calidad estrictas: linting, tipado estricto, tests unitarios, tests E2E y auditoría de dependencias                     |
| `build`   | `NODE_ENV=production pnpm generate`                                                                                                | Genera el sitio estático; valida que se hayan prerenderizado rutas de proyectos y empaqueta el artefacto `.output/public` → `dist` |
| `deploy`  | Aprobación manual + rsync atómico + purga perimetral Cloudflare + smoke test HTTP 200                                              | Despliegue en producción con conmutación atómica de symlink                                                                        |

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
API_BASE_URL=http://localhost:8000/api/v2
API_PATH_CONTACT=contact-messages
CAPTCHA_SITE_KEY=
CAPTCHA_SITE_PRIVATE_KEY=
GTAG_ID=
```

### Producción (`env.example.production`)

Las mismas variables pero con valores de producción (dominio real, API real, etc.)

## Relaciones con otros módulos

- → [nuxt-config.md](./nuxt-config.md): las variables de entorno configuran el runtimeConfig
- → [composables.md](./composables.md): `usefetchProjectsPaginated()` usado en prerender
