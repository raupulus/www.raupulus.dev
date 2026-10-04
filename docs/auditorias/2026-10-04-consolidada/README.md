# Auditoría consolidada de www.raupulus.dev — 2026-10-04

## 1. Ficha

| Campo                   | Valor                                                                                                                                                                                                                                                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modo                    | `consolidacion` (sección 11 de [`PROMPT-AUDITORIA.md`](../PROMPT-AUDITORIA.md))                                                                                                                                                                                                                                                    |
| Auditorías consolidadas | [`claude-interna`](../2026-10-04-claude-interna/README.md) (93 hallazgos, 4,3/10) · [`gemini-externo`](../2026-10-04-gemini-externo/README.md) (64, 5,3/10) · [`deepsek-externo`](../2026-10-04-deepsek-externo/README.md) (85, 5,0/10)                                                                                            |
| Commit auditado         | `05acdf1` (rama `dev`) con cambios sin commitear; producción con build del 2026-09-11                                                                                                                                                                                                                                              |
| Consolidación           | 2026-10-04, 20:30–22:45 CEST, por Claude (el mismo agente que hizo `claude-interna`; ver sección 7)                                                                                                                                                                                                                                |
| Reverificación          | pnpm 12.9.1 (install, lint, tipos, tests y audit), build nuevo del árbol de trabajo, Playwright 1.63 (Chromium y WebKit), GET pasivos a producción y a la API                                                                                                                                                                      |
| Entregables             | [matriz-concordancia.md](matriz-concordancia.md) · [discrepancias-resueltas.md](discrepancias-resueltas.md) · [hallazgos.json](hallazgos.json) (106 unificados, con `origen`) · [descartados.json](descartados.json) · [plan-remediacion.md](plan-remediacion.md) · [evidencias/verificaciones.txt](evidencias/verificaciones.txt) |

## 2. Resumen ejecutivo

Las tres auditorías coinciden en el diagnóstico de fondo: **el portfolio publicado no funciona como debería y el código
nuevo todavía no se puede desplegar con seguridad**. Producción usa una API retirada y no muestra ningún proyecto. La
API nueva no tiene proyectos cargados, y el proceso de construcción genera la web «con éxito» sin ellos. El pipeline
de despliegue tiene varios fallos que impiden confiar en él.

**Seguridad y privacidad.** Las tres señalan lo mismo: no hay cabeceras de seguridad, el HTTPS estricto está
desactivado, el sanitizador de contenido es permisivo y el consentimiento de cookies no es válido (Google recibe datos
antes de aceptar, aceptar analítica activa la publicidad y no se puede revocar). La política de privacidad es
insuficiente.

**SEO, accesibilidad y móvil.** Hay acuerdo en que las páginas de proyecto no tienen contenido indexable y en que
cualquier URL inexistente devuelve la portada. Solo la auditoría interna encontró, y la consolidación ha reverificado,
tres problemas graves que las externas pasaron por alto: en móvil no se puede cerrar la ventana de un proyecto, la
portada se desplaza en horizontal, y con teclado no se puede abrir ningún proyecto.

**Lo positivo:** con pnpm (el gestor oficial) la instalación con lockfile congelado, el lint, los tipos y los 45 tests
pasan sin errores. No hay secretos expuestos. La mayoría de las correcciones son pequeñas, y el
[plan único](plan-remediacion.md) recupera producción en 1–2 días.

## 3. Puntuación consolidada

Recalculada sobre los hallazgos unificados con la rúbrica del prompt. La mediana de las tres originales es 5,0.

