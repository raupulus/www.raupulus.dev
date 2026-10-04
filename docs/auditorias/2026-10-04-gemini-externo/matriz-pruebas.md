# Matriz de Pruebas: Rutas × Viewports × Motores de Renderizado

Este documento registra los resultados de las comprobaciones funcionales, visuales y de renderizado sobre la muestra representativa de rutas del portfolio **www.raupulus.dev**, cruzadas con la matriz completa de resoluciones (viewports en píxeles CSS) y motores de navegación.

## Leyenda de Estados

- **OK**: Renderizado correcto, sin desbordamiento horizontal, interactivo y tipografía adecuada.
- **[ID]**: Se detectó una anomalía o defecto registrado en la auditoría con dicho identificador.

---

## 1. Matriz de Dispositivos Móviles y Teléfonos

| Ruta                          | Motor    | 320×568 (iPhone SE 1)    | 360×800 (Galaxy S20)     | 375×667 (iPhone 8)       | 390×844 (iPhone 13/14)   | 412×915 (Pixel 7)        | 430×932 (iPhone 15 Pro Max) |
| ----------------------------- | -------- | ------------------------ | ------------------------ | ------------------------ | ------------------------ | ------------------------ | --------------------------- |
| **`/` (Home)**                | Chromium | RESP-001                 | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/` (Home)**                | WebKit   | RESP-001, RESP-002       | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                    |
| **`/` (Home)**                | Gecko    | RESP-001                 | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/projects`**               | Chromium | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/projects`**               | WebKit   | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                    |
| **`/projects`**               | Gecko    | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/projects/:slug` (Modal)** | Chromium | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003          |
| **`/projects/:slug` (Modal)** | WebKit   | RESP-002, RESP-003       | RESP-002, RESP-003       | RESP-002, RESP-003       | RESP-002, RESP-003       | RESP-002, RESP-003       | RESP-002, RESP-003          |
| **`/projects/:slug` (Modal)** | Gecko    | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003       | RESP-003, A11Y-003          |
| **`/about`**                  | Chromium | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/about`**                  | WebKit   | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                    |
| **`/about`**                  | Gecko    | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/webs`**                   | Chromium | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/webs`**                   | WebKit   | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                    |
| **`/webs`**                   | Gecko    | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/social`**                 | Chromium | UX-003                   | UX-003                   | UX-003                   | UX-003                   | UX-003                   | UX-003                      |
| **`/social`**                 | WebKit   | UX-003, RESP-002         | UX-003, RESP-002         | UX-003, RESP-002         | UX-003, RESP-002         | UX-003, RESP-002         | UX-003, RESP-002            |
| **`/social`**                 | Gecko    | UX-003                   | UX-003                   | UX-003                   | UX-003                   | UX-003                   | UX-003                      |
| **`/contact`**                | Chromium | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002              |
| **`/contact`**                | WebKit   | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002    |
| **`/contact`**                | Gecko    | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002              |
| **`/privacy`**                | Chromium | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/privacy`**                | WebKit   | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                 | RESP-002                    |
| **`/privacy`**                | Gecko    | OK                       | OK                       | OK                       | OK                       | OK                       | OK                          |
| **`/blog`**                   | Chromium | SEO-003                  | SEO-003                  | SEO-003                  | SEO-003                  | SEO-003                  | SEO-003                     |
| **`/blog`**                   | WebKit   | SEO-003, RESP-002        | SEO-003, RESP-002        | SEO-003, RESP-002        | SEO-003, RESP-002        | SEO-003, RESP-002        | SEO-003, RESP-002           |
| **`/blog`**                   | Gecko    | SEO-003                  | SEO-003                  | SEO-003                  | SEO-003                  | SEO-003                  | SEO-003                     |
| **`/404-error`**              | Chromium | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                     |
| **`/404-error`**              | WebKit   | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                     |
| **`/404-error`**              | Gecko    | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                  | BUG-002                     |

---

## 2. Matriz de Tabletas y Dispositivos Medios

| Ruta                          | Motor    | 768×1024 Portrait (iPad) | 1024×768 Landscape (iPad) | 820×1180 Portrait (iPad Air) | 1180×820 Landscape (iPad Air) | 1024×1366 Portrait (iPad Pro) | 1366×1024 Landscape (iPad Pro) |
| ----------------------------- | -------- | ------------------------ | ------------------------- | ---------------------------- | ----------------------------- | ----------------------------- | ------------------------------ |
| **`/` (Home)**                | Chromium | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/` (Home)**                | WebKit   | RESP-002                 | RESP-002                  | RESP-002                     | RESP-002                      | RESP-002                      | RESP-002                       |
| **`/` (Home)**                | Gecko    | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/projects`**               | Chromium | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/projects`**               | WebKit   | RESP-002                 | RESP-002                  | RESP-002                     | RESP-002                      | RESP-002                      | RESP-002                       |
| **`/projects`**               | Gecko    | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/projects/:slug` (Modal)** | Chromium | A11Y-003                 | A11Y-003                  | A11Y-003                     | A11Y-003                      | A11Y-003                      | A11Y-003                       |
| **`/projects/:slug` (Modal)** | WebKit   | RESP-002, A11Y-003       | RESP-002, A11Y-003        | RESP-002, A11Y-003           | RESP-002, A11Y-003            | RESP-002, A11Y-003            | RESP-002, A11Y-003             |
| **`/projects/:slug` (Modal)** | Gecko    | A11Y-003                 | A11Y-003                  | A11Y-003                     | A11Y-003                      | A11Y-003                      | A11Y-003                       |
| **`/about`**                  | Chromium | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/about`**                  | WebKit   | RESP-002                 | RESP-002                  | RESP-002                     | RESP-002                      | RESP-002                      | RESP-002                       |
| **`/about`**                  | Gecko    | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/webs`**                   | Chromium | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/webs`**                   | WebKit   | RESP-002                 | RESP-002                  | RESP-002                     | RESP-002                      | RESP-002                      | RESP-002                       |
| **`/webs`**                   | Gecko    | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/social`**                 | Chromium | UX-003                   | UX-003                    | UX-003                       | UX-003                        | UX-003                        | UX-003                         |
| **`/social`**                 | WebKit   | UX-003, RESP-002         | UX-003, RESP-002          | UX-003, RESP-002             | UX-003, RESP-002              | UX-003, RESP-002              | UX-003, RESP-002               |
| **`/social`**                 | Gecko    | UX-003                   | UX-003                    | UX-003                       | UX-003                        | UX-003                        | UX-003                         |
| **`/contact`**                | Chromium | UX-001, UX-002           | UX-001, UX-002            | UX-001, UX-002               | UX-001, UX-002                | UX-001, UX-002                | UX-001, UX-002                 |
| **`/contact`**                | WebKit   | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002  | UX-001, UX-002, RESP-002     | UX-001, UX-002, RESP-002      | UX-001, UX-002, RESP-002      | UX-001, UX-002, RESP-002       |
| **`/contact`**                | Gecko    | UX-001, UX-002           | UX-001, UX-002            | UX-001, UX-002               | UX-001, UX-002                | UX-001, UX-002                | UX-001, UX-002                 |
| **`/privacy`**                | Chromium | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/privacy`**                | WebKit   | RESP-002                 | RESP-002                  | RESP-002                     | RESP-002                      | RESP-002                      | RESP-002                       |
| **`/privacy`**                | Gecko    | OK                       | OK                        | OK                           | OK                            | OK                            | OK                             |
| **`/blog`**                   | Chromium | SEO-003                  | SEO-003                   | SEO-003                      | SEO-003                       | SEO-003                       | SEO-003                        |
| **`/blog`**                   | WebKit   | SEO-003, RESP-002        | SEO-003, RESP-002         | SEO-003, RESP-002            | SEO-003, RESP-002             | SEO-003, RESP-002             | SEO-003, RESP-002              |
| **`/blog`**                   | Gecko    | SEO-003                  | SEO-003                   | SEO-003                      | SEO-003                       | SEO-003                       | SEO-003                        |
| **`/404-error`**              | Chromium | BUG-002                  | BUG-002                   | BUG-002                      | BUG-002                       | BUG-002                       | BUG-002                        |
| **`/404-error`**              | WebKit   | BUG-002                  | BUG-002                   | BUG-002                      | BUG-002                       | BUG-002                       | BUG-002                        |
| **`/404-error`**              | Gecko    | BUG-002                  | BUG-002                   | BUG-002                      | BUG-002                       | BUG-002                       | BUG-002                        |

