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
const API_BASE: string = runtimeConfig.public.api.base
const API_PATH_CONTACT: string = runtimeConfig.public.api.contact

const recaptchaIns = useReCaptcha()?.instance
const router = useRouter();

useHead({
    title: 'Contactar con Raúl Caro Pastorino',
})

router.afterEach((to, from) => {
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

const stepsInfo = ref({
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

let canSubmit: boolean = false;

const dataForm: Ref<FormData> = ref({
    valid: false,
    name: {
        value: 'adfsasdfasdfasdfasdfasd',
        valid: true,
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
        value: 'asdfasdfasdf@dsfsdf.es',
        valid: true,
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
                value: "^[a-z0-9]+[\@][a-z0-9]+[\.][a-z]{2,3}$",
                message: 'El email no es válido',
            },

        },
    },
    subject: {
        value: 'asdfasdfas dfasdf asdf asd fasdf asdf asdf asdf asdf',
        valid: true,
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
        value: 'asdf asdf asdf asd fasdf asd fasdf asdf asdf asd fasdf asdf asd fasd fasd fas dfasd fasd fas',
        valid: true,
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
}); 1

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
    let reg = new RegExp(pattern);

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

    let errors: string[] = [];

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

const onSubmit = async (e: Event) => {
    e.preventDefault();
    await handleSubmit(e);
};

const handleSubmit = async (e: Event): Promise<void> => {

    const info = stepsInfo.value;

    // Muestra el segundo paso con el resumen del email a enviar
    info.step = 2;

    const { token } = await executeRecaptcha(RecaptchaAction.contact);

    if (!token) {
        //console.log(captchaClient)
        //console.log('NO VALIDA EL CAPTCHA')

        // TODO: Ir al step 3 e informar del problema con captcha
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

    const apiUrl = API_BASE + '/' + API_PATH_CONTACT;

    fetchPost(apiUrl, data)
        .then((response) => response.json())
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


            // TODO: Limpiar todo el modal completado.
            info.validated = info.messages.errors.length ? false : true;

            // TODO: Quitar el botón para volver a enviar mensaje.
            info.submitted = data.data.send;


            if (info.validated && info.submitted) {
                // TODO: Limpiar modal y deshabilitar modal. Quizás reemplazar formulario por mensaje de enviado.
            }

            console.log('data.messages?.errors?.length', data.messages?.errors?.length)
            console.log('data.messages?.errors', data.messages?.errors)
            console.log('data.messages?.success?.length', data.messages?.success?.length)
            console.log('data.messages?.success', data.messages?.success)
            console.log('data', data)
            console.log('info', info)
            console.log('stepsInfo.value', stepsInfo.value)
            console.log('messages', info.messages)

        })
        .catch((error) => {
            console.error('Error:', error);
            console.error('Data:', data);
            info.validated = false;
            info.submitted = false;

            // TODO: Comprobar si vino mensaje de error desde la api o poner default.

            info.messages.errors.push('Error desconocido');


        }).finally(() => {
            info.step = 3;
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
        console.log('NO VALIDA EL FORM')
        return;
    }

    const info = stepsInfo.value;
    info.step = 1;
    info.show = true;
}
</script>

<template>
    <section>
        <div class="box-title">
            <h1>
                Formulario de

                <span class="text-primary font-bold">
                    Contacto
                </span>
            </h1>

            <p>
                <small>
                    Fuera de servicio temporalmente mientras termino de implementar medidas de seguridad anti bots y
                    anti spam usando mi propia AI para ello.
                </small>
            </p>

            <p>
                <small>
                    Puedes contactarme mediante alguna de las redes sociales con una cuenta que sea real y te contestaré
                    en cuanto me sea posible.
                </small>
            </p>
        </div>

        <div class="box-form">
            <form @submit.prevent="onSubmit">
                <div class="form-section two-columns">
                    <div class="box-input">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" @keyup="checkValidationsFromEvent"
                            v-model.trim="(dataForm.name as FormField).value as string"
                            :class="{ 'valid': isFormField(dataForm.name) && dataForm.name.valid, 'invalid': isFormField(dataForm.name) && dataForm.name.errors && dataForm.name.errors.length }"
                            name="name" />

                        <IconsInfo :size="16" class="check-errors-icon"
                            :show="isFormField(dataForm.name) && dataForm.name.valid !== null"
                            :type="isFormField(dataForm.name) && dataForm.name.valid ? 'success' : 'error'"></IconsInfo>

                        <span v-if="isFormField(dataForm.name)" v-for="error in dataForm.name.errors"
                            class="error-message">
                            {{ error }}
                        </span>
                    </div>

                    <div class="box-input">
                        <label for="email">Email</label>
                        <input type="email" @keyup="checkValidationsFromEvent"
                            :class="{ 'valid': isFormField(dataForm.email) && dataForm.email.valid, 'invalid': isFormField(dataForm.email) && dataForm.email.errors && dataForm.email.errors.length }"
                            v-model.trim="(dataForm.email as FormField).value as string" id="email" name="email" />

                        <IconsInfo :size="16" class="check-errors-icon"
                            :show="isFormField(dataForm.email) && dataForm.email.valid !== null"
                            :type="isFormField(dataForm.email) && dataForm.email.valid ? 'success' : 'error'">
                        </IconsInfo>

                        <span v-if="isFormField(dataForm.email)" v-for="error in dataForm.email.errors"
                            class="error-message">
                            {{ error }}
                        </span>
                    </div>
                </div>

                <div class="form-section box-input">
                    <label for="subject">Asunto</label>
                    <input type="text" id="subject" @keyup="checkValidationsFromEvent"
                        :class="{ 'valid': isFormField(dataForm.subject) && dataForm.subject.valid, 'invalid': isFormField(dataForm.subject) && dataForm.subject.errors && dataForm.subject.errors.length }"
                        v-model.trim="(dataForm.subject as FormField).value as string" name="subject" />

                    <IconsInfo :size="16" class="check-errors-icon"
                        :show="isFormField(dataForm.subject) && dataForm.subject.valid !== null"
                        :type="isFormField(dataForm.subject) && dataForm.subject.valid ? 'success' : 'error'">
                    </IconsInfo>
                    <span v-if="isFormField(dataForm.subject)" v-for="error in dataForm.subject.errors"
                        class="error-message">
                        {{ error }}
                    </span>
                </div>

                <div class="form-section hidden">
                    <textarea id="message" v-model.trim="(dataForm.message as FormField).value as string"
                        name="message"></textarea>
                </div>

                <div class="form-section box-input">
                    <label for="message">Mensaje</label>
                    <span class="textarea" role="textbox" @keyup="handleKeyup($event, 'message')"
                        :class="{ 'valid': isFormField(dataForm.message) && dataForm.message.valid, 'invalid': isFormField(dataForm.message) && dataForm.message.errors && dataForm.message.errors.length }"
                        contenteditable></span>

                    <IconsInfo :size="16" class="check-errors-icon"
                        :show="isFormField(dataForm.message) && dataForm.message.valid !== null"
                        :type="isFormField(dataForm.message) && dataForm.message.valid ? 'success' : 'error'">
                    </IconsInfo>

                    <span v-if="isFormField(dataForm.message)" v-for="error in dataForm.message.errors"
                        class="error-message">
                        {{ error }}
                    </span>
                </div>
            </form>
        </div>

        <div class="box-actions">
            <div class="form-section">
                <input type="checkbox" id="privacity" @change="checkValidationsFromEvent"
                    v-model="(dataForm.privacity as FormField).value" name="privacity" />
                <label for="privacity">
                    <span class="inline-block">
                        Acepta recibir correos
                    </span>

                    <span class="inline-block">
                        &nbsp;
                        electrónicos de mi parte
                    </span>

                    <span class="inline-block">
                        &nbsp;
                        y la

                        <NuxtLink to="/privacy" target="_blank">
                            política de privacidad.
                        </NuxtLink>
                    </span>

                    <IconsInfo :size="16" class="check-errors-icon"
                        :show="isFormField(dataForm.privacity) && dataForm.privacity.valid !== null"
                        :type="isFormField(dataForm.privacity) && dataForm.privacity.valid ? 'success' : 'error'">
                    </IconsInfo>
                </label>

                <span v-if="isFormField(dataForm.privacity)" v-for="error in dataForm.privacity.errors"
                    class="error-message">
                    {{ error }}
                </span>
            </div>

            <BtnGeneric text="Enviar Mensaje" @click="showConfirmModal" title="Enviar Mensaje" />

        </div>
    </section>

    <ModalsSubmitContact :show="stepsInfo.show" :step="stepsInfo.step" :messages="stepsInfo.messages"
        @finished="cancelModal" :dataForm="dataForm" @cancel="cancelModal" @submit="handleSubmit" />
</template>


<style lang="css" scoped>
.box-title {
    margin: 0 auto;
    text-align: center;
    padding: 1.3rem 1.3rem 0 1.3rem;
    box-sizing: border-box;
}

.box-form {
    margin: 0 auto;
    padding: 1.7rem 1.3rem;
    width: 80%;
    box-sizing: border-box;
}

.box-form form {
    width: 100%;
}

.box-form form label {
    display: block;
    margin-bottom: 0.6rem;
    box-sizing: border-box;
}

.box-form form input {
    width: calc(100% - 1.5rem);
    max-width: calc(100% - 1.5rem);
    box-sizing: border-box;
    border: none;
    border-bottom: 3px solid #B0B0B0;
    background-color: transparent;
    color: rgba(20, 20, 20, 0.64);
}

.box-input {
    text-align: center;
}

.box-input label {
    padding-left: 0.6rem;
    text-align: left;
}

/* Icono para mostrar error en cada campo */
.check-errors-icon {
    position: absolute;
    width: 1rem;
    height: 1rem;
    /* translate: -1.3rem; */
}

.box-form form span.textarea {
    color: rgba(20, 20, 20, 0.64);
}

.box-form form input:focus,
.box-form form span.textarea:focus {
    border-color: var(--primary);
    outline: none;
}


.box-form form .textarea {
    display: inline-block;
    width: calc(100% - 1.5rem);
    max-width: calc(100% - 1.5rem);
    resize: block;
    box-sizing: border-box;
    border-bottom: 3px solid #B0B0B0;
    text-align: left;
    word-wrap: break-word;
}

.box-form .form-section {
    padding: 2rem;
    box-sizing: border-box;
    max-width: calc(100vw - 2.5rem);
}

.box-form .form-section.two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
}


.box-actions {
    margin: 1.3rem auto 5rem auto;
    max-width: 80%;
    text-align: center;
}

.box-actions>span {
    cursor: pointer;
}


.invalid {
    border-bottom: 3px solid #B72020 !important;
}

.valid {
    border-bottom: 3px solid #34B832 !important;
}


.error-message {
    display: block;
    width: 100%;
    color: #B72020;
    font-size: 0.8rem;
    font-style: italic;
}

@media (max-width: 768px) {
    .box-form .form-section.two-columns {
        grid-template-columns: 1fr;
    }

    .box-form {
        width: 100%;
    }
}
</style>
