<script setup lang="ts">
const emit = defineEmits(['finished', 'cancel', 'submit'])

const props = defineProps({
    show: {
        type: Boolean,
        default: true,
    },
    step: {
        type: Number,
        default: 1, // 1: resume, 2: loading, 3: submitted
    },
    dataForm: {
        type: Object,
        default: () => ({}),
    },
    messages: {
        type: Object as PropType<{ success: string[]; errors: string[] | Record<string, string[]> }>,
        default: () => ({
            success: [],
            errors: [
                'Ha ocurrido un error al enviar el mensaje',
                'El mensaje no se ha enviado correctamente, por favor, inténtelo de nuevo más tarde o contáctame directamente.',
            ],
        }),
    },
})

// Normalizar errores para renderizado seguro y accesible (U-BUG-016)
const formattedErrors = computed<string[]>(() => {
    const errs = props.messages?.errors
    if (!errs) return []
    if (Array.isArray(errs)) return errs
    if (typeof errs === 'object') {
        return Object.values(errs).flat().filter(Boolean) as string[]
    }
    return [String(errs)]
})

// Cerrar modal con Escape
const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show) {
        if (props.step === 1) {
            emit('cancel')
        } else if (props.step === 3) {
            emit('finished')
        }
    }
}

const modalRef = ref<HTMLElement | null>(null)
useModalAccessibility(toRef(props, 'show'), modalRef)

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <div
        v-if="show"
        ref="modalRef"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-contact-title"
    >
        <div
            class="relative w-full max-w-2xl bg-surface-container border border-outline-variant/30 rounded-xl shadow-2xl p-6 sm:p-8 text-on-surface"
        >
            <!-- Paso 1: Resumen antes de enviar -->
            <div v-if="step === 1" class="space-y-6">
                <h3 id="submit-contact-title" class="font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary text-center">
                    Resumen de los datos introducidos
                </h3>

                <div class="space-y-4 bg-background/50 border border-outline-variant/20 rounded-lg p-5 text-sm sm:text-base">
                    <div>
                        <span class="text-on-surface-variant font-label uppercase text-xs tracking-wider block mb-1">Nombre:</span>
                        <span class="font-medium text-on-surface">{{ dataForm.name }}</span>
                    </div>

                    <div>
                        <span class="text-on-surface-variant font-label uppercase text-xs tracking-wider block mb-1">Email:</span>
                        <span class="font-medium text-on-surface">{{ dataForm.email }}</span>
                    </div>

                    <div v-if="dataForm.subject">
                        <span class="text-on-surface-variant font-label uppercase text-xs tracking-wider block mb-1">Asunto:</span>
                        <span class="font-medium text-on-surface">{{ dataForm.subject }}</span>
                    </div>

                    <div>
                        <span class="text-on-surface-variant font-label uppercase text-xs tracking-wider block mb-1">Mensaje:</span>
                        <p class="font-medium text-on-surface whitespace-pre-wrap">{{ dataForm.message }}</p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 justify-end pt-2">
                    <button
                        type="button"
                        class="px-6 py-3 rounded-lg border border-outline-variant/40 hover:border-outline text-on-surface text-sm font-headline font-bold uppercase tracking-wider transition-colors"
                        @click="emit('cancel')"
                    >
                        Modificar datos
                    </button>
                    <button
                        type="button"
                        class="px-6 py-3 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm font-headline font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                        @click="emit('submit')"
                    >
                        Confirmar y enviar
                    </button>
                </div>
            </div>

            <!-- Paso 2: Procesando (Spinner CSS accesible, sin GIFs en bucle) (U-A11Y-009) -->
            <div v-if="step === 2" class="text-center py-8 space-y-6">
                <h3 class="font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary">
                    Procesando datos
                </h3>

                <div class="flex justify-center" aria-hidden="true">
                    <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>

                <div class="space-y-2 text-on-surface-variant text-sm max-w-md mx-auto">
                    <p>Validando la información del formulario y verificación de seguridad.</p>
                    <p>Por favor, espere un instante...</p>
                </div>
            </div>

            <!-- Paso 3: Resultado de envío (U-BUG-016) -->
            <div v-if="step === 3" class="text-center py-6 space-y-6">
                <div v-if="!formattedErrors.length && messages.success?.length" class="space-y-4">
                    <div class="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl">
                        <UiMaterialIcon name="check_circle" />
                    </div>
                    <h3 class="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                        Mensaje enviado
                    </h3>
                    <div class="text-on-surface-variant text-sm max-w-md mx-auto space-y-2">
                        <p v-for="(suc, idx) in messages.success" :key="idx">
                            {{ suc }}
                        </p>
                    </div>
                </div>

                <div v-else class="space-y-4">
                    <div class="w-16 h-16 mx-auto rounded-full bg-error/10 flex items-center justify-center text-error text-4xl">
                        <UiMaterialIcon name="close" />
                    </div>
                    <h3 class="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-error">
                        No se pudo enviar el mensaje
                    </h3>
                    <div class="text-on-surface-variant text-sm max-w-md mx-auto space-y-2 text-left bg-background/50 border border-outline-variant/20 rounded-lg p-4">
                        <p v-for="(err, idx) in formattedErrors" :key="idx" class="text-error font-medium">
                            • {{ err }}
                        </p>
                    </div>
                </div>

                <div class="pt-2">
                    <button
                        type="button"
                        class="px-8 py-3 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary text-sm font-headline font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                        @click="emit('finished')"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>