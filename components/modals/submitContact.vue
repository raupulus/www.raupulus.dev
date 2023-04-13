<script setup>
const emit = defineEmits(['disablescroll'])



const props = defineProps({
    show: {
        type: Boolean,
        default: true,
    },
    step: {
        type: Number,
        default: 1, // 1: loading, 2: resume, 3: submitted
    },
});
</script>

<template>
    <div class="box-modal" v-if="show">
        <div class="box-modal-overlay">
            <div class="box-loading" v-if="step === 1">

                <div class="loading-title">
                    Procesando datos
                </div>

                <div class="loading-spinner">
                    <img class="img-send-email" src="@/assets/images/gifs/pc-load.gif" alt="Email Enviado">
                </div>

                <div class="loading-info">
                    <p>
                        Se está validando la información introducida en el formulario y la validación mediante google
                        recaptcha.
                    </p>

                    <p>
                        Por favor, espere unos segundos.
                    </p>
                </div>
            </div>


            <div class="box-resume" v-if="step === 2">
                Pantalla 2 - Resumen del email para confirmar
            </div>

            <div class="box-submitted" v-if="step === 3">
                <div class="submitted-title">
                    Email enviado
                </div>

                <div>
                    <img class="img-send-email" src="@/assets/images/gifs/email-send.gif" alt="Email Enviado">
                </div>

                <div class="submitted-info">
                    El email ha sido enviado correctamente.
                    <br>
                    Recibiras respuesta en el email indicado lo antes que me sea
                    posible.
                </div>


                <div>
                    <BtnGeneric text="Cerrar" @click="emit('finished')" />
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
}

.box-modal-overlay {
    display: grid;
    padding: 2rem;
    max-height: 90%;
    max-width: 90%;
    min-height: 70vh;
    min-width: 70vw;
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
}

.box-submitted {
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    grid-template-columns: 1fr;
}

.submitted-title {
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
</style>