---

## 3. Matriz de Escritorio y Grandes Pantallas

| Ruta                          | Motor    | 1280×800 (Laptop)        | 1366×768 (HD Laptop)     | 1440×900 (MacBook Pro 14") | 1920×1080 (FHD Monitor)  | 2560×1440 (QHD / 2K)     |
| ----------------------------- | -------- | ------------------------ | ------------------------ | -------------------------- | ------------------------ | ------------------------ |
| **`/` (Home)**                | Chromium | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/` (Home)**                | WebKit   | RESP-002                 | RESP-002                 | RESP-002                   | RESP-002                 | RESP-002                 |
| **`/` (Home)**                | Gecko    | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/projects`**               | Chromium | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/projects`**               | WebKit   | RESP-002                 | RESP-002                 | RESP-002                   | RESP-002                 | RESP-002                 |
| **`/projects`**               | Gecko    | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/projects/:slug` (Modal)** | Chromium | A11Y-003                 | A11Y-003                 | A11Y-003                   | A11Y-003                 | A11Y-003                 |
| **`/projects/:slug` (Modal)** | WebKit   | RESP-002, A11Y-003       | RESP-002, A11Y-003       | RESP-002, A11Y-003         | RESP-002, A11Y-003       | RESP-002, A11Y-003       |
| **`/projects/:slug` (Modal)** | Gecko    | A11Y-003                 | A11Y-003                 | A11Y-003                   | A11Y-003                 | A11Y-003                 |
| **`/about`**                  | Chromium | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/about`**                  | WebKit   | RESP-002                 | RESP-002                 | RESP-002                   | RESP-002                 | RESP-002                 |
| **`/about`**                  | Gecko    | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/webs`**                   | Chromium | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/webs`**                   | WebKit   | RESP-002                 | RESP-002                 | RESP-002                   | RESP-002                 | RESP-002                 |
| **`/webs`**                   | Gecko    | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/social`**                 | Chromium | UX-003                   | UX-003                   | UX-003                     | UX-003                   | UX-003                   |
| **`/social`**                 | WebKit   | UX-003, RESP-002         | UX-003, RESP-002         | UX-003, RESP-002           | UX-003, RESP-002         | UX-003, RESP-002         |
| **`/social`**                 | Gecko    | UX-003                   | UX-003                   | UX-003                     | UX-003                   | UX-003                   |
| **`/contact`**                | Chromium | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002             | UX-001, UX-002           | UX-001, UX-002           |
| **`/contact`**                | WebKit   | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002   | UX-001, UX-002, RESP-002 | UX-001, UX-002, RESP-002 |
| **`/contact`**                | Gecko    | UX-001, UX-002           | UX-001, UX-002           | UX-001, UX-002             | UX-001, UX-002           | UX-001, UX-002           |
| **`/privacy`**                | Chromium | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/privacy`**                | WebKit   | RESP-002                 | RESP-002                 | RESP-002                   | RESP-002                 | RESP-002                 |
| **`/privacy`**                | Gecko    | OK                       | OK                       | OK                         | OK                       | OK                       |
| **`/blog`**                   | Chromium | SEO-003                  | SEO-003                  | SEO-003                    | SEO-003                  | SEO-003                  |
| **`/blog`**                   | WebKit   | SEO-003, RESP-002        | SEO-003, RESP-002        | SEO-003, RESP-002          | SEO-003, RESP-002        | SEO-003, RESP-002        |
| **`/blog`**                   | Gecko    | SEO-003                  | SEO-003                  | SEO-003                    | SEO-003                  | SEO-003                  |
| **`/404-error`**              | Chromium | BUG-002                  | BUG-002                  | BUG-002                    | BUG-002                  | BUG-002                  |
| **`/404-error`**              | WebKit   | BUG-002                  | BUG-002                  | BUG-002                    | BUG-002                  | BUG-002                  |
| **`/404-error`**              | Gecko    | BUG-002                  | BUG-002                  | BUG-002                    | BUG-002                  | BUG-002                  |
