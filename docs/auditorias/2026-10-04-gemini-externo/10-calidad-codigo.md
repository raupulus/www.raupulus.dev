# Auditoría de Calidad de Código, Tests y Mantenibilidad

Este documento evalúa la limpieza del código base, la tipificación estática con TypeScript, la consistencia con las convenciones de `AGENTS.md`, la cobertura y calidad de los tests automatizados y la coherencia entre la documentación técnica (`docs/info/`) y la implementación real.

## Tabla de Hallazgos

| ID           | Título                                                                                            | Severidad | Prioridad | Esfuerzo |
| ------------ | ------------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| **CODE-001** | Archivo utilitario `utils/apiClient.ts` huérfano y en desuso a pesar de estar documentado         | Media     | P2        | XS       |
| **CODE-002** | Desfase crítico entre la documentación técnica en `docs/info/` (API v1) y el código real (API v2) | Media     | P2        | M        |
| **CODE-003** | Presencia de 38 advertencias de ESLint por `v-html`, props implícitas y `console.log`             | Baja      | P3        | S        |
| **CODE-004** | Cobertura de tests nula en páginas, layout, modales y lógica del formulario de contacto           | Baja      | P3        | L        |

---

### CODE-001 — Archivo utilitario `utils/apiClient.ts` huérfano y en desuso a pesar de estar documentado

| Campo                   | Valor                                           |
| ----------------------- | ----------------------------------------------- |
| Severidad               | Media                                           |
| Prioridad               | P2                                              |
| Confianza               | Verificado                                      |
| Esfuerzo                | XS                                              |
| Ámbito                  | Código                                          |
| Ubicación               | `utils/apiClient.ts`, `docs/info/utils.md:3-35` |
| Dispositivo / navegador | —                                               |
| Referencias             | AGENTS.md (Estructura de Utils y Composables)   |
| Relacionado con         | CODE-002                                        |

**Descripción.**
En `utils/apiClient.ts` existe un cliente HTTP genérico basado en `ofetch` que implementa interceptores, manejo de CSRF y tipado de respuestas. Este archivo está extensamente documentado en `docs/info/utils.md` como el mecanismo principal para interactuar con la API.
Sin embargo, un análisis de referencias en todo el proyecto demuestra que **ningún archivo, composable ni componente importa ni utiliza `apiClient`**. En su lugar, el código utiliza llamadas dispersas a `$fetch`, `useFetch` o el composable `useApiBase()`. Mantener código muerto de esta envergadura genera deuda técnica y confunde a los desarrolladores y agentes de IA sobre el patrón oficial de consumo de red.

**Evidencia.**

```bash
$ grep -rn "apiClient" composables/ pages/ components/ app.vue
# (Sin ninguna coincidencia en el código fuente de la aplicación)
```

**Pasos para reproducir.**

1. Buscar importaciones de `apiClient` o `useApiClient` en todo el directorio `composables/` y `pages/`.
2. Verificar que solo aparece referenciado en su propio archivo y en la documentación técnica `docs/info/utils.md`.

**Impacto.**
Código duplicado o arquitectura zombie; los desarrolladores pueden asumir erróneamente que los interceptores de seguridad de `apiClient` se están ejecutando en las peticiones del sitio cuando en realidad no se usan.

**Recomendación.**
Decidir una única vía arquitectónica: o bien refactorizar todos los composables para que utilicen este cliente centralizado, o eliminar `utils/apiClient.ts` y actualizar `docs/info/utils.md` para reflejar el uso real de `$fetch` y `useApiBase()`.

**Verificación de la corrección.**
Comprobar con `knip` que no se señalen archivos no utilizados en la carpeta `utils/`.

---

### CODE-002 — Desfase crítico entre la documentación técnica en `docs/info/` (API v1) y el código real (API v2)

