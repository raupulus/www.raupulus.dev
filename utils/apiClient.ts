/**
 * Cliente API centralizado para comunicación con api.raupulus.dev
 *
 * Uso en composables (contexto Nuxt disponible):
 *   const data = await apiGet<MyType>('/endpoint');
 *
 * Uso en nuxt.config.ts (sin contexto Nuxt):
 *   const data = await apiFetchRaw<MyType>('https://api.raupulus.dev/api/v1/endpoint');
 */

/**
 * GET request usando el contexto de Nuxt (runtimeConfig disponible).
 * Para usar en composables y páginas.
 */
export async function apiGet<T>(path: string): Promise<T | null> {
  const runtimeConfig = useRuntimeConfig();
  const API_BASE = runtimeConfig.public.api.base;
  const url = `${API_BASE}${path}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for ${url}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API GET error [${path}]:`, error);
    return null;
  }
}

/**
 * POST request con CSRF token.
 * Para usar en composables y páginas.
 */
export async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T | null> {
  const runtimeConfig = useRuntimeConfig();
  const API_BASE = runtimeConfig.public.api.base;
  const url = `${API_BASE}${path}`;

  const csrfToken = useCookie('XSRF-TOKEN');

  if (!csrfToken.value) {
    await fetchCsrfTokenInternal(API_BASE);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken.value ?? '',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for ${url}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API POST error [${path}]:`, error);
    throw error;
  }
}

/**
 * Fetch CSRF token desde la API.
 */
async function fetchCsrfTokenInternal(apiBase: string): Promise<void> {
  try {
    const response = await fetch(`${apiBase}/auth/csrf-cookie`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    if (process.env.NODE_ENV === 'development') {
      const csrfToken = useCookie('XSRF-TOKEN').value;
      console.log('CSRF-TOKEN fetched:', csrfToken);
    }
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
}

/**
 * Fetch raw sin contexto de Nuxt.
 * Para usar en nuxt.config.ts (hooks de prerender, sitemap).
 */
export async function apiFetchRaw<T>(fullUrl: string): Promise<T | null> {
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for ${fullUrl}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API raw fetch error [${fullUrl}]:`, error);
    return null;
  }
}
