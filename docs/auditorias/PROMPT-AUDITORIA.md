# Prompt de auditoría integral — www.raupulus.dev

> **Cómo usarlo.** Entrega este documento completo como prompt a un agente de IA con acceso al repositorio y a
> internet, o indícale: «Lee `docs/auditorias/PROMPT-AUDITORIA.md` y ejecútalo con `MODO=interno`». Antes,
> ajusta los parámetros de la sección 0. El mismo prompt sirve para la auditoría interna, para la segunda
> opinión externa (ciega) y para consolidar ambas.

---

## 0. Parámetros de ejecución

```text
MODO                     = interno          # interno | externo | consolidacion
AUDITOR                  = claude-interna   # identificador corto sin espacios (ej. claude-interna, externa-<nombre>)
URL_PRODUCCION           = https://raupulus.dev
API_PUBLICA              = https://api.raupulus.dev
ALCANCE                  = completo         # completo | lista de áreas de la sección 6 (ej. 6.1,6.4,6.5)
AUDITORIAS_A_CONSOLIDAR  = —                # solo MODO=consolidacion: rutas de las carpetas a comparar
```

| Modo            | Qué puede leer                                                                                                                                                                         | Objetivo                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `interno`       | Todo el repositorio, incluidas auditorías previas en `docs/auditorias/` y `docs/auditorias/indicios-preliminares.md` (hipótesis a verificar, **nunca** a dar por buenas).              | Auditoría completa con detección de regresiones respecto a auditorías anteriores.              |
| `externo`       | Todo el repositorio **excepto** cualquier archivo de `docs/auditorias/` distinto de este prompt. No consultes memorias, notas ni conversaciones previas sobre auditorías del proyecto. | Segunda opinión ciega e independiente, sin sesgo de la auditoría interna.                      |
| `consolidacion` | Las carpetas indicadas en `AUDITORIAS_A_CONSOLIDAR`, el código y producción.                                                                                                           | Comparar auditorías, resolver discrepancias con evidencia y emitir un plan único (sección 11). |

---

## 1. Rol y objetivo

Actúas como un **equipo de auditoría senior** que combina estos perfiles: seguridad de aplicaciones web (OWASP),
SEO técnico, rendimiento web (Core Web Vitals), accesibilidad (WCAG 2.2 / EN 301 549), UX/UI y diseño responsive,
QA, arquitectura Nuxt/Vue/TypeScript, DevOps/infraestructura y cumplimiento normativo (RGPD, LSSI-CE, guía de
cookies de la AEPD).

Tu misión es **encontrar todos los problemas reales** del portfolio, sin limitarte a la lista de comprobación de
este documento: la checklist es el **mínimo obligatorio**, no el techo. Si detectas algo relevante que no esté
listado, inclúyelo.

El resultado debe permitir que el sitio:

1. Obtenga una **puntuación excelente en SEO** (técnico, on-page, datos estructurados, identidad de marca personal).
2. **Cargue muy rápido** (Core Web Vitals en «bueno» en móvil, Lighthouse ≥ 95).
3. Se **navegue sin problemas en cualquier dispositivo y navegador** (desde 320 px hasta 2560 px, táctil, teclado
   y lector de pantalla).
4. **No muestre errores a los usuarios** en ninguna circunstancia razonable (API caída, redespliegue, rutas
   inexistentes, conexiones lentas).
5. Sea **seguro y respetuoso con la privacidad**, y cumpla la normativa española y europea aplicable.
6. Sea **mantenible**: dependencias sanas, build reproducible y CI/CD que impida regresiones.

El informe se usará internamente y se contrastará con una **segunda opinión externa**, así que debe ser
**reproducible, basado en evidencias y comparable** entre auditores.

---

## 2. Reglas de oro (obligatorias)

1. **Solo lectura sobre el proyecto.** Únicamente puedes escribir dentro de `docs/auditorias/<CARPETA_AUDITORIA>/`
   y actualizar el índice `docs/auditorias/README.md`. No modifiques código, configuración, dependencias,
   lockfiles ni `.env`. Prohibido `npm install <paquete>`, `npm update` y `npm audit fix`. Se permiten `npm ci`,
   `npm run generate` y `nuxt prepare`, porque solo regeneran artefactos ignorados por git (`node_modules`,
   `.nuxt`, `.output`, `cachedRoutes.json`).
2. **Herramientas externas sin tocar el proyecto.** Úsalas instaladas globalmente o mediante `npx --yes
<herramienta>@<versión>`; nunca las añadas a `package.json`. Los scripts auxiliares (Playwright, PoC, etc.)
   se crean en un **directorio temporal fuera del repositorio** y se documentan en `evidencias/scripts.md` como
   bloques de código para que se puedan reproducir. No guardes archivos `.js/.mjs/.ts` dentro del repo: los
   recogería `npm run lint` y, con sufijo `.test.`/`.spec.`, la suite de Vitest.
3. **Sin commits, push, ramas, PR ni issues.** Los cambios quedan en el árbol de trabajo para revisión humana.
4. **Sin evidencia no hay hallazgo.** Cada hallazgo debe llevar ubicación exacta (`archivo:línea` y/o URL +
   viewport/navegador) y evidencia: comando + salida recortada, captura o fragmento de código.
5. **No inventar.** Lo que no puedas comprobar se marca como «No verificado» con el motivo. No incluyas hallazgos
   genéricos de manual («podría haber…») que no apliquen a este código concreto. Cada recomendación debe ser
   aplicable a este proyecto.
6. **Producción: solo pruebas pasivas y de bajo volumen** (≤ 1 petición/s contra `URL_PRODUCCION` y
   `API_PUBLICA`). Prohibido: escáneres activos o agresivos (sqlmap, ZAP en modo activo, nikto, fuzzing o
   descubrimiento masivo de directorios), pruebas de carga o DoS, explotar vulnerabilidades más allá de una PoC
   mínima no destructiva, **enviar el formulario de contacto en producción** (genera correos y registros reales),
   crear cuentas y eludir el captcha. Todo lo intensivo se hace contra el build local.
7. **Secretos y datos personales.** Si encuentras un secreto (en el repo, el historial de git, el bundle o una
   respuesta de la API), **no copies su valor**: indica tipo, ubicación y como mucho sus 4 primeros caracteres
   seguidos de `…`, clasifícalo y recomienda rotarlo. Puedes leer `.env` para comprobar si algún valor acaba en
   el bundle, pero nunca lo transcribas. El único correo electrónico que puede aparecer en el informe es
   `public@raupulus.dev`. Si detectas otra dirección de correo expuesta, no la escribas: cita `archivo:línea`.
8. **Escritura incremental.** Crea la estructura de entregables al principio y vuelca los hallazgos a medida que
   avanzas, no solo al final, para no perder trabajo si la sesión se interrumpe o el contexto se compacta.
   `cobertura.md` actúa como registro de progreso.
9. **La exhaustividad prima sobre la brevedad.** No te detengas al encontrar «los problemas principales»:
   recorre la checklist completa y todas las rutas. Si tu entorno permite subagentes, puedes paralelizar por
   áreas, pero tú consolidas, deduplicas y **verificas personalmente** cada hallazgo antes de darlo por bueno.
10. **Si una herramienta no está disponible**, documenta la limitación, aplica la alternativa manual y sigue.
11. **Idioma:** español correcto (con tildes), manteniendo los términos técnicos originales. Tono profesional,
    preciso y sin relleno.

---

## 3. Contexto del proyecto

Portfolio personal de Raúl Caro Pastorino (@raupulus). **Lee primero** `AGENTS.md`, `README.md`, `TODO.md`,
`CHANGELOG.md` y `docs/info/*.md` (documentación por módulo: verifica también que esté sincronizada con el código).

- **Stack:** Nuxt 4 (Vue 3, `<script setup lang="ts">`), TypeScript estricto, TailwindCSS 3 con el design system
  «Silicon Architect» (tema oscuro, tokens Material Design 3), Vitest + happy-dom, ESLint (flat config de
  `@nuxt/eslint`) y Prettier.
- **Módulos Nuxt:** `@nuxt/image` (IPX), `@nuxtjs/sitemap`, `nuxt-gtag`, `@dargmuesli/nuxt-cookie-control`,
  `@nuxtjs/tailwindcss`, `@nuxt/eslint` y `@nuxt/fonts`.
- **Renderizado:** generación estática (`nuxt generate`, preset `static` de Nitro). Las rutas dinámicas de
  proyectos se obtienen de la API **en tiempo de build** mediante el hook `prerender:routes` de `nuxt.config.ts`,
  que además escribe `cachedRoutes.json`. El sitemap también consulta la API en el build.
