# Página "Sobre Mí"

Perfil personal con descripción, links a CV, skills, pasiones, hobbies, entorno de trabajo y galería de 50 imágenes con modal slideshow.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/about.vue` | Página "Sobre mí" |
| `components/modals/ImageSlide.vue` | Modal slideshow para la galería |
| `types/GalleryPathType.ts` | Tipo para rutas de imágenes de galería |

## Ruta

- **URL**: `/about`
- **Datos**: mayoritariamente estáticos. Solo el link al CV en PDF se construye dinámicamente desde `runtimeConfig`.

## Secciones del template

| Sección | Descripción |
|---------|-------------|
| **Cabecera** | Título "Sobre Mí" |
| **Descripción + Botones** | Grid 2/3 descripción + 1/3 botones (Descargar CV PDF, Ver CV Online, LinkedIn, GitHub) |
| **Info Portfolio** | Caja destacada sobre el portfolio |
| **Skills y Pasiones** | Grid 2 columnas con listas |
| **Entorno de Trabajo** | Banner con imagen de fondo y botón CV Online |
| **Hobbies y Pasatiempos** | Grid 2 columnas con listas |
| **Galería** | Grid de 50 thumbnails con click para abrir modal |

## Datos estáticos

| Array | Contenido |
|-------|-----------|
| `skills` | 7 habilidades técnicas |
| `passions` | 8 pasiones profesionales |
| `hobbies` | 7 hobbies tecnológicos |
| `pastimes` | 7 pasatiempos personales |

## Galería de imágenes

- **50 imágenes** generadas programáticamente (`generateGalleryPaths()`)
- Thumbnails: `/images/pages/about/gallery/{i}_250px.webp`
- Full size: `/images/pages/about/gallery/{i}_1280px.webp`
- Click en thumbnail → `showImageSlide(idx)` → abre `ModalsImageSlide`

## CV

- **PDF**: `${API_DOMAIN_URL}/cv/get/pdf/raupulus/default` (enlace externo a la API)
- **Online**: `https://curriculum.raupulus.dev` (enlace externo)

## SEO

- Title: `'Sobre mí - Raúl Caro Pastorino | Desarrollador Web Full Stack Backend'`
- Open Graph y Twitter Cards con imagen `/social/about.webp`

## Relaciones con otros módulos

- → [componentes-modals.md](./componentes-modals.md): `ModalsImageSlide`
- → [types.md](./types.md): `GalleryPathType`
- → [nuxt-config.md](./nuxt-config.md): `runtimeConfig.public.api.domain`
