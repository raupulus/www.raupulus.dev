import { type CookieRef } from "nuxt/app";

export async function fetchCsrfToken() {
  const runtimeConfig = useRuntimeConfig();
  const API_BASE = runtimeConfig.public.api.base;

  try {
    const response = await fetch(API_BASE + '/auth/csrf-cookie', {
      'credentials': 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Optionally, check if the CSRF token is correctly set
    const csrfToken = useCookie('XSRF-TOKEN').value;
    console.log('CSRF-TOKEN fetched:', csrfToken);

    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
}

export default async function fetchPost(url: string, body: {}) {
  const csrfToken: CookieRef<string> = useCookie('XSRF-TOKEN');

  if (!csrfToken.value) {
    await fetchCsrfToken();
  }

  return fetch(url, {
    'method': 'POST',
    'mode': 'cors',
    'credentials': 'include',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': csrfToken.value ?? '',
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Failed to post data:', error);
      throw error;
    });
}