- **Datos:** API REST Laravel externa (`API_PUBLICA`). Algunos datos se resuelven en el build y otros en el
  navegador en tiempo de ejecución. **Determina cuáles y qué consecuencias tiene** (SEO, CLS, errores visibles).
- **Formulario de contacto:** cookie CSRF de Sanctum + reCAPTCHA v3 (`vue-recaptcha-v3`) + POST a la API.
- **Analítica y consentimiento:** `nuxt-gtag` con Consent Mode y banner `@dargmuesli/nuxt-cookie-control`.
- **Infraestructura (configuraciones versionadas):** `apache.conf`, `apache_dev.conf`, `nginx.conf`,
  `nginx_dev.conf` y `public/.htaccess`. `TODO.md` indica que el sitio está detrás de Cloudflare. **Determina qué
  sirve realmente producción** y qué configuraciones están obsoletas o son contradictorias.
- **CI/CD:** `gocd.yaml` (lint → test → build → deploy manual) y `scripts/deploy.sh`. Repositorio en GitLab
  (origen) con mirror de push a GitHub. Comprueba si es público: si lo es, todo lo versionado está expuesto.
- **Gestor de paquetes oficial:** npm (ver `AGENTS.md`).

### Rutas públicas

| Ruta                                                    | Archivo                                                     |
| ------------------------------------------------------- | ----------------------------------------------------------- |
| `/`                                                     | `pages/index.vue`                                           |
| `/projects`, `/projects/:slug`, `/projects/:slug/:page` | `pages/projects/[...slugs].vue` (catch-all)                 |
| `/blog`                                                 | `pages/blog.vue` (en construcción)                          |
| `/about`                                                | `pages/about.vue`                                           |
| `/webs`                                                 | `pages/webs.vue`                                            |
| `/social`                                               | `pages/social.vue`                                          |
| `/contact`                                              | `pages/contact.vue`                                         |
| `/privacy`                                              | `pages/privacy.vue`                                         |
| Errores 404/500                                         | `error.vue`                                                 |
| Recursos SEO                                            | `/sitemap.xml`, `/robots.txt`, `/favicons/site.webmanifest` |

La lista definitiva de URLs dinámicas sale del cruce entre el sitemap de producción, `cachedRoutes.json` y los
HTML generados en `.output/public` (ver Fase 0).

### Estado del código frente a producción

La rama de trabajo puede contener cambios sin desplegar (y sin commitear). Audita **el árbol de trabajo tal como
está** y **producción tal como está**, y clasifica cada hallazgo con el campo **Ámbito**: `código` (solo en el
código actual), `producción` (solo en lo desplegado) o `ambos`.

---

## 4. Fase 0 — Preparación e inventario

1. **Carpeta de trabajo:** `docs/auditorias/AAAA-MM-DD-<AUDITOR>/`, con la fecha real del sistema (`date +%F`).
   Si ya existe, añade el sufijo `-2`, `-3`, etc. Crea desde el principio la estructura de la sección 9.
2. **Ficha del entorno** (`evidencias/entorno.txt`): fecha y hora, SO, `node -v`, `npm -v`, versiones de cada
   herramienta usada, `git rev-parse HEAD`, rama, `git status --porcelain` **inicial** (lo necesitarás en el
   control final), remotos y una captura de las cabeceras de producción (`curl -sSI URL_PRODUCCION`).
3. **Puertas de calidad**, guardando la salida completa en `evidencias/build/`:
   `npm ci` (si hace falta) → `npm run lint` → `npx vue-tsc --noEmit` → `npm run test:run` →
   `npm run test:coverage` → `npm run generate`.
   Usa `.env` si existe. Si no, usa los valores de `env.example.production` apuntando a `API_PUBLICA`. Si
   `AGENTS.md`, la documentación y el código no coinciden en la versión de la API (`/api/v1` frente a
   `/api/v2`), regístralo como hallazgo y usa la que funcione.
4. **Build desde un clon limpio** en un directorio temporal (`git clone` del repo local + `npm ci` +
   `npm run generate`): detecta dependencias de archivos no versionados o ignorados que romperían el CI. Ten en
   cuenta que el clon refleja `HEAD`, no los cambios sin commitear: anótalo.
5. **Servir el build local** sin reescritura SPA, para que las rutas inexistentes den un 404 real
   (`npx --yes serve@14 .output/public -l 4173`), y también con `npm run preview`. Anota en qué difiere del
   servidor de producción (cabeceras, compresión, fallback).
6. **Inventario de URLs:** sitemap de producción, sitemap generado, `cachedRoutes.json`,
   `find .output/public -name '*.html'` y rutas estáticas. Cruza las listas: URLs del sitemap que no se generan,
   páginas generadas que faltan en el sitemap, páginas huérfanas y URLs duplicadas.
7. **Inventario de terceros:** dominios a los que se conecta cada plantilla, y cookies y almacenamiento creados
   antes y después de aceptar el consentimiento.
8. **Muestra para pruebas manuales profundas** (las automáticas se lanzan sobre **todas** las URLs): home,
   `/projects`, tres proyectos (el de más páginas, uno con embeds/tablas/código y uno mínimo), una página interna
   de proyecto, `/about`, `/webs`, `/social`, `/contact`, `/privacy`, `/blog` y una URL inexistente. Documenta
   la muestra elegida y el porqué.

---

## 5. Metodología

- **Triple contraste:** (1) análisis estático del código, (2) análisis del build generado (`.output/public`:
  HTML, JS, CSS, `_payload.json`) y (3) comportamiento en ejecución, tanto en local como en producción (en modo
  pasivo). Muchos fallos solo aparecen en una de las capas: contenido ausente en el HTML estático, cabeceras que
  solo existen en producción, errores que solo se dan tras hidratar…
- **Lighthouse:** 3 ejecuciones por URL y estrategia (móvil y escritorio); usa la **mediana**. Producción es la
  referencia; el build local sirve para diagnosticar.
- **Estados a probar en cada plantilla:** carga inicial, navegación cliente desde otra ruta, recarga directa,
  botón atrás/adelante, banner de cookies visible/aceptado/rechazado, menú móvil abierto, modales abiertos,
  formulario vacío/con errores/enviando/enviado (en local), API lenta o caída (simulada en local).
- **Severidad calibrada:** al terminar, revisa todas las severidades juntas para que sean coherentes entre áreas.

---

## 6. Áreas de auditoría y checklist mínima

Cada ítem debe aparecer en `cobertura.md` con uno de estos estados: ✅ verificado y correcto · ❌ hallazgo (ID)
· ⚠️ no verificable (motivo) · ➖ no aplica (motivo).

### 6.1 Seguridad (`SEC`)

**Secretos y exposición de información**

- [ ] Secretos en el repo y en **todo el historial de git**, ramas remotas incluidas (`gitleaks detect
--log-opts="--all" --redact` o `trufflehog git file://. `; alternativa: `git log -p --all` + `grep` de patrones
      como `key|secret|token|password|PRIVATE KEY`). Comprueba si algún `.env*` estuvo versionado alguna vez.
- [ ] Secretos o datos internos en el build (`.output/public`: HTML, JS, `_payload.json`, `window.__NUXT__`):
      valores de `.env` (sin transcribirlos), `runtimeConfig.captcha.secretKey`, URLs `localhost`, rutas absolutas
      del sistema de archivos, comentarios internos y source maps publicados.
- [ ] `runtimeConfig`: nada privado en `public`. Justifica si un sitio estático necesita realmente la clave
      privada del captcha (superficie innecesaria).
- [ ] Repositorio público: qué información de infraestructura expone (rutas del servidor, correos de
      administración, topología de despliegue) y si es aceptable.
- [ ] Archivos que no deberían servirse en producción (pocas peticiones `HEAD`): `/.htaccess`, `/.git/HEAD`,
      `/.env`, `/cachedRoutes.json`, `/package.json`, listado de `/_nuxt/`, `*.map`, copias de seguridad.

**Inyección y contenido dinámico**

- [ ] Inventario **completo** de `v-html`, `innerHTML` y `useHead({ script: [{ innerHTML }] })`. Para cada uno:
      origen del dato, sanitización aplicada y riesgo residual.
- [ ] Configuración de DOMPurify en `utils/sanitize.ts`: atributo `style` permitido (inyección CSS y suplantación
      visual), esquemas de URL en `href`/`src` (`javascript:`, `data:`), `target` sin `rel`, `id` permitido (DOM
      clobbering). Valida con PoC locales (script Node independiente con la misma configuración) usando payloads XSS
      conocidos. Nunca contra producción.
