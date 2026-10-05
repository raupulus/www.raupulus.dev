import type { ApiResponseType } from '@/types/ApiResponse';
import type { PlatformDataType } from '@/types/Platform/PlatformDataType';

export const usePlatformData = async () => {
    const platformData = useState<PlatformDataType | undefined>('platformData', () => undefined);

    // Si ya hay datos cacheados, no volver a cargar
    if (platformData.value) {
        return platformData;
    }

    const API_BASE = useApiBase();

    try {
        // Ficha de la plataforma: tecnologías, redes, autor, recuentos y páginas
        const response = await $fetch<ApiResponseType<PlatformDataType>>(`${API_BASE}/platforms/${PLATFORM_SLUG}`);
        platformData.value = response.data;
    } catch (error) {
        console.error('Error fetching platform data:', error);
    }

    return platformData;
};

export function getPlatformData() {
    return useState<PlatformDataType | undefined>('platformData', () => undefined);
}
