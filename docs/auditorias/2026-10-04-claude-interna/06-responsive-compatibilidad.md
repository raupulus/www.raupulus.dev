# 06 · Responsive y compatibilidad entre dispositivos y navegadores

## Resumen

Se han ejecutado **300 cargas automatizadas** (10 rutas × 15 viewports × 2 motores: Chromium y WebKit) sobre el
build local con datos (`http://localhost:3020`, backend local con 16 proyectos), además de capturas de página
completa y escenarios interactivos. Firefox no ha podido ejecutarse (ver «No verificado»). El diseño es sólido en
tablet y escritorio, pero en móvil hay **tres problemas que afectan a todas las visitas**: la home desborda
horizontalmente en todos los teléfonos, el modal de proyecto queda con su botón de cierre **debajo del header
fijo**, y el banner de cookies ocupa casi la mitad de la pantalla.

| ID       | Título                                                                                    | Severidad | Prioridad | Esfuerzo |
| -------- | ----------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| RESP-001 | En móvil el header fijo tapa el botón de cerrar del modal de proyecto                     | Alta      | P1        | XS       |
| RESP-002 | Scroll horizontal en la home en todos los móviles (320–430 px) por «ESPECIALIZACIONES»    | Alta      | P1        | XS       |
| RESP-003 | El banner de cookies ocupa ~45 % de la pantalla en móvil y tapa CTAs y contenido          | Media     | P2        | XS       |
| RESP-004 | `word-break: break-all` parte las palabras por la mitad en el contenido de los proyectos  | Media     | P2        | XS       |
| RESP-005 | Modales con `100vw`/`100vh`: barra dinámica de iOS y ancho de la barra de scroll          | Media     | P2        | S        |
| RESP-006 | Imágenes sin dimensiones en el filtro de tecnologías e iconos sociales (saltos de layout) | Media     | P2        | S        |
| RESP-007 | El texto del buscador de proyectos queda debajo del icono de lupa                         | Baja      | P3        | XS       |
| RESP-008 | `rounded-full` redefinido a `0.75rem`: los círculos del diseño se ven como cuadrados      | Baja      | P3        | XS       |

---

### RESP-001 — En móvil el header fijo tapa el botón de cerrar del modal de proyecto

| Campo                   | Valor                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Severidad               | Alta                                                                                                                                                                           |
| Prioridad               | P1                                                                                                                                                                             |
| Confianza               | Verificado                                                                                                                                                                     |
| Esfuerzo                | XS                                                                                                                                                                             |
| Ámbito                  | Código                                                                                                                                                                         |
| Ubicación               | `components/modals/projectShow.vue:112-126` (`z-index: 11`), `components/app/Header.vue:4` (`z-50`), `projectShow.vue:260-269` (cierre `position:absolute; top:0` en < 650 px) |
| Dispositivo / navegador | Móvil < 650 px (Chromium y WebKit, 390×844)                                                                                                                                    |
| Referencias             | WCAG 2.4.11 (foco no tapado), 2.5.8                                                                                                                                            |
| Relacionado con         | BUG-003, A11Y-003                                                                                                                                                              |

**Descripción.** El modal usa `z-index: 11` y el header `z-50` (50), así que el header se pinta encima del modal. En
pantallas de menos de 650 px el botón «X» se coloca en `top: 0; right: 0`, justo bajo el header.

**Evidencia.** `document.elementFromPoint` en el centro del botón de cierre:

```text
desktop 1440×900  topElementAtClose: SPAN.modal-project-show-header-close   ← accesible
mobile  390×844   topElementAtClose: NAV.flex justify-between items-center   ← tapado por el header
```

Captura `evidencias/capturas/local__projects-modal__390x844__chromium.jpg`: el header «RAÚL CARO PASTORINO» cubre la
parte superior del modal y el título de la página.

**Impacto.** En un teléfono no hay forma visible de cerrar el modal: la «X» está tapada, no hay tecla Esc y el gesto
atrás no lo cierra (BUG-003). El usuario queda atrapado en el contenido del proyecto.

