# 02 · Privacidad y cumplimiento legal

> Marco: RGPD (art. 6, 7 y 13), LSSI-CE (arts. 10 y 22.2) y la Guía sobre el uso de las cookies de la AEPD
> (julio de 2023). Esto no es asesoramiento jurídico: los hallazgos señalan desviaciones técnicas respecto a esos
> textos y conviene validarlos con un profesional.

## Resumen

El banner de cookies usa el texto por defecto de la librería, que establece un **consentimiento implícito**
(«Si continúa navegando, consideramos que acepta su uso»), y **no ofrece rechazar en la primera capa**. Antes de
cualquier interacción ya se cargan `gtag.js` y reCAPTCHA (`recaptcha.net`, `www.gstatic.com`,
`fonts.gstatic.com`) y se envían pings de Google Analytics. Al aceptar «analítica» se conceden también las
señales publicitarias (`ad_storage`, `ad_user_data`, `ad_personalization`), y al revocar el consentimiento ni se
actualiza Consent Mode ni se borran las cookies `_ga`. La política de privacidad carece de casi todos los
elementos del art. 13 RGPD y no hay aviso legal ni política de cookies.

| ID        | Título                                                                               | Severidad | Prioridad | Esfuerzo |
| --------- | ------------------------------------------------------------------------------------ | --------- | --------- | -------- |
| LEGAL-001 | Banner con consentimiento implícito y sin «Rechazar» en la primera capa              | Alta      | P1        | XS       |
| LEGAL-002 | Google Analytics y reCAPTCHA se cargan antes del consentimiento en todas las páginas | Alta      | P1        | S        |
| LEGAL-003 | Aceptar analítica concede señales publicitarias; revocar no surte efecto             | Alta      | P1        | S        |
| LEGAL-004 | Política de privacidad sin la información obligatoria del art. 13 RGPD               | Alta      | P1        | M        |
| LEGAL-005 | Sin aviso legal (LSSI art. 10) ni política de cookies con inventario real            | Media     | P2        | S        |
| LEGAL-006 | El checkbox del formulario agrupa la aceptación de la política y el envío de correos | Media     | P2        | XS       |
| LEGAL-007 | La API fija cookies de sesión en cada visita a páginas con datos                     | Baja      | P3        | S        |

---

### LEGAL-001 — Banner con consentimiento implícito y sin «Rechazar» en la primera capa

| Campo                   | Valor                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                     |
| Prioridad               | P1                                                                                                       |
| Confianza               | Verificado                                                                                               |
| Esfuerzo                | XS                                                                                                       |
| Ámbito                  | Ambos                                                                                                    |
| Ubicación               | `nuxt.config.ts:308` (`isAcceptNecessaryButtonEnabled: false`), `nuxt.config.ts:317-330` (`localeTexts`) |
| Dispositivo / navegador | Todos                                                                                                    |
| Referencias             | Guía de cookies AEPD 2023, apdo. 3.2.1; RGPD art. 4.11 y 7; LSSI art. 22.2                               |
| Relacionado con         | LEGAL-002                                                                                                |

**Descripción.** El texto del banner es el valor por defecto de `@dargmuesli/nuxt-cookie-control` en español
(`node_modules/@dargmuesli/nuxt-cookie-control/dist/runtime/locale/es.js:4`), porque `localeTexts.es` no
sobrescribe `bannerDescription`. La primera capa solo muestra «Aceptar» y «Gestionar Cookies».

**Evidencia.** `evidencias/scripts.md` → `scenarios.mjs`, escenario 1:

```text
banner: "Cookies Utilizamos cookies propias y de terceros para poder mostrarle una página web y comprender cómo la
utiliza, con el fin de mejorar los servicios que ofrecemos. Si continúa navegando, consideramos que acepta su uso.
Aceptar Gestionar Cookies"
buttons: ["Aceptar","Gestionar Cookies"]
```

