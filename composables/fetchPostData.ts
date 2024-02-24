import { type CookieRef } from "nuxt/app";

export async function fetchCsrfToken() {
  const runtimeConfig = useRuntimeConfig()
  const API_BASE = runtimeConfig.public.api.base

  return await fetch(API_BASE + '/auth/csrf-cookie', {
    //'mode': 'cors',
    //'cache': 'no-cache',
    //'credentials': 'include',
    'headers': {
      'Accept': 'application/json',
      //'Content-Type': 'application/json',
      //'Origin': 'raupulus.dev',
      //'Access-Control-Allow-Origin': 'true',
      //"Access-Control-Allow-Credentials": 'true',
      //'X-XSRF-TOKEN': useCookie('XSRF-TOKEN').value ?? '',
    },
  })
  //.then(response => response.json())
  //.then(data => useCookie('XSRF-TOKEN').value = data.coo);
}


export default async function fetchPost(url: string, body: {}) {
  const csrfToken: CookieRef<string> = useCookie('XSRF-TOKEN');

  if (!csrfToken.value) {
    await fetchCsrfToken();
  }

  return fetch(url, {
    'method': 'POST',
    'mode': 'cors',
    'cache': 'no-cache',
    'credentials': 'include',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': useCookie('XSRF-TOKEN').value ?? '',
    },
    body: JSON.stringify(body)
  })
}
