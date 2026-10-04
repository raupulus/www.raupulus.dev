# Discrepancias resueltas

> Consolidación de `claude-interna` (C), `gemini-externo` (G) y `deepsek-externo` (D). Las reverificaciones hechas durante
> la consolidación (2026-10-04, 20:30–22:45) están en [evidencias/verificaciones.txt](evidencias/verificaciones.txt).
> Todas las comprobaciones contra producción y la API han sido pasivas (GET de lectura).

## 1. Criterios de resolución

1. **Misma causa raíz = un hallazgo**, aunque cada auditoría lo redacte o lo trocee de forma distinta. Un ID original
   puede alimentar varios unificados cuando mezclaba causas distintas (por ejemplo, G:SEC-001 agrupaba iframes y
   `style`).
2. **Severidad final:** la mediana de las auditorías que lo detectaron; con dos detecciones, la mayor. Ambas reglas
   ceden ante la **evidencia**: si la reverificación muestra que la condición ya ocurre, no ocurre o tiene otro alcance,
   se ajusta y se justifica aquí.
3. **Producción frente a código:** varias contradicciones aparentes eran mediciones de capas distintas (build del
   2026-09-11 desplegado frente al árbol de trabajo). Se conserva el hallazgo con el ámbito correcto.
4. **Nada se da por bueno sin evidencia:** los hallazgos exclusivos de una sola auditoría se han reverificado (código,
   HTML generado o petición pasiva) o se apoyan en evidencia reproducible ya guardada en la carpeta original.

## 2. Contradicciones entre «verificado y correcto» y «hallazgo»

| Tema                               | Lo que dijo cada auditoría                                                                                              | Reverificación                                                                                                                                       | Resolución                                                                                                                                                                                                 |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scroll horizontal en móvil         | G: «no se detectó scroll horizontal en ninguna vista». C: la home mide 437 px en 320–430 px (RESP-002).                 | Build nuevo del código actual con pnpm, Chromium y WebKit: `scrollWidth=437` en 320, 360, 390 y 430 px; el `h2` «ESPECIALIZACIONES» necesita 405 px. | **C confirmado; G falso negativo** → U-RESP-002 alta.                                                                                                                                                      |
| `package-lock.json` desincronizado | G: «103 discrepancias» (DEP-002, alta). C: «`npm ci` en clon limpio sin errores».                                       | `npm ci --dry-run` con `package.json` + `package-lock.json` del árbol de trabajo: sin errores.                                                       | **No reproducido**; además, obsoleto: el gestor oficial es pnpm y `package-lock.json` debe eliminarse (U-DEP-001).                                                                                         |
| Hidratación de `usePlatformData`   | G: falla la hidratación y en desarrollo pide la API sin proxy (BUG-006). C: 0 errores de hidratación en 300 cargas.     | `useApiBase()` devuelve `/_proxy…` cuando `import.meta.client && import.meta.dev` (`composables/useApiBase.ts:19-21`).                               | **Falso positivo de G** (descartado).                                                                                                                                                                      |
| Caché del HTML                     | G y D: «`.htaccess` cachea el HTML un mes» (`ExpiresDefault`). C: «producción no envía ninguna cabecera de caché».      | Cabeceras reales de producción: sin `Expires` ni `Cache-Control` en HTML, JS, imágenes ni fuentes.                                                   | **Ambas cosas son ciertas en capas distintas**: hoy no hay caché (problema actual) y la configuración versionada cachearía el HTML si `mod_expires` se activara (riesgo latente). Fusionado en U-PERF-001. |
| Causa del LCP móvil de producción  | D: «latencia del origen / TTFB» (PERF-003). G: fuentes y scripts tempranos. C: reCAPTCHA y bundle antiguo.              | TTFB medido en los 9 Lighthouse de producción: 128–171 ms.                                                                                           | **Atribución de D descartada**; la de G, parcial. El síntoma (LCP 7,6–9,1 s) se mantiene en U-PERF-003.                                                                                                    |
| Clave privada de reCAPTCHA         | G: «expone claves privadas en el frontend» (SEC-004). C: «no aparece en el build».                                      | Búsqueda del valor real en `.output/public`: 0 coincidencias.                                                                                        | **C confirmado** → U-SEC-010 se ajusta a baja (configuración innecesaria, sin fuga).                                                                                                                       |
| `/blog` en el sitemap              | G: indexable y sin `noindex` (SEO-003). D: en el sitemap **con** `noindex` (SEO-002). C: `noindex` y fuera del sitemap. | Producción: `/blog` está en el sitemap y no tiene `noindex`. Build actual: 7 URLs sin `/blog` y con `noindex, follow`.                               | **G acierta para producción y C para el código; lo de D no se reproduce.** Se resuelve al desplegar (U-SEO-009).                                                                                           |
| Analítica premarcada               | D: `isPreselected: true` (LEGAL-003). C: «no está preseleccionada».                                                     | HTML de producción: `isPreselected:true`. `nuxt.config.ts` actual: `false`.                                                                          | **Ambas ciertas en capas distintas** → integrado en U-LEGAL-001 (producción).                                                                                                                              |
| Número de páginas de proyecto      | G: «200+ páginas comparten los mismos metadatos».                                                                       | Sitemap de producción: 34 URLs de proyecto (16 proyectos + 18 páginas internas).                                                                     | **Cifra corregida a 34**; el hallazgo se mantiene (U-SEO-001).                                                                                                                                             |
| Documentación API v1 frente a v2   | G (media) y D (alta): desfase grave. C: desfase detectado al inicio y resuelto durante la auditoría.                    | `AGENTS.md`, `README.md` y `docs/info/` se actualizaron entre las 19:19 y las 20:23.                                                                 | **Resuelto**; quedan desfases menores → U-CODE-004 baja.                                                                                                                                                   |
| Gestor de paquetes                 | C y G proponían unificar en npm; D, en pnpm.                                                                            | El propietario confirma pnpm. `pnpm install --frozen-lockfile`, lint, `vue-tsc` y tests correctos con pnpm 12.9.1.                                   | **Dirección: pnpm.** Queda pendiente `gocd.yaml` (3 × `npm ci`), `package-lock.json` y `packageManager`/`engines` (U-DEP-001).                                                                             |

