
<script setup>
import { useReCaptcha } from 'vue-recaptcha-v3';

const recaptchaInstance = useReCaptcha();

onBeforeMount(() => {
    console.log('onBeforeMount');

});



onBeforeUnmount(() => {
    console.log('onBeforeUnmount');
});

const recaptcha = async () => {

    try {
        // optional you can await for the reCaptcha load
        await recaptchaInstance?.recaptchaLoaded();

        // get the token, a custom action could be added as argument to the method
        const token = await recaptchaInstance?.executeRecaptcha('contact');

        console.log('HA TERMINADO PROMESA', token);
    } catch (error) {
        console.log('ERROR', error);
    }
};





const runtimeConfig = useRuntimeConfig()
//const appConfig = useAppConfig()
//console.log(runtimeConfig.public.captcha.siteKey)
const captchaSiteKey = runtimeConfig.public.captcha.siteKey;

// TOKEN CAPTCHA - TEMP NAME
let token = ref(null);







const handleKeyDownEvent = (e) => {
    console.log('key down', e);
}


let canSubmit = false;

const dataForm = ref({
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
                value: "^[a-z0-9]+[\@][a-z0-9]+[\.][a-z]{2,3}$",
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
watch(dataForm.value.message, async (current, old) => {
    checkValidations(dataForm.value.message);
})

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


const handleSubmit = (e) => {

    // Enviar a la api

    // Gestionar respuesta de la api
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

const confirmSubmit = async (e) => {
    e.preventDefault();

    // Abrir pantalla espera
    await recaptcha();
    // Cerrar pantalla espera

    return;

    if (!formIsValid()) {
        console.log('NO VALIDA EL FORM')
        return;
    }

    // TODO: Mover validación del captcha a esta línea

    // Abrir modal con resumen del email a enviar


    console.log(dataForm.value);

    return;


    // Abrir modal con resumen del email a enviar
    //console.log('confirm submit');
}

// TODOS:
// Añadir captcha
// Añadir validación de campos
// Añadir envío de formulario
// Serializar datos y preparar para enviar a la api
// Mensajes de confirmación, error, validación de captcha (si es una puntuación baja: avisar que voy a tardar en leerlo todo)
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

                        <span v-for="error in dataForm.name.errors" class="error-message">
                            {{ error }}
                        </span>
                    </div>

                    <div class="box-input">
                        <label for="email">Email</label>
                        <input type="email" @keyup="checkValidationsFromEvent"
                            :class="{ 'valid': dataForm.email.valid, 'invalid': dataForm.email.errors && dataForm.email.errors.length }"
                            v-model.trim="dataForm.email.value" id="email" name="email" />

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

                    <span v-for="error in dataForm.subject.errors" class="error-message">
                        {{ error }}
                    </span>
                </div>

                <div class="form-section hidden">
                    <textarea id="message" v-model.trim="dataForm.message.value" name="message"></textarea>
                </div>

                <div class="form-section box-input">
                    <label for="message">Mensaje</label>
                    <span class="textarea" role="textbox" @keyup="dataForm.message.value = $event.target.innerText.trim();"
                        :class="{ 'valid': dataForm.message.valid, 'invalid': dataForm.message.errors && dataForm.message.errors.length }"
                        contenteditable></span>


                    <span v-for="error in dataForm.message.errors" class="error-message">
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
                    Acepta recibir correos electrónicos de mi parte.
                </label>

                <span v-for="error in dataForm.privacity.errors" class="error-message">
                    {{ error }}
                </span>
            </div>

            <BtnGeneric text="Enviar Mensaje" @click="confirmSubmit" />

        </div>
    </section>
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
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 3px solid #B0B0B0;
    background-color: transparent;
    color: rgba(20, 20, 20, 0.64);
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
    display: block;
    width: 100%;
    resize: block;
    box-sizing: border-box;
    border-bottom: 3px solid #B0B0B0;
}

.box-form .form-section {
    padding: 2rem;
    box-sizing: border-box;
}

.box-form .form-section.two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
}


.box-actions {
    margin: 1.3rem auto 5rem auto;
    text-align: center;
}

.box-actions>span {
    cursor: pointer;
}


.invalid {
    border-bottom: 3px solid red !important;
}

.valid {
    border-bottom: 3px solid green !important;
}


.error-message {
    display: block;
    width: 100%;
    color: #ff0000;
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
