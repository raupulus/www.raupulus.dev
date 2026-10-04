# Matriz de pruebas (rutas × viewports × motores) — Auditoría externa deepsek-externo

> Limitación: no se ejecutó la matriz automática con navegadores (Playwright no instalado en el proyecto y la
> sesión se restringió al directorio del repositorio). Se realizaron pruebas reales con **Lighthouse** en dos
> viewports (móvil 412×823 y escritorio) sobre las 6 plantillas de producción y 2 del build local. Las celdas
> sin ejecución se marcan `⚠️ NV` (no verificado).

Leyenda: `OK` sin incidencia detectada · `❌ <ID>` hallazgo · `⚠️ NV` no verificado.

## Producción (Lighthouse: móvil 412 px / escritorio)

| Ruta                                     | Móvil 412                      | Escritorio    | Observaciones                          |
| ---------------------------------------- | ------------------------------ | ------------- | -------------------------------------- |
| `/`                                      | ❌ BUG-001, PERF-003, A11Y-002 | ❌ A11Y-002   | Errores CORS, LCP 8,4 s, contraste     |
| `/projects`                              | ❌ BUG-001, SEO-001, A11Y-005  | ❌ SEO-001    | Sin listado estático, imágenes sin alt |
| `/projects/weather-station-raspberry-pi` | ❌ BUG-001, A11Y-005           | ❌ A11Y-005   | CORS + image-alt                       |
| `/about`                                 | ❌ PERF-003, A11Y-005          | ❌ A11Y-004   | CLS 0,341 en escritorio                |
| `/contact`                               | ❌ BUG-001, A11Y-003           | ❌ A11Y-003   | aria-input-field-name                  |
| `/blog`                                  | ❌ PERF-003                    | OK (Perf 100) | —                                      |

## Build local (serve sin fallback SPA)

| Ruta               | Móvil 412             | Escritorio  | Observaciones                          |
| ------------------ | --------------------- | ----------- | -------------------------------------- |
| `/`                | ❌ A11Y-002           | ❌ A11Y-002 | Perf 93/100; sin errores de consola    |
| `/contact`         | ❌ A11Y-003, A11Y-004 | ❌ A11Y-003 | Perf 86/100; aria-input, heading-order |
| 404 (`/no-existe`) | OK (404 real)         | OK          | `serve` devuelve 404                   |

## Matriz completa de viewports y motores (pendiente)

Viewports objetivo: 320×568, 360×800, 375×667, 390×844, 412×915, 430×932, 768×1024, 820×1180, 1024×1366,
1280×800, 1366×768, 1440×900, 1920×1080, 2560×1440.
Motores objetivo: Chromium, WebKit, Firefox.

| Ruta        | 320   | 360   | 375   | 390   | 412                      | 430   | 768   | 820   | 1024  | 1280  | 1366  | 1440  | 1920  | 2560  |
| ----------- | ----- | ----- | ----- | ----- | ------------------------ | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| `/`         | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ❌ A11Y-002 (Lighthouse) | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV |
| `/projects` | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ❌ SEO-001 (Lighthouse)  | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV |
| `/about`    | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ❌ A11Y-005              | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV |
| `/contact`  | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ❌ A11Y-003              | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV |
| `/webs`     | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV                    | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV |
| `/social`   | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV                    | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV | ⚠️ NV |

Los motores WebKit y Firefox no se probaron (`⚠️ NV`). Recomendación: automatizar en CI con Playwright
(detección de `scrollWidth > clientWidth`, elementos fuera de pantalla, errores de consola y peticiones 4xx/5xx).
