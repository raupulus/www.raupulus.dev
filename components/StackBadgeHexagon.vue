<template>
  <div class="box-badge-hexagon box-badge-hexagon-color">
    <div class="box-badge-hexagon-circle">
      <slot />

    </div>

    <div class="box-badge-hexagon-title">
      <span>
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    default: '#2f3239',
    required: false,
  },
  colorLight: {
    type: String,
    default: '#2f3239',
    required: false,
  },
})
</script>

<style scoped>
.box-badge-hexagon {
  position: relative;
  margin: 1.5rem 3rem;
  width: 4rem;
  height: 6.2rem;
  border-radius: 10px;
  display: inline-block;
  top: 0;
  transition: all 0.2s ease;
}

.box-badge-hexagon:before,
.box-badge-hexagon:after {
  position: absolute;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  background: inherit;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.box-badge-hexagon:before {
  transform: rotate(60deg);
}

.box-badge-hexagon:after {
  transform: rotate(-60deg);
}

.box-badge-hexagon:hover {
  translate: 0 -2px;
}

.box-badge-hexagon .box-badge-hexagon-circle {
  width: 60px;
  height: 60px;
  position: absolute;
  z-index: 10;
  border-radius: 50%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  box-shadow: 1px 1px 4px #000;
}

.box-badge-hexagon .box-badge-hexagon-circle img {
  object-fit: cover;
  vertical-align: middle;
}

.box-badge-hexagon .box-badge-hexagon-title {
  position: absolute;
  display: grid;
  margin-left: -55px;
  padding: 5px 7px 4px;
  width: 100px;
  height: 15px;
  bottom: 7px;
  left: 50%;
  color: #fff;
  align-content: center;
  text-align: center;
  font-size: 1rem;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.27);
  background: linear-gradient(to bottom right, #555 0%, #2f3239 100%);
  cursor: default;
  z-index: 11;
}



.box-badge-hexagon-color {
  background: linear-gradient(to bottom right, v-bind(colorLight) 0%, v-bind(color) 100%);
  color: v-bind(color);
}







.color-php {
  background: linear-gradient(to bottom right, #9b9fd8 0%, #777bb3 100%);
  color: #777bb3;
}

.color-laravel {
  background: linear-gradient(to bottom right, #d56565 0%, #c54b4b 100%);
  color: #c54b4b;
}

.color-vuejs {
  background: linear-gradient(to bottom right, #454850 0%, #2f3239 100%);
  color: #2f3239;
}

.color-javascript {
  background: linear-gradient(to bottom right, #e9c853 0%, #d7af21 100%);
  color: #d7af21;
}

.color-postgresql {
  background: linear-gradient(to bottom right, #68ace4 0%, #336791 100%);
  color: #336791;
}







.yellow {
  background: linear-gradient(to bottom right, #ffeb3b 0%, #fbc02d 100%);
  color: #ffb300;
}

.orange {
  background: linear-gradient(to bottom right, #ffc107 0%, #f57c00 100%);
  color: #f68401;
}

.pink {
  background: linear-gradient(to bottom right, #F48FB1 0%, #d81b60 100%);
  color: #dc306f;
}

.red {
  background: linear-gradient(to bottom right, #f4511e 0%, #b71c1c 100%);
  color: #c62828;
}

.purple {
  background: linear-gradient(to bottom right, #ab47bc 0%, #4527a0 100%);
  color: #7127a8;
}

.teal {
  background: linear-gradient(to bottom right, #4DB6AC 0%, #00796B 100%);
  color: #34a297;
}

.blue {
  background: linear-gradient(to bottom right, #4FC3F7 0%, #2196F3 100%);
  color: #259af3;
}

.blue-dark {
  background: linear-gradient(to bottom right, #1976D2 0%, #283593 100%);
  color: #1c68c5;
}

.green {
  background: linear-gradient(to bottom right, #cddc39 0%, #8bc34a 100%);
  color: #7cb342;
}

.green-dark {
  background: linear-gradient(to bottom right, #4CAF50 0%, #1B5E20 100%);
  color: #00944a;
}

.silver {
  background: linear-gradient(to bottom right, #E0E0E0 0%, #BDBDBD 100%);
  color: #9e9e9e;
}

.gold {
  background: linear-gradient(to bottom right, #e6ce6a 0%, #b7892b 100%);
  color: #b7892b;
}
</style>
