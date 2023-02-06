<script setup lang="ts">
import '~/assets/reset.scss'

useHead({ htmlAttrs: { lang: 'ko' } })
</script>

<template>
  <div>
    <HeaderBar />
    <NuxtPage />
  </div>
</template>

<style lang="scss">
html,
body {
  background-color: rgb(8, 11, 22);
  min-height: 100vh;
}
</style>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translate(0, 10px);
}
</style>
