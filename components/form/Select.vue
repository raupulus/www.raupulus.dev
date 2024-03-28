<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
    default: null
  },
  datas: {
    type: Array,
    required: true,
    default: []
  },
  callback: {
    type: Function,
    required: false,
    default: undefined
  }
})
</script>

<template>
  <div class="form-select">
    <select :name="name" v-on:change="() => console.log('CAMBIA Select en componente FormSelect')">
      <option v-for="(ele, key) in datas" :key="key" :value="ele.slug">
        {{ ele.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.form-select>select {
  margin: 0 auto 35px auto;
  width: 200px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 1rem;
  color: var(--black);
  background-color: var(--yellow);
  border: none;
  border-radius: 50px;
}
</style>
