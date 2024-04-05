<template>
  <section class="box-section-image-header">
    <div class="box-section-image-header-overlay">
      <div class="box-section-image-header-overlay-top">
        <span>Portfolio</span>
      </div>

      <div class="box-section-image-header-overlay-bottom">
        <div style="text-align: center;">
          <StackBadgeHexagon text="PHP" color="#777bb3" colorLight="#9b9fd8">
            <img src="@/assets/images/technologies/php_60x60.webp" title="Lenguaje de Programación PHP"
              alt="Lenguaje de Programación PHP" />
          </StackBadgeHexagon>

          <StackBadgeHexagon text="Laravel" color="#c54b4b" colorLight="#d56565">
            <img src="@/assets/images/technologies/laravel_60x60.webp" title="Framework Laravel"
              alt="Framework Laravel" />
          </StackBadgeHexagon>

          <div class="inline-block">
            <StackBadgeHexagon text="Vue" color="#2f3239" colorLight="#454850">
              <img src="@/assets/images/technologies/vuejs_60x60.webp" title="Framework VueJs" alt="Framework VueJs" />
            </StackBadgeHexagon>

            <StackBadgeHexagon text="Javascript" color="#d7af21" colorLight="#e9c853">
              <img src="@/assets/images/technologies/javascript_60x60.webp" title="Lenguaje de Programación Javascript"
                alt="Lenguaje de Programación Javascript" />
            </StackBadgeHexagon>

            <StackBadgeHexagon text="PostgreSQL" color="#336791" colorLight="#68ace4">
              <img src="@/assets/images/technologies/postgresql_60x60.webp" title="Logo base de datos PostgreSQL"
                alt="Logo base de datos PostgreSQL" />
            </StackBadgeHexagon>
          </div>
        </div>
      </div>
    </div>

    <div class="box-section-image-header-background">
      <div class="">
        <NuxtImg format="webp" src="/images/backgrounds/background_500x500.webp" quality="70" />
        <!--
        <img src="@/assets/images/backgrounds/background_500x500.webp" alt="Imagen" title="Imagen">
        -->
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>

</script>

<style>
.box-section-image-header {
  position: relative;
  width: 100%;
  height: 315px;
  overflow: hidden;
}

.box-section-image-header-overlay {
  position: absolute;
  display: grid;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  background-color: rgba(0, 0, 0, 0.3);
}

.box-section-image-header-overlay-top {
  display: grid;
  align-content: center;
  padding: 0.3rem 1.3rem;
  text-align: center;
  color: #f3f3f3;
  font-size: 2.3rem;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.36);
}

.box-section-image-header-overlay-bottom {
  /*background-color: rgba(50, 114, 184, 0.6);*/
  background-color: rgba(233, 233, 233, 0.6);
}

.box-section-image-header-background {
  display: grid;
  width: 100%;
  height: 100%;
  align-items: center;
}

.box-section-image-header-background img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
}
</style>
