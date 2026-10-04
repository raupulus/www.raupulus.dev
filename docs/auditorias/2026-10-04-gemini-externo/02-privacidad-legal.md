# 02 — Privacidad y Cumplimiento Legal (`LEGAL`)

> **Resumen del área:** La auditoría de privacidad ha constatado múltiples incumplimientos del RGPD, de la Directiva ePrivacy y de las directrices de la Agencia Española de Protección de Datos (AEPD). Destacan la concesión abusiva de señales de publicidad en Consent Mode v2 cuando el usuario solo aceptó analítica, la imposibilidad técnica de revocar el consentimiento de Google Analytics, la inyección global de scripts y rastreadores de Google reCAPTCHA en todas las páginas sin formulario y sin consentimiento previo, y la ausencia de tabla de cookies, bases jurídicas formales y cláusula de primera capa de información en el formulario de contacto.

---

## Tabla de Hallazgos

| ID            | Título                                                                                                 | Severidad | Prioridad | Esfuerzo | Ámbito |
| ------------- | ------------------------------------------------------------------------------------------------------ | --------- | --------- | -------- | ------ |
| **LEGAL-001** | Consent Mode v2 concede señales publicitarias (`ad_*`) tras consentir únicamente analítica             | Alta      | P1        | S        | Código |
| **LEGAL-002** | Imposibilidad técnica de revocar el consentimiento de Google Analytics y persistencia de cookies `_ga` | Alta      | P1        | S        | Código |
| **LEGAL-003** | Carga global omnipresente de Google reCAPTCHA v3 en páginas sin formulario y sin consentimiento        | Alta      | P1        | M        | Código |
| **LEGAL-004** | Política de privacidad incompleta según los requisitos del artículo 13 del RGPD                        | Media     | P2        | M        | Ambos  |
| **LEGAL-005** | Ausencia de tabla detallada de cookies con proveedor, propósito y duración en `/privacy`               | Media     | P2        | S        | Ambos  |
| **LEGAL-006** | Formulario de contacto con consentimiento bundled (mezclado) y sin primera capa informativa            | Media     | P2        | XS       | Código |
| **LEGAL-007** | Ausencia de Aviso Legal formal (LSSI-CE art. 10) y Declaración de Accesibilidad                        | Baja      | P3        | S        | Ambos  |

---

## Hallazgos Detallados

### LEGAL-001 — Consent Mode v2 concede señales publicitarias (`ad_*`) tras consentir únicamente analítica

| Campo                   | Valor                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| Severidad               | Alta                                                                   |
| Prioridad               | P1                                                                     |
| Confianza               | Verificado                                                             |
| Esfuerzo                | S                                                                      |
| Ámbito                  | Código                                                                 |
| Ubicación               | `app.vue:131-137`                                                      |
| Dispositivo / navegador | Todos los navegadores                                                  |
| Referencias             | RGPD art. 6.1(a), art. 7.4; Guía de Cookies AEPD; Guía Consent Mode v2 |
| Relacionado con         | LEGAL-002                                                              |

**Descripción.** El banner de cookies de `@dargmuesli/nuxt-cookie-control` categoriza la cookie de Google Analytics como `google-analytics` («Cookies de Analítica»), con la descripción explícita de que su única finalidad es proporcionar «datos analíticos sobre el tráfico del sitio». Sin embargo, cuando el usuario acepta esta categoría, el watcher en `app.vue` envía a Google Analytics una orden `consent: update` que otorga permisos publicitarios plenos:

- `ad_user_data: 'granted'`
- `ad_personalization: 'granted'`
- `ad_storage: 'granted'`
- `analytics_storage: 'granted'`

Esto constituye una concesión de consentimiento no solicitada ni informada para fines publicitarios, infringiendo el principio de consentimiento explícito e informado del RGPD.

**Evidencia.**
`app.vue:121-140`:

```typescript
watch(
    () => cookiesEnabledIds.value,
    (current, previous) => {
        if (!previous?.includes('google-analytics') && current?.includes('google-analytics')) {
            const { gtag } = useGtag();
            gtag('consent', 'update', {
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                ad_storage: 'granted',
                analytics_storage: 'granted',
            });
        }
    },
    { deep: true },
);
```

**Pasos para reproducir.**

