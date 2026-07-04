# Página de Redes Sociales

Listado de redes sociales con layout bento grid adaptativo (tarjetas large, medium y small agrupadas en filas).

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/social.vue` | Página de redes sociales |

## Ruta

- **URL**: `/social`
- **Datos**: 100% estáticos (no consume API)

## Datos estáticos

Array `socialNetworks` con 18 redes sociales. Cada entrada:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | `string` | Nombre de la red |
| `handle` | `string` | Handle/username |
| `image` | `string` | Ruta al icono SVG/webp en `/images/icons/social/` |
| `description` | `string` | Descripción de la red |
| `url` | `string` | URL del perfil |
| `icon` | `string` | Material Symbols icon name |
| `size` | `'large' \| 'medium' \| 'small'` | Tamaño de tarjeta |
| `badge?` | `string` | Etiqueta badge |
| `badgeIcon?` | `string` | Icono del badge |
| `stats?` | `Array<{ label, value, active? }>` | Stats (solo en large) |

## Layout Bento Grid

Se organiza con `computed` `bentoRows`:
- **large (col-span-8) + medium (col-span-4)** → forman una fila
- **small (col-span-3)** → se agrupan de 4 en 4

### Filas resultantes

| Fila | Layout | Redes |
|------|--------|-------|
| 1 | large + medium | GitHub + LinkedIn |
| 2 | large + medium | GitLab + Twitter/X |
| 3 | large + medium | Telegram + YouTube |
| 4+ | 4× small | Mastodon, BlueSky, Twitch, Instagram, StackOverflow, Codepen, Thingiverse, Printables, Facebook, TikTok, Npmjs, Packagist |

## Templates de tarjetas

| Tamaño | Clases grid | Contenido |
|--------|-------------|-----------|
| `large` | `md:col-span-8` | Icono + handle + descripción + stats + enlace "VER_PERFIL" |
| `medium` | `md:col-span-4` | Icono + título + badge + descripción |
| `small` | `md:col-span-3` | Icono + título + handle + descripción corta |

## SEO

- Open Graph y Twitter Cards con imagen `/social/social.webp`
