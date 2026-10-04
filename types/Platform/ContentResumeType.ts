
export type ContentResumeType = {
    total: number
    types: {
        id: number
        slug: string
        name: string
        plural_name: string
        description: string | null
        total: number
    }[]
}
