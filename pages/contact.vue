<script setup lang="ts">
import useGoogleRecaptcha, {
    RecaptchaAction,
} from "~/composables/useGoogleRecaptcha";
import fetchPost from '@/composables/fetchPostData'
import { useReCaptcha } from 'vue-recaptcha-v3'

const runtimeConfig = useRuntimeConfig()

const url = runtimeConfig.public.app.url;
const title = 'Contacto - Raúl Caro Pastorino | Desarrollador Web Full Stack Backend';
const description = 'Ponte en contacto con Raúl Caro Pastorino, un desarrollador web full stack especializado en backend. Descubre cómo puedo ayudarte a llevar tu proyecto al siguiente nivel con soluciones tecnológicas innovadoras.';
const keywords = 'contacto, Raúl Caro Pastorino, desarrollador web, full stack, backend, soluciones tecnológicas, proyectos web';

useHead({
    title: title,
    meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: url + '/contact' },
        { property: 'og:image', content: url + '/social/contact.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: url + '/social/contact.webp' }
    ]
});


//const recaptchaInstance = useReCaptcha();
const { executeRecaptcha } = useGoogleRecaptcha();

//const appConfig = useAppConfig()
//console.log(runtimeConfig.public.captcha.siteKey)
//const captchaSiteKey = runtimeConfig.public.captcha.siteKey;
// useApiBase() resuelve la URL correcta (proxy en dev para evitar CORS)
const apiBase = useApiBase()
const API_PATH_CONTACT: string = runtimeConfig.public.api.contact

const recaptchaIns = useReCaptcha()?.instance
const router = useRouter();

router.afterEach((to) => {
    if (to.path === '/contact') {
        setTimeout(() => {
            recaptchaIns?.value?.showBadge();
        }, 1000);
    } else {
        recaptchaIns?.value?.hideBadge();
    }
});

onMounted(() => {
    setTimeout(() => {
        recaptchaIns?.value?.showBadge();
    }, 1000);

    // Pre-carga la cookie CSRF para que el primer envío no falle ni tarde
    fetchCsrfToken().catch(() => { /* se reintentará al enviar */ });
});

onBeforeUnmount(() => {
    recaptchaIns?.value?.hideBadge();
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
        errors: [
            'Ha ocurrido un error al enviar el mensaje',
            'El mensaje no se ha enviado correctamente',
        ]
    }
});