**Impacto.** La AEPD considera inválido el consentimiento por «seguir navegando» y exige que rechazar sea tan
sencillo como aceptar, en la misma capa. Riesgo sancionador y de reputación.

**Recomendación.** En `nuxt.config.ts`: `isAcceptNecessaryButtonEnabled: true` (muestra «Rechazar todas» junto a
«Aceptar») y sobrescribir el texto:

```ts
localeTexts: {
  es: {
    bannerDescription: 'Uso cookies de analítica (Google Analytics) para saber qué páginas se visitan. Solo se activan si las aceptas. Puedes cambiar tu elección en cualquier momento.',
    accept: 'Aceptar', acceptAll: 'Aceptar todas', decline: 'Rechazar', declineAll: 'Rechazar todas', manageCookies: 'Configurar',
  },
},
```

**Verificación de la corrección.** En un navegador limpio, la primera capa muestra «Aceptar» y «Rechazar» con el
mismo peso visual y el texto no menciona el consentimiento por navegación.

---

### LEGAL-002 — Google Analytics y reCAPTCHA se cargan antes del consentimiento

| Campo                   | Valor                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Severidad               | Alta                                                                                                   |
| Prioridad               | P1                                                                                                     |
| Confianza               | Verificado                                                                                             |
| Esfuerzo                | S                                                                                                      |
| Ámbito                  | Ambos                                                                                                  |
| Ubicación               | `nuxt.config.ts:219-231` (`gtag.initMode: 'auto'`), `plugins/google-recaptcha.ts:1-20` (plugin global) |
| Dispositivo / navegador | Todos                                                                                                  |
| Referencias             | LSSI art. 22.2; Guía de cookies AEPD 2023; Google Consent Mode v2 (modo avanzado frente a básico)      |
| Relacionado con         | PERF-002, LEGAL-001                                                                                    |

**Descripción.** En un contexto limpio, sin tocar el banner, todas las páginas (también las que no tienen
formulario) conectan con `www.googletagmanager.com`, `region1.google-analytics.com`, `recaptcha.net`,
`www.gstatic.com` y `fonts.gstatic.com`. Se envían pings `g/collect` con `gcs=G100` (Consent Mode «avanzado»: sin
cookies, pero con transmisión de datos a Google). reCAPTCHA se instala como plugin global y descarga su script y
sus fuentes en cada página.

**Evidencia.** Escenario 1 de `scenarios.mjs` contra el build local:

```text
preconsent /  hosts: ["localhost:3020","recaptcha.net","www.googletagmanager.com","localhost:8000","www.gstatic.com","fonts.gstatic.com","region1.google-analytics.com"]
              failed: ["net::ERR_ABORTED POST https://region1.google-analytics.com/g/collect?v=2&tid=G-5SFJ……&gcs=G100…"]
```

En producción, `gtag.id` está vacío en `window.__NUXT__.config` (el build del 11/09 no tiene `GTAG_ID`), así que la
analítica no funciona, pero reCAPTCHA sí se carga en todas las páginas.

**Impacto.** Transmisión de datos (IP, user agent, URL) a Google y acceso al dispositivo por parte de reCAPTCHA sin
consentimiento previo en páginas donde no hay ningún formulario que proteger. Además penaliza el rendimiento
(PERF-002).

**Recomendación.**

1. reCAPTCHA: cargarlo solo en `/contact` y, mejor aún, solo al interactuar con el formulario. Quitar
   `plugins/google-recaptcha.ts` como plugin global y usar `useReCaptchaProvider` o carga manual del script
   dentro de `pages/contact.vue`. Mencionarlo en la política de privacidad como medida de seguridad (interés
   legítimo) junto al formulario. Alternativa ya prevista en `TODO.md`: Cloudflare Turnstile.
2. Analítica: usar `initMode: 'manual'` y llamar a `initialize()` solo cuando `cookiesEnabledIds` contenga
   `google-analytics` (Consent Mode básico). Si se prefiere el modo avanzado, documentarlo de forma explícita en
   la política de cookies.

