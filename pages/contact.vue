
<template>
    <section>
        <div class="box-title">
            <h2>
                Contáctame
            </h2>
        </div>

        <div class="box-form">
            <form>
                <div class="form-section two-columns">
                    <div>
                        <label for="name">Nombre</label>
                        <input type="text" id="name" name="name" />
                    </div>

                    <div>
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" />
                    </div>

                </div>

                <div class="form-section">
                    <label for="subject">Asunto</label>
                    <input type="text" id="subject" name="subject" />
                </div>

                <div class="form-section">
                    <label for="message">Mensaje</label>
                    <textarea id="message" name="message"></textarea>
                </div>

                <div class="form-section">
                    <label for="message">Mensaje</label>
                    <span class="textarea" role="textbox" contenteditable></span>
                </div>
            </form>
        </div>

        <div class="box-actions">
            <BtnGeneric text="Enviar Mensaje" />
        </div>
    </section>
</template>


<style scoped>
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
}

.box-form form textarea {
    display: block;
    width: 100%;
    resize: block;
    box-sizing: border-box;
    border: none;
    border-bottom: 3px solid #B0B0B0;
    background-color: transparent;
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


@media (max-width: 768px) {
    .box-form .form-section.two-columns {
        grid-template-columns: 1fr;
    }

    .box-form {
        width: 100%;
    }
}
</style>
