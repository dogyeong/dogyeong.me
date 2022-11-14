<script setup lang="ts">
defineProps<{ title: string; to: string; imageSrc: string }>()
</script>

<template>
  <article>
    <NuxtLink :to="to">
      <img :src="imageSrc" :class="$style.img" />
      <h3>{{ title }}</h3>
    </NuxtLink>
  </article>
</template>

<style lang="scss" module>
.img {
  width: 200px;
}
</style>
