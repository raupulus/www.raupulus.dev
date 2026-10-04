# 08 · Accesibilidad (WCAG 2.2 A/AA)

> Método: axe-core 4 con Playwright/Chromium (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` y
> `best-practice`) en 8 rutas × 2 viewports + 5 estados (menú móvil, modal de proyecto, formulario con errores,
> modal de confirmación y galería), recorridos de teclado automatizados, cálculo de contrastes de todos los tokens
> del design system y revisión de código. Resultados en `evidencias/axe/axe-chromium.json`.

## Resumen

axe detecta **3 tipos de violaciones `serious`** (contraste, campo sin nombre accesible y región con scroll no
enfocable) y 2 `moderate` (orden de encabezados y contenido fuera de landmarks). La revisión manual encuentra
barreras más graves que axe no ve: **las tarjetas de proyecto y los filtros de tecnología no se pueden usar con
teclado ni con lector de pantalla**, así que la sección principal del portfolio es inaccesible para esos usuarios.
Además, el modal de proyecto no gestiona el foco, se cierra con un `<span>` sin rol y en móvil queda bajo el header.
**Conformidad estimada: no cumple WCAG 2.2 nivel A** (incumple 1.1.1, 1.3.1, 2.1.1, 2.4.1, 2.4.3, 3.3.1, 3.3.2 y 4.1.2).

| ID       | Título                                                                                      | Severidad | Prioridad | Esfuerzo |
| -------- | ------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| A11Y-001 | Contraste insuficiente en el footer de todas las páginas, en `/blog`, en hovers y en bordes | Alta      | P1        | XS       |
| A11Y-002 | Tarjetas de proyecto y filtros de tecnología inaccesibles con teclado y lector de pantalla  | Alta      | P1        | S        |
| A11Y-003 | Modal de proyecto: cierre sin rol, foco no atrapado ni devuelto, paginador no operable      | Alta      | P1        | M        |
| A11Y-004 | Alternativas textuales genéricas o incorrectas (galería, GIF, iconos)                       | Media     | P2        | S        |
| A11Y-005 | Formulario de contacto: mensaje sin nombre accesible y errores no asociados ni anunciados   | Alta      | P1        | S        |
| A11Y-006 | Saltos en la jerarquía de encabezados                                                       | Baja      | P3        | XS       |
| A11Y-007 | Movimiento: scroll suave por JS sin respetar `prefers-reduced-motion` y GIF animados        | Baja      | P3        | XS       |
| A11Y-008 | Sin enlace «Saltar al contenido»; el menú móvil no se cierra con Esc                        | Media     | P2        | XS       |
| A11Y-009 | Botón «copiar» de los bloques de código: SVG clicable sin rol, nombre ni feedback           | Baja      | P3        | XS       |

---

### A11Y-001 — Contraste insuficiente

| Campo                   | Valor                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Severidad               | Alta                                                                                                                                                                                                                                                                                                   |
| Prioridad               | P1                                                                                                                                                                                                                                                                                                     |
| Confianza               | Verificado (axe + cálculo de tokens)                                                                                                                                                                                                                                                                   |
| Esfuerzo                | XS                                                                                                                                                                                                                                                                                                     |
| Ámbito                  | Código                                                                                                                                                                                                                                                                                                 |
| Ubicación               | `components/app/Footer.vue:10,19,25,34` (`text-outline-variant`), `pages/blog.vue:46` (`opacity-60`), botones con `from-primary to-primary-container` y `hover:bg-primary-container` (`pages/index.vue:32,280`, `pages/contact.vue:646`, `Header.vue:34`), bordes de inputs (`border-outline-variant`) |
| Dispositivo / navegador | Todos                                                                                                                                                                                                                                                                                                  |
| Referencias             | WCAG 1.4.3 (AA), 1.4.11 (AA)                                                                                                                                                                                                                                                                           |
| Relacionado con         | UX-006                                                                                                                                                                                                                                                                                                 |

**Descripción.** Ratios calculados con los tokens de `tailwind.config.ts` (tabla completa en el anexo):

| Par                                                                                   | Ratio     | Requisito | Estado                  |
| ------------------------------------------------------------------------------------- | --------- | --------- | ----------------------- |
| `outline-variant #414751` sobre `background #091421` (footer, 12 px)                  | 1,98:1    | 4,5:1     | ❌                      |
| `on-primary #00315c` sobre `primary-container #3272b8` (gradiente y hover de botones) | 2,66:1    | 4,5:1     | ❌                      |
| Texto de `/blog` con `opacity-60` (`#575f6b` sobre `#0e1926`, 10 px)                  | 2,74:1    | 4,5:1     | ❌                      |
| `outline #8b919c` sobre `surface-container-highest`                                   | 3,91:1    | 4,5:1     | ❌                      |
| Borde de input `outline-variant` sobre `surface-container-lowest`                     | 2,06:1    | 3:1       | ❌ (1.4.11)             |
| `primary-container #3272b8` como texto sobre fondos oscuros                           | 2,5–3,9:1 | 4,5:1     | ❌ (si se usa en texto) |

axe: `color-contrast` (serious) con 4 nodos en **todas** las páginas (footer) y 22 en `/blog`.

**Recomendación.** Footer y texto secundario en `text-outline` (5,85:1 sobre `background`) u `on-surface-variant`;
botones con fondo sólido `bg-primary` (7,75:1) y un hover que no reduzca el contraste (`hover:bg-primary-fixed`);
en `/blog`, quitar `opacity-60` y usar `text-outline`; bordes de input al menos `outline` (≥ 3:1).

**Verificación de la corrección.** axe sin `color-contrast` en ninguna ruta.

---

### A11Y-002 — Tarjetas de proyecto y filtros de tecnología inaccesibles con teclado

| Campo                   | Valor                                                                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                                                                                 |
| Prioridad               | P1                                                                                                                                                                   |
| Confianza               | Verificado (recorrido de teclado automatizado)                                                                                                                       |
| Esfuerzo                | S                                                                                                                                                                    |
| Ámbito                  | Código                                                                                                                                                               |
| Ubicación               | `components/card/ProjectVertical.vue:25-28`, `components/card/ProjectHorizontal.vue` (`<div @click>`), `components/grid/Technologies.vue:26-30` (`<NuxtImg @click>`) |
| Dispositivo / navegador | Teclado, lectores de pantalla y control por voz                                                                                                                      |
| Referencias             | WCAG 2.1.1 (A), 4.1.2 (A), 2.4.4 (A)                                                                                                                                 |
| Relacionado con         | SEO-001, A11Y-003                                                                                                                                                    |

**Descripción.** La tarjeta que abre un proyecto es un `<div>` con `@click`, sin `tabindex`, rol ni enlace. Los
filtros de tecnología son imágenes con `@click`. Al tabular por `/projects` con 15 proyectos cargados, el foco pasa
del botón «Limpiar búsqueda» directamente al footer.

**Evidencia.** Recorrido de 60 pulsaciones de Tab:

```text
a:RAÚL CARO PASTORINO | a:INICIO | … | input:Buscar proyecto | button:BUSCAR | button:Limpiar búsqueda |
a:POLÍTICA DE PRIVACIDAD | a:CONTACTO | a:CÓDIGO DE ESTA WEB | button:Aceptar | button:Gestionar Cookies | body …
enlaces <a> a /projects/* en el listado: 0
```

**Impacto.** Quien navega con teclado o lector de pantalla no puede abrir ningún proyecto ni filtrar por tecnología:
la sección principal del portfolio es inaccesible.

**Recomendación.** Cada tarjeta como `<NuxtLink :to="`/projects/${project.slug}`">` (con el título dentro de un
`h2`/`h3`), y los filtros como `<button type="button" :aria-pressed="selected">` con el nombre de la tecnología.

**Verificación de la corrección.** Tab alcanza cada tarjeta y cada filtro; Enter abre el proyecto; NVDA o VoiceOver
anuncian «enlace, <título del proyecto>».

---

### A11Y-003 — Modal de proyecto no accesible

| Campo                   | Valor                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                              |
| Prioridad               | P1                                                                                                |
| Confianza               | Verificado                                                                                        |
| Esfuerzo                | M                                                                                                 |
| Ámbito                  | Código                                                                                            |
| Ubicación               | `components/modals/projectShow.vue:2,25-29,34-38`, `components/content/contentPaginator.vue:3-45` |
| Dispositivo / navegador | Teclado y lectores de pantalla                                                                    |
| Referencias             | WCAG 2.1.1, 2.4.3, 2.4.11, 4.1.2; WAI-ARIA APG «Dialog (Modal)»                                   |
| Relacionado con         | BUG-003, RESP-001, UX-003                                                                         |

**Descripción.**

- El cierre es `<span class="modal-project-show-header-close" @click>X</span>`: no es enfocable, no tiene rol ni nombre
  accesible y el lector anuncia «X».
- El foco va al contenedor (`tabindex="-1"`, correcto), pero no está atrapado: tras 5 Tab sale al footer de la página
  de fondo (escenario 3: `a.font-body … inModal=false`). El fondo no tiene `inert` ni `aria-hidden`.
- Al cerrar, el foco no vuelve a la tarjeta de origen.
- El paginador del proyecto (páginas 1, 2, 3 y flechas) son `<span @click>`, inoperables con teclado, y las flechas
  SVG no tienen texto.
- axe `scrollable-region-focusable` (serious): `.modal-project-show-body` tiene scroll y no es enfocable.
- En móvil, el header fijo tapa el cierre (RESP-001).

**Recomendación.** Usar el elemento nativo `<dialog>` con `showModal()` (foco atrapado y fondo inerte de serie) o un
componente probado. Cierre con `<button type="button" aria-label="Cerrar proyecto">`. Paginador como
`<nav aria-label="Páginas del proyecto">` con enlaces o botones y `aria-current="page"`. `tabindex="0"` en el cuerpo
con scroll. Devolver el foco al disparador al cerrar.

**Verificación de la corrección.** Con teclado: abrir, recorrer todo el modal sin salir, cerrar con el botón (Enter)
o con Esc, y comprobar que el foco vuelve a la tarjeta. axe sin violaciones en el estado «modal abierto».

---

### A11Y-004 — Alternativas textuales genéricas o incorrectas

| Campo                   | Valor                                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                   |
| Prioridad               | P2                                                                                                                                      |
| Confianza               | Verificado                                                                                                                              |
| Esfuerzo                | S                                                                                                                                       |
| Ámbito                  | Código                                                                                                                                  |
| Ubicación               | `pages/about.vue:321`, `components/modals/submitContact.vue:95`, `components/content/blocks/BlockQuote.vue:4`, `pages/index.vue:84-116` |
| Dispositivo / navegador | Lectores de pantalla                                                                                                                    |
| Referencias             | WCAG 1.1.1 (A)                                                                                                                          |
| Relacionado con         | SEO-010, BUG-013                                                                                                                        |

**Descripción.** Las 50 fotos de la galería tienen `alt="Imagen N de la galería sobre mí"`, que no describe nada. El
GIF de «procesando» dice «Email Enviado». El SVG de comillas usa un atributo `title` (no es accesible; debería ser un
elemento `<title>` o `aria-hidden="true"`). En los hexágonos de tecnologías, el texto visible y el `alt`/`title` se
duplican («PHP» + «Lenguaje de Programación PHP»).

**Recomendación.** `alt` descriptivos en la galería; `alt=""` en imágenes decorativas cuyo texto ya está presente;
`aria-hidden="true"` en los SVG decorativos.

---

### A11Y-005 — Formulario de contacto: campo sin nombre accesible y errores no anunciados

| Campo                   | Valor                                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                                                                                  |
| Prioridad               | P1                                                                                                                                                                    |
| Confianza               | Verificado (axe + revisión de código)                                                                                                                                 |
| Esfuerzo                | S                                                                                                                                                                     |
| Ámbito                  | Código                                                                                                                                                                |
| Ubicación               | `pages/contact.vue:596-606` (`span[role=textbox][contenteditable]` y `<label>` sin `for`), `:524-531` (errores en `<span>`), `components/modals/submitContact.vue:50` |
| Dispositivo / navegador | Lectores de pantalla y control por voz                                                                                                                                |
| Referencias             | WCAG 1.3.1, 3.3.1, 3.3.2, 4.1.2 (A); 4.1.3 (AA)                                                                                                                       |
| Relacionado con         | BUG-007                                                                                                                                                               |

**Descripción.**

- El campo «Mensaje» es un `<span role="textbox" contenteditable>` sin `aria-label` ni `aria-labelledby`, y su
  `<label>` no está asociada (axe `aria-input-field-name`, serious). Le falta `aria-multiline="true"`.
- Los errores se muestran en `<span>` debajo del campo, sin `aria-describedby`, sin `aria-invalid` y sin región
  `aria-live`: el lector no anuncia nada al pulsar «Enviar».
- Los campos obligatorios no están marcados (`required` / `aria-required`) ni hay leyenda de obligatoriedad.
- El modal de confirmación (`role="dialog"`) no mueve el foco a su contenido ni lo atrapa, y los pasos «procesando» y
  «enviado» no se anuncian.

**Recomendación.** `<textarea id="message">` visible con `<label for="message">` (BUG-007); `aria-invalid` y
`aria-describedby` apuntando al error; un resumen de errores con `role="alert"` al enviar; `required` en los campos;
y en el modal, foco inicial en el título y `aria-live="polite"` para el estado.

**Verificación de la corrección.** axe sin `aria-input-field-name`; VoiceOver anuncia «Mensaje, campo de texto,
obligatorio, no válido: El mensaje debe tener al menos 30 caracteres».

---

### A11Y-006 — Saltos en la jerarquía de encabezados

| Campo                   | Valor                                                           |
| ----------------------- | --------------------------------------------------------------- |
| Severidad               | Baja                                                            |
| Prioridad               | P3                                                              |
| Confianza               | Verificado (axe `heading-order`, moderate)                      |
| Esfuerzo                | XS                                                              |
| Ámbito                  | Código                                                          |
| Ubicación               | `/projects`, `/about`, `/social`, `/contact`, modal de proyecto |
| Dispositivo / navegador | Lectores de pantalla                                            |
| Referencias             | WCAG 1.3.1 (A), 2.4.6 (AA)                                      |
| Relacionado con         | SEO-009                                                         |

**Descripción.** Los títulos de sección y de tarjeta saltan de `h1` a `h3` en `/projects`, `/about`, `/social`,
`/contact` y el modal de proyecto (axe `heading-order`), lo que dificulta la navegación por encabezados con lector de
pantalla. Detalle en SEO-009.

**Recomendación.** Usar `h2` para las secciones y los títulos de tarjeta, y mapear los niveles de `BlockHeader`
dentro de un proyecto a `h2`-`h4`.

---

### A11Y-007 — Movimiento sin respetar `prefers-reduced-motion`

| Campo                   | Valor                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                                              |
| Prioridad               | P3                                                                                                                |
| Confianza               | Verificado (revisión de código)                                                                                   |
| Esfuerzo                | XS                                                                                                                |
| Ámbito                  | Código                                                                                                            |
| Ubicación               | `middleware/scroll-to-top.global.ts:5` (`behavior: 'smooth'`), `components/modals/submitContact.vue:95,121` (GIF) |
| Dispositivo / navegador | Usuarios con sensibilidad vestibular                                                                              |
| Referencias             | WCAG 2.3.3 (AAA, buena práctica), 2.2.2 (A)                                                                       |
| Relacionado con         | —                                                                                                                 |

**Descripción.** La regla global de `assets/css/styles.css` desactiva animaciones y `scroll-behavior` con
`prefers-reduced-motion`, pero `window.scrollTo({ behavior: 'smooth' })` por JavaScript la ignora. Los GIF animados
del modal de envío se reproducen en bucle sin control de pausa (2.2.2 exige poder pausar si duran más de 5 s; aquí
dependen de la duración del envío).

**Recomendación.** `behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'`; sustituir
los GIF por un spinner CSS (que respeta la media query) o un vídeo sin bucle.

---

### A11Y-008 — Sin enlace «Saltar al contenido» y menú móvil sin Esc

| Campo                   | Valor                                                         |
| ----------------------- | ------------------------------------------------------------- |
| Severidad               | Media                                                         |
| Prioridad               | P2                                                            |
| Confianza               | Verificado                                                    |
| Esfuerzo                | XS                                                            |
| Ámbito                  | Código                                                        |
| Ubicación               | `layouts/default.vue:6-12`, `components/app/Header.vue:40-78` |
| Dispositivo / navegador | Teclado                                                       |
| Referencias             | WCAG 2.4.1 (A), 2.1.2; APG «Disclosure»                       |
| Relacionado con         | —                                                             |

**Descripción.** El primer Tab va al logotipo; no hay enlace para saltar las 8 entradas del header hasta `<main>`. El
menú móvil sigue abierto tras pulsar Esc (escenario 4: `mobile-menu-escape {"stillOpen":1}`). No hay
`scroll-padding-top`, así que al tabular hacia atrás el header fijo puede tapar el elemento enfocado (2.4.11).

**Recomendación.** `<a href="#app-box-content" class="sr-only focus:not-sr-only …">Saltar al contenido</a>` como primer
elemento; cerrar el menú con Esc y devolver el foco al botón; `html { scroll-padding-top: 5rem; }`.

---

### A11Y-009 — Botón «copiar» de los bloques de código sin rol, nombre ni feedback

| Campo                   | Valor                                           |
| ----------------------- | ----------------------------------------------- |
| Severidad               | Baja                                            |
| Prioridad               | P3                                              |
| Confianza               | Verificado (revisión de código)                 |
| Esfuerzo                | XS                                              |
| Ámbito                  | Código                                          |
| Ubicación               | `components/content/blocks/BlockCode.vue:11-16` |
| Dispositivo / navegador | Teclado y lectores de pantalla                  |
| Referencias             | WCAG 2.1.1, 4.1.2, 4.1.3                        |
| Relacionado con         | BUG-006                                         |

**Descripción.** El `<svg @click="copyCode">` no es enfocable, no tiene nombre y no confirma la copia.

**Recomendación.** `<button type="button" aria-label="Copiar código">` con un mensaje «Copiado» en `aria-live`.

---

## Tabla de conformidad WCAG 2.2 (A y AA)

Leyenda: ✅ cumple · ❌ no cumple · ➖ no aplica · ⚠️ no verificado.

| Criterio                                     | Nivel | Estado | Notas                                                                                                     |
| -------------------------------------------- | ----- | ------ | --------------------------------------------------------------------------------------------------------- |
| 1.1.1 Contenido no textual                   | A     | ❌     | A11Y-004                                                                                                  |
| 1.2.1 Solo audio y solo vídeo (grabado)      | A     | ➖     | Sin contenido multimedia propio (los embeds de proyectos dependen de la API).                             |
| 1.2.2 Subtítulos (grabado)                   | A     | ⚠️     | Vídeos de YouTube embebidos en proyectos: depende del contenido externo.                                  |
| 1.2.3 Audiodescripción o alternativa         | A     | ⚠️     | Ídem.                                                                                                     |
| 1.3.1 Información y relaciones               | A     | ❌     | A11Y-005 (label no asociada), A11Y-006                                                                    |
| 1.3.2 Secuencia significativa                | A     | ✅     | El orden del DOM coincide con el visual.                                                                  |
| 1.3.3 Características sensoriales            | A     | ✅     | —                                                                                                         |
| 1.4.1 Uso del color                          | A     | ✅     | Los errores del formulario tienen texto además del borde rojo.                                            |
| 1.4.2 Control del audio                      | A     | ✅     | No hay audio automático.                                                                                  |
| 2.1.1 Teclado                                | A     | ❌     | A11Y-002, A11Y-003, A11Y-009                                                                              |
| 2.1.2 Sin trampas para el foco               | A     | ✅     | No hay trampas (el problema del modal es el contrario: el foco se escapa).                                |
| 2.1.4 Atajos de teclado                      | A     | ✅     | Solo flechas y Esc dentro de la galería.                                                                  |
| 2.2.1 Tiempo ajustable                       | A     | ✅     | El tiempo mínimo anti-bot (3 s) no limita al usuario.                                                     |
| 2.2.2 Pausar, detener, ocultar               | A     | ⚠️     | GIF del modal de envío (A11Y-007); animaciones `pulse` en bucle.                                          |
| 2.3.1 Umbral de tres destellos               | A     | ✅     | —                                                                                                         |
| 2.4.1 Evitar bloques                         | A     | ❌     | A11Y-008                                                                                                  |
| 2.4.2 Titulado de páginas                    | A     | ✅     | Título único por página.                                                                                  |
| 2.4.3 Orden del foco                         | A     | ❌     | A11Y-003 (el foco sale del modal)                                                                         |
| 2.4.4 Propósito de los enlaces               | A     | ✅     | Los enlaces tienen texto descriptivo; las tarjetas no son enlaces (A11Y-002).                             |
| 2.5.1 Gestos del puntero                     | A     | ✅     | —                                                                                                         |
| 2.5.2 Cancelación del puntero                | A     | ✅     | `click` estándar.                                                                                         |
| 2.5.3 Etiqueta en el nombre                  | A     | ✅     | —                                                                                                         |
| 2.5.4 Activación por movimiento              | A     | ➖     | —                                                                                                         |
| 3.1.1 Idioma de la página                    | A     | ✅     | `lang="es"`                                                                                               |
| 3.2.1 Al recibir el foco                     | A     | ✅     | —                                                                                                         |
| 3.2.2 Al recibir entradas                    | A     | ✅     | El filtro de tecnología lanza una búsqueda al hacer clic (acción explícita).                              |
| 3.2.6 Ayuda coherente                        | A     | ✅     | Contacto en el header y el footer de todas las páginas.                                                   |
| 3.3.1 Identificación de errores              | A     | ❌     | A11Y-005 (no se asocian ni se anuncian)                                                                   |
| 3.3.2 Etiquetas o instrucciones              | A     | ❌     | A11Y-005 (campo «Mensaje»)                                                                                |
| 3.3.7 Entrada redundante                     | A     | ✅     | —                                                                                                         |
| 4.1.2 Nombre, función, valor                 | A     | ❌     | A11Y-002, A11Y-003, A11Y-005, A11Y-009                                                                    |
| 1.2.4 Subtítulos (en directo)                | AA    | ➖     | —                                                                                                         |
| 1.2.5 Audiodescripción (grabado)             | AA    | ⚠️     | Contenido externo.                                                                                        |
| 1.3.4 Orientación                            | AA    | ✅     | Sin bloqueo de orientación.                                                                               |
| 1.3.5 Identificar el propósito de la entrada | AA    | ✅     | `autocomplete="name"` y `"email"`.                                                                        |
| 1.4.3 Contraste (mínimo)                     | AA    | ❌     | A11Y-001                                                                                                  |
| 1.4.4 Cambio de tamaño del texto             | AA    | ⚠️     | No automatizado; unidades `rem` en el design system.                                                      |
| 1.4.5 Imágenes de texto                      | AA    | ✅     | —                                                                                                         |
| 1.4.10 Reflow                                | AA    | ❌     | RESP-002 (home a 320 px)                                                                                  |
| 1.4.11 Contraste no textual                  | AA    | ❌     | A11Y-001 (bordes de input)                                                                                |
| 1.4.12 Espaciado del texto                   | AA    | ⚠️     | No probado con bookmarklet.                                                                               |
| 1.4.13 Contenido con hover o foco            | AA    | ✅     | Solo `title` nativos.                                                                                     |
| 2.4.5 Múltiples vías                         | AA    | ✅     | Menú, footer y sitemap.                                                                                   |
| 2.4.6 Encabezados y etiquetas                | AA    | ⚠️     | Encabezados descriptivos, con jerarquía irregular (A11Y-006).                                             |
| 2.4.7 Foco visible                           | AA    | ✅     | Contorno por defecto del navegador; los inputs cambian el color del borde. Mejorable con `focus-visible`. |
| 2.4.11 Foco no oculto (mínimo)               | AA    | ❌     | RESP-001 (header sobre el modal) y A11Y-008                                                               |
| 2.5.7 Movimientos de arrastre                | AA    | ✅     | —                                                                                                         |
| 2.5.8 Tamaño del objetivo (mínimo)           | AA    | ⚠️     | Botones ≥ 24 px; el paginador del modal (`span`) no medido.                                               |
| 3.1.2 Idioma de las partes                   | AA    | ✅     | Términos técnicos en inglés aceptables.                                                                   |
| 3.2.3 Navegación coherente                   | AA    | ✅     | —                                                                                                         |
| 3.2.4 Identificación coherente               | AA    | ✅     | —                                                                                                         |
| 3.3.3 Sugerencias ante errores               | AA    | ✅     | Los mensajes indican cómo corregir.                                                                       |
| 3.3.4 Prevención de errores                  | AA    | ✅     | El formulario muestra un resumen de confirmación antes de enviar.                                         |
| 3.3.8 Autenticación accesible (mínima)       | AA    | ✅     | reCAPTCHA v3 es invisible (sin prueba cognitiva).                                                         |
| 4.1.3 Mensajes de estado                     | AA    | ❌     | A11Y-005                                                                                                  |

**Resultado:** 13 criterios incumplidos (8 de nivel A y 5 de nivel AA), 8 no verificados, 3 no aplicables y 31 cumplidos (55 criterios A/AA de WCAG 2.2).

## Verificado y correcto

- ✅ La galería de `/about` es un buen ejemplo: botones con `aria-label`, flechas y Esc, y miniaturas como `<button>`.
- ✅ El menú móvil tiene `aria-expanded`, `aria-controls` y `aria-label` dinámico («Abrir menú» / «Cerrar menú»).
- ✅ `MaterialIcon` se renderiza con `aria-hidden="true"`; los botones solo con icono revisados («Limpiar búsqueda»,
  «Quitar filtro de tecnología», menú) tienen `aria-label`.
- ✅ Landmarks: `header`, `nav` con `aria-label`, `main` único y `footer role="contentinfo"`.
- ✅ La regla global `prefers-reduced-motion` de `styles.css` cubre las animaciones CSS.
- ✅ El honeypot del formulario está oculto con `aria-hidden` y `tabindex="-1"`.

## No verificado

- ⚠️ **Lector de pantalla real** (VoiceOver, NVDA, TalkBack): no se ha podido manejar VoiceOver desde el entorno.
  Las conclusiones sobre anuncios se basan en el árbol de accesibilidad (axe) y el código.
- ⚠️ **Zoom al 200 %/400 % y espaciado de texto (1.4.4 y 1.4.12):** no automatizados.
- ⚠️ **Banner de cookies de terceros:** axe no ha marcado violaciones en él; su navegación por teclado (Tab llega a
  «Aceptar» y «Gestionar Cookies») es correcta, pero no se ha auditado el modal de configuración.