1. Abrir el sitio con almacenamiento limpio.
2. Abrir la consola de red / depurador de gtag.
3. Aceptar únicamente «Cookies de Analítica» en el banner.
4. Comprobar que el comando `gtag('consent', 'update', ...)` incluye `ad_user_data: granted` y `ad_personalization: granted`.

**Impacto.** Infracción grave de la normativa de protección de datos al transmitir a Google señales de consentimiento publicitario sin la autorización expresa del usuario.

**Recomendación.**
Modificar la actualización del consentimiento para conceder únicamente `analytics_storage: 'granted'`. Las señales publicitarias (`ad_user_data`, `ad_personalization`, `ad_storage`) deben permanecer en `'denied'`, ya que el sitio no muestra ni comercializa publicidad.

**Verificación de la corrección.**
Comprobar en la consola del navegador que tras aceptar cookies analíticas, `ad_storage`, `ad_user_data` y `ad_personalization` se mantienen denegadas.

---

### LEGAL-002 — Imposibilidad técnica de revocar el consentimiento de Google Analytics y persistencia de cookies `_ga`

| Campo                   | Valor                                                                        |
| ----------------------- | ---------------------------------------------------------------------------- |
| Severidad               | Alta                                                                         |
| Prioridad               | P1                                                                           |
| Confianza               | Verificado                                                                   |
| Esfuerzo                | S                                                                            |
| Ámbito                  | Código                                                                       |
| Ubicación               | `app.vue:121-143`, `nuxt.config.ts:297`                                      |
| Dispositivo / navegador | Todos los navegadores                                                        |
| Referencias             | RGPD art. 7.3 (Revocación tan fácil como la concesión); Guía de Cookies AEPD |
| Relacionado con         | LEGAL-001                                                                    |

**Descripción.** El RGPD exige que revocar el consentimiento sea tan fácil como otorgarlo. La implementación actual presenta dos fallos críticos de revocación:

1. En `app.vue:121-143`, el watcher solo contiene una condición `if` para cuando se añade `google-analytics`. No existe ninguna rama `else` para cuando el usuario desmarca la opción: si el usuario retira el consentimiento desde el botón flotante de configuración, **nunca se ejecuta `gtag('consent', 'update', { analytics_storage: 'denied' })`**, manteniéndose Google Analytics en estado concedido en memoria.
2. En `nuxt.config.ts:297`, la propiedad `targetCookieIds: ['_ga', '_gid', 'google-analytics']` está comentada. Por tanto, el módulo de control de cookies no elimina las cookies `_ga` ni `_ga_*` del navegador del usuario al rechazar o revocar.
3. Además, el watcher carece de `{ immediate: true }`, por lo que en visitantes recurrentes que ya habían aceptado previamente, el watcher no se dispara en la carga inicial y el estado de consentimiento no se reenvía a gtag.

**Evidencia.**
`nuxt.config.ts:295-298`:

```typescript
isPreselected: false,
//src: 'https://example.com/analytics/js?id=<API-KEY>',
//targetCookieIds: ['_ga', '_gid', 'google-analytics'], // IDs de cookies objetivo
```

**Pasos para reproducir.**

1. Aceptar las cookies en el banner.
2. Abrir la configuración de cookies con el botón flotante y desmarcar «Cookies de Analítica».
3. Guardar cambios.
4. Inspeccionar `document.cookie`: las cookies `_ga` y `_ga_*` siguen intactas y no se ha emitido llamada a `gtag` con `denied`.

**Impacto.** Incumplimiento del derecho a retirar el consentimiento (art. 7.3 RGPD) e ineficacia de la herramienta de gestión de cookies frente a inspecciones de la AEPD.

**Recomendación.**

1. Descomentar y completar `targetCookieIds: ['_ga', '_gid', 'google-analytics']` en `nuxt.config.ts`.
2. Añadir en el watcher de `app.vue` la lógica de revocación: si `current` no incluye `google-analytics`, ejecutar `gtag('consent', 'update', { analytics_storage: 'denied' })` y borrar explícitamente las cookies asociadas.
3. Añadir `{ immediate: true }` para evaluar el estado inicial almacenado en cookies.

**Verificación de la corrección.**
Test manual en navegador: aceptar cookies, verificar presencia de `_ga`, desactivar desde el panel y comprobar la eliminación inmediata de las cookies y la llamada a gtag con `analytics_storage: denied`.

---

### LEGAL-003 — Carga global omnipresente de Google reCAPTCHA v3 en páginas sin formulario y sin consentimiento