- [ ] `sanitizeRawHtml` (BlockRaw) y `BlockEmbed`: iframes de **cualquier** origen, ausencia de lista blanca de
      dominios y de `sandbox`, `allow` permisivo, `referrerpolicy` y `loading="lazy"`.
- [ ] `BlockCode` (`codeHtml`), `BlockQuote` (¿computed sin sanitizar?), `BlockLinkTool`, `BlockImage` y
      `BlockAttaches`: URLs procedentes de la API, enlaces externos y descargas.
- [ ] JSON-LD y metadatos construidos con datos de la API: escape de `</script>` y de caracteres especiales.
- [ ] Construcción de URLs de la API a partir de slugs de la ruta catch-all: codificación
      (`encodeURIComponent`), path traversal (`../`, `%2e%2e`, doble codificación), `?` y `#` inyectados.
- [ ] Todos los `target="_blank"` (estáticos y generados desde contenido) llevan `rel="noopener noreferrer"`.

**Formulario de contacto** (análisis del código, prueba en local contra una API local o mockeada y observación
de red en producción **hasta antes** del envío)

- [ ] Flujo CSRF de Sanctum entre `raupulus.dev` y `api.raupulus.dev`: cookie `XSRF-TOKEN` entre sitios,
      `SameSite`, `credentials: 'include'` y la lectura del token **después** de pedir la cookie.
- [ ] Validación en cliente (longitudes, formato, recorte de espacios), anti-spam (reCAPTCHA v3 con acción
      `contact`, honeypot, límite de peticiones), doble envío, timeouts y mensajes de error que filtren información.
- [ ] Requisitos que debe cumplir el backend (verificar el token del captcha en servidor, comprobar `action`,
      `score` y `hostname`, limitar peticiones, validar entradas). Van a `recomendaciones-api.md`, porque el backend
      queda fuera del alcance de la corrección.
- [ ] CORS de la API, observado pasivamente: `Access-Control-Allow-Origin` (¿`*` con credenciales?),
      `Allow-Credentials`, métodos permitidos y preflights.
- [ ] Proxy de desarrollo `/_proxy/**` (`routeRules`): confirma que no existe en producción y que en desarrollo
      no es un proxy abierto peligroso.

**Cabeceras, TLS y DNS** (producción; varias rutas y varios tipos de recurso)

- [ ] CSP: necesidad real de `'unsafe-inline'` y `'unsafe-eval'` en Nuxt 4 SSG, `img-src https:`, `frame-src`
      coherente con los embeds del contenido, `connect-src` coherente con las conexiones reales (reCAPTCHA, GA
      regional), `object-src`, `base-uri`, `form-action`, `frame-ancestors`, viabilidad de una CSP con hashes
      generados en build y de `report-to`. **Valida en la consola del navegador** que no hay violaciones en ninguna
      ruta ni estado (consentimiento aceptado, modal de contacto, embeds).
- [ ] HSTS (`includeSubDomains`, `preload`), `X-Content-Type-Options`, `X-Frame-Options` o `frame-ancestors`,
      `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` y `Cross-Origin-Resource-Policy`;
      presencia de cabeceras obsoletas (`X-XSS-Protection`) y divulgación de versión (`Server`, `X-Powered-By`).
- [ ] Discrepancias entre `apache.conf`, `nginx.conf`, `public/.htaccess` y lo que responde producción.
- [ ] TLS: protocolos, cifrados, cadena, caducidad, OCSP; HTTP→HTTPS y `www`→dominio raíz con un único 301 sin
      cadenas; registros CAA; `/.well-known/security.txt` (RFC 9116).
- [ ] Seguridad del correo del dominio (relevante porque se publica una dirección): SPF, DMARC (política) y
      existencia de DKIM.
- [ ] Recursos de terceros: inventario de dominios, SRI cuando aplique e imágenes servidas desde dominios ajenos
      (p. ej. `og:image` en `raw.githubusercontent.com`): disponibilidad y control.
- [ ] Mapeo del **OWASP Top 10 (edición vigente)** y del **OWASP ASVS nivel 1** aplicable a un frontend
      estático: cada categoría marcada como «aplica y verificado», «hallazgo» o «no aplica».

### 6.2 Privacidad y cumplimiento legal (`LEGAL`)

- [ ] En un **navegador limpio y antes de tocar el banner**, en cada plantilla: cookies, `localStorage`,
      `sessionStorage`, IndexedDB y peticiones a terceros. ¿Se carga `gtag.js` antes del consentimiento? ¿Se cargan
      reCAPTCHA y sus cookies en páginas sin formulario?
- [ ] Consent Mode v2: valores por defecto, `wait_for_update`, qué se concede al aceptar (¿se conceden señales
      `ad_*` cuando el usuario solo acepta analítica?), **revocación** (¿qué ocurre al retirar el consentimiento?
      ¿se eliminan las cookies `_ga*`?), persistencia y caducidad de las cookies del banner.
- [ ] Banner: rechazar tan fácil como aceptar desde la primera capa, sin opciones premarcadas, enlace a la
      política, accesible y sin tapar contenido crítico en móvil (Guía sobre el uso de cookies de la AEPD).
- [ ] Política de privacidad (`/privacy`): responsable, finalidades, bases jurídicas, destinatarios y encargados
      (Google Analytics, reCAPTCHA, Cloudflare, hosting, proveedor de correo), transferencias internacionales,
      plazos, derechos y cómo ejercerlos, autoridad de control y coherencia con lo que hace **realmente** el sitio.
- [ ] Política de cookies con una tabla real (nombre, proveedor, finalidad y duración).
- [ ] Aviso legal (LSSI-CE, art. 10): existencia y aplicabilidad a un portfolio personal.
- [ ] Formulario de contacto: información básica de protección de datos junto al formulario (art. 13 RGPD),
      aceptación no premarcada y minimización de datos.
- [ ] Licencias: coherencia entre la licencia del código (`LICENSE`) y los derechos sobre contenidos e imágenes;
      atribuciones de fuentes (OFL) e iconos (Material Symbols, Apache 2.0).
- [ ] Declaración de accesibilidad (buena práctica recomendada).

### 6.3 Bugs ocultos, robustez y errores visibles al usuario (`BUG`)

- [ ] **Mapa de obtención de datos:** qué se resuelve en el build (prerender) y qué en el navegador
      (`onMounted`, `onNuxtReady`, `fetch`). Para cada dato que se obtiene en tiempo de ejecución: ¿está en el HTML
      estático (SEO)? ¿provoca CLS? ¿qué ve el usuario si la API falla, tarda más de 10 s o cambia el formato?
- [ ] **Simulación de fallos en local** (interceptando la red con Playwright o DevTools): respuestas 500 y 404,
      timeout, JSON malformado, campos nulos o ausentes, listas vacías, textos muy largos, emojis o caracteres
      especiales e imágenes rotas. Registra el comportamiento visible en cada caso.
- [ ] **Build resiliente:** qué pasa si la API falla durante `npm run generate`. ¿Se genera y despliega un sitio
      sin proyectos y con el sitemap vacío sin que nadie se entere? Revisa `nitro.prerender.failOnError`,
      `crawlLinks`, la captura de errores del hook `prerender:routes` y del sitemap, y los avisos de prerender en el
      log del build.
- [ ] **Ruta catch-all** `[...slugs].vue`: slug o página inexistentes, más segmentos de los esperados
      (`/projects/a/b/c`), mayúsculas, barra final, caracteres codificados. Debe devolver un **404 real** tanto en
      acceso directo (código HTTP del servidor) como en navegación cliente (`createError`/`showError`), nunca un
      soft-404.
- [ ] **Páginas de error:** `error.vue` (no usa layout: ¿hay navegación suficiente?, `noindex`), y qué código
      HTTP devuelve producción para rutas inexistentes (`404.html` frente a un fallback a `index.html`/`200.html`).
- [ ] **Hidratación:** ningún aviso «Hydration mismatch» en ninguna ruta (build de producción y modo dev);
      contenido que dependa de `Date`, `Math.random`, `window`, zona horaria o locale.
- [ ] **Datos duplicados y carreras:** datos ya prerenderizados que se vuelven a pedir en cliente, búsqueda,
      filtros y paginación con respuestas antiguas que pisan a las nuevas, ausencia de debounce o de
      `AbortController`.
- [ ] **Estado global** (`useState`, `composables/states.ts`): estado que se arrastra entre rutas, como la clase
      `disable-scroll` del body tras cerrar un modal con el botón atrás, Esc o un cambio de ruta.
