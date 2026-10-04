import { describe, it, expect } from 'vitest'
import {
    apiErrorMessages,
    buildProjectMetatags,
    formatDate,
    hasNextPage,
    imageUrl,
    listCounterLabel,
    normalizeListItems,
    normalizePage,
} from '~/utils/ContentUtils'
import type { ContentType } from '~/types/ContentType'
import type { ContentPageType } from '~/types/ContentPageType'

const image = {
    url: 'https://api.test/file/get/content/1/original.png',
    thumbnails: {
        small: 'https://api.test/file/thumbnail/get/content/2/small.webp',
        large: 'https://api.test/file/thumbnail/get/content/3/large.webp',
    },
}

describe('ContentUtils', () => {
    it('imageUrl devuelve la miniatura pedida o cae a la original', () => {
        expect(imageUrl(image, 'small')).toBe(image.thumbnails.small)
        expect(imageUrl(image, 'medium')).toBe(image.url)
        expect(imageUrl(image)).toBe(image.url)
        expect(imageUrl(null, 'small')).toBeUndefined()
    })

    it('formatDate formatea fechas ISO y tolera valores vacíos o inválidos', () => {
        expect(formatDate('2024-12-07T16:25:15.000000Z')).toContain('2024')
        expect(formatDate(null)).toBe('')
        expect(formatDate('no-es-fecha')).toBe('')
    })

    it('hasNextPage usa current_page y last_page de meta', () => {
        const meta = { total: 15, per_page: 3, current_page: 1, last_page: 5, from: 1, to: 3 }
        expect(hasNextPage(meta)).toBe(true)
        expect(hasNextPage({ ...meta, current_page: 5 })).toBe(false)
        expect(hasNextPage(undefined)).toBe(false)
    })

    it('normalizePage convierte un body en texto JSON o vacío en bloques', () => {
        const base = { id: 1, content_id: 1, order: 1, title: 'T', slug: 't', format: 'editorjs' } as const

        const fromString = normalizePage({ ...base, body: '{"blocks":[{"id":"a","type":"paragraph"}]}' as never })
        expect(fromString.body.blocks).toHaveLength(1)

        const fromInvalid = normalizePage({ ...base, body: 'no json' as never })
        expect(fromInvalid.body.blocks).toEqual([])
    })

    it('apiErrorMessages aplana los errores de validación o usa el mensaje', () => {
        expect(apiErrorMessages({
            success: false,
            message: 'Datos no válidos',
            errors: { email: ['El email no es válido'], message: ['Muy corto'] },
        })).toEqual(['El email no es válido', 'Muy corto'])

        expect(apiErrorMessages({ success: false, message: 'Verificacion de seguridad fallida' }))
            .toEqual(['Verificacion de seguridad fallida'])

        expect(apiErrorMessages(null)).toEqual([])
    })

    it('buildProjectMetatags usa SEO, taxonomías, tecnologías e imagen del proyecto', () => {
        const project = {
            id: 18,
            title: 'Gadget',
            slug: 'gadget',
            excerpt: 'Extracto',
            seo_title: 'Gadget SEO',
            seo_description: 'Descripción SEO',
            image,
            technologies: [{ id: 1, slug: 'micropython', name: 'MicroPython', image: null }],
            taxonomies: {
                categories: [{ id: 2, slug: 'iot', name: 'iot' }],
                subcategories: [],
                tags: [{ id: 4, slug: 'maker', name: 'maker' }, { id: 5, slug: 'iot', name: 'iot' }],
            },
        } as ContentType
        const page = { slug: 'hardware', title: 'Hardware' } as ContentPageType

        const meta = buildProjectMetatags(project, page, 'https://raupulus.dev')

        expect(meta.title).toBe('Gadget SEO - Hardware')
        expect(meta.description).toBe('Descripción SEO')
        expect(meta.keywords).toBe('iot,maker,MicroPython')
        expect(meta.url).toBe('https://raupulus.dev/projects/gadget/hardware/')
        expect(meta.image).toBe(image.thumbnails.large)
    })

    it('normalizeListItems admite el formato antiguo y el de @editorjs/list 2.x', () => {
        expect(normalizeListItems(['Uno', 'Dos'])).toEqual([
            { content: 'Uno', checked: false, items: [] },
            { content: 'Dos', checked: false, items: [] },
        ])

        expect(normalizeListItems([
            { content: 'Uno', meta: { checked: true }, items: [{ content: 'Uno bis', meta: {}, items: [] }] },
        ])).toEqual([
            { content: 'Uno', checked: true, items: [{ content: 'Uno bis', checked: false, items: [] }] },
        ])

        expect(normalizeListItems(undefined)).toEqual([])
    })

    it('listCounterLabel numera según counterType', () => {
        expect(listCounterLabel(3)).toBe('3')
        expect(listCounterLabel(4, 'lower-roman')).toBe('iv')
        expect(listCounterLabel(9, 'upper-roman')).toBe('IX')
        expect(listCounterLabel(1, 'lower-alpha')).toBe('a')
        expect(listCounterLabel(28, 'upper-alpha')).toBe('AB')
    })
})
