# Formulario de Contacto

Formulario de contacto multi-paso con validación en tiempo real, protección Google reCAPTCHA v3 y modal de confirmación.

## Archivos principales

| Archivo | Rol |
|---------|-----|
| `pages/contact.vue` | Página del formulario de contacto |
| `composables/useGoogleRecaptcha.ts` | Wrapper de reCAPTCHA v3 |
| `composables/fetchPostData.ts` | Envío POST con CSRF token |
| `plugins/google-recaptcha.ts` | Plugin de inicialización de reCAPTCHA |
| `components/modals/submitContact.vue` | Modal de confirmación y resultado |

## Ruta

- **URL**: `/contact`

## Campos del formulario

| Campo | Tipo | Validaciones |
|-------|------|-------------|
| `name` | `string` | minLength: 5, maxLength: 50 |
| `email` | `string` | minLength: 8, maxLength: 50, regexp: email válido |
| `subject` | `string` | minLength: 10, maxLength: 100 |
| `message` | `string` | minLength: 30, maxLength: 1000 |
| `privacity` | `boolean` | required: true |

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
   - Ejecuta reCAPTCHA v3 (`RecaptchaAction.contact`) para obtener token
   - Envía POST (via `fetchPost`, con cookie CSRF de Laravel Sanctum) con los datos + `captcha_token`
   - **El servidor Laravel valida el token reCAPTCHA con la clave privada y es quien envía el email**
4. **Paso 3**: Muestra resultado (éxito o errores devueltos por la API)

## Seguridad anti-bots

| Medida | Dónde | Detalle |
|--------|-------|---------|
| reCAPTCHA v3 | Cliente + **servidor** | Token generado al confirmar; la API lo valida con la clave privada. Con token inválido la API responde `403` y alerta al administrador (verificado) |
| CSRF (Sanctum) | Cliente + servidor | `fetchPost` obtiene `XSRF-TOKEN` de `/auth/csrf-cookie`, la decodifica (viene URL-encoded) y la envía en `X-XSRF-TOKEN`; sin ella la API responde `419`. Se pre-carga en `onMounted` |
| Honeypot | Cliente | Campo oculto `website` (off-screen, `tabindex=-1`, `aria-hidden`). Si llega relleno se simula éxito sin llamar a la API |
| Tiempo mínimo | Cliente | Envíos antes de 3 s desde la carga se tratan como bot (éxito simulado) |
| Doble envío | Cliente | Flag `isSubmitting` impide peticiones concurrentes |
| Límites duros | Cliente + servidor | `maxlength` en inputs (50/50/100) además de las validaciones JS; el servidor revalida todo |
| Origen | Servidor | La API comprueba Origin/Referer e IPs bloqueadas (respuesta `403 "Origen erróneo..."`) |

## Formatos de respuesta de la API que maneja el cliente

- Éxito / validación: `{ messages: { success: [...], errors: [...] }, data: { send: boolean } }` (errors puede ser array u objeto por campo)
- Error de seguridad/origen/captcha: `{ status: 'ko', error: { httpCode, message } }` → se muestra `error.message`
- Respuesta sin JSON o fallo de red → mensaje genérico de error

## Payload enviado a la API

```typescript
{
  app_name: string,       // De runtimeConfig
  app_domain: string,     // De runtimeConfig
  language: string,       // 'es'
  name: string,
  email: string,
  subject: string,
  message: string,
  privacity: boolean,
  contactme: boolean,
  captcha_token: string   // Token de reCAPTCHA v3
}
```

## Endpoint API

- **POST** `${API_BASE}/${API_PATH_CONTACT}` — envía correo de contacto

## Sistema de validación

- `checkValidations(field)`: valida minLength, maxLength, regexp, required
- `checkValidationsFromEvent(e)`: validación en tiempo real (`@keyup`)
- `handleKeyup(event, field)`: especial para el campo message (usa `contenteditable` en lugar de textarea)
- `formIsValid()`: valida todos los campos del formulario
- Los errores se muestran debajo de cada campo

## reCAPTCHA v3

- Badge visible solo en `/contact` (se oculta al salir via `router.afterEach`)
- `onMounted`: muestra badge con delay de 1 segundo
- `onBeforeUnmount`: oculta badge

## Template

- **Grid 2/3 + 1/3**: formulario (izquierda) + info de contacto (derecha)
- **Aviso temporal**: banner informando que el servicio está temporalmente fuera
- Campo mensaje usa `contenteditable` span con textarea oculta sincronizada

## SEO

- Open Graph y Twitter Cards con imagen `/social/contact.webp`

## Relaciones con otros módulos

- → [composables.md](./composables.md): `useGoogleRecaptcha()`, `fetchPost()`
- → [plugins-middleware.md](./plugins-middleware.md): plugin `google-recaptcha.ts`
- → [componentes-modals.md](./componentes-modals.md): `ModalsSubmitContact`
