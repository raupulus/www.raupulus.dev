# Matriz de concordancia

> Consolidación de `claude-interna` (C), `gemini-externo` (G) y `deepsek-externo` (D), 2026-10-04. Cada fila es una causa
> raíz; las celdas muestran los ID originales y su severidad en cada auditoría. «Final» es la severidad tras resolver
> discrepancias (ver [discrepancias-resueltas.md](discrepancias-resueltas.md)). Fuente: [hallazgos.json](hallazgos.json).

## Estadísticas

### Por área

| Área                    | Unificados | Los 3  | 2 de 3 | Solo 1 | Concordancia (≥ 2) |
| ----------------------- | ---------- | ------ | ------ | ------ | ------------------ |
| Seguridad               | 11         | 7      | 3      | 1      | 91 %               |
| Privacidad y legal      | 10         | 6      | 2      | 2      | 80 %               |
| Bugs y robustez         | 18         | 5      | 6      | 7      | 61 %               |
| SEO                     | 12         | 5      | 4      | 3      | 75 %               |
| Rendimiento             | 9          | 3      | 3      | 3      | 67 %               |
| Responsive              | 8          | 0      | 1      | 7      | 12 %               |
| UX/UI                   | 6          | 0      | 2      | 4      | 33 %               |
| Contenido               | 4          | 1      | 1      | 2      | 50 %               |
| Accesibilidad           | 10         | 3      | 4      | 3      | 70 %               |
| Dependencias            | 7          | 3      | 2      | 2      | 71 %               |
| Calidad de código       | 5          | 4      | 0      | 1      | 80 %               |
| Infraestructura y CI/CD | 6          | 3      | 2      | 1      | 83 %               |
| **Total**               | **106**    | **40** | **30** | **36** | **66 %**           |

### Por auditoría

Sobre los hallazgos sostenidos (se excluyen los marcados como no verificables).

| Auditoría         | Hallazgos originales | Detecta de los unificados | Críticos y altos detectados | Exclusivos confirmados | Descartados |
| ----------------- | -------------------- | ------------------------- | --------------------------- | ---------------------- | ----------- |
| `claude-interna`  | 93                   | 91 de 104 (88 %)          | 30 de 30                    | 24                     | 0           |
| `gemini-externo`  | 64                   | 56 de 104 (54 %)          | 22 de 30                    | 4                      | 1           |
| `deepsek-externo` | 85                   | 67 de 104 (64 %)          | 21 de 30                    | 6                      | 4           |

### Puntos ciegos (críticos y altos que cada auditoría no detectó)

- **`claude-interna`** (0): ninguno.
- **`gemini-externo`** (8): U-BUG-001 Producción consume la API v1 retirada: proyectos vacíos, errores en consola en todas las páginas y CV roto; U-INFRA-006 Producción desfasada y sin trazabilidad; la migración sigue sin commitear; U-A11Y-002 Tarjetas de proyecto y filtros de tecnología inaccesibles con teclado y lector de pantalla; U-LEGAL-001 Banner con consentimiento implícito («si continúa navegando») y sin «Rechazar» en la primera capa; analítica premarcada en producción; U-PERF-002 reCAPTCHA y Google Tag Manager cargados en todas las páginas (~560 KB y ~300 KB de JS sin usar); U-RESP-001 En móvil el header fijo tapa el botón de cerrar del modal de proyecto; U-RESP-002 Scroll horizontal en la home en todos los móviles (h2 «ESPECIALIZACIONES»); U-SEO-002 41 de 42 URLs del sitemap redirigen (barra final) y el canonical apunta a la URL redirigida
- **`deepsek-externo`** (9): U-INFRA-006 Producción desfasada y sin trazabilidad; la migración sigue sin commitear; U-A11Y-002 Tarjetas de proyecto y filtros de tecnología inaccesibles con teclado y lector de pantalla; U-A11Y-003 Modal de proyecto: cierre sin rol ni nombre, foco no atrapado ni devuelto, paginador no operable; U-BUG-005 El modal de proyecto rompe el historial: «atrás» deja el modal abierto y el scroll bloqueado; Esc no restaura URL ni título; U-LEGAL-005 Política de privacidad sin la información obligatoria del art. 13 RGPD; U-RESP-001 En móvil el header fijo tapa el botón de cerrar del modal de proyecto; U-RESP-002 Scroll horizontal en la home en todos los móviles (h2 «ESPECIALIZACIONES»); U-SEC-003 La API sirvió URLs de imágenes en el host evil.example (posible host header injection o caché envenenada); U-SEO-002 41 de 42 URLs del sitemap redirigen (barra final) y el canonical apunta a la URL redirigida

