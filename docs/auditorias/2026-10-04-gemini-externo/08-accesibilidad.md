# Auditoría de Accesibilidad Web (WCAG 2.2 AA)

Este documento presenta los resultados de la auditoría de accesibilidad sobre **www.raupulus.dev**, conforme a las Pautas de Accesibilidad para el Contenido Web (**WCAG 2.2**, niveles A y AA). Combina análisis automatizado con `axe-core` y `pa11y`, inspección del árbol de accesibilidad y pruebas de navegación por teclado y lector de pantalla (VoiceOver en macOS).

## Tabla de Hallazgos

| ID           | Título                                                                                            | Severidad | Prioridad | Esfuerzo | Criterio WCAG                                |
| ------------ | ------------------------------------------------------------------------------------------------- | --------- | --------- | -------- | -------------------------------------------- |
| **A11Y-001** | Ratio de contraste insuficiente (1.98:1) en textos y enlaces secundarios del pie de página        | Alta      | P1        | XS       | 1.4.3 Contraste (mínimo) (AA)                |
| **A11Y-002** | Formulario de contacto carece de botón semántico `type="submit"` e ignora tecla Enter             | Alta      | P1        | XS       | 3.2.2 Al recibir entradas (A), 4.1.2         |
| **A11Y-003** | Modales sin atrapamiento de foco (`focus trap`) ni `aria-modal="true"`; foco escapa al fondo      | Alta      | P1        | M        | 2.4.3 Orden del foco (A)                     |
| **A11Y-004** | Bloques de lista en contenidos EditorJS renderizados con `<div>` en vez de `<ul>`/`<ol>` y `<li>` | Media     | P2        | S        | 1.3.1 Información y relaciones (A)           |
| **A11Y-005** | Tablas de datos sin elemento `<caption>` ni atributo `scope` en encabezados                       | Media     | P2        | S        | 1.3.1 Información y relaciones (A)           |
| **A11Y-006** | Botón de cierre en modales carece de nombre accesible (`aria-label`) y elemento `<button>`        | Media     | P2        | XS       | 4.1.2 Nombre, función, valor (A)             |
| **A11Y-007** | Botones de solo icono carecen de etiqueta accesible `aria-label` en tarjetas y cabeceras          | Media     | P2        | S        | 4.1.2 Nombre, función, valor (A)             |
| **A11Y-008** | Navegación con scroll forzado suave (`smooth`) sin respetar `prefers-reduced-motion`              | Baja      | P3        | XS       | 2.3.3 Animación desde interacciones (AAA/AA) |

---

### A11Y-001 — Ratio de contraste insuficiente (1.98:1) en textos y enlaces secundarios del pie de página

| Campo                   | Valor                              |
| ----------------------- | ---------------------------------- |
| Severidad               | Alta                               |
| Prioridad               | P1                                 |
| Confianza               | Verificado                         |
| Esfuerzo                | XS                                 |
| Ámbito                  | Código                             |
| Ubicación               | `components/app/Footer.vue:24-45`  |
| Dispositivo / navegador | Todos                              |
| Referencias             | WCAG 2.2 Criterio 1.4.3 (Nivel AA) |
| Relacionado con         | —                                  |

**Descripción.**
En el componente `components/app/Footer.vue`, los textos de copyright, créditos de desarrollo y enlaces secundarios de navegación legal utilizan la clase de utilidad Tailwind `text-outline-variant` (color `#43474e`). Al renderizarse sobre el fondo oscuro corporativo `#091421` (o `#0e1b2a`), el ratio de contraste medido es de tan solo **1.98:1**.
El criterio de conformidad 1.4.3 de WCAG 2.2 exige un ratio mínimo de **4.5:1** para texto normal y de 3:1 para texto de gran tamaño. Usuarios con visión reducida, presbicia o que visualizan la pantalla en exteriores bajo luz solar directa no pueden leer este contenido.

