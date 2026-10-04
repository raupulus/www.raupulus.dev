# Auditoría de Experiencia de Usuario (UX), Interfaz (UI) y Contenido

Este documento evalúa la usabilidad, heurísticas de Nielsen, coherencia visual del sistema de diseño ("Silicon Architect"), arquitectura de la información y calidad de los contenidos de **www.raupulus.dev**.

## Tabla de Hallazgos

| ID         | Título                                                                                                     | Severidad | Prioridad | Esfuerzo |
| ---------- | ---------------------------------------------------------------------------------------------------------- | --------- | --------- | -------- |
| **UX-001** | Restricciones de validación hiper-restrictivas en el formulario de contacto generan fricción injustificada | Media     | P2        | XS       |
| **UX-002** | Campo de mensaje en el formulario implementado con `contenteditable` en lugar de `<textarea>` nativo       | Media     | P2        | S        |
| **UX-003** | Enlace externo roto en la página `/social` (Stack Overflow en español devuelve HTTP 403)                   | Baja      | P3        | XS       |
| **UX-004** | Archivo gráfico huérfano de 471 KB (`public/patterns/a.png`) publicado innecesariamente en producción      | Baja      | P3        | XS       |

---

### UX-001 — Restricciones de validación hiper-restrictivas en el formulario de contacto generan fricción injustificada

| Campo                   | Valor                                                      |
| ----------------------- | ---------------------------------------------------------- |
| Severidad               | Media                                                      |
| Prioridad               | P2                                                         |
| Confianza               | Verificado                                                 |
| Esfuerzo                | XS                                                         |
| Ámbito                  | Código                                                     |
| Ubicación               | `pages/contact.vue:152-178`                                |
| Dispositivo / navegador | Todos                                                      |
| Referencias             | Heurística #5 de Nielsen (Prevención de errores), RFC 5321 |
| Relacionado con         | BUG-001, A11Y-002                                          |

**Descripción.**
En `pages/contact.vue`, la lógica de validación previa al envío impone reglas arbitrarias que no se corresponden con estándares de usabilidad web:

1. **Nombre:** Exige un mínimo de 5 caracteres (`name.length < 5`). Esto rechaza de plano nombres perfectamente comunes y válidos como "Ana", "Eva", "Leo", "Pau", "Luz" o "Li", mostrando el error `"El nombre debe tener al menos 5 caracteres"`.
2. **Asunto:** Exige un mínimo de 10 caracteres (`subject.length < 10`). Rechaza asuntos breves y concisos como "Consulta", "Propuesta", "Presupuesto" o "Contacto".
3. **Correo:** Impone una longitud máxima arbitraria de 50 caracteres (`email.length > 50`). El estándar RFC 5321 estipula que una dirección de correo puede tener hasta 254 caracteres; usuarios corporativos con subdominios o nombres compuestos son rechazados injustamente.

**Evidencia.**
`pages/contact.vue`:

```typescript
if (!form.value.name || form.value.name.length < 5) {
    errors.value.name = 'El nombre debe tener al menos 5 caracteres';
}
if (!form.value.subject || form.value.subject.length < 10) {
    errors.value.subject = 'El asunto debe tener al menos 10 caracteres';
}
if (form.value.email.length > 50) {
    errors.value.email = 'El email no puede superar los 50 caracteres';
}
```

**Pasos para reproducir.**

1. Navegar a `https://raupulus.dev/contact`.
2. Introducir nombre: "Ana", asunto: "Consulta", email: "contacto.profesional.externo@departamento.empresa.com".
3. Observar los tres mensajes de validación bloqueantes en pantalla.

**Impacto.**
Abandono del formulario de contacto y pérdida de oportunidades profesionales o de networking legítimas.

**Recomendación.**
Ajustar las validaciones a límites realistas:

- Nombre: mínimo 2 caracteres, máximo 100.
- Asunto: mínimo 3 caracteres, máximo 150.
- Correo: verificar formato con regex estándar y permitir hasta 254 caracteres.

