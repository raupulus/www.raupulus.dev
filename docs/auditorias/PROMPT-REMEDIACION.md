# Prompt de remediación — auditoría consolidada 2026-10-04

> **Cómo usarlo.** Abre una sesión nueva en la raíz del repositorio `www.raupulus.dev` y escribe:
> «Lee `docs/auditorias/PROMPT-REMEDIACION.md` y ejecútalo». Antes, revisa los parámetros de la sección 0. La sesión no
> necesita ningún contexto previo: todo lo que hace falta está en este documento y en los archivos que enlaza.

---

## 0. Parámetros (ajústalos antes de lanzar)

```text
RAMA_TRABAJO        = remediacion/auditoria-2026-10-04   # se crea desde dev conservando los cambios sin commitear
PUSH                = no                                  # no | si   (nunca a main; nunca forzado)
DESPLEGAR           = no                                  # la sesión NUNCA despliega; solo deja el build listo
CAPTCHA             = recaptcha-solo-contacto             # recaptcha-solo-contacto | turnstile (exige cambio en la API)
URLS                = con-barra-final                     # con-barra-final | sin-barra-final (exige reglas de Apache)
DETALLE_PROYECTO    = pagina                              # pagina (detalle como página real, sin modal) | pagina-y-modal
ANALITICA           = gtag-tras-consentimiento            # gtag-tras-consentimiento | sin-analitica
REESCRIBIR_HISTORIA = no                                  # reescribir commits con correo personal: solo el propietario
```

---

## 1. Rol y objetivo

Eres el ingeniero responsable de **corregir todos los hallazgos** de la auditoría consolidada del portfolio
`www.raupulus.dev` (Nuxt 4 + TypeScript + TailwindCSS 3, generación estática, API Laravel externa). Trabajas sobre el
código del repositorio con rigor de producción: cada corrección verificada, con test cuando proceda, documentada y
commiteada por separado.

Lo que no se puede corregir desde el repositorio (API, Cloudflare, DNS, servidor, decisiones legales o personales) se
**prepara** al máximo y se deja como acción externa documentada para el propietario, con instrucciones exactas.

Resultado esperado:

1. Una rama con commits pequeños y temáticos, todos con las puertas de calidad en verde.
2. `docs/auditorias/2026-10-04-remediacion/` con el registro del estado de **cada uno de los 106 hallazgos** y la
   lista de acciones externas.
3. Ningún hallazgo sin estado: corregido, preparado-pendiente-externo, aplazado-con-motivo o descartado-con-motivo.

---

## 2. Reglas (obligatorias)

1. **Gestor de paquetes: pnpm, siempre.** `pnpm install`, `pnpm <script>`, `pnpm exec <bin>` y `pnpm dlx` en lugar de
   `npx`. Nunca `npm` ni `yarn`. El lockfile de referencia es `pnpm-lock.yaml`. Si pnpm no está disponible, instálalo
   (`corepack enable pnpm`, o `npm i -g pnpm` como único uso permitido de npm) y continúa.
2. **Lee `AGENTS.md` antes de tocar código** y cumple sus convenciones: `<script setup lang="ts">`, tokens del design
   system, `useHead` completo, responsive desde 320 px, accesibilidad, sanitización con `utils/sanitize.ts`,
   `useApiBase()` y `useState()`. **Es obligatorio actualizar `docs/info/*.md`** de cada módulo que modifiques.
3. **Correo:** el único correo visible permitido es `public@raupulus.dev`. No escribas otras direcciones en código,
   documentación ni commits.
4. **No inventes datos personales ni legales** (NIF, dirección postal, nombre fiscal, plazos de conservación concretos,
   proveedores no confirmados). Usa marcadores `[[COMPLETAR: descripción]]` y regístralos como acción externa.
5. **Producción y API:** solo lectura y bajo volumen (GET). No envíes el formulario de contacto real, no hagas pruebas
   intrusivas, no despliegues y no cambies nada en Cloudflare, el servidor, el DNS ni el backend.
