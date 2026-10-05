# Layout y Navegación

Layout principal que envuelve todas las páginas con header fijo, contenido y footer. Incluye control de cookies, accesibilidad de navegación y gestión de saltos de contenido.

## Archivos principales

| Archivo                     | Rol                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `app.vue`                   | Root component: SEO global, canonicals dinámicos con barra final, datos de plataforma, cookies y analítica con Consent Mode v2 |
| `layouts/default.vue`       | Layout por defecto: enlace "Saltar al contenido" → Header → Main (`#app-box-content`) → Footer → CookieControl                 |
| `components/app/Header.vue` | Barra de navegación fija con menú responsive accesible (Esc, focus return)                                                     |
| `components/app/Footer.vue` | Pie de página con copyright hidratación-segura y enlaces legales completos                                                     |

## `app.vue` — Root Component

### Responsabilidades

1. **SEO global**: `useSeoMeta()` y `useHead()` con metatags absolutos (og, twitter, favicon, lang, color-scheme dark).
2. **Canonical y og:url dinámicos**: calculados reactivamente respetando la convención de barra final (`/`).
3. **Carga de plataforma**: en `onNuxtReady`, ejecuta `usePlatformData()` para cargar datos globales (tecnologías, redes sociales).
4. **Cookies/Analytics**: usa `useCookieControl()` con Consent Mode v2 manual: solo concede `analytics_storage` tras consentimiento explícito y purga cookies `_ga*` al revocar.

### Composables utilizados

- `usePlatformData()` — carga datos de la plataforma desde la API
- `useCookieControl()` — gestión de consentimiento de cookies
- `useGtag()` — Google Analytics con Consent Mode v2

## `layouts/default.vue` — Layout Default

### Estructura del template

```html
<div id="app">
    <a href="#app-box-content" class="sr-only focus:not-sr-only ...">Saltar al contenido principal</a>
    <AppHeader /> ← Header fijo
    <main id="app-box-content" class="flex-1 pt-20"><slot /> ← Contenido de la página</main>
    <AppFooter /> ← Footer <CookieControl /> ← Banner de cookies
</div>
```

- Enlace accesible de salto al contenido principal como primer elemento enfocable (WCAG 2.4.1).
- `min-height: calc(100dvh - 80px)` utilizando viewport dinámico para evitar saltos en móviles.

## `AppHeader` — Barra de Navegación

### Características

- **Fija** en la parte superior (`fixed top-0 w-full z-50`)
- **Efecto glass**: `backdrop-blur-xl` con opacidad variable según scroll
- **Accesibilidad**: botón móvil con `aria-expanded` y `aria-controls`; cierre con tecla `Escape` y retorno de foco automático al botón.
- **Rutas con barra final**: coinciden con la configuración canónica del sitio.
- **Blog excluido de la barra principal**: reservado hasta publicación de artículos reales.

### Rutas de navegación

```typescript
const navLinks: NavLink[] = [
    { to: '/', label: 'Inicio' },
    { to: '/projects/', label: 'Proyectos' },
    { to: '/about/', label: 'Sobre Mí' },
    { to: '/webs/', label: 'Webs' },
    { to: '/social/', label: 'Social' },
];
```

## `AppFooter` — Pie de Página

- Copyright con año fijado en compilación e hidratación cliente reactiva segura (`onMounted`) para evitar discrepancias SSR/SSG.
- Enlaces legales: `/privacy/`, `/cookies/`, `/legal/`, `/contact/`.
- Enlace al repositorio público de código fuente en GitLab.

## Tests unitarios asociados

- `tests/components/app/Header.test.ts`: verifica marca, navegación principal, enlaces canónicos y atributos WCAG del botón móvil.
- `tests/components/app/Footer.test.ts`: verifica rol `contentinfo`, copyright y enlaces legales.

## Relaciones con otros módulos

- → [composables.md](./composables.md): `usePlatformData()`, `useProjectsData()`
- → [seo-sitemap.md](./seo-sitemap.md): metatags y trailing slashes
- → [plugins-middleware.md](./plugins-middleware.md): `CookieControl`, scroll-to-top middleware
- → [design-system.md](./design-system.md): diseño Silicon Architect
