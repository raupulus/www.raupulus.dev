# AGENTS.md — Instrucciones para Agentes de IA

> Este archivo define el contexto, convenciones y reglas que todo agente de IA debe respetar al trabajar en este proyecto.

## Descripción del Proyecto

**www.raupulus.dev** es el portfolio web personal de Raúl Caro Pastorino (@raupulus). Está construido con **Nuxt 4** (Vue 3 + Composition API), **TypeScript** y **TailwindCSS**. Se genera como sitio estático (SSG) y consume una API REST externa en `api.raupulus.dev`.

- **Framework**: Nuxt 4 (Vue 3, `<script setup lang="ts">`, Composition API)
- **Lenguaje**: TypeScript (modo estricto)
- **Estilos**: TailwindCSS 3 + design system "Silicon Architect" (tema oscuro, tokens Material Design 3)
- **Generación**: Estática (SSG) con preset `static` de Nitro
- **API Backend**: Laravel REST API V2 en `api.raupulus.dev/api/v2`
- **Testing**: Vitest + Vue Test Utils + happy-dom
- **Linting**: ESLint (flat config generado por el módulo `@nuxt/eslint`) + Prettier
- **Módulos Nuxt**: `@nuxt/image` (IPX), `@nuxtjs/sitemap`, `nuxt-gtag`, `@dargmuesli/nuxt-cookie-control`, `@nuxtjs/tailwindcss`, `@nuxt/eslint`, `@nuxt/fonts`
- **Analytics**: Google Analytics vía `nuxt-gtag` con consent mode y control de cookies
- **Fuentes**: Space Grotesk + Plus Jakarta Sans, self-hosted con `@nuxt/fonts` (sin peticiones a Google Fonts)
- **Iconos**: SVG inline con `<UiMaterialIcon name="..." />` (`components/ui/MaterialIcon.vue` + `assets/icons/material/`); no usar la fuente Material Symbols

## Gestor de Paquetes

**Usar pnpm, nunca npm ni yarn.** Instalar con `pnpm install`, ejecutar scripts con `pnpm <script>` y binarios con `pnpm exec <bin>` (no `npm`, `npm run` ni `npx`). El lockfile de referencia es `pnpm-lock.yaml`: no generar ni actualizar `package-lock.json` ni `yarn.lock`.

- TailwindCSS se mantiene en **v3** (el módulo `@nuxtjs/tailwindcss` 6.x no soporta Tailwind 4). No actualizar a Tailwind 4 sin migrar antes el módulo y la configuración.
- `@nuxt/devtools` se mantiene en la última versión estable (no usar versiones alpha).
- `dompurify` incluye sus propios tipos: no reinstalar `@types/dompurify` (está deprecado).

## Comandos de Desarrollo

```bash
pnpm dev          # Servidor de desarrollo en http://localhost:3020
pnpm generate     # Generar sitio estático (SSG) con rutas dinámicas
pnpm preview      # Previsualizar build de producción
pnpm lint         # Verificar linting (ESLint)
pnpm lint:fix     # Corregir errores de linting
pnpm format       # Formatear código (Prettier)
pnpm format:check # Verificar formato sin modificar
pnpm test         # Tests en modo watch (Vitest)
pnpm test:run     # Tests una vez
pnpm test:coverage # Tests con cobertura
pnpm exec vue-tsc --noEmit  # Chequeo de tipos (typeCheck está desactivado en nuxt.config.ts)
```

### Verificación antes de commit

Ejecutar en este orden y dejar todo en verde:

1. `pnpm lint` — 0 errores (los warnings de `v-html`/`any`/`no-console` son tolerados si están justificados)
2. `pnpm exec vue-tsc --noEmit` — 0 errores de tipos
3. `pnpm test:run` — todos los tests pasan
4. Si el cambio afecta al build/SSG: `pnpm generate` (requiere la API accesible: usar siempre el backend local, `API_DOMAIN_URL=http://127.0.0.1:8000 API_BASE_URL=http://127.0.0.1:8000/api/v2`; nunca probar contra producción)

## Backend y Entorno de Desarrollo (Regla Estricta)