### Concordancia de severidad

De los 69 hallazgos detectados por al menos dos auditorías: **36 con la misma severidad**, 29 con un nivel de diferencia y 4 con dos o más niveles. Las diferencias se resuelven en `discrepancias-resueltas.md`.

## Matriz por área

### Seguridad

| ID        | Causa raíz                                                                                                | C                                 | G                                | D                                   | Final        | Estado     |
| --------- | --------------------------------------------------------------------------------------------------------- | --------------------------------- | -------------------------------- | ----------------------------------- | ------------ | ---------- |
| U-SEC-001 | Producción sin cabeceras de seguridad (CSP, XFO, XCTO, Referrer, Permissions)                             | SEC-001 (Alta)                    | SEC-002 (Alta)                   | SEC-001 (Alta)<br>INFRA-005 (Media) | **Alta** P1  | confirmado |
| U-SEC-002 | HSTS desactivado con max-age=0 en el dominio y la API                                                     | SEC-002 (Alta)                    | SEC-003 (Alta)                   | SEC-001 (Alta)                      | **Alta** P1  | confirmado |
| U-SEC-003 | La API sirvió URLs de imágenes en el host evil.example (posible host header injection o caché envenenada) | SEC-003 (Alta)                    | API-002 (—)                      | —                                   | **Alta** P1  | ajustado   |
| U-SEC-004 | sanitizeRawHtml admite iframes de cualquier origen sin lista blanca ni sandbox                            | SEC-004 (Media)                   | SEC-001 (Crít.)                  | SEC-004 (Media)                     | **Media** P1 | ajustado   |
| U-SEC-005 | Enlaces y embeds del contenido sin validar el esquema de la URL (BlockEmbed :src, BlockLinkTool :href)    | SEC-004 (Media)                   | SEC-006 (Media)                  | —                                   | **Media** P1 | confirmado |
| U-SEC-006 | El sanitizador conserva style e id y no fuerza rel en target=_blank                                       | SEC-005 (Media)                   | SEC-001 (Crít.)                  | SEC-003 (Media)                     | **Media** P2 | confirmado |
| U-SEC-007 | Listado de directorios en /_nuxt/ y versión de Apache expuesta                                            | SEC-006 (Media)                   | —                                | —                                   | **Media** P2 | confirmado |
| U-SEC-008 | Correo personal visible: autor en 36 commits públicos y ServerAdmin de apache.conf                        | SEC-007 (Media)<br>SEC-008 (Baja) | SEC-005 (Media)                  | SEC-006 (Media)                     | **Media** P2 | confirmado |
| U-SEC-009 | Topología de infraestructura publicada en el repositorio público                                          | SEC-008 (Baja)                    | —                                | SEC-006 (Media)                     | **Baja** P3  | confirmado |
| U-SEC-010 | Clave privada de reCAPTCHA en runtimeConfig de un sitio estático                                          | SEC-009 (Baja)                    | SEC-004 (Media)                  | CODE-003 (Media)                    | **Baja** P3  | ajustado   |
| U-SEC-011 | Sin registros CAA, DMARC en p=none y sin security.txt                                                     | SEC-010 (Baja)                    | SEC-007 (Baja)<br>SEC-008 (Baja) | SEC-005 (Media)<br>SEC-007 (Media)  | **Baja** P3  | confirmado |

### Privacidad y legal

