/**
 * Devuelve la URL base correcta de la API según el contexto de ejecución.
 *
 * - Server-side (SSR/SSG): Usa la URL completa de la API (sin problemas de CORS)
 * - Client-side en desarrollo: Usa una ruta proxy para evitar CORS
 * - Client-side en producción: Usa la URL completa (la API tiene CORS configurado)
 */
export function useApiBase(): string {
  const config = useRuntimeConfig();

  // Server-side: acceso directo, no hay CORS
  if (import.meta.server) {
    return config.public.api.base;
  }

  // Client-side en desarrollo: usar proxy para evitar CORS
  if (import.meta.dev) {
    return '/_proxy/api/v1';
  }

  // Client-side en producción: acceso directo (la API tiene CORS configurado)
  return config.public.api.base;
}
