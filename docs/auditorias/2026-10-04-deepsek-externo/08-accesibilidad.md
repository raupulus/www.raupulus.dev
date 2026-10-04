# 6.8 Accesibilidad — WCAG 2.2 AA (A11Y) — Auditoría externa deepsek-externo

Resumen: Lighthouse (axe-core) da 96 en home y 91 en `/contact` del build actual, y 77–92 en producción.
Los fallos automáticos son **contraste de color** (footer `text-outline-variant` y subtítulo del header en
producción), **nombre accesible del campo contenteditable** del mensaje, **jerarquía de encabezados** y, en
producción, ausencia de `<main>` e imágenes sin `alt`. No se pudo hacer la pasada manual con lector de
pantalla ni teclado completo (limitación).

| ID       | Título                                                                  | Sev.  | Prior. | Esf. |
| -------- | ----------------------------------------------------------------------- | ----- | ------ | ---- |
| A11Y-001 | Producción sin landmark `main` (corregido en código)                    | Alta  | P1     | S    |
| A11Y-002 | Contraste insuficiente (`text-outline-variant`, `text-warning`)         | Alta  | P1     | S    |
| A11Y-003 | Campo de mensaje `contenteditable` sin nombre accesible                 | Alta  | P1     | S    |
| A11Y-004 | Jerarquía de encabezados rota (`/contact` y `BlockHeader`)              | Media | P2     | S    |
| A11Y-005 | Imágenes sin `alt` en producción                                        | Alta  | P1     | S    |
| A11Y-006 | Sin enlace «Saltar al contenido»                                        | Media | P2     | S    |
| A11Y-007 | Errores de formulario sin `aria-live`/`aria-invalid`/`aria-describedby` | Media | P2     | S    |
| A11Y-008 | Menú móvil sin cierre con Esc ni gestión de foco                        | Media | P2     | S    |
| A11Y-009 | `BlockTable` sin `scope`/`caption`                                      | Media | P2     | S    |
| A11Y-010 | Header fijo puede ocultar el foco/anclas                                | Baja  | P3     | S    |
| A11Y-011 | reCAPTCHA y scroll suave como barreras/movimiento                       | Baja  | P3     | S    |

---

### A11Y-001 — Producción sin landmark `main`

| Campo       | Valor                                                                            |
| ----------- | -------------------------------------------------------------------------------- |
| Severidad   | Alta                                                                             |
| Prioridad   | P1                                                                               |
| Confianza   | Verificado (Lighthouse)                                                          |
| Esfuerzo    | S                                                                                |
| Ámbito      | Producción                                                                       |
| Ubicación   | HTML de producción; `layouts/default.vue:10` (código actual sí incluye `<main>`) |
| Referencias | WCAG 2.2 1.3.1, 2.4.1, ARIA Landmarks                                            |

**Descripción.** Lighthouse `landmark-one-main` falla (score 0) en **todas** las páginas de producción: no hay
elemento `<main>`. El código actual ya usa `<main id="app-box-content">`, por lo que el hallazgo es de
producción desplegada.

**Evidencia.** `prod-home-mobile.json` → `landmark-one-main [0] Document does not have a main landmark`.

**Recomendación.** Desplegar el layout actual (con `<main>`) y verificar que exista un único `main` por página.

**Verificación de la corrección.** Lighthouse/a11y sin fallo `landmark-one-main`.

---

### A11Y-002 — Contraste insuficiente