6. **Git:**
    - Crea `RAMA_TRABAJO` desde `dev` sin perder los cambios actuales sin commitear (`git switch -c <rama>`).
    - Commits pequeños por grupo de hallazgos. El mensaje sigue el estilo del repo (`git log --oneline -15`) e incluye
      los ID (por ejemplo `Fix soft-404 and manifest icons (U-BUG-004, U-BUG-013)`).
    - Nada de `--force`, de reescribir historia, de tocar `main` ni de hacer push salvo `PUSH=si` (y entonces solo de
      `RAMA_TRABAJO`).
    - **Antes de cada commit**, revisa `git diff --staged`. Si encuentras cambios que no son tuyos (el propietario puede
      estar trabajando a la vez), no los mezcles: commitéalos aparte o déjalos fuera y avisa.
7. **Puertas de calidad en verde antes de cada commit:** `pnpm lint` (0 errores), `pnpm exec vue-tsc --noEmit`
   (0 errores) y `pnpm test:run` (todo verde). Además, `pnpm generate` cuando el cambio afecte al build, al SSG, a
   rutas, a metadatos o al sitemap.
8. **No rebajes un hallazgo para «cerrarlo».** Si una corrección no es viable, márcala como aplazada y explica por qué.
   Si descubres un problema nuevo, añádelo al registro con un ID `N-<ÁREA>-<NNN>`.
9. **No borres ni modifiques** las carpetas de auditoría existentes (`docs/auditorias/2026-10-04-*`) ni
   `PROMPT-AUDITORIA.md`. Solo escribes en `docs/auditorias/2026-10-04-remediacion/` y añades una fila al índice
   `docs/auditorias/README.md`.
10. **Trabajo incremental:** actualiza el registro (sección 6) después de cada commit, para que la sesión pueda
    retomarse si se interrumpe.

---

## 3. Fuentes que debes leer (en este orden)

1. `AGENTS.md`, `README.md` y `TODO.md`.
2. `docs/auditorias/2026-10-04-consolidada/README.md`: resumen, puntuación y top 10.
3. `docs/auditorias/2026-10-04-consolidada/plan-remediacion.md`: **orden de ejecución** (fases 0 a 4).
4. `docs/auditorias/2026-10-04-consolidada/hallazgos.json`: los 106 hallazgos unificados (`U-…`) con severidad,
   prioridad, origen y resolución.
5. `docs/auditorias/2026-10-04-consolidada/discrepancias-resueltas.md`: qué se descartó o ajustó y por qué. No
   «corrijas» lo descartado.
6. **Detalle técnico de cada hallazgo:** campo `informe_referencia` del JSON, con formato `X:archivo.md#ID`, donde:
    - `C:` → `docs/auditorias/2026-10-04-claude-interna/`
    - `G:` → `docs/auditorias/2026-10-04-gemini-externo/`
    - `D:` → `docs/auditorias/2026-10-04-deepsek-externo/`

    Abre la sección del ID en ese informe: tiene ubicación (`archivo:línea`), evidencia, recomendación y forma de
    verificar. Los campos `origen` del JSON dan los ID equivalentes en las otras auditorías, por si una lo explica
    mejor.

Los números de línea de los informes son del 2026-10-04 y el código ha cambiado desde entonces: localiza siempre por
contenido, no solo por número de línea.

---

## 4. Contexto imprescindible (estado a 2026-10-04)

- **Producción** (`https://raupulus.dev`) sirve un build antiguo (2026-09-11) que consume `api.fryntiz.dev/api/v1`,
  ya retirada (410): la página de proyectos está vacía. Se arregla desplegando el código actual, pero **solo cuando la
  API v2 tenga los proyectos cargados**.
- **API v2** (`https://api.raupulus.dev/api/v2`): hoy `GET /platforms/portfolio/contents?type=project` devuelve
  `total: 0`. Cargar los datos es una acción externa (backend).
- **Build:** al corregir U-BUG-002, `pnpm generate` fallará mientras la API no tenga proyectos. Implementa una salida
  explícita solo para desarrollo (por ejemplo `ALLOW_EMPTY_PROJECTS=1`) y no la uses en CI ni en `scripts/deploy.sh`.
