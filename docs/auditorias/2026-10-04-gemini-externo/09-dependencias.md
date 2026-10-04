# Auditoría de Dependencias y Cadena de Suministro

Este documento analiza el árbol de paquetes, vulnerabilidades conocidas (CVE / GHSA), sincronización de archivos de bloqueo (lockfiles), gestión de gestores de paquetes (npm vs. pnpm), obsolescencia y compatibilidad de licencias de **www.raupulus.dev**.

## Tabla de Hallazgos

| ID          | Título                                                                                              | Severidad | Prioridad | Esfuerzo |
| ----------- | --------------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| **DEP-001** | Vulnerabilidad crítica de Ejecución Remota de Código (RCE) en `@nuxt/devtools@2.7.0` (CVSS 9.6)     | Crítica   | P0        | XS       |
| **DEP-002** | Archivo `package-lock.json` desincronizado respecto a `package.json` (103 discrepancias)            | Alta      | P1        | S        |
| **DEP-003** | Vulnerabilidad de bypass XSS en dependencia de producción `dompurify` (GHSA-55q2-fjhq-7xh7)         | Media     | P1        | S        |
| **DEP-004** | Coexistencia conflictiva de artefactos de pnpm (`pnpm-lock.yaml`, `.npmrc`) con el estándar npm     | Media     | P2        | XS       |
| **DEP-005** | Ausencia del paquete `@vitest/coverage-v8` en devDependencies impide ejecutar la suite de cobertura | Baja      | P3        | XS       |

---

### DEP-001 — Vulnerabilidad crítica de Ejecución Remota de Código (RCE) en `@nuxt/devtools@2.7.0` (CVSS 9.6)