**Verificación de la corrección.**
Comprobar que nombres como "Ana" y asuntos como "Consulta" superan la validación sin mensajes de error.

---

### UX-002 — Campo de mensaje en el formulario implementado con `contenteditable` en lugar de `<textarea>` nativo

| Campo                   | Valor                                                  |
| ----------------------- | ------------------------------------------------------ |
| Severidad               | Media                                                  |
| Prioridad               | P2                                                     |
| Confianza               | Verificado                                             |
| Esfuerzo                | S                                                      |
| Ámbito                  | Código                                                 |
| Ubicación               | `pages/contact.vue:85-94`                              |
| Dispositivo / navegador | Teclados móviles (iOS / Android), lectores de pantalla |
| Referencias             | HTML5 Specification (`<textarea>`), WCAG 4.1.2         |
| Relacionado con         | A11Y-002                                               |

**Descripción.**
En lugar de utilizar un elemento de formulario nativo `<textarea>`, el campo para redactar el mensaje de contacto está construido con un `<span>` provisto del atributo `contenteditable="true"` y `role="textbox"`:

```html
<span
    id="message"
    role="textbox"
    contenteditable="true"
    class="block w-full min-h-[120px] p-3 ... focus:outline-none"
    @input="onMessageInput"
/>
```

Esta práctica no estándar provoca múltiples anomalías de interacción:

- No responde al comportamiento predecible de un control de formulario (la tecla Tab puede insertar espacios o perder el foco de manera irregular).
- En teclados móviles, se pierden las funciones nativas de autocompletado de texto, sugerencias de teclado, dictado por voz y menús contextuales de cortar/pegar.
- Si el usuario pega texto enriquecido desde otra aplicación, se pueden inyectar etiquetas HTML arbitrarias en el contenido del span, obligando a lógica de sanitización adicional que sería innecesaria con un simple `<textarea>`.

**Evidencia.**
Inspección de `pages/contact.vue:85-94` y del DOM renderizado.

**Pasos para reproducir.**

1. Abrir `/contact` en un dispositivo móvil táctil.
2. Pulsar sobre el campo "Mensaje" y observar la barra de herramientas del teclado virtual y el comportamiento al pegar texto.

**Impacto.**
Fricción innecesaria al escribir, pérdida de accesibilidad y riesgo de captura de formato no deseado.

**Recomendación.**
Sustituir el elemento `<span>` por un `<textarea>` nativo estilizado con las mismas clases de Tailwind:

```html
<textarea
    id="message"
    v-model="form.message"
    rows="5"
    class="w-full rounded-lg bg-surface-container-high border border-outline-variant p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
    placeholder="Escribe aquí tu mensaje..."
    required
></textarea>
```

**Verificación de la corrección.**
Comprobar que el elemento en el DOM es un `<textarea>`, que `v-model` enlaza directamente el texto plano y que los atajos de teclado y portapapeles funcionan con normalidad.

---

### UX-003 — Enlace externo roto en la página `/social` (Stack Overflow en español devuelve HTTP 403)

| Campo                   | Valor                                                   |
| ----------------------- | ------------------------------------------------------- |
| Severidad               | Baja                                                    |
| Prioridad               | P3                                                      |
| Confianza               | Verificado                                              |
| Esfuerzo                | XS                                                      |
| Ámbito                  | Código                                                  |
| Ubicación               | `pages/social.vue:42`, `evidencias/axe/linkinator.json` |
| Dispositivo / navegador | Todos                                                   |
| Referencias             | Heurística #10 de Nielsen (Consistencia y estándares)   |
| Relacionado con         | SEO-007                                                 |

**Descripción.**
En la página de redes y perfiles profesionales (`/social`), se enlaza al perfil de Stack Overflow en español:
`https://es.stackoverflow.com/users/82651/raupulus`.
Al auditar los enlaces del sitio con `linkinator`, dicha URL devuelve un código de estado `HTTP 403 Forbidden`, debido a bloqueos de Cloudflare o a que el perfil se encuentra inactivo/privado. El usuario que hace clic se encuentra con una pantalla de error del proveedor.

