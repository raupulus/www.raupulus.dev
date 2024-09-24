import type { ContentPageType } from "~/types/ContentPageType";
import { ref } from 'vue';

const page = ref<ContentPageType>();

async function getPage(pageOrder: number, contentSlug: string | undefined): Promise<typeof page> {
  const runtimeConfig = useRuntimeConfig();
  const API_BASE = runtimeConfig.public.api.base;

  const url = `${API_BASE}/content/${contentSlug}/get/page/${pageOrder}/json`;

  const response = await fetch(url, {
    'method': 'GET',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }).catch(page.value = undefined);

  const data = await response.json();
  const tmpPage = data?.page;

  if (tmpPage) {
    tmpPage.content = JSON.parse(data.page.content);
    page.value = tmpPage;
  }

  return page;
}

export const usePageData = (pageOrder: number, contentSlug: string | undefined): Promise<typeof page> => {
  return getPage(pageOrder, contentSlug);
};

export function getPageData() {
  return page;
}