**Recomendación.** Dar al modal un `z-index` superior al header (`z-[60]`, como ya hace `ImageSlide.vue` con
`z-[1000]`), o bien ocultar el header mientras el modal está abierto. Reservar `padding-top` para el área segura
(`env(safe-area-inset-top)`).

**Verificación de la corrección.** En 390×844, `elementFromPoint` sobre la «X» devuelve el propio botón y un tap
cierra el modal.

---

### RESP-002 — Scroll horizontal en la home en todos los móviles

| Campo                   | Valor                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                              |
| Prioridad               | P1                                                                                                                |
| Confianza               | Verificado                                                                                                        |
| Esfuerzo                | XS                                                                                                                |
| Ámbito                  | Código                                                                                                            |
| Ubicación               | `pages/index.vue:159` (`<h2 class="font-headline text-5xl font-black tracking-tighter …">ESPECIALIZACIONES</h2>`) |
| Dispositivo / navegador | 320, 360, 375, 390, 412 y 430 px · Chromium y WebKit                                                              |
| Referencias             | WCAG 1.4.10 (Reflow); convención de `AGENTS.md` («todo elemento nuevo debe funcionar desde 320px»)                |
| Relacionado con         | —                                                                                                                 |

**Descripción.** El título de sección es una sola palabra de 17 letras en mayúsculas con `text-5xl` (48 px) y
`font-black`, que no puede partirse. Mide ~437 px y amplía el documento por encima del viewport. Al ocultar solo esa
sección, el ancho vuelve a 375 px.

**Evidencia.** Matriz responsive (`matriz-pruebas.md`):

```text
== Scroll horizontal == 12
/ c:320x568(437) c:360x800(437) c:375x667(438) c:390x844(437) c:412x915(437) c:430x932(437) w:320x568(437) … w:430x932(437)
```

Captura `evidencias/capturas/local__home-desbordamiento__360-390__chromium-webkit.jpg`: el título se corta («…CIONE»)
y la página se desplaza en horizontal.

**Impacto.** En la página de entrada, el usuario de móvil puede desplazar la página lateralmente, el layout «baila»
al hacer scroll y el título queda cortado.

**Recomendación.** `text-3xl sm:text-5xl`, o `break-words hyphens-auto` con `lang="es"`. Aplicar el mismo criterio a
«STACK TECNOLÓGICO» (`text-4xl md:text-6xl`, que cabe por poco a 320 px).

**Verificación de la corrección.** `document.documentElement.scrollWidth === clientWidth` en 320–430 px.

---

### RESP-003 — El banner de cookies ocupa ~45 % de la pantalla en móvil

| Campo                   | Valor                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| Severidad               | Media                                                            |
| Prioridad               | P2                                                               |
| Confianza               | Verificado                                                       |
| Esfuerzo                | XS                                                               |
| Ámbito                  | Ambos                                                            |
| Ubicación               | `nuxt.config.ts:236-238` (`cookieControl.barPosition`, `colors`) |
| Dispositivo / navegador | Móvil                                                            |
| Referencias             | WCAG 2.4.11; Guía de cookies AEPD 2023                           |
| Relacionado con         | LEGAL-001, UX-005                                                |

**Descripción.** En 390×844, el banner (fondo negro, texto blanco, dos botones a ancho completo) ocupa unos 380 px
de alto. Tapa el CTA «Ver Proyectos» de la home, el buscador de `/projects` y el contenido del modal de proyecto
(capturas `local__moviles-banner-cookies__390__chromium.jpg` y `local__projects-modal__390x844__chromium.jpg`). En
escritorio tapa la esquina inferior derecha del hero.

**Recomendación.** Texto más corto (LEGAL-001), botones en línea (Aceptar / Rechazar / Configurar) y estilo acorde
con el design system (fondo `surface-container-high`, borde `outline-variant`). Altura objetivo en móvil ≤ 25 % del
viewport.

**Verificación de la corrección.** Captura en 390×844 con el banner ≤ 200 px de alto y el CTA principal visible.

---

### RESP-004 — `word-break: break-all` parte las palabras por la mitad