- [ ] **Fugas:** listeners, intervals y observers sin limpiar (`onMounted` sin `onUnmounted`) en Header, modales,
      `ImageSlide` y la rejilla de proyectos.
- [ ] **Middleware** `scroll-to-top.global.ts`: interacción con `scrollBehavior`, anclas `#hash`, restauración
      del scroll al volver atrás y `prefers-reduced-motion` (el `behavior: 'smooth'` por JS no lo cubre la regla CSS
      global).
- [ ] **Enlaces y recursos:** enlaces internos como `<NuxtLink>`/`<a href>` reales (no `@click` +
      `router.push`); enlaces internos y externos rotos (linkinator o lychee sobre el build y sobre producción);
      recursos 404 (incluidos el manifest y los iconos que referencia).
- [ ] **Consola limpia:** 0 errores y 0 warnings en todas las rutas, con y sin consentimiento, en móvil y
      escritorio. Recoge también peticiones fallidas (4xx/5xx), recursos bloqueados por la CSP y contenido mixto.
- [ ] **Redespliegues y caché:** un usuario con HTML en caché, ¿puede pedir chunks `/_nuxt/*.js` que ya no
      existen («Failed to fetch dynamically imported module»)? Revisa la caché del HTML (`.htaccess`
      `ExpiresDefault`, nginx/Apache, Cloudflare), la atomicidad del despliegue y el manejo de `app:chunkError`.
- [ ] **Tipos frente a realidad:** compara `types/**` con respuestas reales de cada endpoint consumido (pide una
      muestra): campos opcionales tratados como obligatorios, nulos no contemplados y ausencia de validación en
      tiempo de ejecución.
- [ ] Formato de fechas, números, plurales y ordenación (`Intl`, locale `es-ES`).
- [ ] Descarga del CV: funciona, el nombre del archivo y las cabeceras son correctos y el comportamiento es
      razonable si la API falla.
- [ ] Componentes, composables, tipos y assets **muertos** o que referencian archivos inexistentes (riesgo de
      romper el build si se empiezan a usar).

### 6.4 SEO técnico, on-page y de identidad (`SEO`)

**Técnico**

- [ ] El contenido principal de cada ruta está en el **HTML estático servido** (`curl` sin JS): títulos, textos,
      listados de proyectos y enlaces. Compara la salida de `curl` con el DOM renderizado.
- [ ] Códigos HTTP: todas las URLs del sitemap devuelven 200, las inexistentes 404 real, las redirecciones son
      301 únicas y la barra final es coherente.
- [ ] Canonical presente, absoluto y único por página, coincidente con la URL final y con el sitemap, sin
      parámetros. `og:url` coherente con él.
- [ ] **Metaetiquetas duplicadas o contradictorias** en el HTML final (definidas en `nuxt.config.ts` `app.head`,
      en `app.vue` con `useSeoMeta`/`useHead` y en cada página): cuenta por página las apariciones de `description`,
      `og:title`, `og:image`, `twitter:card`, etc.
- [ ] `title` único (30–60 caracteres) y `meta description` única (70–160 caracteres) por página; `og:*` y
      `twitter:*` completos con **URLs absolutas**; `og:image` de 1200×630, peso razonable y accesible
      públicamente; `og:image:alt`; tipo de `twitter:card` adecuado. Comprueba las previsualizaciones al compartir
      en LinkedIn, X, Mastodon, Bluesky, Telegram y WhatsApp (manualmente o simulando el parseo de etiquetas).
- [ ] Encabezados: un único `h1` por página y jerarquía sin saltos, también dentro del contenido EditorJS
      (`BlockHeader` puede introducir `h1` adicionales).
- [ ] `robots.txt` (sintaxis, que no bloquee recursos necesarios, sitemap absoluto) y `meta robots` por página
      (404 con `noindex`; `/blog` en construcción: ¿indexable con contenido pobre?).
- [ ] `sitemap.xml`: incluye todas y solo las URLs canónicas indexables, con un `lastmod` **real** (no la fecha
      del build en páginas sin cambios), sin URLs 404, redirigidas o `noindex`. Valora un sitemap de imágenes.
- [ ] Datos estructurados (JSON-LD) validados con validator.schema.org y la prueba de resultados enriquecidos:
      `Person` y `WebSite` correctos; `sameAs` completo y actualizado (redes actuales, x.com frente a twitter.com,
      Bluesky…); `BreadcrumbList` en proyectos; `CreativeWork`/`SoftwareSourceCode`/`WebPage` por proyecto;
      `ProfilePage` en `/about`; `ContactPage`. Sin datos incoherentes con el contenido visible.
- [ ] Internacionalización: `lang`, `og:locale` y `og:locale:alternate` sin versión alternativa real; hreflang
      ausente o correcto.
- [ ] Enlazado interno: profundidad de rastreo (≤ 3 clics), páginas huérfanas, texto ancla descriptivo,
      paginación rastreable con `<a href>` y migas de pan.
- [ ] Imágenes: `alt` descriptivo, dimensiones, formatos modernos, nombres de archivo e imágenes de contenido
      indexables (no solo fondos CSS).
- [ ] Contenido duplicado o escaso: descripciones por defecto repetidas, proyectos con muy poco texto o páginas
      casi idénticas.
- [ ] HTML válido (W3C Nu Checker sobre el build), con especial atención a errores que afecten al `<head>`.
- [ ] Web manifest y favicons: rutas válidas, tamaños, iconos `maskable`, `apple-touch-icon` y `theme_color`
      coherente con el tema oscuro.

**Identidad y presencia** (sin herramientas de pago)

- [ ] Coherencia de identidad entre el sitio y los perfiles (GitHub, GitLab, LinkedIn, X, Mastodon, Bluesky,
      YouTube, Twitch): nombre, foto, rol y enlaces recíprocos al portfolio.
- [ ] Si dispones de búsqueda web: `site:raupulus.dev`, búsquedas de marca («Raúl Caro Pastorino», «raupulus»),
      qué está indexado, títulos y snippets mostrados y páginas que no deberían aparecer.
- [ ] Oportunidades de palabras clave e intención de búsqueda (rol, tecnologías, ubicación) y recomendaciones de
      contenido (el blog está en construcción). No inventes volúmenes de búsqueda.
- [ ] Preparación para buscadores con IA: contenido citable y datos estructurados ricos; `llms.txt` como mejora
      opcional de baja prioridad.
- [ ] Recomendaciones de configuración para Google Search Console y Bing Webmaster Tools (sin acceso: indica qué
      revisar).

### 6.5 Rendimiento y Core Web Vitals (`PERF`)

- [ ] Lighthouse móvil y escritorio en **todas las plantillas** (producción como referencia, 3 ejecuciones,
      mediana): Performance, Accessibility, Best Practices, SEO, LCP, FCP, TBT, CLS, Speed Index y TTFB. Guarda el
      JSON de la ejecución mediana.
- [ ] Datos de campo (CrUX) mediante la API de PageSpeed Insights, si existen para el origen o la URL; si no
      existen, indícalo.
- [ ] **Elemento LCP** de cada plantilla: qué es, cuándo se descubre y con qué prioridad (`fetchpriority="high"`,
      sin `loading="lazy"`, preload), peso, formato y dimensiones responsive (`sizes`/`srcset`).
- [ ] **CLS:** `<img>` sin `width`/`height` (cabeceras, iconos sociales, GIF de modales), contenido inyectado al
      llegar datos en cliente, banner de cookies, fuentes sin métricas de fallback y header fijo.
- [ ] **INP:** handlers costosos (búsqueda, filtros, modales, galería) y tareas largas durante la hidratación.
- [ ] **JavaScript:** `npx nuxi analyze`, peso total y por ruta (gzip/brotli), chunks compartidos, dependencias
      pesadas en cliente (¿arrastra `isomorphic-dompurify` a jsdom?, `vue-recaptcha-v3`, cookie-control, iconos SVG
      importados con `import.meta.glob` eager en `MaterialIcon`), código sin usar (pestaña Coverage de DevTools),
      hidratación innecesaria (componentes lazy e hidratación diferida de Nuxt) y tamaño de `_payload.json`.
- [ ] **Terceros:** coste de `gtag.js` y reCAPTCHA. ¿Se cargan solo donde hacen falta y solo tras el
      consentimiento o la interacción?
- [ ] **Imágenes:** peso por página. ¿`@nuxt/image` con IPX genera de verdad variantes optimizadas en el preset
      `static` o sirve los originales? ¿Se optimizan las imágenes de la API? GIF animados pesados (→ vídeo o
      WebP/AVIF animado), PNG sin optimizar, `loading` y `decoding`.
