# Scripts de la consolidación

Ejecutados desde un directorio temporal fuera del repositorio: `python3 gen-consolidacion.py` (genera `hallazgos.json` y `descartados.json` a partir de la tabla de equivalencias y valida que todos los ID originales estén asignados) y `python3 gen-matriz.py` (genera `matriz-concordancia.md`).

## `consolidacion_datos.py`

```python
# Tabla de equivalencias de la consolidación (fuente única para hallazgos.json y matriz-concordancia.md).
# Cada entrada: (id_unificado, área, título, severidad_final, prioridad, esfuerzo, ámbito, estado,
#                origen {C,G,D}, resolución/nota, informe de referencia)
# C = claude-interna, G = gemini-externo, D = deepsek-externo.
# estado: confirmado | ajustado (severidad recalibrada) | parcial (solo parte del hallazgo se sostiene) |
#         falso-positivo | no-reproducido | resuelto (ya no ocurre) | no-verificable

U = [
# ---------------- Seguridad ----------------
("U-SEC-001", "seguridad", "Producción sin cabeceras de seguridad (CSP, XFO, XCTO, Referrer, Permissions)", "alta", "P1", "S", "producción", "confirmado",
 {"C": ["SEC-001"], "G": ["SEC-002"], "D": ["SEC-001", "INFRA-005"]}, "Coincidencia total. D añade que la CSP versionada usa 'unsafe-eval' y no define frame-ancestors/form-action/object-src.", "C:01-seguridad.md#SEC-001"),
("U-SEC-002", "seguridad", "HSTS desactivado con max-age=0 en el dominio y la API", "alta", "P1", "XS", "producción", "confirmado",
 {"C": ["SEC-002"], "G": ["SEC-003"], "D": ["SEC-001"]}, "Coincidencia total. La cabecera la inyecta Cloudflare.", "C:01-seguridad.md#SEC-002"),
("U-SEC-003", "seguridad", "La API sirvió URLs de imágenes en el host evil.example (posible host header injection o caché envenenada)", "alta", "P1", "M", "producción (API)", "ajustado",
 {"C": ["SEC-003"], "G": ["API-002"], "D": []}, "Observado por C y G (~18:45). Reverificado en la consolidación (20:45): la respuesta ya solo contiene api.raupulus.dev. El dato se ha corregido o ha caducado, pero la causa raíz no está verificada: baja de P0 a P1 y se mantiene la severidad. Revisar los logs de la API con Host/X-Forwarded-Host anómalos.", "C:01-seguridad.md#SEC-003"),
("U-SEC-004", "seguridad", "sanitizeRawHtml admite iframes de cualquier origen sin lista blanca ni sandbox", "media", "P1", "S", "código", "ajustado",
 {"C": ["SEC-004"], "G": ["SEC-001"], "D": ["SEC-004"]}, "G lo calificó de crítica (agrupado con style). Se ajusta a media: DOMPurify bloquea scripts, manejadores, javascript: y srcdoc; explotarlo exige escribir contenido en la API. Subir a alta si se confirma la causa de U-SEC-003.", "C:01-seguridad.md#SEC-004"),
("U-SEC-005", "seguridad", "Enlaces y embeds del contenido sin validar el esquema de la URL (BlockEmbed :src, BlockLinkTool :href)", "media", "P1", "XS", "código", "confirmado",
 {"C": ["SEC-004"], "G": ["SEC-006"], "D": []}, "C detectó BlockEmbed; G además BlockLinkTool. Reverificado: BlockLinkTool.vue:4 enlaza :href con el valor de la API sin comprobar que sea http(s). Vue no sanea URLs.", "G:01-seguridad.md#SEC-006"),
("U-SEC-006", "seguridad", "El sanitizador conserva style e id y no fuerza rel en target=_blank", "media", "P2", "XS", "código", "confirmado",
 {"C": ["SEC-005"], "G": ["SEC-001"], "D": ["SEC-003"]}, "Coincidencia total (C y D con PoC local).", "C:01-seguridad.md#SEC-005"),
("U-SEC-007", "seguridad", "Listado de directorios en /_nuxt/ y versión de Apache expuesta", "media", "P2", "XS", "producción", "confirmado",
 {"C": ["SEC-006"], "G": [], "D": []}, "Exclusivo de C. Evidencia en produccion-exposicion-404.txt («Index of /_nuxt», Apache/2.4.68).", "C:01-seguridad.md#SEC-006"),
("U-SEC-008", "seguridad", "Correo personal visible: autor en 36 commits públicos y ServerAdmin de apache.conf", "media", "P2", "M", "producción (repositorio público)", "confirmado",
 {"C": ["SEC-007", "SEC-008"], "G": ["SEC-005"], "D": ["SEC-006"]}, "C y D: correo en los metadatos de commits; C y G: correo en ServerAdmin. Incumple la norma de contacto de AGENTS.md. Se mantiene media (G la priorizó P1).", "C:01-seguridad.md#SEC-007"),
("U-SEC-009", "seguridad", "Topología de infraestructura publicada en el repositorio público", "baja", "P3", "S", "código", "confirmado",
 {"C": ["SEC-008"], "G": [], "D": ["SEC-006"]}, "Rutas del servidor, despliegue y configuración real versionados en un repositorio público.", "C:01-seguridad.md#SEC-008"),
("U-SEC-010", "seguridad", "Clave privada de reCAPTCHA en runtimeConfig de un sitio estático", "baja", "P3", "XS", "código", "ajustado",
 {"C": ["SEC-009"], "G": ["SEC-004"], "D": ["CODE-003"]}, "G afirmó que «expone claves privadas en el frontend». Se ajusta a baja: verificado que el valor no aparece en el build (0 coincidencias). Es configuración innecesaria.", "C:01-seguridad.md#SEC-009"),
("U-SEC-011", "seguridad", "Sin registros CAA, DMARC en p=none y sin security.txt", "baja", "P3", "XS", "producción (DNS)", "confirmado",
 {"C": ["SEC-010"], "G": ["SEC-007", "SEC-008"], "D": ["SEC-005", "SEC-007"]}, "Coincidencia total.", "C:01-seguridad.md#SEC-010"),
# ---------------- Privacidad y legal ----------------
("U-LEGAL-001", "privacidad-legal", "Banner con consentimiento implícito («si continúa navegando») y sin «Rechazar» en la primera capa; analítica premarcada en producción", "alta", "P1", "XS", "ambos", "confirmado",
 {"C": ["LEGAL-001"], "G": [], "D": ["LEGAL-003"]}, "C: texto por defecto de la librería y sin botón de rechazo. D: además isPreselected:true en producción (reverificado en el HTML de producción). G no lo detectó.", "C:02-privacidad-legal.md#LEGAL-001"),
("U-LEGAL-002", "privacidad-legal", "reCAPTCHA y Google Analytics se cargan antes del consentimiento en todas las páginas", "alta", "P1", "S", "ambos", "confirmado",
 {"C": ["LEGAL-002"], "G": ["LEGAL-003"], "D": ["LEGAL-004"]}, "Los tres detectan reCAPTCHA global; solo C midió también los pings g/collect de GA previos al consentimiento. D la calificó de media; se mantiene alta (mediana).", "C:02-privacidad-legal.md#LEGAL-002"),
("U-LEGAL-003", "privacidad-legal", "Aceptar analítica concede también las señales publicitarias (ad_storage, ad_user_data, ad_personalization)", "alta", "P1", "XS", "ambos", "confirmado",
 {"C": ["LEGAL-003"], "G": ["LEGAL-001"], "D": ["LEGAL-001"]}, "Coincidencia total.", "C:02-privacidad-legal.md#LEGAL-003"),
("U-LEGAL-004", "privacidad-legal", "Revocar el consentimiento no surte efecto (sin update a denied y las cookies _ga persisten)", "alta", "P1", "S", "ambos", "confirmado",
 {"C": ["LEGAL-003"], "G": ["LEGAL-002"], "D": ["LEGAL-002"]}, "Coincidencia total (C lo verificó en navegador).", "C:02-privacidad-legal.md#LEGAL-003"),
("U-LEGAL-005", "privacidad-legal", "Política de privacidad sin la información obligatoria del art. 13 RGPD", "alta", "P1", "M", "ambos", "confirmado",
 {"C": ["LEGAL-004"], "G": ["LEGAL-004"], "D": []}, "C la calificó de alta y G de media; se toma la mayor: faltan responsable, bases jurídicas, encargados, transferencias, plazos y derechos. D solo revisó la capa del formulario (U-LEGAL-008).", "C:02-privacidad-legal.md#LEGAL-004"),
("U-LEGAL-006", "privacidad-legal", "Sin política de cookies con inventario real", "media", "P2", "S", "ambos", "confirmado",
 {"C": ["LEGAL-005"], "G": ["LEGAL-005"], "D": ["LEGAL-005"]}, "Coincidencia total.", "C:02-privacidad-legal.md#LEGAL-005"),
("U-LEGAL-007", "privacidad-legal", "Sin aviso legal (LSSI-CE art. 10) ni declaración de accesibilidad", "baja", "P3", "S", "ambos", "confirmado",
 {"C": ["LEGAL-005"], "G": ["LEGAL-007"], "D": ["LEGAL-006"]}, "C lo agrupó con la política de cookies (media); G y D, baja. Mediana: baja. Aplicabilidad del art. 10 a un portfolio personal sin verificar.", "G:02-privacidad-legal.md#LEGAL-007"),
("U-LEGAL-008", "privacidad-legal", "El formulario agrupa dos consentimientos en una casilla y no tiene primera capa informativa", "media", "P2", "XS", "código", "confirmado",
 {"C": ["LEGAL-006"], "G": ["LEGAL-006"], "D": ["LEGAL-007"]}, "Coincidencia total (D lo calificó de baja; mediana: media).", "C:02-privacidad-legal.md#LEGAL-006"),
("U-LEGAL-009", "privacidad-legal", "La API crea sesión y cookies en cada lectura pública", "baja", "P3", "S", "producción (API)", "confirmado",
 {"C": ["LEGAL-007"], "G": [], "D": []}, "Exclusivo de C (cabeceras Set-Cookie en api-cors-csrf.txt).", "C:02-privacidad-legal.md#LEGAL-007"),
("U-LEGAL-010", "privacidad-legal", "Producción carga gtag.js con un ID de medición vacío", "baja", "P3", "XS", "producción", "ajustado",
 {"C": [], "G": [], "D": ["LEGAL-008"]}, "Exclusivo de D. Reverificado en el HTML de producción (gtag:{enabled:true,…,id:\"\"}). Se ajusta a baja: es una petición inútil sin tratamiento de datos; desaparece al desplegar el código actual.", "D:02-privacidad-legal.md#LEGAL-008"),
# ---------------- Bugs y robustez ----------------
("U-BUG-001", "bugs-robustez", "Producción consume la API v1 retirada: proyectos vacíos, errores en consola en todas las páginas y CV roto", "crítica", "P0", "S", "producción", "confirmado",
 {"C": ["BUG-001"], "G": [], "D": ["BUG-001", "UX-001"]}, "C (crítica) y D (alta, P0). Se toma la mayor: el contenido principal del portfolio no se muestra a ningún visitante. D añade el aviso flotante «En mantenimiento temporalmente». G no lo detectó como hallazgo.", "C:03-bugs-robustez.md#BUG-001"),
("U-BUG-002", "bugs-robustez", "El build termina en verde sin proyectos; hoy la API v2 tiene 0 contenidos", "crítica", "P0", "S", "ambos", "ajustado",
 {"C": ["BUG-002"], "G": ["BUG-005"], "D": ["BUG-006"]}, "C crítica, G alta, D media (mediana: alta). Se ajusta al alza por evidencia: G y D lo trataron como hipotético («si la API cae»), pero la condición se da ahora (reverificado a las 20:45: total 0). Desplegar hoy borraría las 34 URLs de proyectos.", "C:03-bugs-robustez.md#BUG-002"),
("U-BUG-003", "bugs-robustez", "Flujo CSRF de Sanctum imposible entre subdominios: el formulario de contacto no puede enviarse", "alta", "P1", "S", "ambos", "ajustado",
 {"C": ["BUG-004"], "G": ["BUG-001"], "D": ["BUG-003"]}, "G crítica, C y D alta (mediana: alta). Ningún auditor envió el formulario en producción (prohibido por el prompt): la causa (cookie con domain=api.raupulus.dev) está verificada, el 419 se deduce. El formulario ya muestra un aviso de «fuera de servicio».", "C:03-bugs-robustez.md#BUG-004"),
("U-BUG-004", "bugs-robustez", "Soft-404 universal: .htaccess reescribe toda ruta inexistente a la home con 200; 404.html es un shell vacío", "alta", "P1", "XS", "producción", "confirmado",
 {"C": ["SEO-004"], "G": ["BUG-002"], "D": ["SEC-002", "INFRA-001", "BUG-002"]}, "Coincidencia total. D añade que 404.html no lleva noindex ni contenido de error.vue.", "C:04-seo.md#SEO-004"),
("U-BUG-005", "bugs-robustez", "El modal de proyecto rompe el historial: «atrás» deja el modal abierto y el scroll bloqueado; Esc no restaura URL ni título", "alta", "P1", "M", "código", "ajustado",
 {"C": ["BUG-003"], "G": ["BUG-007", "BUG-008"], "D": []}, "C alta, G media (dos hallazgos). Se mantiene alta por evidencia: combinado con U-RESP-001, en móvil el usuario no tiene forma de cerrar el modal.", "C:03-bugs-robustez.md#BUG-003"),
("U-BUG-006", "bugs-robustez", "Proyectos inexistentes: sin 404 en cliente ni aviso «no encontrado»", "media", "P2", "S", "código", "ajustado",
 {"C": ["BUG-005"], "G": ["BUG-004"], "D": ["BUG-004"]}, "G y D alta. Se ajusta a media: la parte del estado HTTP 200 es el soft-404 del servidor (U-BUG-004); con la configuración corregida, el build local ya responde 404. Queda el comportamiento en cliente (sin showError ni aviso).", "G:03-bugs-robustez.md#BUG-004"),
("U-BUG-007", "bugs-robustez", "Sin estados de error, vacío ni carga cuando la API falla", "media", "P1", "S", "ambos", "confirmado",
 {"C": ["BUG-005"], "G": [], "D": ["BUG-008"]}, "C y D coinciden.", "C:03-bugs-robustez.md#BUG-005"),
("U-BUG-008", "bugs-robustez", "BlockCode interpreta el código como HTML en lugar de mostrarlo escapado", "media", "P2", "XS", "código", "confirmado",
 {"C": ["BUG-006"], "G": [], "D": ["BUG-010"]}, "C media, D baja; se toma la mayor: en un portfolio técnico, los ejemplos con etiquetas se muestran mal.", "C:03-bugs-robustez.md#BUG-006"),
("U-BUG-009", "bugs-robustez", "Formulario: validaciones que rechazan datos válidos y mensaje en contenteditable frágil", "media", "P2", "S", "código", "confirmado",
 {"C": ["BUG-007"], "G": ["UX-001", "UX-002"], "D": []}, "C y G coinciden (G separa validaciones y contenteditable). La parte de accesibilidad está en U-A11Y-004.", "C:03-bugs-robustez.md#BUG-007"),
("U-BUG-010", "bugs-robustez", "srcset inválido (0w) en las 50 miniaturas de /about", "media", "P2", "XS", "código", "confirmado",
 {"C": ["BUG-008"], "G": [], "D": []}, "Exclusivo de C (50 errores del W3C Nu Checker y avisos de consola).", "C:03-bugs-robustez.md#BUG-008"),
("U-BUG-011", "bugs-robustez", "Búsqueda de proyectos sin cancelación ni debounce y sin reflejarse en la URL", "media", "P2", "S", "código", "confirmado",
 {"C": ["BUG-009"], "G": [], "D": ["BUG-009", "UX-003"]}, "C media, D baja (dos hallazgos); se toma la mayor.", "C:03-bugs-robustez.md#BUG-009"),
("U-BUG-012", "bugs-robustez", "Error de consola de reCAPTCHA (requestStorageAccess) en todas las páginas", "baja", "P2", "XS", "ambos", "confirmado",
 {"C": ["BUG-010"], "G": [], "D": []}, "Exclusivo de C; se resuelve con U-LEGAL-002.", "C:03-bugs-robustez.md#BUG-010"),
("U-BUG-013", "bugs-robustez", "El web manifest referencia iconos inexistentes y le faltan theme_color/start_url", "media", "P2", "XS", "ambos", "confirmado",
 {"C": ["BUG-011"], "G": ["SEO-004"], "D": ["BUG-007"]}, "C baja, G y D media; mediana: media.", "C:03-bugs-robustez.md#BUG-011"),
("U-BUG-014", "bugs-robustez", "useHead invocado fuera de setup (en manejadores del listado de proyectos)", "baja", "P3", "S", "código", "parcial",
 {"C": [], "G": [], "D": ["BUG-005", "CODE-007"]}, "D lo calificó de media. El patrón existe (pages/projects/[...slugs].vue:111), pero C comprobó en navegador que los metadatos se restauran al navegar y no aparecen avisos en consola: se ajusta a baja, como deuda técnica.", "D:03-bugs-robustez.md#BUG-005"),
("U-BUG-015", "bugs-robustez", "BlockImage muta las props y cambia el src al cargar", "baja", "P3", "XS", "código", "confirmado",
 {"C": [], "G": [], "D": ["BUG-011", "CODE-006"]}, "Exclusivo de D. Reverificado: BlockImage.vue:35 (image.data.caption = …) y :39 (imgElement.src = …).", "D:03-bugs-robustez.md#BUG-011"),
("U-BUG-016", "bugs-robustez", "router.afterEach acumulado en cada visita a /contact y restos de código de una API anterior en el modal de envío", "baja", "P3", "XS", "código", "confirmado",
 {"C": ["BUG-012", "BUG-013"], "G": [], "D": []}, "Exclusivo de C.", "C:03-bugs-robustez.md#BUG-012"),
("U-BUG-017", "bugs-robustez", "Año del footer calculado con new Date() (posible desajuste de hidratación en el cambio de año)", "baja", "P3", "XS", "código", "no-verificable",
 {"C": [], "G": [], "D": ["BUG-012"]}, "Hipótesis de D; no reproducible hasta el cambio de año.", "D:03-bugs-robustez.md#BUG-012"),
("U-BUG-018", "bugs-robustez", "El build lee la URL de la API de dos fuentes distintas y mezcla datos en una misma ejecución", "media", "P1", "S", "código", "confirmado",
 {"C": ["CODE-001"], "G": [], "D": []}, "Exclusivo de C (cachedRoutes con la API pública y sitemap con la API local en el mismo build).", "C:10-calidad-codigo.md#CODE-001"),
# ---------------- SEO ----------------
("U-SEO-001", "seo", "Las páginas de proyecto no tienen contenido propio en el HTML, duplican metadatos y el listado no las enlaza", "alta", "P1", "L", "ambos", "confirmado",
 {"C": ["SEO-001"], "G": ["BUG-003", "SEO-001"], "D": ["SEO-001"]}, "Coincidencia total. G cifra «200+ páginas»; el número real es 34 URLs de proyecto (16 proyectos + 18 páginas).", "C:04-seo.md#SEO-001"),
("U-SEO-002", "seo", "41 de 42 URLs del sitemap redirigen (barra final) y el canonical apunta a la URL redirigida", "alta", "P1", "S", "producción", "confirmado",
 {"C": ["SEO-002"], "G": [], "D": []}, "Exclusivo de C (produccion-sitemap-status.txt: 41 × 301).", "C:04-seo.md#SEO-002"),
("U-SEO-003", "seo", "Producción sin canonical ni JSON-LD y con dos h1 por página (corregido en el código)", "media", "P1", "XS", "producción", "confirmado",
 {"C": ["SEO-003"], "G": [], "D": ["SEO-004"]}, "C y D coinciden.", "C:04-seo.md#SEO-003"),
("U-SEO-004", "seo", "Imágenes sociales relativas, cuadradas o en dominio externo; twitter:card incoherente", "media", "P2", "S", "ambos", "confirmado",
 {"C": ["SEO-005"], "G": ["PERF-005"], "D": ["SEO-003", "SEO-006", "SEO-010"]}, "Coincidencia total.", "C:04-seo.md#SEO-005"),
("U-SEO-005", "seo", "lastmod del sitemap = fecha del build", "media", "P2", "XS", "ambos", "confirmado",
 {"C": ["SEO-006"], "G": [], "D": ["SEO-005"]}, "C y D coinciden.", "C:04-seo.md#SEO-006"),
("U-SEO-006", "seo", "JSON-LD incompleto (sameAs desactualizado; sin BreadcrumbList, ProfilePage ni datos por proyecto)", "media", "P2", "S", "código", "confirmado",
 {"C": ["SEO-007"], "G": ["SEO-007"], "D": ["SEO-007"]}, "C y D media, G baja; mediana: media.", "C:04-seo.md#SEO-007"),
("U-SEO-007", "seo", "Jerarquía de encabezados con saltos y h1 adicionales desde BlockHeader", "media", "P2", "XS", "código", "confirmado",
 {"C": ["SEO-009", "A11Y-006"], "G": ["SEO-005"], "D": ["SEO-008", "A11Y-004"]}, "C baja, G y D media; mediana: media.", "C:04-seo.md#SEO-009"),
("U-SEO-008", "seo", "Texto alternativo: genérico en la galería de /about y ausente en varias plantillas de producción", "media", "P2", "S", "ambos", "confirmado",
 {"C": ["SEO-010", "A11Y-004"], "G": [], "D": ["A11Y-005"]}, "D (alta): image-alt falla en producción (reverificado en los Lighthouse de C: about, projects, social y webs). En el código actual todas las imágenes tienen alt, pero el de la galería es genérico. Se toma media.", "D:08-accesibilidad.md#A11Y-005"),
("U-SEO-009", "seo", "/blog: indexable y en el sitemap en producción; noindex y fuera del sitemap en el código", "baja", "P3", "XS", "producción", "parcial",
 {"C": [], "G": ["SEO-003"], "D": ["SEO-002"]}, "G (sin noindex) acierta para producción; en el código hay noindex. D afirma que el sitemap incluye /blog con noindex: no se reproduce en el build actual con pnpm (7 URLs sin /blog). Se resuelve al desplegar. Ver también U-UX-001.", "G:04-seo.md#SEO-003"),
("U-SEO-010", "seo", "Títulos y descripciones demasiado largos y rol profesional inconsistente", "baja", "P2", "XS", "código", "confirmado",
 {"C": ["SEO-008", "CONT-002"], "G": [], "D": []}, "Exclusivo de C.", "C:04-seo.md#SEO-008"),
("U-SEO-011", "seo", "og:locale:alternate en_US sin versión en inglés", "baja", "P3", "XS", "ambos", "confirmado",
 {"C": ["SEO-011"], "G": ["SEO-006"], "D": ["SEO-011"]}, "Coincidencia total.", "C:04-seo.md#SEO-011"),
("U-SEO-012", "seo", "Sin meta theme-color y favicon .ico declarado dos veces", "baja", "P3", "XS", "código", "confirmado",
 {"C": [], "G": [], "D": ["SEO-009"]}, "Exclusivo de D. Reverificado en el HTML del build actual (dos <link rel=icon> .ico y sin theme-color).", "D:04-seo.md#SEO-009"),
# ---------------- Rendimiento ----------------
("U-PERF-001", "rendimiento", "Política de caché incorrecta: producción no envía Cache-Control y el .htaccess versionado cachearía el HTML un mes", "alta", "P1", "XS", "ambos", "parcial",
 {"C": ["PERF-001"], "G": ["PERF-002"], "D": ["PERF-004"]}, "G y D: el .htaccess cachea el HTML un mes. Reverificado por C: en producción no hay Expires ni Cache-Control (mod_expires inactivo). El riesgo de G y D es real si se activa el módulo; el problema actual es la ausencia total de caché. Se fusionan.", "C:05-rendimiento.md#PERF-001"),
("U-PERF-002", "rendimiento", "reCAPTCHA y Google Tag Manager cargados en todas las páginas (~560 KB y ~300 KB de JS sin usar)", "alta", "P1", "S", "ambos", "confirmado",
 {"C": ["PERF-002"], "G": [], "D": ["PERF-002"]}, "C y D coinciden.", "C:05-rendimiento.md#PERF-002"),
("U-PERF-003", "rendimiento", "LCP móvil: 7,6–9,1 s en producción y 2,3–3,9 s en el código actual", "alta", "P1", "S", "ambos", "parcial",
 {"C": ["PERF-003"], "G": ["PERF-001"], "D": ["PERF-003"]}, "Los tres miden un LCP móvil alto en producción. D lo atribuye al TTFB: es falso, el TTFB medido es 128–171 ms. G lo atribuye a fuentes y scripts tempranos: parcialmente (reCAPTCHA). En el código actual el LCP es de texto y lo frenan el CSS bloqueante y la falta de precarga de fuentes.", "C:05-rendimiento.md#PERF-003"),
("U-PERF-004", "rendimiento", "JavaScript propio inicial por encima del presupuesto de 120 KB comprimido", "media", "P2", "M", "código", "ajustado",
 {"C": [], "G": ["PERF-004"], "D": ["PERF-001"]}, "G media, D alta. C midió 131 KB br de JS propio en la home (sin contar terceros) y no lo reportó como hallazgo. Se ajusta a media: el exceso propio es de ~10 %; el grueso son terceros (U-PERF-002).", "D:05-rendimiento.md#PERF-001"),
("U-PERF-005", "rendimiento", "Desplazamientos de layout (CLS) por el cambio de fuente y por imágenes sin dimensiones", "media", "P2", "S", "ambos", "confirmado",
 {"C": ["PERF-004", "RESP-006"], "G": [], "D": ["PERF-008"]}, "C y D coinciden (CLS 0,12–0,39 en /about).", "C:05-rendimiento.md#PERF-004"),
("U-PERF-006", "rendimiento", "Imágenes pesadas o sin optimizar (GIF de 289 KB, og de 332 KB, galería sin srcset válido)", "media", "P2", "S", "ambos", "confirmado",
 {"C": ["PERF-005"], "G": [], "D": []}, "Exclusivo de C.", "C:05-rendimiento.md#PERF-005"),
("U-PERF-007", "rendimiento", "Demasiados pesos de fuente generados (2 familias × 5 pesos)", "baja", "P3", "XS", "código", "ajustado",
 {"C": ["PERF-003"], "G": ["PERF-003"], "D": ["PERF-005"]}, "G y D media. Se ajusta a baja: se generan 11 archivos, pero en el primer render solo se descargan 2 (49 KB, Lighthouse de C).", "G:05-rendimiento.md#PERF-003"),
("U-PERF-008", "rendimiento", "Los 45 iconos SVG de MaterialIcon viajan en un chunk precargado en todas las páginas", "baja", "P3", "S", "código", "confirmado",
 {"C": [], "G": [], "D": ["PERF-006"]}, "Exclusivo de D. Reverificado: chunk de 22,8 KB con los 45 SVG, referenciado desde la home, /about, /contact y /privacy.", "D:05-rendimiento.md#PERF-006"),
("U-PERF-009", "rendimiento", "Datos pedidos en cliente tras la hidratación, sin preconnect a la API", "baja", "P3", "M", "código", "confirmado",
 {"C": ["PERF-006"], "G": [], "D": []}, "Exclusivo de C.", "C:05-rendimiento.md#PERF-006"),
# ---------------- Responsive ----------------
("U-RESP-001", "responsive", "En móvil el header fijo tapa el botón de cerrar del modal de proyecto", "alta", "P1", "XS", "código", "confirmado",
 {"C": ["RESP-001"], "G": [], "D": []}, "Exclusivo de C (elementFromPoint en 390×844 devuelve el NAV del header). Código sin cambios desde la medición (z-index 11 frente a z-50).", "C:06-responsive-compatibilidad.md#RESP-001"),
("U-RESP-002", "responsive", "Scroll horizontal en la home en todos los móviles (h2 «ESPECIALIZACIONES»)", "alta", "P1", "XS", "código", "confirmado",
 {"C": ["RESP-002"], "G": [], "D": []}, "Discrepancia: G declaró «sin scroll horizontal en ninguna vista». Reverificado en la consolidación sobre un build nuevo con pnpm: scrollWidth 437 px en 320–430 px (Chromium y WebKit); el h2 necesita 405 px. Lo de G es un falso negativo.", "C:06-responsive-compatibilidad.md#RESP-002"),
("U-RESP-003", "responsive", "El banner de cookies ocupa ~45 % de la pantalla en móvil", "media", "P2", "XS", "ambos", "confirmado",
 {"C": ["RESP-003"], "G": [], "D": []}, "Exclusivo de C (capturas).", "C:06-responsive-compatibilidad.md#RESP-003"),
("U-RESP-004", "responsive", "word-break: break-all parte las palabras por la mitad en el contenido de proyectos", "media", "P2", "XS", "código", "confirmado",
 {"C": ["RESP-004"], "G": [], "D": []}, "Exclusivo de C (captura del modal).", "C:06-responsive-compatibilidad.md#RESP-004"),
("U-RESP-005", "responsive", "Modales y menús con 100vh/100vw en lugar de dvh", "media", "P2", "S", "código", "confirmado",
 {"C": ["RESP-005"], "G": ["RESP-003"], "D": []}, "C y G coinciden (probable: no se ha probado en iOS real).", "C:06-responsive-compatibilidad.md#RESP-005"),
("U-RESP-006", "responsive", "Sin color-scheme: dark (scrollbars y controles nativos claros)", "baja", "P3", "XS", "código", "ajustado",
 {"C": [], "G": ["RESP-002"], "D": []}, "G media; C lo anotó en cobertura sin abrir hallazgo. Se ajusta a baja (estético).", "G:06-responsive-compatibilidad.md#RESP-002"),
("U-RESP-007", "responsive", "Titular del hero en text-5xl muy grande a 320 px", "baja", "P3", "XS", "código", "ajustado",
 {"C": [], "G": ["RESP-001"], "D": []}, "G media. El h1 del hero no desborda (verificado); se ajusta a baja (decisión de diseño).", "G:06-responsive-compatibilidad.md#RESP-001"),
("U-RESP-008", "responsive", "Texto del buscador bajo el icono y rounded-full redefinido a 0.75rem", "baja", "P3", "XS", "código", "confirmado",
 {"C": ["RESP-007", "RESP-008"], "G": [], "D": []}, "Exclusivo de C.", "C:06-responsive-compatibilidad.md#RESP-007"),
# ---------------- UX y contenido ----------------
("U-UX-001", "ux-ui", "«Blog» en el menú principal lleva a una página vacía en construcción", "media", "P2", "XS", "ambos", "confirmado",
 {"C": ["UX-001"], "G": [], "D": []}, "Exclusivo de C (G y D lo tratan solo como un problema de indexación: U-SEO-009).", "C:07-ux-ui-contenido.md#UX-001"),
("U-UX-002", "ux-ui", "Formulario de contacto activo bajo un aviso de «fuera de servicio»", "media", "P1", "XS", "ambos", "confirmado",
 {"C": ["UX-002"], "G": [], "D": ["UX-002"]}, "C y D coinciden.", "C:07-ux-ui-contenido.md#UX-002"),
("U-UX-003", "ux-ui", "El modal de proyecto rompe el design system y dificulta la lectura", "media", "P2", "M", "código", "confirmado",
 {"C": ["UX-003"], "G": [], "D": []}, "Exclusivo de C.", "C:07-ux-ui-contenido.md#UX-003"),
("U-UX-004", "ux-ui", "La página de error no tiene header ni footer", "baja", "P3", "XS", "código", "confirmado",
 {"C": ["UX-004"], "G": [], "D": ["UX-004"]}, "C y D coinciden.", "C:07-ux-ui-contenido.md#UX-004"),
("U-UX-005", "ux-ui", "Banner de cookies e insignia de reCAPTCHA fuera del design system; dos sistemas de color", "baja", "P3", "S", "código", "confirmado",
 {"C": ["UX-005", "UX-006"], "G": [], "D": []}, "Exclusivo de C.", "C:07-ux-ui-contenido.md#UX-005"),
("U-UX-006", "ux-ui", "Archivo huérfano de 482 KB publicado (public/patterns/a.png)", "baja", "P3", "XS", "código", "confirmado",
 {"C": [], "G": ["UX-004"], "D": []}, "Exclusivo de G. Reverificado: ningún archivo lo referencia.", "G:07-ux-ui-contenido.md#UX-004"),
("U-CONT-001", "contenido", "Afirmaciones de actividad en redes difíciles de sostener y contradictorias", "media", "P2", "XS", "código", "confirmado",
 {"C": ["CONT-001"], "G": [], "D": []}, "Exclusivo de C.", "C:07-ux-ui-contenido.md#CONT-001"),
("U-CONT-002", "contenido", "Erratas, mezcla de tú y usted, marcas mal escritas y el campo «privacity»", "baja", "P3", "XS", "código", "confirmado",
 {"C": ["CONT-003"], "G": ["BUG-009"], "D": ["CONT-001"]}, "Coincidencia total.", "C:07-ux-ui-contenido.md#CONT-003"),
("U-CONT-003", "contenido", "Correo público como texto plano (sin mailto) y E-E-A-T mejorable (ubicación genérica, sin foto)", "baja", "P3", "XS", "código", "confirmado",
 {"C": ["CONT-004"], "G": [], "D": ["UX-005"]}, "C y D, con enfoques complementarios.", "C:07-ux-ui-contenido.md#CONT-004"),
("U-CONT-004", "contenido", "Enlace a Stack Overflow en /social responde 403", "informativa", "P3", "XS", "producción", "no-verificable",
 {"C": [], "G": ["UX-003"], "D": []}, "G baja. Reverificado: 403 incluso con user agent de navegador. Es la protección anti-bot de Stack Overflow; no se puede distinguir de un perfil inexistente sin un navegador real.", "G:07-ux-ui-contenido.md#UX-003"),
# ---------------- Accesibilidad ----------------
("U-A11Y-001", "accesibilidad", "Contraste insuficiente (footer a 1,98:1 en todas las páginas, /blog, hovers y bordes)", "alta", "P1", "XS", "ambos", "confirmado",
 {"C": ["A11Y-001"], "G": ["A11Y-001"], "D": ["A11Y-002"]}, "Coincidencia total.", "C:08-accesibilidad.md#A11Y-001"),
("U-A11Y-002", "accesibilidad", "Tarjetas de proyecto y filtros de tecnología inaccesibles con teclado y lector de pantalla", "alta", "P1", "S", "código", "confirmado",
 {"C": ["A11Y-002"], "G": [], "D": []}, "Exclusivo de C (recorrido de Tab). Reverificado: la tarjeta sigue siendo <div @click>.", "C:08-accesibilidad.md#A11Y-002"),
("U-A11Y-003", "accesibilidad", "Modal de proyecto: cierre sin rol ni nombre, foco no atrapado ni devuelto, paginador no operable", "alta", "P1", "M", "código", "confirmado",
 {"C": ["A11Y-003"], "G": ["A11Y-003", "A11Y-006"], "D": []}, "C y G coinciden.", "C:08-accesibilidad.md#A11Y-003"),
("U-A11Y-004", "accesibilidad", "Formulario de contacto: mensaje sin nombre accesible, errores no asociados ni anunciados, sin submit nativo", "alta", "P1", "S", "código", "confirmado",
 {"C": ["A11Y-005"], "G": ["A11Y-002"], "D": ["A11Y-003", "A11Y-007"]}, "Coincidencia total.", "C:08-accesibilidad.md#A11Y-005"),
("U-A11Y-005", "accesibilidad", "Listas de EditorJS renderizadas con <div> en lugar de <ul>/<ol>/<li>", "media", "P2", "XS", "código", "confirmado",
 {"C": [], "G": ["A11Y-004"], "D": []}, "Exclusivo de G. Reverificado: BlockList.vue y BlockListItems.vue solo usan <div>.", "G:08-accesibilidad.md#A11Y-004"),
("U-A11Y-006", "accesibilidad", "Tablas de contenido sin <caption> ni scope en los encabezados", "media", "P2", "XS", "código", "confirmado",
 {"C": [], "G": ["A11Y-005"], "D": ["A11Y-009"]}, "G y D coinciden; C no lo revisó. Reverificado en BlockTable.vue.", "G:08-accesibilidad.md#A11Y-005"),
("U-A11Y-007", "accesibilidad", "Botones solo-icono sin nombre accesible (copiar código y otros)", "media", "P2", "XS", "código", "confirmado",
 {"C": ["A11Y-009"], "G": ["A11Y-007"], "D": []}, "C baja, G media; se toma la mayor.", "G:08-accesibilidad.md#A11Y-007"),
("U-A11Y-008", "accesibilidad", "Sin enlace «Saltar al contenido», menú móvil sin Esc ni gestión de foco y foco bajo el header fijo", "media", "P2", "XS", "código", "confirmado",
 {"C": ["A11Y-008"], "G": [], "D": ["A11Y-006", "A11Y-008", "A11Y-010"]}, "C y D coinciden.", "C:08-accesibilidad.md#A11Y-008"),
("U-A11Y-009", "accesibilidad", "Scroll suave por JS sin respetar prefers-reduced-motion y GIF animados", "baja", "P3", "XS", "código", "confirmado",
 {"C": ["A11Y-007"], "G": ["A11Y-008"], "D": ["A11Y-011"]}, "Coincidencia total.", "C:08-accesibilidad.md#A11Y-007"),
("U-A11Y-010", "accesibilidad", "Producción sin landmark <main> (corregido en el código)", "media", "P2", "XS", "producción", "ajustado",
 {"C": [], "G": [], "D": ["A11Y-001"]}, "Exclusivo de D (alta). Reverificado: el HTML de producción no contiene <main>; el código actual sí. Se ajusta a media porque se corrige con el despliegue.", "D:08-accesibilidad.md#A11Y-001"),
# ---------------- Dependencias ----------------
("U-DEP-001", "dependencias", "Gestor de paquetes a medias: pnpm es el oficial, pero gocd.yaml usa npm ci y package-lock.json sigue en el repo", "alta", "P1", "S", "código", "ajustado",
 {"C": ["DEP-001"], "G": ["DEP-002", "DEP-004"], "D": ["DEP-001", "DEP-007", "INFRA-004"]}, "Las tres auditorías detectan la incoherencia npm/pnpm (G y C proponían npm; D, pnpm). Decisión del propietario tras las auditorías: pnpm. Verificado con pnpm 12.9.1: install --frozen-lockfile, lint, vue-tsc y tests correctos. Pendiente: gocd.yaml (3 × npm ci), package-lock.json y packageManager/engines. El «package-lock desincronizado (103)» de G no se reproduce (npm ci --dry-run correcto) y queda obsoleto.", "D:09-dependencias.md#DEP-001"),
("U-DEP-002", "dependencias", "Vulnerabilidades conocidas: 1 crítica (@nuxt/devtools, RCE en el equipo de desarrollo) y 47 altas (pnpm audit)", "alta", "P1", "M", "código", "ajustado",
 {"C": ["DEP-002"], "G": ["DEP-001", "DEP-003"], "D": ["DEP-002", "DEP-005"]}, "G calificó la RCE de devtools de crítica; C y D, alta. Se mantiene alta: solo es explotable durante pnpm dev. Recuento actualizado con pnpm audit: crítica 1, altas 47, moderadas 24 y bajas 6; producción (--prod): altas 6, moderadas 11 y bajas 4.", "C:09-dependencias.md#DEP-002"),
("U-DEP-003", "dependencias", "test:coverage falla (falta @vitest/coverage-v8)", "media", "P2", "XS", "código", "confirmado",
 {"C": ["DEP-003"], "G": ["DEP-005"], "D": ["DEP-003"]}, "Coincidencia total (reverificado con pnpm).", "C:09-dependencias.md#DEP-003"),
("U-DEP-004", "dependencias", "vue-recaptcha-v3 sin mantenimiento desde 2022", "media", "P2", "S", "código", "confirmado",
 {"C": ["DEP-004"], "G": [], "D": []}, "Exclusivo de C.", "C:09-dependencias.md#DEP-004"),
("U-DEP-005", "dependencias", "Versión de Node sin fijar (sin engines ni .nvmrc)", "media", "P2", "XS", "código", "confirmado",
 {"C": ["DEP-005"], "G": [], "D": ["DEP-006"]}, "C baja, D media; se toma la mayor.", "D:09-dependencias.md#DEP-006"),
("U-DEP-006", "dependencias", "Dependencias desactualizadas, sin uso (ts-node, tsconfig-paths) y compatibilityDate antigua", "media", "P2", "S", "código", "confirmado",
 {"C": ["DEP-006"], "G": [], "D": ["DEP-004"]}, "C baja, D media; se toma la mayor.", "D:09-dependencias.md#DEP-004"),
("U-DEP-007", "dependencias", "Sin Renovate/Dependabot ni auditoría de dependencias en el CI", "media", "P2", "S", "código", "confirmado",
 {"C": ["DEP-007"], "G": [], "D": []}, "Exclusivo de C.", "C:09-dependencias.md#DEP-007"),
# ---------------- Calidad de código ----------------
("U-CODE-001", "calidad-codigo", "Código y configuración muertos (11 archivos, apiClient.ts, plugins:[] y código comentado)", "media", "P2", "S", "código", "confirmado",
 {"C": ["CODE-002"], "G": ["CODE-001"], "D": ["CODE-003"]}, "Coincidencia total.", "C:10-calidad-codigo.md#CODE-002"),
("U-CODE-002", "calidad-codigo", "Sin tests en las zonas críticas (rutas, formulario, bloques, build)", "media", "P2", "M", "código", "confirmado",
 {"C": ["CODE-003"], "G": ["CODE-004"], "D": ["CODE-002"]}, "C y D media, G baja; mediana: media.", "C:10-calidad-codigo.md#CODE-003"),
("U-CODE-003", "calidad-codigo", "Avisos de ESLint (props sin tipo, v-html, any)", "baja", "P3", "S", "código", "confirmado",
 {"C": ["CODE-004"], "G": ["CODE-003"], "D": ["CODE-004", "CODE-005"]}, "Coincidencia total. Recuento actual: 36 avisos (38 al iniciar las auditorías).", "C:10-calidad-codigo.md#CODE-004"),
("U-CODE-004", "calidad-codigo", "Documentación desfasada (componentes muertos, comandos rotos, gestor de paquetes)", "baja", "P3", "XS", "código", "ajustado",
 {"C": ["CODE-005"], "G": ["CODE-002"], "D": ["CODE-001", "INFRA-007"]}, "G (media) y D (alta) señalaron la documentación de la API v1. Quedó resuelto durante las auditorías (AGENTS.md, README y docs/info actualizados a la v2 y a pnpm entre las 19:19 y las 20:23). Quedan desfases menores: se ajusta a baja.", "C:10-calidad-codigo.md#CODE-005"),
("U-CODE-005", "calidad-codigo", "CSS inválido o residual", "baja", "P3", "XS", "código", "confirmado",
 {"C": ["CODE-006"], "G": [], "D": []}, "Exclusivo de C.", "C:10-calidad-codigo.md#CODE-006"),
# ---------------- Infraestructura y CI/CD ----------------
("U-INFRA-001", "infraestructura-cicd", "Pipeline de GoCD no funcional: npm ci con NODE_ENV=production, sin variables de build, sin artefacto, verificación que no falla, sin puertas ni purga", "alta", "P0", "S", "código", "confirmado",
 {"C": ["INFRA-001"], "G": ["INFRA-002", "INFRA-004"], "D": ["INFRA-002", "INFRA-004", "INFRA-006"]}, "Las tres auditorías encuentran defectos del pipeline; cada una ve partes distintas (C: NODE_ENV omite devDependencies con npm; G: faltan APP_URL/API_*; D: npm en un repo pnpm). Verificado en la consolidación: con pnpm 12, NODE_ENV=production sí instala las devDependencies, así que ese punto concreto desaparece al migrar gocd.yaml a pnpm.", "C:11-infraestructura-cicd.md#INFRA-001"),
("U-INFRA-002", "infraestructura-cicd", "Las configuraciones de servidor versionadas no reflejan producción (Apache, nginx, .htaccess)", "alta", "P1", "S", "producción + código", "confirmado",
 {"C": ["INFRA-002"], "G": ["INFRA-001"], "D": ["INFRA-001", "INFRA-005"]}, "Coincidencia total.", "C:11-infraestructura-cicd.md#INFRA-002"),
("U-INFRA-003", "infraestructura-cicd", "Despliegue en caliente no atómico (rsync --delete) y verificación de una sola URL", "alta", "P1", "S", "código", "confirmado",
 {"C": ["INFRA-003"], "G": ["INFRA-003"], "D": ["INFRA-003"]}, "C media, G y D alta; mediana: alta. scripts/deploy.sh ya usa pnpm (cambio de las 20:23), pero mantiene el rsync en caliente.", "G:11-infraestructura-cicd.md#INFRA-003"),
("U-INFRA-004", "infraestructura-cicd", "www.raupulus.dev no resuelve en DNS", "media", "P2", "XS", "producción (DNS)", "ajustado",
 {"C": ["INFRA-004"], "G": ["SEO-002"], "D": []}, "G alta, C media. Se queda en media: no rompe ninguna URL publicada por el sitio; afecta a quien teclea www.", "C:11-infraestructura-cicd.md#INFRA-004"),
("U-INFRA-005", "infraestructura-cicd", "Sin monitorización de disponibilidad ni de errores de usuario", "media", "P1", "S", "producción", "confirmado",
 {"C": ["INFRA-005"], "G": [], "D": ["INFRA-006"]}, "C media, D baja; se toma la mayor: la caída funcional de producción (U-BUG-001) lleva semanas sin detectarse.", "C:11-infraestructura-cicd.md#INFRA-005"),
("U-INFRA-006", "infraestructura-cicd", "Producción desfasada y sin trazabilidad; la migración sigue sin commitear", "alta", "P0", "S", "ambos", "confirmado",
 {"C": ["INFRA-006"], "G": [], "D": []}, "Exclusivo de C. Reverificado: git status muestra 56 archivos modificados, 2 eliminados y 5 nuevos (sin contar docs/auditorias).", "C:11-infraestructura-cicd.md#INFRA-006"),
]

# Hallazgos originales que no pasan a la lista unificada (falso positivo, no reproducido o no son hallazgos)
DESCARTADOS = [
 ("G", "BUG-006", "falso-positivo", "useApiBase() devuelve el proxy /_proxy en cliente y en desarrollo (composables/useApiBase.ts:19-21); C no observó errores de hidratación en 300 cargas."),
 ("D", "PERF-007", "falso-positivo", "El GET con Content-Type: application/json está en utils/apiClient.ts, que no usa nadie (código muerto, U-CODE-001); los composables activos usan $fetch sin esa cabecera."),
 ("D", "RESP-002", "no-reproducido", "Hipótesis sobre tablas, código y embeds a 320 px: la matriz de C (300 cargas) no encontró desbordamientos fuera de la home; no hay proyectos con tablas en los datos de prueba."),
 ("D", "RESP-001", "no-es-hallazgo", "Es una limitación declarada («matriz completa no ejecutada»), sin severidad. Aparece en los informes de D pero no en su hallazgos.json."),
 ("D", "DEP-008", "no-es-hallazgo", "Limitación declarada («licencias no verificadas»), sin severidad. C sí lo verificó: sin incompatibilidades con GPL-3.0."),
]
```

