# Composables

Lógica reutilizable del proyecto encapsulada en composables de Nuxt. Todos se auto-importan gracias a la convención de directorio `composables/`.

## Índice

| Archivo                    | Exporta                                                                                             | Descripción                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `projectsData.ts`          | `useProjectsData()`, `projectsDataSearch()`, `useGetProjectBySlug()`, `usefetchProjectsPaginated()` | Gestión completa de datos de proyectos                                            |
| `fetchPageData.ts`         | `usePageData()`, `getPageData()`, `setCurrentPage()`                                                | Página actual del proyecto abierto en el modal                                    |
| `fetchPostData.ts`         | `fetchPost()`, `fetchCsrfToken()`                                                                   | Peticiones POST con CSRF token                                                    |
| `platformData.ts`          | `usePlatformData()`, `getPlatformData()`                                                            | Datos globales de la plataforma                                                   |
| `states.ts`                | `useScrollDisabled()`                                                                               | Estado global para bloqueo de scroll                                              |
| `useApiBase.ts`            | `useApiBase()`, `useApiDomain()`                                                                    | URL base / dominio de la API según contexto de ejecución                          |
| `useGoogleRecaptcha.ts`    | `useGoogleRecaptcha()`, `RecaptchaAction`                                                           | Wrapper de Google reCAPTCHA v3                                                    |
| `useModalAccessibility.ts` | `useModalAccessibility(isOpen, modalRef)`                                                           | Gestión de accesibilidad modal (bloqueo de scroll, trampa de foco y restauración) |

Todos consumen la **API V2** (`/api/v2`). Las respuestas llegan en el envelope
`{ success, message, data, meta?, errors? }` (`ApiResponseType<T>`); el slug de la
plataforma es la constante `PLATFORM_SLUG = 'portfolio'` (`utils/ContentUtils.ts`).

---

## `useApiBase()` / `useApiDomain()` — Resolución de URL

`useApiBase()` devuelve la URL base (`.../api/v2`) según el contexto:

| Contexto                   | URL devuelta                                                                            |
| -------------------------- | --------------------------------------------------------------------------------------- |
| **Server-side** (SSR/SSG)  | `runtimeConfig.public.api.base` (URL directa, sin CORS)                                 |
| **Client-side desarrollo** | `/_proxy` + ruta de `API_BASE_URL` (ej. `/_proxy/api/v2`), proxy local para evitar CORS |
| **Client-side producción** | `runtimeConfig.public.api.base` (API tiene CORS configurado)                            |

`useApiDomain()` devuelve el dominio de la API (sin `/api/v2`) con el mismo criterio
(`/_proxy` en cliente de desarrollo), para rutas fuera del grupo `api` como
`/sanctum/csrf-cookie`.

---

## `usePlatformData()` — Datos de plataforma

Carga la ficha de la plataforma desde `GET /platforms/portfolio`. Se cachea en `useState('platformData')` y no recarga si ya hay datos.

**Retorna**: `Ref<PlatformDataType | undefined>` con:

- `technologies: TechnologyType[]` — tecnologías de los proyectos publicados (filtro de proyectos)
- `contents: ContentResumeType` — total de contenidos publicados y por tipo
- `pages: ContentPageResumeType[]` — contenidos de tipo `page` de la plataforma
- `author?: AuthorType` — autor de la plataforma con sus redes
- `social_networks?: PlatformSocialNetworkType` — redes sociales de la plataforma

**`getPlatformData()`**: getter síncrono del estado cacheado sin llamar a la API.

---

## `useProjectsData()` — Datos de proyectos

Composable principal para el listado de proyectos con paginación incremental.
Endpoint: `GET /platforms/portfolio/contents?type=project&page=&per_page=`.

### Estado (useState)

| Key                     | Tipo                                               | Descripción                                               |
| ----------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| `'projectsData'`        | `{ contents?: ContentType[], meta?: ApiMetaType }` | Proyectos cargados y paginación de la API                 |
| `'projectsCurrentPage'` | `number`                                           | Página actual                                             |
| `'projectsHasMore'`     | `boolean`                                          | Si hay más páginas (`meta.current_page < meta.last_page`) |
| `'projectsLoading'`     | `boolean`                                          | Si está cargando                                          |

### Retorna

```typescript
{
  datas: Ref<{ contents?: ContentType[], meta?: ApiMetaType }>,
  hasMorePages: Ref<boolean>,
  isLoading: Ref<boolean>,
  fetchNextPage: (perPage?: number) => Promise<void>,
}
```

### `fetchNextPage(perPage = 20)`

Carga la siguiente página y concatena resultados. Incrementa `currentPage` si hay más.