**Evidencia.**
Salida de `pa11y` (`evidencias/axe/pa11y-home.txt`):

```text
 • Error: This element has insufficient contrast at 1.98:1.
   The expected contrast ratio is 4.5:1.
   Path: html > body > div#__nuxt > div > footer > div > p.text-outline-variant
```

**Pasos para reproducir.**

1. Ejecutar `npx pa11y http://localhost:4173/`.
2. O bien inspeccionar los elementos del footer con el selector de color de Chrome DevTools.

**Impacto.**
Incumplimiento directo de nivel AA de WCAG 2.2 en todas las páginas del sitio web (el footer es global).

**Recomendación.**
Sustituir la clase `text-outline-variant` en el footer por el token `text-outline` (`#8d9199`) o `text-on-surface-variant` (`#c3c6cf`), alcanzando un ratio superior a 5.5:1:

```html
<p class="text-xs text-on-surface-variant">
    © {{ new Date().getFullYear() }} Raúl Caro Pastorino. Todos los derechos reservados.
</p>
```

**Verificación de la corrección.**
Ejecutar `pa11y` y comprobar que desaparecen todos los errores asociados al selector `footer p` y `footer a`.

---

### A11Y-002 — Formulario de contacto carece de botón semántico `type="submit"` e ignora tecla Enter

| Campo                   | Valor                                                       |
| ----------------------- | ----------------------------------------------------------- |
| Severidad               | Alta                                                        |
| Prioridad               | P1                                                          |
| Confianza               | Verificado                                                  |
| Esfuerzo                | XS                                                          |
| Ámbito                  | Código                                                      |
| Ubicación               | `pages/contact.vue:105-115`                                 |
| Dispositivo / navegador | Teclado, lectores de pantalla, móviles                      |
| Referencias             | WCAG 2.2 Criterio 3.2.2 (Nivel A), Criterio 4.1.2 (Nivel A) |
| Relacionado con         | BUG-001, UX-001                                             |

**Descripción.**
El formulario de contacto en `pages/contact.vue` está contenido en una etiqueta `<form @submit.prevent>`, pero el botón para realizar el envío está declarado como `<button type="button" @click="handleSubmit">`.
Al no poseer el atributo nativo `type="submit"`, el formulario viola dos expectativas críticas de accesibilidad y usabilidad:

1. Al rellenar los campos de entrada de texto (nombre, correo o asunto) y presionar la tecla `Enter`, el formulario no se dispara, dejando al usuario sin feedback sobre cómo proceder.
2. Tecnologías de asistencia no identifican el botón como la acción de envío del formulario al consultar los puntos de referencia y atajos de controles.

**Evidencia.**
`pages/contact.vue`:

```vue
<button
    type="button"
    :disabled="isLoading"
    class="w-full py-3 px-6 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors"
    @click="handleSubmit"
>
  {{ isLoading ? 'Enviando...' : 'Enviar mensaje' }}
</button>
```

**Pasos para reproducir.**

1. Rellenar los campos del formulario en `/contact`.
2. Presionar `Enter` estando en el campo de asunto.
3. Observar que no ocurre ninguna acción.

**Impacto.**
Barrera de entrada para usuarios que dependen exclusivamente del teclado o comandos de voz.

**Recomendación.**
Modificar el botón a `type="submit"` y delegar el evento en el propio formulario:

```html
<form @submit.prevent="handleSubmit">
    ...
    <button type="submit" :disabled="isLoading">{{ isLoading ? 'Enviando...' : 'Enviar mensaje' }}</button>
</form>
```

**Verificación de la corrección.**
Comprobar que situando el foco en un input y pulsando `Enter`, se invoca inmediatamente la validación y el envío del formulario.

---

### A11Y-003 — Modales sin atrapamiento de foco (`focus trap`) ni `aria-modal="true"`; foco escapa al fondo