## `gen-consolidacion.py`

```python
import json, sys, os
from collections import Counter, defaultdict
sys.path.insert(0, os.path.dirname(__file__))
from consolidacion_datos import U, DESCARTADOS
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = '/Users/fryntiz/git/3-Raupulus/www.raupulus.dev/docs/auditorias'
SRC = {'C': '2026-10-04-claude-interna', 'G': '2026-10-04-gemini-externo', 'D': '2026-10-04-deepsek-externo'}
NAME = {'C': 'claude-interna', 'G': 'gemini-externo', 'D': 'deepsek-externo'}
norm = lambda s: {'critica': 'crítica'}.get(str(s).lower(), str(s).lower())
orig = {k: {x['id']: x for x in json.load(open(f'{BASE}/{d}/hallazgos.json'))} for k, d in SRC.items()}
# Hallazgos de D presentes en el .md pero no en el JSON, y API-002 de G (recomendaciones-api)
extra = {('D', 'RESP-001'), ('D', 'DEP-008'), ('G', 'API-002')}
mapped = defaultdict(set)
for u in U:
    for k, ids in u[8].items():
        for i in ids: mapped[k].add(i)
desc = {(k, i) for k, i, *_ in DESCARTADOS}
problems = []
for k in 'CGD':
    for i in orig[k]:
        if i not in mapped[k] and (k, i) not in desc: problems.append(f'{k}:{i} sin asignar')
    for i in mapped[k]:
        if i not in orig[k] and (k, i) not in extra: problems.append(f'{k}:{i} no existe en origen')
ids = [u[0] for u in U]
assert len(ids) == len(set(ids)), 'IDs unificados duplicados'
print('problemas de mapeo:', problems or 'ninguno')
out = []
for (uid, area, tit, sev, pri, esf, amb, est, ori, nota, ref) in U:
    sev_o = {NAME[k]: [f"{i}:{norm(orig[k][i]['severidad']) if i in orig[k] else '—'}" for i in ori.get(k, [])] for k in 'CGD'}
    out.append({'id': uid, 'area': area, 'titulo': tit, 'severidad': sev, 'prioridad': pri, 'esfuerzo': esf, 'ambito': amb,
                'estado': est, 'detectado_por': sum(1 for k in 'CGD' if ori.get(k)),
                'origen': {NAME[k]: ori.get(k, []) for k in 'CGD'}, 'severidad_original': sev_o,
                'resolucion': nota, 'informe_referencia': ref})
order = {'crítica': 0, 'alta': 1, 'media': 2, 'baja': 3, 'informativa': 4}
out.sort(key=lambda x: (order[x['severidad']], x['prioridad'], x['id']))
dst = f'{BASE}/2026-10-04-consolidada'
os.makedirs(dst, exist_ok=True)
json.dump(out, open(f'{dst}/hallazgos.json', 'w'), ensure_ascii=False, indent=2)
json.dump([{'auditoria': NAME[k], 'id': i, 'estado': e, 'motivo': m} for k, i, e, m in DESCARTADOS],
          open(f'{dst}/descartados.json', 'w'), ensure_ascii=False, indent=2)
# Estadísticas
print('unificados:', len(out), dict(Counter(x['severidad'] for x in out)), dict(Counter(x['prioridad'] for x in out)))
print('estado:', dict(Counter(x['estado'] for x in out)))
print('detectado por:', dict(Counter(x['detectado_por'] for x in out)))
areas = defaultdict(list)
for x in out: areas[x['area']].append(x)
stats = {}
for a, xs in areas.items():
    c = Counter(x['detectado_por'] for x in xs)
    stats[a] = {'total': len(xs), '3': c[3], '2': c[2], '1': c[1], 'concordancia_%': round(100 * (c[2] + c[3]) / len(xs))}
json.dump(stats, open(f'{SP}/cons-stats.json', 'w'), ensure_ascii=False, indent=1)
for a, s in stats.items(): print(f'{a:22} {s}')
# Cobertura por auditor (sobre hallazgos sostenidos: excluye no-verificable)
held = [x for x in out if x['estado'] != 'no-verificable']
for k in 'CGD':
    n = NAME[k]
    det = [x for x in held if x['origen'][n]]
    hi = [x for x in held if x['severidad'] in ('crítica', 'alta')]
    hid = [x for x in hi if x['origen'][n]]
    print(f"{n:16} detecta {len(det)}/{len(held)} ({round(100*len(det)/len(held))} %) · críticos+altos {len(hid)}/{len(hi)} · exclusivos {sum(1 for x in held if x['detectado_por']==1 and x['origen'][n])}")
    print('   no detecta (crít/alta):', ', '.join(x['id'] for x in hi if not x['origen'][n]))
# Concordancia de severidad entre auditores que detectaron el mismo hallazgo
lvl = {'crítica': 4, 'alta': 3, 'media': 2, 'baja': 1, 'informativa': 0, '—': None}
same = diff = 0
for x in out:
    s = []
    for n, lst in x['severidad_original'].items():
        vals = [lvl[v.split(':')[1]] for v in lst if lvl.get(v.split(':')[1]) is not None]
        if vals: s.append(max(vals))
    if len(s) >= 2:
        if max(s) - min(s) == 0: same += 1
        else: diff += 1
print('severidad idéntica entre detectores:', same, '· distinta:', diff)
```

