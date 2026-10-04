# 6.7 UX/UI y contenido (UX / CONT) — Auditoría externa deepsek-externo

Resumen: la estructura visual es coherente con el design system, pero hay señales de «sitio sin terminar» en
producción (banner de mantenimiento y formulario «fuera de servicio»), búsquedas no compartibles por URL,
erratas de contenido y varios datos desactualizados. La página de error no usa el layout (navegación mínima).

| ID       | Título                                                        | Sev.  | Prior. | Esf. |
| -------- | ------------------------------------------------------------- | ----- | ------ | ---- |
| UX-001   | Banner «En mantenimiento temporalmente» visible en producción | Media | P2     | XS   |
| UX-002   | El formulario de contacto se anuncia «fuera de servicio»      | Media | P2     | S    |
| UX-003   | Búsqueda/filtros de proyectos no reflejados en la URL         | Baja  | P3     | S    |
| UX-004   | `error.vue` sin layout (navegación mínima)                    | Baja  | P3     | S    |
| CONT-001 | Erratas y datos desactualizados en el contenido               | Baja  | P3     | S    |
| UX-005   | Ubicación genérica y refuerzo E-E-A-T insuficiente            | Baja  | P3     | S    |

---

### UX-001 — Banner «En mantenimiento temporalmente» visible en producción

| Campo     | Valor                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------ |
| Severidad | Media                                                                                            |
| Prioridad | P2                                                                                               |
| Confianza | Verificado                                                                                       |
| Esfuerzo  | XS                                                                                               |
| Ámbito    | Producción                                                                                       |
| Ubicación | HTML de producción (`<div class="maintenance-floating-banner">…En mantenimiento temporalmente…`) |

**Descripción.** El HTML desplegado incluye un banner flotante de mantenimiento visible al usuario. Da una
impresión de sitio inacabado o averiado.

**Evidencia.** `curl -sS https://raupulus.dev/ | grep -o 'maintenance-floating-banner'` → presente.

**Recomendación.** Retirar el banner cuando el sitio es operativo, o condicionarlo a un flag de build.

**Verificación de la corrección.** El HTML de producción no contiene el banner.

---

### UX-002 — El formulario de contacto se anuncia «fuera de servicio»

| Campo       | Valor                       |
| ----------- | --------------------------- |
| Severidad   | Media                       |
| Prioridad   | P2                          |
| Confianza   | Verificado                  |
| Esfuerzo    | S                           |
| Ámbito      | Producción / código         |
| Ubicación   | `pages/contact.vue:467-483` |
| Relacionado | BUG-003                     |

**Descripción.** `/contact` muestra un aviso de «Fuera de servicio temporalmente…» y sugiere usar redes
sociales, pero mantiene el formulario visible y activo. Es contradictorio y confunde sobre si se puede enviar.

**Recomendación.** Decidir el estado: si no funciona, deshabilitar el formulario y el CTA con un mensaje
claro; si funciona, quitar el aviso. Al arreglar BUG-003, retirarlo.

**Verificación de la corrección.** El mensaje y el estado del formulario son coherentes.

---

### UX-003 — Búsqueda/filtros no reflejados en la URL

| Campo     | Valor                                                                |
| --------- | -------------------------------------------------------------------- |
| Severidad | Baja                                                                 |
| Prioridad | P3                                                                   |
| Confianza | Verificado                                                           |
| Esfuerzo  | S                                                                    |
| Ámbito    | Código                                                               |
| Ubicación | `pages/projects/[...slugs].vue:62-96`, `composables/projectsData.ts` |

**Descripción.** La búsqueda y el filtro por tecnología no se sincronizan con la URL, por lo que no se pueden
compartir ni recuperar con el botón atrás/adelante. El estado del modal sí usa `history.pushState`.

**Recomendación.** Reflejar `q` y `technology` como query params (`router.replace`) y leerlos al montar.

**Verificación de la corrección.** Buscar+Filtrar actualiza la URL y recargar la reproduce.

---

### UX-004 — `error.vue` sin layout

| Campo       | Valor            |
| ----------- | ---------------- |
| Severidad   | Baja             |
| Prioridad   | P3               |
| Confianza   | Verificado       |
| Esfuerzo    | S                |
| Ámbito      | Código           |
| Ubicación   | `error.vue`      |
| Relacionado | BUG-002, BUG-004 |

**Descripción.** `error.vue` no usa `<NuxtLayout>`, así que la página 404/500 no tiene header ni footer; solo
ofrece «Volver al Inicio» y «Ver Proyectos». Es funcional pero rompe la navegación habitual.

**Recomendación.** Incluir el header/footer (o un subconjunto) en la página de error.

**Verificación de la corrección.** La página de error conserva navegación principal.

---

### CONT-001 — Erratas y datos desactualizados

| Campo     | Valor                                      |
| --------- | ------------------------------------------ |
| Severidad | Baja                                       |
| Prioridad | P3                                         |
| Confianza | Verificado                                 |
| Esfuerzo  | S                                          |
| Ámbito    | Ambos                                      |
| Ubicación | Producción (home/about), `pages/about.vue` |

**Descripción.** Se observan erratas en producción («Especilizándome», «stockage», «Afinidad por el software
libre») y datos a revisar (años de experiencia, tecnologías «angular/ionic/typescript/jquery/bootstrap», año
del copyright, vigencia de perfiles). `/about` no incluye una fecha de actualización del CV.

**Recomendación.** Revisión editorial y actualización periódica; añadir fecha de última actualización.

**Verificación de la corrección.** Sin erratas; datos y enlaces vigentes.

---

### UX-005 — Ubicación genérica y E-E-A-T

| Campo     | Valor                                          |
| --------- | ---------------------------------------------- |
| Severidad | Baja                                           |
| Prioridad | P3                                             |
| Confianza | Informativo                                    |
| Esfuerzo  | S                                              |
| Ámbito    | Código                                         |
| Ubicación | `pages/contact.vue:669-676`, `pages/about.vue` |

**Descripción.** El formulario muestra «Ubicación: España» cuando el portfolio declara Chipiona/Cádiz; falta
una foto real de perfil (se usa logotipo) y pruebas sociales concretas, que reforzarían E-E-A-T.

**Recomendación.** Mostrar la ubicación real (o «Cádiz, España»), foto de perfil y resultados cuantificados en
proyectos.

**Verificación de la corrección.** Datos coherentes entre páginas y metadatos.

---

## Verificado y correcto

- Menú de navegación claro, con estado activo (borde/subrayado) y CTA de contacto en header.
- Estados vacío/error del formulario con mensajes en español y conservación de lo escrito ante error.
- Feedback de carga en el botón «Cargar más» y en el envío del formulario.
- Etiquetas visibles en los campos del formulario (el placeholder no sustituye al label en nombre/email/asunto).
- Honeypot y tiempo mínimo anti-bot implementados, con doble envío bloqueado.
- Coherencia general con los tokens del design system (colores, tipografía headline/body/label).
- `prefers-reduced-motion` cubierto globalmente en CSS.
