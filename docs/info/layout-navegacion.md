# Layout y Navegación

Layout principal que envuelve todas las páginas con header fijo, contenido y footer. Incluye control de cookies y gestión de scroll.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `app.vue` | Root component: SEO global, scroll disable, carga de datos de plataforma, cookies/analytics |
| `layouts/default.vue` | Layout por defecto: estructura Header → Content → Footer → CookieControl |
| `components/app/Header.vue` | Barra de navegación fija con menú responsive |
| `components/app/Footer.vue` | Pie de página con copyright dinámico y enlaces legales |

## `app.vue` — Root Component

### Responsabilidades

1. **SEO global**: `useSeoMeta()` y `useHead()` con metatags por defecto (og, twitter, favicon, lang)
2. **Scroll disable**: observa el estado `useScrollDisabled()` y añade/quita la clase `disable-scroll` en el body (usado por modales)
3. **Carga de plataforma**: en `onNuxtReady`, ejecuta `usePlatformData()` para cargar datos globales (tecnologías, redes sociales)
4. **Cookies/Analytics**: usa `useCookieControl()` para detectar consentimiento de Google Analytics y, si se acepta, actualiza el consent mode con `useGtag()`

### Composables utilizados

- `useScrollDisabled()` — estado global booleano para bloquear scroll
- `usePlatformData()` — carga datos de la plataforma desde la API
- `useCookieControl()` — gestión de consentimiento de cookies
- `useGtag()` — Google Analytics

## `layouts/default.vue` — Layout Default

### Estructura del template

```
<div id="app">
  <AppHeader />          ← Header fijo
  <main id="app-box-content" class="flex-1 pt-20">
    <slot />             ← Contenido de la página
  </main>
  <AppFooter />          ← Footer
  <CookieControl />      ← Banner de cookies
</div>
```

- El contenido tiene `padding-top: 80px` para compensar el header fijo
- `min-height: calc(100vh - 80px)` para que el footer quede abajo

## `AppHeader` — Barra de Navegación

### Características

- **Fija** en la parte superior (`fixed top-0 w-full z-50`)
- **Efecto glass**: `backdrop-blur-xl` con opacidad variable según scroll
- **Responsive**: menú hamburguesa en móvil con transición `slide-down`
- **Indicador de ruta activa**: `border-b-2 border-primary` en el enlace activo

### Rutas de navegación

```typescript
const navLinks: NavLink[] = [
  { to: '/', label: 'Inicio' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'Sobre Mí' },
  { to: '/webs', label: 'Webs' },
  { to: '/social', label: 'Social' },
  { to: '/contact', label: 'Contacto' },
]
```

### Lógica destacada

- `isActiveRoute(path)`: detecta ruta activa; para `/` usa igualdad exacta, para el resto `startsWith`
- `isScrolled`: ref booleana que cambia al pasar 20px de scroll

## `AppFooter` — Pie de Página

- Copyright con año dinámico (`new Date().getFullYear()`)
- Enlaces a: Política de Privacidad (`/privacy`), Contacto (`/contact`)
- Indicador visual "Sistema Activo" con dot pulsante

## Relaciones con otros módulos

- → [composables.md](./composables.md): `useScrollDisabled()`, `usePlatformData()`
- → [seo-sitemap.md](./seo-sitemap.md): `useSeoMeta()`, `useHead()` en app.vue
- → [plugins-middleware.md](./plugins-middleware.md): `CookieControl` component, scroll-to-top middleware
- → [design-system.md](./design-system.md): clases de design system (font-headline, bg-background, text-primary, etc.)