| Campo                   | Valor                                                                   |
| ----------------------- | ----------------------------------------------------------------------- |
| Severidad               | Alta                                                                    |
| Prioridad               | P1                                                                      |
| Confianza               | Verificado                                                              |
| Esfuerzo                | M                                                                       |
| Ámbito                  | Código                                                                  |
| Ubicación               | `components/modals/projectShow.vue`, `components/modals/ImageSlide.vue` |
| Dispositivo / navegador | Teclado, lectores de pantalla (VoiceOver / NVDA)                        |
| Referencias             | WCAG 2.2 Criterio 2.4.3 (Nivel A), WAI-ARIA Dialog Pattern              |
| Relacionado con         | BUG-007, RESP-003                                                       |

**Descripción.**
Cuando se abre un modal de detalle de proyecto o la galería de imágenes, el componente no implementa el patrón de diálogo accesible WAI-ARIA:

- No incluye el atributo `aria-modal="true"`.
- No oculta el árbol DOM subyacente con `inert` o `aria-hidden="true"`.
- **No atrapa el foco del teclado:** al navegar con `Tab`, tras recorrer los enlaces internos del modal, el cursor de foco sale del diálogo y continúa tabulando por los enlaces y botones invisibles de la página de fondo que se encuentra tapada por la capa oscura.
- Al cerrar el modal con la tecla Escape o el ratón, no se devuelve el foco al botón que originó la apertura.

**Evidencia.**
Prueba manual con navegación Tab en `/projects/nestor`: el foco recorre los controles del modal y seguidamente salta al menú de navegación del `Header` oculto tras el backdrop.

**Pasos para reproducir.**

1. Navegar a un proyecto para abrir el modal.
2. Pulsar repetidamente `Tab`.
3. Observar cómo el cuadro de foco azul desaparece del modal e interactúa con el contenido subyacente.

**Impacto.**
Desorientación total para personas ciegas o con movilidad reducida que navegan por teclado.

**Recomendación.**

1. Añadir `role="dialog"`, `aria-modal="true"` y `aria-labelledby="modal-title"` al contenedor principal.
2. Incorporar una directiva o composable de atrapamiento de foco (como `focus-trap` o `@vueuse/integrations/useFocusTrap`).
3. Aplicar `inert` al elemento `#main-content` mientras el modal permanezca abierto.
4. Restaurar el foco en el disparador al cerrarse.

**Verificación de la corrección.**
Comprobar con `Tab` y `Shift+Tab` que el cursor cicla indefinidamente dentro de los controles del modal sin saltar al fondo.

---

### A11Y-004 — Bloques de lista en contenidos EditorJS renderizados con `<div>` en vez de `<ul>`/`<ol>` y `<li>`

| Campo                   | Valor                                               |
| ----------------------- | --------------------------------------------------- |
| Severidad               | Media                                               |
| Prioridad               | P2                                                  |
| Confianza               | Verificado                                          |
| Esfuerzo                | S                                                   |
| Ámbito                  | Código                                              |
| Ubicación               | `components/content/blocks/BlockListItems.vue:2-12` |
| Dispositivo / navegador | Lectores de pantalla (VoiceOver, NVDA, JAWS)        |
| Referencias             | WCAG 2.2 Criterio 1.3.1 (Nivel A)                   |
| Relacionado con         | SEO-005                                             |

**Descripción.**
El componente encargado de mostrar listas procedentes del backend (`BlockListItems.vue`) renderiza los elementos utilizando etiquetas `<div>` con viñetas simuladas mediante CSS en lugar de las etiquetas semánticas de HTML `<ul>` (desordenada), `<ol>` (ordenada) y `<li>` (ítem de lista).
Al carecer de semántica de lista, los lectores de pantalla anuncian cada línea como un párrafo ordinario, sin informar al usuario de que se trata de una lista, el número total de elementos ni la posición actual (ej. "elemento 2 de 5").

**Evidencia.**
`components/content/blocks/BlockListItems.vue`:

