# Auditoría de Infraestructura, Despliegue y CI/CD

Este documento analiza la infraestructura de alojamiento, la red perimetral (CDN / DNS / TLS), las configuraciones de servidor web versionadas (Apache y Nginx), la canalización de integración y entrega continuas (**GoCD** en `gocd.yaml`), los scripts de despliegue (`scripts/deploy.sh`) y la observabilidad del sistema de **www.raupulus.dev**.

## Tabla de Hallazgos

| ID            | Título                                                                                         | Severidad | Prioridad | Esfuerzo |
| ------------- | ---------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| **INFRA-001** | Configuraciones de servidor versionadas desalineadas con la infraestructura real en producción | Alta      | P1        | M        |
| **INFRA-002** | Pipeline `gocd.yaml` carece de inyección de variables de entorno de producción para el build   | Alta      | P1        | S        |
| **INFRA-003** | Despliegue en caliente no atómico mediante `rsync --delete` sobre el docroot en producción     | Alta      | P1        | M        |
| **INFRA-004** | Ausencia de purga automática de caché de CDN (Cloudflare) en el pipeline de CI/CD              | Media     | P2        | S        |

---

### INFRA-001 — Configuraciones de servidor versionadas desalineadas con la infraestructura real en producción

| Campo                   | Valor                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Severidad               | Alta                                                                                 |
| Prioridad               | P1                                                                                   |
| Confianza               | Verificado                                                                           |
| Esfuerzo                | M                                                                                    |
| Ámbito                  | Ambos                                                                                |
| Ubicación               | `apache.conf`, `apache_dev.conf`, `nginx.conf`, `nginx_dev.conf`, `public/.htaccess` |
| Dispositivo / navegador | Servidores de alojamiento                                                            |
| Referencias             | AGENTS.md (Infraestructura y Despliegue)                                             |
| Relacionado con         | SEC-002, SEC-005, PERF-002                                                           |

**Descripción.**
En el repositorio coexisten múltiples archivos de configuración de servidores web que presentan graves discrepancias y contradicciones tanto entre sí como frente al comportamiento real observado en `https://raupulus.dev`:

1. **Falta de correspondencia con producción:** La observación de red en producción muestra que el tráfico pasa por Cloudflare, pero las respuestas HTTP carecen de todas las cabeceras de seguridad declaradas en `apache.conf` / `nginx.conf` (no hay CSP, ni X-Frame-Options, ni X-Content-Type-Options).
2. **Exposición de datos sensibles:** En `apache.conf:7` y `apache_dev.conf:15` se declara una directiva `ServerAdmin` con una dirección de correo personal privada (ver SEC-005).
3. **Caché lesiva:** El archivo `public/.htaccess` contiene reglas de expiración a 1 mes para HTML que provocan rotura de chunks tras despliegues (ver PERF-002).
   Tener archivos de configuración obsoletos o discordantes en el repositorio genera un riesgo operativo crítico: un administrador que aplique o sincronice estos archivos en el servidor productivo alterará el enrutamiento y la seguridad de forma imprevista.

**Evidencia.**
Comparativa de cabeceras en producción vs. archivo versionado:

```bash
$ curl -sSI https://raupulus.dev/ | grep -i "x-content-type-options"
# (Vacío - no se emite la cabecera en producción)

$ grep -n "X-Content-Type-Options" nginx.conf
14:    add_header X-Content-Type-Options "nosniff" always;
```

**Pasos para reproducir.**

1. Cotejar las cabeceras devueltas por `curl -sSI https://raupulus.dev` con las directivas de `nginx.conf` y `apache.conf`.
2. Verificar las discrepancias en nombres de dominio, paths de certificados y cabeceras.

**Impacto.**
Configuraciones zombie que no protegen el entorno real y pueden sobrescribir accidentalmente el comportamiento del servidor durante tareas de mantenimiento.

**Recomendación.**
Consolidar un único archivo de configuración representativo del servidor web final (o documentar si el alojamiento final se realiza mediante Apache, Nginx o almacenamiento en objetos estáticos tras Cloudflare) y eliminar las configuraciones en desuso.

**Verificación de la corrección.**
Las cabeceras emitidas por el servidor en producción deben coincidir exactamente con las directivas del archivo versionado.

---

### INFRA-002 — Pipeline `gocd.yaml` carece de inyección de variables de entorno de producción para el build

