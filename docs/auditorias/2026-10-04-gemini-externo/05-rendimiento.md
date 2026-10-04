# Auditoría de Rendimiento y Core Web Vitals

Este documento analiza el rendimiento de carga y ejecución de **www.raupulus.dev**, evaluando los tiempos de respuesta, Core Web Vitals (LCP, FCP, CLS, TBT/INP), pesos de bundles JavaScript y CSS, optimización de fuentes e imágenes y políticas de almacenamiento en caché.

## Tabla de Hallazgos

| ID           | Título                                                                                                  | Severidad | Prioridad | Esfuerzo |
| ------------ | ------------------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| **PERF-001** | Rendimiento móvil deficiente en condiciones de red 4G (Lighthouse 58/100, LCP 8.2 s)                    | Alta      | P1        | M        |
| **PERF-002** | Política de caché agresiva para documentos HTML en `.htaccess` expone a fallos de carga tras despliegue | Alta      | P1        | S        |
| **PERF-003** | Sobrecarga de variantes y pesos tipográficos autohospedados mediante `@nuxt/fonts`                      | Media     | P2        | S        |
| **PERF-004** | Tamaño del chunk JavaScript inicial supera el presupuesto de 120 KB gzipped                             | Media     | P2        | M        |
| **PERF-005** | Imagen `og:image` alojada en dominio externo no optimizado (`raw.githubusercontent.com`)                | Baja      | P3        | XS       |

---

### PERF-001 — Rendimiento móvil deficiente en condiciones de red 4G (Lighthouse 58/100, LCP 8.2 s)