```vue
<template>
    <div class="my-4 space-y-2">
        <div v-for="(item, index) in block.data.items" :key="index" class="flex items-start gap-2 text-on-surface">
            <span class="inline-block w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <span v-html="sanitizeHtml(item)" />
        </div>
    </div>
</template>
```

**Pasos para reproducir.**

1. Cargar la vista de un proyecto que contenga una lista.
2. Inspeccionar con el lector de pantalla VoiceOver (atajo `VO + Flechas`).

**Impacto.**
Pérdida de estructura semántica y dificultad de asimilación auditiva para usuarios de tecnologías de asistencia.

**Recomendación.**
Refactorizar a elementos semánticos según `block.data.style`:

```vue
<component
    :is="block.data.style === 'ordered' ? 'ol' : 'ul'"
    :class="block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'"
    class="my-4 pl-6 space-y-2 text-on-surface"
>
  <li v-for="(item, index) in block.data.items" :key="index">
    <span v-html="sanitizeHtml(item)" />
  </li>
</component>
```

**Verificación de la corrección.**
VoiceOver debe anunciar: "Lista, 5 elementos", y al navegar por cada ítem: "1 de 5", "2 de 5", etc.

---

### A11Y-005 — Tablas de datos sin elemento `<caption>` ni atributo `scope` en encabezados

| Campo                   | Valor                                           |
| ----------------------- | ----------------------------------------------- |
| Severidad               | Media                                           |
| Prioridad               | P2                                              |
| Confianza               | Verificado                                      |
| Esfuerzo                | S                                               |
| Ámbito                  | Código                                          |
| Ubicación               | `components/content/blocks/BlockTable.vue:3-25` |
| Dispositivo / navegador | Lectores de pantalla                            |
| Referencias             | WCAG 2.2 Criterio 1.3.1 (Nivel A)               |
| Relacionado con         | —                                               |

**Descripción.**
El componente `BlockTable.vue` genera tablas de datos sin incorporar la etiqueta `<caption>` (descripción accesible de la tabla) y renderiza las celdas de cabecera `<th>` omitiendo el atributo `scope="col"` o `scope="row"`.
Sin estos atributos, los usuarios de lectores de pantalla no disponen de contexto sobre el propósito de la tabla antes de entrar en ella, y al desplazarse celda por celda no se anuncia el encabezado correspondiente a la columna actual.

**Evidencia.**
`components/content/blocks/BlockTable.vue`:

```vue
<table class="w-full border-collapse my-4">
  <thead v-if="block.data.withHeadings">
    <tr>
      <th v-for="(cell, i) in block.data.content[0]" :key="i" class="...">
        <span v-html="sanitizeHtml(cell)" />
      </th>
    </tr>
  </thead>
```

**Pasos para reproducir.**

1. Cargar una tabla en un proyecto y examinar los atributos de la etiqueta `<table>` y `<th>`.

**Impacto.**
Inaccesibilidad de datos estructurados para usuarios con discapacidad visual.

**Recomendación.**
Añadir `scope="col"` a los encabezados de columna y una descripción o encabezado accesible:

```html
<th v-for="(cell, i) in headings" :key="i" scope="col" class="..."></th>
```

**Verificación de la corrección.**
Validar con el inspector de accesibilidad de DevTools que el nodo tabla tiene asignados correctamente los headers por columna.

---

### A11Y-006 — Botón de cierre en modales carece de nombre accesible (`aria-label`) y elemento `<button>`

| Campo                   | Valor                                         |
| ----------------------- | --------------------------------------------- |
| Severidad               | Media                                         |
| Prioridad               | P2                                            |
| Confianza               | Verificado                                    |
| Esfuerzo                | XS                                            |
| Ámbito                  | Código                                        |
| Ubicación               | `components/modals/projectShow.vue:20`        |
| Dispositivo / navegador | Lectores de pantalla y navegación por teclado |
| Referencias             | WCAG 2.2 Criterio 4.1.2 (Nivel A)             |
| Relacionado con         | A11Y-003                                      |