| Campo                   | Valor                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                    |
| Prioridad               | P1                                                                                      |
| Confianza               | Verificado                                                                              |
| Esfuerzo                | M                                                                                       |
| Ámbito                  | Código                                                                                  |
| Ubicación               | `plugins/google-recaptcha.ts:4-19`, `pages/contact.vue:47-55`                           |
| Dispositivo / navegador | Todos los navegadores                                                                   |
| Referencias             | Directiva 2002/58/CE (ePrivacy) art. 5.3; Dictamen 05/2014 del GT29; Sentencia Planet49 |
| Relacionado con         | PERF-004, A11Y-002                                                                      |

**Descripción.** El plugin `plugins/google-recaptcha.ts` registra `VueReCaptcha` de forma global en la aplicación Nuxt. Como resultado, **los scripts de Google reCAPTCHA (`https://www.google.com/recaptcha/api.js` o `https://www.recaptcha.net/...`) se cargan y ejecutan en absolutamente todas las páginas del sitio** (Inicio, Proyectos, Sobre Mí, Blog, Webs, Social, Privacidad).
reCAPTCHA v3 recopila datos de telemetría y comportamiento del usuario (movimientos del cursor, resolución, cabeceras, cookies) y los transfiere a Google sin que el usuario haya prestado consentimiento previo y en páginas donde ni siquiera existe ningún formulario que proteger.
En `pages/contact.vue`, el código simplemente usa `showBadge()` y `hideBadge()` para ocultar visualmente la insignia, pero la ejecución del script y el rastreo ocurren en todas las rutas.

**Evidencia.**
`plugins/google-recaptcha.ts:18`:

```typescript
nuxtApp.vueApp.use(VueReCaptcha, options);
```

En la consola de red en `/` o `/about`: se observa la descarga de los scripts de reCAPTCHA y la creación de un textarea oculto `#g-recaptcha-response` en el DOM.

**Pasos para reproducir.**

1. Abrir la página `/about` o `/privacy` en modo incógnito.
2. Filtrar en la pestaña Network por `recaptcha`.
3. Comprobar que se descargan los recursos de Google reCAPTCHA y se establece comunicación con sus servidores.

**Impacto.** Infracción de la Directiva ePrivacy y del RGPD por rastreo no justificado en páginas sin formularios; sobrecarga de rendimiento y bloqueo de recursos en móvil.

**Recomendación.**
Eliminar el plugin global `plugins/google-recaptcha.ts`. Cargar la librería y el script de reCAPTCHA bajo demanda (lazy load) **exclusivamente en `pages/contact.vue`** en el momento en que el usuario empieza a interactuar con el formulario.

**Verificación de la corrección.**
Inspeccionar las peticiones de red en `/` y `/about`: no debe aparecer ninguna petición hacia `recaptcha.net` ni `google.com`.

---

### LEGAL-004 — Política de privacidad incompleta según los requisitos del artículo 13 del RGPD

| Campo                   | Valor                                                         |
| ----------------------- | ------------------------------------------------------------- |
| Severidad               | Media                                                         |
| Prioridad               | P2                                                            |
| Confianza               | Verificado                                                    |
| Esfuerzo                | M                                                             |
| Ámbito                  | Ambos                                                         |
| Ubicación               | `pages/privacy.vue:11-70`                                     |
| Dispositivo / navegador | N/A                                                           |
| Referencias             | RGPD art. 13 (Información que debe facilitarse al interesado) |
| Relacionado con         | LEGAL-005, LEGAL-006                                          |

**Descripción.** El texto de la política de privacidad en `pages/privacy.vue` presenta notables lagunas jurídicas respecto a las exigencias del art. 13 del RGPD:

1. **Identificación del responsable:** Falta la dirección postal o forma de contacto fehaciente (únicamente se menciona el nombre y un enlace al formulario).
2. **Base jurídica del tratamiento (art. 13.1.c):** No se especifican las bases legales aplicables (consentimiento para analítica, interés legítimo para seguridad, medidas precontractuales para contacto).
3. **Encargados de tratamiento y destinatarios (art. 13.1.e):** No se identifican los proveedores que procesan datos (Cloudflare, Google Ireland Ltd, servicio de hosting, servicio de correo).
4. **Transferencias internacionales (art. 13.1.f):** No se informa de las transferencias internacionales de datos hacia Estados Unidos derivadas del uso de Cloudflare y Google, ni de la existencia del marco regulatorio (EU-US Data Privacy Framework).
5. **Plazos de conservación (art. 13.2.a):** No se indican los períodos durante los cuales se conservan los mensajes de contacto ni los registros estadísticos.
6. **Derechos del interesado (art. 13.2.b y d):** No se enumera la posibilidad de ejercer los derechos de acceso, rectificación, supresión, limitación y oposición, ni el derecho a reclamar ante la Agencia Española de Protección de Datos (AEPD).