| Campo                   | Valor                                 |
| ----------------------- | ------------------------------------- |
| Severidad               | Alta                                  |
| Prioridad               | P1                                    |
| Confianza               | Verificado                            |
| Esfuerzo                | S                                     |
| Ámbito                  | Código                                |
| Ubicación               | `gocd.yaml:18-35`                     |
| Dispositivo / navegador | Pipeline de integración continua      |
| Referencias             | GoCD Pipeline Configuration Reference |
| Relacionado con         | BUG-005, CODE-002                     |

**Descripción.**
El archivo de definición del pipeline de GoCD (`gocd.yaml`) define las fases de compilación y empaquetado del sitio ejecutando:

```bash
npm ci
npm run generate
```

Sin embargo, en la definición de la tarea y del entorno **no se inyectan las variables de entorno de producción** indispensables para que Nuxt genere las rutas dinámicas y configure los endpoints correctos (`APP_URL=https://raupulus.dev`, `API_DOMAIN_URL=https://api.raupulus.dev`, `API_BASE_URL=https://api.raupulus.dev/api/v2`).
Al carecer de estas variables durante el build, Nuxt 4 adopta los valores fallback o variables por defecto (muchas apuntando a `localhost:3000` o `/api/v1`), generando un sitio estático con enlaces internos y llamadas asíncronas apuntando al entorno equivocado.

**Evidencia.**
Inspección de `gocd.yaml`:

```yaml
format_version: 10
pipelines:
    build-www-raupulus-dev:
        group: raupulus
        materials:
            git:
                git: git@github.com:raupulus/www.raupulus.dev.git
                branch: main
        stages:
            - build:
                  jobs:
                      build:
                          tasks:
                              - exec:
                                    command: /bin/bash
                                    arguments:
                                        - -c
                                        - npm ci && npm run generate
```

Ausencia de bloque `environment_variables:` con las URLs canónicas y credenciales públicas.

**Pasos para reproducir.**

1. Inspeccionar `gocd.yaml`.
2. Observar que no se definen variables de entorno previas a la invocación de `npm run generate`.

**Impacto.**
Generación de builds en CI con configuraciones erróneas o sitemaps generados con URLs de localhost.

**Recomendación.**
Declarar en `gocd.yaml` las variables de entorno necesarias para la etapa de generación:

```yaml
environment_variables:
    APP_URL: 'https://raupulus.dev'
    APP_DOMAIN: 'raupulus.dev'
    API_DOMAIN_URL: 'https://api.raupulus.dev'
    API_BASE_URL: 'https://api.raupulus.dev/api/v2'
    NODE_ENV: 'production'
```

**Verificación de la corrección.**
Comprobar en el log del agente de GoCD que las variables están exportadas y que los enlaces de salida apuntan a `https://raupulus.dev`.

---

### INFRA-003 — Despliegue en caliente no atómico mediante `rsync --delete` sobre el docroot en producción

| Campo                   | Valor                                                               |
| ----------------------- | ------------------------------------------------------------------- |
| Severidad               | Alta                                                                |
| Prioridad               | P1                                                                  |
| Confianza               | Verificado                                                          |
| Esfuerzo                | M                                                                   |
| Ámbito                  | Código                                                              |
| Ubicación               | `scripts/deploy.sh:42-55`, `gocd.yaml:38-50`                        |
| Dispositivo / navegador | Visitantes concurrentes durante el despliegue                       |
| Referencias             | Twelve-Factor App (Build, Release, Run), Atomic Deployments Pattern |
| Relacionado con         | PERF-002                                                            |

**Descripción.**
Tanto el script `scripts/deploy.sh` como la etapa de despliegue en GoCD sincronizan los archivos generados ejecutando directamente:

```bash
rsync -avz --delete .output/public/ usuario@servidor:/var/www/raupulus.dev/
```

Este método de sincronización en caliente ("in-place") **no es atómico**:

1. Durante los segundos que tarda la transferencia de archivos, el servidor web se encuentra en un estado inconsistente donde coexisten archivos HTML nuevos con chunks JS antiguos, o donde `--delete` ya borró los chunks anteriores antes de que el navegador del visitante termine de cargarlos.
2. Si la transferencia se interrumpe por una caída de red o fallo de SSH, el sitio queda en un estado incompleto o corrupto sin mecanismo automático de rollback.

**Evidencia.**
Inspección de `scripts/deploy.sh:45`:

```bash
rsync -avz --delete --exclude '.git' "$BUILD_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
```

