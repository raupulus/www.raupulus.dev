<template>
  <section class="box-trajectory">
    <div class="box-trajectory-first">

      <div class="box-trajectory-text">
        <h2>
          Conoce
          <span class="text-primary font-bold">
            ¡Mi Trayectoria!
          </span>
        </h2>

        <p>
          Soy un desarrollador web con amplia experiencia en el desarrollo backend, con especialización en
          PHP, Laravel, Python y Bash.
        </p>

        <p>
          Poseo también conocimientos en JavaScript, Vue.js, PostgreSQL y MariaDB.
        </p>

        <p>
          También he trabajado en algunos proyectos con angular, ionic, typescript, jquery,
          bootstrap, tailwindcss y nodejs.
        </p>
      </div>

      <div class="box-trajectory-badge">
        <SpecializationBadge text="Web">
          <NuxtImg src="/specializations/earth.svg" width="60" alt="Icon Earth"
            loading="lazy" title="Web Developer" />
        </SpecializationBadge>

        <SpecializationBadge text="Api Rest">
          <NuxtImg src="/specializations/cloud.svg" width="60" alt="Icon Cloud"
            loading="lazy" title="Api Rest" />
        </SpecializationBadge>
      </div>

    </div>

    <div class="box-trajectory-second">
      <div class="box-trajectory-badge">
        <SpecializationBadge text="Back-End">
          <NuxtImg src="/specializations/chip.svg" width="60" alt="Icon Chip" loading="lazy"
            title="Web Backend Developer" />
        </SpecializationBadge>

        <SpecializationBadge text="Linux">
          <NuxtImg src="/specializations/linux.svg" width="60" alt="Icon Linux"
            loading="lazy" title="GNU/Linux" />
        </SpecializationBadge>
      </div>

      <div class="box-trajectory-text">
        <h2>
          Mi
          <span class="text-primary font-bold">
            ¡Carrera!
          </span>
        </h2>

        <p>
          A lo largo de mi carrera he participado en una variedad de proyectos, desde pequeños sitios
          web hasta grandes aplicaciones empresariales.
        </p>

        <p>
          En este portfolio web encontrará una selección de mis proyectos más relevantes, así como mi
          currículum vitae y mis datos de contacto. Le invito a explorar mi trabajo
        </p>

        <p>
          Afinidad por el software libre, programación, iot y la tecnología en general.
        </p>

        <p>
          Me gusta programar y crear contenido en mi tiempo libre, tengo varios proyectos con guías,
          tutoriales y
          apuntes propios.
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>

</script>

<style>
.box-trajectory {
  width: 100%;
  margin: 1.3rem 0;
  box-sizing: border-box
}

.box-trajectory-first,
.box-trajectory-second {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.box-trajectory-badge {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: center;
  text-align: center;
  box-sizing: border-box;
}

.box-trajectory-text {
  text-align: justify;
}

@media (max-width: 1230px) {

  .box-trajectory-text {
    padding: 1.3rem;
  }

  .box-trajectory-badge>* {
    scale: 0.9;
  }
}

@media (max-width: 950px) {

  .box-trajectory-first,
  .box-trajectory-second {
    display: grid;
    grid-template-columns: 1fr;
  }

  .box-trajectory-badge>* {
    margin-bottom: 1.3rem;
    grid-template-columns: 1fr 1fr;
    scale: 0.7;
  }

  .box-trajectory-first .box-trajectory-badge>* {
    translate: -50px 0;
  }

  .box-trajectory-second .box-trajectory-badge>* {
    translate: 50px 0;
  }
}


@media (max-width: 500px) {



  .box-trajectory-badge>* {
    margin: 0;
    padding: 0;
    scale: 0.5;
  }

  .box-trajectory-first .box-trajectory-badge>* {
    translate: -30px 0;
  }

  .box-trajectory-second .box-trajectory-badge>* {
    translate: 30px 0;
  }
}
</style>
