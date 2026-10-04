# 07 · UX/UI y contenido

> Marco: las 10 heurísticas de usabilidad de Nielsen y el design system «Silicon Architect»
> (`docs/info/design-system.md`, `tailwind.config.ts`).

## Resumen

La nueva interfaz (rama `dev`) es coherente y cuidada en la mayoría de las páginas. Los problemas de UX se concentran
en los puntos donde el sitio depende de piezas antiguas o de terceros: el **modal de proyecto** conserva el estilo
anterior (fondo claro, tipografía y colores fuera del design system, cierre con una «X» de texto), el **formulario de
contacto** convive con un aviso de «fuera de servicio» y el **banner de cookies** no sigue el tema oscuro. En el
contenido hay afirmaciones de actividad en redes difíciles de sostener y el rol profesional se nombra de cinco formas
distintas. Los problemas funcionales (estados de error, búsqueda, historial) están en
[03-bugs-robustez.md](03-bugs-robustez.md).

| ID       | Título                                                                           | Severidad | Prioridad | Esfuerzo |
| -------- | -------------------------------------------------------------------------------- | --------- | --------- | -------- |
| UX-001   | «Blog» en la navegación principal lleva a una página vacía «en construcción»     | Media     | P2        | XS       |
| UX-002   | El formulario de contacto se muestra activo bajo un aviso de «fuera de servicio» | Media     | P1        | XS       |
| UX-003   | El modal de proyecto rompe el design system y dificulta la lectura               | Media     | P2        | M        |
| UX-004   | La página de error no tiene header ni footer                                     | Baja      | P3        | XS       |
| UX-005   | El banner de cookies y la insignia de reCAPTCHA no se integran en el diseño      | Baja      | P3        | XS       |
| UX-006   | Dos sistemas de color en paralelo y colores fijos fuera de los tokens            | Baja      | P3        | S        |
| CONT-001 | Afirmaciones de actividad en redes difíciles de sostener y contradictorias       | Media     | P2        | XS       |
| CONT-002 | El rol profesional se nombra de cinco formas distintas                           | Baja      | P2        | XS       |
| CONT-003 | Erratas, mezcla de tú y usted, y capitalización inconsistente de marcas          | Baja      | P3        | XS       |
| CONT-004 | El correo público se muestra como texto plano, sin enlace `mailto:`              | Baja      | P3        | XS       |

---

### UX-001 — «Blog» en la navegación principal lleva a una página vacía

| Campo                   | Valor                                                                       |
| ----------------------- | --------------------------------------------------------------------------- |
| Severidad               | Media                                                                       |
| Prioridad               | P2                                                                          |
| Confianza               | Verificado                                                                  |
| Esfuerzo                | XS                                                                          |
| Ámbito                  | Ambos                                                                       |
| Ubicación               | `components/app/Header.vue:91-98` (`navLinks`), `pages/blog.vue:1-85`       |
| Dispositivo / navegador | Todos                                                                       |
| Referencias             | Nielsen n.º 2 (coincidencia con el mundo real) y n.º 8 (diseño minimalista) |
| Relacionado con         | SEO-008                                                                     |

**Descripción.** «Blog» es la tercera entrada del menú. La página muestra «EN CONSTRUCCIÓN», «Despliegue en
progreso…» y tres tarjetas de artículos «Próximamente» con opacidad 60 % (con contraste insuficiente, ver A11Y-001).
Está marcada como `noindex`. En producción, el header antiguo enlaza además a `blog.raupulus.dev`, que no resuelve
en DNS.

**Impacto.** Ocupa un hueco de la navegación principal con una promesa sin contenido, lo que resta credibilidad.

**Recomendación.** Quitar «Blog» del menú hasta que haya al menos 3 artículos, o enlazar a un contenido real
(microblog `microblog.fryntiz.dev`, que responde 200).

---

### UX-002 — El formulario de contacto se muestra activo bajo un aviso de «fuera de servicio»