| Campo       | Valor                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| Severidad   | Alta                                                                                                          |
| Prioridad   | P1                                                                                                            |
| Confianza   | Verificado (Lighthouse/axe)                                                                                   |
| Esfuerzo    | S                                                                                                             |
| Ámbito      | Ambos                                                                                                         |
| Ubicación   | `components/app/Footer.vue:10,19,25,34` (`text-outline-variant` #414751 sobre #091421), header `text-warning` |
| Referencias | WCAG 2.2 1.4.3, 1.4.11                                                                                        |

**Descripción.** El texto del footer con `text-outline-variant` (#414751) sobre fondo #091421 tiene un
contraste aproximado de **~2:1**, muy por debajo de 4,5:1. En producción, el subtítulo del header
(`text-warning`, «Desarrollador web») también falla.

**Evidencia.**

```
local-home-mobile.json color-contrast [0]:
  <div class="... text-outline-variant">  (copyright)
  <a href="/privacy" class="... text-outline-variant">
  <a href="/contact"  class="... text-outline-variant">
  <a href="https://gitlab.com/...">       class text-outline-variant
# producción: además <span ... text-warning> "Desarrollador web"
```

**Recomendación.** Subir tokens: usar `text-outline` (#8b919c, ~4,6:1) o un tono más claro para textos
pequeños; revisar el color de `warning` sobre el fondo del header. Comprobar hover/focus/disabled y textos
`text-[10px]` en mayúsculas.

**Verificación de la corrección.** `color-contrast` a 1 en todas las plantillas; ratios ≥ 4,5:1.

---

### A11Y-003 — Campo de mensaje `contenteditable` sin nombre accesible

| Campo       | Valor                        |
| ----------- | ---------------------------- |
| Severidad   | Alta                         |
| Prioridad   | P1                           |
| Confianza   | Verificado (Lighthouse/axe)  |
| Esfuerzo    | S                            |
| Ámbito      | Código                       |
| Ubicación   | `pages/contact.vue:595-605`  |
| Referencias | WCAG 2.2 4.1.2, 1.3.1, 3.3.2 |

**Descripción.** El mensaje se edita en un `<span role="textbox" contenteditable>` sin `aria-label` ni
`aria-labelledby`. La etiqueta «Mensaje» (`label` sin `for`) no está asociada. Lighthouse
`aria-input-field-name` falla (score 0).

**Evidencia.** `local-contact-*.json` → `aria-input-field-name [0]: <span role="textbox" contenteditable="">`.

**Recomendación.** Añadir `id` a la etiqueta y `aria-labelledby="…"` al `span`, o `aria-label="Mensaje"`.
Idealmente, sustituir el `contenteditable` por un `<textarea>` real (accesible por defecto y sin necesidad de
sincronizar un textarea oculto).

**Verificación de la corrección.** `aria-input-field-name` a 1; navegación con lector de pantalla anuncia el campo.

---

### A11Y-004 — Jerarquía de encabezados rota

| Campo       | Valor                                              |
| ----------- | -------------------------------------------------- |
| Severidad   | Media                                              |
| Prioridad   | P2                                                 |
| Confianza   | Verificado (Lighthouse)                            |
| Esfuerzo    | S                                                  |
| Ámbito      | Código                                             |
| Ubicación   | `pages/contact.vue:459,658`, `BlockHeader.vue:1-4` |
| Relacionado | SEO-008                                            |

**Descripción.** En `/contact`, tras el `<h1>` aparece directamente un `<h3>` («Información de Contacto»),
saltándose el nivel 2 (`heading-order` falla). En el contenido, `BlockHeader` de nivel 1 puede insertar `<h1>`.

**Recomendación.** Corregir el nivel del encabezado lateral y mapear `BlockHeader` nivel 1 → `h2` dentro del
contenido.

**Verificación de la corrección.** `heading-order` a 1 en todas las rutas.

---

### A11Y-005 — Imágenes sin `alt` en producción

| Campo       | Valor                                                         |
| ----------- | ------------------------------------------------------------- |
| Severidad   | Alta                                                          |
| Prioridad   | P1                                                            |
| Confianza   | Verificado (Lighthouse)                                       |
| Esfuerzo    | S                                                             |
| Ámbito      | Producción                                                    |
| Ubicación   | Tarjetas/iconos en producción (`image-alt`); `pages/projects` |
| Referencias | WCAG 2.2 1.1.1                                                |

**Descripción.** Lighthouse `image-alt` falla (score 0) en `/projects`, `/projects/:slug` y `/about` de
producción (p. ej. `<img>` de `span.btn-clean` sin `alt`). Impacta también al SEO (SEO 92).

**Recomendación.** Añadir `alt` descriptivo (o `alt=""` si es decorativa) a todas las imágenes; revisar las
tarjetas de proyecto generadas desde la API.

**Verificación de la corrección.** `image-alt` a 1; SEO vuelve a 100.

---

### A11Y-006 — Sin enlace «Saltar al contenido»

| Campo       | Valor                                              |
| ----------- | -------------------------------------------------- |
| Severidad   | Media                                              |
| Prioridad   | P2                                                 |
| Confianza   | Verificado                                         |
| Esfuerzo    | S                                                  |
| Ámbito      | Código                                             |
| Ubicación   | `layouts/default.vue`, `components/app/Header.vue` |
| Referencias | WCAG 2.2 2.4.1                                     |

**Descripción.** No existe un enlace «Saltar al contenido» al inicio del `body`; con teclado hay que tabular
por todo el header en cada página.

**Recomendación.** Añadir `<a href="#app-box-content" class="sr-only focus:not-sr-only">Saltar al contenido</a>`
al principio del layout.

**Verificación de la corrección.** El enlace aparece al primer Tab y mueve el foco al `main`.

---

### A11Y-007 — Errores de formulario sin semántica ARIA

| Campo       | Valor                               |
| ----------- | ----------------------------------- |
| Severidad   | Media                               |
| Prioridad   | P2                                  |
| Confianza   | Verificado                          |
| Esfuerzo    | S                                   |
| Ámbito      | Código                              |
| Ubicación   | `pages/contact.vue:524-530,606-612` |
| Referencias | WCAG 2.2 3.3.1, 3.3.3, 4.1.3        |

**Descripción.** Los mensajes de error se muestran en `<span>` sin `role="alert"`/`aria-live`, sin
`aria-invalid` en los campos y sin `aria-describedby` que los asocie. No dependen solo del color (bueno), pero
un lector de pantalla no los anuncia.

**Recomendación.** Añadir `aria-invalid` a los campos con error, `aria-describedby` apuntando al mensaje y
`aria-live="polite"`/`role="alert"` al contenedor de errores.

**Verificación de la corrección.** Al provocar un error, el lector lo anuncia; axe/`aria-*` sin fallos.

---

### A11Y-008 — Menú móvil sin cierre con Esc ni gestión de foco

| Campo       | Valor                             |
| ----------- | --------------------------------- |
| Severidad   | Media                             |
| Prioridad   | P2                                |
| Confianza   | Verificado                        |
| Esfuerzo    | S                                 |
| Ámbito      | Código                            |
| Ubicación   | `components/app/Header.vue:40-78` |
| Referencias | WCAG 2.2 2.1.2, 2.4.3, 2.4.7      |

**Descripción.** El menú móvil (disclosure) no se cierra con Escape, no mueve el foco al abrirse ni lo
devuelve al botón al cerrar, y no bloquea el scroll de fondo. El botón sí tiene `aria-expanded` y
`aria-controls` (correcto).

**Recomendación.** Añadir `keydown.esc`, gestionar el foco (primer enlace al abrir, botón al cerrar) y
considerar `inert`/bloqueo de scroll.

**Verificación de la corrección.** Esc cierra el menú; el foco queda contenido y se restaura.

---

### A11Y-009 — `BlockTable` sin `scope`/`caption`

| Campo       | Valor                                          |
| ----------- | ---------------------------------------------- |
| Severidad   | Media                                          |
| Prioridad   | P2                                             |
| Confianza   | Verificado                                     |
| Esfuerzo    | S                                              |
| Ámbito      | Código                                         |
| Ubicación   | `components/content/blocks/BlockTable.vue:5-7` |
| Referencias | WCAG 2.2 1.3.1                                 |

**Descripción.** Los `<th>` de cabecera no llevan `scope="col"` y la tabla no tiene `<caption>`. En móvil las
cabeceras se ocultan y se muestran con `span.r-table-field-head` (texto de apoyo), insuficiente para
lectores de pantalla.

**Recomendación.** Añadir `scope="col"` y un `<caption>` (visible u oculto), y asociar celdas con el
encabezado.

**Verificación de la corrección.** Tabla reconocida correctamente por lector de pantalla; axe sin fallos.

---

### A11Y-010 — Header fijo puede ocultar el foco/anclas

| Campo       | Valor                                                                 |
| ----------- | --------------------------------------------------------------------- |
| Severidad   | Baja                                                                  |
| Prioridad   | P3                                                                    |
| Confianza   | Probable                                                              |
| Esfuerzo    | S                                                                     |
| Ámbito      | Código                                                                |
| Ubicación   | `components/app/Header.vue:3-7`, `middleware/scroll-to-top.global.ts` |
| Referencias | WCAG 2.2 2.4.11 (foco no oculto)                                      |

**Descripción.** El header es `fixed`; al navegar por anclas o al enfocar elementos, estos pueden quedar
tapados. No se define `scroll-margin-top`.

**Recomendación.** Añadir `scroll-margin-top` a los elementos ancla y comprobar que el foco nunca queda
oculto tras el header.

**Verificación de la corrección.** Al tabular, el elemento enfocado es visible bajo el header.

---

### A11Y-011 — reCAPTCHA y scroll suave como barreras/movimiento

| Campo       | Valor                                                    |
| ----------- | -------------------------------------------------------- |
| Severidad   | Baja                                                     |
| Prioridad   | P3                                                       |
| Confianza   | Hipótesis                                                |
| Esfuerzo    | S                                                        |
| Ámbito      | Código                                                   |
| Ubicación   | `middleware/scroll-to-top.global.ts`, badge de reCAPTCHA |
| Referencias | WCAG 2.2 2.2.2, 2.3.3, 1.4.13; EN 301 549                |

**Descripción.** El `scroll-to-top` global usa `behavior:'smooth'` por JS (la regla CSS global de
`prefers-reduced-motion` no lo cubre). El badge de reCAPTCHA puede solapar contenido y es una barrera
introducida por terceros.

**Recomendación.** Respetar `prefers-reduced-motion` también en el scroll JS y asegurar que el badge no tapa
CTAs/campos.

**Verificación de la corrección.** Con `prefers-reduced-motion`, el scroll no se anima; el badge no solapa.

---

## Tabla de conformidad WCAG 2.2 A / AA

Leyenda: **C** = Cumple · **NC** = No cumple (ver hallazgo) · **NA** = No aplica · **NV** = No verificado.

| Criterio (nivel)                               | Estado | Nota / Hallazgo                                  |
| ---------------------------------------------- | ------ | ------------------------------------------------ |
| 1.1.1 Contenido no textual (A)                 | NC     | A11Y-005 (imágenes sin alt en producción)        |
| 1.2.x Multimedia (A/AA)                        | NV     | Sin vídeos propios; embeds externos no auditados |
| 1.3.1 Información y relaciones (A)             | NC     | A11Y-003, A11Y-009                               |
| 1.3.2 Secuencia significativa (A)              | C      | —                                                |
| 1.3.3 Características sensoriales (A)          | C      | —                                                |
| 1.3.4 Orientación (AA)                         | NV     | No probado en orientación distinta               |
| 1.3.5 Identificar el propósito de entrada (AA) | C      | `autocomplete` en nombre/email                   |
| 1.4.1 Uso del color (A)                        | C      | Errores no solo por color                        |
| 1.4.2 Control del audio (A)                    | NA     | Sin audio                                        |
| 1.4.3 Contraste mínimo (AA)                    | NC     | A11Y-002                                         |
| 1.4.4 Redimensionar texto (AA)                 | NV     | No probado al 200 %                              |
| 1.4.5 Imágenes de texto (AA)                   | C      | —                                                |
| 1.4.10 Reflow (AA)                             | NV     | Matriz responsive no ejecutada (RESP-001)        |
| 1.4.11 Contraste no textual (AA)               | NC     | Componentes/foco a revisar (A11Y-002)            |
| 1.4.12 Espaciado del texto (AA)                | NV     | No probado con bookmarklet                       |
| 1.4.13 Contenido en hover/focus (AA)           | NV     | —                                                |
| 2.1.1 Teclado (A)                              | NV     | Recorrido completo no ejecutado                  |
| 2.1.2 Sin trampas de teclado (A)               | NV     | —                                                |
| 2.1.4 Atajos de teclado (A)                    | NA     | —                                                |
| 2.2.1 Tiempo ajustable (A)                     | NA     | —                                                |
| 2.2.2 Pausar, detener, ocultar (A)             | NC     | A11Y-011 (GIF/animaciones, movimiento)           |
| 2.3.1 Umbral de tres destellos (A)             | C      | Sin destellos                                    |
| 2.4.1 Evitar bloques (A)                       | NC     | A11Y-006 (sin saltar al contenido)               |
| 2.4.2 Título de página (A)                     | C      | Únicos por página                                |
| 2.4.3 Orden del foco (A)                       | NV     | No verificado con teclado                        |
| 2.4.4 Propósito de los enlaces (A)             | C      | Textos descriptivos                              |
| 2.4.5 Múltiples vías (AA)                      | C      | Menú, footer, sitemap                            |
| 2.4.6 Encabezados y etiquetas (AA)             | NC     | A11Y-004                                         |
| 2.4.7 Foco visible (AA)                        | NV     | No verificado                                    |
| 2.4.11 Foco no oculto (AA, 2.2)                | NC     | A11Y-010                                         |
| 2.5.1 Gestos (A)                               | NV     | Galería con swipe no probada                     |
| 2.5.2 Cancelación de puntero (A)               | C      | —                                                |
| 2.5.3 Etiqueta en el nombre (A)                | C      | —                                                |
| 2.5.7 Movimientos de arrastre (AA, 2.2)        | NA     | —                                                |
| 2.5.8 Tamaño del objetivo (AA, 2.2)            | NV     | Botones de icono a medir (RESP-002)              |
| 3.1.1 Idioma de la página (A)                  | C      | `lang=es`                                        |
| 3.1.2 Idioma de las partes (AA)                | C      | —                                                |
| 3.2.1 Al recibir el foco (A)                   | C      | —                                                |
| 3.2.2 Al recibir entradas (A)                  | C      | —                                                |
| 3.2.3 Navegación coherente (AA)                | C      | Header/footer estables                           |
| 3.2.4 Identificación coherente (AA)            | C      | —                                                |
| 3.2.6 Ayuda consistente (A, 2.2)               | C      | —                                                |
| 3.3.1 Identificación de errores (A)            | NC     | A11Y-007                                         |
| 3.3.2 Etiquetas o instrucciones (A)            | NC     | A11Y-003                                         |
| 3.3.3 Sugerencia ante errores (AA)             | NC     | A11Y-007                                         |
| 3.3.4 Prevención de errores (AA)               | C      | Confirmación antes de enviar                     |
| 3.3.7 Entrada redundante (A, 2.2)              | C      | `autocomplete`                                   |
| 3.3.8 Autenticación accesible (AA, 2.2)        | NA     | Sin autenticación                                |
| 4.1.1 Análisis (A)                             | NV     | Validación W3C no ejecutada                      |
| 4.1.2 Nombre, función, valor (A)               | NC     | A11Y-003 (contenteditable)                       |
| 4.1.3 Mensajes de estado (AA)                  | NC     | A11Y-007                                         |

---

## Verificado y correcto

- Idioma `lang="es"` correcto; títulos de página únicos.
- Todos los botones solo-icono tienen `aria-label` (cerrar menú, limpiar, quitar filtro, galería).
- `NuxtLink`/`<a>` reales para navegación (no `div` clicables) en los elementos principales.
- Errores de formulario no dependen solo del color (borde + texto).
- Checkbox de privacidad con etiqueta envolvente y no premarcado.
- `prefers-reduced-motion` cubierto en CSS global; sin destellos.
- Landmarks `header`/`nav aria-label`/`footer role=contentinfo` presentes; `main` en el código actual.
- Iconos Material `aria-hidden`; imágenes sociales con `alt`.
