<script setup lang="ts">
defineProps<{ src?: string }>()
</script>

<template>
  <div v-if="src && src !== 'thumbnail'" :id="$style.thumbnail">
    <img :src="src" />
  </div>
</template>

<style lang="scss" module>
#thumbnail {
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  margin: 40px -5vw 80px;

  img {
    width: 100%;
  }
}
</style>
