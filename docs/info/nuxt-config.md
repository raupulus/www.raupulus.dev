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
| `package.json` | Dependencias y scripts con pnpm |

## Runtime Config

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
| `api.base` | `API_BASE_URL` | URL base de la API V2 (ej. `https://api.raupulus.dev/api/v2`) |
| `api.contact` | `API_PATH_CONTACT` | Path del endpoint de contacto (por defecto `contact-messages`) |
| `captcha.siteKey` | `CAPTCHA_SITE_KEY` | Clave pública de Google reCAPTCHA v3 |

*Nota sobre seguridad (U-SEC-010)*: La clave secreta de reCAPTCHA (`CAPTCHA_SITE_PRIVATE_KEY`) ha sido excluida de `runtimeConfig` para evitar su empaquetado innecesario en un sitio generado de forma estática (SSG).

## Módulos Nuxt configurados

| Módulo | Paquete | Función |
|--------|---------|---------|
| Nuxt Image | `@nuxt/image` | Optimización de imágenes (provider IPX) |
| Sitemap | `@nuxtjs/sitemap` | Generación automática del sitemap XML con URLs normalizadas con barra final |
| Google Tag | `nuxt-gtag` | Google Analytics con inicialización manual bajo Consent Mode v2 |
| Cookie Control | `@dargmuesli/nuxt-cookie-control` | Banner RGPD con targetCookieIds (`_ga`, `_gid`) y enlaces canónicos |
| TailwindCSS | `@nuxtjs/tailwindcss` | Framework CSS utility-first (TailwindCSS 3) |
| ESLint | `@nuxt/eslint` | Genera flat config con soporte para Nuxt |
| Fonts | `@nuxt/fonts` | Self-hosting de Space Grotesk (`[400, 700]`) y Plus Jakarta Sans (`[400, 500, 700]`) |

## Proxy de API (desarrollo)

```typescript
routeRules: {
  '/_proxy/api/**': { proxy: `${API_DOMAIN_URL}/api/**` },
  '/_proxy/sanctum/**': { proxy: `${API_DOMAIN_URL}/sanctum/**` }   // cookie CSRF del contacto
}
```

En desarrollo, las peticiones del cliente van a `/_proxy/api/v2` (la ruta sale de `API_BASE_URL`) para evitar CORS. En producción y en SSR se usa la URL directa. Ver → [composables.md](./composables.md) (`useApiBase`).

## Generación Estática (SSG)

- **Preset**: `static` (Nitro)
- **SSR**: habilitado (`ssr: true`)
- **Hook `prerender:routes`**: obtiene todos los proyectos paginados desde la API V2 (con su índice de páginas de `/pages`, que no suma visitas) y genera rutas `/projects/:slug/` y `/projects/:slug/:pageSlug/`
- **Protección contra API vacía (U-BUG-002)**: el hook aborta el build con excepción fatal si la API devuelve 0 proyectos o un error de conexión, impidiendo el despliegue de un sitio degradado. Para desarrollo o testing sin API se permite `ALLOW_EMPTY_PROJECTS=1`.

## Sitemap

- **URLs dinámicas**: genera URLs para cada proyecto (`priority: 0.9`) y cada página de proyecto (`priority: 0.7`)
- **Normalización**: todas las URLs se emiten con barra final (`trailingSlash: true`).
- Usa `usefetchProjectsPaginated()` del composable `projectsData.ts`

## Scripts de desarrollo (pnpm)

| Script | Comando | Descripción |
|--------|---------|-------------|
| `pnpm dev` | `nuxt dev -p 3020` | Servidor de desarrollo en puerto 3020 |
| `pnpm build` | `nuxt build` | Build para producción |
| `pnpm generate` | `nuxt generate` | Generación estática SSG |
| `pnpm preview` | `nuxt preview` | Preview del build estático |
| `pnpm lint` | `eslint .` | Verificación de linting |
| `pnpm lint:fix` | `eslint . --fix` | Corrección automática de linting |
| `pnpm format` | `prettier --write ...` | Formateo con Prettier |
| `pnpm format:check` | `prettier --check ...` | Verificación de formato |
| `pnpm test` | `vitest` | Tests en modo interactivo |
| `pnpm test:run` | `vitest run` | Ejecución única de tests |
| `pnpm test:coverage` | `vitest run --coverage` | Cobertura con `@vitest/coverage-v8` |
| `pnpm exec vue-tsc --noEmit` | `vue-tsc --noEmit` | Chequeo estricto de tipos TypeScript |

## Relaciones con otros módulos

- → [composables.md](./composables.md): `usefetchProjectsPaginated()` usado en hooks de prerender y sitemap
- → [design-system.md](./design-system.md): CSS importados en `css[]`
- → [seo-sitemap.md](./seo-sitemap.md): configuración de sitemap y metatags globales
- → [plugins-middleware.md](./plugins-middleware.md): registro de plugins y middleware
