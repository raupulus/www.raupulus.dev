<template>
  <div id="app">
    <AppHeader />

    <div id="app-box-content">

      <NuxtPage />

    </div>

    <AppFooter />
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
</script>