**Evidencia.**
Salida de `linkinator` (`evidencias/axe/linkinator.json`):

```json
{
    "url": "https://es.stackoverflow.com/users/82651/raupulus",
    "status": 403,
    "state": "BROKEN"
}
```

**Pasos para reproducir.**

1. Abrir `https://raupulus.dev/social`.
2. Hacer clic en la tarjeta correspondiente a Stack Overflow en español.

**Impacto.**
Sensación de descuido o enlaces desactualizados en el portfolio.

**Recomendación.**
Actualizar la URL al perfil global en inglés (`https://stackoverflow.com/users/82651/raupulus`) si está activo, o sustituir la tarjeta por otra red activa (ej. Bluesky, donde el autor tiene presencia reciente).

**Verificación de la corrección.**
Comprobar con `curl -I <nueva-url>` que responde HTTP 200.

---

### UX-004 — Archivo gráfico huérfano de 471 KB (`public/patterns/a.png`) publicado innecesariamente en producción

| Campo                   | Valor                                         |
| ----------------------- | --------------------------------------------- |
| Severidad               | Baja                                          |
| Prioridad               | P3                                            |
| Confianza               | Verificado                                    |
| Esfuerzo                | XS                                            |
| Ámbito                  | Código                                        |
| Ubicación               | `public/patterns/a.png`                       |
| Dispositivo / navegador | —                                             |
| Referencias             | Limpieza de artefactos y peso del repositorio |
| Relacionado con         | —                                             |

**Descripción.**
En la carpeta pública del proyecto existe el archivo binario `public/patterns/a.png`, con un peso de 471 KB.
La búsqueda global en el código fuente confirma que no es referenciado por ningún componente Vue, hoja de estilos CSS, metadato ni archivo de configuración. Al encontrarse en `public/`, Nitro lo copia automáticamente al build estático de producción `.output/public/patterns/a.png`, consumiendo almacenamiento y ancho de banda en el repositorio git.

**Evidencia.**

```bash
$ ls -lh public/patterns/a.png
-rw-r--r--  1 fryntiz  staff   471K Oct  4 18:40 public/patterns/a.png

$ grep -rn "patterns/a.png" . --exclude-dir={.git,.output,node_modules,dist}
# (Sin ninguna coincidencia)
```

**Pasos para reproducir.**

1. Buscar referencias en el código fuente hacia `patterns/a.png`.
2. Verificar su presencia en `.output/public/patterns/a.png`.

**Impacto.**
471 KB de peso muerto en el despliegue y en el clon del repositorio.

**Recomendación.**
Eliminar el archivo `public/patterns/a.png` (y el directorio `public/patterns/` si queda vacío).

**Verificación de la corrección.**
Comprobar que tras `npm run generate`, el archivo ya no existe en `.output/public/patterns/a.png`.

---

## Verificado y Correcto

Durante la evaluación de UX, UI y contenido se verificaron positivamente los siguientes aspectos:

1. **Identidad visual consistente:** La aplicación aplica con fidelidad los tokens del design system "Silicon Architect", manteniendo un tema oscuro de alto contraste elegante y apropiado para un perfil de ingeniería de software.
2. **Jerarquía visual y legibilidad:** Tipografía bien estructurada con Space Grotesk para titulares y Plus Jakarta Sans para cuerpo de texto.
3. **Acceso directo a recursos clave:** El botón de descarga directa de CV en PDF y el acceso al catálogo de proyectos se encuentran inmediatamente disponibles en la cabecera y el hero.
4. **Estados visuales interactivos:** Efectos visuales sutiles en tarjetas de tecnologías y proyectos (transiciones al pasar el cursor, cambios de borde e iluminación suave de fondo).
