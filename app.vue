<script>
import '~/assets/reset.scss'
</script>

<template>
  <div>
    <HeaderBar />
    <NuxtPage />
  </div>
</template>

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