| ID          | Causa raíz                                                                                                                            | C                 | G                 | D                 | Final        | Estado     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------- | ----------------- | ------------ | ---------- |
| U-LEGAL-001 | Banner con consentimiento implícito («si continúa navegando») y sin «Rechazar» en la primera capa; analítica premarcada en producción | LEGAL-001 (Alta)  | —                 | LEGAL-003 (Alta)  | **Alta** P1  | confirmado |
| U-LEGAL-002 | reCAPTCHA y Google Analytics se cargan antes del consentimiento en todas las páginas                                                  | LEGAL-002 (Alta)  | LEGAL-003 (Alta)  | LEGAL-004 (Media) | **Alta** P1  | confirmado |
| U-LEGAL-003 | Aceptar analítica concede también las señales publicitarias (ad_storage, ad_user_data, ad_personalization)                            | LEGAL-003 (Alta)  | LEGAL-001 (Alta)  | LEGAL-001 (Alta)  | **Alta** P1  | confirmado |
| U-LEGAL-004 | Revocar el consentimiento no surte efecto (sin update a denied y las cookies _ga persisten)                                           | LEGAL-003 (Alta)  | LEGAL-002 (Alta)  | LEGAL-002 (Alta)  | **Alta** P1  | confirmado |
| U-LEGAL-005 | Política de privacidad sin la información obligatoria del art. 13 RGPD                                                                | LEGAL-004 (Alta)  | LEGAL-004 (Media) | —                 | **Alta** P1  | confirmado |
| U-LEGAL-006 | Sin política de cookies con inventario real                                                                                           | LEGAL-005 (Media) | LEGAL-005 (Media) | LEGAL-005 (Media) | **Media** P2 | confirmado |
| U-LEGAL-007 | Sin aviso legal (LSSI-CE art. 10) ni declaración de accesibilidad                                                                     | LEGAL-005 (Media) | LEGAL-007 (Baja)  | LEGAL-006 (Baja)  | **Baja** P3  | confirmado |
| U-LEGAL-008 | El formulario agrupa dos consentimientos en una casilla y no tiene primera capa informativa                                           | LEGAL-006 (Media) | LEGAL-006 (Media) | LEGAL-007 (Baja)  | **Media** P2 | confirmado |
| U-LEGAL-009 | La API crea sesión y cookies en cada lectura pública                                                                                  | LEGAL-007 (Baja)  | —                 | —                 | **Baja** P3  | confirmado |
| U-LEGAL-010 | Producción carga gtag.js con un ID de medición vacío                                                                                  | —                 | —                 | LEGAL-008 (Media) | **Baja** P3  | ajustado   |

### Bugs y robustez

