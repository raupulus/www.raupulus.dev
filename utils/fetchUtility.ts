import { type CookieRef } from "nuxt/app";
const csrfToken: CookieRef<string> = useCookie('XSRF-TOKEN');

const runtimeConfig = useRuntimeConfig()
const API_BASE = runtimeConfig.public.api.base

async function fetchCsrfToken() {
  return await fetch(API_BASE + '/v1/auth/csrf-cookie')
    .then(response => response.json())
    .then(data => data.csrf_token);
}

export default async (url: string, params: {}) => {
  if (!csrfToken.value) {
    console.log('NO Hay token');

    csrfToken.value = await fetchCsrfToken();
  }

  return fetch(url, {
    'method': 'POST',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      //'Origin': 'XXXXXXXXXXXXXXXXXXXXX',
      'XSRF-TOKEN': csrfToken.value,
    }
  })
}