### `projectsDataSearch(params)`

Búsqueda con filtros `{ search?, technology? }`, que se envían a la API como `q` (texto en título o extracto) y `technology` (slug). Los filtros vacíos no se envían. Limpia datos existentes y carga todas las páginas de resultados (25 por página); desactiva "Cargar más".

### `useGetProjectBySlug(slug)`

Obtiene un proyecto desde `GET /platforms/portfolio/contents/:slug?include=technologies,metadata,taxonomies&format=editorjs`: datos, índice de páginas sin texto (`pages`), primera página con su texto (`first_page`), tecnologías, metadatos y taxonomías. Prepara metadata (limita a 4 enlaces con prioridad).

> Cada petición al detalle **suma una visita** en la API: sólo se llama al abrir un proyecto en el cliente, nunca en el prerender.

### `usefetchProjectsPaginated()`

Obtiene **todos** los proyectos paginando hasta el final (`per_page=100`) y, para cada uno con páginas, su índice desde `GET /platforms/portfolio/contents/:slug/pages?limit=100` (no suma visitas). Rellena `project.pages` para generar las rutas `/projects/:slug/:page`. Usado en `nuxt.config.ts` para prerender y sitemap (se ejecuta en Node.js, sin proxy ni auto-imports). Si la API no responde, avisa y devuelve `[]` sin romper el build.

### Preparación de datos

- `prepareDataMetadata()`: prioriza y limita a 4 enlaces de metadata con orden: `web`, `youtube_channel`, `youtube_video`, `youtube`, `gitlab`, `github`, `twitter`, `linkedin`, `mastodon`, `twitch`, `telegram_channel`
- Las entradas `youtube_channel` y `youtube_video` se unifican bajo la key `youtube`

---

## `usePageData()` — Página actual del modal

Carga una página de un proyecto por su número desde `GET /platforms/portfolio/contents/:slug/pages/:order?format=editorjs` y la deja en el estado compartido `useState('projectCurrentPage')`, que lee el modal `ModalsProjectShow`.

- `body` llega como objeto Editor.js `{ time, blocks, version }`; `normalizePage()` garantiza que `body.blocks` sea siempre un array.
- **`setCurrentPage(page)`**: fija la página actual sin petición (se usa con `first_page` del detalle). `undefined` la limpia.
- **`getPageData()`**: getter síncrono del estado.

---

## `fetchPost()` — Peticiones POST

Envía peticiones POST con CSRF token automático:

1. Lee cookie `XSRF-TOKEN`
2. Si no existe → `fetchCsrfToken()` la obtiene de `GET {dominio API}/sanctum/csrf-cookie` (fuera de `/api/v2`; en desarrollo por el proxy `/_proxy/sanctum/**`)
3. Envía POST con headers: `Accept`, `Content-Type`, `X-XSRF-TOKEN`
4. Mode: `cors`, credentials: `include`
5. Devuelve el envelope V2 (`ApiResponseType`) también en errores 4xx; sólo lanza excepción si no hay JSON

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

---

## `useModalAccessibility()` — Accesibilidad para diálogos y modales (WCAG 2.1 AA)

Composable que asegura el cumplimiento de accesibilidad en elementos de diálogo:

1. **Bloqueo de scroll**: cuando `isOpen` es `true`, bloquea el desplazamiento del fondo (`document.body.style.overflow = 'hidden'`) y lo restaura al cerrarse.
2. **Trampa de foco (Focus Trap)**: intercepta la navegación con tecla `Tab` / `Shift+Tab` para mantener el foco exclusivamente dentro de los elementos interactivos del modal.
3. **Restauración de foco**: al abrir el modal guarda el elemento que tenía el foco activo y, tras cerrarse, devuelve el foco automáticamente a dicho elemento.

---

## Relaciones con otros módulos

- → [types.md](./types.md): `ApiResponseType`, `ApiMetaType`, `ContentType`, `ContentPageType`, `PlatformDataType`, `MetadataType`, `BlocksType`
- → [utils.md](./utils.md): `ContentUtils.ts` (`PLATFORM_SLUG`, `imageUrl`, `hasNextPage`, `normalizePage`, `buildProjectMetatags`…)
- → [pagina-proyectos.md](./pagina-proyectos.md): consumidor principal de `useProjectsData()`
- → [pagina-contact.md](./pagina-contact.md): consumidor de `fetchPost()` y `useGoogleRecaptcha()`
- → [layout-navegacion.md](./layout-navegacion.md): `usePlatformData()` y `useScrollDisabled()` usados en app.vue
- → [nuxt-config.md](./nuxt-config.md): `usefetchProjectsPaginated()` usado en hooks de prerender y sitemap
