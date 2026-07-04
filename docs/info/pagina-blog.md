# Página del Blog

Página del blog actualmente en estado "En Construcción". Muestra un aviso WIP y previews estáticos de artículos futuros.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/blog.vue` | Página del blog |

## Ruta

- **URL**: `/blog`
- **Datos**: 100% estáticos (no consume API)
- **Estado**: ⚠️ En construcción

## Secciones del template

| Sección | Descripción |
|---------|-------------|
| **Cabecera** | Título "Mi Blog Personal" con subtítulo |
| **Estado WIP** | Caja con icono `construction`, texto explicativo y animación pulse |
| **Próximos Artículos** | Grid de 3 tarjetas de artículos de ejemplo con `opacity-60` |

## Datos estáticos

Array `upcomingArticles` con 3 artículos de ejemplo:

| Artículo | Tipo | Lectura |
|----------|------|---------|
| El Futuro del Edge Computing | Guía en Profundidad | 12 min |
| Lecciones de un Refactoring de 2 Años | Caso de Estudio | 20 min |
| MQTT con Laravel y Vue.js | Tutorial | 8 min |

Cada artículo tiene: `type`, `readTime`, `title`, `description`, `tags[]` (con `icon` y `label`).

## SEO

- Title: `'Blog Técnico | Raúl Caro Pastorino'`
- Description enfocada en artículos técnicos sobre backend, IoT y arquitectura

## Notas para desarrollo futuro

Cuando se implemente el blog real, se necesitará:
- Composable para obtener artículos desde la API
- Tipo `ArticleType` en `types/`
- Componente `CardArticle` para las tarjetas
- Paginación y búsqueda similar a proyectos
