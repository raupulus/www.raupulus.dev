# 📜 Histórico de Errores, Causa Raíz y Soluciones Técnicas

> **Ubicación:** `docs/info/historico-errores-soluciones.md`  
> **Propósito:** Registro técnico obligatorio para desarrolladores y agentes de IA. Consulte este documento antes de realizar cambios en configuración, ciclo de vida SSR/SSG o manejo de imágenes.

---

## 1. `@nuxt/image` con proveedor `ipx` en despliegues estáticos (SSG) sobre Apache/Nginx

- **Fecha de incidencia:** 2026-10-07 (y recurrente en versiones anteriores)
- **Síntomas:**
    - Al compilar y desplegar en producción, todas las imágenes renderizadas mediante `<NuxtImg>` (iconos hexágono de tecnologías en portada, botones de redes sociales, galería en `/about/`, capturas en `/webs/`, logo del autor) devuelven error HTTP 404.
    - En la consola del navegador y en el DOM se observa que las URLs de las imágenes se transforman a rutas virtuales como:
      `/_ipx/w_60,h_60/images/technologies/php_60x60.webp`
      `/_ipx/s_250x141/images/pages/about/gallery/1_250px.webp`
- **Causa Raíz:**
    - En `nuxt.config.ts`, `@nuxt/image` estaba configurado con `provider: 'ipx'`.
    - IPX es un procesador de imágenes dinámico que requiere un servidor Node.js (Nitro runtime) activo para interceptar las peticiones a `/_ipx/...` y redimensionar/optimizar la imagen al vuelo.
    - En esta web, la generación es **100% estática (SSG)** y se sirve a través de un servidor web tradicional (**Apache HTTP Server**) sin proceso Node en segundo plano.
    - El directorio `/_ipx/` no existe físicamente en el disco. Apache busca esa carpeta en el sistema de archivos, no la encuentra y devuelve un error 404 (o el contenido de `ErrorDocument 404 /404.html`).
- **Regla y Solución Definitiva:**
    1. En `nuxt.config.ts`, configurar **OBLIGATORIAMENTE**:
        ```ts
        image: {
            provider: 'none',
        }
        ```
    2. Con `provider: 'none'`, `@nuxt/image` genera etiquetas directas `<img>` apuntando a las rutas relativas de los archivos estáticos en `public/` (ej. `/images/technologies/php_60x60.webp`, `/images/icons/social/github.svg`), respetando el ancho, alto y atributos de lazy loading sin alterar la URL.
    3. **Imágenes remotas de la API:** En tarjetas de catálogo (`BlogCard.vue`, `ProjectVertical.vue`), se debe usar directamente la etiqueta estándar `<img>` con el helper `imageUrl(data.image, 'small' | 'large')`. La API Laravel ya suministra las imágenes previamente optimizadas en formato `.webp`, por lo que no requieren reprocesamiento en el frontend.

---

## 2. Catálogos vacíos en el build estático por delegar la carga únicamente a `onMounted()`

- **Fecha de incidencia:** 2026-10-07
- **Síntomas:**
    - El archivo HTML generado en disco (`.output/public/blog/index.html` o `.output/public/projects/index.html`) contiene el mensaje de estado vacío: `<h3 class="font-headline text-xl font-bold mb-2">No se encontraron artículos</h3>`.
    - Los motores de búsqueda (como Googlebot) indexan la página como vacía o de baja calidad.
    - En el navegador del cliente se produce un parpadeo visual mientras JavaScript arranca y realiza la llamada a la API en caliente.
- **Causa Raíz:**
    - En `pages/blog/[...slugs].vue` y `pages/projects/[...slugs].vue`, la función de carga inicial `fetchNextPage()` estaba invocada exclusivamente dentro del hook `onMounted()` de sus respectivos composables (`useBlogData` y `useProjectsData`).
    - `onMounted()` es un hook exclusivo del ciclo de vida del cliente (navegador). Durante la generación estática en servidor (`nuxt generate`), **`onMounted` NUNCA se ejecuta**.
    - Como consecuencia, el prerenderizador de Nitro renderizaba el HTML con el estado reactivo inicial (`datas.value.contents = undefined`), serializando el HTML vacío en el build.
- **Regla y Solución Definitiva:**
    - En las páginas que renderizan catálogos o listados, la carga de la primera página de contenidos DEBE ejecutarse de forma asíncrona a nivel de `<script setup>` durante el SSR/SSG:
        ```vue
        <script setup lang="ts">
            // En pages/blog/[...slugs].vue
            const { datas, hasMorePages, isLoading, fetchNextPage } = useBlogData();
            if (!isDetail.value && (!datas.value.contents || datas.value.contents.length === 0)) {
                await fetchNextPage();
            }
        </script>
        ```
    - Al utilizar `useState()` internamente en el composable, Nuxt serializa los datos recuperados durante el build en el payload (`_payload.json` y `__NUXT_DATA__`), dejando el HTML estático completamente poblado con las tarjetas, enlaces y el schema estructurado de Schema.org (`ItemList`).
    - En el navegador, la guarda `if (!datas.value.contents?.length)` en `onMounted()` evita peticiones redundantes contra la API.