| ID        | Causa raíz                                                                                                                  | C                                | G                                  | D                                                     | Final        | Estado         |
| --------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------- | ----------------------------------------------------- | ------------ | -------------- |
| U-BUG-001 | Producción consume la API v1 retirada: proyectos vacíos, errores en consola en todas las páginas y CV roto                  | BUG-001 (Crít.)                  | —                                  | BUG-001 (Alta)<br>UX-001 (Media)                      | **Crít.** P0 | confirmado     |
| U-BUG-002 | El build termina en verde sin proyectos; hoy la API v2 tiene 0 contenidos                                                   | BUG-002 (Crít.)                  | BUG-005 (Alta)                     | BUG-006 (Media)                                       | **Crít.** P0 | ajustado       |
| U-BUG-003 | Flujo CSRF de Sanctum imposible entre subdominios: el formulario de contacto no puede enviarse                              | BUG-004 (Alta)                   | BUG-001 (Crít.)                    | BUG-003 (Alta)                                        | **Alta** P1  | ajustado       |
| U-BUG-004 | Soft-404 universal: .htaccess reescribe toda ruta inexistente a la home con 200; 404.html es un shell vacío                 | SEO-004 (Alta)                   | BUG-002 (Alta)                     | SEC-002 (Alta)<br>INFRA-001 (Alta)<br>BUG-002 (Media) | **Alta** P1  | confirmado     |
| U-BUG-005 | El modal de proyecto rompe el historial: «atrás» deja el modal abierto y el scroll bloqueado; Esc no restaura URL ni título | BUG-003 (Alta)                   | BUG-007 (Media)<br>BUG-008 (Media) | —                                                     | **Alta** P1  | ajustado       |
| U-BUG-006 | Proyectos inexistentes: sin 404 en cliente ni aviso «no encontrado»                                                         | BUG-005 (Media)                  | BUG-004 (Alta)                     | BUG-004 (Alta)                                        | **Media** P2 | ajustado       |
| U-BUG-007 | Sin estados de error, vacío ni carga cuando la API falla                                                                    | BUG-005 (Media)                  | —                                  | BUG-008 (Media)                                       | **Media** P1 | confirmado     |
| U-BUG-008 | BlockCode interpreta el código como HTML en lugar de mostrarlo escapado                                                     | BUG-006 (Media)                  | —                                  | BUG-010 (Baja)                                        | **Media** P2 | confirmado     |
| U-BUG-009 | Formulario: validaciones que rechazan datos válidos y mensaje en contenteditable frágil                                     | BUG-007 (Media)                  | UX-001 (Media)<br>UX-002 (Media)   | —                                                     | **Media** P2 | confirmado     |
| U-BUG-010 | srcset inválido (0w) en las 50 miniaturas de /about                                                                         | BUG-008 (Media)                  | —                                  | —                                                     | **Media** P2 | confirmado     |
| U-BUG-011 | Búsqueda de proyectos sin cancelación ni debounce y sin reflejarse en la URL                                                | BUG-009 (Media)                  | —                                  | BUG-009 (Baja)<br>UX-003 (Baja)                       | **Media** P2 | confirmado     |
| U-BUG-012 | Error de consola de reCAPTCHA (requestStorageAccess) en todas las páginas                                                   | BUG-010 (Baja)                   | —                                  | —                                                     | **Baja** P2  | confirmado     |
| U-BUG-013 | El web manifest referencia iconos inexistentes y le faltan theme_color/start_url                                            | BUG-011 (Baja)                   | SEO-004 (Media)                    | BUG-007 (Media)                                       | **Media** P2 | confirmado     |
| U-BUG-014 | useHead invocado fuera de setup (en manejadores del listado de proyectos)                                                   | —                                | —                                  | BUG-005 (Media)<br>CODE-007 (Media)                   | **Baja** P3  | parcial        |
| U-BUG-015 | BlockImage muta las props y cambia el src al cargar                                                                         | —                                | —                                  | BUG-011 (Baja)<br>CODE-006 (Baja)                     | **Baja** P3  | confirmado     |
| U-BUG-016 | router.afterEach acumulado en cada visita a /contact y restos de código de una API anterior en el modal de envío            | BUG-012 (Baja)<br>BUG-013 (Baja) | —                                  | —                                                     | **Baja** P3  | confirmado     |
| U-BUG-017 | Año del footer calculado con new Date() (posible desajuste de hidratación en el cambio de año)                              | —                                | —                                  | BUG-012 (Baja)                                        | **Baja** P3  | no-verificable |
| U-BUG-018 | El build lee la URL de la API de dos fuentes distintas y mezcla datos en una misma ejecución                                | CODE-001 (Media)                 | —                                  | —                                                     | **Media** P1 | confirmado     |

### SEO

| ID        | Causa raíz                                                                                                   | C                                  | G                                | D                                                   | Final        | Estado     |
| --------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- | -------------------------------- | --------------------------------------------------- | ------------ | ---------- |
| U-SEO-001 | Las páginas de proyecto no tienen contenido propio en el HTML, duplican metadatos y el listado no las enlaza | SEO-001 (Alta)                     | BUG-003 (Alta)<br>SEO-001 (Alta) | SEO-001 (Alta)                                      | **Alta** P1  | confirmado |
| U-SEO-002 | 41 de 42 URLs del sitemap redirigen (barra final) y el canonical apunta a la URL redirigida                  | SEO-002 (Alta)                     | —                                | —                                                   | **Alta** P1  | confirmado |
| U-SEO-003 | Producción sin canonical ni JSON-LD y con dos h1 por página (corregido en el código)                         | SEO-003 (Media)                    | —                                | SEO-004 (Media)                                     | **Media** P1 | confirmado |
| U-SEO-004 | Imágenes sociales relativas, cuadradas o en dominio externo; twitter:card incoherente                        | SEO-005 (Media)                    | PERF-005 (Baja)                  | SEO-003 (Media)<br>SEO-006 (Baja)<br>SEO-010 (Baja) | **Media** P2 | confirmado |
| U-SEO-005 | lastmod del sitemap = fecha del build                                                                        | SEO-006 (Media)                    | —                                | SEO-005 (Media)                                     | **Media** P2 | confirmado |
| U-SEO-006 | JSON-LD incompleto (sameAs desactualizado; sin BreadcrumbList, ProfilePage ni datos por proyecto)            | SEO-007 (Media)                    | SEO-007 (Baja)                   | SEO-007 (Media)                                     | **Media** P2 | confirmado |
| U-SEO-007 | Jerarquía de encabezados con saltos y h1 adicionales desde BlockHeader                                       | SEO-009 (Baja)<br>A11Y-006 (Baja)  | SEO-005 (Media)                  | SEO-008 (Media)<br>A11Y-004 (Media)                 | **Media** P2 | confirmado |
| U-SEO-008 | Texto alternativo: genérico en la galería de /about y ausente en varias plantillas de producción             | SEO-010 (Baja)<br>A11Y-004 (Media) | —                                | A11Y-005 (Alta)                                     | **Media** P2 | confirmado |
| U-SEO-009 | /blog: indexable y en el sitemap en producción; noindex y fuera del sitemap en el código                     | —                                  | SEO-003 (Media)                  | SEO-002 (Media)                                     | **Baja** P3  | parcial    |
| U-SEO-010 | Títulos y descripciones demasiado largos y rol profesional inconsistente                                     | SEO-008 (Baja)<br>CONT-002 (Baja)  | —                                | —                                                   | **Baja** P2  | confirmado |
| U-SEO-011 | og:locale:alternate en_US sin versión en inglés                                                              | SEO-011 (Baja)                     | SEO-006 (Baja)                   | SEO-011 (Baja)                                      | **Baja** P3  | confirmado |
| U-SEO-012 | Sin meta theme-color y favicon .ico declarado dos veces                                                      | —                                  | —                                | SEO-009 (Baja)                                      | **Baja** P3  | confirmado |

