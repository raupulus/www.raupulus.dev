# 6.6 Responsive y compatibilidad (RESP) — Auditoría externa deepsek-externo

Resumen: **no se pudo ejecutar la matriz completa** de viewports × motores. El entorno no dispone de
Playwright instalado en el proyecto y no se utilizó (restricción de la sesión: trabajar solo dentro del
repositorio). Se cubrieron dos viewports reales con Lighthouse (móvil 412×823 y escritorio) en todas las
plantillas, y se hizo análisis estático de los puntos de riesgo con mayor probabilidad de fallo responsive.

**Estado: mayoritariamente `⚠️ No verificado`.** Ver `matriz-pruebas.md` para el detalle celda a celda.

| ID       | Título                                                       | Sev. | Prior. | Esf. |
| -------- | ------------------------------------------------------------ | ---- | ------ | ---- |
| RESP-001 | Matriz completa de viewports/navegadores no ejecutada        | —    | —      | —    |
| RESP-002 | Riesgos responsive detectados por análisis (no reproducidos) | Baja | P3     | S    |

---

### RESP-001 — Matriz completa no ejecutada (limitación)

| Campo       | Valor                                   |
| ----------- | --------------------------------------- |
| Severidad   | —                                       |
| Prioridad   | —                                       |
| Confianza   | —                                       |
| Esfuerzo    | —                                       |
| Ámbito      | —                                       |
| Ubicación   | —                                       |
| Referencias | WCAG 1.4.10 (reflow), WCAG 1.4.4 (zoom) |

**Descripción.** No se ejecutó la matriz de 15 viewports (320→2560 px) × 3 motores (Chromium, WebKit,
Firefox) ni la detección automática de scroll horizontal. Se dispone de:

- Lighthouse móvil (412×823) y escritorio en las 6 plantillas (producción) + home/contact (local).
- Análisis estático del marcado y de las utilidades Tailwind.

**Motivo.** Playwright no está instalado en el proyecto y la sesión se limitó al directorio del repositorio,
sin instalar dependencias fuera de él.

**Recomendación.** Ejecutar la matriz con Playwright (Chromium/WebKit/Firefox) en CI, con detección de
`scrollWidth > clientWidth` y de elementos cuyo `getBoundingClientRect().right > innerWidth` a 320 px.

**Verificación de la corrección.** `matriz-pruebas.md` con todas las celdas OK o con ID de hallazgo, sin
`⚠️`.

---

### RESP-002 — Riesgos responsive por análisis estático

| Campo     | Valor                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| Severidad | Baja                                                                                                       |
| Prioridad | P3                                                                                                         |
| Confianza | Hipótesis                                                                                                  |
| Esfuerzo  | S                                                                                                          |
| Ámbito    | Código                                                                                                     |
| Ubicación | `components/content/blocks/BlockTable.vue`, `BlockCode.vue`, `components/app/Header.vue`, `BlockEmbed.vue` |

**Descripción.** Elementos a verificar en viewports estrechos (no reproducidos en esta sesión):

1. **Tablas EditorJS** (`BlockTable.vue:79+`): en `<768px` se convierten en tarjetas; comprobar que una celda
   con contenido muy largo no desborda a 320 px. Sin `overflow-x:auto` de respaldo.
2. **Bloques de código** (`BlockCode.vue`): usan `<br>` y números de línea con `width:60px`; a 320 px, líneas
   muy largas pueden forzar scroll horizontal.
3. **Header fijo**: el menú desplegable y el `backdrop-blur` deben comprobarse a 320 px y en móvil horizontal
   (~360 px de alto), donde header + banner de cookies pueden ocupar toda la pantalla.
4. **`BlockEmbed`**: iframe con `max-width` por `data-width`; comprobar relación de aspecto y que no desborde.
5. **`min-h-screen`/`h-80`**: `about.vue:245` usa `h-80` (fijo) y el layout `min-height: calc(100vh - 80px)`
   con `100vh`, sensible a la barra dinámica de iOS (mejor `dvh/svh`).
6. **Objetivos táctiles**: botones de icono (`p-2`, `text-sm`) pueden quedar por debajo de 24×24 px.

**Recomendación.** Reproducir cada caso en 320×568 y en móvil horizontal; añadir `overflow-x:auto` a tablas y
código, `scroll-margin-top` a anclas y `dvh/svh` donde aplique.

**Verificación de la corrección.** Sin `scrollWidth > clientWidth` a 320 px en ninguna ruta; objetivos
táctiles ≥ 24×24.

---

## Verificado y correcto

- Lighthouse móvil (412 px) no detecta scroll horizontal ni elementos fuera de pantalla en las plantillas probadas.
- Tamaño de página y composición se adaptan en las capturas de móvil/escritorio (sin solapamientos visibles).
- Uso de utilidades responsive coherentes (`grid-cols-1 md:...`, `sm:`, `max-w-*`).
- `h1` de página con escalado `text-4xl/5xl → sm:text-6xl → md:text-8xl` según convención.