- **En desarrollo se prueba SIEMPRE contra el backend local** (`API_DOMAIN_URL=http://127.0.0.1:8000`, `API_BASE_URL=http://127.0.0.1:8000/api/v2`), a no ser que el usuario indique puntualmente lo contrario de forma explícita.
- **Si el backend local está apagado o no responde**: **AVISA AL USUARIO INMEDIATAMENTE**, pero **NUNCA TIRES CONTRA PRODUCCIÓN** (`api.raupulus.dev`). Queda terminantemente prohibido hacer fallback o consultar la API de producción por iniciativa propia.

## Variables de Entorno

Copiar `env.example` (desarrollo) o `env.example.production` (producción) a `.env`. Variables clave:

| Variable                   | Descripción                                                 |
| -------------------------- | ----------------------------------------------------------- |
| `APP_URL`                  | URL pública del sitio                                       |
| `APP_DOMAIN`               | Dominio del sitio                                           |
| `API_DOMAIN_URL`           | Dominio de la API Laravel                                   |
| `API_BASE_URL`             | URL base completa de la API (`/api/v2`)                     |
| `API_PATH_CONTACT`         | Ruta relativa del endpoint de contacto (`contact-messages`) |
| `CAPTCHA_SITE_KEY`         | Clave pública reCAPTCHA v3                                  |
| `CAPTCHA_SITE_PRIVATE_KEY` | Clave privada reCAPTCHA v3                                  |
| `GTAG_ID`                  | ID de Google Analytics                                      |

## Convenciones de Código

- Componentes Vue: siempre `<script setup lang="ts">`
- `v-for` siempre con `:key`; no combinar `v-if` y `v-for` en el mismo elemento (usar un `<template>` envolvente)
- Props con default de tipo Array/Object: usar función (`default: () => []`)
- No dejar `const props = defineProps(...)` si `props` no se usa en el script (usar `defineProps(...)` a secas)
- Las páginas (`pages/*.vue`) deben tener un único elemento raíz en el template
- Nombres de componentes: PascalCase (auto-importados por Nuxt)
- Composables: las funciones exportadas usan prefijo `use` (ej. `useProjectsData`), ubicados en `composables/`. Los nombres de archivo no siempre llevan prefijo `use` (ej. `projectsData.ts` exporta `useProjectsData()`)
- Tipos TypeScript: archivos dedicados en `types/`, sufijo `Type` (ej. `ContentType`). Subdirectorio `types/Platform/` para tipos de la plataforma
- Utils: funciones puras en `utils/`, auto-importadas por Nuxt
- SEO: cada página debe definir `useHead()` con title, description, keywords, og:_, twitter:_
- Sanitización HTML: usar `sanitizeHtml()` / `sanitizeRawHtml()` de `utils/sanitize.ts`
- API base: usar `useApiBase()` para resolver URL correcta según contexto (SSR/cliente/dev). En desarrollo, usa proxy `/_proxy/api/**` para evitar CORS
- Estado global: usar `useState()` de Nuxt (nunca variables globales mutables). Ver `composables/states.ts` como ejemplo
- Imágenes: usar `<NuxtImg>` con formatos webp, lazy loading y dimensiones explícitas. Excepción: imágenes remotas de la API que se cargan en cliente con dimensiones (tarjetas de proyecto) → `<img>` con la miniatura webp de la API (`imageUrl()`), porque en el build estático IPX reescribe la URL remota contra el dominio de la web
- Diseño: usar siempre los tokens Tailwind del design system (ver [docs/info/design-system.md](docs/info/design-system.md)). **Nunca** definir clases CSS globales con nombres de utilidades Tailwind (`.p-1`, `.text-primary`, ...) — sobreescriben el design system
- Responsive: todo elemento nuevo debe funcionar desde 320px; los `h1` de página escalan `text-4xl/5xl → sm:text-6xl → md:text-8xl`
- Accesibilidad: botones solo-icono con `aria-label`, `v-for` de elementos clicables como `<button>`/`<a>` reales, respetar `prefers-reduced-motion` (ya cubierto globalmente en `styles.css`)

## Reglas ESLint del Proyecto

Las reglas personalizadas están en `eslint.config.mjs` (flat config con Nuxt):