- **Datos para desarrollar el detalle de proyecto:** comprueba si hay un backend local con datos
  (`curl -s "http://localhost:8000/api/v2/platforms/portfolio/contents?type=project&per_page=1"`). Si lo hay, el `.env`
  local ya apunta a él. Si no, trabaja con fixtures en los tests y verifica el HTML generado con datos simulados; no
  inventes contenido real.
- **El endpoint de detalle `GET /platforms/portfolio/contents/:slug` suma una visita.** No lo llames durante el
  prerender: usa el listado y `/contents/:slug/pages` (no cuenta visitas, según `composables/projectsData.ts`). Si no
  basta, regístralo como dependencia del backend (API-08).
- **Servidor:** Apache 2.4 detrás de Cloudflare. `public/.htaccess` se publica con el sitio y **sí se aplica**
  (`mod_rewrite` activo). Ni `mod_expires` ni `mod_headers` parecen aplicarse en producción: lo que dependa de ellos
  hay que duplicarlo como instrucciones de Cloudflare en las acciones externas.
- **Cambios sin commitear:** al iniciar, `dev` tiene unos 60 archivos modificados o nuevos (migración a la API v2,
  plantilla nueva, tests, documentación y pnpm). Commitearlos es el primer paso (U-INFRA-006).
- **Herramientas de verificación:** Playwright y axe-core no están en el proyecto. Puedes añadirlos como
  devDependencies (`pnpm add -D @playwright/test @axe-core/playwright`) para una suite E2E en `tests/e2e/` con
  extensión `*.e2e.ts` y configuración propia, **excluida de Vitest** (comprueba que `pnpm test:run` no la recoja).
  Para servir el build: `pnpm dlx serve .output/public -l 4173`.

---

## 5. Ejecución

Sigue las fases de `plan-remediacion.md`. Dentro de cada fase, agrupa por archivo o módulo para hacer commits
coherentes. Para cada hallazgo:

1. Lee su detalle (sección 3, punto 6) y localiza el código actual.
2. Si es corregible en el repo: escribe primero el test que reproduce el fallo cuando sea razonable (unitario en
   `tests/` o E2E en `tests/e2e/`), corrige, y verifica con el método del campo «Verificación de la corrección» del
   informe original.
3. Si depende de algo externo: prepara todo lo posible en el repo (configuración versionada, documentación, script o
   texto con marcadores) y añade la acción a `acciones-externas.md` con pasos exactos y cómo verificarla.
4. Actualiza `docs/info/*.md` de los módulos tocados.
5. Puertas de calidad → commit → actualiza el registro.

### 5.1 Clasificación previa (orientativa; confírmala al leer cada hallazgo)

**Corregibles en el repositorio:**

- **Seguridad:** U-SEC-004, U-SEC-005, U-SEC-006, U-SEC-010 (quitar `captcha.secretKey`), U-SEC-007 (añadir
  `Options -Indexes` en `public/.htaccess`; `ServerTokens` es externo), U-SEC-008 (solo el `ServerAdmin` de
  `apache.conf`/`apache_dev.conf` → `public@raupulus.dev`), U-SEC-011 (solo `public/.well-known/security.txt` con
  `Contact: mailto:public@raupulus.dev` y `Expires`).
- **Legal:** U-LEGAL-001…008 (banner, consentimiento, Consent Mode, revocación, textos: los legales con marcadores
  `[[COMPLETAR]]`).
- **Bugs:** U-BUG-002 (código), U-BUG-004…016, U-BUG-018. U-BUG-017: corregir de forma barata (renderizar el año solo en
  cliente o fijarlo en el build sin desajuste de hidratación).
- **SEO:** U-SEO-001, U-SEO-002 (según `URLS`), U-SEO-004…008, U-SEO-010, U-SEO-011, U-SEO-012.
- **Rendimiento:** U-PERF-002…009, y la parte de repo de U-PERF-001 (quitar `ExpiresDefault` del HTML en `.htaccess`,
  reglas de caché por tipo).