## 3. Ajustes de severidad

| ID unificado | Severidades originales                          | Final        | Justificación                                                                                                                                                    |
| ------------ | ----------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| U-BUG-002    | C crítica · G alta · D media                    | **Crítica**  | La condición ocurre hoy: la API v2 devuelve `total: 0` (reverificado a las 20:45). G y D la trataron como hipotética.                                            |
| U-BUG-003    | C alta · G crítica · D alta                     | **Alta**     | Mediana. La causa está verificada y el 419 se deduce (nadie envió el formulario en producción). El formulario ya avisa de «fuera de servicio».                   |
| U-BUG-005    | C alta · G media (×2)                           | **Alta**     | Evidencia del escenario: en móvil, «atrás» no cierra el modal y deja el scroll bloqueado; combinado con U-RESP-001, el usuario no puede salir.                   |
| U-BUG-006    | C media · G alta · D alta                       | **Media**    | El 200 para slugs inexistentes es el soft-404 del servidor (U-BUG-004, alta); con la configuración corregida, el build responde 404. Queda la parte de cliente.  |
| U-SEC-003    | C alta (P0) · G recomendación                   | **Alta, P1** | El dato ya no aparece (reverificado), pero la causa raíz no se ha confirmado ni corregido.                                                                       |
| U-SEC-004    | C media · G crítica · D media                   | **Media**    | Mediana. DOMPurify bloquea scripts y manejadores; explotarlo exige controlar el contenido de la API. Subir a alta si U-SEC-003 confirma una vía de manipulación. |
| U-SEC-010    | C baja · G media · D media                      | **Baja**     | Evidencia: el valor no llega al build (sección 2).                                                                                                               |
| U-DEP-002    | C alta · G crítica + media · D alta + media     | **Alta**     | La RCE de `@nuxt/devtools` solo afecta al equipo de desarrollo durante `pnpm dev`; el resto se ejecuta en build o desarrollo.                                    |
| U-DEP-001    | C alta · G alta + media · D alta + baja + alta  | **Alta**     | Se redefine con la decisión de usar pnpm: el problema ya no es «cuál elegir», sino terminar la migración.                                                        |
| U-PERF-003   | C media (código) · G alta · D alta (producción) | **Alta**     | Producción: LCP 7,6–9,1 s. Código actual: 2,3–3,9 s (también fuera de objetivo).                                                                                 |
| U-PERF-004   | G media · D alta                                | **Media**    | JS propio ~131 KB br frente a 120 KB (~10 % de exceso); el peso grande es de terceros (U-PERF-002).                                                              |
| U-PERF-007   | C media · G media · D media                     | **Baja**     | Evidencia de Lighthouse: solo se descargan 2 de los 11 archivos de fuente (49 KB) en el primer render.                                                           |
| U-INFRA-004  | C media · G alta                                | **Media**    | No rompe ninguna URL que publique el sitio; afecta a quien teclea `www.`.                                                                                        |
| U-CODE-004   | C baja · G media · D alta + media               | **Baja**     | El desfase principal (API v1) se corrigió durante las auditorías.                                                                                                |
| U-A11Y-010   | D alta                                          | **Media**    | Solo en producción; el código actual ya usa `<main>` y se corrige al desplegar.                                                                                  |
| U-LEGAL-010  | D media                                         | **Baja**     | Petición inútil sin tratamiento de datos; desaparece al desplegar.                                                                                               |
| U-RESP-006   | G media                                         | **Baja**     | Estético (barras de scroll y controles nativos claros).                                                                                                          |
| U-RESP-007   | G media                                         | **Baja**     | El `h1` del hero no desborda a 320 px (verificado); es una decisión de diseño.                                                                                   |
| U-BUG-014    | D media (×2)                                    | **Baja**     | El patrón existe, pero C comprobó en navegador que los metadatos se restauran y no hay avisos en consola.                                                        |