**Verificación de la corrección.** En un perfil limpio, la pestaña Network de `/`, `/projects` y `/about` no muestra
peticiones a dominios de Google antes de aceptar; `/contact` solo carga reCAPTCHA al enfocar el formulario.

---

### LEGAL-003 — Aceptar analítica concede señales publicitarias; revocar no surte efecto

| Campo                   | Valor                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                            |
| Prioridad               | P1                                                                              |
| Confianza               | Verificado                                                                      |
| Esfuerzo                | S                                                                               |
| Ámbito                  | Ambos (en producción, además, `ad_user_data` arranca como `granted`)            |
| Ubicación               | `app.vue:119-146`                                                               |
| Dispositivo / navegador | Todos                                                                           |
| Referencias             | RGPD art. 7.3 (retirar el consentimiento tan fácil como darlo); Consent Mode v2 |
| Relacionado con         | LEGAL-001                                                                       |

**Descripción.** El `watch` de `cookiesEnabledIds` ejecuta `gtag('consent', 'update', …)` con las **cuatro**
señales en `granted` cuando el usuario acepta la categoría «Cookies de Analítica». No hay rama para la revocación.
En producción, el build antiguo publica además `consent default` con `ad_user_data: "granted"`
(`window.__NUXT__.config.public.gtag.initCommands`).

**Evidencia.** Escenario 2 de `scenarios.mjs`:

```text
postconsent-accept consent: [… ["consent","update",{"ad_user_data":"granted","ad_personalization":"granted","ad_storage":"granted","analytics_storage":"granted"}]]
                   cookies: ["localhost _ga","localhost _ga_5SFJJFHGHE","localhost ncc_c","localhost ncc_e"]
after-revoke       cookies: ["localhost _ga","localhost _ga_5SFJJFHGHE","localhost ncc_c"]   ← las cookies _ga siguen
                   consent: (sin ningún "update" a "denied")
```

**Impacto.** Se activan finalidades publicitarias que el usuario no ha aceptado y la revocación no detiene el
tratamiento.

**Recomendación.**

```ts
watch(
    () => cookiesEnabledIds.value,
    (current) => {
        const analytics = current?.includes('google-analytics') ? 'granted' : 'denied';
        const { gtag } = useGtag();
        gtag('consent', 'update', {
            analytics_storage: analytics,
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
        });
        if (analytics === 'denied') {
            document.cookie
                .split(';')
                .map((c) => c.split('=')[0].trim())
                .filter((n) => n.startsWith('_ga'))
                .forEach((n) => {
                    document.cookie = `${n}=; Max-Age=0; path=/; domain=.${location.hostname}`;
                    document.cookie = `${n}=; Max-Age=0; path=/`;
                });
        }
    },
    { deep: true },
);
```

También se puede declarar `targetCookieIds: ['_ga', '_ga_*']` en la cookie opcional para que el módulo las borre.

**Verificación de la corrección.** Repetir el escenario 2: tras revocar no quedan cookies `_ga*` y `dataLayer`
contiene un `consent update` con `analytics_storage: denied`.

---

### LEGAL-004 — Política de privacidad sin la información obligatoria del art. 13 RGPD

| Campo                   | Valor                                                 |
| ----------------------- | ----------------------------------------------------- |
| Severidad               | Alta                                                  |
| Prioridad               | P1                                                    |
| Confianza               | Verificado                                            |
| Esfuerzo                | M                                                     |
| Ámbito                  | Ambos                                                 |
| Ubicación               | `pages/privacy.vue:1-70`                              |
| Dispositivo / navegador | —                                                     |
| Referencias             | RGPD art. 13; LOPDGDD art. 11 (información por capas) |
| Relacionado con         | LEGAL-005, LEGAL-006                                  |

**Descripción.** El texto actual es genérico. Faltan:

