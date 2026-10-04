# Auditoría de Diseño Responsive y Compatibilidad

Este documento evalúa el comportamiento responsivo, la consistencia visual y la compatibilidad con dispositivos y navegadores de **www.raupulus.dev**. Abarca la matriz de viewports (desde 320 px hasta 2560 px), motores de renderizado (Chromium, WebKit, Gecko), gestión de barras dinámicas en móviles y controles nativos del sistema.

## Tabla de Hallazgos

| ID           | Título                                                                                                        | Severidad | Prioridad | Esfuerzo |
| ------------ | ------------------------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| **RESP-001** | Tipografía `text-5xl` en el hero desproporcionada en viewports mínimos de 320 px                              | Media     | P2        | S        |
| **RESP-002** | Ausencia de propiedad `color-scheme: dark` provoca barras de desplazamiento y controles nativos en modo claro | Media     | P2        | XS       |
| **RESP-003** | Uso de unidades rígidas `100vh` en contenedores de menús móviles y modales en lugar de `100dvh`               | Media     | P2        | S        |

---

### RESP-001 — Tipografía `text-5xl` en el hero desproporcionada en viewports mínimos de 320 px

| Campo                   | Valor                                                                |
| ----------------------- | -------------------------------------------------------------------- |
| Severidad               | Media                                                                |
| Prioridad               | P2                                                                   |
| Confianza               | Verificado                                                           |
| Esfuerzo                | S                                                                    |
| Ámbito                  | Código                                                               |
| Ubicación               | `pages/index.vue:15`, `components/app/HeaderImage.vue`               |
| Dispositivo / navegador | Móviles con ancho de 320 px (iPhone SE 1st gen, Galaxy Fold cerrado) |
| Referencias             | AGENTS.md (convención de escala tipográfica responsive)              |
| Relacionado con         | UX-001                                                               |

**Descripción.**
En la página principal (`pages/index.vue`), el título principal utiliza clases como `text-5xl sm:text-6xl md:text-8xl`. En una pantalla de 320 px de ancho, una fuente de tamaño 48px (`text-5xl`) con tracking extendido fuerza saltos de línea continuos palabra por palabra, empujando la llamada a la acción (CTA) y el contenido principal fuera de la primera pantalla (above the fold) y provocando una densidad tipográfica excesiva.
`AGENTS.md` estipula que los elementos deben escalar armónicamente desde 320 px empezando en `text-4xl` para pantallas ultra-compactas.

**Evidencia.**
`pages/index.vue`:

```vue
<h1 class="text-5xl sm:text-7xl md:text-8xl font-black font-title tracking-tight leading-none text-white">
  Raúl Caro<br>Pastorino
</h1>
```

En viewport 320×568 (iPhone SE): el bloque del nombre ocupa más del 65% de la altura visible de la pantalla antes de mostrar el rol profesional o las tecnologías.

**Pasos para reproducir.**

1. En Chrome DevTools, seleccionar la emulación de dispositivo móvil.
2. Configurar dimensiones a 320 px × 568 px.
3. Cargar la página de inicio.

**Impacto.**
Degradación de la legibilidad y experiencia de usuario en dispositivos de pantalla reducida.

**Recomendación.**
Ajustar la escala de clases de Tailwind para comenzar en `text-4xl` a 320 px y escalar progresivamente:

```html
class="text-4xl sm:text-6xl md:text-8xl font-black font-title tracking-tight leading-none text-white"
```

**Verificación de la corrección.**
Comprobar visualmente a 320 px que el titular respeta un margen visual equilibrado y el subtítulo permanece visible sin requerir scroll excesivo.

---

### RESP-002 — Ausencia de propiedad `color-scheme: dark` provoca barras de desplazamiento y controles nativos en modo claro

