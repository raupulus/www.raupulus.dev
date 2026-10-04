# Auditoría externa (ciega) — www.raupulus.dev

**Modo:** `externo` · **Auditor:** `deepsek-externo` · **Fecha:** 2026-10-04

## 1. Ficha

| Campo                 | Valor                                                                               |
| --------------------- | ----------------------------------------------------------------------------------- |
| Fecha                 | 2026-10-04                                                                          |
| Auditor               | deepsek-externo                                                                     |
| Modo                  | externo (ciega, sin leer auditorías previas)                                        |
| Commit auditado       | `05acdf145484a640a2df12ed39a94a236e6ab0ae` (rama `dev`)                             |
| Cambios sin commitear | 51 entradas (`git status --porcelain`) — se audita el árbol de trabajo              |
| URL auditada          | https://raupulus.dev                                                                |
| API pública observada | https://api.raupulus.dev (producción usa además api.fryntiz.dev, roto)              |
| Herramientas          | pnpm 12.9.1, Node v26.10.0, Lighthouse 13.5, curl/dig/openssl, axe (vía Lighthouse) |
| Build local           | `pnpm run generate` → 212 rutas, servido con `serve@14` en :4173                    |

## 2. Resumen ejecutivo

El sitio estático se ve bien y su home carga contenido en el HTML, pero **producción está funcionando a
medias**: el listado de proyectos se carga en el navegador contra una API antigua (`api.fryntiz.dev/api/v1`)
que está bloqueada por CORS y eliminada (410), así que los datos no aparecen y la consola acumula errores.
Todo el tráfico de rutas inexistentes devuelve «200 con la portada» (soft-404) porque un `.htaccess` fuerza
el fallback SPA, lo que además de ocultar los 404 perjudica el SEO. Las cabeceras de seguridad que están
escritas en `apache.conf` no llegan a producción y HSTS está desactivado (`max-age=0`).

En legal, el consentimiento de cookies no es correcto: aceptar «analítica» concede señales publicitarias y no
se puede revocar. En rendimiento, el JS inicial supera el presupuesto (≈155 KB gzip) y reCAPTCHA se carga en
todas las páginas; en móvil, el LCP ronda los 8 s por latencia de respuesta. En accesibilidad hay fallos de
contraste, un campo del formulario sin nombre accesible y textos alternativos ausentes en producción. La
documentación y el CI usan npm mientras el repositorio es pnpm, y el pipeline puede desplegar sin el
artefacto correcto o dar por bueno un despliegue fallido.

La sensación general es de un proyecto con buen diseño y estructura, pero con **el despliegue y la
configuración de producción desalineados respecto al código actual**, que ya corrige parte de estos
problemas (canonical, `<main>`, `isPreselected:false`).

## 3. Scorecard

| Área              | Peso | Nota | Justificación breve                                                          |
| ----------------- | ---- | ---- | ---------------------------------------------------------------------------- |
| Seguridad         | 15   | 6/10 | Sin CSP/HSTS en producción y soft-404; DOMPurify/iframes permisivos          |
| Bugs/robustez     | 15   | 4/10 | API cliente rota (P0), catch-all sin 404, build no falla si la API cae       |
| SEO               | 15   | 6/10 | Listado no indexable, /blog en sitemap con noindex, sin JSON-LD por proyecto |
| Rendimiento       | 15   | 4/10 | LCP móvil ~8 s, JS 155 KB gzip, reCAPTCHA global, HTML cacheado 1 mes        |
| Responsive        | 10   | 6/10 | Matriz no ejecutada; riesgo de desbordes no reproducido                      |
| Accesibilidad     | 10   | 4/10 | Contraste, campo sin nombre, sin main/alt en producción, sin skip link       |
| Privacidad/legal  | 8    | 4/10 | Consent Mode mal concedido, sin revocación, banner premarcado en producción  |
| UX/contenido      | 5    | 6/10 | Banners de mantenimiento, búsqueda no en URL, erratas                        |
| Dependencias      | 3    | 5/10 | Incoherencia npm/pnpm, audit con crítica y 47 altas, coverage roto           |
| Calidad de código | 2    | 6/10 | Puertas verdes, pero docs desincronizados y cobertura sin medir              |
| Infra/CI-CD       | 2    | 3/10 | .htaccess vs apache.conf, deploy no atómico, CI npm/pnpm, sin purga caché    |

