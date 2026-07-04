# Utilidades

Funciones de utilidad ubicadas en `utils/`. Se auto-importan en toda la aplicación gracias a la convención de Nuxt.

## Índice

| Archivo | Funciones exportadas | Descripción |
|---------|---------------------|-------------|
| `utils/apiClient.ts` | `apiGet()`, `apiPost()`, `apiFetchRaw()` | Cliente API centralizado |
| `utils/sanitize.ts` | `sanitizeHtml()`, `sanitizeRawHtml()` | Sanitización HTML contra XSS |
| `utils/TechnologyUtils.ts` | `getTechnologyBySlug()` | Búsqueda de tecnologías en datos de plataforma |

---

## `apiClient.ts` — Cliente API centralizado

Cliente para comunicación con `api.raupulus.dev`. Tres modos de uso según contexto.

### `apiGet<T>(path: string): Promise<T | null>`

GET request usando contexto de Nuxt (runtimeConfig). Para composables y páginas.

```typescript
const data = await apiGet<MyType>('/endpoint');
```

### `apiPost<T>(path: string, body: Record<string, unknown>): Promise<T | null>`

POST con CSRF token automático. Si no existe el token, lo obtiene de `/auth/csrf-cookie` antes de enviar.

- Mode: `cors`
- Credentials: `include`
- Headers: `Accept`, `Content-Type`, `X-XSRF-TOKEN`

### `apiFetchRaw<T>(fullUrl: string): Promise<T | null>`

Fetch raw sin contexto de Nuxt. Para usar en `nuxt.config.ts` (hooks de prerender, sitemap) donde `useRuntimeConfig()` no está disponible.

```typescript
const data = await apiFetchRaw<MyType>('https://api.raupulus.dev/api/v1/endpoint');
```

### Función interna `fetchCsrfTokenInternal(apiBase)`

Obtiene el CSRF token desde `/auth/csrf-cookie` con `credentials: 'include'`.

---

## `sanitize.ts` — Sanitización HTML

Usa `isomorphic-dompurify` (funciona en SSR y cliente) para prevenir XSS.

### `sanitizeHtml(html: string): string`

Sanitización estricta. Tags permitidos:

```
p, br, b, i, em, strong, a, ul, ol, li, h1-h6, blockquote, code, pre,
span, div, img, figure, figcaption, table, thead, tbody, tr, th, td,
mark, del, ins, sub, sup, hr, dl, dt, dd
```

Atributos permitidos: `href, target, rel, src, alt, title, class, id, width, height, style, colspan, rowspan`.

**Uso**: bloques de contenido estándar (paragraph, header, quote, list, etc.)

### `sanitizeRawHtml(html: string): string`

Sanitización permisiva. Añade tags adicionales:

```
iframe, video, audio, source
```

Atributos adicionales: `allow, allowfullscreen, frameborder, scrolling, autoplay, controls, loop, muted`.

**Uso**: bloque `raw` de EditorJS (HTML confiable del backend).

**⚠️ Precaución**: usar solo con contenido de confianza.

---

## `TechnologyUtils.ts` — Búsqueda de tecnologías

### `getTechnologyBySlug(slug: string): TechnologyType | undefined`

Busca una tecnología por slug en los datos de la plataforma cacheados.

```typescript
const tech = getTechnologyBySlug('laravel');
// → { name: 'Laravel', slug: 'laravel', urlImageSmall: '...', color: '#c54b4b' }
```

Depende de `getPlatformData()` del composable `platformData.ts`.

## Dependencias externas

| Paquete | Versión | Uso |
|---------|---------|-----|
| `isomorphic-dompurify` | ^3.7.1 | Sanitización HTML isomórfica |

## Relaciones con otros módulos

- → [composables.md](./composables.md): `apiClient.ts` complementa a `fetchPostData.ts`; `getTechnologyBySlug()` usa `getPlatformData()`
- → [componentes-content-blocks.md](./componentes-content-blocks.md): bloques usan `sanitizeHtml()` y `sanitizeRawHtml()`
- → [pagina-proyectos.md](./pagina-proyectos.md): `getTechnologyBySlug()` para filtro de tecnologías
