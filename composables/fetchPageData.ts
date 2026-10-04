import type { ApiResponseType } from "~/types/ApiResponse";
import type { ContentPageType } from "~/types/ContentPageType";

/**
 * Página del proyecto que se está mostrando en el modal.
 *
 * Es un estado compartido: lo escriben `usePageData()` / `setCurrentPage()`
 * y lo lee el modal (`components/modals/projectShow.vue`).
 */
export function getPageData() {
  return useState<ContentPageType | undefined>('projectCurrentPage', () => undefined);
}

/**
 * Fija la página actual a partir de una página ya descargada (por ejemplo,
 * `first_page` del detalle del proyecto), sin otra petición a la API.
 */
export function setCurrentPage(page: ContentPageType | null | undefined) {
  const current = getPageData();
  current.value = page ? normalizePage(page) : undefined;
  return current;
}

/**
 * Descarga una página de un proyecto por su número (`order`) en formato
 * Editor.js y la deja como página actual.
 */
export const usePageData = async (pageOrder: number, contentSlug: string | undefined) => {
  const page = getPageData();

  if (!contentSlug) {
    page.value = undefined;
    return page;
  }

  const API_BASE = useApiBase();
  const url = `${API_BASE}/platforms/${PLATFORM_SLUG}/contents/${encodeURIComponent(contentSlug)}/pages/${pageOrder}?format=editorjs`;

  try {
    const res = await $fetch<ApiResponseType<ContentPageType>>(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    page.value = res?.data ? normalizePage(res.data) : undefined;
  } catch (error) {
    console.error('Error fetching page data:', error);
    page.value = undefined;
  }

  return page;
};
