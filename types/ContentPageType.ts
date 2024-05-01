
export type ContentPageType = {
    id: number,
    content: string, //TODO??????? Crear tipo para contenido -> json?? compatible con editor JS
    title: string,
    slug: string,
    order?: number,
    images?: ContentPageImageType,
}

export type ContentPageImageType = {
    medium: string,
    normal: string,
    large: string,
}