**Evidencia.**
Lectura íntegra del archivo `pages/privacy.vue:1-70`.

**Pasos para reproducir.**

1. Navegar a `https://raupulus.dev/privacy`.
2. Cotejar los apartados con los requerimientos obligatorios del artículo 13 del RGPD.

**Impacto.** Riesgo de sanciones administrativas por parte de la autoridad de control (AEPD) por falta de transparencia informativa obligatoria.

**Recomendación.**
Redactar y estructurar la política de privacidad incorporando los apartados preceptivos: Responsable (con correo `public@raupulus.dev`), Finalidades y Bases Legales, Destinatarios y Encargados, Transferencias Internacionales, Plazos de Conservación, Ejercicio de Derechos y Reclamación ante la AEPD.

**Verificación de la corrección.**
Revisión documental confirmando que todos los puntos del art. 13 están cubiertos en la página `/privacy`.

---

### LEGAL-005 — Ausencia de tabla detallada de cookies con proveedor, propósito y duración en `/privacy`

| Campo                   | Valor                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Severidad               | Media                                                        |
| Prioridad               | P2                                                           |
| Confianza               | Verificado                                                   |
| Esfuerzo                | S                                                            |
| Ámbito                  | Ambos                                                        |
| Ubicación               | `pages/privacy.vue:42-45`                                    |
| Dispositivo / navegador | N/A                                                          |
| Referencias             | Guía sobre el uso de las cookies de la AEPD (Apartado 3.2.2) |
| Relacionado con         | LEGAL-004                                                    |

**Descripción.** La sección de cookies de la página `/privacy` se limita a un párrafo genérico de dos líneas: _«Nuestro sitio web utiliza cookies para mejorar la funcionalidad...»_. La normativa española y las directrices de la AEPD exigen que la segunda capa informativa detalle en una tabla clara:

- Nombre o identificador exacto de la cookie.
- Proveedor / Titular (propia o de terceros).
- Finalidad concreta (técnica, análisis, seguridad).
- Plazo de conservación (duración de la sesión, 1 año, 2 años).

**Evidencia.**
`pages/privacy.vue:42-45`:

```html
<h2>3. Cookies y tecnologías similares</h2>
<p>
    Nuestro sitio web utiliza cookies para mejorar la funcionalidad y el rendimiento del sitio. Las cookies son pequeños
    archivos de texto que se almacenan en tu dispositivo cuando visitas ciertos sitios web.
</p>
```

**Pasos para reproducir.**

1. Visitar `https://raupulus.dev/privacy` y comprobar la sección 3.

**Impacto.** Incumplimiento de la obligación de información de segunda capa establecida en el art. 22.2 de la LSSI-CE y la guía de la AEPD.

**Recomendación.**
Añadir una tabla exhaustiva en `/privacy` que liste: `ncc_c` (consentimiento dado, propia, 1 año), `ncc_e` (cookies habilitadas, propia, 1 año), `_ga` (Google Analytics, terceros, 2 años), `_ga_*` (Google Analytics, terceros, 2 años), `XSRF-TOKEN` (Laravel Sanctum / seguridad técnica, propia, 10 horas) y `api_raupulus_session` (sesión técnica, propia, 10 horas).

**Verificación de la corrección.**
Comprobar visualmente la existencia y exactitud de la tabla en `/privacy`.

---

### LEGAL-006 — Formulario de contacto con consentimiento bundled y sin primera capa informativa

| Campo                   | Valor                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------- |
| Severidad               | Media                                                                                  |
| Prioridad               | P2                                                                                     |
| Confianza               | Verificado                                                                             |
| Esfuerzo                | XS                                                                                     |
| Ámbito                  | Código                                                                                 |
| Ubicación               | `pages/contact.vue:626-631`                                                            |
| Dispositivo / navegador | Todos los navegadores                                                                  |
| Referencias             | RGPD art. 13 (capas informativas), art. 7.4 (prohibición de vinculación injustificada) |
| Relacionado con         | LEGAL-004, UX-001                                                                      |

