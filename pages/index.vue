<template>
    <!-- Mi trayectoria -->
    <section class="box-my-history">
        <div class="box-my-history-description">
            <div>
                <h2>
                    Conoce
                    <span class="text-primary font-bold">
                        ¡Mi Trayectoria!
                    </span>
                </h2>
            </div>

            <div>
                <p>
                    Soy desarrollador web principalmente backend: php, laravel, python, bash, javascript, vuejs, postgresql
                    y mariadb aunque también he trabajado en algunos proyectos con angular, ionic, typescript, jquery,
                    bootstrap, tailwindcss y nodejs.
                </p>

                <p>
                    Afinidad por el software libre, programación, iot y la tecnología en general.
                </p>

                <p>
                    Me gusta programar y crear contenido en mi tiempo libre, tengo varios proyectos con guías, tutoriales y
                    apuntes propios.
                </p>
            </div>
        </div>

        <div class="box-my-history-img">

            <img class="my-history-img" src="@/assets/images/my-history.webp" alt="Test">

        </div>

        <div class="inline-block">
            <BtnGeneric text="Curriculum Vitae" to="https://curriculum.raupulus.dev" />
            <BtnGeneric text="Contáctame" to="/contact" class="bg-dark" />
        </div>


    </section>


    <!-- Tecnologías -->
    <section>
        <div class="block text-center">
            <div>
                <h2 class="text-center">
                    Tecnologías
                </h2>
            </div>

            <div>
                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/php.svg" alt="PHP tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/laravel.svg" alt="Laravel tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/javascript.svg" alt="Javascript tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/vuejs.svg" alt="Vuejs tag">
                </div>

                <div class="inline-block">
                    <div class="inline-block">
                        <img class="technolgy-element" src="@/assets/images/technologies/tailwindcss.svg"
                            alt="Tailwindcss tag">
                    </div>

                    <div class="inline-block">
                        <img class="technolgy-element" src="@/assets/images/technologies/postgresql.svg"
                            alt="Postgresql tag">
                    </div>
                </div>
            </div>
        </div>

        <div class="section-separator"></div>
    </section>

    <!-- Especializaciones -->
    <section>
        <div class="block text-center">
            <div>
                <h2 class="text-center">
                    Especializaciones
                </h2>
            </div>

            <div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/specializations/backend-developer.svg"
                        alt="Backend Developer tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/specializations/api-rest.svg" alt="Api Rest tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/php.svg" alt="PHP tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/laravel.svg" alt="Laravel tag">
                </div>

            </div>
        </div>

        <div class="section-separator"></div>
    </section>

    <!-- Cards SoftSkills -->
    <section>
        <div class="block text-center">
            <CardVertical background="#2F3239" title="Estudiar, Practicar" tag="Autodidacta"
                description="Formación constante, poder ser autodidacta es maravilloso">
                <img src="@/assets/images/logo.webp" alt="Formación Autodidacta">
            </CardVertical>

            <CardVertical background="#005db5" title="Lógica API REST" tag="Backend"
                description="Especilizándome en apis. Destreza creando lógica y estructuras ">
                <img src="@/assets/images/logo.webp" alt="Backend Web Developer">
            </CardVertical>

            <CardVertical background="#EEB624" title="Libertad en lo Digital" tag="Open Source" description="Desarrollo publicando mis proyectos OSS
        Desde 2001 con software libre ">
                <img src="@/assets/images/logo.webp" alt="Open Source Developer">
            </CardVertical>
        </div>

        <div class="section-separator"></div>
    </section>
</template>

<style scoped>
.box-my-history {
    display: grid;
    grid-gap: 50px;
    grid-template-columns: 1fr auto;
}

@media (max-width: 956px) {
    .box-my-history {
        grid-template-columns: 1fr;
        grid-auto-flow: dense;
    }
}

.box-my-history-description {
    min-width: 300px;
}

.box-my-history-img {
    margin: auto;
    max-width: 450px;
    max-height: 250px;
    align-self: center;
}

.my-history-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.technolgy-element {
    margin: 2rem;
    width: auto;
    height: 40px;
}
</style>
