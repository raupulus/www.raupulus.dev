# Design System — "Silicon Architect"

Sistema de diseño oscuro inspirado en Material Design 3 con estética de circuitos y tecnología. Tipografías técnicas, paleta de colores con tokens semánticos y TailwindCSS como framework CSS.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `tailwind.config.ts` | Configuración de TailwindCSS con tokens de color y tipografías (única config; el duplicado `tailwind.config.js` fue eliminado) |
| `assets/css/vars.css` | Variables CSS custom |
| `assets/css/fonts.css` | Declaraciones de fuentes locales (Open Sans) |
| `assets/css/theme.css` | Tokens de tema y clases de design system |
| `assets/css/styles.css` | Estilos globales, componentes reutilizables y utilidades CSS |
| `assets/css/tailwind.css` | Archivo de entrada de TailwindCSS (@tailwind directives) |

## Fuentes tipográficas

| Familia | Uso | Clase Tailwind | Carga |
|---------|-----|----------------|-------|
| **Space Grotesk** | Headlines y labels | `font-headline`, `font-label` | **Self-hosted** via `@nuxt/fonts` (descarga en build, sirve desde `/_fonts/`) |
| **Plus Jakarta Sans** | Texto body | `font-body` | **Self-hosted** via `@nuxt/fonts` |

Ya no hay peticiones a Google Fonts: se eliminaron los `<link>` a `fonts.googleapis.com`, la fuente Open Sans local sin uso (`assets/fonts/`, `fonts.css`) y la fuente de iconos Material Symbols.

## Iconografía: `UiMaterialIcon` (SVG self-hosted)

Los iconos Material Symbols se renderizan como **SVG inline** con `components/ui/MaterialIcon.vue` en lugar de la fuente de iconos (que pesaba cientos de KB para ~40 iconos):

```vue
<UiMaterialIcon name="memory" class="text-primary text-4xl" />
<UiMaterialIcon :name="network.icon" class="text-sm" />
```

- Los SVG viven en `assets/icons/material/<nombre>.svg` y se empaquetan en build (`import.meta.glob` raw)
- El tamaño se hereda del `font-size` (por defecto 24px con especificidad 0) y el color de `currentColor`, así que las utilidades `text-*` funcionan igual que con la fuente
- Para añadir un icono nuevo: `curl -sf "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/<nombre>/default/24px.svg" -o assets/icons/material/<nombre>.svg`

## Paleta de colores (tokens TailwindCSS)

Esquema oscuro con tokens Material Design 3:

### Primarios (azul)

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#a3c9ff` | Acento principal, CTAs, headings |
| `primary-container` | `#3272b8` | Backgrounds de contenedores primarios |
| `on-primary` | `#00315c` | Texto sobre primary |
| `on-primary-container` | `#f2f5ff` | Texto sobre primary-container |

### Secundarios (naranja)

| Token | Hex | Uso |
|-------|-----|-----|
| `secondary` | `#ffb691` | Acento secundario, labels |
| `secondary-container` | `#ea6b15` | Backgrounds secundarios |
| `on-secondary` | `#552100` | Texto sobre secondary |

### Terciarios (cian)

| Token | Hex | Uso |
|-------|-----|-----|
| `tertiary` | `#4cd6ff` | Acento tecnológico, enlaces, indicadores |
| `tertiary-container` | `#007a96` | Backgrounds terciarios |
| `on-tertiary` | `#003543` | Texto sobre tertiary |

### Superficies (oscuras)

| Token | Hex | Uso |
|-------|-----|-----|
| `background` / `surface` | `#091421` | Fondo principal |
| `surface-container-lowest` | `#050f1c` | Nivel más profundo |
| `surface-container-low` | `#121c2a` | Nivel bajo |
| `surface-container` | `#16202e` | Nivel medio |
| `surface-container-high` | `#212b39` | Nivel alto (tarjetas) |
| `surface-container-highest` | `#2b3544` | Nivel más elevado |
| `on-surface` | `#d9e3f6` | Texto principal |
| `on-surface-variant` | `#c1c7d2` | Texto secundario |