**Pasos para reproducir.**

1. Revisar la lógica de sincronización en `scripts/deploy.sh`.
2. Confirmar que no se emplean carpetas versionadas por release ni enlaces simbólicos (`symlink switching`).

**Impacto.**
Errores 404 transitorios en clientes y pantallazos blancos para usuarios que naveguen por el sitio justamente durante el despliegue.

**Recomendación.**
Implementar el patrón de despliegue atómico mediante enlaces simbólicos:

1. Subir la nueva compilación a una carpeta temporal con timestamp (`/var/www/releases/release_YYYYMMDD_HHMMSS`).
2. Actualizar atómicamente el enlace simbólico del docroot:
    ```bash
    ln -sfn /var/www/releases/release_YYYYMMDD_HHMMSS /var/www/raupulus.dev_next && mv -Tf /var/www/raupulus.dev_next /var/www/raupulus.dev
    ```
3. Mantener las últimas 3 releases para posibilitar rollback instantáneo.

**Verificación de la corrección.**
Comprobar que el docroot apunta a un enlace simbólico y que los despliegues conmutan el puntero en un único paso atómico.

---

### INFRA-004 — Ausencia de purga automática de caché de CDN (Cloudflare) en el pipeline de CI/CD

| Campo                   | Valor                                   |
| ----------------------- | --------------------------------------- |
| Severidad               | Media                                   |
| Prioridad               | P2                                      |
| Confianza               | Verificado                              |
| Esfuerzo                | S                                       |
| Ámbito                  | Código                                  |
| Ubicación               | `scripts/deploy.sh`, `gocd.yaml`        |
| Dispositivo / navegador | Todos los visitantes tras un despliegue |
| Referencias             | Cloudflare API — Purge Cache by Zone    |
| Relacionado con         | PERF-002, INFRA-003                     |

**Descripción.**
El dominio `raupulus.dev` está protegido y cacheado por la red perimetral de Cloudflare (cabecera `server: cloudflare`, `cf-ray`, `cf-cache-status`).
Sin embargo, ni el script `scripts/deploy.sh` ni el pipeline de GoCD incorporan un paso posterior al despliegue para invocar la API de Cloudflare y purgar la caché de las páginas HTML (`/`, `/projects`, etc.).
En consecuencia, tras desplegar una corrección de código urgente o actualizar contenidos de proyectos, los nodos edge de Cloudflare continúan sirviendo las páginas HTML cacheadas hasta que expire su TTL (o hasta que un operador realice una purga manual en el panel web de Cloudflare).

**Evidencia.**
Revisión de `scripts/deploy.sh`: no contiene llamadas `curl` a `https://api.cloudflare.com/client/v4/zones/.../purge_cache`.

**Pasos para reproducir.**

1. Buscar en el repositorio referencias a tokens de purga de Cloudflare o scripts de invalidación de CDN.

**Impacto.**
Retraso en la propagación de actualizaciones y persistencia de versiones antiguas en cachés perimetrales.

**Recomendación.**
Añadir al final de `scripts/deploy.sh` (y en el último job de `gocd.yaml`) una llamada a la API de Cloudflare utilizando un token de zona con permisos de purga de caché:

```bash
if [ -n "$CLOUDFLARE_ZONE_ID" ] && [ -n "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Purgando caché en Cloudflare..."
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
fi
```

**Verificación de la corrección.**
Comprobar que la respuesta de Cloudflare devuelva `"success": true` al finalizar el despliegue.

---

## Verificado y Correcto

Durante la evaluación de infraestructura y operaciones se verificaron satisfactoriamente los siguientes elementos:

1. **Configuración DNS dual y Anycast:** Dominio protegido por Cloudflare con resolución Anycast en registros `A` (IPv4) y `AAAA` (IPv6), ofreciendo alta disponibilidad y baja latencia de resolución en todo el mundo.
2. **Cifrado TLS moderno:** Soporte activo de TLS 1.3 con certificados válidos gestionados y renovados automáticamente.
3. **Preset estático de Nitro eficiente:** El empaquetado genera un árbol de archivos plano perfectamente autónomo sin requerir tiempos de ejecución de Node.js en producción.
4. **Estructura clara de automatización en scripts:** Existencia de scripts organizados en `scripts/` (`deploy.sh`, `lint.sh`, `test.sh`) que facilitan la repetibilidad de tareas para desarrolladores locales.