| Elemento (art. 13)                                                                                 | Presente                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Identidad y contacto del responsable                                                               | ❌ Solo el nombre; sin dirección postal ni correo (debe ser `public@raupulus.dev`)                                                 |
| Finalidades **y base jurídica** de cada tratamiento                                                | ⚠️ Finalidades vagas; ninguna base jurídica                                                                                        |
| Destinatarios / encargados                                                                         | ❌ No se nombra a Google (Analytics y reCAPTCHA), Cloudflare, el hosting ni el proveedor de correo (MXroute, según el registro MX) |
| Transferencias internacionales                                                                     | ❌ Google y Cloudflare (EE. UU., Data Privacy Framework)                                                                           |
| Plazo de conservación                                                                              | ❌                                                                                                                                 |
| Derechos (acceso, rectificación, supresión, oposición, limitación, portabilidad) y cómo ejercerlos | ❌                                                                                                                                 |
| Derecho a reclamar ante la AEPD                                                                    | ❌                                                                                                                                 |
| Derecho a retirar el consentimiento                                                                | ❌                                                                                                                                 |
| Fecha de última actualización                                                                      | ❌                                                                                                                                 |
| Inventario de cookies                                                                              | ❌ (LEGAL-005)                                                                                                                     |

Además usa el plural «nosotros» y «nuestro sitio» en un sitio unipersonal, y promete «Te notificaremos cualquier
cambio», algo que no se puede cumplir sin un medio de contacto.

**Impacto.** Información insuficiente para que el consentimiento y el formulario de contacto sean válidos.

**Recomendación.** Reescribir la política con la estructura de la tabla y añadir una primera capa informativa junto
al formulario de contacto (LEGAL-006). Mantener la fecha de actualización visible.

**Verificación de la corrección.** Cada fila de la tabla anterior aparece en `/privacy`.

---

### LEGAL-005 — Sin aviso legal ni política de cookies con inventario real

| Campo                   | Valor                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Severidad               | Media                                                               |
| Prioridad               | P2                                                                  |
| Confianza               | Verificado                                                          |
| Esfuerzo                | S                                                                   |
| Ámbito                  | Ambos                                                               |
| Ubicación               | `components/app/Footer.vue:16-38`; no existe `/legal` ni `/cookies` |
| Dispositivo / navegador | —                                                                   |
| Referencias             | LSSI-CE art. 10; Guía de cookies AEPD 2023, apdo. 3.1               |
| Relacionado con         | LEGAL-004                                                           |

**Descripción.** El footer enlaza «Política de Privacidad», «Contacto» y el código fuente. No hay aviso legal ni una
página de cookies con la tabla real. Las cookies observadas son: `ncc_c` y `ncc_e` (consentimiento, 1 año), `_ga`
y `_ga_<ID>` (Google Analytics, 2 años, solo con consentimiento), `XSRF-TOKEN` y `api_raupulus_session`
(`api.raupulus.dev`, 10 h) y las de reCAPTCHA (`_GRECAPTCHA`, en `recaptcha.net`).

**Impacto.** Para un portfolio personal sin actividad económica, la aplicabilidad del art. 10 LSSI es discutible.
Si el sitio sirve para captar clientes o trabajo (lo sugiere el texto «cómo puedo ayudarte a llevar tu proyecto al
siguiente nivel» de `/contact`), debería tener aviso legal.

**Recomendación.** Añadir `/legal` (titular, NIF si procede, correo de contacto, condiciones de uso, licencia de
contenidos) y `/cookies` con la tabla anterior, ambos enlazados en el footer y en el banner.

**Verificación de la corrección.** Footer con enlaces a `/legal` y `/cookies`; la tabla coincide con las cookies
observadas en un navegador limpio.

---

### LEGAL-006 — El checkbox del formulario agrupa la aceptación de la política y el envío de correos