| Campo                   | Valor                                                                         |
| ----------------------- | ----------------------------------------------------------------------------- |
| Severidad               | Media                                                                         |
| Prioridad               | P1                                                                            |
| Confianza               | Verificado                                                                    |
| Esfuerzo                | XS                                                                            |
| Ámbito                  | Ambos                                                                         |
| Ubicación               | `pages/contact.vue:468-484` (aviso), `pages/contact.vue:491-652` (formulario) |
| Dispositivo / navegador | Todos                                                                         |
| Referencias             | Nielsen n.º 1 (visibilidad del estado del sistema)                            |
| Relacionado con         | BUG-004, BUG-007                                                              |

**Descripción.** El aviso dice que el formulario está «Fuera de servicio temporalmente…» y propone usar las redes
sociales, pero justo debajo el formulario está completo y se puede rellenar y enviar. El usuario dedica tiempo a
escribir y el envío probablemente falla (BUG-004). La columna lateral muestra el correo público, que sí funcionaría,
pero sin enlace (CONT-004).

**Recomendación.** Mientras el envío no esté verificado de extremo a extremo: ocultar o deshabilitar el formulario
(`fieldset disabled`) y destacar `mailto:public@raupulus.dev` y LinkedIn como vías alternativas. Cuando funcione,
quitar el aviso.

---

### UX-003 — El modal de proyecto rompe el design system y dificulta la lectura

| Campo                   | Valor                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                  |
| Prioridad               | P2                                                                                     |
| Confianza               | Verificado (capturas 390 y 1440)                                                       |
| Esfuerzo                | M                                                                                      |
| Ámbito                  | Código                                                                                 |
| Ubicación               | `components/modals/projectShow.vue:111-289`, `components/content/contentPaginator.vue` |
| Dispositivo / navegador | Todos                                                                                  |
| Referencias             | Nielsen n.º 4 (consistencia y estándares)                                              |
| Relacionado con         | RESP-001, RESP-004, A11Y-003, SEO-001                                                  |

**Descripción.**

- Fondo `#f1f1f1` y texto `#222` (tema claro) dentro de un sitio oscuro; la cabecera usa `var(--primary)` del sistema
  antiguo (`assets/css/vars.css`).
- Título sobre la imagen de fondo con `text-shadow` como único recurso de contraste: legibilidad variable según la
  imagen.
- `font-size: 2rem` como base del contenedor (`1.1rem` en móvil) y `text-align: center` en todo el contenido.
- El cierre es una «X» de texto en un cuarto de círculo semitransparente (`opacity: 0.4`), poco reconocible.
- El paginador usa `span` con flechas SVG sin texto (A11Y-003).
- La cabecera ocupa 200 px fijos, también en móvil.

**Recomendación.** Rediseñar el detalle de proyecto como página (SEO-001) con los tokens del tema: superficie
`surface-container`, texto `on-surface`, `max-w-prose` alineado a la izquierda y botón de cierre o de volver con
icono y texto.

---

### UX-004 — La página de error no tiene header ni footer

| Campo                   | Valor             |
| ----------------------- | ----------------- |
| Severidad               | Baja              |
| Prioridad               | P3                |
| Confianza               | Verificado        |
| Esfuerzo                | XS                |
| Ámbito                  | Código            |
| Ubicación               | `error.vue:23-58` |
| Dispositivo / navegador | Todos             |
| Referencias             | Nielsen n.º 9     |
| Relacionado con         | SEO-004           |

**Descripción.** `error.vue` no usa `<NuxtLayout>`. La 404 solo ofrece «Volver al Inicio» y «Ver Proyectos», sin
menú, buscador ni footer (enlaces legales). El diseño es correcto y el texto es claro.

**Recomendación.** Envolver en `<NuxtLayout>` y añadir un enlace a contacto y a los proyectos destacados.

---

### UX-005 — El banner de cookies y la insignia de reCAPTCHA no se integran en el diseño

| Campo                   | Valor                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                   |
| Prioridad               | P3                                                                                     |
| Confianza               | Verificado                                                                             |
| Esfuerzo                | XS                                                                                     |
| Ámbito                  | Ambos                                                                                  |
| Ubicación               | `nuxt.config.ts:238-265` (`cookieControl.colors`), `plugins/google-recaptcha.ts:11-16` |
| Dispositivo / navegador | Todos                                                                                  |
| Referencias             | —                                                                                      |
| Relacionado con         | RESP-003, LEGAL-001                                                                    |