### Rendimiento

| ID         | Causa raíz                                                                                                         | C                                    | G                | D                | Final        | Estado     |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------ | ---------------- | ---------------- | ------------ | ---------- |
| U-PERF-001 | Política de caché incorrecta: producción no envía Cache-Control y el .htaccess versionado cachearía el HTML un mes | PERF-001 (Alta)                      | PERF-002 (Alta)  | PERF-004 (Alta)  | **Alta** P1  | parcial    |
| U-PERF-002 | reCAPTCHA y Google Tag Manager cargados en todas las páginas (~560 KB y ~300 KB de JS sin usar)                    | PERF-002 (Alta)                      | —                | PERF-002 (Alta)  | **Alta** P1  | confirmado |
| U-PERF-003 | LCP móvil: 7,6–9,1 s en producción y 2,3–3,9 s en el código actual                                                 | PERF-003 (Media)                     | PERF-001 (Alta)  | PERF-003 (Alta)  | **Alta** P1  | parcial    |
| U-PERF-004 | JavaScript propio inicial por encima del presupuesto de 120 KB comprimido                                          | —                                    | PERF-004 (Media) | PERF-001 (Alta)  | **Media** P2 | ajustado   |
| U-PERF-005 | Desplazamientos de layout (CLS) por el cambio de fuente y por imágenes sin dimensiones                             | PERF-004 (Media)<br>RESP-006 (Media) | —                | PERF-008 (Media) | **Media** P2 | confirmado |
| U-PERF-006 | Imágenes pesadas o sin optimizar (GIF de 289 KB, og de 332 KB, galería sin srcset válido)                          | PERF-005 (Media)                     | —                | —                | **Media** P2 | confirmado |
| U-PERF-007 | Demasiados pesos de fuente generados (2 familias × 5 pesos)                                                        | PERF-003 (Media)                     | PERF-003 (Media) | PERF-005 (Media) | **Baja** P3  | ajustado   |
| U-PERF-008 | Los 45 iconos SVG de MaterialIcon viajan en un chunk precargado en todas las páginas                               | —                                    | —                | PERF-006 (Baja)  | **Baja** P3  | confirmado |
| U-PERF-009 | Datos pedidos en cliente tras la hidratación, sin preconnect a la API                                              | PERF-006 (Baja)                      | —                | —                | **Baja** P3  | confirmado |

### Responsive

