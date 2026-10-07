/**
 * Devuelve la URL base de la API (`/api/v2`).
 *
 * Devuelve directamente la URL configurada en `API_BASE_URL` (o su valor en
 * `runtimeConfig.public.api.base`). No se usa proxy en desarrollo porque el
 * backend Laravel ya tiene CORS configurado para admitir orígenes en localhost,
 * y pasar por un proxy enviaba la cabecera `X-Forwarded-Host: localhost:3020`,
 * haciendo que Laravel generase las URLs de las imágenes con el puerto del
 * frontend en vez del puerto de la API.
 */
export function useApiBase(): string {
    const config = useRuntimeConfig();

    return config.public.api.base;
}

/**
 * Devuelve el dominio de la API (sin `/api/v2`), para rutas fuera del grupo
 * `api` como `/sanctum/csrf-cookie` o `/cv/pdf`.
 */
export function useApiDomain(): string {
    const config = useRuntimeConfig();

    return config.public.api.domain;
}
