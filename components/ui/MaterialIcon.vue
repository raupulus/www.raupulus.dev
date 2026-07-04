<script setup lang="ts">
/**
 * Icono Material Symbols servido como SVG inline (self-hosted).
 *
 * Sustituye a la fuente de iconos de Google Fonts: solo se incluyen en el
 * bundle los SVG existentes en assets/icons/material/. Para añadir un icono
 * nuevo, descargarlo con:
 * curl -sf "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/<nombre>/default/24px.svg" \
 *   -o assets/icons/material/<nombre>.svg
 *
 * El tamaño se hereda del font-size (como la fuente original) y el color de
 * currentColor, por lo que las utilidades text-* de Tailwind siguen funcionando.
 */
const icons = import.meta.glob('~/assets/icons/material/*.svg', {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
})

const svg = computed(() => {
    const entry = Object.entries(icons).find(([path]) => path.endsWith(`/${props.name}.svg`))

    if (!entry) {
        console.warn(`[MaterialIcon] Icono no encontrado: ${props.name}`)
        return ''
    }

    return entry[1]
})
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -- SVG estático propio empaquetado en build, sin datos externos -->
    <span class="material-icon" aria-hidden="true" v-html="svg" />
</template>

<style>
/* :where() = especificidad 0: cualquier utilidad text-* de Tailwind lo sobreescribe.
   24px replica el tamaño por defecto de la fuente Material Symbols. */
:where(.material-icon) {
    font-size: 24px;
}

.material-icon {
    display: inline-block;
    line-height: 1;
}

.material-icon svg {
    display: inline-block;
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: -0.125em;
}
</style>
