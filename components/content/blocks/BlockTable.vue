<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="my-6 w-full overflow-x-auto">
    <table class="w-full border-collapse bg-surface-container-high border border-outline-variant/30 rounded-xl overflow-hidden shadow-md">
      <caption v-if="table.data.caption" class="font-label text-xs uppercase tracking-widest text-outline text-left mb-2 px-2">
        {{ table.data.caption }}
      </caption>
      <thead v-if="table.data.withHeadings && table.data.content.length" class="bg-surface-container-highest border-b border-outline-variant/30">
        <tr>
          <th
            v-for="(cell, idx) in table.data.content[0]"
            :key="idx"
            scope="col"
            class="px-5 py-3 text-left font-headline text-xs font-bold uppercase tracking-wider text-primary"
            v-html="sanitizeHtml(cell)"
          />
        </tr>
      </thead>

      <tbody v-if="table.data.content.length" class="divide-y divide-outline-variant/20 font-body text-sm text-on-surface">
        <tr
          v-for="(row, idxRow) in bodyRows"
          :key="idxRow"
          class="hover:bg-surface-container transition-colors"
        >
          <td
            v-for="(cell, idx) in row"
            :key="idx"
            class="px-5 py-3.5"
            v-html="sanitizeHtml(cell)"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import type { BlockTableType, BlockType } from '@/types/BlocksType';
import { sanitizeHtml } from '~/utils/sanitize';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
})

const table = props.block as BlockTableType

// Con cabeceras, la primera fila del contenido es la cabecera y no va en el cuerpo
const bodyRows = table.data.withHeadings
  ? table.data.content.slice(1)
  : table.data.content
</script>