- **Responsive, UX, contenido y accesibilidad:** todos los U-RESP, U-UX, U-CONT y U-A11Y, salvo U-CONT-004 (verificación
  manual) y U-A11Y-010 (se resuelve al desplegar).
- **Dependencias y código:** U-DEP-001 (`gocd.yaml` a pnpm, eliminar `package-lock.json`, `packageManager` y
  `engines`), U-DEP-002 (actualizar sin saltos mayores innecesarios), U-DEP-003…007, y todos los U-CODE.
- **Infraestructura:** U-INFRA-001 (`gocd.yaml` completo con pnpm, variables de build como variables seguras de GoCD,
  `fetch` del artefacto, verificación que falle de verdad, comprobación del número de rutas), U-INFRA-003 (preparar
  `scripts/deploy.sh` con releases atómicas; aplicarlo en el servidor es externo) y U-INFRA-006 (commitear).

**Solo preparables (acción externa del propietario):** U-BUG-001 y la parte de datos de U-BUG-002 (cargar proyectos en
la API v2 y desplegar), U-BUG-003 (backend: `SESSION_DOMAIN` o endpoint stateless; ajusta el frontend si se elige
stateless), U-SEC-001, U-SEC-002 y la parte de Cloudflare de U-PERF-001 (cabeceras, HSTS y caché), U-SEC-003 (backend),
U-SEC-009 y la reescritura de historia de U-SEC-008 (decisión), la parte de DNS de U-SEC-011, U-LEGAL-009 (backend),
U-INFRA-002, U-INFRA-004 (DNS), U-INFRA-005 (servicio de monitorización), y U-SEO-003, U-SEO-009, U-LEGAL-010 y
U-A11Y-010 (se resuelven al desplegar el código actual).

### 5.2 Decisiones técnicas ya tomadas (según los parámetros)

- **`URLS=con-barra-final`:** genera canonical, `og:url`, sitemap y enlaces internos con barra final, para coincidir con
  el comportamiento actual de Apache (`/about` → 301 → `/about/`). Configura `@nuxtjs/sitemap`/`site.trailingSlash` y
  el comportamiento por defecto de `NuxtLink`. Verifica en el HTML generado que canonical y sitemap coinciden.
- **`DETALLE_PROYECTO=pagina`:** `/projects/:slug` y `/projects/:slug/:page` pasan a ser páginas reales generadas en
  build, con su `h1`, contenido, metadatos y JSON-LD (`BreadcrumbList`, `CreativeWork`). El listado enlaza con
  `<NuxtLink>`. Se elimina el modal y con él `history.pushState`, el bloqueo de scroll y `useHead` en manejadores.
  **Mantén exactamente las URLs existentes.** Un slug inexistente devuelve 404 real (`createError({ statusCode: 404, fatal: true })`).
- **`CAPTCHA=recaptcha-solo-contacto`:** elimina el plugin global y carga reCAPTCHA solo en `/contact` (idealmente al
  interactuar con el formulario). Turnstile queda para cuando el backend lo soporte (`TODO.md`).
- **`ANALITICA=gtag-tras-consentimiento`:** `initMode: 'manual'` e inicialización solo cuando el usuario acepta. Consent
  Mode solo con `analytics_storage` (las señales `ad_*` siempre en `denied`). Al revocar, `update` a `denied` y borrado
  de las cookies `_ga*`.
- **Seguridad del contenido:** iframes y enlaces solo con `https:` (y lista blanca de hosts en los embeds: YouTube
  nocookie, YouTube y Vimeo); `BlockCode` como texto escapado; DOMPurify sin `style` ni `id` y con `rel` forzado.
- **Formulario:** `<textarea>` visible, `type="submit"`, validaciones realistas (nombre ≥ 2, email hasta 254 caracteres
  con validación del servidor), errores accesibles y dos casillas de consentimiento separadas. Mientras el backend no
  resuelva U-BUG-003, el formulario sigue deshabilitado con un aviso y `mailto:public@raupulus.dev` destacado (U-UX-002).

---

## 6. Registro de remediación (entregable)

Crea `docs/auditorias/2026-10-04-remediacion/` con:

