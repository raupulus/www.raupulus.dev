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
          aria-label="Copiar código al portapapeles"
          title="Copiar código"
          class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          @click="copyCode"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            class="fill-current w-4 h-4"
            aria-hidden="true"
          >
            <path
              d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"
            />
          </svg>
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
