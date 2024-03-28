
<script setup>
import { useReCaptcha } from 'vue-recaptcha-v3';
import fetchPost from '@/composables/fetchPostData'

const runtimeConfig = useRuntimeConfig()

const recaptchaInstance = useReCaptcha();

//const appConfig = useAppConfig()
//console.log(runtimeConfig.public.captcha.siteKey)
//const captchaSiteKey = runtimeConfig.public.captcha.siteKey;
const API_BASE = runtimeConfig.public.api.base
const API_PATH_CONTACT = runtimeConfig.public.api.contact

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

let canSubmit = false;

const recaptcha = async () => {

    try {
        // optional you can await for the reCaptcha load
        await recaptchaInstance?.recaptchaLoaded();

        // get the token, a custom action could be added as argument to the method
        return await recaptchaInstance?.executeRecaptcha('contact');
    } catch (error) {
        console.error('ERROR CAPTCHA', error);
    }

    return null;
};

const dataForm = ref({
    name: {
        value: 'adfsasdfasdfasdfasdfasd',
        valid: null,
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
        valid: null,
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
        valid: null,
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
        valid: null,
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
        valid: null,
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
const checkRegexp = (pattern, value) => {
    let reg = new RegExp(pattern);
    return reg.test(value);
}

/**
 * Comprueba si un campo input valida tras tener un cambio de estado/valor recibiendo el evento.
 *
 * @param {*} e Evento que lanza la revisión de validaciones.
 */
const checkValidationsFromEvent = (e) => {
    const ele = e.target;
    const currentObject = dataForm.value[ele.name];

    checkValidations(currentObject)
}

/**
 *
 * Comprueba todas las validaciones para un campo.
 *
 * @param {*} currentObject
 */
const checkValidations = (currentObject) => {
    const value = currentObject.value;
    const validations = currentObject.validations;

    let errors = [];

    if (validations.minLength && value.length < validations.minLength.value) {
        errors.push(validations.minLength.message ?? 'El campo no cumple con la longitud mínima');
    }

    if (validations.maxLength && value.length > validations.maxLength.value) {
        errors.push(validations.maxLength.message ?? 'El campo no cumple con la longitud máxima');
    }

    if (validations.regexp && !checkRegexp(validations.regexp.value, value)) {
        errors.push(validations.regexp.message ?? 'El campo no cumple con el patrón de validación');
    }

    if (validations.required && validations.required.value && value !== true) {
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


const handleSubmit = async (e) => {

    const info = stepsInfo.value;

    // Muestra el segundo paso con el resumen del email a enviar
    info.step = 2;

    const token = await recaptcha();

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
        name: dataForm.value.name.value,
        email: dataForm.value.email.value,
        subject: dataForm.value.subject.value,
        message: dataForm.value.message.value,
        privacity: dataForm.value.privacity.value,
        contactme: dataForm.value.privacity.value,
        captcha_token: token,
    };

    const apiUrl = API_BASE + '/' + API_PATH_CONTACT;


    fetchPost(apiUrl, data)
        .then((response) => response.json())
        .then((data) => {
            info.messages.errors = data.messages?.errors ?? [];
            info.messages.success = info.messages.errors ? [] : (data.messages?.success ?? []);

            // TODO: Limpiar todo el modal completado.
            info.validated = false; // Check from api

            // TODO: Quitar el botón para volver a enviar mensaje.
            info.submitted = true;
        })
        .catch((error) => {
            console.error('Error:', error);
            info.validated = false;
            info.submitted = false;

            // TODO: Comprobar si vino mensaje de error desde la api o poner default.

            info.messages.errors.push = ['Error desconocido'];


        }).finally(() => {
            info.step = 3;

        });
}

/**
 * Comprueba si el formulario es válido.
 */
const formIsValid = () => {
    let isValid = true;

    Object.keys(dataForm.value).forEach((key) => {
        const currentObject = dataForm.value[key];

        if (currentObject.validations) {
            checkValidations(dataForm.value[key]);

            if (!dataForm.value[key].valid) {
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
const cancelModal = () => {
    const info = stepsInfo.value;
    info.step = 1;
    info.show = false;
}

/**
 * Muestra el modal de confirmación de envío de email.
 *
 * @param {*} e Evento que lanza la confirmación de envío de email.
 */
const showConfirmModal = async (e) => {
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
            <h2>
                Contáctame
            </h2>
        </div>

        <div class="box-form">
            <form @submit.prevent="onSubmit">
                <div class="form-section two-columns">
                    <div class="box-input">
                        <label for="name">Nombre</label>
                        <input type="text" id="name" @keyup="checkValidationsFromEvent" v-model.trim="dataForm.name.value"
                            :class="{ 'valid': dataForm.name.valid, 'invalid': dataForm.name.errors && dataForm.name.errors.length }"
                            name="name" />

                        <IconsInfo :size="16" class="check-errors-icon" :show="dataForm.name.valid !== null"
                            :type="dataForm.name.valid ? 'success' : 'error'"></IconsInfo>

                        <span v-for="error in dataForm.name.errors" class="error-message">
                            {{ error }}
                        </span>
                    </div>

                    <div class="box-input">
                        <label for="email">Email</label>
                        <input type="email" @keyup="checkValidationsFromEvent"
                            :class="{ 'valid': dataForm.email.valid, 'invalid': dataForm.email.errors && dataForm.email.errors.length }"
                            v-model.trim="dataForm.email.value" id="email" name="email" />

                        <IconsInfo :size="16" class="check-errors-icon" :show="dataForm.email.valid !== null"
                            :type="dataForm.email.valid ? 'success' : 'error'"></IconsInfo>

                        <span v-for="error in dataForm.email.errors" class="error-message">
                            {{ error }}
                        </span>
                    </div>
                </div>

                <div class="form-section box-input">
                    <label for="subject">Asunto</label>
                    <input type="text" id="subject" @keyup="checkValidationsFromEvent"
                        :class="{ 'valid': dataForm.subject.valid, 'invalid': dataForm.subject.errors && dataForm.subject.errors.length }"
                        v-model.trim="dataForm.subject.value" name="subject" />

                    <IconsInfo :size="16" class="check-errors-icon" :show="dataForm.subject.valid !== null"
                        :type="dataForm.subject.valid ? 'success' : 'error'"></IconsInfo>
                    <span v-for="error in dataForm.subject.errors" class="error-message">
                        {{ error }}
                    </span>
                </div>

                <div class="form-section hidden">
                    <textarea id="message" v-model.trim="dataForm.message.value" name="message"></textarea>
                </div>

                <div class="form-section box-input">
                    <label for="message">Mensaje</label>
                    <span class="textarea" role="textbox"
                        @keyup="dataForm.message.value = $event.target.innerText.trim(); checkValidations(dataForm.message);"
                        :class="{ 'valid': dataForm.message.valid, 'invalid': dataForm.message.errors && dataForm.message.errors.length }"
                        contenteditable></span>

                    <IconsInfo :size="16" class="check-errors-icon" :show="dataForm.message.valid !== null"
                        :type="dataForm.message.valid ? 'success' : 'error'"></IconsInfo>

                    <span v-for="       error       in       dataForm.message.errors      " class="error-message">
                        {{ error }}
                    </span>
                </div>
            </form>
        </div>

        <div class="box-actions">
            <div class="form-section">
                <input type="checkbox" id="privacity" @change="checkValidationsFromEvent" v-model="dataForm.privacity.value"
                    name="privacity" />
                <label for="privacity">
                    <span class="inline-block">
                        Acepta recibir correos
                    </span>


                    <span class="inline-block">
                        &nbsp;
                        electrónicos de mi parte.
                    </span>

                    <IconsInfo :size="16" class="check-errors-icon" :show="dataForm.privacity.valid !== null"
                        :type="dataForm.privacity.valid ? 'success' : 'error'"></IconsInfo>
                </label>

                <span v-for="       error        in        dataForm.privacity.errors       " class="error-message">
                    {{ error }}
                </span>
            </div>

            <BtnGeneric text="Enviar Mensaje" @click="showConfirmModal" />

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
