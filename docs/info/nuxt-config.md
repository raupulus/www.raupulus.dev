# Configuración de Nuxt

Configuración central del framework Nuxt 4 que define módulos, runtime config, generación estática, proxy de API y prerender de rutas dinámicas.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `nuxt.config.ts` | Configuración principal de Nuxt |
| `tailwind.config.ts` | Configuración de TailwindCSS |
| `tsconfig.json` | Configuración TypeScript |
| `vitest.config.ts` | Configuración de tests |
| `eslint.config.mjs` | Configuración de ESLint |
| `env.example` | Variables de entorno de desarrollo |
| `env.example.production` | Variables de entorno de producción |
| `package.json` | Dependencias y scripts npm |

## Runtime Config

### Privada (solo servidor)

| Variable | Env | Descripción |
|----------|-----|-------------|
| `captcha.secretKey` | `CAPTCHA_SITE_PRIVATE_KEY` | Clave privada de Google reCAPTCHA v3 |

### Pública (`runtimeConfig.public`)

| Variable | Env | Descripción |
|----------|-----|-------------|
| `app.name` | `APP_NAME` | Nombre de la aplicación |
| `app.description` | `APP_DESCRIPTION` | Descripción de la aplicación |
| `app.url` | `APP_URL` | URL pública del sitio (ej. `https://raupulus.dev`) |
| `app.domain` | `APP_DOMAIN` | Dominio del sitio |
| `app.currentLocale` | — | Locale actual, fijado a `'es'` |
| `app.locale` | `APP_LOCALE` | Locale principal |
| `app.localeAlternate` | `APP_LOCALE_ALTERNATE` | Locale alternativo |
| `api.domain` | `API_DOMAIN_URL` | Dominio de la API (ej. `https://api.raupulus.dev`) |
| `api.base` | `API_BASE_URL` | URL base de la API (ej. `https://api.raupulus.dev/api/v1`) |
| `api.contact` | `API_PATH_CONTACT` | Path del endpoint de contacto |
| `captcha.siteKey` | `CAPTCHA_SITE_KEY` | Clave pública de Google reCAPTCHA v3 |

## Módulos Nuxt configurados

| Módulo | Paquete | Función |
|--------|---------|---------|
| Nuxt Image | `@nuxt/image` | Optimización de imágenes (provider IPX) |
| Sitemap | `@nuxtjs/sitemap` | Generación automática del sitemap XML |
| Google Tag | `nuxt-gtag` | Google Analytics con consent mode |
| Cookie Control | `@dargmuesli/nuxt-cookie-control` | Banner GDPR de cookies |
| TailwindCSS | `@nuxtjs/tailwindcss` | Framework CSS utility-first (TailwindCSS 3) |
| ESLint | `@nuxt/eslint` | Genera `.nuxt/eslint.config.mjs`, base del flat config del proyecto |
| Fonts | `@nuxt/fonts` | Self-hosting de Space Grotesk y Plus Jakarta Sans (descarga en build, sirve desde `/_fonts/`) |

## Proxy de API (desarrollo)

```
routeRules: {
  '/_proxy/api/**': { proxy: '${API_DOMAIN_URL}/api/**' }
}
```

En desarrollo, las peticiones del cliente van a `/_proxy/api/v1` para evitar CORS. En producción y en SSR se usa la URL directa. Ver → [composables.md](./composables.md) (`useApiBase`).

## Generación Estática (SSG)

- **Preset**: `static` (Nitro)
- **SSR**: habilitado (`ssr: true`)
- **Hook `prerender:routes`**: obtiene todos los proyectos paginados desde la API y genera rutas `/projects/:slug` y `/projects/:slug/:pageSlug`
- Las rutas generadas se cachean en `cachedRoutes.json` en la raíz del proyecto

## Sitemap

- **Excluye**: `/admin/**`, `/login`
- **URLs dinámicas**: genera URLs para cada proyecto (`priority: 0.9`) y cada página de proyecto (`priority: 0.7`)
- **Defaults**: `changefreq: 'weekly'`, `priority: 0.5`
- Usa `usefetchProjectsPaginated()` del composable `projectsData.ts`

## Scripts npm

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `nuxt dev -p 3020` | Servidor de desarrollo en puerto 3020 |
| `build` | `nuxt build` | Build para producción |
| `generate` | `nuxt generate` | Generación estática |
| `preview` | `nuxt preview` | Preview del build |
| `lint` | `eslint .` | Linting |
| `lint:fix` | `eslint . --fix` | Linting con corrección automática |
| `format` | `prettier --write ...` | Formateo con Prettier |
| `format:check` | `prettier --check ...` | Verificación de formato |
| `test` | `vitest` | Tests en modo watch |
| `test:run` | `vitest run` | Tests una ejecución |
| `test:coverage` | `vitest run --coverage` | Tests con cobertura |

## Otras opciones relevantes

- **TypeScript**: `strict: true`, `typeCheck: false` (el chequeo de tipos se lanza manualmente con `npx vue-tsc --noEmit`)
- **Devtools**: habilitadas salvo en `NODE_ENV=production`
- **`compatibilityDate`**: `2024-09-10`
- **Imágenes** (`image`): provider IPX, directorio base `public/`, dominios permitidos `localhost`, `raupulus.dev`, `api.raupulus.dev`
- **Head global**: fuentes Google (Space Grotesk, Plus Jakarta Sans, Material Symbols), favicons, metatags OG/Twitter por defecto (ver → [seo-sitemap.md](./seo-sitemap.md))
- **gtag**: solo activo en producción, con consent mode denegado por defecto hasta aceptar cookies
- **cookieControl**: banner inferior derecho, cookies `necessary` + `google-analytics` (opcional), textos en es/en

## Relaciones con otros módulos

- → [composables.md](./composables.md): `usefetchProjectsPaginated()` usado en hooks de prerender y sitemap
- → [design-system.md](./design-system.md): CSS importados en `css[]`
- → [seo-sitemap.md](./seo-sitemap.md): configuración de sitemap y metatags globales
- → [plugins-middleware.md](./plugins-middleware.md): registro de plugins
