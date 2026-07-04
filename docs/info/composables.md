# Composables

Lógica reutilizable del proyecto encapsulada en composables de Nuxt. Todos se auto-importan gracias a la convención de directorio `composables/`.

## Índice

| Archivo | Exporta | Descripción |
|---------|---------|-------------|
| `projectsData.ts` | `useProjectsData()`, `projectsDataSearch()`, `useGetProjectBySlug()`, `usefetchProjectsPaginated()` | Gestión completa de datos de proyectos |
| `fetchPageData.ts` | `usePageData()`, `getPageData()` | Carga páginas individuales de un proyecto |
| `fetchPostData.ts` | `fetchPost()`, `fetchCsrfToken()` | Peticiones POST con CSRF token |
| `platformData.ts` | `usePlatformData()`, `getPlatformData()` | Datos globales de la plataforma |
| `states.ts` | `useScrollDisabled()` | Estado global para bloqueo de scroll |
| `useApiBase.ts` | `useApiBase()` | URL base de API según contexto de ejecución |
| `useGoogleRecaptcha.ts` | `useGoogleRecaptcha()`, `RecaptchaAction` | Wrapper de Google reCAPTCHA v3 |

---

## `useApiBase()` — Resolución de URL base

Devuelve la URL base correcta según el contexto:

| Contexto | URL devuelta |
|----------|-------------|
| **Server-side** (SSR/SSG) | `runtimeConfig.public.api.base` (URL directa, sin CORS) |
| **Client-side desarrollo** | `/_proxy/api/v1` (proxy local para evitar CORS) |
| **Client-side producción** | `runtimeConfig.public.api.base` (API tiene CORS configurado) |

---

## `usePlatformData()` — Datos de plataforma

Carga datos globales desde `GET /platform/portfolio/info`. Se cachea en `useState('platformData')` y no recarga si ya hay datos.

**Retorna**: `Ref<PlatformDataType | undefined>` con:
- `technologies: TechnologyType[]` — tecnologías disponibles para filtros
- `contents: ContentResumeType` — resumen de contenidos
- `pages: ContentPageResumeType` — resumen de páginas
- `social_networks?: PlatformSocialNetworkType` — redes sociales del autor

**`getPlatformData()`**: getter síncrono del estado cacheado sin llamar a la API.

---

## `useProjectsData()` — Datos de proyectos

Composable principal para el listado de proyectos con paginación incremental.

### Estado (useState)

| Key | Tipo | Descripción |
|-----|------|-------------|
| `'projectsData'` | `ResponseContentType` | Datos de proyectos |
| `'projectsCurrentPage'` | `number` | Página actual |
| `'projectsHasMore'` | `boolean` | Si hay más páginas |
| `'projectsLoading'` | `boolean` | Si está cargando |

### Retorna

```typescript
{
  datas: Ref<ResponseContentType>,      // { pagination?, search_params?, contents? }
  hasMorePages: Ref<boolean>,
  isLoading: Ref<boolean>,
  fetchNextPage: (quantity?: number) => Promise<void>,
}
```

### `fetchNextPage(quantity = 20)`

Carga la siguiente página y concatena resultados. Incrementa `currentPage` si hay más.

### `projectsDataSearch(params)`

Búsqueda con filtros. Limpia datos existentes, carga todas las páginas de resultados en un while loop (15 por página).

### `useGetProjectBySlug(slug)`

Obtiene un proyecto por slug desde `GET /content/portfolio/:slug/get`. Prepara metadata (limita a 4 enlaces con prioridad).

### `usefetchProjectsPaginated()`

Obtiene **todos** los proyectos paginando hasta el final. Usado en `nuxt.config.ts` para prerender y sitemap (se ejecuta en Node.js, sin proxy).

### Preparación de datos

- `prepareDataMetadata()`: prioriza y limita a 4 enlaces de metadata con orden: `web`, `youtube_channel`, `youtube_video`, `youtube`, `gitlab`, `github`, `twitter`, `linkedin`, `mastodon`, `twitch`, `telegram_channel`
- Las entradas `youtube_channel` y `youtube_video` se unifican bajo la key `youtube`

---

## `usePageData()` — Páginas de contenido

Carga una página individual de un proyecto desde `GET /content/:slug/get/page/:order/json`.

- Cachea en `useState('page-${contentSlug}-${pageOrder}')`
- El campo `content` llega como string JSON y se parsea a `BlocksType`

**`getPageData(contentSlug, pageOrder)`**: getter síncrono del estado cacheado.

---

## `fetchPost()` — Peticiones POST

Envía peticiones POST con CSRF token automático:

1. Lee cookie `XSRF-TOKEN`
2. Si no existe → `fetchCsrfToken()` la obtiene de `GET /auth/csrf-cookie`
3. Envía POST con headers: `Accept`, `Content-Type`, `X-XSRF-TOKEN`
4. Mode: `cors`, credentials: `include`

---

## `useScrollDisabled()` — Estado de scroll

`useState<boolean>('scrollDisabled', () => false)` — estado global booleano para bloquear el scroll del body. Observado en `app.vue` para añadir/quitar clase CSS `disable-scroll`.

---

## `useGoogleRecaptcha()` — reCAPTCHA v3

Wrapper sobre `vue-recaptcha-v3`:

```typescript
class RecaptchaAction {
  static readonly login = new RecaptchaAction('login');
  static readonly contact = new RecaptchaAction('contact');
}
```

**`executeRecaptcha(action)`**: espera a que reCAPTCHA cargue, ejecuta con la acción indicada y devuelve `{ token }`.

## Relaciones con otros módulos

- → [types.md](./types.md): `ContentType`, `ContentPageType`, `PlatformDataType`, `MetadataType`, `PaginationType`, `SearchParamsType`, `BlocksType`
- → [pagina-proyectos.md](./pagina-proyectos.md): consumidor principal de `useProjectsData()`
- → [pagina-contact.md](./pagina-contact.md): consumidor de `fetchPost()` y `useGoogleRecaptcha()`
- → [layout-navegacion.md](./layout-navegacion.md): `usePlatformData()` y `useScrollDisabled()` usados en app.vue
- → [nuxt-config.md](./nuxt-config.md): `usefetchProjectsPaginated()` usado en hooks de prerender y sitemap