**Nota global ponderada: 5,0 / 10.**

## 4. Métricas clave

**Lighthouse (1 ejecución; ver `evidencias/lighthouse/`).**

| Plantilla | Perf móvil | Perf escritorio | A11y móvil | BP  | SEO | LCP móvil | CLS (peor) |
| --------- | ---------- | --------------- | ---------- | --- | --- | --------- | ---------- |
| Home      | 57         | 99              | 92         | 96  | 100 | 8,43 s    | 0,057      |
| Projects  | 58         | 100             | 80         | 96  | 92  | 7,78 s    | 0,050      |
| Proyecto  | 89         | 100             | 80         | 96  | 92  | 3,06 s    | 0,050      |
| About     | 58         | 83              | 77         | 96  | 92  | 8,15 s    | 0,341      |
| Contact   | 53         | 100             | 88         | 96  | 100 | 8,63 s    | 0,127      |
| Blog      | 47         | 100             | 89         | 96  | 100 | 7,73 s    | 0,225      |

- **Core Web Vitals:** sin datos de campo (CrUX) disponibles; laboratorio móvil LCP 7,7–8,6 s (objetivo ≤ 2,0 s).
- **axe/Lighthouse:** 0 violaciones `critical`, pero fallos `serious`/score 0 en `color-contrast`,
  `landmark-one-main`, `image-alt` y `aria-input-field-name`.
- **Cabeceras/TLS:** certificado válido y HTTP/3; **sin CSP** y HSTS `max-age=0`; TLS no evaluado en SSL Labs.
- **Vulnerabilidades:** `pnpm audit` → 1 crítica, 47 altas, 24 medias, 6 bajas (mayoría build/dev).
- **Enlaces rotos:** no ejecutado con link checker (⚠️); iconos del manifest sí 404 (BUG-007).
- **Errores de consola:** presentes en **todas** las páginas de producción (BUG-001).

## 5. Cumplimiento de umbrales (sección 10)

| Umbral                                                         | Objetivo                 | Resultado                                  | ¿Cumple? |
| -------------------------------------------------------------- | ------------------------ | ------------------------------------------ | -------- |
| Lighthouse móvil Perf/A11y/BP/SEO                              | ≥95/100/100/100          | 47–93 / 77–92 / 96 / 92–100                | No       |
| Lighthouse escritorio                                          | ≥98/100/100/100          | 83–100 / 80–92 / 96 / 92–100               | No       |
| CWV p75 LCP/INP/CLS                                            | ≤2,0 s / ≤200 ms / ≤0,05 | LCP 7,7–8,6 s (lab)                        | No       |
| TTFB/FCP                                                       | ≤0,6 s / ≤1,5 s          | FCP móvil ~7,8 s                           | No       |
| JS inicial / peso total (home)                                 | ≤120 KB / ≤1 MB          | ~155 KB gzip                               | No       |
| axe / WCAG 2.2                                                 | 0 viol. / AA completo    | fallos serious y AA incompleto             | No       |
| Mozilla HTTP Observatory / SSL Labs                            | ≥A / A+                  | no ejecutado / no ejecutado                | ⚠️       |
| Secretos / vulns altas con exposición real                     | 0 / 0                    | 0 secretos / algunas altas de exposición   | Parcial  |
| URLs del sitemap 200 + canonical + indexables                  | 100 %                    | 200 sí (soft-404), canonical en prod no    | No       |
| 404 reales / enlaces rotos / JSON-LD / duplicados              | Sí / 0 / 0 / 0           | 404 reales no / manifest 404 / sin JSON-LD | No       |
| Errores consola / peticiones fallidas / hydration / scroll 320 | 0 / 0 / 0 / 0            | errores consola en prod                    | No       |
| Lint / vue-tsc / tests                                         | 0 / 0 / 0                | 0 / 0 / 0                                  | Sí       |

## 6. Recuento de hallazgos

**Total: 85** — Altas 24 · Medias 38 · Bajas 23 · Críticas 0 · Informativas 0.

