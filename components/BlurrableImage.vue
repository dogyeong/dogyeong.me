<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  placeholderDataUri?: string
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const imgLoaded = ref(false)
const imgOpacity = computed(() => (imgLoaded.value ? 1 : 0))

onMounted(() => {
  if (!imgRef.value || imgRef.value.complete) {
    return (imgLoaded.value = true)
  }

  imgRef.value.onload = () => {
    imgLoaded.value = true
  }
})
</script>

<template>
  <div
    :style="placeholderDataUri && { 'background-image': `url('${placeholderDataUri}')` }"
    :class="$style.wrapper"
  >
    <div :class="$style.imageWrapper">
      <img ref="imgRef" :src="src" :alt="alt" :class="$style.image" loading="lazy" />
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  height: 100%;
  background-size: cover;
}

.imageWrapper {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(12px);
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: v-bind(imgOpacity);
  transition: opacity 0.2s ease-in-out;
}
</style>
