# Auditoría Estratégica: Posicionamiento SEO, Conversión UX y Accesibilidad (WCAG)

> **Fecha:** 7 de octubre de 2026  
> **Proyecto:** [www.raupulus.dev](https://raupulus.dev)  
> **Objetivo:** Maximizar la visibilidad en motores de búsqueda, optimizar la experiencia para reclutadores y empresas técnicas, garantizar una navegación sin sobrecarga cognitiva y certificar la accesibilidad universal (WCAG 2.1 / 2.2 AA).

---

## 1. Resumen Ejecutivo y Diagnóstico Inicial

La web **www.raupulus.dev** actúa como el nodo central de marca personal y profesional de Raúl Caro Pastorino (@raupulus). Es la carta de presentación ante empresas, reclutadores, colaboradores y la comunidad técnica.

Tras el análisis integral de la arquitectura actual (Nuxt 4 SSG, TailwindCSS, Schema.org, sitemap y componentes), el proyecto cuenta con bases técnicas sólidas (0 errores en ESLint, 0 errores de tipos, 91 tests automatizados y arquitectura estática ultra rápida). Sin embargo, existen **oportunidades de alto impacto** para:

1. **Evitar advertencias en Google Search Console** y mejorar la posición en buscadores para búsquedas de *Desarrollador Laravel Senior*, *Full Stack Senior* e *Integración de IA*.
2. **Convertir visitas en contactos profesionales inmediatos** facilitando a empresas y reclutadores el acceso al CV y métricas clave en menos de 5 segundos.
3. **Eliminar redundancias visuales** en la página principal para reducir la fatiga visual.
4. **Elevar la accesibilidad al estándar WCAG 2.2 AA / AAA** mediante indicadores globales de foco por teclado y contraste tipográfico reforzado.

---

## 2. Eje 1: Posicionamiento en Buscadores & SEO Técnico

### 2.1 Sincronización del Schema.org Global (`app.vue`)
- **Situación actual:** En `app.vue`, la entidad Schema.org `@type: Person` aún mantiene datos genéricos (`jobTitle: 'Desarrollador Web Backend'`) y un listado de tecnologías que no refleja su especialidad en IA, hardware libre ni redes malladas.
- **Propuesta de mejora:**
  - Actualizar `jobTitle` a: `Desarrollador Full Stack Senior · Backend Laravel · IA aplicada`.
  - Ampliar `knowsAbout` incorporando: `Inteligencia Artificial`, `RAG (Retrieval-Augmented Generation)`, `Agentes de IA`, `Modelos Locales (Whisper, Hailo-8)`, `LoRa / Meshtastic`, `Diseño de PCBs`, `PostgreSQL`.
  - Añadir en `sameAs` los perfiles de Bluesky, Packagist y Printables.
  - Añadir la propiedad `hasOccupation` para estructurar la experiencia profesional según la especificación de Google.

### 2.2 Exclusión en Sitemap de Rutas con `noindex` (`nuxt.config.ts`)
- **Situación actual:** La página `/blog/` tiene la directiva `robots: 'noindex, follow'` (en construcción), pero `@nuxtjs/sitemap` no la excluye explícitamente en `nuxt.config.ts`.
- **Riesgo:** Google Search Console genera una advertencia de cobertura: *"URL enviada marcada con la etiqueta noindex"*, lo que penaliza la puntuación de calidad técnica del dominio.
- **Propuesta de mejora:** Añadir `/blog` y `/blog/**` a la regla `exclude` de `sitemap` en `nuxt.config.ts` hasta que se publiquen artículos reales.

### 2.3 Optimización de la Longitud del `<title>` en SERP (Google)
- **Situación actual:** Algunos títulos superan los 65-70 caracteres (ej. 87 caracteres en la Home), por lo que Google los trunca en resultados de escritorio y móviles con puntos suspensivos (`...`).
- **Propuesta de mejora:**
  - Optimizar el título principal para no exceder los 60 caracteres:  
    `Raúl Caro Pastorino · Full Stack Senior · Laravel & IA` (54 caracteres).
  - Mantener la descripción SERP entre 145 y 155 caracteres con llamada a la acción implícita.

### 2.4 Imagen OpenGraph Dedicada para la Home (1200×630)
- **Situación actual:** Para la Home, `og:image` apunta a `logo_512x512.png` (cuadrado). Al compartirse en WhatsApp, LinkedIn, Slack o Twitter/X, muchas redes recortan la imagen o la muestran en miniatura cuadrada.
- **Propuesta de mejora:** Generar y configurar un asset horizontal de 1200×630 px (`/social/home.webp`) con el titular y logotipo, garantizando una previsualización (Rich Card) en redes sociales.

### 2.5 Esquema Estructurado `ItemList` en Catálogo de Proyectos
- **Situación actual:** `/projects/` define `CollectionPage`, pero no numera los proyectos en un `ItemList`.
- **Propuesta de mejora:** Incluir un array `ItemList` con los proyectos más destacados para facilitar la aparición de carruseles o snippets enriquecidos en Google.

---

## 3. Eje 2: Conversión para Empresas y Reclutadores (UX sin Saturación)

### 3.1 Acceso Rápido al Currículum en el Hero
- **Problema detectado:** Un reclutador o director de tecnología tarda entre 10 y 15 segundos en encontrar el currículum. En la Home actual solo hay enlaces a "Ver Proyectos" y "Sobre Mí".
- **Propuesta de mejora:**
  - En el Hero de la Home, añadir un botón secundario o enlace directo al **CV Online** / **Descargar CV PDF**.
  - En el menú de navegación (`AppHeader`), añadir un enlace directo `CV Online` o destacarlo junto al botón de Contacto.

### 3.2 Barra de Impacto Rápido (Key Metrics) Above the Fold
- **Problema detectado:** Los reclutadores escanean antes de leer. El texto explicativo es excelente, pero carece de un bloque visual de cifras clave inmediato.
- **Propuesta de mejora:** Incorporar una banda compacta de hitos bajo los botones del Hero:
  - `+15 Años` programando
  - `7 Años` Laravel en empresa
  - `IA en Producción` (RAG y Agentes)
  - `100+` repositorios en abierto

### 3.3 Reducción de Fatiga Cognitiva en la Home
- **Problema detectado:** La página principal contiene dos secciones consecutivas dedicadas al stack técnico:
  1. Los hexágonos de *Mi Stack Principal* (PHP, Laravel, Vue, JS, PostgreSQL).
  2. Las tarjetas de *STACK TECNOLÓGICO* (PHP & Laravel, Python, Vue.js, PostgreSQL, Bash & Ops).
- **Propuesta de mejora:**
  - Unificar o redefinir el rol de ambas secciones:
    - Transformar los hexágonos en una barra compacta de tecnologías principales (tipo "Core Tools").
    - O bien convertir las tarjetas inferiores en una sección de **"Especialidades y Casos de Uso"** (APIs críticas, Arquitectura de datos, Hardware e IA), evitando que el visitante sienta que lee dos veces la misma lista.

---

## 4. Eje 3: Accesibilidad Universal (WCAG 2.1 / 2.2 AA)

### 4.1 Indicador Global de Foco por Teclado (`:focus-visible`)
- **Situación actual:** Existen estilos de foco específicos en algunos componentes (como el banner de cookies o el botón de saltar al contenido), pero falta un estilo global unificado para todos los enlaces, botones y campos del formulario.
- **Propuesta de mejora:** Definir en `assets/css/styles.css`:
  ```css
  :focus-visible {
      outline: 2px solid var(--color-primary, #a3c9ff) !important;
      outline-offset: 3px !important;
  }
  ```
  Esto garantiza el cumplimiento del Criterio de Conformidad 2.4.7 (Foco visible) y 2.4.11 (Aspecto del foco) de WCAG 2.2.

### 4.2 Contraste en Tipografía Secundaria (`text-outline`)
- **Situación actual:** La clase `text-outline` (`#8b919c`) sobre contenedores oscuros (`#16202e` y `#212b39`) ofrece una relación de contraste aproximada de 4.5:1 a 5:1. En tamaños de fuente reducidos (`text-[10px]` o `text-xs`), puede dificultar la lectura a personas con baja agudeza visual.
- **Propuesta de mejora:** Utilizar `text-on-surface-variant` (`#c1c7d2`, contraste > 8:1) para etiquetas informativas pequeñas, reservando `text-outline` exclusivamente para elementos decorativos no esenciales.

### 4.3 Accesibilidad de Errores en el Formulario de Contacto
- **Situación actual:** Los mensajes de error en `pages/contact.vue` se muestran visualmente con `role="alert"`.
- **Propuesta de mejora:** Vincular cada `<input>` con su contenedor de errores mediante `aria-describedby="[campo]-error"` y añadir `aria-invalid="true"` cuando haya fallo, permitiendo a los lectores de pantalla vocalizar el error exacto al enfocar el campo.

---

## 5. Tabla de Propuestas y Priorización

| ID | Propuesta | Eje | Impacto | Esfuerzo | Archivos Principales |
|---|---|---|---|---|---|
| **P-01** | Actualizar Schema.org `Person` y `WebSite` con datos completos de IA, experiencia y perfiles | SEO | Alto | Bajo | `app.vue` |
| **P-02** | Excluir `/blog/**` del `sitemap.xml` para evitar avisos de `noindex` en Google Search Console | SEO | Alto | Mínimo | `nuxt.config.ts` |
| **P-03** | Crear imagen OpenGraph horizontal (1200×630) para compartir la Home en LinkedIn / WhatsApp | SEO / Marca | Alto | Medio | `public/social/home.webp`, `app.vue`, `nuxt.config.ts` |
| **P-04** | Añadir botón directo al CV (Online y PDF) en el Hero de la Home | Conversión | Muy Alto | Bajo | `pages/index.vue` |
| **P-05** | Implementar banda de métricas clave (+15 años, 7 años empresa, IA en producción) en el Hero | UX / Claridad | Alto | Bajo | `pages/index.vue` |
| **P-06** | Resolver la duplicidad visual del stack tecnológico en la página Home | UX / Claridad | Medio | Medio | `pages/index.vue` |
| **P-07** | Indicador global de foco `:focus-visible` de alto contraste en todo el sitio | Accesibilidad | Alto | Mínimo | `assets/css/styles.css` |
| **P-08** | Reforzar contraste tipográfico sustituyendo `text-outline` en textos pequeños de datos | Accesibilidad | Medio | Bajo | `pages/*.vue`, `components/**/*.vue` |
| **P-09** | Enlazar inputs de contacto con errores mediante `aria-describedby` | Accesibilidad | Medio | Bajo | `pages/contact.vue` |
| **P-10** | Corregir enlace interno `/social` a `/social/` (trailing slash) | SEO | Bajo | Mínimo | `pages/contact.vue` |

---

## 6. Próximos Pasos Sugeridos

1. **Revisar estas propuestas** y elegir cuáles se alinean mejor con tus objetivos actuales.
2. **Implementar en bloques ordenados** (por ejemplo: Fase 1 SEO y Sitemap, Fase 2 UX/CV en Home, Fase 3 Accesibilidad WCAG).
3. **Validación:** Comprobar mediante el validador oficial de Schema.org / Rich Results de Google y test de accesibilidad Axe-core.
