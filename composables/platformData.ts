import type { PlatformDataType } from "@/types/Platform/PlatformDataType";

export const usePlatformData = async () => {
  const platformData = useState<PlatformDataType | undefined>('platformData', () => undefined);

  // Si ya hay datos cacheados, no volver a cargar
  if (platformData.value) {
    return platformData;
  }

  const API_BASE = useApiBase();

  try {
    const response = await $fetch<{ data: PlatformDataType }>(
      `${API_BASE}/platform/portfolio/info`
    );
    platformData.value = response.data;
  } catch (error) {
    console.error('Error fetching platform data:', error);
  }

  return platformData;
};

export function getPlatformData() {
  return useState<PlatformDataType | undefined>('platformData', () => undefined);
}