<template>
    <section class="box-my-history">
        <div class="box-my-history-description">
            <div>
                <h2>
                    Conoce
                    <span class="primary font-bold">
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
</style>