---

## 3. Principio de Aislamiento de Entornos: Prohibición de Volcado Local a Producción

- **Regla Estricta:**
    - La base de datos local de desarrollo (`127.0.0.1:5432`) contiene datos de prueba, artículos ficticios, borradores y registros para testing interno.
    - **ESTÁ TERMINANTEMENTE PROHIBIDO** volcar, migrar, sincronizar o inyectar datos de la base de datos local en la base de datos de producción (`raupulus_api` en Odin).
    - Si un catálogo en producción aparece vacío o faltan datos, la solución técnica consiste en:
        1. Comprobar el estado y visibilidad de los datos legítimos ya existentes en producción.
        2. Ejecutar únicamente las consultas de actualización autorizadas por el usuario (ej. cambiar `status_id = 3` e `is_active = true` para contenidos de la plataforma correspondiente).
        3. Nunca inferir ni crear contenido en producción sin consentimiento explícito y previo del usuario.

---

## 4. Omisión de assets estáticos y fuentes en `nuxt generate` (`assemble-static.mjs`)

- **Fecha de incidencia:** 2026-10-07
- **Síntomas:**
    - El comando `nuxt generate` generaba los archivos HTML en `.output/public/`, pero faltaban los bundles CSS/JS compilados por Vite en `.output/public/_nuxt/`, la carpeta `public/` no se copiaba completa y las fuentes no se transferían.
    - El navegador recibía respuestas HTML 404 al solicitar hojas de estilo y scripts, produciendo errores como `NS_ERROR_CORRUPTED_CONTENT`.
- **Causa Raíz:**
    - En Nuxt 4 con Nitro en preset `static`, el worker de prerenderizado finaliza el proceso inmediatamente tras procesar las rutas sin disparar los hooks de copia de Rollup (`rollup:before` y `copyPublicAssets`).
- **Regla y Solución Definitiva:**
    - Se mantiene el script ensamblador `scripts/assemble-static.mjs` conectado al hook `"postgenerate"` en `package.json`:
        ```json
        "scripts": {
            "generate": "nuxt generate",
            "postgenerate": "node scripts/assemble-static.mjs"
        }
        ```
    - `assemble-static.mjs` realiza la copia recursiva y explícita de `public/`, `.nuxt/dist/client/_nuxt/` y las fuentes de `.nuxt/cache/fonts` y `public/_fonts/` directamente hacia `.output/public/`.
    - Las 11 fuentes Google Fonts oficiales (Inter, Space Grotesk, Roboto Mono, Fira Code, Outfit) se almacenan localmente en `public/_fonts/` para garantizar un build determinista, offline e independiente de servicios externos.

---

## 5. Rollback indeseado en despliegue de GoCD por smoke tests contra Cloudflare

- **Fecha de incidencia:** 2026-10-08
- **Síntomas:**
    - GoCD reporta fallo en la etapa de despliegue (`Prepare-and-Deploy`, exit code 1) en `deploy.sh`.
    - El build SSG en Nuxt genera correctamente todos los assets y las 16 rutas de proyectos, pero al final del job se ejecuta un rollback automático restaurando la release anterior (`/var/www/releases/www.raupulus.dev_...`), impidiendo que los cambios recientes se publiquen.
- **Causa Raíz:**
    - En `scripts/deploy.sh`, las pruebas de humo (`smoke tests`) ejecutaban `curl -fsSL "https://raupulus.dev/..."` sin especificar resolución local.
    - Como el dominio `raupulus.dev` resuelve en el host a las IPs Anycast de Cloudflare, las consultas salían a los servidores perimetrales (edge) de Cloudflare.
    - Debido a la caché perimetral previa (no purgada automáticamente por falta de variables en el pipeline) o al rate limiting por ráfaga rápida de 13 peticiones de curl consecutivas, la petición `curl -fsSL "https://raupulus.dev/projects/"` fallaba o recibía HTML antiguo/vacío.
    - `deploy.sh` interpretaba esto como una compilación rota y forzaba el rollback automático del symlink a la release previa.
- **Solución Aplicada:**
    - **Resolución local en Apache (`--resolve`):** Se adaptaron `check_status` y `curl` en `scripts/deploy.sh` para forzar `--resolve "raupulus.dev:443:127.0.0.1" --resolve "raupulus.dev:80:127.0.0.1"`, validando directamente contra la instancia local de Apache vía loopback sin dependencia de Cloudflare ni latencia WAN.
    - **Validación dual determinista:** Se añadió verificación física del fichero en disco (`$RELEASE_PATH/projects/index.html`) previa a la consulta HTTP.
    - **Purga automática de Cloudflare en GoCD:** Se configuraron `CLOUDFLARE_ZONE_ID` y `CLOUDFLARE_API_TOKEN` (cifrado con AES en GoCD) para purgar automáticamente la caché tras cada despliegue atómico exitoso.