- `vue/multi-word-component-names`: desactivada (off)
- `vue/no-v-html`: advertencia (warn) — preferir `v-html` con contenido sanitizado
- `@typescript-eslint/no-explicit-any`: advertencia (warn)
- `no-console`: advertencia (warn), permitidos `console.warn` y `console.error`

## Estructura de Componentes

```
components/
├── Alert.vue, HeaderImage.vue, SpecializationBadge.vue, StackBadge.vue, StackBadgeHexagon.vue, Trajectory.vue
├── app/             # Header.vue, Footer.vue (layout principal)
├── btn/             # Generic.vue (botones reutilizables)
├── card/            # Project.vue, ProjectHorizontal.vue, ProjectVertical.vue, Skill.vue, Vertical.vue
├── content/
│   ├── contentPaginator.vue
│   └── blocks/      # Block*.vue — Bloques EditorJS (Paragraph, Header, Image, Code, List, Table, etc.)
├── form/            # Select.vue
├── grid/            # Projects.vue, Technologies.vue
├── icons/           # Iconos SVG: Earth, Github, Gitlab, Linkedin, Mastodon, Telegram, Twitch, Twitter, Youtube, etc.
└── modals/          # ImageSlide.vue, projectShow.vue, submitContact.vue
```

## Tests

- Framework: Vitest con `@nuxt/test-utils` y `happy-dom`
- Estructura: `tests/` refleja la estructura del proyecto (`tests/composables/`, `tests/utils/`, `tests/components/`)
- Convención de nombre: `<nombre>.test.ts` (ej. `sanitize.test.ts`, `projectsData.test.ts`)
- Ejecutar antes de commit: `pnpm test:run`

## Estructura de Navegación

| Ruta                    | Archivo                         | Descripción                |
| ----------------------- | ------------------------------- | -------------------------- |
| `/`                     | `pages/index.vue`               | Página principal / Landing |
| `/projects`             | `pages/projects/[...slugs].vue` | Listado de proyectos       |
| `/projects/:slug`       | (misma página, catch-all)       | Detalle de proyecto        |
| `/projects/:slug/:page` | (misma página, catch-all)       | Página de un proyecto      |
| `/blog`                 | `pages/blog.vue`                | Blog (en construcción)     |
| `/about`                | `pages/about.vue`               | Sobre mí + galería         |
| `/webs`                 | `pages/webs.vue`                | Sitios web creados         |
| `/social`               | `pages/social.vue`              | Redes sociales             |
| `/contact`              | `pages/contact.vue`             | Formulario de contacto     |
| `/privacy`              | `pages/privacy.vue`             | Política de privacidad     |

## Endpoints API Consumidos

| Endpoint                                                                                           | Método | Uso |
| -------------------------------------------------------------------------------------------------- | ------ | --- |
| Todas bajo `/api/v2` salvo que se indique. Envelope: `{ success, message, data, meta?, errors? }`. |

| Endpoint                                                           | Método | Uso                                                          |
| ------------------------------------------------------------------ | ------ | ------------------------------------------------------------ |
| `/platforms/portfolio`                                             | GET    | Ficha de la plataforma (tecnologías, redes, autor)           |
| `/platforms/portfolio/contents?type=project`                       | GET    | Listado paginado / búsqueda (`q`, `technology`) de proyectos |
| `/platforms/portfolio/contents/:slug?include=…&format=editorjs`    | GET    | Detalle de un proyecto (suma una visita: sólo en cliente)    |
| `/platforms/portfolio/contents/:slug/pages/:order?format=editorjs` | GET    | Página individual de un proyecto                             |
| `/platforms/portfolio/contents/:slug/pages`                        | GET    | Índice de páginas (prerender/sitemap, no suma visitas)       |
| `/sanctum/csrf-cookie` (fuera de `/api/v2`)                        | GET    | Obtener CSRF token                                           |
| `/{API_PATH_CONTACT}` → `/contact-messages`                        | POST   | Envío del formulario de contacto                             |
| `/cv/pdf` (fuera de `/api/v2`)                                     | GET    | Descarga del CV por defecto en PDF                           |

La web es de **sólo lectura**: el único POST es el formulario de contacto.

## ⚠️ Documentación técnica de módulos — OBLIGATORIO mantener actualizada

