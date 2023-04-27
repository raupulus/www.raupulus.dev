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

            <div class="btn-group">
                <BtnGeneric text="Curriculum Vitae " to="https://curriculum.raupulus.dev">

                    <template #after>
                        <svg class="btn-curriculum-icon-after" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.9374 15.4933L15.7175 8.71318C15.8202 8.61045 15.8932 8.49916 15.9363 8.37931C15.9788 8.25946 16 8.13105 16 7.99408C16 7.85711 15.9788 7.72869 15.9363 7.60884C15.8932 7.48899 15.8202 7.3777 15.7175 7.27498L8.9374 0.49488C8.74906 0.306544 8.51382 0.207925 8.23165 0.199021C7.94881 0.190803 7.70466 0.289422 7.4992 0.49488C7.29374 0.683216 7.18656 0.918465 7.17766 1.20063C7.16944 1.48347 7.26806 1.72762 7.47352 1.93308L12.5072 6.96679H1.02729C0.736223 6.96679 0.492071 7.06507 0.294832 7.26162C0.0982779 7.45886 0 7.70301 0 7.99408C0 8.28514 0.0982779 8.52895 0.294832 8.7255C0.492071 8.92274 0.736223 9.02136 1.02729 9.02136H12.5072L7.47352 14.0551C7.28518 14.2434 7.18656 14.4831 7.17766 14.7742C7.16944 15.0652 7.26806 15.3049 7.47352 15.4933C7.66185 15.6987 7.90155 15.8015 8.19262 15.8015C8.48368 15.8015 8.73194 15.6987 8.9374 15.4933Z"
                                fill="#E6E6E6" />
                        </svg>

                    </template>

                </BtnGeneric>
                <BtnGeneric text="Contáctame" to="/contact" class="text-white bg-dark" />
            </div>
        </div>

        <div class="box-my-history-img">
            <img class="my-history-img" src="@/assets/images/my-history.webp" alt="Oficina en casa">

        </div>
    </section>


    <!-- Tecnologías -->
    <section class="mt-2">
        <div class="block text-center">
            <div>
                <h2 class="text-center">
                    Stack
                </h2>
            </div>

            <div>
                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/php.webp" alt="PHP tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/laravel.webp" alt="Laravel tag">
                </div>



                <div class="inline-block">
                    <div class="inline-block">
                        <img class="technolgy-element" src="@/assets/images/technologies/vuejs.webp" alt="Vuejs tag">
                    </div>

                    <div class="inline-block">
                        <img class="technolgy-element" src="@/assets/images/technologies/javascript.webp"
                            alt="Javascript tag">
                    </div>

                    <div class="inline-block">
                        <img class="technolgy-element" src="@/assets/images/technologies/postgresql.webp"
                            alt="Postgresql tag">
                    </div>
                </div>
            </div>
        </div>

        <div class="section-separator"></div>
    </section>

    <!-- Especializaciones -->
    <section class="mt-2">
        <div class="block text-center">
            <div>
                <h2 class="text-center">
                    Especializaciones
                </h2>
            </div>

            <div>
                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/specializations/web-developer.webp"
                        alt="Desarrollador Web">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/specializations/api-rest.webp" alt="Api Rest tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/specializations/backend-developer.webp"
                        alt="Backend Developer tag">
                </div>

                <div class="inline-block">
                    <img class="technolgy-element" src="@/assets/images/technologies/linux.webp" alt="Linux tag">
                </div>
            </div>
        </div>

        <div class="section-separator"></div>
    </section>

    <!-- Cards SoftSkills -->
    <section class="mt-2">
        <div class="block text-center">
            <CardVertical background="#2F3239" title="Estudiar, Practicar" tag="Autodidacta"
                description="Formación constante, poder ser autodidacta es maravilloso">
                <img src="@/assets/images/soft-skills/logotipo.webp" alt="Formación Autodidacta">
            </CardVertical>

            <CardVertical background="#005db5" title="Lógica API REST" tag="Backend"
                description="Especilizándome en apis. Destreza creando lógica y estructuras ">
                <img src="@/assets/images/soft-skills/cloud.webp" alt="Backend Web Developer">
            </CardVertical>

            <CardVertical background="#EEB624" title="Libertad en lo Digital" tag="Open Source"
                description="Desarrollo publicando mis proyectos OSS Desde 2001 con software libre ">
                <img src="@/assets/images/soft-skills/gnu_linux.webp" alt="Open Source Developer">
            </CardVertical>
        </div>

        <div class="section-separator"></div>

        <!-- Soft Skills -->
        <div class="block text-center mt-2">

            <div>
                <h2 class="text-center">
                    Habilidades
                </h2>
            </div>

            <CardSkill title="Rápido Aprendizaje"
                description="Capto conceptos con facilidad además de aprender de mis errores.">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M5 8v-3a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5"></path>
                    <circle cx="6" cy="14" r="3"></circle>
                    <path d="M4.5 17l-1.5 5l3 -1.5l3 1.5l-1.5 -5"></path>
                </svg>

            </CardSkill>

            <CardSkill title="Organización" description="Me gusta tener todo modular, comentado y ordenado.">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M18 8a3 3 0 0 1 0 6"></path>
                    <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path>
                    <path
                        d="M12 8h0l4.524 -3.77a0.9 .9 0 0 1 1.476 .692v12.156a0.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8">
                    </path>
                </svg>
            </CardSkill>

            <CardSkill title="Colaboración" description=" Me gusta trabajar en equipo y participar en las propuestas. ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <polyline points="12 3 20 7.5 20 16.5 12 21 4 16.5 4 7.5 12 3"></polyline>
                    <line x1="12" y1="12" x2="20" y2="7.5"></line>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <line x1="12" y1="12" x2="4" y2="7.5"></line>
                    <line x1="16" y1="5.25" x2="8" y2="9.75"></line>
                </svg>
            </CardSkill>

            <CardSkill title="Sistemas y Servidores" description="Conocimientos de sistemas operativos, y servidores VPS.">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 9l3 3l-3 3"></path>
                    <line x1="13" y1="15" x2="16" y2="15"></line>
                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                </svg>
            </CardSkill>

            <CardSkill title="Curioso por Naturaleza"
                description="Me apasiona probar las novedades tecnológicas que descubro.">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="9.5" y1="11" x2="9.51" y2="11"></line>
                    <line x1="14.5" y1="11" x2="14.51" y2="11"></line>
                    <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
                    <path d="M7 5h1v-2h8v2h1a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3v1h-10v-1a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3">
                    </path>
                </svg>
            </CardSkill>

            <CardSkill title="Comprometido"
                description="Cuando doy mi palabra, hago todo lo posible por cumplir en lo acordado.">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                    fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="15" y1="5" x2="15" y2="7"></line>
                    <line x1="15" y1="11" x2="15" y2="13"></line>
                    <line x1="15" y1="17" x2="15" y2="19"></line>
                    <path
                        d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2">
                    </path>
                </svg>
            </CardSkill>

        </div>

        <div class="section-separator"></div>
    </section>

    <!-- Redes Sociales -->
    <section class="mt-2">
        <div class="block text-center">

            <div>
                <h2 class="text-center">
                    Redes Sociales
                </h2>
            </div>

            <div class="box-social-icons inline-block">
                <div class="inline-block">
                    <IconsYoutube :size="64" />
                </div>

                <div class="inline-block">
                    <IconsLinkedin :size="64" />
                </div>

                <div class="inline-block">
                    <IconsTwitch :size="64" />
                </div>
            </div>

            <div class="box-social-icons inline-block">
                <div class="inline-block">
                    <IconsGitlab :size="64" />
                </div>
            </div>

            <div class="box-social-icons inline-block">
                <div class="inline-block">
                    <IconsGithub :size="64" />
                </div>

                <div class="inline-block">
                    <IconsMastodon :size="64" />
                </div>

                <div class="inline-block">
                    <IconsTwitter :size="64" />
                </div>
            </div>
        </div>
    </section>

    <div class="mt-5"></div>
</template>

<style scoped>
.box-my-history {
    display: grid;
    padding: 0 1.3rem;
    grid-gap: 50px;
    grid-template-columns: 1fr auto;
}

@media (max-width: 956px) {
    .box-my-history {
        grid-template-columns: 1fr;
        grid-auto-flow: dense;
    }

    .btn-group {
        text-align: center;
        margin: auto;
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

.box-social-icons>div {
    margin: 15px 1rem;

}

.btn-curriculum-icon-after {
    width: 0.8rem;
    height: 0.8rem;
}
</style>