**Descripción.**
El botón para cerrar el modal de detalle de proyecto está construido con un `<span>` que contiene una letra "X" estilizada con `@click="closeModal"`, en lugar de un elemento `<button>` con un nombre accesible explícito:

```html
<span class="absolute top-4 right-4 cursor-pointer text-2xl" @click="closeModal">✕</span>
```

Al ser un `<span>`, el elemento no es enfocable con el teclado (falta `tabindex="0"`) y en un lector de pantalla se lee simplemente como el caracter "por" o "letra equis", sin indicar que es un botón interactivo destinado a cerrar la ventana.

**Evidencia.**
Inspección de `components/modals/projectShow.vue:20`.

**Pasos para reproducir.**

1. Abrir un modal de proyecto.
2. Intentar alcanzar el botón de cerrar utilizando únicamente la tecla `Tab`.
3. Comprobar que el foco lo ignora por completo.

**Impacto.**
Imposibilidad de cerrar el modal con teclado a menos que se pulse Escape (y si el listener de Escape no captura el evento, el usuario queda atrapado).

**Recomendación.**
Sustituir por un botón semántico con etiqueta accesible:

```html
<button
    type="button"
    aria-label="Cerrar detalle del proyecto"
    class="absolute top-4 right-4 p-2 text-on-surface hover:text-primary transition-colors"
    @click="closeModal"
>
    <UiMaterialIcon name="close" class="w-6 h-6" />
</button>
```

**Verificación de la corrección.**
El botón debe recibir foco con Tab y anunciarse como "Cerrar detalle del proyecto, botón".

---

### A11Y-007 — Botones de solo icono carecen de etiqueta accesible `aria-label` en tarjetas y cabeceras

| Campo                   | Valor                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| Severidad               | Media                                                                    |
| Prioridad               | P2                                                                       |
| Confianza               | Verificado                                                               |
| Esfuerzo                | S                                                                        |
| Ámbito                  | Código                                                                   |
| Ubicación               | `components/card/Project.vue`, `components/content/blocks/BlockCode.vue` |
| Dispositivo / navegador | Lectores de pantalla                                                     |
| Referencias             | WCAG 2.2 Criterio 4.1.2 (Nivel A)                                        |
| Relacionado con         | —                                                                        |

**Descripción.**
Varios componentes interactivos utilizan botones que albergan únicamente un icono SVG (por ejemplo, el botón para copiar fragmentos de código al portapapeles en `BlockCode.vue` o enlaces con logos de repositorios en tarjetas de proyectos) sin suministrar el atributo `aria-label` ni texto oculto mediante una clase de sólo lectura (`sr-only`).
Un lector de pantalla anuncia estos controles de forma anónima ("botón"), obligando al usuario a adivinar la función del botón.

**Evidencia.**
`components/content/blocks/BlockCode.vue`:

```vue
<button class="p-1 hover:bg-surface-variant rounded" @click="copyCode">
  <UiMaterialIcon name="content_copy" class="w-4 h-4" />
</button>
```

**Pasos para reproducir.**

1. Inspeccionar el botón de copiado en `BlockCode.vue` con el inspector de accesibilidad.
2. Observar la propiedad "Name" (Nombre accesible): aparece vacía (`""`).

**Impacto.**
Falta de información crítica para personas que operan mediante voz o lectores de pantalla.

**Recomendación.**
Añadir `aria-label="Copiar código al portapapeles"` en `BlockCode.vue` y etiquetas equivalentes en todos los botones de icono.

**Verificación de la corrección.**
Comprobar con `axe-core` que la regla `button-name` pasa con 0 violaciones en todas las páginas.

---

### A11Y-008 — Navegación con scroll forzado suave (`smooth`) sin respetar `prefers-reduced-motion`

