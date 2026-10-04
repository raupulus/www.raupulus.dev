/**
 * Envelope común de todas las respuestas de la API V2.
 *
 *   Éxito:    { success: true, message, data, meta? }
 *   Error:    { success: false, message, errors? }
 */
export type ApiResponseType<T> = {
    success: boolean,
    message: string,
    data: T,
    meta?: ApiMetaType,
    errors?: Record<string, string[]>,
}

/**
 * Paginación de las colecciones de la API V2 (`meta`).
 */
export type ApiMetaType = {
    total: number,
    per_page: number,
    current_page: number,
    last_page: number,
    from: number | null,
    to: number | null,
}