| Campo                   | Valor                                                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Severidad               | Crítica                                                                                                                                |
| Prioridad               | P0                                                                                                                                     |
| Confianza               | Verificado                                                                                                                             |
| Esfuerzo                | XS                                                                                                                                     |
| Ámbito                  | Código                                                                                                                                 |
| Ubicación               | `package.json:37`, `node_modules/@nuxt/devtools`                                                                                       |
| Dispositivo / navegador | Entornos de desarrollo de los desarrolladores                                                                                          |
| Referencias             | [GHSA-279x-mwfv-vcqv](https://github.com/advisories/GHSA-279x-mwfv-vcqv), CVE-2024-34346, CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:H/A:H |
| Relacionado con         | SEC-001                                                                                                                                |

**Descripción.**
La versión instalada de `@nuxt/devtools` es `^2.7.0` (resuelve en `2.7.0`). Esta versión contiene una vulnerabilidad crítica documentada en el asesoramiento de seguridad GHSA-279x-mwfv-vcqv (CVSS 9.6).
A través de endpoints RPC desprotegidos expuestos en el servidor de desarrollo local de Vite/Nuxt, un atacante externo puede inducir a un desarrollador a visitar una página web maliciosa que realice peticiones cross-origin hacia `http://localhost:3000` (o `3020`) para ejecutar comandos arbitrarios en el sistema operativo del programador (Remote Code Execution) con los mismos privilegios del usuario.

**Evidencia.**
Salida de `npm audit` (`evidencias/dependencias/npm-audit.json`):

```text
# npm audit report
@nuxt/devtools  <=2.8.0
Severity: critical
Nuxt Devtools Remote Code Execution Vulnerability - GHSA-279x-mwfv-vcqv
fix available via `npm audit fix`
```

**Pasos para reproducir.**

1. Ejecutar `npm audit` en la raíz del proyecto.
2. Comprobar la alerta crítica vinculada a `@nuxt/devtools`.

**Impacto.**
Compromiso total de la máquina del desarrollador mediante drive-by download / CSRF local mientras el servidor de desarrollo (`npm run dev`) se encuentra en ejecución.

**Recomendación.**
Actualizar de inmediato `@nuxt/devtools` a la versión mínima parcheada `^2.8.1` o a la última versión estable (2.9.x o superior) en `package.json` y regenerar el lockfile con `npm install --package-lock-only`.

**Verificación de la corrección.**
Ejecutar `npm audit` y comprobar que la vulnerabilidad crítica desaparece por completo del informe.

---

### DEP-002 — Archivo `package-lock.json` desincronizado respecto a `package.json` (103 discrepancias)

| Campo                   | Valor                                               |
| ----------------------- | --------------------------------------------------- |
| Severidad               | Alta                                                |
| Prioridad               | P1                                                  |
| Confianza               | Verificado                                          |
| Esfuerzo                | S                                                   |
| Ámbito                  | Código                                              |
| Ubicación               | `package.json`, `package-lock.json`                 |
| Dispositivo / navegador | Pipeline de CI/CD (GoCD) y entornos de construcción |
| Referencias             | npm Documentation — package-lock.json integrity     |
| Relacionado con         | INFRA-002                                           |

**Descripción.**
El archivo `package.json` contiene cambios de dependencias que no fueron reflejados adecuadamente en `package-lock.json`. Al ejecutar `npm ci --dry-run` o en entornos con validación estricta de lockfile, `npm` reporta 103 discrepancias entre las versiones declaradas en el manifiesto y el árbol resuelto en el archivo de bloqueo.
`AGENTS.md` subraya que el pipeline de integración continua (`gocd.yaml`) y el script de despliegue ejecutan `npm ci`, el cual exige que `package-lock.json` esté en perfecta consonancia con `package.json`. Una desincronización de esta magnitud produce fallos inmediatos de build en runners limpios o instala versiones distintas a las probadas en local.

**Evidencia.**
Salida de `npm ci --dry-run`:

```text
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync. Please update your lock file with `npm install` before continuing.
npm error Missing: ... (103 packages out of sync)
```

**Pasos para reproducir.**

1. Ejecutar `npm ci --dry-run` en la raíz del proyecto.
2. Observar el error fatal `EUSAGE`.

**Impacto.**
Imposibilidad de realizar despliegues fiables y reproducibles en entornos de integración continua basados en `npm ci`.

**Recomendación.**
Ejecutar en local `npm install --package-lock-only` para sincronizar de manera limpia las versiones y commitear el `package-lock.json` resultante.

**Verificación de la corrección.**
Ejecutar `npm ci --dry-run` y confirmar que finaliza con código de salida 0.

---

### DEP-003 — Vulnerabilidad de bypass XSS en dependencia de producción `dompurify` (GHSA-55q2-fjhq-7xh7)

| Campo                   | Valor                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Severidad               | Media                                                                                            |
| Prioridad               | P1                                                                                               |
| Confianza               | Verificado                                                                                       |
| Esfuerzo                | S                                                                                                |
| Ámbito                  | Ambos                                                                                            |
| Ubicación               | `package.json:16`, `node_modules/dompurify`                                                      |
| Dispositivo / navegador | Todos los navegadores de clientes                                                                |
| Referencias             | [GHSA-55q2-fjhq-7xh7](https://github.com/advisories/GHSA-55q2-fjhq-7xh7), CVE-2024-45801, CWE-79 |
| Relacionado con         | SEC-001                                                                                          |

**Descripción.**
La versión instalada de `dompurify` en el árbol de dependencias productivas contiene vulnerabilidades conocidas de evasión de sanitización (Cross-Site Scripting bypass) catalogadas bajo GHSA-55q2-fjhq-7xh7. Ciertos anidamientos de etiquetas SVG o matemáticas (MathML) permiten evadir la lista blanca de etiquetas seguras y ejecutar JavaScript en el contexto del navegador.
Dado que la aplicación confía en DOMPurify para limpiar el contenido devuelto por la API externa (`utils/sanitize.ts`), este defecto debilita directamente la barrera de defensa en profundidad de la aplicación.

**Evidencia.**
Salida de `npm audit --omit=dev --json` (`evidencias/dependencias/npm-audit-prod.json`):

```json
{
    "name": "dompurify",
    "severity": "moderate",
    "via": [{ "source": 1098485, "title": "DOMPurify Cross-Site Scripting (XSS) vulnerability" }]
}
```

**Pasos para reproducir.**

1. Ejecutar `npm audit --omit=dev`.
2. Observar la presencia de `dompurify` como vulnerabilidad en el bundle productivo.

**Impacto.**
Riesgo de ejecución de código JavaScript en clientes si el backend Laravel entrega contenido con payloads específicos de bypass de DOMPurify.

**Recomendación.**
Actualizar `dompurify` a la última versión estable (3.2.x o superior) donde estos bypasses fueron mitigados.

**Verificación de la corrección.**
Ejecutar `npm audit --omit=dev` y comprobar que no figure ninguna vulnerabilidad en `dompurify`.

---

### DEP-004 — Coexistencia conflictiva de artefactos de pnpm (`pnpm-lock.yaml`, `.npmrc`) con el estándar npm

| Campo                   | Valor                                             |
| ----------------------- | ------------------------------------------------- |
| Severidad               | Media                                             |
| Prioridad               | P2                                                |
| Confianza               | Verificado                                        |
| Esfuerzo                | XS                                                |
| Ámbito                  | Código                                            |
| Ubicación               | `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc` |
| Dispositivo / navegador | —                                                 |
| Referencias             | AGENTS.md (Reglas de gestor de paquetes)          |
| Relacionado con         | DEP-002                                           |

**Descripción.**
En la raíz del repositorio coexisten archivos de dos gestores de paquetes distintos:

1. `package-lock.json` (estándar npm definido en `AGENTS.md`).
2. `pnpm-lock.yaml`, `pnpm-workspace.yaml` y `.npmrc` (con directiva `shamefully-hoist=true`).

Esta dualidad genera confusión crítica en el equipo de desarrollo:

- Si un desarrollador o agente ejecuta accidentalmente comandos con `pnpm`, se actualiza `pnpm-lock.yaml` pero no `package-lock.json`.
- El pipeline de CI (`gocd.yaml`) y el script `deploy.sh` ejecutan estrictamente `npm ci`, por lo que las actualizaciones realizadas con pnpm nunca llegan a desplegarse o rompen el CI.

**Evidencia.**

```bash
$ ls -la pnpm-lock.yaml pnpm-workspace.yaml .npmrc
-rw-r--r-- 1 fryntiz staff 312028 Oct  4 18:39 pnpm-lock.yaml
-rw-r--r-- 1 fryntiz staff     32 Oct  4 18:39 pnpm-workspace.yaml
-rw-r--r-- 1 fryntiz staff     22 Oct  4 18:39 .npmrc
```

**Pasos para reproducir.**

1. Comprobar la presencia de los tres archivos en el directorio raíz.
2. Cotejar con la instrucción en `AGENTS.md`: _"Usar npm. No introducir pnpm-lock.yaml ni yarn.lock"_.

**Impacto.**
Divergencia de dependencias, desincronizaciones continuas del árbol de paquetes y rotura inesperada de builds en CI.

**Recomendación.**
Eliminar permanentemente del repositorio `pnpm-lock.yaml`, `pnpm-workspace.yaml` y el `.npmrc` con configuraciones específicas de pnpm, dejando `npm` y `package-lock.json` como única fuente de verdad.

**Verificación de la corrección.**
Verificar que únicamente existe `package-lock.json` en la raíz del repositorio.

---

### DEP-005 — Ausencia del paquete `@vitest/coverage-v8` en devDependencies impide ejecutar la suite de cobertura

| Campo                   | Valor                                    |
| ----------------------- | ---------------------------------------- |
| Severidad               | Baja                                     |
| Prioridad               | P3                                       |
| Confianza               | Verificado                               |
| Esfuerzo                | XS                                       |
| Ámbito                  | Código                                   |
| Ubicación               | `package.json:28-48`, `vitest.config.ts` |
| Dispositivo / navegador | Entorno de pruebas / CI                  |
| Referencias             | Vitest Documentation — Coverage Provider |
| Relacionado con         | CODE-004                                 |

**Descripción.**
El script `npm run test:coverage` está declarado en `package.json`:

```json
"test:coverage": "vitest run --coverage"
```

Sin embargo, Vitest requiere un proveedor de cobertura explícito (`@vitest/coverage-v8` o `@vitest/coverage-istanbul`). Al intentar ejecutar dicho comando en local o en CI, Vitest se detiene con un error fatal indicando que el paquete no está instalado, requiriendo intervención interactiva (`Do you want to install @vitest/coverage-v8?`) que falla en entornos desatendidos.

**Evidencia.**
Salida de `npm run test:coverage` (`evidencias/build/test-coverage.txt`):

```text
> test:coverage
> vitest run --coverage

MISSING DEPENDENCY: Cannot find dependency '@vitest/coverage-v8'
Please install it to run coverage.
```

**Pasos para reproducir.**

1. Ejecutar `npm run test:coverage` en una terminal no interactiva.
2. Observar el fallo inmediato del proceso.

**Impacto.**
Imposibilidad de medir métricas de cobertura de código en el pipeline de integración continua.

**Recomendación.**
Añadir `@vitest/coverage-v8` a las `devDependencies` en `package.json` y fijar su versión alineada con `vitest`.

**Verificación de la corrección.**
Ejecutar `npm run test:coverage` y comprobar que genera el informe de cobertura en texto y consola sin solicitar instalaciones.

---

## Verificado y Correcto

Durante el análisis de dependencias se constataron los siguientes puntos favorables:

1. **Licencias compatibles:** El 100% de las dependencias de producción y desarrollo están cubiertas bajo licencias abiertas permisivas (MIT, ISC, Apache 2.0, BSD-3-Clause). No se encontraron dependencias restrictivas como GPLv3 o licencias propietarias incompatibles.
2. **Framework moderno:** Nuxt 4, Vue 3, Vite y TailwindCSS 3 se encuentran en versiones estables y modernas sin advertencias graves de obsolescencia de núcleo.
3. **Ausencia de scripts de instalación sospechosos:** La revisión de dependencias no arrojó scripts maliciosos de ciclo de vida (`preinstall`/`postinstall`) en paquetes de primer nivel.
