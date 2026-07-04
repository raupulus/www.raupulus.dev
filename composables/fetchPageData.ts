import type { ContentPageType } from "~/types/ContentPageType";

export const usePageData = async (pageOrder: number, contentSlug: string | undefined) => {
  const page = useState<ContentPageType | undefined>(`page-${contentSlug}-${pageOrder}`, () => undefined);
  const API_BASE = useApiBase();
  const url = `${API_BASE}/content/${contentSlug}/get/page/${pageOrder}/json`;

  try {
    const data = await $fetch<{ page: ContentPageType & { content: string } }>(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const tmpPage = data?.page;

    if (tmpPage) {
      tmpPage.content = JSON.parse(data.page.content);
      page.value = tmpPage;
    }
  } catch (error) {
    console.error('Error fetching page data:', error);
    page.value = undefined;
  }

  return page;
};

export function getPageData(contentSlug: string, pageOrder: number) {
  return useState<ContentPageType | undefined>(`page-${contentSlug}-${pageOrder}`, () => undefined);
}