- **`README.md`:** resumen (cuántos corregidos, preparados, aplazados y descartados por severidad), rama, lista de
  commits con los ID que resuelve cada uno, puertas de calidad finales y riesgos residuales.
- **`registro.json`:** una entrada por cada uno de los 106 `U-…` (y los nuevos `N-…`):
  `{ "id", "estado": "corregido|preparado-pendiente-externo|aplazado|descartado", "commits": [], "archivos": [], "verificacion": "cómo se comprobó y resultado", "test": "ruta del test o null", "pendiente": "qué falta y quién" }`.
- **`acciones-externas.md`:** checklist del propietario, ordenada por prioridad. Cada acción indica dónde se hace
  (backend, Cloudflare, DNS, servidor o decisión), los pasos exactos y cómo verificarla. Incluye todos los
  `[[COMPLETAR]]` pendientes. Como mínimo:
    - cargar los proyectos en la API v2;
    - investigar U-SEC-003 en la API (`TrustHosts`, `TrustProxies`, `APP_URL`, cachés y logs);
    - cookie CSRF o endpoint stateless;
    - API sin sesión en lecturas públicas;
    - Cloudflare: cabeceras de seguridad, HSTS, Cache Rules y purga;
    - DNS: `www`, CAA y DMARC;
    - Apache: `ServerTokens`, `ServerSignature`, `mod_headers`/`mod_expires` o su equivalente en Cloudflare;
    - variables seguras de GoCD (`APP_URL`, `API_DOMAIN_URL`, `API_BASE_URL`, `API_PATH_CONTACT`, `GTAG_ID`,
      `CAPTCHA_SITE_KEY` y el token de purga de Cloudflare);
    - servicio de monitorización;
    - decisión sobre la reescritura de historia y sobre mover la infraestructura a un repositorio privado;
    - **orden recomendado de despliegue:** datos en la API → merge → pipeline → despliegue → verificación.
- **`verificacion-final.md`:** salida resumida de `pnpm lint`, `pnpm exec vue-tsc --noEmit`, `pnpm test:run`,
  `pnpm test:coverage`, `pnpm audit --prod`, `pnpm generate` (con datos o con `ALLOW_EMPTY_PROJECTS=1`, indicándolo),
  la suite E2E si la añades (rutas 200, 404 real, consola limpia, sin scroll horizontal a 320 px, axe sin `serious`) y
  un Lighthouse móvil del build local de la home y de un proyecto.

Añade una fila al índice `docs/auditorias/README.md` («remediación», sin puntuación) enlazando al `README.md` del
registro.

---

## 7. Criterios de finalización

- [ ] Los 106 hallazgos tienen estado en `registro.json`; ninguno sin estado ni «en curso».
- [ ] Todos los hallazgos de severidad crítica y alta corregibles en el repo están corregidos, con verificación
      documentada y, cuando proceda, test de regresión.
- [ ] `pnpm lint`, `pnpm exec vue-tsc --noEmit`, `pnpm test:run` y `pnpm test:coverage` en verde; `pnpm generate`
      correcto (indicando si se usó la salida de desarrollo sin proyectos).
- [ ] No queda ningún `npm`/`npx` en scripts, CI, documentación ni `AGENTS.md`, ni `package-lock.json`.
- [ ] `docs/info/*.md` actualizado para cada módulo modificado; `AGENTS.md` coherente con el código final.
- [ ] Ningún correo distinto de `public@raupulus.dev` ni ningún secreto en lo commiteado (`git diff dev...HEAD`
      revisado con `grep`).
- [ ] Las URLs públicas existentes (`/`, `/projects`, `/projects/:slug`, `/projects/:slug/:page`, `/about`, `/webs`,
      `/social`, `/contact`, `/privacy` y `/blog`) se siguen generando.
- [ ] `acciones-externas.md` contiene todo lo que no se pudo hacer desde el repo, en orden.
- [ ] Mensaje final en el chat (breve): rama y número de commits, hallazgos corregidos, preparados, aplazados y
      descartados por severidad, puertas de calidad y las 5 primeras acciones externas, con la ruta del registro.
      No pegues el registro completo.
