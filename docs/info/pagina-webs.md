# Página de Sitios Web

Listado estático de sitios web creados y publicados por el autor.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/webs.vue` | Página de sitios web |

## Ruta

- **URL**: `/webs`
- **Datos**: 100% estáticos (no consume API)

## Datos estáticos

Array `webs` con 6 sitios web. Cada entrada:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | `string` | Nombre del sitio |
| `image` | `string` | Ruta a la imagen/logo |
| `description` | `string` | Descripción del sitio |
| `url` | `string` | URL del sitio |
| `tags` | `string[]` | Etiquetas de tecnologías |

## Sitios incluidos

1. **Jaja Project** — Plataforma comunitaria de chistes y quiz (`Vue.js`, `Laravel`, `API`)
2. **Api Personal** — API personal para debug y desarrollo IoT (`Laravel`, `REST API`, `IoT`)
3. **Micro-Blog Personal** — Blog personal de aprendizaje (`Blog`)
4. **La Guía Linux** — Web de software libre y GNU/Linux (`GNU/Linux`, `Open Source`)
5. **AI Dyslexic** — Generación de imágenes con IA para redes sociales (`AI`, `Python`)
6. **Portfolio Web Personal** — Este mismo sitio (`Nuxt.js`, `Vue.js`)

## Template

- Grid responsive: 1 col (móvil), 2 cols (tablet), 3 cols (desktop)
- Cada tarjeta: imagen centrada + título + descripción + tags + URL
- Enlaces `target="_blank"` con `rel="noopener noreferrer"`

## SEO

- Open Graph y Twitter Cards con imagen `/social/webs.webp`