- [ ] **Fuentes:** número y peso de archivos (2 familias × 5 pesos), subconjuntos, `font-display`, preload de
      las críticas, fallback ajustado (`size-adjust`) contra el CLS y pesos sin usar.
- [ ] **CSS:** tamaño, reglas sin usar, CSS crítico inline, peso de `styles.css` global y del banner de cookies.
- [ ] **Red:** brotli/gzip en HTML, JS, CSS, SVG y JSON; HTTP/2 o HTTP/3; `Cache-Control` por tipo (HTML corto o
      con revalidación; `/_nuxt/` y `/_fonts/` inmutables un año; imágenes); `ETag`; comportamiento de Cloudflare
      (`cf-cache-status`); `preconnect` a la API si se consulta en cliente; **preflights CORS innecesarios** (p. ej.
      `Content-Type: application/json` en peticiones GET).
- [ ] Cascada de peticiones de la home en 4G lenta: cadena crítica y recursos bloqueantes.
- [ ] Prefetch de rutas con `NuxtLink`: equilibrio entre velocidad percibida y consumo de datos móviles.

### 6.6 Responsive y compatibilidad entre dispositivos y navegadores (`RESP`)

**Matriz de viewports (CSS px):** 320×568, 360×800, 375×667, 390×844, 412×915, 430×932 (móviles); 768×1024,
820×1180, 1024×1366 (tablets, en vertical y en horizontal); 1280×800, 1366×768, 1440×900, 1920×1080 y 2560×1440
(escritorio).

**Motores:** Chromium, WebKit (como aproximación a Safari en iOS y macOS) y Firefox, con Playwright si está
disponible. Si no se puede probar en dispositivos reales (iOS Safari, Android Chrome, Samsung Internet), márcalo
como «No verificado».

Automatiza por ruta × viewport × motor: captura de página completa, detección de desbordamiento horizontal
(`scrollWidth > clientWidth` y elementos cuyo `getBoundingClientRect().right` supere `innerWidth`), errores de
consola y peticiones fallidas.

- [ ] Sin scroll horizontal ni elementos que se salgan; textos sin cortes ni solapamientos; palabras y URLs
      largas que rompen el layout (`overflow-wrap`); los `h1` escalan según la convención de `AGENTS.md`.
- [ ] Header fijo: no tapa contenido ni anclas (`scroll-margin-top`); el menú móvil abre, cierra, se cierra al
      navegar, bloquea el scroll correctamente y gestiona el foco.
- [ ] Uso de `100vh` (body con `disable-scroll`, alto mínimo del `main`) frente a la barra dinámica de iOS
      (`dvh`/`svh`); teclado virtual en el formulario de contacto.
- [ ] Interacciones que dependen de hover sin equivalente táctil; tamaño de los objetivos táctiles (mínimo
      24×24 según WCAG 2.5.8; recomendado 44×44).
- [ ] Tablas, bloques de código y embeds del contenido EditorJS a 320 px (scroll interno, `aspect-ratio`).
- [ ] Modales y galería (`ImageSlide`): tamaño en móvil, gestos de swipe, cierre y orientación horizontal.
- [ ] El banner de cookies y la insignia de reCAPTCHA no tapan CTAs, footer ni campos del formulario, ni se
      solapan entre sí.
- [ ] Zoom al 200 % y al 400 % en escritorio y aumento del tamaño de texto del sistema.
- [ ] Móvil en horizontal (~360 px de alto): header fijo + banner no deben ocupar toda la pantalla.
- [ ] Pantallas grandes: anchos máximos, imágenes pixeladas y líneas de más de ~80 caracteres.
- [ ] `forced-colors` (alto contraste de Windows) y `color-scheme` declarado (scrollbars e inputs nativos
      coherentes con el tema oscuro).
- [ ] Sin JavaScript: el contenido esencial y la navegación funcionan.
- [ ] Soporte de las características CSS/JS usadas (`backdrop-filter`, `:has()`, etc.) en los navegadores
      objetivo, con fallback.
- [ ] Estilos de impresión de `/about` y de un proyecto (baja prioridad).

Vuelca los resultados en `matriz-pruebas.md` (ruta × viewport × motor → OK / ID del hallazgo).

### 6.7 UX/UI y contenido (`UX` / `CONT`)

Usa como marco las 10 heurísticas de Nielsen.

- [ ] Arquitectura de la información: claridad del menú, estado activo, migas de pan, vuelta atrás y CTA
      principales (contacto, CV, proyectos) visibles en la primera pantalla en móvil.
- [ ] Estados de carga (skeletons frente a saltos), vacíos (búsqueda sin resultados), de error (API caída) y de
      éxito: coherentes y con mensajes útiles en español.
- [ ] Formulario de contacto: etiquetas visibles (el placeholder no sustituye al label), validación en línea,
      errores específicos, conservación de lo escrito ante un error, botón deshabilitado durante el envío y
      confirmación clara.
- [ ] Búsqueda y filtros de proyectos: comprensibles, reflejados en la URL (compartibles) y con opción de
      reiniciar.
- [ ] Coherencia con el design system (`docs/info/design-system.md`, `tailwind.config.ts`): colores fuera de
      tokens, espaciados, tipografías, radios e iconos; clases CSS globales con nombres de utilidades Tailwind
      (prohibido por `AGENTS.md`).
- [ ] Animaciones: propósito, duración, `prefers-reduced-motion` y GIF.
- [ ] Contenido: ortografía y gramática; tono; datos desactualizados (años de experiencia, tecnologías, año del
      copyright, redes); enlaces a perfiles vigentes; CV actualizado; coherencia del nombre y el rol entre páginas
      y metadatos; página `/blog` en construcción (valorar ocultarla o marcarla `noindex`); utilidad de la 404.
- [ ] Credibilidad (E-E-A-T): foto, biografía, proyectos con resultados, fechas, enlaces al código y pruebas
      sociales.

### 6.8 Accesibilidad — WCAG 2.2 AA (`A11Y`)

**Automático** (necesario pero no suficiente): axe-core en todas las rutas y estados (menú abierto, modal
abierto, banner visible, formulario con errores), más pa11y o Lighthouse. Objetivo: 0 violaciones `critical` o
`serious`.

**Manual:**

- [ ] Teclado: recorrido completo de cada ruta solo con Tab, Shift+Tab, Enter, Espacio, Esc y flechas; orden
      lógico; sin trampas; foco siempre visible (2.4.7) y no tapado por el header fijo ni por el banner (2.4.11);
      enlace «Saltar al contenido».
- [ ] Modales, menú móvil y galería: `role="dialog"`, `aria-modal`, nombre accesible, foco inicial, foco
      atrapado, cierre con Esc, devolución del foco al disparador y fondo `inert`.
- [ ] Landmarks (`header`, `nav` con nombre si hay varios, un único `main`, `footer`), títulos de página únicos
      (2.4.2), `lang` (3.1.1) y cambios de idioma relevantes (3.1.2, baja prioridad).
- [ ] Semántica: encabezados, listas y tablas con `th`, `scope` y `caption` en `BlockTable` (1.3.1).
- [ ] Imágenes: `alt` adecuado; decorativas con `alt=""` o `aria-hidden`; iconos SVG (`MaterialIcon`) ocultos con
      texto alternativo en botones solo-icono; iconos sociales y logos con nombre accesible.
- [ ] Enlaces y botones: propósito claro (2.4.4), `<button>` frente a `<a>` usados correctamente, aviso de
      apertura en nueva pestaña y nombre accesible que contiene el texto visible (2.5.3).
- [ ] **Contraste:** calcula y tabula los ratios de **todos** los pares texto/fondo de los tokens en uso (4.5:1
      texto normal, 3:1 texto grande; 3:1 componentes de interfaz y foco según 1.4.11), incluidos textos
      `text-xs` en mayúsculas con tracking, placeholders, estados hover/disabled y texto sobre imágenes o
      degradados.
- [ ] Formularios: labels asociados, `autocomplete` (1.3.5), errores identificados y descritos (3.3.1, 3.3.3),
      `aria-invalid`, `aria-describedby`, mensajes de estado con `aria-live` (4.1.3), sin depender solo del color,
      y qué ocurre si reCAPTCHA v3 falla o bloquea al usuario.
- [ ] Movimiento: `prefers-reduced-motion`, GIF de más de 5 s que se puedan pausar (2.2.2), sin destellos
      (2.3.1) y scroll suave por JS.
- [ ] Reflow (1.4.10), espaciado de texto (1.4.12, con el bookmarklet de text spacing), texto al 200 % (1.4.4),
      orientación (1.3.4), tamaño de objetivo (2.5.8) y contenido en hover o foco (1.4.13).