| Campo                   | Valor                                       |
| ----------------------- | ------------------------------------------- |
| Severidad               | Media                                       |
| Prioridad               | P2                                          |
| Confianza               | Verificado                                  |
| Esfuerzo                | XS                                          |
| Ámbito                  | Código                                      |
| Ubicación               | `components/modals/projectShow.vue:234-237` |
| Dispositivo / navegador | Todos (más visible en móvil)                |
| Referencias             | MDN `overflow-wrap`                         |
| Relacionado con         | UX-003                                      |

**Descripción.** `.modal-project-show-body-content { word-break: break-all; }` corta cualquier palabra al final de la
línea: «rel / acionados», «ane / mómetro», «co / nstantemente» (captura del modal en 390 px).

**Recomendación.** `overflow-wrap: anywhere;` (o `break-word`) con `hyphens: auto;`. Solo se parten las palabras que
no caben (URLs largas), no todas.

**Verificación de la corrección.** El texto del proyecto se lee sin cortes a mitad de palabra en 360 px.

---

### RESP-005 — Modales con `100vw`/`100vh`

| Campo                   | Valor                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                               |
| Prioridad               | P2                                                                                                                                  |
| Confianza               | Probable (revisión de código; WebKit headless no reproduce la barra dinámica de Safari iOS)                                         |
| Esfuerzo                | S                                                                                                                                   |
| Ámbito                  | Código                                                                                                                              |
| Ubicación               | `components/modals/projectShow.vue:119-120,133`, `components/modals/submitContact.vue:169`, `app.vue:154`, `layouts/default.vue:24` |
| Dispositivo / navegador | Safari iOS, Chrome Android                                                                                                          |
| Referencias             | web.dev «The large, small, and dynamic viewport units»                                                                              |
| Relacionado con         | RESP-001                                                                                                                            |

**Descripción.** `height: 100vh` en iOS equivale a la altura con la barra de direcciones **oculta**, así que la parte
inferior del modal (paginador del proyecto, botones del modal de envío) queda tapada por la barra cuando está
visible. `width: 100vw` incluye el ancho de la barra de scroll en escritorio Windows y provoca 15 px de desbordamiento.
`body.disable-scroll { height: 100vh; overflow: hidden }` no impide el scroll del fondo en iOS (hace falta
`position: fixed` o `overscroll-behavior`).

**Recomendación.** `height: 100dvh` (con `100vh` de respaldo), `inset: 0` en lugar de `100vw`/`100vh` en los
modales y `overscroll-behavior: contain` en el contenedor con scroll.

---

### RESP-006 — Imágenes sin dimensiones (saltos de layout)

| Campo                   | Valor                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                                                                                                            |
| Prioridad               | P2                                                                                                                                                                               |
| Confianza               | Verificado                                                                                                                                                                       |
| Esfuerzo                | S                                                                                                                                                                                |
| Ámbito                  | Código                                                                                                                                                                           |
| Ubicación               | `components/grid/Technologies.vue:26-30` (`<NuxtImg>` sin `width`/`height`), `components/icons/*.vue:33` (`<img>` con solo `w_32`), `components/modals/submitContact.vue:95,121` |
| Dispositivo / navegador | Todos                                                                                                                                                                            |
| Referencias             | web.dev «Optimize CLS»                                                                                                                                                           |
| Relacionado con         | PERF-004                                                                                                                                                                         |

**Descripción.** Extracción del DOM (Chromium 1280): 7 imágenes sin `width`/`height` en `/` (los iconos sociales
de `components/icons/*.vue`, servidos como `/_ipx/w_32/…`) y 13 en `/projects` (las imágenes del filtro de
tecnologías, que llegan de la API en el cliente). Las imágenes de las tarjetas sí declaran `width="440"
height="300"`. Además, la propia rejilla de proyectos aparece de golpe al llegar los datos, sin hueco reservado.

**Recomendación.** `width`/`height` (o `aspect-ratio`) en todas las `<img>`/`<NuxtImg>` y skeletons para reservar el
hueco de la rejilla de proyectos y del filtro (BUG-005).