| Campo                   | Valor                                                   |
| ----------------------- | ------------------------------------------------------- |
| Severidad               | Baja                                                    |
| Prioridad               | P3                                                      |
| Confianza               | Verificado                                              |
| Esfuerzo                | XS                                                      |
| Ámbito                  | Código                                                  |
| Ubicación               | `middleware/scroll-to-top.global.ts:5-8`                |
| Dispositivo / navegador | Usuarios con trastornos vestibulares / cinetosis        |
| Referencias             | WCAG 2.2 Criterio 2.3.3 (Nivel AAA / buena práctica AA) |
| Relacionado con         | —                                                       |

**Descripción.**
El middleware global de enrutamiento `middleware/scroll-to-top.global.ts` fuerza la animación de desplazamiento vertical en cada cambio de ruta:

```typescript
window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
});
```

Aunque `assets/css/styles.css` contiene una media query de `prefers-reduced-motion` a nivel de CSS, las llamadas programáticas directas a la API nativa `window.scrollTo({ behavior: 'smooth' })` sobreescriben la preferencia del sistema operativo, forzando animaciones de desplazamiento continuo que pueden provocar mareos y náuseas a personas con trastornos vestibulares.

**Evidencia.**
Inspección de `middleware/scroll-to-top.global.ts`.

**Pasos para reproducir.**

1. En macOS, activar en Ajustes del Sistema > Accesibilidad > Pantalla > "Reducir movimiento".
2. Navegar entre páginas del sitio web y observar que la página continúa realizando el scroll suave de forma forzada.

**Impacto.**
Malestar físico y desconfort para usuarios con sensibilidad al movimiento.

