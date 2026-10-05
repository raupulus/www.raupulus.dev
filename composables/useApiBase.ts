/**
 * Prefijo de las rutas proxy de desarrollo (ver `routeRules` en nuxt.config.ts).
 */
const DEV_PROXY_PREFIX = '/_proxy';

/**
 * Devuelve la URL base correcta de la API (`/api/v2`) según el contexto de ejecución.
 *
 * - Server-side (SSR/SSG): Usa la URL completa de la API (sin problemas de CORS)
 * - Client-side en desarrollo: Usa una ruta proxy para evitar CORS
 * - Client-side en producción: Usa la URL completa (la API tiene CORS configurado)
 */
export function useApiBase(): string {
    const config = useRuntimeConfig();

    // Client-side en desarrollo: usar proxy para evitar CORS.
    // Se conserva la ruta de API_BASE_URL (ej. /api/v2) para no fijar la versión aquí.
    if (import.meta.client && import.meta.dev) {
        return DEV_PROXY_PREFIX + new URL(config.public.api.base).pathname.replace(/\/$/, '');
    }

    // Server-side o cliente en producción: acceso directo
    return config.public.api.base;
}

/**
 * Devuelve el dominio de la API (sin `/api/v2`), para rutas fuera del grupo
 * `api` como `/sanctum/csrf-cookie` o `/cv/pdf`, con el mismo criterio que
 * `useApiBase()`.
 */
export function useApiDomain(): string {
    const config = useRuntimeConfig();

    if (import.meta.client && import.meta.dev) {
        return DEV_PROXY_PREFIX;
    }

    return config.public.api.domain;
}