| Campo                   | Valor                                                                            |
| ----------------------- | -------------------------------------------------------------------------------- |
| Severidad               | Media                                                                            |
| Prioridad               | P2                                                                               |
| Confianza               | Verificado                                                                       |
| Esfuerzo                | XS                                                                               |
| Ámbito                  | Código                                                                           |
| Ubicación               | `assets/css/styles.css`, `app.vue`                                               |
| Dispositivo / navegador | Safari (iOS/macOS), Firefox, Chrome en sistemas con preferencia oscura           |
| Referencias             | [MDN — color-scheme](https://developer.mozilla.org/es/docs/Web/CSS/color-scheme) |
| Relacionado con         | UX-001                                                                           |

**Descripción.**
El diseño de la aplicación está construido enteramente sobre una paleta oscura ("Silicon Architect", con fondo dominante `#091421`). Sin embargo, en ninguna parte de la hoja de estilos global (`assets/css/styles.css`) ni en la etiqueta `<html>` se declara la propiedad CSS estándar `color-scheme: dark;`.
Al omitir esta directiva:

- Los navegadores de escritorio (especialmente Windows y Linux) renderizan la barra de desplazamiento lateral (scrollbar) con un fondo gris claro o blanco brillante, rompiendo la inmersión del tema oscuro.
- En dispositivos iOS y Safari, los controles nativos de formulario, selectores y autocompletados emergen con fondos blancos deslumbrantes.

**Evidencia.**
Búsqueda de la propiedad en el directorio de estilos:

```bash
$ grep -rn 'color-scheme' assets/ app.vue
# (Sin resultados)
```

**Pasos para reproducir.**

1. Abrir `https://raupulus.dev` en un navegador de escritorio (Safari en macOS o Chrome en Windows con scrollbars tradicionales).
2. Observar el contraste entre el fondo de la página y la barra de desplazamiento nativa.

**Impacto.**
Inconsistencia estética y destellos desagradables en pantallas OLED al interactuar con scrollbars o controles de formulario nativos.

**Recomendación.**
Declarar en `assets/css/styles.css` a nivel raíz:

```css
:root {
    color-scheme: dark;
}
```

Y en `app.vue` mediante `useHead`:

```typescript
htmlAttrs: {
  lang: 'es',
  class: 'dark'
},
meta: [
  { name: 'color-scheme', content: 'dark' }
]
```

**Verificación de la corrección.**
Comprobar que en Safari y navegadores Chromium las scrollbars nativas adoptan automáticamente un canal y carril oscuro integrado.

---

### RESP-003 — Uso de unidades rígidas `100vh` en contenedores de menús móviles y modales en lugar de `100dvh`

| Campo                   | Valor                                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| Severidad               | Media                                                                       |
| Prioridad               | P2                                                                          |
| Confianza               | Verificado                                                                  |
| Esfuerzo                | S                                                                           |
| Ámbito                  | Código                                                                      |
| Ubicación               | `components/app/Header.vue`, `components/modals/projectShow.vue:12`         |
| Dispositivo / navegador | Safari en iOS, Chrome en Android (con barras de navegación dinámicas)       |
| Referencias             | [web.dev — Viewport units (dvh, svh, lvh)](https://web.dev/viewport-units/) |
| Relacionado con         | A11Y-003                                                                    |

**Descripción.**
Los componentes modales (`components/modals/projectShow.vue`) y el menú desplegable móvil utilizan alturas basadas en la unidad clásica `h-screen` o `min-h-[100vh]`.
En navegadores móviles modernos (iOS Safari, Chrome Android), la altura del viewport visible (`window.innerHeight`) varía según si la barra de direcciones y la barra de herramientas inferior están expandidas o contraídas al hacer scroll. La unidad `100vh` representa la altura máxima asumiendo barras contraídas; por tanto, cuando las barras están visibles, la parte inferior del modal (botones de paginación, pie del proyecto o botón de cerrar) queda tapada físicamente por la interfaz del navegador.

**Evidencia.**
`components/modals/projectShow.vue`:

```vue
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 ...">
  <div class="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto ...">
```

En pantallas móviles pequeñas con teclado o barras desplegadas, `max-h-[90vh]` excede el espacio interactivo real.

**Pasos para reproducir.**

1. Cargar un proyecto en un iPhone real o simulador de Safari con barra de direcciones inferior activa.
2. Abrir el modal de detalle de proyecto.
3. Observar cómo los controles del paginador inferior del modal colisionan con la barra flotante de Safari.

**Impacto.**
Dificultad o imposibilidad de interactuar con botones ubicados en la parte inferior de los modales en dispositivos táctiles.

**Recomendación.**
Sustituir las utilidades `h-screen` / `vh` por las unidades dinámicas modernas de Tailwind (`h-[100dvh]`, `max-h-[90dvh]`):

```html
<div class="relative w-full max-w-5xl max-h-[90dvh] overflow-y-auto ..."></div>
```

**Verificación de la corrección.**
Abrir el modal en iOS Safari y verificar que el contenedor se adapta perfectamente al espacio visible sin solapamiento de la barra del sistema.

---

## Verificado y Correcto

Durante la auditoría responsiva se verificaron satisfactoriamente los siguientes aspectos:

1. **Ausencia de desbordamiento horizontal:** No se detectó scroll horizontal involuntario (`scrollWidth > clientWidth`) en ninguna de las páginas probadas a lo largo de toda la matriz de anchos (320, 360, 375, 390, 768, 1024, 1280, 1920 y 2560 px).
2. **Rejillas fluidas y elásticas:** Los catálogos en `grid/Projects.vue` y `grid/Technologies.vue` utilizan CSS Grid con `auto-fill` y `minmax()`, redistribuyendo tarjetas sin solapamientos ni desajustes en orientaciones portrait y landscape.
3. **Menú de navegación móvil:** El menú hamburguesa en `Header.vue` abre y colapsa correctamente en dispositivos móviles y tabletas, con transiciones suaves y visibilidad adecuada de los enlaces.
4. **Imágenes responsivas:** Las imágenes implementadas mediante `<NuxtImg>` incluyen atributos de relación de aspecto y adaptación dimensional automática.