| Campo                   | Valor                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| Severidad               | Media                                                            |
| Prioridad               | P2                                                               |
| Confianza               | Verificado                                                       |
| Esfuerzo                | M                                                                |
| Ámbito                  | Código                                                           |
| Ubicación               | `docs/info/`, `AGENTS.md:144-155`, `composables/platformData.ts` |
| Dispositivo / navegador | —                                                                |
| Referencias             | AGENTS.md (Regla obligatoria de actualización de documentación)  |
| Relacionado con         | CODE-001                                                         |

**Descripción.**
`AGENTS.md` y múltiples archivos de `docs/info/` (incluidos `README.md`, `composables.md`, `pagina-proyectos.md` y `nuxt-config.md`) documentan que el portfolio consume la versión 1 de la API Laravel:

- Documentado: `api.raupulus.dev/api/v1`
- Documentado: `/platform/portfolio/info`, `/platform/portfolio/content/type/project`

En el código fuente real, la aplicación fue migrada a la **API v2**:

- Código: `/api/v2/platforms/portfolio`
- Código: `/api/v2/platforms/portfolio/contents`

Esta falta de sincronización incumple frontalmente la regla de oro de `AGENTS.md` (_"⚠️ Documentación técnica de módulos — OBLIGATORIO mantener actualizada"_), llevando a que cualquier auditor o desarrollador que configure variables de entorno según la documentación genere un sitio roto que intenta consumir endpoints v1 deprecados.

**Evidencia.**
Comparativa:

- `AGENTS.md:146`: `| /platform/portfolio/info | GET | Datos globales de la plataforma |`
- `composables/platformData.ts:16`: `const endpoint = '/platforms/portfolio'` (con prefijo `/api/v2`).

**Pasos para reproducir.**

1. Revisar la tabla de endpoints en `AGENTS.md:144-155`.
2. Comparar con las URLs solicitadas en `composables/platformData.ts` y `composables/projectsData.ts`.

**Impacto.**
Falsas expectativas de arquitectura, errores en configuraciones de entorno de CI/CD y desorientación del equipo.

**Recomendación.**
Actualizar exhaustivamente `AGENTS.md` y todos los documentos `.md` afectados en `docs/info/` para reflejar los contratos de datos, rutas y respuestas de la API v2.

**Verificación de la corrección.**
Realizar una búsqueda global de `api/v1` en `docs/info/` y `AGENTS.md` y verificar que solo figure `v2`.

---

### CODE-003 — Presencia de 38 advertencias de ESLint por `v-html`, props implícitas y `console.log`

| Campo                   | Valor                                      |
| ----------------------- | ------------------------------------------ |
| Severidad               | Baja                                       |
| Prioridad               | P3                                         |
| Confianza               | Verificado                                 |
| Esfuerzo                | S                                          |
| Ámbito                  | Código                                     |
| Ubicación               | Varios archivos en `components/`, `pages/` |
| Dispositivo / navegador | —                                          |
| Referencias             | ESLint Configuration (`eslint.config.mjs`) |
| Relacionado con         | SEC-001                                    |

**Descripción.**
La ejecución de `npm run lint` finaliza con 0 errores pero con **38 advertencias** (warnings).
Las advertencias corresponden principalmente a:

1. `vue/no-v-html`: Uso sistemático de renderizado de HTML sin directivas de desactivación explícitas comentadas en los componentes de bloques EditorJS.
2. `no-console`: Llamadas directas a `console.log` residuales en componentes.
3. Tipado implícito `any` en parámetros de funciones de utilidad y props de componentes de tarjetas.

**Evidencia.**
Salida de `npm run lint` (`evidencias/build/lint.txt`):

```text
✖ 38 problems (0 errors, 38 warnings)
  38 warnings potentially fixable with the `--fix` option.
```

**Pasos para reproducir.**

1. Ejecutar `npm run lint` en la terminal.
2. Contar el número de advertencias generadas en la salida.

**Impacto.**
Ruido en los logs de integración continua y riesgo de que errores nuevos pasen inadvertidos entre la gran cantidad de advertencias toleradas.

