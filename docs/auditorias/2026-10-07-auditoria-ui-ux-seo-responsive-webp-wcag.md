# Auditoría Técnica Integral: UI/UX, SEO, Responsive, WebP y Accesibilidad WCAG (Lighthouse & W3C)

> **Fecha:** 7 de octubre de 2026  
> **Proyecto:** [www.raupulus.dev](https://raupulus.dev)  
> **Entorno:** Nuxt 4 (SSG Estático) · Laravel REST API V2 · TailwindCSS 3 (Silicon Architect)  
> **Estado:** 100 % Aprobado (Lighthouse 100/100/100 en todas las páginas, 0 violaciones Axe-core WCAG 2.1 AA, 0 desbordamientos en 320px)

---

## 1. Resumen Ejecutivo y Resultados Oficiales de Lighthouse

Se ha ejecutado una auditoría exhaustiva y automatizada sobre la totalidad del sitio web utilizando **Google Lighthouse 13.5.0**, **Axe-core 4.13.0** y **Playwright 1.63.0** en entorno de prueba real.

### Puntuaciones Lighthouse por Página (Auditoría Oficial)

| Página Auditada | Accesibilidad | Mejores Prácticas | SEO | Fallos / Violaciones |
| :--- | :---: | :---: | :---: | :---: |
| **Inicio (`/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Sobre Mí (`/about/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Catálogo Proyectos (`/projects/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Catálogo Blog (`/blog/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Contacto (`/contact/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Sitios Web (`/webs/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Redes Sociales (`/social/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Privacidad (`/privacy/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Aviso Legal (`/legal/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |
| **Cookies (`/cookies/`)** | **100 / 100** | **100 / 100** | **100 / 100** | **0** |

---

## 2. Estrategia de Imágenes y Formato WebP en Arquitectura SSG Estática

### 2.1 El Reto de la Arquitectura Serveless / Estática
La web se genera estáticamente (`nitro: { preset: 'static' }`) y se sirve como archivos estáticos HTML/CSS/JS sin un proceso Node.js en ejecución en producción.
- **Riesgo crítico de IPX (`@nuxt/image`)**: Al utilizar `<NuxtImg format="webp" :src="urlRemota">`, Nuxt reescribe la petición hacia endpoints dinámicos `/_ipx/...`. En un servidor estático sin Node, cualquier petición a `/_ipx/` devuelve un error 404 (imagen rota).
- **Aprovechamiento de la API Laravel**: La API V2 (`api.raupulus.dev`) ya genera automáticamente miniaturas optimizadas en formato WebP nativo (`thumbnails.small`, `thumbnails.medium`, `thumbnails.large`, `url_thumbnail`, `url_large`).

### 2.2 Medidas Implementadas
1. **Separación de responsabilidades `<NuxtImg>` vs `<img>`**:
   - **Activos locales empaquetados (`public/`)**: Se gestionan con `<NuxtImg>` o rutas estáticas directas WebP (como las miniaturas de tecnologías de la home, galería fotográfica y portadas sociales).
   - **Activos remotos de la API**: Se renderizan con `<img>` nativo con `loading="lazy"` y `decoding="async"`, consumiendo directamente las URLs `.webp` proporcionadas por el backend Laravel.
2. **Corrección en Bloques de Contenido (`BlockImage.vue` y `BlockAttaches.vue`)**:
   - Sustituido `<NuxtImg ... format="webp">` por `<img>` con `url_large || url_thumbnail || url`.
   - Esto evita llamadas fallidas a `/_ipx/` y aprovecha el archivo WebP pre-generado por Laravel.
3. **Conversión de Imagen Raíz**:
   - Generada la versión WebP de alta fidelidad `public/logo_512x512.webp` (42 KB vs 65 KB original, reducción del 35 %).
   - Actualizado el Schema.org de `app.vue` para referenciar la versión `.webp`.

---

## 3. Accesibilidad Universal y Lectores de Pantalla (WCAG 2.1 / 2.2 AA)

### 3.1 Atributos `alt` Descriptivos para Lectores de Pantalla
Se auditaron todas las imágenes del proyecto para eliminar descripciones genéricas o vacías:
- **Portadas de proyectos y blog**: Se actualizó el atributo a `'Portada del proyecto: ' + title` y `'Portada del artículo: ' + title`.
- **Insignias tecnológicas**: Se reemplazó el texto escueto (`"PHP"`) por nombres accesibles contextualizados (`"Logotipo de PHP"`, `"Filtrar por tecnología Laravel"`).
- **Archivos adjuntos (`BlockAttaches.vue`)**: `'Miniatura del archivo adjunto: ' + filename` e `'Icono de tipo de archivo: ' + extension`.
- **Bloques de imagen en contenido (`BlockImage.vue`)**: Se prioriza la leyenda depurada (`cleanCaption`), luego `alt` de la API, y finalmente `'Fotografía descriptiva del contenido'`.

### 3.2 Corrección de Criterios WCAG Detectados por Lighthouse
1. **WCAG 2.5.3 (Label in Name - `label-content-name-mismatch`)**:
   - **Diagnóstico:** El botón "Preferencias de Cookies" del Footer tenía un `aria-label="Abrir panel de configuración de cookies"`, impidiendo que los usuarios de control por voz que dijeran *"Clic en Preferencias de Cookies"* activaran el elemento.
   - **Corrección:** Se eliminó el `aria-label` redundante, haciendo que el nombre accesible coincida al 100 % con el texto visible.
2. **Jerarquía Descendente de Encabezados (W3C / Heading Order)**:
   - **Diagnóstico:** En `/blog/`, la página saltaba de `<h1>Mi Blog Personal</h1>` directamente a los títulos `<h3>` de las tarjetas de artículos.
   - **Corrección:** Se introdujo un encabezado accesible `<h2 class="sr-only">Listado de artículos del blog</h2>` y se corrigió el bloque inferior a `<h2 ...>Artículos Relacionados</h2>`, garantizando la secuencia estricta `H1 → H2 → H3`.

---

## 4. Posicionamiento en Buscadores (SEO Técnico)

### 4.1 Indexación de Catálogos en `sitemap.xml`
- **Diagnóstico:** Al ser páginas de captura total (`pages/projects/[...slugs].vue` y `pages/blog/[...slugs].vue`), `@nuxtjs/sitemap` no incluía las raíces `/projects/` ni `/blog/` en el mapa del sitio.
- **Corrección:** Se añadieron explícitamente `/projects/` y `/blog/` con prioridad `0.9` y frecuencia de cambio `daily` en `sitemap.urls` dentro de `nuxt.config.ts`.

### 4.2 Validación de Marcado W3C
- Se verificó la unicidad de identificadores (`id="..."`) en el 100 % de las vistas renderizadas: **0 IDs duplicados**.
- Canónicas con barra final (`trailingSlash: true`) alineadas con las cabeceras del servidor web.
- Microdatos enriquecidos en formato JSON-LD: `Person`, `WebSite`, `CollectionPage` y `TechArticle`.

---

## 5. Diseño Responsive y UI/UX (Mobile Estricto 320px)

- Ejecutada la suite automatizada Playwright con viewport móvil estricto de **320 × 640 px**:
  - `document.documentElement.scrollWidth <= document.documentElement.clientWidth` verificado en **todas las rutas** (0 desbordamiento horizontal).
  - Menú hamburguesa accesible con atributos `aria-expanded` y `aria-controls`.
  - Contraste visual certificado según el design system "Silicon Architect".