### Otros

| Token | Hex | Uso |
|-------|-----|-----|
| `outline` | `#8b919c` | Bordes y texto terciario |
| `outline-variant` | `#414751` | Bordes sutiles, separadores |
| `error` | `#ffb4ab` | Errores, validaciones fallidas |

## Border Radius personalizado

| Token | Valor | Uso |
|-------|-------|-----|
| `DEFAULT` | `0.125rem` | Bordes mínimos |
| `lg` | `0.25rem` | Bordes ligeros |
| `xl` | `0.5rem` | Tarjetas, contenedores |
| `full` | `0.75rem` | Botones, badges |

## Clases CSS custom

| Clase | Definida en | Efecto |
|-------|-------------|--------|
| `.circuit-pattern` | `theme.css` | Patrón de fondo tipo circuito PCB |
| `.glass-panel` | `theme.css` | Efecto glassmorphism con blur y transparencia |
| `.disable-scroll` | `app.vue` (global) | Bloquea scroll del body (para modales) |
| `.box-privacy` | `pages/privacy.vue` (scoped) | Maquetación de la política de privacidad |

## ⚠️ Regla: no crear utilidades CSS con nombres de Tailwind

`assets/css/styles.css` se carga **después** del CSS de Tailwind, por lo que cualquier clase global con el mismo nombre que una utilidad de Tailwind (`.p-1`, `.m-1`, `.text-primary`, `.bg-primary`, `.font-bold`, `.w-1`, `.text-white`, ...) la sobreescribe con valores distintos y rompe el design system en toda la web. La plantilla antigua incluía un mini-framework de utilidades con esta colisión y fue eliminado; no reintroducirlo. `styles.css` solo contiene ahora el bloque `prefers-reduced-motion` (accesibilidad).

Las variables legacy de `vars.css` (`--primary: #3272B8`, `--gray`, `--yellow`, ...) siguen existiendo solo porque los componentes antiguos (`card/Project.vue`, `form/Select.vue`, bloques EditorJS...) las usan en estilos scoped. No usarlas en diseño nuevo: usar siempre los tokens Tailwind.

## Accesibilidad y responsive

- `prefers-reduced-motion: reduce` desactiva animaciones y transiciones globalmente (`styles.css`)
- Breakpoints estándar de Tailwind (`sm` 640px, `md` 768px, `lg` 1024px); los `h1` de página escalan `text-4xl/5xl → sm:text-6xl → md:text-8xl`
- Contraste: `on-surface` (#d9e3f6) sobre `background` (#091421) ≈ 14:1; `on-primary` (#00315c) solo debe usarse sobre `primary`/gradientes primarios, nunca sobre `primary-container` solo
- La navegación móvil (hamburguesa) usa `aria-expanded`/`aria-controls` en `AppHeader`

## Safelist de TailwindCSS

Clases que se preservan aunque no aparezcan en el template estático:

```
hidden, md:flex, md:block, md:hidden, lg:flex, lg:block, lg:hidden,
lg:grid-cols-12, lg:col-span-8, lg:col-span-4, md:flex-row,
md:text-8xl, md:text-xl, md:grid-cols-2, lg:grid-cols-3, lg:grid-cols-4
```

## Uso de Material Symbols

Iconos via `<span class="material-symbols-outlined">icon_name</span>`. Pesos configurados 100-700, fill 0-1.

Ejemplos frecuentes: `memory`, `hub`, `dns`, `terminal`, `code`, `search`, `close`, `arrow_forward`, `north_east`, `check_circle`, `favorite`, `bolt`, `star`, `construction`, etc.

## Relaciones con otros módulos

- → [nuxt-config.md](./nuxt-config.md): CSS importados en `css[]`, fuentes en `app.head.link`
- → [layout-navegacion.md](./layout-navegacion.md): Header usa colores explícitos `#091421`
- Todos los componentes y páginas usan estos tokens
