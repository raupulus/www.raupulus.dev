# 6.2 Privacidad y cumplimiento legal (LEGAL) — Auditoría externa deepsek-externo

Resumen: el sitio usa un banner de cookies (`@dargmuesli/nuxt-cookie-control`) con Consent Mode v2, pero
la configuración observada no cumple la Guía de la AEPD: en producción la analítica aparecía **premarcada**,
el texto invita al «consentimiento por continuar navegando», y al aceptar analítica se conceden señales
publicitarias (`ad_user_data`, `ad_personalization`, `ad_storage`). No hay revocación efectiva ni borrado de
cookies `_ga`, ni aviso legal LSSI, ni tabla de cookies. reCAPTCHA (Google) se carga desde el plugin global
en todas las páginas, incluidas las que no tienen formulario.

| ID        | Título                                                                   | Sev.  | Prior. | Esf. |
| --------- | ------------------------------------------------------------------------ | ----- | ------ | ---- |
| LEGAL-001 | Al aceptar analítica se conceden señales publicitarias (Consent Mode)    | Alta  | P1     | S    |
| LEGAL-002 | No hay revocación de consentimiento ni borrado de cookies `_ga*`         | Alta  | P1     | M    |
| LEGAL-003 | Banner: analítica premarcada y texto de «consentimiento por navegación»  | Alta  | P1     | S    |
| LEGAL-004 | reCAPTCHA se carga en todas las páginas antes del consentimiento         | Media | P2     | M    |
| LEGAL-005 | Política de cookies sin tabla real (nombre/proveedor/finalidad/duración) | Media | P2     | S    |
| LEGAL-006 | Sin aviso legal (LSSI art. 10) ni declaración de accesibilidad           | Baja  | P3     | S    |
| LEGAL-007 | Información RGPD art. 13 junto al formulario, mejorable                  | Baja  | P3     | S    |
| LEGAL-008 | `gtag` habilitado con `id` vacío → carga el script sin medir             | Media | P2     | XS   |

---

### LEGAL-001 — Al aceptar analítica se conceden señales publicitarias

| Campo       | Valor                                                            |
| ----------- | ---------------------------------------------------------------- |
| Severidad   | Alta                                                             |
| Prioridad   | P1                                                               |
| Confianza   | Verificado                                                       |
| Esfuerzo    | S                                                                |
| Ámbito      | Código (y producción desplegada)                                 |
| Ubicación   | `app.vue:121-143`, `nuxt.config.ts:223-232`                      |
| Referencias | Consent Mode v2 (Google), Guía AEPD sobre cookies, RGPD art. 6/7 |
| Relacionado | LEGAL-002, LEGAL-003                                             |

**Descripción.** El `watch` de `app.vue` escucha la cookie `google-analytics` y, al añadirse, hace
`gtag('consent','update',{ ad_user_data:'granted', ad_personalization:'granted', ad_storage:'granted', analytics_storage:'granted' })`.
Es decir, aceptar la categoría **analítica** concede también el uso para publicidad/personalización.
En el HTML desplegado, además, el `consent default` llegaba con `ad_user_data:"granted"` (el código actual
parte de `denied`, que es lo correcto).

**Evidencia.**

```javascript
// app.vue
gtag('consent', 'update', {
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    ad_storage: 'granted',
    analytics_storage: 'granted',
});
```

```
# Producción desplegada (bundle actual): initCommands observados
["consent","default",{ad_user_data:"granted",ad_personalization:"denied",ad_storage:"denied",analytics_storage:"denied",wait_for_update:500}]
```

**Pasos para reproducir.** 1. Abrir https://raupulus.dev con la red abierta. 2. Aceptar solo «Analítica». 3. Observar la petición a `google-analytics.com`/`googletagmanager` con `gcs=`/consent updates concediendo `ad_*`.

**Impacto.** Incumplimiento de la finalidad consentida y de la AEPD; envío de señales publicitarias sin base
jurídica. Riesgo de sanción y pérdida de confianza.

**Recomendación.** Conceder solo lo aceptado: al marcar analítica, `analytics_storage:'granted'` y el resto
`'denied'`. El default debe ser todo `denied`. Separar categorías (analítica vs publicidad) y no dar por
concedido nada que el usuario no marque.

**Verificación de la corrección.** Aceptar solo analítica y comprobar en `window.dataLayer`/DevTools que
`ad_user_data`, `ad_personalization` y `ad_storage` quedan `denied`.

---

### LEGAL-002 — No hay revocación de consentimiento ni borrado de cookies `_ga*`

