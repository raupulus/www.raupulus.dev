# Página del Blog

Página del blog actualmente en estado "En Construcción". Muestra un aviso WIP y previews estáticos de artículos futuros.

## Archivos principales

| Archivo          | Rol             |
| ---------------- | --------------- |
| `pages/blog.vue` | Página del blog |

## Ruta

- **URL**: `/blog`
- **Datos**: 100% estáticos (no consume API)
- **Estado**: ⚠️ En construcción

## Secciones del template

| Sección                | Descripción                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| **Cabecera**           | Título "Mi Blog Personal" con subtítulo                            |
| **Estado WIP**         | Caja con icono `construction`, texto explicativo y animación pulse |
| **Próximos Artículos** | Grid de 3 tarjetas de artículos de ejemplo con `opacity-60`        |

## Datos estáticos

Array `upcomingArticles` con 3 artículos de ejemplo:

| Artículo                         | Tipo           | Lectura                   |
| -------------------------------- | -------------- | ------------------------- |
| Backend con Laravel y PostgreSQL | Desarrollo Web | Laravel · PostgreSQL      |
| Hardware propio y redes malladas | IoT y Hardware | ESP32 · LoRa · Meshtastic |
| Automatización y servidores      | GNU/Linux      | Debian · Bash             |

Cada artículo tiene: `type`, `readTime`, `title`, `description`, `tags[]` (con `icon` y `label`).

## SEO

- Title: `'Blog Técnico | Raúl Caro Pastorino'`
- Description enfocada en artículos técnicos sobre backend con Laravel, IA aplicada, nodos LoRa/Meshtastic y GNU/Linux
- `robots: 'noindex, follow'` mientras la página continúe en construcción sin contenido real

## Notas para desarrollo futuro

Cuando se implemente el blog real, se necesitará:

- Composable para obtener artículos desde la API
- Tipo `ArticleType` en `types/`
- Componente `CardArticle` para las tarjetas
- Paginación y búsqueda similar a proyectos
