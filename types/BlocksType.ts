export type BlockTunesType = {
    textVariant?: string, // citation, call-out
}

export type BlockType = {
    id: string,
    type: string,
    tunes?: BlockTunesType
}

export type BlocksType = {
    time: number,
    blocks: BlockType[],
    version: string,
}

export type BlockRawType = BlockType & {
    data: {
        html: string, // Contiene HTML como cadena
    }
}

export type BlockParagraphType = BlockType & {
    data: {
        text: string
    }
}

export type BlockHeaderType = BlockType & {
    data: {
        text: string,
        level: number,
    }
}

export type BlockCodeType = BlockType & {
    data: {
        code: string,
        language: string,
        showlinenumbers: boolean,
    }
}

export type BlockWarningType = BlockType & {
    data: {
        title: string,
        message: string,
    }
}

export type BlockQuoteType = BlockType & {
    data: {
        text: string,
        caption: string,
        alignment: string, // left, center, right
    }
}

export type BlockListType = BlockType & {
    data: {
        style: string, // ordered, unordered
        items: string[],
    }
}

export type BlockCheckListType = BlockType & {
    data: {
        items: [
            {
                text: string,
                checked: boolean,
            }
        ],
    }
}

export type BlockAttachesType = BlockType & {
    data: {
        file: {
            url: string,
            title: string,
            name: string,
            alt: string,
            path: string,
            extension: string,
            mime: string,
            size: number,
            file_type_image: string,
            url_thumbnail: string,
            path_thumbnail: string,
            url_large: string,
            path_large: string,
            content_id: number,
            content_file_id: number,
            file_id: number,
            module: string, // content
        },
        title: string,
    }
}

export type BlockImageType = BlockType & {
    data: {
        file: {
            url: string,
            path: string,
            url_thumbnail: string,
            path_thumbnail: string,
            url_large: string,
            path_large: string,
            content_id: number,
            content_file_id: number,
            file_id: number,
            module: string, // content
            title: string,
            alt: string,
            name: string,
            extension: string,
            mime: string,
            size: number,
            file_type_image: string,
        },
        caption: string,
        withBorder: boolean,
        withBackground: boolean,
        stretched: boolean,
    }
}

export type BlockDelimiterType = BlockType & {
    data: {}
}

export type BlockAlertType = BlockType & {
    data: {
        type: string, // info, success, warning, danger, primary, secondary, dark, light
        title: string,
        message: string,
        align: string, // left, center, right
    }
}

export type BlockLinkToolType = BlockType & { // Link Preview
    data: {
        link: string,
        meta: {
            title: string,
            description: string,
            keywords: string,
            image?: {
                url: string,
            }
            images?: string[], // Imágenes en base64
            content_page_id?: number,
            content_page_url?: string,
        }
    }
}

export type BlockEmbedType = BlockType & {
    data: {
        link: string,  // Enlace del vídeo embebido
        service: string, // youtube, vimeo, twitter, instagram, facebook, vine, vk
        source: string,
        embed: string,
        width: number,
        height: number,
        caption: string,
    }
}

export type BlockTableType = BlockType & {
    data: {
        content: string[][], // Todas las filas/columnas
        withHeadings: boolean, // Fila 0 será la cabecera si es true
    }
}