## `gen-matriz.py`

```python
import json
from collections import Counter, defaultdict
D = '/Users/fryntiz/git/3-Raupulus/www.raupulus.dev/docs/auditorias/2026-10-04-consolidada'
h = json.load(open(f'{D}/hallazgos.json'))
desc = json.load(open(f'{D}/descartados.json'))
N = ['claude-interna', 'gemini-externo', 'deepsek-externo']
AREAS = [('seguridad', 'Seguridad'), ('privacidad-legal', 'Privacidad y legal'), ('bugs-robustez', 'Bugs y robustez'), ('seo', 'SEO'),
         ('rendimiento', 'Rendimiento'), ('responsive', 'Responsive'), ('ux-ui', 'UX/UI'), ('contenido', 'Contenido'),
         ('accesibilidad', 'Accesibilidad'), ('dependencias', 'Dependencias'), ('calidad-codigo', 'Calidad de código'), ('infraestructura-cicd', 'Infraestructura y CI/CD')]
ab = {'crítica': 'Crít.', 'alta': 'Alta', 'media': 'Media', 'baja': 'Baja', 'informativa': 'Info', '—': '—'}
def cell(x, n):
    v = x['severidad_original'][n]
    if not v: return '—'
    return '<br>'.join(f"{i.split(':')[0]} ({ab.get(i.split(':')[1], i.split(':')[1])})" for i in v)
L = ['# Matriz de concordancia', '',
     '> Consolidación de `claude-interna` (C), `gemini-externo` (G) y `deepsek-externo` (D), 2026-10-04. Cada fila es una causa',
     '> raíz; las celdas muestran los ID originales y su severidad en cada auditoría. «Final» es la severidad tras resolver',
     '> discrepancias (ver [discrepancias-resueltas.md](discrepancias-resueltas.md)). Fuente: [hallazgos.json](hallazgos.json).', '',
     '## Estadísticas', '', '### Por área', '',
     '| Área | Unificados | Los 3 | 2 de 3 | Solo 1 | Concordancia (≥ 2) |', '| --- | --- | --- | --- | --- | --- |']
tot = Counter()
for a, t in AREAS:
    xs = [x for x in h if x['area'] == a]
    c = Counter(x['detectado_por'] for x in xs)
    tot.update({'n': len(xs), '3': c[3], '2': c[2], '1': c[1]})
    L.append(f"| {t} | {len(xs)} | {c[3]} | {c[2]} | {c[1]} | {round(100*(c[2]+c[3])/len(xs))} % |")
L.append(f"| **Total** | **{tot['n']}** | **{tot['3']}** | **{tot['2']}** | **{tot['1']}** | **{round(100*(tot['2']+tot['3'])/tot['n'])} %** |")
L += ['', '### Por auditoría', '', 'Sobre los hallazgos sostenidos (se excluyen los marcados como no verificables).', '',
      '| Auditoría | Hallazgos originales | Detecta de los unificados | Críticos y altos detectados | Exclusivos confirmados | Descartados |', '| --- | --- | --- | --- | --- | --- |']
held = [x for x in h if x['estado'] != 'no-verificable']
hi = [x for x in held if x['severidad'] in ('crítica', 'alta')]
orig_n = {'claude-interna': 93, 'gemini-externo': 64, 'deepsek-externo': 85}
for n in N:
    det = [x for x in held if x['origen'][n]]
    L.append(f"| `{n}` | {orig_n[n]} | {len(det)} de {len(held)} ({round(100*len(det)/len(held))} %) | {sum(1 for x in hi if x['origen'][n])} de {len(hi)} | {sum(1 for x in held if x['detectado_por']==1 and x['origen'][n])} | {sum(1 for d in desc if d['auditoria']==n)} |")
L += ['', '### Puntos ciegos (críticos y altos que cada auditoría no detectó)', '']
for n in N:
    miss = [x for x in hi if not x['origen'][n]]
    L.append(f"- **`{n}`** ({len(miss)}): " + ('; '.join(f"{x['id']} {x['titulo']}" for x in miss) if miss else 'ninguno.'))
L += ['', '### Concordancia de severidad', '']
lvl = {'crítica': 4, 'alta': 3, 'media': 2, 'baja': 1, 'informativa': 0}
same = diff1 = diff2 = 0
for x in h:
    s = []
    for n in N:
        vals = [lvl[v.split(':')[1]] for v in x['severidad_original'][n] if v.split(':')[1] in lvl]
        if vals: s.append(max(vals))
    if len(s) >= 2:
        d = max(s) - min(s)
        if d == 0: same += 1
        elif d == 1: diff1 += 1
        else: diff2 += 1
L.append(f"De los {same+diff1+diff2} hallazgos detectados por al menos dos auditorías: **{same} con la misma severidad**, {diff1} con un nivel de diferencia y {diff2} con dos o más niveles. Las diferencias se resuelven en `discrepancias-resueltas.md`.")
L += ['', '## Matriz por área', '']
for a, t in AREAS:
    xs = [x for x in h if x['area'] == a]
    L += [f'### {t}', '', '| ID | Causa raíz | C | G | D | Final | Estado |', '| --- | --- | --- | --- | --- | --- | --- |']
    for x in sorted(xs, key=lambda y: y['id']):
        L.append(f"| {x['id']} | {x['titulo']} | {cell(x,'claude-interna')} | {cell(x,'gemini-externo')} | {cell(x,'deepsek-externo')} | **{ab[x['severidad']]}** {x['prioridad']} | {x['estado']} |")
    L.append('')
L += ['## Hallazgos originales descartados', '', '| Auditoría | ID | Estado | Motivo |', '| --- | --- | --- | --- |']
for d in desc: L.append(f"| `{d['auditoria']}` | {d['id']} | {d['estado']} | {d['motivo']} |")
open(f'{D}/matriz-concordancia.md', 'w').write('\n'.join(L) + '\n')
print('ok', len(L))
```
