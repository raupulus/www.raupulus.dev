import type { ApiResponseType } from '~/types/ApiResponse';

/**
 * Lee la cookie XSRF-TOKEN directamente del navegador.
 *
 * Laravel la envía URL-encoded, por lo que hay que decodificarla antes de
 * usarla en la cabecera X-XSRF-TOKEN (si no, el servidor responde 419).
 */
function getXsrfTokenFromCookie(): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);

  return match?.[1] ? decodeURIComponent(match[1]) : '';
}

/**
 * Solicita al backend la cookie CSRF (Laravel Sanctum) y devuelve su valor.
 *
 * La ruta es `/sanctum/csrf-cookie`, en el dominio de la API (fuera de `/api/v2`).
 */
export async function fetchCsrfToken(): Promise<string> {
  const apiDomain = useApiDomain();

  const response = await fetch(apiDomain + '/sanctum/csrf-cookie', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener el token CSRF');
  }

  return getXsrfTokenFromCookie();
}

/**
 * Envía una petición POST JSON a la API con credenciales y token CSRF.
 *
 * Devuelve el JSON de la respuesta (envelope de la API V2) también en errores
 * de validación (4xx), ya que la API responde con `{ success: false, message,
 * errors }` y la interfaz debe mostrarlos.
 * Solo lanza excepción ante fallos de red o respuestas sin JSON.
 */
export default async function fetchPost(url: string, body: Record<string, unknown>): Promise<ApiResponseType<unknown>> {
  let csrfToken = getXsrfTokenFromCookie();

  if (!csrfToken) {
    csrfToken = await fetchCsrfToken();
  }

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': csrfToken,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => null);

  if (json === null) {
    throw new Error(`Respuesta no válida del servidor (HTTP ${response.status})`);
  }

  return json;
}
