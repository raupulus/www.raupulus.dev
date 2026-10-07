<script setup lang="ts">
    import { computed, onMounted, onBeforeUnmount, ref, toRef, type PropType } from 'vue';
    import { useModalAccessibility } from '@/composables/useModalAccessibility';

    const emit = defineEmits(['finished', 'cancel', 'submit']);

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
                    'El mensaje no se ha enviado correctamente, por favor, inténtalo de nuevo más tarde o contáctame directamente.',
                ],
            }),
        },
    });

    /**
     * Extrae de forma segura los valores de texto del formulario,
     * admitiendo tanto strings directos como objetos reactivos con propiedad `value`.
     */
    const formValues = computed(() => {
        const raw = props.dataForm || {};
        const extract = (field: unknown): string => {
            if (typeof field === 'string') return field;
            if (field && typeof field === 'object' && 'value' in field) {
                const v = (field as { value: unknown }).value;
                return typeof v === 'string' ? v : String(v ?? '');
            }
            return '';
        };

        return {
            name: extract(raw.name),
            email: extract(raw.email),
            subject: extract(raw.subject),
            message: extract(raw.message),
        };
    });

    // Normalizar errores para renderizado seguro y accesible (U-BUG-016)
    const formattedErrors = computed<string[]>(() => {
        const errs = props.messages?.errors;
        if (!errs) return [];
        if (Array.isArray(errs)) return errs;
        if (typeof errs === 'object') {
            return Object.values(errs).flat().filter(Boolean) as string[];
        }
        return [String(errs)];
    });

    // Cerrar modal con Escape
    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && props.show) {
            if (props.step === 1) {
                emit('cancel');
            } else if (props.step === 3) {
                emit('finished');
            }
        }
    };

    const modalRef = ref<HTMLElement | null>(null);
    useModalAccessibility(toRef(props, 'show'), modalRef);

    onMounted(() => {
        document.addEventListener('keydown', handleKeydown);
    });

    onBeforeUnmount(() => {
        document.removeEventListener('keydown', handleKeydown);
    });
</script>