---

### RESP-007 — El texto del buscador queda debajo del icono

| Campo                   | Valor                                   |
| ----------------------- | --------------------------------------- |
| Severidad               | Baja                                    |
| Prioridad               | P3                                      |
| Confianza               | Verificado (captura 390×844)            |
| Esfuerzo                | XS                                      |
| Ámbito                  | Código                                  |
| Ubicación               | `pages/projects/[...slugs].vue:172-181` |
| Dispositivo / navegador | Móvil                                   |
| Referencias             | —                                       |
| Relacionado con         | —                                       |

**Descripción.** El `input` tiene `px-4` y el icono está en `absolute right-3`, así que el texto y el placeholder
(«Buscar proye…») pasan por debajo de la lupa. El botón de limpiar solo muestra un icono pequeño (`text-sm`).

**Recomendación.** `pr-10` en el input; en móvil, mostrar el botón «Buscar» como icono para ganar ancho.

---

### RESP-008 — `rounded-full` redefinido a `0.75rem`

| Campo                   | Valor                                                       |
| ----------------------- | ----------------------------------------------------------- |
| Severidad               | Baja                                                        |
| Prioridad               | P3                                                          |
| Confianza               | Verificado (captura 1440×900)                               |
| Esfuerzo                | XS                                                          |
| Ámbito                  | Código                                                      |
| Ubicación               | `tailwind.config.ts:87-92` (`borderRadius.full: '0.75rem'`) |
| Dispositivo / navegador | Todos                                                       |
| Referencias             | `docs/info/design-system.md`                                |
| Relacionado con         | UX-006                                                      |

**Descripción.** El tema redefine `full` como `0.75rem`. Todos los `rounded-full` (puntos de estado, anillo
discontinuo del hero, avatar de `/about`, halos difuminados) se ven como cuadrados redondeados en lugar de círculos.

**Recomendación.** Si el diseño quiere círculos, eliminar la redefinición de `full` y usar un token propio
(`rounded-pill`) para los chips.

---

## Verificado y correcto

- ✅ **Sin scroll horizontal** en `/projects`, un proyecto, `/about`, `/webs`, `/social`, `/contact`, `/privacy`, `/blog`
  ni en la página 404, en los 15 viewports y en ambos motores (276 de 288 combinaciones sin desbordamiento; las 12
  restantes son RESP-002).
- ✅ **Menú móvil:** se abre y se cierra, cambia `aria-expanded` y se cierra al navegar (`@click` en cada enlace).
- ✅ **Tablet y escritorio** (768–2560 px): rejillas correctas, `max-w-7xl` limita la anchura de línea y no hay
  imágenes pixeladas en 2560 px.
- ✅ **Galería de `/about`** (`ImageSlide.vue`): `z-[1000]` por encima del header, botones de 44×44 px, flechas de
  teclado y Esc.
- ✅ **Los `h1` de página escalan** `text-5xl → sm:text-6xl → md:text-8xl` según la convención (salvo `/social`, que
  usa `text-5xl md:text-7xl`, y `/privacy`, con CSS propio).
- ✅ **Sin errores de navegación ni `pageerror`** en las 300 cargas.

## No verificado

- ⚠️ **Firefox:** el binario de Playwright (Firefox 155) no arranca en este macOS 27 («Could not find profile folder»),
  ni dentro ni fuera del sandbox. Recomendación: repetir la matriz en Linux o CI con Firefox.
- ⚠️ **Dispositivos reales** (Safari iOS, Chrome Android, Samsung Internet): no disponibles. WebKit de escritorio no
  reproduce la barra dinámica de iOS ni el teclado virtual (RESP-005 queda como probable).
- ⚠️ **Zoom al 200 % y 400 %, `forced-colors` y modo sin JavaScript:** no se han automatizado. Por revisión de código,
  sin JavaScript se ven las páginas estáticas, pero no el listado de proyectos ni el formulario (dependen del
  cliente).
- ⚠️ **Gestos táctiles** (swipe en la galería): `ImageSlide.vue` no implementa gestos; se navega con botones.