| ID         | Causa raíz                                                                         | C                                  | G                | D   | Final        | Estado     |
| ---------- | ---------------------------------------------------------------------------------- | ---------------------------------- | ---------------- | --- | ------------ | ---------- |
| U-RESP-001 | En móvil el header fijo tapa el botón de cerrar del modal de proyecto              | RESP-001 (Alta)                    | —                | —   | **Alta** P1  | confirmado |
| U-RESP-002 | Scroll horizontal en la home en todos los móviles (h2 «ESPECIALIZACIONES»)         | RESP-002 (Alta)                    | —                | —   | **Alta** P1  | confirmado |
| U-RESP-003 | El banner de cookies ocupa ~45 % de la pantalla en móvil                           | RESP-003 (Media)                   | —                | —   | **Media** P2 | confirmado |
| U-RESP-004 | word-break: break-all parte las palabras por la mitad en el contenido de proyectos | RESP-004 (Media)                   | —                | —   | **Media** P2 | confirmado |
| U-RESP-005 | Modales y menús con 100vh/100vw en lugar de dvh                                    | RESP-005 (Media)                   | RESP-003 (Media) | —   | **Media** P2 | confirmado |
| U-RESP-006 | Sin color-scheme: dark (scrollbars y controles nativos claros)                     | —                                  | RESP-002 (Media) | —   | **Baja** P3  | ajustado   |
| U-RESP-007 | Titular del hero en text-5xl muy grande a 320 px                                   | —                                  | RESP-001 (Media) | —   | **Baja** P3  | ajustado   |
| U-RESP-008 | Texto del buscador bajo el icono y rounded-full redefinido a 0.75rem               | RESP-007 (Baja)<br>RESP-008 (Baja) | —                | —   | **Baja** P3  | confirmado |

### UX/UI

| ID       | Causa raíz                                                                               | C                              | G             | D              | Final        | Estado     |
| -------- | ---------------------------------------------------------------------------------------- | ------------------------------ | ------------- | -------------- | ------------ | ---------- |
| U-UX-001 | «Blog» en el menú principal lleva a una página vacía en construcción                     | UX-001 (Media)                 | —             | —              | **Media** P2 | confirmado |
| U-UX-002 | Formulario de contacto activo bajo un aviso de «fuera de servicio»                       | UX-002 (Media)                 | —             | UX-002 (Media) | **Media** P1 | confirmado |
| U-UX-003 | El modal de proyecto rompe el design system y dificulta la lectura                       | UX-003 (Media)                 | —             | —              | **Media** P2 | confirmado |
| U-UX-004 | La página de error no tiene header ni footer                                             | UX-004 (Baja)                  | —             | UX-004 (Baja)  | **Baja** P3  | confirmado |
| U-UX-005 | Banner de cookies e insignia de reCAPTCHA fuera del design system; dos sistemas de color | UX-005 (Baja)<br>UX-006 (Baja) | —             | —              | **Baja** P3  | confirmado |
| U-UX-006 | Archivo huérfano de 482 KB publicado (public/patterns/a.png)                             | —                              | UX-004 (Baja) | —              | **Baja** P3  | confirmado |

### Contenido

| ID         | Causa raíz                                                                                      | C                | G              | D               | Final        | Estado         |
| ---------- | ----------------------------------------------------------------------------------------------- | ---------------- | -------------- | --------------- | ------------ | -------------- |
| U-CONT-001 | Afirmaciones de actividad en redes difíciles de sostener y contradictorias                      | CONT-001 (Media) | —              | —               | **Media** P2 | confirmado     |
| U-CONT-002 | Erratas, mezcla de tú y usted, marcas mal escritas y el campo «privacity»                       | CONT-003 (Baja)  | BUG-009 (Baja) | CONT-001 (Baja) | **Baja** P3  | confirmado     |
| U-CONT-003 | Correo público como texto plano (sin mailto) y E-E-A-T mejorable (ubicación genérica, sin foto) | CONT-004 (Baja)  | —              | UX-005 (Baja)   | **Baja** P3  | confirmado     |
| U-CONT-004 | Enlace a Stack Overflow en /social responde 403                                                 | —                | UX-003 (Baja)  | —               | **Info** P3  | no-verificable |

### Accesibilidad