<template>
    <div
        v-if="show"
        ref="modalRef"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-surface-container-lowest/80 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-contact-title"
    >
        <div
            class="relative w-full max-w-xl bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-on-surface overflow-hidden"
        >
            <!-- Botón cerrar (X) accesible en esquina superior -->
            <button
                type="button"
                class="absolute top-4 right-4 sm:top-6 sm:right-6 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/60 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Cerrar modal"
                @click="props.step === 1 ? emit('cancel') : emit('finished')"
            >
                <UiMaterialIcon name="close" class="text-xl" />
            </button>

            <!-- Paso 1: Resumen antes de enviar -->
            <div v-if="step === 1" class="space-y-6">
                <div class="text-center space-y-2 pt-1 pr-6 pl-6 sm:px-0">
                    <div
                        class="w-12 h-12 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-[0_0_15px_rgba(163,201,255,0.15)]"
                    >
                        <UiMaterialIcon name="send" class="text-xl" />
                    </div>
                    <h3
                        id="submit-contact-title"
                        class="font-headline text-xl sm:text-2xl font-bold tracking-tight text-on-surface"
                    >
                        Resumen de los <span class="text-primary">datos introducidos</span>
                    </h3>
                    <p class="text-xs text-on-surface-variant max-w-sm mx-auto">
                        Comprueba que los datos introducidos sean correctos antes de realizar el envío definitivo.
                    </p>
                </div>

                <div
                    class="space-y-3.5 bg-surface-container-low/70 border border-outline-variant/20 rounded-xl p-4 sm:p-5"
                >
                    <!-- Fila 1: Nombre y Email en 2 columnas -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div class="bg-surface-container-high/40 border border-outline-variant/15 rounded-lg p-3">
                            <span
                                class="text-on-surface-variant font-label uppercase text-[10px] tracking-widest flex items-center gap-1.5 mb-1.5"
                            >
                                <UiMaterialIcon name="person" class="text-xs text-secondary" />
                                Nombre
                            </span>
                            <p class="font-body text-sm font-semibold text-on-surface break-words">
                                {{ formValues.name || '—' }}
                            </p>
                        </div>

                        <div class="bg-surface-container-high/40 border border-outline-variant/15 rounded-lg p-3">
                            <span
                                class="text-on-surface-variant font-label uppercase text-[10px] tracking-widest flex items-center gap-1.5 mb-1.5"
                            >
                                <UiMaterialIcon name="alternate_email" class="text-xs text-secondary" />
                                Email
                            </span>
                            <p class="font-body text-sm font-semibold text-on-surface break-all">
                                {{ formValues.email || '—' }}
                            </p>
                        </div>
                    </div>

                    <!-- Fila 2: Asunto (si se ha completado) -->
                    <div
                        v-if="formValues.subject"
                        class="bg-surface-container-high/40 border border-outline-variant/15 rounded-lg p-3"
                    >
                        <span
                            class="text-on-surface-variant font-label uppercase text-[10px] tracking-widest flex items-center gap-1.5 mb-1.5"
                        >
                            <UiMaterialIcon name="info" class="text-xs text-tertiary" />
                            Asunto
                        </span>
                        <p class="font-body text-sm font-semibold text-on-surface break-words">
                            {{ formValues.subject }}
                        </p>
                    </div>

                    <!-- Fila 3: Mensaje -->
                    <div class="bg-surface-container-high/40 border border-outline-variant/15 rounded-lg p-3.5">
                        <span
                            class="text-on-surface-variant font-label uppercase text-[10px] tracking-widest flex items-center gap-1.5 mb-2"
                        >
                            <UiMaterialIcon name="code" class="text-xs text-primary" />
                            Mensaje
                        </span>
                        <div class="max-h-48 overflow-y-auto pr-1">
                            <p
                                class="font-body text-sm text-on-surface/90 leading-relaxed whitespace-pre-wrap break-words"
                            >
                                {{ formValues.message || '—' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
                    <button
                        type="button"
                        class="px-5 py-3 rounded-lg border border-outline-variant/30 hover:border-secondary hover:bg-surface-container-high text-on-surface text-xs font-headline font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        @click="emit('cancel')"
                    >
                        <UiMaterialIcon name="edit" class="text-sm text-secondary" />
                        <span>Modificar datos</span>
                    </button>
                    <button
                        type="button"
                        class="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary text-xs font-headline font-bold uppercase tracking-widest hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(163,201,255,0.4)] transition-all flex items-center justify-center gap-2 shadow-md"
                        @click="emit('submit')"
                    >
                        <span>Confirmar y enviar</span>
                        <UiMaterialIcon name="send" class="text-sm" />
                    </button>
                </div>
            </div>

            <!-- Paso 2: Procesando (Spinner CSS accesible, sin GIFs en bucle) (U-A11Y-009) -->
            <div v-if="step === 2" class="text-center py-10 space-y-6">
                <div class="relative w-16 h-16 mx-auto">
                    <div
                        class="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
                    />
                    <div
                        class="absolute inset-2 rounded-full border-2 border-secondary/20 border-b-secondary animate-spin [animation-direction:reverse]"
                    />
                </div>

                <div class="space-y-2">
                    <h3 class="font-headline text-xl sm:text-2xl font-bold tracking-tight text-primary">
                        Procesando datos
                    </h3>
                    <p class="text-on-surface-variant text-sm max-w-md mx-auto leading-relaxed">
                        Validando la información del formulario y verificación de seguridad.
                    </p>
                    <p class="text-xs font-label text-on-surface-variant/70 tracking-wider uppercase">
                        Por favor, espera un instante...
                    </p>
                </div>
            </div>

            <!-- Paso 3: Resultado de envío (U-BUG-016) -->
            <div v-if="step === 3" class="text-center py-6 space-y-6">
                <div v-if="!formattedErrors.length && messages.success?.length" class="space-y-4">
                    <div
                        class="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-4xl shadow-[0_0_25px_rgba(163,201,255,0.25)]"
                    >
                        <UiMaterialIcon name="check_circle" />
                    </div>
                    <h3 class="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                        Mensaje enviado
                    </h3>
                    <div
                        class="text-on-surface-variant text-sm max-w-md mx-auto space-y-2 leading-relaxed bg-surface-container-low/60 border border-outline-variant/20 rounded-xl p-4"
                    >
                        <p v-for="(suc, idx) in messages.success" :key="idx" class="text-on-surface">
                            {{ suc }}
                        </p>
                    </div>
                </div>

                <div v-else class="space-y-4">
                    <div
                        class="w-16 h-16 mx-auto rounded-full bg-error/10 border border-error/30 flex items-center justify-center text-error text-4xl shadow-[0_0_25px_rgba(255,180,171,0.25)]"
                    >
                        <UiMaterialIcon name="close" />
                    </div>
                    <h3 class="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-error">
                        No se pudo enviar el mensaje
                    </h3>
                    <div
                        class="text-on-surface-variant text-sm max-w-md mx-auto space-y-2 text-left bg-surface-container-low/60 border border-error/30 rounded-xl p-4"
                    >
                        <p
                            v-for="(err, idx) in formattedErrors"
                            :key="idx"
                            class="text-error font-medium flex items-start gap-2"
                        >
                            <span class="text-error mt-0.5">•</span>
                            <span>{{ err }}</span>
                        </p>
                    </div>
                </div>

                <div class="pt-2">
                    <button
                        type="button"
                        class="px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary text-xs font-headline font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md"
                        @click="emit('finished')"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