| Campo       | Valor                                                  |
| ----------- | ------------------------------------------------------ |
| Severidad   | Alta                                                   |
| Prioridad   | P1                                                     |
| Confianza   | Verificado                                             |
| Esfuerzo    | M                                                      |
| Ámbito      | Código                                                 |
| Ubicación   | `app.vue:121-143`                                      |
| Referencias | Guía AEPD, RGPD art. 7.3 (retirada del consentimiento) |
| Relacionado | LEGAL-001                                              |

**Descripción.** El `watch` solo reacciona cuando `google-analytics` **se añade**. Si el usuario retira el
consentimiento, no se hace `consent update` a `denied` ni se eliminan las cookies `_ga`/`_ga_*` ya creadas.

**Evidencia.** El watcher comprueba `!previous?.includes(...) && current?.includes(...)` y no contempla el
caso contrario (`current` sin `google-analytics`).

**Impacto.** Retirada de consentimiento no efectiva; se siguen usando cookies de analítica tras revocar.

**Recomendación.** Añadir la rama de revocación: `gtag('consent','update',{all:'denied'})` y borrar
`_ga`,`_ga_*`,`_gid` de `document.cookie` (y `window.localStorage` si aplica). Documentar en `/privacy`
cómo revocar.

**Verificación de la corrección.** Aceptar, luego retirar desde el control de cookies y comprobar que no
quedan cookies `_ga*` y que el siguiente hit no se envía.

---

### LEGAL-003 — Banner: analítica premarcada y texto de «consentimiento por navegación»

| Campo       | Valor                                                        |
| ----------- | ------------------------------------------------------------ |
| Severidad   | Alta                                                         |
| Prioridad   | P1                                                           |
| Confianza   | Verificado (HTML de producción)                              |
| Esfuerzo    | S                                                            |
| Ámbito      | Producción (parcialmente corregido en código)                |
| Ubicación   | `nuxt.config.ts:284-299` (código), HTML/bundle de producción |
| Referencias | Guía AEPD (consentimiento informado, sin premarcar)          |
| Relacionado | LEGAL-001                                                    |

**Descripción.** En el HTML desplegado, `cookieControl.cookies.optional[0].isPreselected:true` (la analítica
venía marcada por defecto). Además el texto mostrado es «…Si continúa navegando, consideramos que acepta su
uso», modelo que la AEPD considera consentimiento no válido. En el código actual `isPreselected` ya es
`false`, pero el texto del banner sigue viniendo de los defaults del módulo (no se sobreescribe
`bannerDescription`).

**Evidencia.** Bundle de producción:

```json
"optional":[{"id":"google-analytics",...,"isPreselected":true}]
```

Código actual: `isPreselected: false` (`nuxt.config.ts:295`).

**Impacto.** Banner no conforme; posible nulidad del consentimiento recabado.

**Recomendación.** Mantener `isPreselected:false`; sobreescribir `localeTexts.es.bannerDescription` para
describir finalidades y la igualdad aceptar/rechazar, sin «continuar navegando». Verificar botón «Rechazar
Todas» en la primera capa y que rechazar sea tan fácil como aceptar.

**Verificación de la corrección.** Con almacenamiento limpio, inspeccionar el DOM: ningún checkbox marcado;
texto sin «continuar navegando»; botón de rechazo en la primera capa.

---

### LEGAL-004 — reCAPTCHA se carga en todas las páginas antes del consentimiento

| Campo       | Valor                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| Severidad   | Media                                                                    |
| Prioridad   | P2                                                                       |
| Confianza   | Verificado (bundle) / probable (cookies)                                 |
| Esfuerzo    | M                                                                        |
| Ámbito      | Código / producción                                                      |
| Ubicación   | `plugins/google-recaptcha.ts`, `nuxt.config.ts:125`, chunk `MS9LlKKP.js` |
| Referencias | RGPD (carga de terceros), Guía AEPD                                      |
| Relacionado | PERF-002, LEGAL-003                                                      |

**Descripción.** El plugin `vue-recaptcha-v3` es global y su código (~128 KB) entra en el bundle inicial de
**todas** las rutas. La librería precarga el script de reCAPTCHA al instalar el plugin, por lo que páginas
sin formulario (home, about, projects…) contactan con Google sin consentimiento.

**Evidencia.** El chunk `MS9LlKKP.js` (128 KB gzip) contiene 24 referencias a `reCAPTCHA`/`recaptcha` y está
en los `modulepreload` de `index.html`. Ver `05-rendimiento.md` (PERF-002).

**Impacto.** Carga de un tercero y posible establecimiento de cookies (`_GRECAPTCHA`) antes de consentir;
también penaliza CWV.

**Recomendación.** Cargar reCAPTCHA de forma diferida solo en `/contact` (plugin `client` con `lazy`, o
import dinámico dentro de `onMounted` de la página). Documentar reCAPTCHA como encargado en `/privacy`.