const dataForm: Ref<FormData> = ref({
    valid: false,
    name: {
        value: '',
        valid: false,
        validations: {
            minLength: {
                value: 5,
                message: 'El nombre debe tener al menos 5 caracteres',
            },
            maxLength: {
                value: 50,
                message: 'El nombre no puede tener más de 50 caracteres',
            },
        },
    },
    email: {
        value: '',
        valid: false,
        validations: {
            minLength: {
                value: 8,
                message: 'El email debe tener al menos 8 caracteres',
            },
            maxLength: {
                value: 50,
                message: 'El email no puede tener más de 50 caracteres',
            },
            regexp: {
                value: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                message: 'El email no es válido',
            },

        },
    },
    subject: {
        value: '',
        valid: false,
        validations: {
            minLength: {
                value: 10,
                message: 'El asunto debe tener al menos 10 caracteres',
            },
            maxLength: {
                value: 100,
                message: 'El asunto no puede tener más de 100 caracteres',
            },
        },
    },
    message: {
        value: '',
        valid: false,
        validations: {
            minLength: {
                value: 30,
                message: 'El mensaje debe tener al menos 30 caracteres',
            },
            maxLength: {
                value: 1000,
                message: 'El mensaje no puede tener más de 1000 caracteres',
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
}

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
}

/**
 *
 * Comprueba si es formfield
 *
 * @param field
 */
const isFormField = (field: any): field is FormField => {
    return field && typeof field === 'object' && 'value' in field;
}

/**
 *
 * Comprueba todas las validaciones para un campo.
 *
 * @param {*} currentObject
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
}


/**
 *
 * Evento para revisar texto introducido en los campos del formulario.
 *
 * @param event
 * @param field
 */
const handleKeyup = (event: KeyboardEvent, field: string): void => {
    const target = event.target as HTMLElement;

    if (target && isFormField(dataForm.value[field])) {
        dataForm.value[field].value = target.innerText.trim();
        checkValidations(dataForm.value[field]);
    }
};

// Enviar el formulario con Enter pasa por la misma validación y confirmación que el botón
const onSubmit = async (e: Event) => {
    e.preventDefault();
    await showConfirmModal(e);
};

/* Protección anti-bots (además del reCAPTCHA v3 validado en servidor):
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
    if (honeypot.value || (Date.now() - formLoadedAt) < MIN_FILL_TIME_MS) {
        info.validated = true;
        info.submitted = true;
        info.messages.errors = [];
        info.messages.success = ['El mensaje se ha enviado correctamente'];
        info.step = 3;
        return;
    }

    isSubmitting.value = true;

    let token: string;

    try {
        ({ token } = await executeRecaptcha(RecaptchaAction.contact));
    } catch {
        token = '';
    }

    if (!token) {
        info.step = 3;
        info.validated = false;
        info.submitted = false;
        info.fail = true;
        info.messages.errors = ['Error al verificar el captcha. Por favor, recarga la página e inténtalo de nuevo.'];
        isSubmitting.value = false;
        return;
    }

    const data = {
        app_name: runtimeConfig.public.app.name,
        app_domain: runtimeConfig.public.app.domain,
        language: runtimeConfig.public.app.currentLocale,
        name: isFormField(dataForm.value.name) ? dataForm.value.name.value : '',
        email: isFormField(dataForm.value.email) ? dataForm.value.email.value : '',
        subject: isFormField(dataForm.value.subject) ? dataForm.value.subject.value : '',
        message: isFormField(dataForm.value.message) ? dataForm.value.message.value : '',
        privacity: isFormField(dataForm.value.privacity) ? dataForm.value.privacity.value : false,
        contactme: isFormField(dataForm.value.privacity) ? dataForm.value.privacity.value : false,
        captcha_token: token,
    };

    const apiUrl = apiBase + '/' + API_PATH_CONTACT;

    fetchPost(apiUrl, data)
        .then((data) => {

            //console.log(data)

            if (Array.isArray(data.messages?.errors)) {
                info.messages.errors = data.messages.errors;
            } else if (data.messages?.errors && typeof data.messages.errors === 'object') {
                info.messages.errors = Object.values(data.messages.errors).flat() as string[];;
            } else {
                info.messages.errors = [];
            }

            if (Array.isArray(data.messages?.success)) {
                info.messages.success = data.messages.success;
            } else if (data.messages?.success && typeof data.messages.success === 'object') {
                info.messages.success = Object.values(data.messages.success).flat() as string[];
            } else {
                info.messages.success = [];
            }

            // Formato alternativo de error de la API: { status: 'ko', error: { message } }
            if (!info.messages.errors.length && data?.status === 'ko') {
                info.messages.errors = [
                    data?.error?.message ?? 'No se ha podido enviar el mensaje. Inténtalo de nuevo más tarde.',
                ];
            }


            info.validated = info.messages.errors.length ? false : true;
            info.submitted = data?.data?.send ?? false;

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
        }).finally(() => {
            info.step = 3;
            isSubmitting.value = false;
        });
}

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
}

/**
 * Cancela el envío del email y cierra el modal.
 */
const cancelModal = (): void => {
    const info = stepsInfo.value;
    info.step = 1;
    info.show = false;
}

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
}
</script>


<template>
    <div class="min-h-screen bg-background circuit-pattern">

        <!-- Cabecera -->
        <div class="pt-12 pb-8 px-8 max-w-7xl mx-auto">
            <span class="font-label text-tertiary tracking-[0.3em] uppercase mb-4 flex items-center gap-3 text-xs">
                <span class="w-8 h-[1px] bg-tertiary"/>
                Canal de Contacto
            </span>
            <h1 class="font-headline text-6xl md:text-8xl font-bold tracking-tighter text-primary mb-6">
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
                        Fuera de servicio temporalmente mientras termino de implementar medidas de seguridad anti bots y
                        anti spam usando mi propia AI para ello.
                    </p>
                    <p class="text-on-surface-variant text-sm leading-relaxed">
                        Puedes contactarme mediante alguna de las
                        <NuxtLink to="/social" class="text-tertiary hover:underline">redes sociales</NuxtLink>
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
                    <form class="bg-surface-container-high rounded-xl border border-outline-variant/20 p-8 space-y-6" @submit.prevent="onSubmit">

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
                            >
                        </div>

                        <!-- Nombre y Email -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="flex flex-col gap-2">
                                <label for="name" class="font-label text-xs uppercase tracking-widest text-outline">Nombre</label>
                                <input
                                    id="name"
                                    v-model.trim="(dataForm.name as FormField).value as string"
                                    type="text"
                                    name="name"
                                    maxlength="50"
                                    autocomplete="name"
                                    :class="[
                                        'w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body placeholder:text-outline transition-colors',
                                        isFormField(dataForm.name) && dataForm.name.valid ? 'border-tertiary' : (isFormField(dataForm.name) && dataForm.name.errors?.length ? 'border-error' : 'border-outline-variant focus:border-secondary')
                                    ]"
                                    placeholder="Tu nombre completo"
                                    @keyup="checkValidationsFromEvent"
                                >
                                <template v-if="isFormField(dataForm.name) && dataForm.name.errors?.length">
                                    <span
                                        v-for="error in dataForm.name.errors"
                                        :key="error"
                                        class="text-error text-xs font-label"
                                    >{{ error }}</span>
                                </template>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="email" class="font-label text-xs uppercase tracking-widest text-outline">Email</label>
                                <input
                                    id="email"
                                    v-model.trim="(dataForm.email as FormField).value as string"
                                    type="email"
                                    name="email"
                                    maxlength="50"
                                    autocomplete="email"
                                    :class="[
                                        'w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body placeholder:text-outline transition-colors',
                                        isFormField(dataForm.email) && dataForm.email.valid ? 'border-tertiary' : (isFormField(dataForm.email) && dataForm.email.errors?.length ? 'border-error' : 'border-outline-variant focus:border-secondary')
                                    ]"
                                    placeholder="tu@email.com"
                                    @keyup="checkValidationsFromEvent"
                                >
                                <template v-if="isFormField(dataForm.email) && dataForm.email.errors?.length">
                                    <span
                                        v-for="error in dataForm.email.errors"
                                        :key="error"
                                        class="text-error text-xs font-label"
                                    >{{ error }}</span>
                                </template>
                            </div>
                        </div>

                        <!-- Asunto -->
                        <div class="flex flex-col gap-2">
                            <label for="subject" class="font-label text-xs uppercase tracking-widest text-outline">Asunto</label>
                            <input
                                id="subject"
                                v-model.trim="(dataForm.subject as FormField).value as string"
                                type="text"
                                name="subject"
                                maxlength="100"
                                autocomplete="off"
                                :class="[
                                    'w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body placeholder:text-outline transition-colors',
                                    isFormField(dataForm.subject) && dataForm.subject.valid ? 'border-tertiary' : (isFormField(dataForm.subject) && dataForm.subject.errors?.length ? 'border-error' : 'border-outline-variant focus:border-secondary')
                                ]"
                                placeholder="Asunto del mensaje"
                                @keyup="checkValidationsFromEvent"
                            >
                            <template v-if="isFormField(dataForm.subject) && dataForm.subject.errors?.length">
                                <span
                                    v-for="error in dataForm.subject.errors"
                                    :key="error"
                                    class="text-error text-xs font-label"
                                >{{ error }}</span>
                            </template>
                        </div>

                        <!-- Textarea oculto real -->
                        <div class="hidden">
                            <textarea
                                id="message"
                                v-model.trim="(dataForm.message as FormField).value as string"
                                name="message"
                            />
                        </div>

                        <!-- Mensaje contenteditable -->
                        <div class="flex flex-col gap-2">
                            <label class="font-label text-xs uppercase tracking-widest text-outline">Mensaje</label>
                            <span
                                role="textbox"
                                contenteditable
                                :class="[
                                    'min-h-[160px] w-full bg-surface-container-lowest border-b-2 outline-none px-4 py-3 text-on-surface font-body transition-colors block',
                                    isFormField(dataForm.message) && dataForm.message.valid ? 'border-tertiary' : (isFormField(dataForm.message) && dataForm.message.errors?.length ? 'border-error' : 'border-outline-variant focus:border-secondary')
                                ]"
                                @keyup="handleKeyup($event, 'message')"
                            />
                            <template v-if="isFormField(dataForm.message) && dataForm.message.errors?.length">
                                <span
                                    v-for="error in dataForm.message.errors"
                                    :key="error"
                                    class="text-error text-xs font-label"
                                >{{ error }}</span>
                            </template>
                        </div>

                        <!-- Privacidad -->
                        <div class="flex flex-col gap-2">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input
                                    id="privacity"
                                    v-model="(dataForm.privacity as FormField).value"
                                    type="checkbox"
                                    name="privacity"
                                    class="mt-1 w-4 h-4 accent-primary shrink-0"
                                    @change="checkValidationsFromEvent"
                                >
                                <span class="text-sm text-on-surface-variant leading-relaxed">
                                    Acepto recibir correos electrónicos y la
                                    <NuxtLink to="/privacy" target="_blank" class="text-tertiary hover:underline">
                                        política de privacidad
                                    </NuxtLink>.
                                </span>
                            </label>
                            <template v-if="isFormField(dataForm.privacity) && dataForm.privacity.errors?.length">
                                <span
                                    v-for="error in dataForm.privacity.errors"
                                    :key="error"
                                    class="text-error text-xs font-label"
                                >{{ error }}</span>
                            </template>
                        </div>

                        <!-- Botón enviar -->
                        <div class="pt-4">
                            <button
                                type="button"
                                class="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm tracking-widest uppercase rounded-lg hover:scale-95 transition-all duration-300"
                                @click="showConfirmModal"
                            >
                                Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Columna info lateral -->
                <div class="flex flex-col gap-6">
                    <div class="bg-surface-container-high rounded-xl border border-outline-variant/20 p-8">
                        <h3 class="font-headline text-lg font-bold mb-6 tracking-tight">Información de Contacto</h3>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <UiMaterialIcon class="text-primary text-sm" name="alternate_email" />
                                </div>
                                <div>
                                    <p class="font-label text-[10px] text-outline uppercase tracking-widest">Email</p>
                                    <p class="text-sm text-on-surface">public@raupulus.dev</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                                    <UiMaterialIcon class="text-tertiary text-sm" name="location_on" />
                                </div>
                                <div>
                                    <p class="font-label text-[10px] text-outline uppercase tracking-widest">Ubicación</p>
                                    <p class="text-sm text-on-surface">España</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                                    <UiMaterialIcon class="text-secondary text-sm" name="schedule" />
                                </div>
                                <div>
                                    <p class="font-label text-[10px] text-outline uppercase tracking-widest">Respuesta</p>
                                    <p class="text-sm text-on-surface">En cuanto sea posible</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"/>
                            <span class="font-label text-xs text-tertiary uppercase tracking-widest">Sistema Activo</span>
                        </div>
                        <p class="text-xs text-on-surface-variant leading-relaxed">
                            Formulario protegido con Google reCAPTCHA v3 para evitar spam.
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
