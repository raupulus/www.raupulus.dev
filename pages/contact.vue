<script setup lang="ts">
    import fetchPost from '@/composables/fetchPostData';

    const runtimeConfig = useRuntimeConfig();

    const url = runtimeConfig.public.app.url;
    const title = 'Contacto - Raúl Caro Pastorino | Desarrollador Full Stack Senior · Backend Laravel · IA aplicada';
    const description =
        'Ponte en contacto con Raúl Caro Pastorino, desarrollador full stack senior especializado en backend (PHP, Laravel), IA aplicada e IoT.';
    const keywords =
        'contacto, Raúl Caro Pastorino, desarrollador full stack, backend, PHP, Laravel, inteligencia artificial, IoT, Python';

    useHead({
        title: title,
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: keywords },
            { name: 'robots', content: 'index, follow' },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:url', content: url + '/contact/' },
            { property: 'og:image', content: url + '/social/contact.webp' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: url + '/social/contact.webp' },
        ],
        link: [{ rel: 'canonical', href: `${url}/contact/` }],
        script: [
            {
                type: 'application/ld+json',
                innerHTML: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'ContactPage',
                    name: title,
                    url: `${url}/contact/`,
                    description: description,
                    mainEntity: {
                        '@type': 'Person',
                        name: 'Raúl Caro Pastorino',
                        email: 'public@raupulus.dev',
                        url: `${url}/`,
                    },
                }),
            },
        ],
    });

    // useApiBase() resuelve la URL correcta (proxy en dev para evitar CORS)
    const apiBase = useApiBase();
    const API_PATH_CONTACT: string = runtimeConfig.public.api.contact || 'contact-messages';

    const turnstileToken = ref('');
    const turnstileRef = ref<{ reset: () => void } | null>(null);

    onMounted(() => {
        // Pre-carga la cookie CSRF para que el primer envío no falle ni tarde
        fetchCsrfToken().catch(() => {
            /* se reintentará al enviar */
        });
    });

    interface Validation {
        minLength?: { value: number; message: string };
        maxLength?: { value: number; message: string };
        regexp?: { value: string; message: string };
        required?: { value: boolean; message: string };
    }

    interface FormField {
        valid: boolean;
        value: string | boolean;
        validations: Validation;
        errors?: string[];
    }

    interface FormData {
        valid: boolean;
        [key: string]: FormField | boolean;
    }

    interface StepsInfo {
        step: number;
        show: boolean;
        validated: boolean;
        submitted: boolean;
        fail: boolean;
        messages: {
            success: string[];
            errors: string[];
        };
    }

    const stepsInfo = ref<StepsInfo>({
        step: 1,
        show: false,
        //loading: false,
        //resume: false,
        validated: false, // TODO: Cambiar al modificar datos del formulario
        submitted: false,
        fail: false,
        messages: {
            success: [
                'El mensaje se ha enviado correctamente',
                'Por algunos motivos tu mensaje ha sido catalogado con prioridad baja, algunas veces ocurre si envías demasiados emails, palabras en el contenido o ip de riesgo.',
                'Contactaré contigo lo antes que me resulte posible',
            ],
            errors: ['Ha ocurrido un error al enviar el mensaje', 'El mensaje no se ha enviado correctamente'],
        },
    });

    const dataForm: Ref<FormData> = ref({
        valid: false,
        name: {
            value: '',
            valid: false,
            validations: {
                minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres',
                },
                maxLength: {
                    value: 100,
                    message: 'El nombre no puede tener más de 100 caracteres',
                },
            },
        },
        email: {
            value: '',
            valid: false,
            validations: {
                minLength: {
                    value: 5,
                    message: 'El email debe tener al menos 5 caracteres',
                },
                maxLength: {
                    value: 254,
                    message: 'El email no puede tener más de 254 caracteres',
                },
                regexp: {
                    value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                    message: 'El formato del email no es válido',
                },
            },
        },
        subject: {
            value: '',
            valid: false,
            validations: {
                minLength: {
                    value: 3,
                    message: 'El asunto debe tener al menos 3 caracteres',
                },
                maxLength: {
                    value: 150,
                    message: 'El asunto no puede tener más de 150 caracteres',
                },
            },
        },
        message: {
            value: '',
            valid: false,
            validations: {
                minLength: {
                    value: 10,
                    message: 'El mensaje debe tener al menos 10 caracteres',
                },
                maxLength: {
                    value: 2000,
                    message: 'El mensaje no puede tener más de 2000 caracteres',
                },
            },
        },
        privacity: {
            value: false,
            valid: false,
            validations: {
                required: {
                    value: true,
                    message: 'Debes aceptar la política de privacidad',
                },
            },
        },
        consent: {
            value: false,
            valid: false,
            validations: {
                required: {
                    value: true,
                    message: 'Debes autorizar el tratamiento para responder a tu consulta',
                },
            },
        },
    });

    /**
     * Al modificar el contenido del mensaje, comprueba su validación.
     */
    /*
watch(dataForm.value.message.value, async () => {
    checkValidations(dataForm.value.message);
});
*/

    /**
     * Devuelve si un valor cumple el patrón recibido.
     *
     * @param {*} pattern Patrón a comprobar
     * @param {*} value Valor a comprobar contra el patrón
     */
    const checkRegexp = (pattern: string, value: string): boolean => {
        const reg = new RegExp(pattern);

        return reg.test(value);
    };

    /**
     * Comprueba si un campo input valida tras tener un cambio de estado/valor recibiendo el evento.
     *
     * @param {*} e Evento que lanza la revisión de validaciones.
     */
    const checkValidationsFromEvent = (e: Event): void => {
        const ele = e.target as HTMLInputElement;
        const currentObject = dataForm.value[ele.name];

        if (isFormField(currentObject)) {
            checkValidations(currentObject);
        }
    };

    /**
     *
     * Comprueba si es formfield
     *
     * @param field
     */
    const isFormField = (field: unknown): field is FormField => {
        return field !== null && typeof field === 'object' && 'value' in field;
    };

    /**
     * Comprueba todas las validaciones para un campo.
     *
     * @param {FormField} currentObject
     */
    const checkValidations = (currentObject: FormField): void => {
        const value = currentObject.value as string;
        const validations = currentObject.validations;

        const errors: string[] = [];

        if (validations.minLength && value.length < validations.minLength.value) {
            errors.push(validations.minLength.message ?? 'El campo no cumple con la longitud mínima');
        }

        if (validations.maxLength && value.length > validations.maxLength.value) {
            errors.push(validations.maxLength.message ?? 'El campo no cumple con la longitud máxima');
        }

        if (validations.regexp && !checkRegexp(validations.regexp.value, value)) {
            errors.push(validations.regexp.message ?? 'El campo no cumple con el patrón de validación');
        }

        if (validations.required && validations.required.value && !value) {
            errors.push(validations.required.message ?? 'El campo es obligatorio');
        }

        if (errors.length) {
            currentObject.valid = false;
            currentObject.errors = errors;
        } else {
            currentObject.valid = true;
            currentObject.errors = [];
        }
    };

    // Enviar el formulario con Enter pasa por la misma validación y confirmación que el botón
    const onSubmit = async (e: Event) => {
        e.preventDefault();
        await showConfirmModal(e);
    };

    /* Protección anti-bots (además de Cloudflare Turnstile validado en servidor):
     * - Honeypot: campo oculto que los humanos no ven; si llega relleno, es un bot.
     * - Tiempo mínimo: un humano tarda varios segundos en rellenar el formulario.
     * - Bloqueo de doble envío mientras hay una petición en curso. */
    const honeypot = ref('');
    const formLoadedAt = Date.now();
    const MIN_FILL_TIME_MS = 3000;
    const isSubmitting = ref(false);

    const handleSubmit = async (): Promise<void> => {
        if (isSubmitting.value) {
            return;
        }

        const info = stepsInfo.value;

        // Muestra el segundo paso con el resumen del email a enviar
        info.step = 2;

        // Trampas anti-bot: se simula un envío correcto sin llamar a la API
        if (honeypot.value || Date.now() - formLoadedAt < MIN_FILL_TIME_MS) {
            info.validated = true;
            info.submitted = true;
            info.messages.errors = [];
            info.messages.success = ['El mensaje se ha enviado correctamente'];
            info.step = 3;
            return;
        }

        isSubmitting.value = true;

        if (!turnstileToken.value) {
            info.step = 3;
            info.validated = false;
            info.submitted = false;
            info.fail = true;
            info.messages.errors = [
                'Error al verificar la seguridad. Por favor, completa la verificación de Turnstile e inténtalo de nuevo.',
            ];
            isSubmitting.value = false;
            return;
        }

        // Contrato: POST /contact-messages (API V2). La plataforma la deduce la API
        // del Referer y el idioma de Accept-Language, que envía el navegador.
        const data = {
            name: isFormField(dataForm.value.name) ? dataForm.value.name.value : '',
            email: isFormField(dataForm.value.email) ? dataForm.value.email.value : '',
            subject: isFormField(dataForm.value.subject) ? dataForm.value.subject.value : '',
            message: isFormField(dataForm.value.message) ? dataForm.value.message.value : '',
            privacity: isFormField(dataForm.value.privacity) ? dataForm.value.privacity.value : false,
            contactme: isFormField(dataForm.value.consent) ? dataForm.value.consent.value : false,
            'cf-turnstile-response': turnstileToken.value,
            turnstile_token: turnstileToken.value,
        };

        const apiUrl = apiBase + '/' + API_PATH_CONTACT;

        fetchPost(apiUrl, data)
            .then((response) => {
                if (response.success) {
                    info.messages.errors = [];
                    info.messages.success = [response.message || 'Mensaje recibido correctamente'];
                } else {
                    // 422 (validación o captcha) y 429 (límite de envíos) traen el detalle aquí
                    info.messages.success = [];
                    info.messages.errors = apiErrorMessages(response);

                    if (!info.messages.errors.length) {
                        info.messages.errors = ['No se ha podido enviar el mensaje. Inténtalo de nuevo más tarde.'];
                    }
                }

                info.validated = response.success;
                info.submitted = response.success;
            })
            .catch((error) => {
                console.error('Error:', error);
                info.validated = false;
                info.submitted = false;

                if (!info.messages.errors.length) {
                    info.messages.errors = [
                        'No se ha podido enviar el mensaje. Por favor, inténtalo de nuevo más tarde o contáctame por LinkedIn.',
                    ];
                }
            })
            .finally(() => {
                info.step = 3;
                isSubmitting.value = false;
                turnstileRef.value?.reset();
                turnstileToken.value = '';
            });
    };

    /**
     * Comprueba si el formulario es válido.
     */
    const formIsValid = (): boolean => {
        let isValid = true;

        Object.keys(dataForm.value).forEach((key) => {
            const currentObject = dataForm.value[key];

            if (isFormField(currentObject)) {
                checkValidations(currentObject);
                if (!currentObject.valid) {
                    isValid = false;
                }
            }
        });

        dataForm.value.valid = isValid;
        return isValid;
    };

    /**
     * Cancela el envío del email y cierra el modal.
     */
    const cancelModal = (): void => {
        const info = stepsInfo.value;
        info.step = 1;
        info.show = false;
    };

    /**
     * Muestra el modal de confirmación de envío de email.
     *
     * @param {*} e Evento que lanza la confirmación de envío de email.
     */
    const showConfirmModal = async (e: Event): Promise<void> => {
        e.preventDefault();

        if (!formIsValid()) {
            return;
        }

        const info = stepsInfo.value;
        info.step = 1;
        info.show = true;
    };
