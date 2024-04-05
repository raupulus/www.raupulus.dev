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
  margin: 0.4rem 3rem;
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


@media (max-width: 500px) {
  .box-badge-hexagon {
    scale: 0.8;
    margin: 0.4rem 1.5rem;
  }
}
</style>
