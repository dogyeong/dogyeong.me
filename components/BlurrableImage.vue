<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  placeholderDataUri?: string
}>()
</script>

<template>
  <div
    :style="placeholderDataUri && { 'background-image': `url('${placeholderDataUri}')` }"
    :class="$style.wrapper"
  >
    <img :src="src" :alt="alt" :class="$style.image" loading="lazy" />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  height: 100%;
  background-size: cover;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  backdrop-filter: blur(8px);
}
</style>