La documentación técnica de cada módulo se encuentra en `docs/info/`. **Es obligatorio actualizarla cuando se modifique un módulo existente o se cree uno nuevo.**

### Índice de módulos (`docs/info/`)

| Archivo                                                                  | Módulo                                                |
| ------------------------------------------------------------------------ | ----------------------------------------------------- |
| [README.md](docs/info/README.md)                                         | Índice general de módulos                             |
| [nuxt-config.md](docs/info/nuxt-config.md)                               | Configuración de Nuxt, módulos y variables de entorno |
| [layout-navegacion.md](docs/info/layout-navegacion.md)                   | Layout principal, Header y Footer                     |
| [pagina-home.md](docs/info/pagina-home.md)                               | Página principal (landing)                            |
| [pagina-proyectos.md](docs/info/pagina-proyectos.md)                     | Página de proyectos (listado, búsqueda, detalle)      |
| [pagina-about.md](docs/info/pagina-about.md)                             | Página "Sobre mí" con galería                         |
| [pagina-blog.md](docs/info/pagina-blog.md)                               | Página del blog (en construcción)                     |
| [pagina-contact.md](docs/info/pagina-contact.md)                         | Formulario de contacto con reCAPTCHA                  |
| [pagina-social.md](docs/info/pagina-social.md)                           | Página de redes sociales                              |
| [pagina-webs.md](docs/info/pagina-webs.md)                               | Página de sitios web creados                          |
| [pagina-privacy.md](docs/info/pagina-privacy.md)                         | Política de privacidad                                |
| [pagina-cookies.md](docs/info/pagina-cookies.md)                         | Política de cookies y panel de preferencias           |
| [pagina-legal.md](docs/info/pagina-legal.md)                             | Aviso legal y condiciones de uso                      |
| [composables.md](docs/info/composables.md)                               | Composables (lógica reutilizable)                     |
| [types.md](docs/info/types.md)                                           | Sistema de tipos TypeScript                           |
| [componentes-ui.md](docs/info/componentes-ui.md)                         | Componentes UI reutilizables                          |
| [componentes-content-blocks.md](docs/info/componentes-content-blocks.md) | Bloques de contenido (EditorJS)                       |
| [componentes-icons.md](docs/info/componentes-icons.md)                   | Componentes de iconos SVG                             |
| [componentes-modals.md](docs/info/componentes-modals.md)                 | Componentes modales                                   |
| [utils.md](docs/info/utils.md)                                           | Utilidades (apiClient, sanitize, TechnologyUtils)     |
| [plugins-middleware.md](docs/info/plugins-middleware.md)                 | Plugins y middleware                                  |
| [design-system.md](docs/info/design-system.md)                           | Design system, CSS y TailwindCSS                      |
| [seo-sitemap.md](docs/info/seo-sitemap.md)                               | SEO, metatags y sitemap                               |
| [deploy-cicd.md](docs/info/deploy-cicd.md)                               | Despliegue, scripts y CI/CD                           |

### Reglas de actualización de `docs/info/`

1. **Al modificar un módulo existente** (nuevos campos, nuevas relaciones, cambios en lógica, nuevas rutas, etc.), actualizar el archivo `.md` correspondiente en `docs/info/` reflejando los cambios.

2. **Al crear un módulo nuevo**, crear un nuevo archivo `.md` en `docs/info/` con la misma estructura (resumen, archivos, campos, relaciones, rutas, etc.) y añadirlo al índice en `docs/info/README.md` y a la tabla de este archivo.

3. **Al eliminar un módulo**, eliminar el archivo `.md` correspondiente y quitarlo de los índices.

4. Cada archivo en `docs/info/` debe contener:
    - Resumen breve del módulo (1-2 frases) al inicio
    - Archivos principales involucrados (modelo, controlador, resource, vistas, etc.)
    - Campos del modelo con tipos y descripciones
    - Relaciones, scopes y métodos relevantes
    - Rutas (web y API) si aplica
    - Configuración si aplica

## Información de Contacto (Norma Estricta)

El único correo electrónico visible para fines públicos es **public@raupulus.dev**.
Queda terminantemente prohibido publicar o hacer visible el correo anterior (la cuenta personal de gmail) en ningún archivo del código, documentación, o configuraciones.