</script>

<template>
    <div class="min-h-screen bg-background circuit-pattern">
        <!-- Cabecera -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <span class="font-label text-tertiary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                <span class="w-8 h-[1px] bg-tertiary" />
                Canal de Contacto
            </span>
            <h1 class="font-headline text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6">
                Formulario de <span class="text-on-surface-variant font-light">Contacto</span>
            </h1>
            <p class="text-on-surface-variant text-lg max-w-2xl border-l-2 border-secondary pl-6 py-2">
                Ponte en contacto conmigo. Respondo en cuanto me sea posible.
            </p>
        </div>

        <!-- Aviso temporal -->
        <div class="px-8 pb-8 max-w-7xl mx-auto">
            <div class="p-6 bg-secondary/5 border border-secondary/30 rounded-xl flex items-start gap-4">
                <UiMaterialIcon class="text-secondary shrink-0 mt-0.5" name="info" />
                <div>
                    <p class="text-on-surface-variant text-sm leading-relaxed mb-1">
                        Fuera de servicio temporalmente mientras termino de implementar medidas de seguridad antibots y
                        antispam usando IA propia para ello.
                    </p>
                    <p class="text-on-surface-variant text-sm leading-relaxed">
                        Puedes contactarme mediante alguna de las
                        <NuxtLink to="/social/" class="text-tertiary hover:underline">redes sociales</NuxtLink>
                        con una cuenta real y te contestaré en cuanto me sea posible.
                    </p>
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <div class="px-8 pb-24 max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Columna formulario -->
                <div class="lg:col-span-2">
                    <form
                        class="bg-surface-container-high rounded-xl border border-outline-variant/20 p-8 space-y-6"
                        @submit.prevent="onSubmit"
                    >
                        <h2 class="sr-only">Formulario de mensaje directo</h2>

                        <!-- Honeypot anti-bots: invisible para humanos, los bots lo rellenan -->
                        <div class="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                            <label for="website">No rellenar este campo</label>
                            <input
                                id="website"
                                v-model="honeypot"
                                type="text"
                                name="website"
                                tabindex="-1"
                                autocomplete="off"
                            />
                        </div>

                        <!-- Nombre y Email -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex flex-col gap-2">
                                <label
                                    for="name"
                                    class="font-label text-xs uppercase tracking-widest text-on-surface-variant"
                                    >Nombre</label
                                >
                                <input
                                    id="name"
                                    v-model.trim="(dataForm.name as FormField).value as string"
                                    type="text"
                                    name="name"
                                    maxlength="100"
                                    autocomplete="name"
                                    :aria-invalid="Boolean(isFormField(dataForm.name) && dataForm.name.errors?.length)"
                                    :aria-describedby="
                                        isFormField(dataForm.name) && dataForm.name.errors?.length
                                            ? 'name-error'
                                            : undefined
                                    "
                                    :class="[
                                        'w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body placeholder:text-outline transition-colors',
                                        isFormField(dataForm.name) && dataForm.name.valid
                                            ? 'border-tertiary'
                                            : isFormField(dataForm.name) && dataForm.name.errors?.length
                                              ? 'border-error'
                                              : 'border-outline-variant focus:border-secondary',
                                    ]"
                                    placeholder="Tu nombre completo"
                                    @input="checkValidationsFromEvent"
                                />
                                <div v-if="isFormField(dataForm.name) && dataForm.name.errors?.length" id="name-error">
                                    <span
                                        v-for="error in dataForm.name.errors"
                                        :key="error"
                                        class="text-error text-xs font-label block"
                                        role="alert"
                                        >{{ error }}</span
                                    >
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label
                                    for="email"
                                    class="font-label text-xs uppercase tracking-widest text-on-surface-variant"
                                    >Email</label
                                >
                                <input
                                    id="email"
                                    v-model.trim="(dataForm.email as FormField).value as string"
                                    type="email"
                                    name="email"
                                    maxlength="254"
                                    autocomplete="email"
                                    :aria-invalid="
                                        Boolean(isFormField(dataForm.email) && dataForm.email.errors?.length)
                                    "
                                    :aria-describedby="
                                        isFormField(dataForm.email) && dataForm.email.errors?.length
                                            ? 'email-error'
                                            : undefined
                                    "
                                    :class="[
                                        'w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body placeholder:text-outline transition-colors',
                                        isFormField(dataForm.email) && dataForm.email.valid
                                            ? 'border-tertiary'
                                            : isFormField(dataForm.email) && dataForm.email.errors?.length
                                              ? 'border-error'
                                              : 'border-outline-variant focus:border-secondary',
                                    ]"
                                    placeholder="tu@email.com"
                                    @input="checkValidationsFromEvent"
                                />
                                <div
                                    v-if="isFormField(dataForm.email) && dataForm.email.errors?.length"
                                    id="email-error"
                                >
                                    <span
                                        v-for="error in dataForm.email.errors"
                                        :key="error"
                                        class="text-error text-xs font-label block"
                                        role="alert"
                                        >{{ error }}</span
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- Asunto -->
                        <div class="flex flex-col gap-2">
                            <label
                                for="subject"
                                class="font-label text-xs uppercase tracking-widest text-on-surface-variant"
                                >Asunto</label
                            >
                            <input
                                id="subject"
                                v-model.trim="(dataForm.subject as FormField).value as string"
                                type="text"
                                name="subject"
                                maxlength="150"
                                autocomplete="off"
                                :aria-invalid="
                                    Boolean(isFormField(dataForm.subject) && dataForm.subject.errors?.length)
                                "
                                :aria-describedby="
                                    isFormField(dataForm.subject) && dataForm.subject.errors?.length
                                        ? 'subject-error'
                                        : undefined
                                "
                                :class="[
                                    'w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body placeholder:text-outline transition-colors',
                                    isFormField(dataForm.subject) && dataForm.subject.valid
                                        ? 'border-tertiary'
                                        : isFormField(dataForm.subject) && dataForm.subject.errors?.length
                                          ? 'border-error'
                                          : 'border-outline-variant focus:border-secondary',
                                ]"
                                placeholder="Asunto del mensaje"
                                @input="checkValidationsFromEvent"
                            />
                            <div
                                v-if="isFormField(dataForm.subject) && dataForm.subject.errors?.length"
                                id="subject-error"
                            >
                                <span
                                    v-for="error in dataForm.subject.errors"
                                    :key="error"
                                    class="text-error text-xs font-label block"
                                    role="alert"
                                    >{{ error }}</span
                                >
                            </div>
                        </div>

                        <!-- Mensaje -->
                        <div class="flex flex-col gap-2">
                            <div class="flex justify-between items-center">
                                <label
                                    for="contact-message"
                                    class="font-label text-xs uppercase tracking-widest text-on-surface-variant"
                                >
                                    Mensaje
                                </label>
                                <span class="font-label text-xs text-on-surface-variant">
                                    {{ String((dataForm.message as FormField).value || '').length }} / 2000
                                </span>
                            </div>
                            <textarea
                                id="contact-message"
                                v-model.trim="(dataForm.message as FormField).value as string"
                                name="message"
                                rows="6"
                                maxlength="2000"
                                aria-label="Mensaje"
                                :aria-invalid="
                                    Boolean(isFormField(dataForm.message) && dataForm.message.errors?.length)
                                "
                                :aria-describedby="
                                    isFormField(dataForm.message) && dataForm.message.errors?.length
                                        ? 'message-error'
                                        : undefined
                                "
                                :class="[
                                    'w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body transition-colors resize-y',
                                    isFormField(dataForm.message) && dataForm.message.valid
                                        ? 'border-tertiary'
                                        : isFormField(dataForm.message) && dataForm.message.errors?.length
                                          ? 'border-error'
                                          : 'border-outline-variant focus:border-secondary',
                                ]"
                                placeholder="Escribe tu mensaje aquí..."
                                @input="checkValidationsFromEvent"
                            />
                            <div
                                v-if="isFormField(dataForm.message) && dataForm.message.errors?.length"
                                id="message-error"
                            >
                                <span
                                    v-for="error in dataForm.message.errors"
                                    :key="error"
                                    class="text-error text-xs font-label block"
                                    role="alert"
                                    >{{ error }}</span
                                >
                            </div>
                        </div>

                        <!-- Checkboxes legales separados -->
                        <div class="space-y-4">
                            <!-- Privacidad -->
                            <div class="flex flex-col gap-1">
                                <label class="flex items-start gap-3 cursor-pointer">
                                    <input
                                        id="privacity"
                                        v-model="(dataForm.privacity as FormField).value"
                                        type="checkbox"
                                        name="privacity"
                                        class="mt-1 w-4 h-4 accent-primary shrink-0"
                                        required
                                        :aria-describedby="
                                            isFormField(dataForm.privacity) && dataForm.privacity.errors?.length
                                                ? 'privacity-error'
                                                : undefined
                                        "
                                        @change="checkValidationsFromEvent"
                                    />
                                    <span class="text-sm text-on-surface-variant leading-relaxed">
                                        He leído y acepto la
                                        <NuxtLink
                                            to="/privacy/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-tertiary hover:underline"
                                        >
                                            Política de Privacidad
                                        </NuxtLink>
                                        <span class="text-error">*</span>
                                    </span>
                                </label>
                                <div
                                    v-if="isFormField(dataForm.privacity) && dataForm.privacity.errors?.length"
                                    id="privacity-error"
                                >
                                    <span
                                        v-for="error in dataForm.privacity.errors"
                                        :key="error"
                                        class="text-error text-xs font-label block"
                                        role="alert"
                                        >{{ error }}</span
                                    >
                                </div>
                            </div>

                            <!-- Consentimiento de tratamiento -->
                            <div class="flex flex-col gap-1">
                                <label class="flex items-start gap-3 cursor-pointer">
                                    <input
                                        id="consent"
                                        v-model="(dataForm.consent as FormField).value"
                                        type="checkbox"
                                        name="consent"
                                        class="mt-1 w-4 h-4 accent-primary shrink-0"
                                        required
                                        :aria-describedby="
                                            isFormField(dataForm.consent) && dataForm.consent.errors?.length
                                                ? 'consent-error'
                                                : undefined
                                        "
                                        @change="checkValidationsFromEvent"
                                    />
                                    <span class="text-sm text-on-surface-variant leading-relaxed">
                                        Consiento expresamente el tratamiento de mis datos para la gestión y respuesta
                                        de mi consulta.
                                        <span class="text-error">*</span>
                                    </span>
                                </label>
                                <div
                                    v-if="isFormField(dataForm.consent) && dataForm.consent.errors?.length"
                                    id="consent-error"
                                >
                                    <span
                                        v-for="error in dataForm.consent.errors"
                                        :key="error"
                                        class="text-error text-xs font-label block"
                                        role="alert"
                                        >{{ error }}</span
                                    >
                                </div>
                            </div>

                            <!-- Información básica de protección de datos (Primera capa - Art. 11 LOPDGDD) -->
                            <div
                                class="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface-variant space-y-1.5 leading-relaxed"
                            >
                                <div class="font-bold text-on-surface uppercase tracking-wider text-[11px] mb-1">
                                    Información básica sobre protección de datos
                                </div>
                                <p><strong>Responsable:</strong> Raúl Caro Pastorino.</p>
                                <p>
                                    <strong>Finalidad:</strong> Tramitar, gestionar y responder a la consulta remitida.
                                </p>
                                <p>
                                    <strong>Legitimación:</strong> Consentimiento inequívoco del interesado (Art. 6.1.a
                                    RGPD).
                                </p>
                                <p>
                                    <strong>Destinatarios:</strong> No se ceden datos a terceros. Infraestructura
                                    técnica conforme al RGPD (Cloudflare Turnstile y servidores UE).
                                </p>
                                <p>
                                    <strong>Derechos:</strong> Acceso, rectificación, supresión y demás derechos
                                    mediante
                                    <a href="mailto:public@raupulus.dev" class="text-primary hover:underline"
                                        >public@raupulus.dev</a
                                    >.
                                </p>
                                <p>
                                    <strong>Información adicional:</strong> Consulte la información detallada en nuestra
                                    <NuxtLink
                                        to="/privacy/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-primary hover:underline"
                                        >Política de Privacidad</NuxtLink
                                    >.
                                </p>
                            </div>
                        </div>

                        <!-- Verificación Cloudflare Turnstile -->
                        <div class="my-4 flex justify-start">
                            <NuxtTurnstile
                                ref="turnstileRef"
                                v-model="turnstileToken"
                                :options="{ theme: 'dark', size: 'flexible' }"
                            />
                        </div>

                        <!-- Botón enviar -->
                        <div class="pt-4">
                            <button
                                type="submit"
                                class="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-widest uppercase rounded-lg hover:scale-95 transition-all duration-300"
                            >
                                Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Columna info lateral -->
                <div class="flex flex-col gap-6">
                    <div class="bg-surface-container-high rounded-xl border border-outline-variant/20 p-8">
                        <h2 class="font-headline text-lg font-bold mb-6 tracking-tight">Información de Contacto</h2>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"
                                >
                                    <UiMaterialIcon class="text-primary text-sm" name="alternate_email" />
                                </div>
                                <div>
                                    <p class="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                                        Email
                                    </p>
                                    <a
                                        href="mailto:public@raupulus.dev"
                                        class="text-sm text-on-surface hover:text-primary transition-colors"
                                        >public@raupulus.dev</a
                                    >
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0"
                                >
                                    <UiMaterialIcon class="text-tertiary text-sm" name="location_on" />
                                </div>
                                <div>
                                    <p class="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                                        Ubicación
                                    </p>
                                    <p class="text-sm text-on-surface">España</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0"
                                >
                                    <UiMaterialIcon class="text-secondary text-sm" name="schedule" />
                                </div>
                                <div>
                                    <p class="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                                        Respuesta
                                    </p>
                                    <p class="text-sm text-on-surface">En cuanto sea posible</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6">
                        <div class="flex items-center gap-3 mb-4">
                            <UiMaterialIcon class="text-tertiary text-sm" name="check_circle" />
                            <span class="font-label text-xs text-tertiary uppercase tracking-widest"
                                >Protección Antispam</span
                            >
                        </div>
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                            Formulario protegido con Cloudflare Turnstile para evitar spam.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de confirmación -->
        <ModalsSubmitContact
            :show="stepsInfo.show"
            :step="stepsInfo.step"
            :messages="stepsInfo.messages"
            :data-form="dataForm"
            @finished="cancelModal"
            @cancel="cancelModal"
            @submit="handleSubmit"
        />
    </div>
</template>
