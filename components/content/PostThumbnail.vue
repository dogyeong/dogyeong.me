<script setup lang="ts">
defineProps<{
  src?: string
  alt?: string
  placeholderDataUri?: string
}>()
</script>

<template>
  <div v-if="src && src !== 'thumbnail'" :id="$style.thumbnail">
    <BlurrableImage
      :alt="alt"
      :src="src"
      :placeholder-data-uri="placeholderDataUri"
      :widths="[280, 560, 840, 1120, 1400, 1568]"
      :sizes="['(max-width: 639px) 90vw', '(max-width: 1023px) 77vw', '(min-width: 1024px) 63vw', '1120px']"
    />
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