## 4. Hallazgos exclusivos reverificados

| Auditoría | Exclusivos       | Reverificación en la consolidación                                                                                                                                                                                                                                                                                                                   |
| --------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C         | 24               | Evidencia reproducible en `2026-10-04-claude-interna/evidencias/`. Reverificados ahora sobre el código actual: U-RESP-002 (nueva medición), U-RESP-001 (z-index 11 frente a z-50, sin cambios), U-A11Y-002 (la tarjeta sigue siendo `<div @click>`), U-INFRA-006 (`git status`) y U-SEC-003 (dato ya corregido en la API).                           |
| G         | 4 + 1 ampliación | U-A11Y-005 (listas con `<div>`: ✅), U-UX-006 (`public/patterns/a.png`, 482 KB, 0 referencias: ✅), U-RESP-006 y U-RESP-007 (✅, ajustados a baja), U-CONT-004 (403 también con user agent de navegador: no verificable). Ampliación: U-SEC-005 incluye `BlockLinkTool :href` sin validar (✅, `BlockLinkTool.vue:4`).                               |
| D         | 6                | U-LEGAL-010 (`id:""` en producción: ✅), U-BUG-015 (`BlockImage.vue:35` muta la prop: ✅), U-SEO-012 (sin `theme-color` y `.ico` duplicado: ✅), U-PERF-008 (chunk de 22,8 KB con 45 SVG precargado en todas las páginas: ✅), U-A11Y-010 (sin `<main>` en producción: ✅), U-BUG-014 (parcial) y U-BUG-017 (no verificable hasta el cambio de año). |

## 5. Hallazgos originales descartados

| Auditoría | ID       | Estado            | Motivo                                                                                                                                           |
| --------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| G         | BUG-006  | Falso positivo    | `useApiBase()` usa el proxy en cliente y desarrollo; sin errores de hidratación observados.                                                      |
| D         | PERF-007 | Falso positivo    | El GET con `Content-Type: application/json` está en `utils/apiClient.ts`, que no se usa; los composables activos usan `$fetch` sin esa cabecera. |
| D         | RESP-002 | No reproducido    | Hipótesis sobre tablas, código y embeds a 320 px; la matriz de C no encontró desbordamientos fuera de la home.                                   |
| D         | RESP-001 | No es un hallazgo | Limitación declarada («matriz no ejecutada»), sin severidad; además falta en su `hallazgos.json`.                                                |
| D         | DEP-008  | No es un hallazgo | Limitación declarada («licencias no verificadas»); C lo verificó sin incompatibilidades.                                                         |

## 6. Cambios en el proyecto durante y después de las auditorías

No los hizo esta consolidación ni `claude-interna`, y su autoría no se ha determinado (el propietario confirma la migración
a pnpm). Se registran porque cambian el estado de varios hallazgos:

| Hora                | Cambio                                                                                    | Efecto en la consolidación                                     |
| ------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 19:17               | `components/card/ProjectVertical.vue` y `ProjectHorizontal.vue` (tratamiento de imágenes) | Las tarjetas siguen siendo `<div @click>`: U-A11Y-002 vigente. |
| 19:19–20:23         | `AGENTS.md`, `README.md` y `docs/info/*` actualizados a la API v2 y a pnpm                | Resuelve la parte principal de U-CODE-004.                     |
| 20:23               | `scripts/deploy.sh` pasa de `npm ci` a `pnpm install --frozen-lockfile`                   | Avanza U-DEP-001; `gocd.yaml` sigue con npm.                   |
| Entre 18:45 y 20:45 | La API deja de devolver URLs en `evil.example`                                            | U-SEC-003 pasa de P0 a P1; la causa sigue pendiente.           |

## 7. Conflicto de interés y limitaciones de la consolidación

- **Quien consolida es también el autor de `claude-interna`.** Para mitigarlo, cada ajuste está justificado con
  evidencia y cada exclusivo se ha reverificado. Aun así, el 88 % de detección de C en la matriz refleja en parte que su
  inventario fue la base de la tabla de equivalencias, y que fue la única auditoría con matriz responsive completa,
  escenarios funcionales en navegador y acceso al backend local con datos. Las externas aportaron hallazgos que C no
  vio: listas y tablas sin semántica, `BlockLinkTool`, `theme-color`, el chunk de iconos, `BlockImage`, `<main>` y
  `gtag` en producción, `a.png` y `color-scheme`. **Se recomienda que una persona revise la sección 3 antes de
  aprobar el plan.**
- No se ha repetido el envío del formulario ni ninguna prueba activa contra producción o la API.
- Firefox, los dispositivos reales y el lector de pantalla siguen sin verificar en ninguna de las tres auditorías.