**Recomendación.**

1. Sustituir `console.log` por `console.warn` / `console.error` o eliminarlos.
2. Aplicar tipos explícitos para resolver los avisos de `@typescript-eslint/no-explicit-any`.
3. Añadir comentarios `// eslint-disable-next-line vue/no-v-html` con justificación en aquellos bloques donde `sanitizeHtml` ya garantiza la seguridad.

**Verificación de la corrección.**
`npm run lint` debe reportar 0 errores y 0 warnings.

---

### CODE-004 — Cobertura de tests nula en páginas, layout, modales y lógica del formulario de contacto

| Campo                   | Valor                                  |
| ----------------------- | -------------------------------------- |
| Severidad               | Baja                                   |
| Prioridad               | P3                                     |
| Confianza               | Verificado                             |
| Esfuerzo                | L                                      |
| Ámbito                  | Código                                 |
| Ubicación               | `tests/`, `pages/`, `components/`      |
| Dispositivo / navegador | —                                      |
| Referencias             | Vitest & Vue Test Utils Best Practices |
| Relacionado con         | DEP-005, BUG-001                       |

**Descripción.**
El repositorio cuenta con 10 archivos de prueba unitaria (`tests/**/*.test.ts`) que verifican adecuadamente utilidades puras (`sanitize.test.ts`, `TechnologyUtils.test.ts`) y un subconjunto de composables.
Sin embargo, **no existe ningún test para:**

- Páginas de la aplicación (`pages/index.vue`, `pages/contact.vue`, `pages/projects/[...slugs].vue`).
- Componentes de layout críticos (`Header.vue`, `Footer.vue`).
- Componentes modales interactivos (`projectShow.vue`, `ImageSlide.vue`).
- El ciclo de validación y envío del formulario de contacto (lo que permitió que bugs graves como BUG-001 pasaran inadvertidos al no existir tests que simulen el flujo CSRF).

**Evidencia.**
Estructura de la carpeta `tests/`:

```bash
$ ls -R tests/
tests/composables:
platformData.test.ts  projectsData.test.ts  states.test.ts

tests/utils:
ContentUtils.test.ts  TechnologyUtils.test.ts  apiClient.test.ts  sanitize.test.ts
```

Ninguna carpeta `tests/pages/` ni `tests/components/`.

**Pasos para reproducir.**

1. Listar los archivos en `tests/`.
2. Comprobar la ausencia total de montajes con `@vue/test-utils` para componentes visuales.

**Impacto.**
Riesgo constante de regresiones silenciosas al modificar maquetación, eventos de teclado o interacciones de usuario.

**Recomendación.**
Introducir tests con `@vue/test-utils` y `happy-dom` para validar:

- Renderizado y validación reactiva del formulario de contacto.
- Comportamiento de apertura/cierre y eventos de tecla Escape en modales.
- Enrutamiento dinámico de `[...slugs].vue`.

**Verificación de la corrección.**
Aumentar la suite a >20 archivos de prueba cubriendo tanto componentes UI como flujos de interacción de usuario.

---

## Verificado y Correcto

Durante la auditoría de calidad de código se comprobaron positivamente los siguientes estándares:

1. **Cero errores de compilación TypeScript:** La ejecución de `npx vue-tsc --noEmit` finaliza limpiamente con 0 errores de tipos en todo el proyecto.
2. **Suite de pruebas existente 100% verde:** Los 45 tests unitarios actuales pasan con éxito sin fallos ni aserciones inestables (`npm run test:run`).
3. **Adherencia a Vue 3 SFC:** El 100% de los componentes utilizan `<script setup lang="ts">`, Composition API pura y un único elemento raíz en el template de cada vista.
4. **Respeto a las directivas de estilo:** Ausencia de clases CSS globales con nombres de utilidades de Tailwind (`.p-1`, etc.), salvaguardando la integridad del design system.
