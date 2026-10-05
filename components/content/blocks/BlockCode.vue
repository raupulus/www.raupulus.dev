<template>
  <div :id="code.id" class="r-codeblock-container my-6 rounded-xl overflow-hidden border border-outline-variant/30 bg-surface-container-lowest shadow-md">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2.5 bg-surface-container-high border-b border-outline-variant/20 text-xs font-label">
      <div class="text-secondary font-bold uppercase tracking-wider flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-secondary/80" />
        {{ code.data.language || 'Código' }}
      </div>

      <div class="flex items-center gap-2">
        <span v-if="copied" class="text-tertiary text-xs tracking-wider uppercase font-bold animate-pulse">
          ¡Copiado!
        </span>
        <button
          type="button"
          :aria-label="copied ? 'Código copiado al portapapeles' : 'Copiar código al portapapeles'"
          :title="copied ? 'Copiado' : 'Copiar código'"
          class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer flex items-center justify-center"
          @click="copyCode"
        >
          <UiMaterialIcon
            :name="copied ? 'check' : 'content_copy'"
            class="text-base"
          />
        </button>
      </div>
    </div>

    <!-- Contenido con números de línea y código escapado -->
    <div class="flex overflow-x-auto text-sm font-mono leading-relaxed">
      <div class="select-none py-4 px-3 text-right text-outline/60 bg-surface-container-low border-r border-outline-variant/10 text-xs shrink-0" aria-hidden="true">
        <span v-for="nLine in nLines" :key="nLine" class="block">
          {{ nLine }}
        </span>
      </div>

      <pre class="p-4 text-primary-fixed-dim overflow-x-auto whitespace-pre font-mono flex-1"><code :data-language="code.data.language ?? 'text'">{{ code.data.code }}</code></pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { BlockCodeType, BlockType } from '@/types/BlocksType';

const props = defineProps({
  block: {
    type: Object as PropType<BlockType>,
    required: true,
  },
});

const code = computed(() => props.block as BlockCodeType);
const nLines = computed(() => (code.value.data.code || '').split('\n').length);

const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(code.value.data.code || '');
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>