| Área                 | Peso | Consolidada  | claude-interna | gemini-externo | deepsek-externo | Base de la nota consolidada                                             |
| -------------------- | ---- | ------------ | -------------- | -------------- | --------------- | ----------------------------------------------------------------------- |
| Seguridad            | 15   | **4,5**      | 4              | 4,5            | 6               | 3 altos (cabeceras, HSTS, host de la API) y 5 medios                    |
| Bugs / robustez      | 15   | **3**        | 3              | 4              | 4               | 2 críticos (producción sin datos, build sin proyectos)                  |
| SEO                  | 15   | **5**        | 4              | 5,5            | 6               | 2 altos (proyectos sin contenido, sitemap con redirecciones) y 6 medios |
| Rendimiento          | 15   | **4,5**      | 5              | 6              | 4               | 3 altos (sin caché, terceros globales, LCP móvil)                       |
| Responsive           | 10   | **5**        | 5              | 7,5            | 6               | 2 altos (modal tapado y desbordamiento, reverificados)                  |
| Accesibilidad        | 10   | **4**        | 4              | 5              | 4               | 4 altos; incumple WCAG 2.2 nivel A                                      |
| Privacidad / legal   | 8    | **4**        | 4              | 4,5            | 4               | 5 altos (banner, terceros, Consent Mode, revocación, política)          |
| UX / contenido       | 5    | **7**        | 7              | 7,5            | 6               | Sin altos; 4 medios                                                     |
| Dependencias         | 3    | **5**        | 5              | 4              | 5               | 2 altos (migración a pnpm a medias, vulnerabilidades)                   |
| Calidad de código    | 2    | **7**        | 7              | 7              | 6               | Sin altos; código muerto y pocos tests                                  |
| Infra / CI-CD        | 2    | **3**        | 3              | 4,5            | 3               | 4 altos, 2 de ellos P0                                                  |
| **Global ponderada** | 100  | **4,5 / 10** | 4,3            | 5,3            | 5,0             |                                                                         |

## 4. Recuento consolidado

| Severidad   | Unificados | P0    | P1     | P2     | P3     |
| ----------- | ---------- | ----- | ------ | ------ | ------ |
| Crítica     | 2          | 2     | —      | —      | —      |
| Alta        | 28         | 2     | 26     | —      | —      |
| Media       | 45         | —     | 7      | 38     | —      |
| Baja        | 30         | —     | —      | 2      | 28     |
| Informativa | 1          | —     | —      | —      | 1      |
| **Total**   | **106**    | **4** | **33** | **40** | **29** |

- **Concordancia:** 40 hallazgos los detectaron las tres auditorías, 30 dos de ellas y 36 solo una (66 % detectados por
  al menos dos). La mayor coincidencia está en seguridad (91 %) e infraestructura (83 %); la menor, en responsive
  (12 %), porque solo `claude-interna` ejecutó la matriz de viewports.
- **Severidad:** de los 69 hallazgos detectados por al menos dos auditorías, 36 tenían la misma severidad y 33 diferían
  (29 en un nivel y 4 en dos o más). Se han ajustado 17 severidades y 4 hallazgos se mantienen solo en parte.
- **Descartados:** 5 originales (2 falsos positivos, 1 no reproducido y 2 limitaciones declaradas que no son
  hallazgos).

## 5. Top 10 de riesgos consolidados

| #   | ID                                            | Riesgo                                                                                                                 | Detectado por       | Prioridad |
| --- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------- | --------- |
| 1   | U-BUG-001                                     | Producción sin proyectos, con errores en todas las páginas y el CV roto (API v1 retirada).                             | C, D                | P0        |
| 2   | U-BUG-002                                     | El build termina en verde sin proyectos y hoy la API v2 está vacía: desplegar borraría 34 URLs.                        | C, G, D             | P0        |
| 3   | U-INFRA-006                                   | Migración sin commitear y producción sin trazabilidad de versión.                                                      | C                   | P0        |
| 4   | U-INFRA-001                                   | Pipeline de GoCD no funcional (npm en un repo pnpm, sin variables de build, sin artefacto, verificación que no falla). | C, G, D             | P0        |
| 5   | U-SEC-001, U-SEC-002                          | Sin cabeceras de seguridad y con HSTS desactivado.                                                                     | C, G, D             | P1        |
| 6   | U-SEC-003                                     | La API sirvió URLs en `evil.example`; ya no aparecen, pero la causa sigue sin aclarar.                                 | C, G                | P1        |
| 7   | U-SEO-001, U-BUG-004, U-SEO-002               | Proyectos sin contenido indexable ni enlaces; soft-404 universal; sitemap con 41 redirecciones.                        | C, G, D / C         | P1        |
| 8   | U-A11Y-002, U-A11Y-003, U-RESP-001, U-BUG-005 | Proyectos inaccesibles con teclado; en móvil, el modal no se puede cerrar ni con «atrás».                              | C (+ G en el modal) | P1        |
| 9   | U-LEGAL-001…005                               | Consentimiento de cookies no válido, terceros antes de aceptar y política de privacidad incompleta.                    | C, G, D             | P1        |
| 10  | U-BUG-003                                     | El formulario de contacto no puede enviarse (CSRF entre subdominios).                                                  | C, G, D             | P1        |

