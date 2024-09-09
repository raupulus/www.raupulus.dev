import type { ContentPageType } from "~/types/ContentPageType";

const page = ref<ContentPageType>();

async function getPage(pageOrder: number, contentSlug: string | undefined) {
  const runtimeConfig = useRuntimeConfig()
  const API_BASE = runtimeConfig.public.api.base;

  // TODO: Dinamizar esta parte en base a la página pulsada
  const url = API_BASE + '/content/' + contentSlug + '/get/page/' + pageOrder + '/json';

  return await fetch(url, {
    'method': 'GET',
    //'mode': 'cors',
    //'cache': 'no-cache',
    //'credentials': 'include',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
    .then(res => res.json())
    .then(data => {
      const tmpPage = data?.page

      if (tmpPage) {
        tmpPage.content = JSON.parse(data.page.content)
      }

      page.value = data?.page;
    });
}

export const usePageData = (pageOrder: number, contentSlug: string | undefined) => {
  getPage(pageOrder, contentSlug)

  return page
}

export function getPageData() {
  return page
}
