# Formulario de Contacto

Formulario de contacto multi-paso con validación en tiempo real, protección Cloudflare Turnstile y modal de confirmación.

## Archivos principales

| Archivo                               | Rol                               |
| ------------------------------------- | --------------------------------- |
| `pages/contact.vue`                   | Página del formulario de contacto |
| `composables/fetchPostData.ts`        | Envío POST con CSRF token         |
| `components/modals/submitContact.vue` | Modal de confirmación y resultado |

## Ruta

- **URL**: `/contact`

## Campos del formulario

| Campo       | Tipo      | Validaciones                                      |
| ----------- | --------- | ------------------------------------------------- |
| `name`      | `string`  | minLength: 5, maxLength: 50                       |
| `email`     | `string`  | minLength: 8, maxLength: 50, regexp: email válido |
| `subject`   | `string`  | minLength: 10, maxLength: 100                     |
| `message`   | `string`  | minLength: 30, maxLength: 1000                    |
| `privacity` | `boolean` | required: true (Aceptación de Política)           |
| `consent`   | `boolean` | required: true (Consentimiento de tratamiento)    |

Bajo los checkboxes se incluye la **primera capa informativa de protección de datos (Art. 11 LOPDGDD)**: responsable, finalidad, legitimación, destinatarios, derechos y enlace a la política completa.

## Interfaces TypeScript locales

```typescript
interface Validation {
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    regexp?: { value: string; message: string };
    required?: { value: boolean; message: string };
}

interface FormField {
    valid: boolean;
    value: string | boolean;
    validations: Validation;
    errors?: string[];
}

interface FormData {
    valid: boolean;
    [key: string]: FormField | boolean;
}
```

## Flujo de envío (multi-paso)

1. **Paso 1**: Usuario completa formulario → click "Enviar Mensaje" (o Enter, que pasa por la misma ruta) → `showConfirmModal()` valida todos los campos
2. Si válido → abre `ModalsSubmitContact` con resumen
3. **Paso 2**: Confirma → `handleSubmit()`:
    - Comprueba trampas anti-bot (honeypot, tiempo mínimo) y bloqueo de doble envío
    - Verifica token de Cloudflare Turnstile (`turnstileToken`)
    - Envía `POST /contact-messages` (API V2, via `fetchPost`, con cookie CSRF de Laravel Sanctum) con los datos + `cf-turnstile-response` y `turnstile_token`
4. **Paso 3**: Muestra resultado (éxito o errores devueltos por la API) y resetea el widget Turnstile.
5. **Post-envío exitoso (Cooldown & Limpieza)**:
    - **Limpieza del formulario (`resetForm()`)**: Se vacían todos los campos de texto (`name`, `email`, `subject`, `message`), se desmarcan los checkboxes de privacidad y consentimiento, y se limpian los estados de validación/errores y honeypot.
    - **Temporizador de enfriamiento (5 minutos / 300 s)**: Se activa un cooldown con persistencia en `localStorage` (`contact_cooldown_until`) para evitar que el usuario vuelva a enviar el formulario de inmediato, incluso tras recargar la página.
    - **Botón de envío deshabilitado**: Muestra el temporizador regresivo (`Enviar Mensaje (MM:SS)`) y bloquea cualquier intento de envío o apertura del modal.
    - **Banner visual superior**: Se muestra una alerta destacada encima del formulario informando de que el mensaje fue recibido recientemente, que se responderá lo antes posible y mostrando la cuenta atrás de reactivación.

## Seguridad anti-bots