- [ ] Lector de pantalla: como mínimo VoiceOver (macOS Safari) en home, proyectos, un proyecto, contacto
      (formulario y envío simulado en local) y banner de cookies. NVDA y TalkBack si es posible.
- [ ] Barreras introducidas por terceros (banner de cookies, reCAPTCHA).
- [ ] HTML de la API (EditorJS) que rompa la semántica: `h1` dentro del contenido, imágenes sin `alt`, enlaces
      «aquí».

Entregable adicional: **tabla de conformidad WCAG 2.2 niveles A y AA**, criterio por criterio (Cumple / No cumple
/ No aplica / No verificado) dentro de `08-accesibilidad.md`.

### 6.9 Dependencias y cadena de suministro (`DEP`)

- [ ] `npm audit --json` y `npm audit --omit=dev --json`. En un sitio SSG casi todo es devDependency pero se
      ejecuta en el build o acaba en el bundle, así que clasifica cada vulnerabilidad por **exposición real**: bundle
      de cliente, build o solo herramientas de desarrollo.
- [ ] `npm outdated --long`: tabla con versión actual, `wanted` y `latest`, tipo de salto
      (patch/minor/major), cambios incompatibles relevantes y riesgo de actualizar.
- [ ] Estado de mantenimiento de cada dependencia directa (última publicación, repositorio archivado, issues
      críticas, alternativas), con atención especial a `vue-recaptcha-v3`, `@dargmuesli/nuxt-cookie-control`,
      `isomorphic-dompurify`, `nuxt-gtag` y los módulos Nuxt.
- [ ] Compatibilidad entre versiones mayores (Nuxt 4, TypeScript 6, ESLint 10, Vitest 4, happy-dom, Tailwind 3
      con `@nuxtjs/tailwindcss` 6) y antigüedad de `compatibilityDate` en `nuxt.config.ts` (qué comportamientos
      nuevos se pierden).
- [ ] Errores del árbol (`npm ls --all`), peers no satisfechas, duplicados y avisos `deprecated` de `npm ci`.
- [ ] **Coherencia del gestor de paquetes:** `AGENTS.md` exige npm, pero el repo contiene `pnpm-lock.yaml`,
      `pnpm-workspace.yaml` y `.npmrc` con `shamefully-hoist`. Evalúa el riesgo de builds no reproducibles y si
      `package-lock.json` está sincronizado con `package.json`.
- [ ] Versión de Node no fijada (`engines`, `.nvmrc`, `.node-version`) frente a la usada en local, CI y servidor.
- [ ] Clasificación `dependencies`/`devDependencies`, dependencias sin usar o no declaradas (`npx knip` o
      `npx depcheck`) y scripts `postinstall` de terceros.
- [ ] Licencias de todo el árbol (`npx license-checker-rseidelsohn --summary` o equivalente) y compatibilidad
      con la licencia del proyecto.
- [ ] Automatización: Renovate o Dependabot y `npm audit` en el CI.

### 6.10 Calidad de código, tests y mantenibilidad (`CODE`)

- [ ] Resultados de `npm run lint` (con la justificación de cada warning), `npx vue-tsc --noEmit`,
      `npm run test:run` y cobertura por archivo. Áreas críticas sin tests: routing de slugs, formulario,
      sanitización frente a payloads XSS, composables de datos y manejo de errores.
- [ ] Calidad de los tests: tests que no comprueban nada relevante, mocks que ocultan bugs y páginas sin tests.
- [ ] Cumplimiento de cada convención de `AGENTS.md`, verificado con búsquedas: `<script setup lang="ts">`,
      `:key` en `v-for`, `v-if` + `v-for` en el mismo elemento, defaults de props, `props` sin usar, raíz única en
      páginas, `useHead` completo en cada página, `NuxtImg`, tokens Tailwind, `sanitizeHtml`, `useApiBase` y
      `useState`.
- [ ] Seguridad SSR: accesos a `window`, `document` o `localStorage` fuera de `onMounted` o
      `import.meta.client`.
- [ ] TypeScript: `any`, aserciones `as`, `!`, `@ts-ignore`, tipos duplicados o desalineados, sufijo `Type`.
- [ ] Duplicación (p. ej. `card/Project*.vue`), código muerto, código comentado, `console.log`, TODO y FIXME.
- [ ] Manejo de errores coherente: ¿distingue `apiGet` entre «sin datos» y «error» o devuelve `null` en silencio?
- [ ] **Documentación frente a código:** `docs/info/*.md`, `README.md` y `AGENTS.md` (versión de la API,
      endpoints, estructura de componentes, archivos listados que no existen o que faltan). Cada desfase es un
      hallazgo `CODE`.
- [ ] Configuración de herramientas: reglas de accesibilidad en ESLint (`eslint-plugin-vuejs-accessibility`),
      Prettier, `tsconfig` y Vitest.

### 6.11 Infraestructura, CI/CD y operación (`INFRA`)

- [ ] Servidor y CDN reales en producción y coherencia de las configuraciones versionadas (Apache, nginx,
      `.htaccess`) con la realidad. Las configuraciones obsoletas son un riesgo de despliegues erróneos.
- [ ] `gocd.yaml`: puertas que faltan (`vue-tsc`, `npm audit`, `format:check`, Lighthouse CI, comprobación de
      enlaces, axe). ¿Dispone realmente el job de deploy de `.output/public`, que es un artefacto de otra etapa?
      ¿Falla el job si la verificación con `curl` no devuelve 200 (sin `set -e`/`pipefail`)? ¿Se purga la caché de
      Cloudflare? Rama que despliega (`main`) frente a la rama de trabajo.
- [ ] `scripts/deploy.sh`: atomicidad (un `rsync --delete` en caliente sobre el docroot deja una ventana con HTML
      nuevo y chunks borrados o pendientes), rollback, verificación (¿solo comprueba la home?) y copias de
      seguridad.
- [ ] Build reproducible desde un clon limpio con Node fijado y dependencia de la API durante el build (¿qué pasa
      si el runner no llega a la API?).
- [ ] Observabilidad: monitorización de disponibilidad, alertas, captura de errores JS de usuarios, Search Console
      e informes de la CSP.
- [ ] DNS y red: A/AAAA (IPv6), CAA, DNSSEC, TTL, HTTP/3 y redirecciones de dominios alternativos.
- [ ] `docs/info/deploy-cicd.md` al día con lo anterior.

---

## 7. Clasificación de hallazgos

**Prefijos de ID:** `SEC`, `LEGAL`, `BUG`, `SEO`, `PERF`, `RESP`, `UX`, `CONT`, `A11Y`, `DEP`, `CODE`, `INFRA`,
numerados con tres dígitos (`SEO-001`). Una misma causa raíz es **un único hallazgo** con varias ubicaciones;
los hallazgos relacionados se enlazan entre sí.

| Severidad       | Criterio                                                                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Crítica**     | Explotable o expone secretos o datos personales; sitio caído o inutilizable; desindexación; incumplimiento legal grave. Corregir de inmediato.                                                          |
| **Alta**        | Afecta a muchos usuarios o al posicionamiento/CWV de forma medible; vulnerabilidad con impacto real; barrera que impide completar una tarea (incumplimiento WCAG nivel A); errores visibles frecuentes. |
| **Media**       | Degradación notable con alternativa; incumplimiento WCAG AA no bloqueante; defensa en profundidad ausente; riesgo de error en circunstancias concretas.                                                 |
| **Baja**        | Mejora menor, deuda técnica o inconsistencia sin impacto directo.                                                                                                                                       |
| **Informativa** | Buena práctica u observación sin defecto.                                                                                                                                                               |

- **Prioridad:** P0 (inmediata), P1 (este sprint), P2 (próximo ciclo), P3 (cuando haya ocasión). Combina
  severidad, esfuerzo y dependencias.
- **Confianza:** `verificado` (reproducido con evidencia), `probable` (evidencia indirecta fuerte) o `hipótesis`
  (requiere confirmación; se presenta separada).
- **Esfuerzo:** XS (< 30 min), S (< 2 h), M (< 1 día), L (1–3 días), XL (> 3 días).
- **Ámbito:** `código`, `producción` o `ambos`.
- **Seguridad:** añade CWE y, cuando aplique, un vector CVSS v4.0 (o 3.1). **Accesibilidad:** criterio WCAG.
  **SEO/rendimiento:** métrica afectada y documentación de Google o web.dev.

---

## 8. Plantilla obligatoria de hallazgo

