<template>
  <div class="box-specialization-badge">
    <div class="container-specialization-badge">
      <div class="specialization-badge-image">
        <slot />
      </div>

      <div class="specialization-badge-title">
        <span>
          {{ text }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  text: {
    type: String,
    required: true,
  }
})

</script>

<style scoped>
.box-specialization-badge {
  position: relative;
  display: inline-grid;
  /*margin: 3rem 1.3rem;*/
  margin: auto;
  width: 180px;
  height: 105px;
  align-items: center;
  box-sizing: border-box;
}


.box-specialization-badge:before,
.box-specialization-badge:after {
  position: absolute;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  background-color: #2f3239;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.box-specialization-badge:after {
  transform: rotate(60deg);
  background: linear-gradient(to bottom right, #555 0%, #2f3239 100%);
  /*
  background: linear-gradient(to left, #555 0%, #2f3239 100%);
  */
}

.box-specialization-badge:before {
  transform: rotate(-60deg);
  background: linear-gradient(to bottom right, #555 0%, #2f3239 100%);
  /*
  background: linear-gradient(to right, #555 0%, #2f3239 100%);
  */
}

.container-specialization-badge {
  position: absolute;
  width: 200px;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-content: center;
  z-index: 1;
  translate: -15px 0;
}

.specialization-badge-image {
  display: grid;
  padding: 11px;
  width: 60px;
  height: 60px;
  align-items: center;
  text-align: center;
  background-color: #2f3239;
  background: linear-gradient(to left, #555 10%, #2f3239 90%);
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid #f3f3f3;
}

.specialization-badge-image img {
  width: 100%;
  object-fit: cover;
}

.specialization-badge-title {
  display: grid;
  align-content: center;
  padding-left: 15px;
  text-align: center;
}

.specialization-badge-title span {
  display: inline-block;
  background-color: #2f3239;
  background: linear-gradient(to right, #555 10%, #2f3239 90%);
  color: #fff;
  font-size: 1.1rem;
  padding: 0.6rem 32px 0.6rem 0.6rem;
  border-radius: 0 4px 4px 0;
  font-family: sans-serif;
  border: 1px solid #f3f3f3;
  z-index: -1;
}
</style>