| Medida               | Dónde                    | Detalle                                                                                                                                                                                                 |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Turnstile | Cliente + **servidor**   | Token generado por el widget (`cf-turnstile-response` / `turnstile_token`); la API lo valida con la clave secreta en Cloudflare. Si es inválido responde `422` y no guarda el mensaje                   |
| CSRF (Sanctum)       | Cliente + servidor       | `fetchPost` obtiene `XSRF-TOKEN` de `{API_DOMAIN_URL}/sanctum/csrf-cookie`, la decodifica (viene URL-encoded) y la envía en `X-XSRF-TOKEN`; sin ella la API responde `419`. Se pre-carga en `onMounted` |
| Honeypot             | Cliente                  | Campo oculto `website` (off-screen, `tabindex=-1`, `aria-hidden`). Si llega relleno se simula éxito sin llamar a la API                                                                                 |
| Tiempo mínimo        | Cliente                  | Envíos antes de 3 s desde la carga se tratan como bot (éxito simulado)                                                                                                                                  |
| Doble envío          | Cliente                  | Flag `isSubmitting` impide peticiones concurrentes                                                                                                                                                      |
| Cooldown (5 min)     | Cliente (`localStorage`) | Tras un envío correcto, el botón se bloquea durante 5 minutos mostrando un contador regresivo y se muestra un banner superior para evitar spam y envíos duplicados                                      |
| Límites duros        | Cliente + servidor       | `maxlength` en inputs además de las validaciones JS; el servidor revalida todo                                                                                                                          |
| Límite de envíos     | Servidor                 | 5 mensajes/hora por IP; pasado responde `429`                                                                                                                                                           |
| Prioridad / spam     | Servidor                 | La API puntúa el mensaje (turnstile, dominio, enlaces, referer…) y sólo reenvía los de prioridad suficiente; nunca se lo dice al remitente                                                              |

## Formatos de respuesta de la API que maneja el cliente

Envelope de la API V2 (`ApiResponseType`):

- Éxito `201`: `{ success: true, message: 'Mensaje recibido correctamente', data: null }` → se muestra `message`
- Validación `422`: `{ success: false, message, errors: { campo: [...] } }` → se muestran los errores por campo (`apiErrorMessages()`)
- Captcha `422` / límite `429`: `{ success: false, message }` → se muestra `message`
- Respuesta sin JSON o fallo de red → mensaje genérico de error

## Payload enviado a la API

```typescript
{
  name: string,           // máx. 255
  email: string,
  subject: string,
  message: string,        // 10 a 5000 caracteres
  privacity: boolean,
  contactme: boolean,
  'cf-turnstile-response': string, // Token de Cloudflare Turnstile
  turnstile_token: string          // Token de Cloudflare Turnstile (alias backend)
}
```

La plataforma la deduce la API del `Referer` y el idioma de `Accept-Language` (los envía el navegador).

## Endpoint API

- **POST** `${API_BASE}/${API_PATH_CONTACT}` → `/api/v2/contact-messages` (por defecto si `API_PATH_CONTACT` está vacía) — registra el mensaje de contacto

## Sistema de validación

- `checkValidations(field)`: valida minLength, maxLength, regexp, required
- `checkValidationsFromEvent(e)`: validación en tiempo real (`@input`/`@change`)
- `formIsValid()`: valida todos los campos del formulario
- Los errores se muestran debajo de cada campo

## Cloudflare Turnstile

- Componente `<NuxtTurnstile>` integrado antes del botón de envío
- Validación en tiempo de envío verificando `turnstileToken`
- Reseteo automático tras el envío con `turnstileRef.value?.reset()`

## Template

- **Grid 2/3 + 1/3**: formulario (izquierda) + columna lateral de información (derecha)
- Campo mensaje con contador dinámico de caracteres sobre 2000
- **Columna lateral**:
    - Ficha de información directa (email público, ubicación, tiempo de respuesta estimado)
    - Tarjeta de **Protección Antispam**: aviso sobre filtros múltiples de seguridad (descarte automático de duplicados y mensajes de baja calidad/spam) y botón directo de contacto por **LinkedIn** ante la saturación de bots en la red

## SEO

- Open Graph y Twitter Cards con imagen `/social/contact.webp`

## Relaciones con otros módulos

- → [composables.md](./composables.md): `fetchPost()`
- → [componentes-modals.md](./componentes-modals.md): `ModalsSubmitContact`