| Área              | Nº  | IDs                  |
| ----------------- | --- | -------------------- |
| Seguridad         | 7   | SEC-001…007          |
| Privacidad/legal  | 8   | LEGAL-001…008        |
| Bugs/robustez     | 12  | BUG-001…012          |
| SEO               | 11  | SEO-001…011          |
| Rendimiento       | 8   | PERF-001…008         |
| Responsive        | 1   | RESP-002             |
| UX/contenido      | 6   | UX-001…005, CONT-001 |
| Accesibilidad     | 11  | A11Y-001…011         |
| Dependencias      | 7   | DEP-001…007          |
| Calidad de código | 7   | CODE-001…007         |
| Infra/CI-CD       | 7   | INFRA-001…007        |

## 7. Top 10 riesgos

1. **BUG-001** — API cliente de producción rota (CORS + v1 eliminada): sin datos, errores en todas las páginas.
2. **SEC-002 / INFRA-001** — Soft-404 universal por `.htaccess`; no hay 404 reales.
3. **PERF-003** — LCP móvil ~8 s (latencia/TTFB de producción).
4. **PERF-001 / PERF-002** — JS inicial ~155 KB y reCAPTCHA en todas las páginas.
5. **LEGAL-001 / LEGAL-002 / LEGAL-003** — Consentimiento no conforme (conceder ad_* y sin revocación).
6. **BUG-004 / BUG-002** — Catch-all sin 404 y `404.html` vacío.
7. **SEO-001** — `/projects` no indexable (listado solo en cliente).
8. **SEC-001** — Sin CSP ni cabeceras de seguridad; HSTS desactivado.
9. **A11Y-002 / A11Y-003 / A11Y-005** — Contraste, nombre accesible y alt.
10. **DEP-001 / INFRA-004 / INFRA-002** — Gestor incoherente y pipeline de despliegue frágil.

## 8. Quick wins (XS/S, alto impacto)

- Publicar `security.txt` y arreglar manifest/favicons (`SEC-005`, `BUG-007`, `SEO-009`).
- Excluir `/blog` del sitemap (`SEO-002`) y mover `useHead` a `setup` (`BUG-005`).
- Añadir `aria-label`/`aria-labelledby` al campo de mensaje y enlace «saltar al contenido» (`A11Y-003`, `A11Y-006`).
- No cargar `gtag` sin ID y no enviar `Content-Type` en GET (`LEGAL-008`, `PERF-007`).
- Cachear HTML corto y `/_nuxt/` immutable (`PERF-004`).
- Fijar Node y añadir `@vitest/coverage-v8` (`DEP-006`, `DEP-003`).
- Corregir rutas de iconos del manifest y `theme_color` (`BUG-007`, `SEO-009`).

## 9. Alcance, metodología y limitaciones

**Alcance:** completo (áreas 6.1–6.11). **Metodología:** triple contraste (código + build + ejecución),
Lighthouse 1×/URL y estrategia, PoC local de sanitización, análisis pasivo de producción (≤1 req/s) y de DNS/TLS.

**No se pudo verificar (limitaciones):**

- Responsive: matriz de viewports × motores (Playwright) no ejecutada (RESP-001).
- Accesibilidad manual: teclado completo, VoiceOver/NVDA, zoom 200/400 %, reflow, text-spacing.
- Formulario: no se envió en producción (prohibido); el CSRF se evaluó por inspección (BUG-003, confianza probable).
- Simulación de fallos de red (500/timeout/JSON malformado) no ejecutada con interceptación.
- `nuxi analyze`, `knip`/`depcheck`, `license-checker`, validación W3C y link checker no ejecutados.
- Mozilla HTTP Observatory / SSL Labs no ejecutados.
- Datos de campo CrUX no disponibles.
- Build desde clon limpio no ejecutado (solo build local con `node_modules` existente).
- No se ejecutó Lighthouse 3× con mediana (1× por tiempo).

## 10. Estructura del informe

`README.md` · `01-seguridad.md` … `11-infraestructura-cicd.md` · `recomendaciones-api.md` ·
`cobertura.md` · `matriz-pruebas.md` · `plan-remediacion.md` · `hallazgos.json` · `evidencias/`
(`build/`, `lighthouse/`, `dependencias/`, `cabeceras/`, `capturas/`, `entorno.txt`, `scripts.md`).