**Descripción.** El banner es blanco y negro puro con la tipografía del sistema, y el modal de configuración es
blanco. La insignia de reCAPTCHA aparece en `/contact` abajo a la izquierda. El botón flotante de control de cookies
convive con ella y con el banner.

**Recomendación.** Usar los tokens del tema en `cookieControl.colors` (fondo `#16202e`, botón `#a3c9ff` con texto
`#00315c`, foco `#4cd6ff`). Si se oculta la insignia de reCAPTCHA, incluir el texto legal de Google junto al
formulario.

---

### UX-006 — Dos sistemas de color en paralelo y colores fijos fuera de los tokens

| Campo                   | Valor                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Severidad               | Baja                                                                                                                                                                                                                           |
| Prioridad               | P3                                                                                                                                                                                                                             |
| Confianza               | Verificado                                                                                                                                                                                                                     |
| Esfuerzo                | S                                                                                                                                                                                                                              |
| Ámbito                  | Código                                                                                                                                                                                                                         |
| Ubicación               | `assets/css/vars.css:1-14` (`--primary: #3272B8`, `--warning`…), `components/app/Header.vue:5,56` (`bg-[#091421]`, `bg-[#121c2a]`), `components/modals/projectShow.vue` (`#f1f1f1`, `#222`), `components/content/blocks/*.vue` |
| Dispositivo / navegador | —                                                                                                                                                                                                                              |
| Referencias             | `AGENTS.md` («usar siempre los tokens Tailwind del design system»)                                                                                                                                                             |
| Relacionado con         | RESP-008, CODE-004                                                                                                                                                                                                             |

**Descripción.** `vars.css` mantiene la paleta antigua (`--primary: #3272B8`, `--secondary: #F5F5F5`), que siguen
usando el modal de proyecto y los bloques de contenido. `theme.css` define la nueva (`--color-primary: #a3c9ff`). El
header usa valores literales en lugar de `bg-background`/`bg-surface-container-low`.

**Recomendación.** Migrar los bloques EditorJS y los modales a los tokens y eliminar `vars.css`.

---

### CONT-001 — Afirmaciones de actividad en redes difíciles de sostener y contradictorias

| Campo                   | Valor                                                     |
| ----------------------- | --------------------------------------------------------- |
| Severidad               | Media                                                     |
| Prioridad               | P2                                                        |
| Confianza               | Verificado (texto); la actividad real no se ha comprobado |
| Esfuerzo                | XS                                                        |
| Ámbito                  | Código                                                    |
| Ubicación               | `pages/social.vue:27-213` (array `socialNetworks`)        |
| Dispositivo / navegador | —                                                         |
| Referencias             | Google: E-E-A-T (fiabilidad)                              |
| Relacionado con         | SEO-007                                                   |

**Descripción.** Las tarjetas muestran estados fijos («Estado: Alta Frecuencia» en GitHub, «Muy Activo» en GitLab,
«Actualizaciones Diarias» en Telegram) que no se calculan. Twitter dice «donde suelo estar más activo» y Bluesky
dice «actualmente estoy bastante activo». La API de la plataforma tiene `instagram` y `tiktok` (vacío) en
`social_networks`.

**Impacto.** Un visitante que comprueba un perfil y lo ve inactivo pierde confianza en el resto del portfolio.

**Recomendación.** Eliminar los estados fijos o calcularlos desde la API (fecha del último commit o publicación) y
unificar qué red es la principal.

---

### CONT-002 — El rol profesional se nombra de cinco formas distintas

| Campo                   | Valor                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                                                                            |
| Prioridad               | P2                                                                                                                                              |
| Confianza               | Verificado                                                                                                                                      |
| Esfuerzo                | XS                                                                                                                                              |
| Ámbito                  | Ambos                                                                                                                                           |
| Ubicación               | `nuxt.config.ts:55` («Web Developer»), `pages/index.vue:15,319`, `app.vue:57`, títulos de `pages/*.vue`, API (`author.profession: "Developer"`) |
| Dispositivo / navegador | —                                                                                                                                               |
| Referencias             | —                                                                                                                                               |
| Relacionado con         | SEO-007, SEO-008                                                                                                                                |