| Campo                   | Valor                                                    |
| ----------------------- | -------------------------------------------------------- |
| Severidad               | Media                                                    |
| Prioridad               | P2                                                       |
| Confianza               | Verificado                                               |
| Esfuerzo                | XS                                                       |
| Ámbito                  | Código                                                   |
| Ubicación               | `pages/contact.vue:617-631`, `pages/contact.vue:360-361` |
| Dispositivo / navegador | —                                                        |
| Referencias             | RGPD art. 7.2 (consentimiento granular), art. 13         |
| Relacionado con         | LEGAL-004, BUG-008                                       |

**Descripción.** Una sola casilla, «Acepto recibir correos electrónicos y la política de privacidad», se envía a la
API dos veces: como `privacity` y como `contactme`. Junto al formulario no hay información básica (responsable,
finalidad, base jurídica, derechos).

**Impacto.** Consentimiento no granular: responder a una consulta no requiere consentir comunicaciones adicionales.

**Recomendación.** Separar la casilla obligatoria («He leído la política de privacidad») de una opcional («Quiero
recibir novedades»), si existe esa finalidad. Añadir un texto breve de primera capa: «Responsable: Raúl Caro
Pastorino. Finalidad: responder a tu mensaje. Base: tu consentimiento. Más información en la política de privacidad».

**Verificación de la corrección.** Dos campos independientes en el payload y texto de primera capa visible.

---

### LEGAL-007 — La API fija cookies de sesión en cada visita a páginas con datos

| Campo                   | Valor                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                                |
| Prioridad               | P3                                                                                  |
| Confianza               | Verificado                                                                          |
| Esfuerzo                | S                                                                                   |
| Ámbito                  | Producción (API)                                                                    |
| Ubicación               | Respuestas de `GET https://api.raupulus.dev/api/v2/platforms/portfolio` y similares |
| Dispositivo / navegador | —                                                                                   |
| Referencias             | Guía de cookies AEPD 2023 (cookies técnicas)                                        |
| Relacionado con         | recomendaciones-api.md (API-04)                                                     |

**Descripción.** Las peticiones `GET` públicas de la API responden con `set-cookie: XSRF-TOKEN` y
`api_raupulus_session` (10 h) aunque no haya ningún formulario en la página (escenario 1: `/projects` las recibe
antes de cualquier interacción).

**Impacto.** Se crean sesiones en el servidor por cada visita y se instalan cookies que no son estrictamente
necesarias para leer contenido público.

**Recomendación.** Servir los endpoints públicos de solo lectura sin el middleware de sesión (grupo `api`
stateless de Laravel) y emitir la cookie CSRF solo en `/sanctum/csrf-cookie` desde el formulario.

**Verificación de la corrección.** `curl -sSI https://api.raupulus.dev/api/v2/platforms/portfolio | grep -i set-cookie` sin resultados.

---

## Verificado y correcto

- ✅ La categoría «Cookies de Analítica» no está preseleccionada (`isPreselected: false`).
- ✅ Consent Mode arranca con las cuatro señales en `denied` en el código actual (`nuxt.config.ts:223-231`).
- ✅ No se instalan cookies `_ga` antes de aceptar (solo pings sin cookies; ver LEGAL-002).
- ✅ Las cookies de consentimiento (`ncc_c`, `ncc_e`) usan `SameSite=Strict` y caducan en 1 año, dentro del máximo de
  24 meses que recomienda la AEPD.
- ✅ El formulario no tiene casillas premarcadas.
- ✅ Licencias de recursos de terceros: fuentes Space Grotesk y Plus Jakarta Sans (OFL 1.1) e iconos Material Symbols
  (Apache 2.0), compatibles con la licencia GPL-3.0 del código (`LICENSE`). Falta una atribución explícita, que
  es recomendable pero no obligatoria.

## No verificado

- ⚠️ Aplicabilidad exacta del art. 10 LSSI-CE: depende de si el sitio constituye actividad económica.
- ⚠️ Comportamiento real del banner y la analítica **en producción** con un `GTAG_ID` válido: el build desplegado no lo
  tiene configurado.
- ⚠️ Declaración de accesibilidad: no es obligatoria para un particular; se recomienda como buena práctica (A11Y).
