# Configuración de Nuxt

Configuración central del framework Nuxt 4 que define módulos, runtime config, generación estática, proxy de API y prerender de rutas dinámicas.

## Archivos principales

| Archivo                  | Rol                                |
| ------------------------ | ---------------------------------- |
| `nuxt.config.ts`         | Configuración principal de Nuxt    |
| `tailwind.config.ts`     | Configuración de TailwindCSS       |
| `tsconfig.json`          | Configuración TypeScript           |
| `vitest.config.ts`       | Configuración de tests             |
| `eslint.config.mjs`      | Configuración de ESLint            |
| `env.example`            | Variables de entorno de desarrollo |
| `env.example.production` | Variables de entorno de producción |
| `package.json`           | Dependencias y scripts con pnpm    |

## Runtime Config

### Pública (`runtimeConfig.public`)

| Variable              | Env                    | Descripción                                                    |
| --------------------- | ---------------------- | -------------------------------------------------------------- |
| `app.name`            | `APP_NAME`             | Nombre de la aplicación                                        |
| `app.description`     | `APP_DESCRIPTION`      | Descripción de la aplicación                                   |
| `app.url`             | `APP_URL`              | URL pública del sitio (ej. `https://raupulus.dev`)             |
| `app.domain`          | `APP_DOMAIN`           | Dominio del sitio                                              |
| `app.currentLocale`   | —                      | Locale actual, fijado a `'es'`                                 |
| `app.locale`          | `APP_LOCALE`           | Locale principal                                               |
| `app.localeAlternate` | `APP_LOCALE_ALTERNATE` | Locale alternativo                                             |
| `api.domain`          | `API_DOMAIN_URL`       | Dominio de la API (ej. `https://api.raupulus.dev`)             |
| `api.base`            | `API_BASE_URL`         | URL base de la API V2 (ej. `https://api.raupulus.dev/api/v2`)  |
| `api.contact`         | `API_PATH_CONTACT`     | Path del endpoint de contacto (por defecto `contact-messages`) |
| `turnstile.siteKey`   | `TURNSTILE_SITE_KEY`   | Clave del sitio de Cloudflare Turnstile                        |

## Módulos Nuxt configurados

| Módulo         | Paquete                           | Función                                                                              |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------ |
| Nuxt Image     | `@nuxt/image`                     | Optimización de imágenes (provider IPX)                                              |
| Sitemap        | `@nuxtjs/sitemap`                 | Generación automática del sitemap XML con URLs normalizadas con barra final          |
| Google Tag     | `nuxt-gtag`                       | Google Analytics con inicialización manual bajo Consent Mode v2                      |
| Cookie Control | `@dargmuesli/nuxt-cookie-control` | Banner RGPD con targetCookieIds (`_ga`, `_gid`) y enlaces canónicos                  |
| TailwindCSS    | `@nuxtjs/tailwindcss`             | Framework CSS utility-first (TailwindCSS 3)                                          |
| ESLint         | `@nuxt/eslint`                    | Genera flat config con soporte para Nuxt                                             |
| Fonts          | `@nuxt/fonts`                     | Self-hosting de Space Grotesk (`[400, 700]`) y Plus Jakarta Sans (`[400, 500, 700]`) |
| Turnstile      | `@nuxtjs/turnstile`               | Protección contra spam con Cloudflare Turnstile (componente `<NuxtTurnstile>`)       |

## Reglas de Rutas y Cabeceras de Seguridad (`routeRules`)

```typescript
routeRules: {
  '/**': {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
  },
  '/_proxy/api/**': { proxy: `${API_DOMAIN_URL}/api/**` },
  '/_proxy/sanctum/**': { proxy: `${API_DOMAIN_URL}/sanctum/**` }   // cookie CSRF del contacto
}
```

Las cabeceras de seguridad se inyectan a nivel de Nitro en todas las rutas servidas. Las peticiones a la API usan la URL directa configurada en `API_BASE_URL` tanto en servidor como en cliente. Ver → [composables.md](./composables.md) (`useApiBase`).

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

| Script                       | Comando                 | Descripción                           |
| ---------------------------- | ----------------------- | ------------------------------------- |
| `pnpm dev`                   | `nuxt dev -p 3020`      | Servidor de desarrollo en puerto 3020 |
| `pnpm build`                 | `nuxt build`            | Build para producción                 |
| `pnpm generate`              | `nuxt generate`         | Generación estática SSG               |
| `pnpm preview`               | `nuxt preview`          | Preview del build estático            |
| `pnpm lint`                  | `eslint .`              | Verificación de linting               |
| `pnpm lint:fix`              | `eslint . --fix`        | Corrección automática de linting      |
| `pnpm format`                | `prettier --write ...`  | Formateo con Prettier                 |
| `pnpm format:check`          | `prettier --check ...`  | Verificación de formato               |
| `pnpm test`                  | `vitest`                | Tests en modo interactivo             |
| `pnpm test:run`              | `vitest run`            | Ejecución única de tests              |
| `pnpm test:coverage`         | `vitest run --coverage` | Cobertura con `@vitest/coverage-v8`   |
| `pnpm exec vue-tsc --noEmit` | `vue-tsc --noEmit`      | Chequeo estricto de tipos TypeScript  |

## Gestor de dependencias y overrides (`pnpm-workspace.yaml`)

El proyecto utiliza **pnpm** de forma exclusiva. Para garantizar compatibilidad, evitar regresiones en la generación estática (SSG) y resolver vulnerabilidades sin romper el ecosistema de Nuxt 4, se definen overrides específicos en `pnpm-workspace.yaml`:

- `vite: ^7.3.6`: Unifica el entorno de Vite en la versión 7 soportada por Nuxt 4 y Nitro, evitando que herramientas de test (como Vitest) introduzcan Vite 8 en paralelo y rompan el prerendering SSR.
- `postcss: ^8.5.28`: Parchea vulnerabilidades conocidas en subdependencias de `@vue/compiler-sfc`.
- `devalue: ^5.9.4`: Parchea vulnerabilidad en deserialización de estado Nuxt.
- `esbuild: ^0.28.1`: Unifica el compilador para evitar versiones vulnerables arrastradas por módulos de fuentes.

### Estado de auditoría de paquetes

- `pnpm audit --prod`: **0 vulnerabilidades conocidas** (`No known vulnerabilities found`), tras la actualización de `isomorphic-dompurify` a `^4.4.0`.

### Criterios de fijación de versiones (Pins)

- `nuxt: 4.4.8`: Fijada exactamente en 4.4.8 para evitar la regresión de `nitropack@2.13.4` / oxc-parser presente en Nuxt 4.5.x, la cual produce fallos `[500] Server Error` durante el prerender SSG de rutas dinámicas.
- `tailwindcss: ^3.4.19`: Mantenido en v3 según directrices de `AGENTS.md` (el módulo `@nuxtjs/tailwindcss` 6.x no soporta Tailwind 4).
- `@nuxt/devtools: ^2.7.0`: Mantenido en la última versión estable (sin usar versiones beta de DevTools 4).
- `vitest: ^4.1.9`: Mantenido en la rama 4.x para compartir el runtime Vite 7 sin conflictos.

## Relaciones con otros módulos

- → [composables.md](./composables.md): `usefetchProjectsPaginated()` usado en hooks de prerender y sitemap
- → [design-system.md](./design-system.md): CSS importados en `css[]`
- → [seo-sitemap.md](./seo-sitemap.md): configuración de sitemap y metatags globales
- → [plugins-middleware.md](./plugins-middleware.md): registro de plugins y middleware
