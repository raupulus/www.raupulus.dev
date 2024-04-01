import type { PlatformDataType } from "@/types/Platform/PlatformDataType";

const platformData = ref<PlatformDataType>();

async function getPlatformInfo() {
  const runtimeConfig = useRuntimeConfig()
  const API_BASE = runtimeConfig.public.api.base

  fetch(API_BASE + '/platform/portfolio/info')
    .then(res => res.json())
    .then(all => platformData.value = all.data)
    .catch(err => console.log('FETCH 1', err));
}

export const usePlatformData = () => {
  getPlatformInfo()

  return platformData
}

export function getPlatformData() {
  return platformData
}