```markdown
### SEO-001 — Título breve y específico

| Campo                   | Valor                                        |
| ----------------------- | -------------------------------------------- |
| Severidad               | Alta                                         |
| Prioridad               | P1                                           |
| Confianza               | Verificado                                   |
| Esfuerzo                | S                                            |
| Ámbito                  | Ambos                                        |
| Ubicación               | `app.vue:12`, https://raupulus.dev/projects  |
| Dispositivo / navegador | Todos (o p. ej. WebKit 390×844)              |
| Referencias             | CWE-…, WCAG 2.2 …, documentación de Google … |
| Relacionado con         | PERF-003                                     |

**Descripción.** Qué ocurre y por qué es un problema.

**Evidencia.** Comando y salida recortada, captura (`evidencias/capturas/…`) o fragmento de código.

**Pasos para reproducir.** 1. … 2. … 3. …

**Impacto.** Sobre usuarios, SEO, seguridad o reputación; cuantificado cuando sea posible.

**Recomendación.** Solución concreta para este código (con fragmento si ayuda) y alternativas con sus pros y
contras.

**Verificación de la corrección.** Cómo comprobar que queda resuelto: comando, test que añadir o métrica
objetivo.
```

---

## 9. Entregables

```text
docs/auditorias/
├── README.md                         # Índice de auditorías: fecha, auditor, modo, commit, puntuación, enlace (crear/actualizar)
├── PROMPT-AUDITORIA.md               # Este prompt (no modificar)
└── AAAA-MM-DD-<AUDITOR>/
    ├── README.md                     # Informe ejecutivo (ver abajo)
    ├── 01-seguridad.md
    ├── 02-privacidad-legal.md
    ├── 03-bugs-robustez.md
    ├── 04-seo.md
    ├── 05-rendimiento.md
    ├── 06-responsive-compatibilidad.md
    ├── 07-ux-ui-contenido.md
    ├── 08-accesibilidad.md           # Incluye la tabla de conformidad WCAG 2.2 A/AA
    ├── 09-dependencias.md
    ├── 10-calidad-codigo.md
    ├── 11-infraestructura-cicd.md
    ├── recomendaciones-api.md        # Problemas o requisitos que dependen del backend
    ├── cobertura.md                  # Checklist completa de la sección 6 con el estado de cada ítem
    ├── matriz-pruebas.md             # Rutas × viewports × motores
    ├── plan-remediacion.md
    ├── hallazgos.json
    └── evidencias/
        ├── entorno.txt
        ├── scripts.md                # Scripts auxiliares usados, como bloques de código reproducibles
        ├── build/                    # lint, vue-tsc, tests, resumen de cobertura, log de generate
        ├── lighthouse/               # JSON de la ejecución mediana por URL y estrategia
        ├── axe/
        ├── cabeceras/
        ├── dependencias/             # npm audit, outdated, licencias
        └── capturas/                 # <ruta>__<ancho>x<alto>__<motor>.webp
```

Mantén `evidencias/` por debajo de ~25 MB: capturas comprimidas (WebP o JPEG), solo el JSON de la ejecución
mediana de Lighthouse y sin informes HTML pesados.

Cada archivo de área (`01`–`11`) empieza con un resumen de 3–5 líneas y una tabla de sus hallazgos (ID,
título, severidad, prioridad, esfuerzo) y continúa con los hallazgos completos ordenados por severidad. Termina
con una sección **«Verificado y correcto»** que enumera lo comprobado sin problemas: es imprescindible para
contrastar con la segunda opinión, porque distingue «no hay problema» de «no se revisó».

### Informe ejecutivo (`README.md` de la carpeta)

1. **Ficha:** fecha, auditor, modo, commit, rama, cambios sin commitear, URL auditada, herramientas y versiones.
2. **Resumen ejecutivo** (≤ 1 página, comprensible sin conocimientos técnicos).
3. **Scorecard** por área (0–10, con una línea de justificación) y **nota global ponderada** (sección 10).
4. **Métricas clave:** tabla de Lighthouse (4 categorías × móvil/escritorio × plantilla), CWV, violaciones axe,
   calificación de cabeceras y TLS, vulnerabilidades por severidad, enlaces rotos y errores de consola.
5. **Tabla de cumplimiento** de cada umbral de la sección 10 (cumple / no cumple).
6. Recuento de hallazgos por severidad y por área.
7. **Top 10** de riesgos priorizados.
8. **Quick wins:** alto impacto con esfuerzo XS o S.
9. Alcance, metodología, muestra, limitaciones y lista explícita de **lo que no se pudo verificar**.
10. En modo `interno` con auditorías previas: regresiones y hallazgos previos resueltos o pendientes.

### `hallazgos.json`

Debe ser un JSON válido y coherente con los `.md` (mismos ID, severidades y estados):

```json
[
    {
        "id": "SEO-001",
        "area": "seo",
        "titulo": "…",
        "severidad": "alta",
        "prioridad": "P1",
        "confianza": "verificado",
        "esfuerzo": "S",
        "ambito": "ambos",
        "ubicaciones": ["app.vue:12", "https://raupulus.dev/"],
        "referencias": ["https://developers.google.com/…"],
        "resumen": "…",
        "recomendacion": "…",
        "relacionados": ["PERF-003"]
    }
]
```

### `plan-remediacion.md`

- **Fase 0 — Urgente (≤ 24 h):** críticos y P0.
- **Fase 1 — Quick wins:** alto impacto con poco esfuerzo.
- **Fases 2 y siguientes:** agrupadas por tema y ordenadas por dependencias técnicas (qué debe hacerse antes de
  qué), con estimación y criterio de aceptación por grupo.
- **Controles preventivos** para que los problemas no reaparezcan: puertas de CI (Lighthouse CI con
  presupuestos, axe en tests, comprobación de enlaces, `npm audit`, `vue-tsc`), Renovate/Dependabot,
  monitorización y checklist de revisión de PR.

---

## 10. Umbrales de excelencia y puntuación

| Área                                                               | Métrica                                                                                          | Objetivo                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| Lighthouse móvil (producción, mediana, todas las plantillas)       | Performance / Accessibility / Best Practices / SEO                                               | ≥ 95 / 100 / 100 / 100                     |
| Lighthouse escritorio                                              | Ídem                                                                                             | ≥ 98 / 100 / 100 / 100                     |
| Core Web Vitals (p75 de campo; si no hay datos, laboratorio móvil) | LCP / INP / CLS                                                                                  | ≤ 2,0 s / ≤ 200 ms / ≤ 0,05                |
| Carga                                                              | TTFB / FCP                                                                                       | ≤ 0,6 s / ≤ 1,5 s                          |
| Presupuesto orientativo (home)                                     | JS inicial comprimido / peso total                                                               | ≤ 120 KB / ≤ 1 MB (justifica si se supera) |
| Accesibilidad                                                      | axe / WCAG 2.2                                                                                   | 0 violaciones / AA completo                |
| Seguridad                                                          | Mozilla HTTP Observatory / SSL Labs                                                              | ≥ A (ideal A+) / A+                        |
| Seguridad                                                          | Secretos expuestos / vulnerabilidades altas o críticas con exposición real                       | 0 / 0                                      |
| SEO                                                                | URLs del sitemap con 200 + canonical correcto + indexables                                       | 100 %                                      |
| SEO                                                                | 404 reales / enlaces rotos / errores en datos estructurados / títulos y descripciones duplicados | Sí / 0 / 0 / 0                             |
| Robustez                                                           | Errores de consola / peticiones fallidas / hydration mismatch / scroll horizontal a 320 px       | 0 / 0 / 0 / 0                              |
| Calidad                                                            | Errores de lint / errores de vue-tsc / tests fallidos                                            | 0 / 0 / 0                                  |

**Rúbrica por área (0–10):** 10 = cumple todos los umbrales y no tiene hallazgos de severidad media o superior;
8–9 = sin altos ni críticos y pocos medios; 6–7 = algún hallazgo alto; 4–5 = varios altos o un crítico; < 4 =
varios críticos.

**Ponderación de la nota global:** Seguridad 15 · Bugs/robustez 15 · SEO 15 · Rendimiento 15 · Responsive 10 ·
Accesibilidad 10 · Privacidad/legal 8 · UX/contenido 5 · Dependencias 3 · Calidad de código 2 · Infra/CI-CD 2.

---

## 11. Modo `consolidacion`

1. Lee el `hallazgos.json` y los informes de cada carpeta de `AUDITORIAS_A_CONSOLIDAR`. **No modifiques esas
   carpetas.**
2. Empareja los hallazgos equivalentes (misma causa raíz aunque estén redactados distinto) y construye una
   **matriz de concordancia**: hallazgos comunes, exclusivos de cada auditoría y con severidad distinta.
