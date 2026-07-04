<script setup lang="ts">
const emit = defineEmits(['disablescroll', 'finished', 'cancel', 'submit'])

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
        type: Object,
        default: () => ({
            success: [],
            errors: [
                'Ha ocurrido un error al enviar el mensaje',
                'El mensaje no se ha enviado correctamente, por favor, inténtelo de nuevo más tarde o contáctame directamente por linkedin',
            ]
        }),
    },
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

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <div v-if="show" class="box-modal" role="dialog" aria-modal="true" aria-label="Confirmación de envío de email">
        <div class="box-modal-overlay">
            <div v-if="step === 1" class="box-resume">
                <div class="resume-title">
                    Resumen de los datos introducidos
                </div>

                <div class="box-resume-content">
                    <div class="resume-content">
                        De
                        <span class="resume-data">
                            {{ dataForm.name.value }}
                        </span>

                        (<span class="resume-data">
                            {{ dataForm.email.value }}
                        </span>)
                    </div>

                    <div class="resume-content text-center">
                        <span class="resume-data">
                            {{ dataForm.subject.value }}
                        </span>
                    </div>

                    <div class="resume-content">
                        <span class="resume-data">
                            {{ dataForm.message.value }}
                        </span>
                    </div>
                </div>

                <div class="text-center">
                    <BtnGeneric text="Cancelar" class="btn-cancel" title="Botón de Cancelar" @click="emit('cancel')" />
                    <BtnGeneric text="Confirmar" title="Botón para enviar email" @click="emit('submit')" />
                </div>
            </div>

            <div v-if="step === 2" class="box-loading">

                <div class="loading-title">
                    Procesando datos
                </div>

                <div class="loading-spinner">
                    <img class="img-send-email" src="@/assets/images/gifs/pc-load.gif" alt="Email Enviado">
                </div>

                <div class="loading-info">
                    <p>
                        Se está validando y enviando la información introducida en el formulario además de la puntuación
                        recaptcha.
                    </p>

                    <p>
                        Por favor, espere uno instante.
                    </p>
                </div>
            </div>




            <div v-if="step === 3" class="box-submitted">
                <div class="submitted-title">
                    Email
                    {{ !messages.errors.length && messages.success.length ? 'Enviado' : 'No enviado' }}
                </div>

                <!-- Mensaje Enviado -->
                <div v-if="messages.success.length">
                    <img class="img-send-email" src="@/assets/images/gifs/email-send.gif" alt="Email Enviado">
                </div>

                <!-- Mensaje No enviado -->
                <div v-if="messages.errors.length" class="submitted-info">
                    <div>HAY ERRORES</div>

                    <template v-if="messages.errors.captcha && messages.errors.captcha.length">
                        <div v-for="(err, idx) in messages.errors.captcha" :key="idx">
                            <p>
                                {{ err }}
                            </p>
                        </div>
                    </template>

                    <template v-if="messages.errors.testeando && messages.errors.testeando.length">
                        <div v-for="(err, idx) in messages.errors.testeando" :key="idx">
                            <p>
                                {{ err }}
                            </p>
                        </div>
                    </template>
                </div>

                <div v-if="messages.success.length" class="submitted-info">
                    <div>HAY SUCCESS</div>

                    <p v-for="(suc, idx) in messages.success" :key="idx">
                        {{ suc }}
                    </p>
                </div>


                <div>
                    <BtnGeneric text="Cerrar" title="Botón para Finalizar envío" @click="emit('finished')" />
                </div>
            </div>
        </div>

    </div>
</template>


<style scoped>
.box-modal {
    position: fixed;
    display: grid;
    place-items: center;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    overflow: scroll;
}

.box-modal-overlay {
    display: grid;
    max-width: 90%;
    min-height: 70%;
    min-width: 70%;
    background-color: var(--gray);
    box-sizing: border-box;
}

.box-loading {
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
    background-color: var(--gray);
}


.loading-title {
    margin-top: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
}

.loading-spinner {
    margin-top: 1rem;
    width: 150px;
    height: 150px
}

.loading-spinner img {
    width: 100%;
    height: 100%;
}

.loading-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    padding: 0 2rem;
}

.box-resume {
    width: 100%;
}

.box-resume-content {
    margin: auto;
    padding: 0.3rem 3rem;
    width: 80%;
    background-color: #fff;
    box-sizing: border-box;
}

.resume-title {
    margin: 2rem auto;
    font-size: 1.5rem;
    font-weight: 400;
    text-align: center;
}

.resume-content {
    margin: 3rem auto;
    font-size: 1.1rem;
}

.resume-data {
    font-style: italic;
    font-weight: 400;
}

.box-submitted {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    grid-template-columns: 1fr;
}

.submitted-title {
    text-align: center;
    font-size: 3.5rem;
    font-weight: 400;
}

.submitted-info {
    width: 80%;
    font-size: 0.9rem;
}

.img-send-email {
    width: 150px;
    height: 150px;
}

@media (max-width: 768px) {
    .resume-title {
        margin: 1rem auto;
        font-size: 1.2rem;
    }

    .box-resume-content {
        width: 90%;
        padding: 0.3rem 1rem;
    }
}
</style>