# 📚 Documentación Técnica de Módulos — www.raupulus.dev

> Portfolio web personal de Raúl Caro Pastorino (@raupulus).
> Nuxt 4 + TypeScript + TailwindCSS · Generación estática (SSG) · API REST Laravel

## Índice de Módulos

### Configuración y Arquitectura

| Archivo | Módulo | Descripción |
|---------|--------|-------------|
| [nuxt-config.md](./nuxt-config.md) | Configuración Nuxt | Runtime config, módulos, SSG, proxy, prerender |
| [design-system.md](./design-system.md) | Design System | TailwindCSS, tokens de color, tipografías, CSS |
| [seo-sitemap.md](./seo-sitemap.md) | SEO y Sitemap | Metatags, Open Graph, Twitter Cards, sitemap dinámico |
| [deploy-cicd.md](./deploy-cicd.md) | Despliegue | Scripts de deploy, GoCD pipeline |

### Páginas

| Archivo | Módulo | Ruta |
|---------|--------|------|
| [layout-navegacion.md](./layout-navegacion.md) | Layout y Navegación | (todas) |
| [pagina-home.md](./pagina-home.md) | Página Principal | `/` |
| [pagina-proyectos.md](./pagina-proyectos.md) | Proyectos | `/projects/[...slugs]` |
| [pagina-about.md](./pagina-about.md) | Sobre Mí | `/about` |
| [pagina-blog.md](./pagina-blog.md) | Blog | `/blog` |
| [pagina-contact.md](./pagina-contact.md) | Contacto | `/contact` |
| [pagina-social.md](./pagina-social.md) | Redes Sociales | `/social` |
| [pagina-webs.md](./pagina-webs.md) | Sitios Web | `/webs` |
| [pagina-privacy.md](./pagina-privacy.md) | Privacidad | `/privacy` |

### Lógica y Datos

| Archivo | Módulo | Descripción |
|---------|--------|-------------|
| [composables.md](./composables.md) | Composables | Lógica reutilizable (proyectos, plataforma, API, recaptcha) |
| [types.md](./types.md) | Sistema de Tipos | Todos los tipos TypeScript del proyecto |
| [utils.md](./utils.md) | Utilidades | Cliente API, sanitización HTML, búsqueda de tecnologías |
| [plugins-middleware.md](./plugins-middleware.md) | Plugins y Middleware | reCAPTCHA plugin, scroll-to-top middleware |

### Componentes

| Archivo | Módulo | Descripción |
|---------|--------|-------------|
| [componentes-ui.md](./componentes-ui.md) | Componentes UI | Cards, badges, grids, botones, alertas, formularios |
| [componentes-content-blocks.md](./componentes-content-blocks.md) | Bloques de Contenido | Renderizado de bloques EditorJS (16 tipos) |
| [componentes-icons.md](./componentes-icons.md) | Iconos | Componentes SVG de redes sociales |
| [componentes-modals.md](./componentes-modals.md) | Modales | Galería de imágenes, detalle de proyecto, envío de contacto |
