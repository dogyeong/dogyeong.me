<script setup lang="ts">
defineProps<{
  src?: string
  alt?: string
  placeholderDataUri?: string
}>()
</script>

<template>
  <div v-if="src && src !== 'thumbnail'" :id="$style.thumbnail">
    <BlurrableImage :alt="alt" :src="src" :placeholder-data-uri="placeholderDataUri" />
  </div>
</template>

<style lang="scss" module>
#thumbnail {
  display: flex;
  overflow: hidden;
  border-radius: 8px;
  margin: 40px -5vw 80px;
  aspect-ratio: 16 / 9;
}
</style>