| ID         | Causa raíz                                                                                                  | C                | G                                   | D                                                       | Final        | Estado     |
| ---------- | ----------------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------- | ------------------------------------------------------- | ------------ | ---------- |
| U-A11Y-001 | Contraste insuficiente (footer a 1,98:1 en todas las páginas, /blog, hovers y bordes)                       | A11Y-001 (Alta)  | A11Y-001 (Alta)                     | A11Y-002 (Alta)                                         | **Alta** P1  | confirmado |
| U-A11Y-002 | Tarjetas de proyecto y filtros de tecnología inaccesibles con teclado y lector de pantalla                  | A11Y-002 (Alta)  | —                                   | —                                                       | **Alta** P1  | confirmado |
| U-A11Y-003 | Modal de proyecto: cierre sin rol ni nombre, foco no atrapado ni devuelto, paginador no operable            | A11Y-003 (Alta)  | A11Y-003 (Alta)<br>A11Y-006 (Media) | —                                                       | **Alta** P1  | confirmado |
| U-A11Y-004 | Formulario de contacto: mensaje sin nombre accesible, errores no asociados ni anunciados, sin submit nativo | A11Y-005 (Alta)  | A11Y-002 (Alta)                     | A11Y-003 (Alta)<br>A11Y-007 (Media)                     | **Alta** P1  | confirmado |
| U-A11Y-005 | Listas de EditorJS renderizadas con <div> en lugar de <ul>/<ol>/<li>                                        | —                | A11Y-004 (Media)                    | —                                                       | **Media** P2 | confirmado |
| U-A11Y-006 | Tablas de contenido sin <caption> ni scope en los encabezados                                               | —                | A11Y-005 (Media)                    | A11Y-009 (Media)                                        | **Media** P2 | confirmado |
| U-A11Y-007 | Botones solo-icono sin nombre accesible (copiar código y otros)                                             | A11Y-009 (Baja)  | A11Y-007 (Media)                    | —                                                       | **Media** P2 | confirmado |
| U-A11Y-008 | Sin enlace «Saltar al contenido», menú móvil sin Esc ni gestión de foco y foco bajo el header fijo          | A11Y-008 (Media) | —                                   | A11Y-006 (Media)<br>A11Y-008 (Media)<br>A11Y-010 (Baja) | **Media** P2 | confirmado |
| U-A11Y-009 | Scroll suave por JS sin respetar prefers-reduced-motion y GIF animados                                      | A11Y-007 (Baja)  | A11Y-008 (Baja)                     | A11Y-011 (Baja)                                         | **Baja** P3  | confirmado |
| U-A11Y-010 | Producción sin landmark <main> (corregido en el código)                                                     | —                | —                                   | A11Y-001 (Alta)                                         | **Media** P2 | ajustado   |

### Dependencias

| ID        | Causa raíz                                                                                                      | C               | G                                  | D                                                    | Final        | Estado     |
| --------- | --------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------- | ---------------------------------------------------- | ------------ | ---------- |
| U-DEP-001 | Gestor de paquetes a medias: pnpm es el oficial, pero gocd.yaml usa npm ci y package-lock.json sigue en el repo | DEP-001 (Alta)  | DEP-002 (Alta)<br>DEP-004 (Media)  | DEP-001 (Alta)<br>DEP-007 (Baja)<br>INFRA-004 (Alta) | **Alta** P1  | ajustado   |
| U-DEP-002 | Vulnerabilidades conocidas: 1 crítica (@nuxt/devtools, RCE en el equipo de desarrollo) y 47 altas (pnpm audit)  | DEP-002 (Alta)  | DEP-001 (Crít.)<br>DEP-003 (Media) | DEP-002 (Alta)<br>DEP-005 (Media)                    | **Alta** P1  | ajustado   |
| U-DEP-003 | test:coverage falla (falta @vitest/coverage-v8)                                                                 | DEP-003 (Media) | DEP-005 (Baja)                     | DEP-003 (Media)                                      | **Media** P2 | confirmado |
| U-DEP-004 | vue-recaptcha-v3 sin mantenimiento desde 2022                                                                   | DEP-004 (Media) | —                                  | —                                                    | **Media** P2 | confirmado |
| U-DEP-005 | Versión de Node sin fijar (sin engines ni .nvmrc)                                                               | DEP-005 (Baja)  | —                                  | DEP-006 (Media)                                      | **Media** P2 | confirmado |
| U-DEP-006 | Dependencias desactualizadas, sin uso (ts-node, tsconfig-paths) y compatibilityDate antigua                     | DEP-006 (Baja)  | —                                  | DEP-004 (Media)                                      | **Media** P2 | confirmado |
| U-DEP-007 | Sin Renovate/Dependabot ni auditoría de dependencias en el CI                                                   | DEP-007 (Media) | —                                  | —                                                    | **Media** P2 | confirmado |

### Calidad de código