**Verificación de la corrección.** En home sin aceptar cookies, la pestaña de red no debe mostrar peticiones
a `recaptcha.net`/`gstatic.com`; solo en `/contact`.

---

### LEGAL-005 — Política de cookies sin tabla real

| Campo       | Valor                   |
| ----------- | ----------------------- |
| Severidad   | Media                   |
| Prioridad   | P2                      |
| Confianza   | Verificado              |
| Esfuerzo    | S                       |
| Ámbito      | Código                  |
| Ubicación   | `pages/privacy.vue`     |
| Referencias | Guía AEPD sobre cookies |
| Relacionado | LEGAL-003               |

**Descripción.** La política de cookies delega en el banner/módulo y no ofrece una tabla con nombre,
proveedor, finalidad y duración de cada cookie (`_ga`, `_ga_*`, `_GRECAPTCHA`, `ncc_c`, `ncc_e`, cookies de
sesión de la API).

**Recomendación.** Añadir tabla estática a `/privacy` con las cookies reales y su caducidad, y enlazarla desde
el banner.

**Verificación de la corrección.** Revisar `/privacy`: tabla con columnas Nombre/Proveedor/Finalidad/Duración.

---

### LEGAL-006 — Sin aviso legal (LSSI art. 10) ni declaración de accesibilidad

| Campo       | Valor                       |
| ----------- | --------------------------- |
| Severidad   | Baja                        |
| Prioridad   | P3                          |
| Confianza   | Verificado                  |
| Esfuerzo    | S                           |
| Ámbito      | Código                      |
| Ubicación   | `pages/` (no existe)        |
| Referencias | LSSI-CE art. 10, EN 301 549 |

**Descripción.** No hay página de aviso legal/identificación del titular ni declaración de accesibilidad.
En un portfolio profesional es buena práctica y ayuda a E-E-A-T.

**Recomendación.** Añadir `/legal` (o sección en `/privacy`) con titular y datos de contacto, y una breve
declaración de accesibilidad.

**Verificación de la corrección.** Existencia de la página y enlace desde el footer.

---

### LEGAL-007 — Información RGPD art. 13 junto al formulario, mejorable

| Campo       | Valor                       |
| ----------- | --------------------------- |
| Severidad   | Baja                        |
| Prioridad   | P3                          |
| Confianza   | Verificado                  |
| Esfuerzo    | S                           |
| Ámbito      | Código                      |
| Ubicación   | `pages/contact.vue:615-640` |
| Referencias | RGPD art. 13                |

**Descripción.** El formulario incluye un checkbox no premarcado con enlace a `/privacy` (correcto en lo
esencial), pero no resume junto al campo la finalidad, base jurídica, destinatarios y derechos (información
básica de la capa 1). La casilla también incluye «Acepto recibir correos electrónicos», que mezcla dos
consentimientos.

**Recomendación.** Añadir un bloque breve de información básica bajo el formulario y separar el consentimiento
de privacidad del de comunicaciones.

**Verificación de la corrección.** Inspección visual de `/contact`.

---

### LEGAL-008 — `gtag` habilitado con `id` vacío

| Campo       | Valor                                          |
| ----------- | ---------------------------------------------- |
| Severidad   | Media                                          |
| Prioridad   | P2                                             |
| Confianza   | Verificado                                     |
| Esfuerzo    | XS                                             |
| Ámbito      | Ambos                                          |
| Ubicación   | `nuxt.config.ts:219-233`, bundle de producción |
| Referencias | nuxt-gtag                                      |
| Relacionado | PERF-002                                       |

**Descripción.** `gtag.enabled` se activa en `NODE_ENV === 'production'`, pero `id` procede de `GTAG_ID`, que
en el despliegue estaba **vacío** (`gtag:{enabled:true,id:""}`). Se carga `gtag.js` sin medición: coste de
tercero sin beneficio y datos incoherentes.

**Recomendación.** No habilitar gtag si `GTAG_ID` está vacío (`enabled: !!process.env.GTAG_ID && …`); o
inyectar el ID real en build.

**Verificación de la corrección.** Si `GTAG_ID` está vacío, no debe aparecer ninguna petición a
`googletagmanager.com`.

---

## Verificado y correcto

- Consent Mode **default** en el código actual parte de todo `denied` (`nuxt.config.ts:225-231`).
- `isPreselected` de la analítica está corregido a `false` en el código actual.
- La cookie de consentimiento usa `sameSite:'strict'` y hay expiración de 1 año.
- El formulario no envía el mensaje a producción en las pruebas (solo lectura respetada).
- Los enlaces de la política de privacidad están presentes en footer y formulario.
