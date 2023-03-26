<template>
  <AppHeader />


  <div>
    <h1>APP.vue</h1>
    <h2>Secret: {{ runtimeConfig.public.test }}</h2>


    <NuxtPage />

  </div>

  <AppFooter />
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
</script>

<style lang="css">
body {
  margin: 0;
  padding: 0;
}
</style>
