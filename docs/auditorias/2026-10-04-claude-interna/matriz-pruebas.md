# Matriz de pruebas

> Build B (`http://localhost:3020`, datos del backend local), 2026-10-04. **C** = Chromium, **W** = WebKit (Playwright
> 1.63). Firefox no disponible (ver [06-responsive-compatibilidad.md](06-responsive-compatibilidad.md)). Datos
> completos en `evidencias/matriz-responsive.json` (300 registros: consola, red, desbordamiento y SEO del DOM).

## Responsive: ruta × viewport × motor

Criterio de ✅: estado HTTP esperado, sin scroll horizontal, sin errores de navegación ni `pageerror`. Los problemas
globales que afectan a todas las celdas móviles o a todas las rutas no se repiten en cada celda: banner de cookies que
ocupa ~45 % del viewport en móvil (RESP-003) y error de consola de reCAPTCHA (BUG-010).

| Ruta / viewport                          | 320x568                        | 360x800                        | 375x667                        | 390x844                        | 412x915                        | 430x932                        | 768x1024     | 820x1180     | 1024x1366    | 1024x768     | 1280x800     | 1366x768     | 1440x900     | 1920x1080    | 2560x1440    |
| ---------------------------------------- | ------------------------------ | ------------------------------ | ------------------------------ | ------------------------------ | ------------------------------ | ------------------------------ | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
| `/`                                      | C ❌ RESP-002<br>W ❌ RESP-002 | C ❌ RESP-002<br>W ❌ RESP-002 | C ❌ RESP-002<br>W ❌ RESP-002 | C ❌ RESP-002<br>W ❌ RESP-002 | C ❌ RESP-002<br>W ❌ RESP-002 | C ❌ RESP-002<br>W ❌ RESP-002 | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/projects`                              | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/projects/weather-station-raspberry-pi` | C ❌ RESP-001<br>W ❌ RESP-001 | C ❌ RESP-001<br>W ❌ RESP-001 | C ❌ RESP-001<br>W ❌ RESP-001 | C ❌ RESP-001<br>W ❌ RESP-001 | C ❌ RESP-001<br>W ❌ RESP-001 | C ❌ RESP-001<br>W ❌ RESP-001 | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/about`                                 | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/webs`                                  | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/social`                                | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/contact`                               | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/privacy`                               | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/blog`                                  | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |
| `/no-existe`                             | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅                   | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ | C ✅<br>W ✅ |

`/no-existe` responde 404 en el build local (correcto); en producción responde 200 (SEO-004).

## Escenarios funcionales (Chromium 1280×800 salvo indicación)

| Escenario                                                                  | Resultado                                                | Hallazgo  |
| -------------------------------------------------------------------------- | -------------------------------------------------------- | --------- |
| Terceros y cookies antes del consentimiento (`/`, `/contact`, `/projects`) | ❌ GA y reCAPTCHA cargados; pings `g/collect`            | LEGAL-002 |
| Texto y botones del banner de cookies                                      | ❌ Consentimiento implícito; sin «Rechazar»              | LEGAL-001 |
| Aceptar todas → Consent Mode                                               | ❌ Concede señales `ad_*`                                | LEGAL-003 |
| Revocar consentimiento                                                     | ❌ No hay `update` a `denied`; quedan `_ga`              | LEGAL-003 |
| Abrir proyecto desde el listado                                            | ✅ Modal con título y metadatos del proyecto             |           |
| Tab dentro del modal                                                       | ❌ El foco sale al footer                                | A11Y-003  |
| Botón atrás con el modal abierto                                           | ❌ URL cambia; modal abierto; scroll bloqueado           | BUG-003   |
| Esc con el modal abierto                                                   | ❌ Cierra, pero URL y título no se restauran             | BUG-003   |
| Navegar a `/about` tras abrir un proyecto                                  | ✅ Metadatos de `/about` correctos                       |           |
| Deep link `/projects/weather-station-raspberry-pi`                         | ✅ Abre el modal con 11 bloques                          |           |
| `/projects/proyecto-inexistente-xyz`                                       | ⚠️ 404 del servidor local; en cliente, listado sin aviso | BUG-005   |
| Cerrar el modal con la «X» en 390×844                                      | ❌ El header tapa el botón                               | RESP-001  |
| Tab por `/projects` (15 tarjetas)                                          | ❌ Ninguna tarjeta ni filtro recibe el foco              | A11Y-002  |
| Primer Tab en móvil                                                        | ⚠️ Logo (sin enlace «saltar al contenido»)               | A11Y-008  |
| Menú móvil + Esc                                                           | ❌ No se cierra                                          | A11Y-008  |

## Accesibilidad automática (axe-core, Chromium)

| Ruta / estado                  | 1280×800                                                         | 390×844                           |
| ------------------------------ | ---------------------------------------------------------------- | --------------------------------- |
| `/`                            | color-contrast (4)                                               | color-contrast (4)                |
| `/projects`                    | color-contrast (4), heading-order                                | color-contrast (4), heading-order |
| `/about`                       | color-contrast (4), heading-order                                | color-contrast (4), heading-order |
| `/webs`                        | color-contrast (4)                                               | color-contrast (4)                |
| `/social`                      | color-contrast (4), heading-order                                | color-contrast (4), heading-order |
| `/contact`                     | color-contrast (4), aria-input-field-name, heading-order, region | ídem                              |
| `/privacy`                     | color-contrast (4)                                               | color-contrast (4)                |
| `/blog`                        | color-contrast (22)                                              | color-contrast (22)               |
| Menú móvil abierto             | —                                                                | color-contrast (4)                |
| Modal de proyecto abierto      | heading-order, scrollable-region-focusable                       | —                                 |
| Formulario con errores         | color-contrast, aria-input-field-name, heading-order, region     | —                                 |
| Modal de confirmación de envío | color-contrast, aria-input-field-name, heading-order, region     | —                                 |
| Galería abierta                | ⚠️ No ejecutado (selector ambiguo en el script)                  | —                                 |

## Producción (Chromium, pasivo)

| Ruta                                      | Estado HTTP | Errores de consola                             | Observación                        |
| ----------------------------------------- | ----------- | ---------------------------------------------- | ---------------------------------- |
| `/`                                       | 200         | CORS `api.fryntiz.dev`, `requestStorageAccess` | Sin datos de plataforma (BUG-001)  |
| `/projects/`                              | 200         | CORS ×2, `TypeError: Failed to fetch`          | **Listado vacío** (BUG-001)        |
| `/projects/weather-station-raspberry-pi/` | 200         | CORS ×3, `TypeError` ×2                        | Copia de `/projects` (SEO-001)     |
| `/about/`                                 | 200         | CORS                                           | Enlace al CV → 410 (BUG-001)       |
| `/contact/`                               | 200         | CORS                                           | Aviso «fuera de servicio» (UX-002) |
| `/no-existe-auditoria/`                   | **200**     | CORS                                           | Muestra la home (SEO-004)          |

## Rendimiento

Ver la tabla de Lighthouse en [05-rendimiento.md](05-rendimiento.md).
