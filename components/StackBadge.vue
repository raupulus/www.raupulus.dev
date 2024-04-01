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
  }
})

</script>

<template>
  <div class="box-stack-badge" :style="'background-color:' + color + ';'">
    <div class="container-stack-badge">
      <slot />

      <span>
        {{ text }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.box-stack-badge {
  display: inline-block;
  width: 150px;
  height: 40px;
  border-radius: 4px;
  box-sizing: border-box;
}

.container-stack-badge {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 50px 100px;
  align-items: center;
}

.container-stack-badge>img {
  display: inline-block;
  margin-left: 8px;
  width: auto;
  height: 28px;
}

.container-stack-badge>span {
  margin-right: 25px;
  color: #fafafa;
}
</style>