**Descripción.** «Desarrollador Web & Maker» (hero), «Desarrollador Web Backend» (home y JSON-LD), «Desarrollador
Web Full Stack Backend» (títulos de 5 páginas), «Web Developer» (título por defecto en `nuxt.config.ts`) y
«Developer» (API).

**Recomendación.** Elegir un único rol (por ejemplo, «Desarrollador backend (PHP/Laravel) e IoT») y usarlo en títulos,
JSON-LD, hero y perfiles.

---

### CONT-003 — Erratas, mezcla de tú y usted, y capitalización de marcas

| Campo                   | Valor                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                                                               |
| Prioridad               | P3                                                                                                                                 |
| Confianza               | Verificado                                                                                                                         |
| Esfuerzo                | XS                                                                                                                                 |
| Ámbito                  | Código                                                                                                                             |
| Ubicación               | `pages/about.vue:127-131,196-205`, `pages/social.vue:33,48,…`, `pages/webs.vue:4,45,83`, `components/modals/submitContact.vue:105` |
| Dispositivo / navegador | —                                                                                                                                  |
| Referencias             | Ortografía de la RAE y nombres oficiales de las marcas                                                                             |
| Relacionado con         | —                                                                                                                                  |

**Descripción.**

- Anglicismo o galicismo: «stockage de productos» (`/about`).
- Tratamiento: `/about` usa «encontrará», «Le invito», «ponerse en contacto» y `/webs` «encontrarás», mientras el
  resto del sitio tutea.
- Marcas: «Linkedin», «Github», «Gitlab», «Blue Sky», «MacOS», «IOT», «linux», «apis» (frente a LinkedIn, GitHub,
  GitLab, Bluesky, macOS, IoT, Linux, API).
- «Sitios webs» → «Sitios web». «Por favor, espere uno instante» → «un instante».
- Código: el campo del formulario se llama `privacity` (en inglés sería `privacy`).

**Recomendación.** Pasada de corrección con un criterio único (tutear en todo el sitio) y nombres oficiales de marcas.

---

### CONT-004 — El correo público se muestra como texto plano

| Campo                   | Valor                                                  |
| ----------------------- | ------------------------------------------------------ |
| Severidad               | Baja                                                   |
| Prioridad               | P3                                                     |
| Confianza               | Verificado                                             |
| Esfuerzo                | XS                                                     |
| Ámbito                  | Código                                                 |
| Ubicación               | `pages/index.vue:286`, `pages/contact.vue:666`         |
| Dispositivo / navegador | Móvil (no se puede tocar para escribir)                |
| Referencias             | `AGENTS.md` (norma de contacto: `public@raupulus.dev`) |
| Relacionado con         | UX-002                                                 |

**Descripción.** `public@raupulus.dev` aparece como `<span>` y `<p>`, sin `href="mailto:"`. Es la vía de contacto
más fiable mientras el formulario no funciona.

**Recomendación.** `<a href="mailto:public@raupulus.dev">public@raupulus.dev</a>`, con la ofuscación ligera que se
considere necesaria contra spam.

---

## Verificado y correcto

- ✅ **Arquitectura de la información** clara: Inicio, Proyectos, Sobre mí, Webs, Social y CTA «Contacto» destacado,
  con estado activo en el menú (`isActiveRoute`).
- ✅ **CTA principales visibles sin scroll** en escritorio (Ver Proyectos, Sobre Mí, Contacto); en móvil los tapa el
  banner de cookies (RESP-003).
- ✅ **Galería de `/about`:** buen patrón (visor con miniaturas, flechas, contador, Esc).
- ✅ **Página 404:** mensaje claro en español con dos salidas (`error.vue`).
- ✅ **Tipografía y jerarquía visual** coherentes en las páginas migradas (Space Grotesk para titulares y Plus Jakarta
  Sans para el texto).
- ✅ **Honestidad sobre trabajos confidenciales** en `/about` («Muchos trabajos… no puedo publicarlos»), que refuerza
  la credibilidad.

## No verificado

- ⚠️ **Actividad real** de cada red social (CONT-001): requiere comprobar cada perfil manualmente.
- ⚠️ **Vigencia del CV** (`/cv/pdf` responde 200, pero no se ha revisado el contenido del PDF).
- ⚠️ **Pruebas con usuarios reales:** esta revisión es heurística.