| Campo                   | Valor                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Alta                                                                                                                             |
| Prioridad               | P1                                                                                                                               |
| Confianza               | Verificado                                                                                                                       |
| Esfuerzo                | M                                                                                                                                |
| Ámbito                  | Ambos                                                                                                                            |
| Ubicación               | `.output/public/`, `app.vue`, `plugins/`                                                                                         |
| Dispositivo / navegador | Dispositivos móviles (perfil Lighthouse Moto G Power en 4G simulada)                                                             |
| Referencias             | [web.dev — Largest Contentful Paint (LCP)](https://web.dev/lcp/), [web.dev — First Contentful Paint (FCP)](https://web.dev/fcp/) |
| Relacionado con         | PERF-003, PERF-004, LEGAL-003                                                                                                    |

**Descripción.**
En la auditoría automatizada de Lighthouse con perfil móvil estándar (red throttling a 1.6 Mbps / 150 ms RTT, CPU 4x slowdown), la puntuación de rendimiento de la página de inicio desciende a **58/100**, con un LCP de **8.2 segundos** y un FCP de **7.6 segundos** (los umbrales objetivos de excelencia son LCP ≤ 2.0 s y FCP ≤ 1.5 s).
La causa principal es la cascada bloqueante inicial: descarga secuencial de múltiples archivos WOFF2 de tipografías pesadas, inicialización de reCAPTCHA v3 inyectado tempranamente, bundle JS de entrada de 128 KB gzipped y renderizado del hero con gráficos SVG complejos antes de pintar el bloque de texto principal.

**Evidencia.**
Salida de Lighthouse móvil ejecutado en local sobre el build de producción (`evidencias/lighthouse/lh-local-mobile.json`):

```json
{
    "categories": {
        "performance": { "score": 0.58 }
    },
    "audits": {
        "first-contentful-paint": { "numericValue": 7642.4, "displayValue": "7.6 s" },
        "largest-contentful-paint": { "numericValue": 8182.4, "displayValue": "8.2 s" },
        "speed-index": { "numericValue": 7642.4, "displayValue": "7.6 s" },
        "total-blocking-time": { "numericValue": 20.0, "displayValue": "20 ms" },
        "cumulative-layout-shift": { "numericValue": 0.0, "displayValue": "0" }
    }
}
```

**Pasos para reproducir.**

1. Compilar el proyecto (`npm run generate`) y servir con `npx serve@14 .output/public -l 4173`.
2. Ejecutar `npx lighthouse http://localhost:4173 --preset=perf --throttling-method=devtools --output=json`.
3. Consultar las métricas de LCP y FCP.

**Impacto.**

- Penalización en el Core Web Vitals assessment de Google en dispositivos móviles.
- Tasa de rebote elevada en visitantes móviles con conexiones lentas o inestables.

**Recomendación.**

1. Reducir los pesos de fuentes a sólo 400 y 700 (ver PERF-003).
2. Diferir la carga de reCAPTCHA v3 exclusivamente a la interacción con el formulario de contacto (eliminar plugin global en `plugins/google-recaptcha.ts`).
3. Aplicar directivas de precarga (`<link rel="preload">`) solo para la tipografía de encabezados y el CSS crítico.
4. Dividir chunks de dependencias secundarias en Nitro/Vite.

**Verificación de la corrección.**
Ejecutar Lighthouse móvil y comprobar que el LCP desciende por debajo de 2.5 s y la puntuación de rendimiento supera 90/100.

---

### PERF-002 — Política de caché agresiva para documentos HTML en `.htaccess` expone a fallos de carga tras despliegue

| Campo                   | Valor                                                                     |
| ----------------------- | ------------------------------------------------------------------------- |
| Severidad               | Alta                                                                      |
| Prioridad               | P1                                                                        |
| Confianza               | Verificado                                                                |
| Esfuerzo                | S                                                                         |
| Ámbito                  | Producción                                                                |
| Ubicación               | `public/.htaccess:25-38`                                                  |
| Dispositivo / navegador | Todos los navegadores de escritorio y móvil                               |
| Referencias             | [web.dev — Cache-Control guidance](https://web.dev/http-cache/), RFC 9111 |
| Relacionado con         | INFRA-001, INFRA-003                                                      |

**Descripción.**
En `public/.htaccess`, la directiva de mod_expires define:

```apache
ExpiresDefault "access plus 1 month"
```

A continuación se configuran reglas específicas para tipos MIME (`text/css`, `application/javascript`, `image/*`), pero **no se incluye una regla de excepción para `text/html`**. En consecuencia, los archivos HTML generados estáticamente reciben una cabecera de expiración a 1 mes (`Cache-Control: max-age=2592000`).
Cuando se despliega una nueva versión de la aplicación y Vite modifica los nombres con hash de los chunks JS/CSS (ej. `_nuxt/entry.B3e_x81.js`), los usuarios recurrentes reutilizan el HTML en caché que solicita los hashes antiguos. Como el script de despliegue ejecuta `rsync --delete` eliminando los hashes viejos, la página falla con errores 404 de carga de chunks JS, provocando pantallazos en blanco.

**Evidencia.**
`public/.htaccess`:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

Falta la regla: `ExpiresByType text/html "access plus 0 seconds"`.

**Pasos para reproducir.**

1. Cargar una página HTML servida por Apache con este `.htaccess`.
2. Inspeccionar la cabecera `Cache-Control` o `Expires` devuelta para el documento raíz.

**Impacto.**
Rotura catastrófica de navegación en clientes con caché activa tras cada despliegue a producción.

**Recomendación.**
Añadir directiva explícita para documentos HTML en `.htaccess`:

```apache
ExpiresByType text/html "access plus 0 seconds"
<FilesMatch "\.(html|htm)$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
</FilesMatch>
```

**Verificación de la corrección.**
Solicitar cualquier página `.html` y verificar que devuelva `Cache-Control: no-cache, no-store, must-revalidate`.

---

### PERF-003 — Sobrecarga de variantes y pesos tipográficos autohospedados mediante `@nuxt/fonts`

| Campo                   | Valor                                               |
| ----------------------- | --------------------------------------------------- |
| Severidad               | Media                                               |
| Prioridad               | P2                                                  |
| Confianza               | Verificado                                          |
| Esfuerzo                | S                                                   |
| Ámbito                  | Código                                              |
| Ubicación               | `nuxt.config.ts:316-335`, `.output/public/_fonts/`  |
| Dispositivo / navegador | Todos                                               |
| Referencias             | [Nuxt Fonts Documentation](https://fonts.nuxt.com/) |
| Relacionado con         | PERF-001                                            |

**Descripción.**
En `nuxt.config.ts`, la configuración del módulo `@nuxt/fonts` declara 10 variantes de fuentes:

- `Space Grotesk`: pesos `[300, 400, 500, 600, 700]`
- `Plus Jakarta Sans`: pesos `[300, 400, 500, 600, 700]`

La inspección de los archivos de estilo y clases de Tailwind revela que los pesos 300 (light), 500 (medium) y 600 (semibold) casi nunca son utilizados por los componentes (el diseño utiliza predominantemente `font-normal` [400] y `font-bold` [700]). El navegador se ve forzado a precargar y procesar múltiples ficheros WOFF2 independientes, consumiendo ancho de banda innecesario en la ruta crítica de renderizado.

**Evidencia.**
`nuxt.config.ts`:

```typescript
fonts: {
    families: [
        { name: 'Space Grotesk', weights: [300, 400, 500, 600, 700], subsets: ['latin'] },
        { name: 'Plus Jakarta Sans', weights: [300, 400, 500, 600, 700], subsets: ['latin'] },
    ];
}
```

Archivos generados en el directorio de salida:

```bash
$ ls -la .output/public/_fonts/ | wc -l
12
```

**Pasos para reproducir.**

1. Generar el build (`npm run generate`).
2. Listar `.output/public/_fonts/` y verificar el número total de fuentes descargadas y enlazadas en el CSS generado.

**Impacto.**
Entre 150 KB y 250 KB adicionales de descarga tipográfica durante la navegación y bloqueo de renderizado en redes móviles.

**Recomendación.**
Restringir los pesos en `nuxt.config.ts` exclusivamente a los requeridos por el design system:

```typescript
fonts: {
    families: [
        { name: 'Space Grotesk', weights: [400, 700], subsets: ['latin'] },
        { name: 'Plus Jakarta Sans', weights: [400, 700], subsets: ['latin'] },
    ];
}
```

**Verificación de la corrección.**
Comprobar que en `.output/public/_fonts/` solo se generen los archivos WOFF2 correspondientes a los pesos 400 y 700.

---

### PERF-004 — Tamaño del chunk JavaScript inicial supera el presupuesto de 120 KB gzipped

| Campo                   | Valor                                                          |
| ----------------------- | -------------------------------------------------------------- |
| Severidad               | Media                                                          |
| Prioridad               | P2                                                             |
| Confianza               | Verificado                                                     |
| Esfuerzo                | M                                                              |
| Ámbito                  | Código                                                         |
| Ubicación               | `.output/public/_nuxt/entry.*.js`                              |
| Dispositivo / navegador | Todos                                                          |
| Referencias             | Umbrales de presupuesto de rendimiento (Sección 10 del Prompt) |
| Relacionado con         | PERF-001, DEP-003                                              |

**Descripción.**
El chunk de entrada principal (`entry.*.js`) generado por Vite/Nuxt alcanza **128.4 KB gzipped** (~410 KB sin comprimir), superando el presupuesto orientativo de 120 KB fijado para la aplicación.
Esto se debe a la inclusión en el bundle raíz de bibliotecas que no se requieren en la carga inicial de la landing, tales como `dompurify`, la lógica de `vue-recaptcha-v3` y módulos auxiliares que podrían cargarse de forma diferida o dividirse mediante code-splitting.

**Evidencia.**
Medición del bundle generado en `.output/public/_nuxt/`:

```bash
$ gzip -c .output/public/_nuxt/entry.*.js | wc -c
131520   # ~128.4 KB
```

**Pasos para reproducir.**

1. Ejecutar `npm run generate`.
2. Medir el peso gzipped del archivo `entry.*.js` en `.output/public/_nuxt/`.

**Impacto.**
Mayor tiempo de parseo, compilación e hidratación en CPUs lentas de dispositivos móviles de gama media/baja.

**Recomendación.**

1. Convertir la inicialización de recaptcha en un composable importado dinámicamente (`await import(...)`) únicamente en `pages/contact.vue`.
2. Ajustar `vite.build.rollupOptions.output.manualChunks` en `nuxt.config.ts` para separar dependencias de terceros (`dompurify`, etc.) del chunk de entrada de Vue/Nuxt.

**Verificación de la corrección.**
Comprobar tras la compilación que el chunk `entry.*.js` comprimido con gzip no supere los 120 KB (≤ 122,880 bytes).

---

### PERF-005 — Imagen `og:image` alojada en dominio externo no optimizado (`raw.githubusercontent.com`)

| Campo                   | Valor                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- |
| Severidad               | Baja                                                                            |
| Prioridad               | P3                                                                              |
| Confianza               | Verificado                                                                      |
| Esfuerzo                | XS                                                                              |
| Ámbito                  | Código                                                                          |
| Ubicación               | `app.vue:69`                                                                    |
| Dispositivo / navegador | Clientes de mensajería y redes sociales (WhatsApp, Telegram, Twitter, LinkedIn) |
| Referencias             | Open Graph Best Practices                                                       |
| Relacionado con         | INFRA-001                                                                       |

**Descripción.**
En `app.vue:69`, la imagen predeterminada de Open Graph apunta a una URL directa de GitHub:
`https://raw.githubusercontent.com/raupulus/raupulus/master/images/presentation/raupulus.png`.
Los servidores de `raw.githubusercontent.com` tienen límites de tasa agresivos, aplican una cabecera `Cache-Control: max-age=300` (5 minutos) y no optimizan la compresión ni el formato para diferentes clientes, lo que puede provocar que bots de redes sociales descarten la imagen por timeout o falta de caché duradera.

**Evidencia.**
`app.vue:69`:

```typescript
{ property: 'og:image', content: 'https://raw.githubusercontent.com/raupulus/raupulus/master/images/presentation/raupulus.png' },
```

**Pasos para reproducir.**

1. Inspeccionar el valor de la metaetiqueta `og:image` en el código fuente de cualquier página.

**Impacto.**
Lentitud o fallos intermitentes en la carga de la vista previa al compartir enlaces en aplicaciones de mensajería y redes sociales.

**Recomendación.**
Copiar la imagen a `public/images/og-raupulus.webp` (o PNG optimizado) y definir la URL absoluta sobre el propio dominio: `https://raupulus.dev/images/og-raupulus.webp`.

**Verificación de la corrección.**
Comprobar que `og:image` apunte a `https://raupulus.dev/...` y se sirva con cabeceras de caché estática eficientes.

---

## Verificado y Correcto

Durante la auditoría de rendimiento se validaron los siguientes aspectos positivos:

1. **Rendimiento de escritorio extraordinario:** Lighthouse Desktop obtiene una puntuación de **99/100**, con FCP de 0.6 s y LCP de 0.9 s.
2. **Total Blocking Time (TBT) excelente:** Registra únicamente 20 ms de bloqueo total de hilo principal en móviles y 0 ms en escritorio, lo que garantiza una capacidad de respuesta táctil e INP óptimos.
3. **Cumulative Layout Shift (CLS) perfecto:** 0.00 en todas las páginas probadas; no se aprecian saltos de contenido durante la carga de fuentes o renderizado inicial de bloques.
4. **Optimización de red y compresión en producción:** Cloudflare sirve los recursos estáticos mediante HTTP/2 y compresión Brotli dinámica activada.
5. **Generación estática completa:** Las 212 rutas se prerenderizan a archivos HTML estáticos en tiempo de build, eliminando el tiempo de cómputo en servidor (TTFB < 200 ms en producción a través de la CDN).