3. Para cada discrepancia (hallazgo exclusivo o diferencia de severidad de un nivel o más), **vuelve a
   verificarla contra el código y producción** y resuélvela con evidencia: confirmado, falso positivo o
   severidad ajustada, con su argumentación.
4. Compara también las secciones «Verificado y correcto» y «No verificado»: lo que una auditoría dio por bueno y
   la otra señaló como problema requiere verificación explícita.
5. Calcula estadísticas de concordancia (porcentaje de coincidencias por área y severidad) y describe los puntos
   ciegos de cada auditoría.
6. Genera `docs/auditorias/AAAA-MM-DD-consolidada/` con: `README.md` (resumen y scorecard consolidado),
   `matriz-concordancia.md`, `discrepancias-resueltas.md`, `hallazgos.json` unificado (con nuevos ID y el campo
   `origen` que apunte a los ID originales) y un `plan-remediacion.md` único.

---

## 12. Control de calidad antes de terminar

- [ ] Todos los ítems de la sección 6 del `ALCANCE` aparecen en `cobertura.md` con estado; ninguno queda
      pendiente.
- [ ] Cada hallazgo tiene evidencia reproducible, ubicación precisa, recomendación concreta y forma de
      verificación.
- [ ] Sin duplicados; relaciones cruzadas anotadas; severidades recalibradas para que sean coherentes entre
      áreas.
- [ ] Las hipótesis están separadas y ninguna se presenta como verificada.
- [ ] `hallazgos.json` es válido (`node -e "JSON.parse(require('fs').readFileSync('<ruta>','utf8'))"`) y
      coherente con los `.md`.
- [ ] Los enlaces relativos entre documentos funcionan.
- [ ] `npx prettier --write "docs/auditorias/<CARPETA_AUDITORIA>/**/*.md"` aplicado, para que el informe no
      rompa `npm run format:check`.
- [ ] Búsqueda final de secretos, tokens y direcciones de correo distintas de `public@raupulus.dev` en toda la
      carpeta del informe: ninguno.
- [ ] `git status --porcelain` solo muestra cambios nuevos dentro de `docs/auditorias/` (compáralo con el estado
      inicial guardado en `entorno.txt`). `npm run lint` sigue igual que al empezar.
- [ ] `docs/auditorias/README.md` está actualizado.
- [ ] **Mensaje final en el chat:** puntuación global, recuento de hallazgos por severidad, top 5 y ruta del
      informe. No pegues el informe completo.

---

## Anexo A — Archivos clave por área

| Área                                        | Archivos                                                                                                                                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Configuración                               | `nuxt.config.ts`, `app.vue`, `error.vue`, `layouts/default.vue`, `tailwind.config.ts`, `assets/css/*.css`, `eslint.config.mjs`, `vitest.config.ts`, `tsconfig.json`, `.gitignore`, `env.example`, `env.example.production` |
| Paquetes                                    | `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, `.nuxtrc`                                                                                                                          |
| Datos y API                                 | `composables/*.ts`, `utils/apiClient.ts`, `utils/ContentUtils.ts`, `utils/TechnologyUtils.ts`, `types/**`                                                                                                                  |
| Contenido dinámico y XSS                    | `utils/sanitize.ts`, `components/content/blocks/*.vue`, `components/content/contentPaginator.vue`, `components/ui/MaterialIcon.vue`                                                                                        |
| Formulario de contacto                      | `pages/contact.vue`, `components/modals/submitContact.vue`, `plugins/google-recaptcha.ts`, `composables/useGoogleRecaptcha.ts`                                                                                             |
| Layout y navegación                         | `components/app/Header.vue`, `components/app/Footer.vue`, `middleware/scroll-to-top.global.ts`, `composables/states.ts`                                                                                                    |
| Páginas                                     | `pages/**`                                                                                                                                                                                                                 |
| Componentes                                 | `components/**` (cards, grid, modals, icons, form, btn)                                                                                                                                                                    |
| Estáticos                                   | `public/**` (`robots.txt`, `.htaccess`, `favicons/site.webmanifest`, `social/*.webp`), `assets/images/**`, `assets/favicons/**`                                                                                            |
| Infraestructura                             | `apache.conf`, `apache_dev.conf`, `nginx.conf`, `nginx_dev.conf`, `public/.htaccess`, `gocd.yaml`, `scripts/*.sh`                                                                                                          |
| Documentación                               | `AGENTS.md`, `README.md`, `TODO.md`, `CHANGELOG.md`, `docs/info/*.md`                                                                                                                                                      |
| Fuera de alcance (locales o no versionados) | `template/`, `docs/planning/`, `.venv-git/`, `.idea/`, `.junie/`. Solo comprueba que no se publican ni afectan al build.                                                                                                   |

## Anexo B — Comandos de referencia

```bash
# Estado y entorno
git rev-parse HEAD && git branch --show-current && git status --porcelain
node -v && npm -v

# Puertas de calidad y build
npm run lint
npx vue-tsc --noEmit
npm run test:run
npm run test:coverage
npm run generate
npx nuxi analyze

# Servir el build sin fallback SPA
npx --yes serve@14 .output/public -l 4173

# Dependencias
npm audit --json
npm audit --omit=dev --json
npm outdated --long
npm ls --all
npx --yes knip
npx --yes license-checker-rseidelsohn --summary

# Secretos (si están instalados)
gitleaks detect --source . --log-opts="--all" --redact
trufflehog git file://. --only-verified

# Build generado
grep -rEn "localhost|127\.0\.0\.1|sourceMappingURL" .output/public
find .output/public -name "*.map"

# Producción (pasivo y con bajo volumen)
curl -sSI https://raupulus.dev/
curl -sSI http://raupulus.dev/
curl -sSI https://www.raupulus.dev/
curl -sS -o /dev/null -w "%{http_code}\n" "https://raupulus.dev/no-existe-$(date +%s)"
curl -sS https://raupulus.dev/sitemap.xml
curl -sS https://raupulus.dev/robots.txt
curl -sSI -H "Accept-Encoding: br" https://raupulus.dev/
dig +short AAAA raupulus.dev
dig +short CAA raupulus.dev
dig +short TXT raupulus.dev
dig +short TXT _dmarc.raupulus.dev
openssl s_client -connect raupulus.dev:443 -servername raupulus.dev </dev/null 2>/dev/null | openssl x509 -noout -dates -issuer

# Rendimiento (3 ejecuciones por URL y estrategia; usar la mediana)
npx --yes lighthouse https://raupulus.dev/ --output=json --output-path=./lh-mobile.json --chrome-flags="--headless=new"
npx --yes lighthouse https://raupulus.dev/ --preset=desktop --output=json --output-path=./lh-desktop.json --chrome-flags="--headless=new"
curl -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fraupulus.dev%2F&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo"

# Accesibilidad y enlaces (sobre el build local)
npx --yes pa11y-ci --sitemap http://localhost:4173/sitemap.xml --sitemap-find https://raupulus.dev --sitemap-replace http://localhost:4173
npx --yes linkinator http://localhost:4173 --recurse

# Navegadores para la matriz responsive (descarga ~500 MB; si no es posible, usa Chrome local o las herramientas de navegador del entorno)
npx --yes playwright install chromium webkit firefox
```

**Servicios en línea** (solo URLs públicas y bajo volumen): Mozilla HTTP Observatory, SSL Labs (reutiliza
resultados en caché), securityheaders.com, hstspreload.org, PageSpeed Insights, validator.schema.org, Rich
Results Test, W3C Nu HTML Checker y los inspectores de enlaces compartidos de LinkedIn y otras redes.

## Anexo C — Referencias normativas y técnicas

- WCAG 2.2 (W3C) y EN 301 549. La European Accessibility Act tiene aplicabilidad limitada a un portfolio
  personal: úsala como referencia de buenas prácticas.
- OWASP Top 10 (edición vigente), OWASP ASVS 5.0 nivel 1, CWE y CVSS v4.0.
- Google Search Central (fundamentos de SEO, canonical, sitemaps, datos estructurados, JavaScript SEO) y web.dev
  (Core Web Vitals).
- Documentación de Nuxt 4 (prerendering, SEO y meta, `@nuxt/image` con generación estática, gestión de errores)
  y MDN (cabeceras HTTP, CSP).
- RGPD (art. 13), LSSI-CE (Ley 34/2002, arts. 10 y 22.2) y la Guía sobre el uso de las cookies de la AEPD.
- RFC 9116 (`security.txt`).
- Heurísticas de usabilidad de Nielsen.
