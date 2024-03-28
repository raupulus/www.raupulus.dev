export const getTechnologyBySlug = (slug: string) => {
  return getPlatformData()
    .value
    ?.technologies
    ?.find(t => t.slug === slug)
}