**Descripción.** El checkbox de aceptación en el formulario de contacto presenta el texto:
`«Acepto recibir correos electrónicos y la política de privacidad.»`
Esto incurre en dos problemas legales:

1. **Consentimiento vinculado (bundled):** Vincula la aceptación de la política de privacidad con la aceptación de «recibir correos electrónicos», lo cual puede interpretarse como comunicaciones comerciales o newsletters. Si el usuario solo desea enviar una consulta puntual, no debe ser forzado a aceptar recibir correos adicionales.
2. **Falta de primera capa informativa:** Junto al botón de envío debe incluirse un cuadro resumen con la información básica (Responsable, Finalidad, Legitimación, Destinatarios y Enlace a Política completa).

**Evidencia.**
`pages/contact.vue:626-631`:

```html
<span class="text-sm text-on-surface-variant leading-relaxed">
    Acepto recibir correos electrónicos y la
    <NuxtLink to="/privacy" target="_blank" class="text-tertiary hover:underline"> política de privacidad </NuxtLink>.
</span>
```

**Pasos para reproducir.**

1. Ir a `/contact` y revisar la redacción del checkbox legal.

**Impacto.** Riesgo de nulidad del consentimiento y potencial amonestación por incumplimiento de la exigencia de consentimiento libre e inequívoco.

**Recomendación.**

1. Cambiar el texto a: _«He leído y acepto la política de privacidad para la gestión de mi consulta.»_
2. Incorporar una cláusula de primera capa inmediatamente debajo del formulario con los campos preceptivos del RGPD.

**Verificación de la corrección.**
Revisar el formulario de contacto para validar el texto desvinculado y la presencia del bloque informativo.

---

### LEGAL-007 — Ausencia de Aviso Legal formal (LSSI-CE art. 10) y Declaración de Accesibilidad

| Campo                   | Valor                                                   |
| ----------------------- | ------------------------------------------------------- |
| Severidad               | Baja                                                    |
| Prioridad               | P3                                                      |
| Confianza               | Verificado                                              |
| Esfuerzo                | S                                                       |
| Ámbito                  | Ambos                                                   |
| Ubicación               | `pages/privacy.vue`, estructura general                 |
| Dispositivo / navegador | N/A                                                     |
| Referencias             | Ley 34/2002 (LSSI-CE) art. 10; Directiva (UE) 2016/2102 |
| Relacionado con         | LEGAL-004                                               |

**Descripción.** El sitio web carece de un documento de Aviso Legal o mención expresa a las condiciones de uso y propiedad intelectual reguladas en el artículo 10 de la Ley de Servicios de la Sociedad de la Información (LSSI-CE), así como de una Declaración de Accesibilidad que detalle el grado de conformidad con WCAG 2.2 AA y las vías de contacto para reportar barreras de acceso.

**Evidencia.**
No existe `/legal`, `/aviso-legal` ni mención en el footer a aviso legal.

**Pasos para reproducir.**

1. Inspeccionar las rutas del pie de página (`/privacy`, `/contact`).

**Impacto.** Menor claridad jurídica sobre la autoría de contenidos y falta de transparencia sobre accesibilidad.

**Recomendación.**
Integrar un apartado de Aviso Legal / Términos de Uso (o una sección unificada en `/privacy`) y publicar una Declaración de Accesibilidad accesible desde el pie de página.

**Verificación de la corrección.**
Enlace funcional en el footer hacia los términos legales y accesibilidad.

---

## Verificado y Correcto

- ✅ **Sin cookies analíticas antes del consentimiento:** `gtag` se inicializa con `initCommands` que configuran todos los permisos de almacenamiento en `denied` antes de que el usuario interactúe con el banner.
- ✅ **Banner accesible y no premarcado:** El banner de `@dargmuesli/nuxt-cookie-control` se presenta con los switches de analítica apagados por defecto (`isPreselected: false`), cumpliendo con la exigencia de consentimiento por acción positiva.
- ✅ **Opciones de primera capa:** El banner ofrece botones simétricos de aceptación y rechazo («Aceptar Todas» y «Rechazar Todas»).
- ✅ **Licencia de software libre presente:** El repositorio cuenta con archivo `LICENSE` y atribución en pie de página.