**Recomendación.**
Comprobar la preferencia del usuario antes de invocar la animación:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
window.scrollTo({
    top: 0,
    left: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
});
```

**Verificación de la corrección.**
Con "Reducir movimiento" activado, la navegación debe cambiar la posición al inicio instantáneamente sin transición.

---

## Tabla de Conformidad WCAG 2.2 (Niveles A y AA)

A continuación se detalla la conformidad criterio por criterio conforme a la especificación oficial del W3C:

### Principio 1: Perceptible

| Criterio                                         | Nivel | Estado            | Justificación / Hallazgo                                                  |
| ------------------------------------------------ | ----- | ----------------- | ------------------------------------------------------------------------- |
| **1.1.1 Contenido no textual**                   | A     | ❌ No cumple      | Hallazgo A11Y-006, A11Y-007 (iconos y botones sin texto alternativo)      |
| **1.2.1 Solo audio y solo vídeo (grabado)**      | A     | ➖ No aplica      | No hay contenido pregrabado de solo audio o vídeo                         |
| **1.2.2 Subtítulos (grabados)**                  | A     | ➖ No aplica      | No se publican vídeos sincronizados                                       |
| **1.2.3 Audiodescripción o medio alternativo**   | A     | ➖ No aplica      | No aplica                                                                 |
| **1.2.4 Subtítulos (en directo)**                | AA    | ➖ No aplica      | No hay retransmisiones en directo                                         |
| **1.2.5 Audiodescripción (grabada)**             | AA    | ➖ No aplica      | No aplica                                                                 |
| **1.3.1 Información y relaciones**               | A     | ❌ No cumple      | Hallazgo A11Y-004 (listas `div`), A11Y-005 (tablas sin `caption`/`scope`) |
| **1.3.2 Secuencia con significado**              | A     | ✅ Cumple         | La lectura por el DOM sigue el orden lógico de presentación               |
| **1.3.3 Características sensoriales**            | A     | ✅ Cumple         | Las instrucciones no dependen únicamente de forma, tamaño o posición      |
| **1.3.4 Orientación**                            | AA    | ✅ Cumple         | No se bloquea el giro entre vertical y horizontal                         |
| **1.3.5 Identificación del propósito del input** | AA    | ⚠️ No verificable | Requiere atributos `autocomplete` en formulario de contacto               |
| **1.4.1 Uso del color**                          | A     | ✅ Cumple         | La información no se transmite únicamente por color (iconos de apoyo)     |
| **1.4.2 Control de audio**                       | A     | ➖ No aplica      | No hay reproducción automática de audio                                   |
| **1.4.3 Contraste (mínimo)**                     | AA    | ❌ No cumple      | Hallazgo A11Y-001 (footer ratio 1.98:1 frente al 4.5:1 exigido)           |
| **1.4.4 Cambio de tamaño del texto**             | AA    | ✅ Cumple         | La interfaz soporta escalado de texto al 200% sin romperse                |
| **1.4.5 Imágenes de texto**                      | AA    | ✅ Cumple         | Todo el texto está generado mediante tipografía real vectorial            |
| **1.4.10 Reflujo (Reflow)**                      | AA    | ✅ Cumple         | El sitio fluye correctamente a 320 px sin scroll horizontal               |
| **1.4.11 Contraste no textual**                  | AA    | ✅ Cumple         | Los bordes de inputs y componentes interactivos superan 3:1               |
| **1.4.12 Espaciado del texto**                   | AA    | ✅ Cumple         | La maqueta soporta la sobreescritura de alturas de línea y espaciados     |
| **1.4.13 Contenido en hover o foco**             | AA    | ✅ Cumple         | No hay tooltips que oculten contenido sin poder descartarse con Esc       |

### Principio 2: Operable

| Criterio                                         | Nivel | Estado            | Justificación / Hallazgo                                      |
| ------------------------------------------------ | ----- | ----------------- | ------------------------------------------------------------- |
| **2.1.1 Teclado**                                | A     | ❌ No cumple      | Hallazgo A11Y-006 (cierre de modales inaccesible por teclado) |
| **2.1.2 Sin trampas para el foco**               | A     | ✅ Cumple         | No se producen bloqueos permanentes de foco                   |
| **2.1.4 Atajos de teclas de un solo carácter**   | A     | ➖ No aplica      | No se implementan atajos de un solo carácter                  |
| **2.2.1 Tiempo ajustable**                       | A     | ➖ No aplica      | No hay límites de tiempo en sesiones o lecturas               |
| **2.2.2 Pausar, detener, ocultar**               | A     | ✅ Cumple         | No hay animaciones cíclicas de más de 5 segundos sin control  |
| **2.3.1 Umbral de tres destellos**               | A     | ✅ Cumple         | Ningún elemento emite destellos estroboscópicos               |
| **2.4.1 Evitar bloques (Skip to content)**       | A     | ⚠️ No verificable | Carece de enlace visible "Saltar al contenido principal"      |
| **2.4.2 Titulado de páginas**                    | A     | ❌ No cumple      | Hallazgo SEO-001 / BUG-003 (títulos duplicados en proyectos)  |
| **2.4.3 Orden del foco**                         | A     | ❌ No cumple      | Hallazgo A11Y-003 (foco escapa de modales a la capa trasera)  |
| **2.4.4 Propósito de los enlaces (en contexto)** | A     | ✅ Cumple         | El texto de los enlaces describe su destino                   |
| **2.4.5 Múltiples vías**                         | AA    | ✅ Cumple         | Navegación por menú, enlaces directos y buscador de proyectos |
| **2.4.6 Encabezados y etiquetas**                | AA    | ✅ Cumple         | Los encabezados y campos tienen etiquetas descriptivas        |
| **2.4.7 Foco visible**                           | AA    | ✅ Cumple         | Contornos visibles de foco en elementos interactivos activos  |
| **2.4.11 Foco no tapado (mínimo)**               | AA    | ✅ Cumple         | El foco no queda oculto bajo cabeceras fijas                  |
| **2.5.1 Gestos de puntero**                      | A     | ✅ Cumple         | No se requieren gestos multipunto complejos para operar       |
| **2.5.2 Cancelación del puntero**                | A     | ✅ Cumple         | Las acciones se disparan en el evento `up` (click estándar)   |
| **2.5.3 Inclusión de la etiqueta en el nombre**  | A     | ✅ Cumple         | El nombre accesible coincide con el texto visible             |
| **2.5.7 Movimientos de arrastre**                | AA    | ➖ No aplica      | No hay elementos que requieran arrastre para interactuar      |
| **2.5.8 Tamaño del objetivo (mínimo)**           | AA    | ✅ Cumple         | Los objetivos táctiles superan los 24×24 px requeridos        |

### Principio 3: Comprensible

| Criterio                                              | Nivel | Estado       | Justificación / Hallazgo                                          |
| ----------------------------------------------------- | ----- | ------------ | ----------------------------------------------------------------- |
| **3.1.1 Idioma de la página**                         | A     | ✅ Cumple    | Atributo `lang="es"` declarado en `html`                          |
| **3.1.2 Idioma de partes**                            | AA    | ➖ No aplica | No hay fragmentos extensos en lenguas extranjeras                 |
| **3.2.1 Al recibir el foco**                          | A     | ✅ Cumple    | Ningún control desencadena cambios de contexto al recibir foco    |
| **3.2.2 Al recibir entradas**                         | A     | ❌ No cumple | Hallazgo A11Y-002 (formulario de contacto sin botón submit)       |
| **3.2.3 Navegación coherente**                        | AA    | ✅ Cumple    | La barra de navegación y el footer mantienen el mismo orden       |
| **3.2.4 Identificación coherente**                    | AA    | ✅ Cumple    | Los componentes funcionales mantienen iconos y etiquetas estables |
| **3.2.6 Ayuda coherente**                             | A     | ➖ No aplica | No hay sistemas de soporte o chat en vivo integrados              |
| **3.3.1 Identificación de errores**                   | A     | ✅ Cumple    | Los errores de formulario se señalan en texto                     |
| **3.3.2 Etiquetas o instrucciones**                   | A     | ✅ Cumple    | Todos los campos disponen de etiquetas visuales                   |
| **3.3.3 Sugerencias ante errores**                    | AA    | ✅ Cumple    | Se indica el motivo exacto del fallo de validación                |
| **3.3.4 Prevención de errores (legales/financieros)** | AA    | ➖ No aplica | No hay transacciones financieras o legales                        |
| **3.3.7 Entrada redundante**                          | A     | ➖ No aplica | No hay procesos de formulario multipaso                           |
| **3.3.8 Autenticación accesible (mínimo)**            | AA    | ➖ No aplica | No hay pantalla de inicio de sesión de usuario público            |

### Principio 4: Robusto

| Criterio                         | Nivel | Estado            | Justificación / Hallazgo                                              |
| -------------------------------- | ----- | ----------------- | --------------------------------------------------------------------- |
| **4.1.2 Nombre, función, valor** | A     | ❌ No cumple      | Hallazgos A11Y-002, A11Y-003, A11Y-006, A11Y-007                      |
| **4.1.3 Mensajes de estado**     | AA    | ⚠️ No verificable | El formulario carece de `aria-live` para anunciar el estado del envío |

---

## Verificado y Correcto

1. **Estructura jerárquica clara de la plantilla:** Las páginas principales implementan elementos estructurales `header`, `main` y `footer` correctamente delimitados.
2. **Excelente visibilidad del foco en navegación de escritorio:** Los enlaces y botones presentan anillos de foco nítidos (`outline: 2px solid theme('colors.primary')`) al tabular con el teclado.
3. **Escalado de fuentes al 200% verificado:** El sitio responde al zoom sin rotura de layouts ni solapamiento de textos gracias al empleo de unidades relativas `rem` y utilidades de Tailwind.
4. **Validación de errores de formulario en texto:** No se recurre exclusivamente al color rojo para señalar inputs erróneos; se inserta un mensaje de texto descriptivo bajo cada campo.
