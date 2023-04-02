<template>
    <section>
        <div>
            <h2 class="text-center">
                Sobre
                <span>
                    Mi
                </span>
            </h2>
        </div>

        <div class="box-description">
            <div>

                <div class="box-text">
                    <p>
                        Hola, soy Raúl Caro Pastorino, apasionado por el software y el hardware.
                    </p>

                    <p>
                        La tecnología está presente en mi vida desde que tengo uso de razón, tuve mi primer contacto apenas
                        aprendiendo a leer ya que en casa tuvimos la suerte de tener ordenador desde bastante pequeño.
                    </p>

                    <p>
                        Este es mi portal de presentación donde enlazo a mis contenidos, trabajos y colaboraciones.
                    </p>

                    <p>
                        Actualmente me encuentro terminando de formarme mientras pongo en práctica todo lo que voy
                        aprendiendo
                        en
                        pequeños trabajos y proyectos propios y con otras personas que tienen los mismos objetivos.
                    </p>
                </div>

                <div class="box-buttons">
                    <BtnGeneric to="https://curriculum.raupulus.dev" text="Curriculum Vitae" />
                </div>


            </div>

            <div class="box-image">
                <img src="@/assets/images/about.webp" alt="Imagen de Raúl Caro Pastorino">
            </div>
        </div>
    </section>
</template>

<style scoped>
.box-description {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 100px;
}

.box-text {
    font-size: 1.2rem;
    line-height: 2.5rem;
}

.box-image {
    width: 100%;
    overflow: hidden;
    border-radius: 20px;
    align-self: center;
}

.box-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

@media (max-width: 920px) {
    .box-description {
        display: block;
        grid-template-columns: none;
        gap: 0;
    }

    .box-image {
        width: 80%;
        margin: 3rem auto 2rem auto;
    }

    .box-buttons {
        text-align: center;
    }
}
</style>