| ID         | Causa raíz                                                                                | C                | G                | D                                    | Final        | Estado     |
| ---------- | ----------------------------------------------------------------------------------------- | ---------------- | ---------------- | ------------------------------------ | ------------ | ---------- |
| U-CODE-001 | Código y configuración muertos (11 archivos, apiClient.ts, plugins:[] y código comentado) | CODE-002 (Media) | CODE-001 (Media) | CODE-003 (Media)                     | **Media** P2 | confirmado |
| U-CODE-002 | Sin tests en las zonas críticas (rutas, formulario, bloques, build)                       | CODE-003 (Media) | CODE-004 (Baja)  | CODE-002 (Media)                     | **Media** P2 | confirmado |
| U-CODE-003 | Avisos de ESLint (props sin tipo, v-html, any)                                            | CODE-004 (Baja)  | CODE-003 (Baja)  | CODE-004 (Baja)<br>CODE-005 (Baja)   | **Baja** P3  | confirmado |
| U-CODE-004 | Documentación desfasada (componentes muertos, comandos rotos, gestor de paquetes)         | CODE-005 (Baja)  | CODE-002 (Media) | CODE-001 (Alta)<br>INFRA-007 (Media) | **Baja** P3  | ajustado   |
| U-CODE-005 | CSS inválido o residual                                                                   | CODE-006 (Baja)  | —                | —                                    | **Baja** P3  | confirmado |

### Infraestructura y CI/CD

| ID          | Causa raíz                                                                                                                                            | C                 | G                                     | D                                                        | Final        | Estado     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------- | -------------------------------------------------------- | ------------ | ---------- |
| U-INFRA-001 | Pipeline de GoCD no funcional: npm ci con NODE_ENV=production, sin variables de build, sin artefacto, verificación que no falla, sin puertas ni purga | INFRA-001 (Alta)  | INFRA-002 (Alta)<br>INFRA-004 (Media) | INFRA-002 (Alta)<br>INFRA-004 (Alta)<br>INFRA-006 (Baja) | **Alta** P0  | confirmado |
| U-INFRA-002 | Las configuraciones de servidor versionadas no reflejan producción (Apache, nginx, .htaccess)                                                         | INFRA-002 (Alta)  | INFRA-001 (Alta)                      | INFRA-001 (Alta)<br>INFRA-005 (Media)                    | **Alta** P1  | confirmado |
| U-INFRA-003 | Despliegue en caliente no atómico (rsync --delete) y verificación de una sola URL                                                                     | INFRA-003 (Media) | INFRA-003 (Alta)                      | INFRA-003 (Alta)                                         | **Alta** P1  | confirmado |
| U-INFRA-004 | www.raupulus.dev no resuelve en DNS                                                                                                                   | INFRA-004 (Media) | SEO-002 (Alta)                        | —                                                        | **Media** P2 | ajustado   |
| U-INFRA-005 | Sin monitorización de disponibilidad ni de errores de usuario                                                                                         | INFRA-005 (Media) | —                                     | INFRA-006 (Baja)                                         | **Media** P1 | confirmado |
| U-INFRA-006 | Producción desfasada y sin trazabilidad; la migración sigue sin commitear                                                                             | INFRA-006 (Alta)  | —                                     | —                                                        | **Alta** P0  | confirmado |

## Hallazgos originales descartados

| Auditoría         | ID       | Estado         | Motivo                                                                                                                                                                          |
| ----------------- | -------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gemini-externo`  | BUG-006  | falso-positivo | useApiBase() devuelve el proxy /_proxy en cliente y en desarrollo (composables/useApiBase.ts:19-21); C no observó errores de hidratación en 300 cargas.                         |
| `deepsek-externo` | PERF-007 | falso-positivo | El GET con Content-Type: application/json está en utils/apiClient.ts, que no usa nadie (código muerto, U-CODE-001); los composables activos usan $fetch sin esa cabecera.       |
| `deepsek-externo` | RESP-002 | no-reproducido | Hipótesis sobre tablas, código y embeds a 320 px: la matriz de C (300 cargas) no encontró desbordamientos fuera de la home; no hay proyectos con tablas en los datos de prueba. |
| `deepsek-externo` | RESP-001 | no-es-hallazgo | Es una limitación declarada («matriz completa no ejecutada»), sin severidad. Aparece en los informes de D pero no en su hallazgos.json.                                         |
| `deepsek-externo` | DEP-008  | no-es-hallazgo | Limitación declarada («licencias no verificadas»), sin severidad. C sí lo verificó: sin incompatibilidades con GPL-3.0.                                                         |