## 6. Qué aportó cada auditoría

|                                     | `claude-interna`                                                                                                                                           | `gemini-externo`                                                                                                                                                | `deepsek-externo`                                                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Detección sobre los 104 sostenidos  | 91 (88 %)                                                                                                                                                  | 56 (54 %)                                                                                                                                                       | 67 (64 %)                                                                                                                                         |
| Críticos y altos detectados (de 30) | 30                                                                                                                                                         | 22                                                                                                                                                              | 21                                                                                                                                                |
| Exclusivos confirmados              | 24                                                                                                                                                         | 4 (+ ampliación de U-SEC-005)                                                                                                                                   | 6                                                                                                                                                 |
| Puntos fuertes                      | Pruebas en navegador (matriz de 300 cargas, escenarios de consentimiento e historial, axe por estados), comprobación de producción en vivo y del pipeline. | Semántica de contenido (listas, tablas), validación de esquemas en `BlockLinkTool`, variables de build del pipeline, archivo huérfano.                          | Detalles de producción (`<main>`, `alt`, `gtag` vacío, analítica premarcada), chunk de iconos, `BlockImage`, `theme-color`.                       |
| Puntos ciegos principales           | Listas y tablas sin semántica, `BlockLinkTool`, `<main>` y `alt` en producción.                                                                            | Producción sin datos, modal tapado, desbordamiento móvil (lo declaró correcto), tarjetas sin teclado, banner implícito, sitemap con redirecciones.              | Modal (historial y accesibilidad), desbordamiento móvil, tarjetas sin teclado, política de privacidad, host de la API, sitemap con redirecciones. |
| Errores de criterio corregidos      | Ninguno descartado; varias severidades ajustadas (ver discrepancias).                                                                                      | Severidades infladas (sanitizador, CSRF y devtools como críticos), «200+ páginas», `package-lock` desincronizado no reproducido, falso positivo de hidratación. | Ningún crítico (producción sin datos como alto), TTFB como causa del LCP, `/blog` en el sitemap no reproducido, preflight en código muerto.       |

## 7. Estado del proyecto y limitaciones

- **Gestor de paquetes:** pnpm, por decisión del propietario. Verificado: `pnpm install --frozen-lockfile`, `pnpm lint`
  (0 errores), `pnpm exec vue-tsc --noEmit` y `pnpm test:run` (45/45) correctos. Falta migrar `gocd.yaml` (sigue con
  `npm ci`) y eliminar `package-lock.json`. Con pnpm 12, `NODE_ENV=production` sí instala las devDependencies, así que el
  fallo del pipeline detectado con npm desaparece al migrar.
- **Cambios durante las auditorías:** documentación, tarjetas y `scripts/deploy.sh` se modificaron entre las 19:17 y las
  20:23, y la API dejó de servir `evil.example`. Su efecto en cada hallazgo está en la sección 6 de
  [discrepancias-resueltas.md](discrepancias-resueltas.md).
- **Conflicto de interés:** la consolidación la ha hecho el mismo agente que la auditoría interna. Para mitigarlo, cada
  ajuste está justificado con evidencia y los exclusivos de las tres auditorías se han reverificado. Aun así, conviene
  que una persona revise los ajustes de severidad antes de aprobar el plan.
- **Sin verificar en ninguna de las tres auditorías:** Firefox, dispositivos reales (iOS y Android), lector de pantalla
  real, datos de campo (CrUX), Search Console y la configuración real de Apache y Cloudflare.
- **Sin pruebas activas:** no se ha enviado el formulario ni se ha hecho ninguna prueba intrusiva contra producción o
  la API.
