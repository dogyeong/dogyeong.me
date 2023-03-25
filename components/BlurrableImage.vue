<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  placeholderDataUri?: string
  widths: number[]
  sizes: string[]
}>()

const imgRef = ref<HTMLImageElement | null>(null)
const imgLoaded = ref(false)
const imgOpacity = computed(() => (imgLoaded.value ? 1 : 0))
const isDev = computed(() => props.placeholderDataUri === 'WILL_BE_REPLACED')

// 이미지가 로딩되면 opacity를 1로 변경
onMounted(() => {
  if (!imgRef.value || imgRef.value.complete) {
    return (imgLoaded.value = true)
  }

  imgRef.value.onload = () => {
    imgLoaded.value = true
  }
})

// cloudinary 이미지를 불러오기 위한 src, srcset, sizes 계산
const computedSrcsetList = computed(() => {
  const [baseUrl, thumbUrl] = props.src.split('/upload/')

  if (!props.widths.length || !baseUrl || !thumbUrl) return undefined

  return props.widths.map((width) => `${baseUrl}/upload/w_${width},q_auto/${thumbUrl} ${width}w`)
})
const computedSrcset = computed(() =>
  computedSrcsetList.value ? computedSrcsetList.value.join(', ') : undefined,
)
const computedSrc = computed(() => {
  if (!computedSrcsetList.value?.length) return props.src

  const [lastSrcset] = computedSrcsetList.value.slice(-1)
  return lastSrcset.split(' ')[0]
})
const computedSizes = computed(() => (props.sizes.length ? props.sizes.join(', ') : undefined))
</script>

<template>
  <div
    :style="placeholderDataUri && !isDev ? { 'background-image': `url('${placeholderDataUri}')` } : {}"
    :class="$style.wrapper"
  >
    <div :class="$style.imageWrapper">
      <img
        ref="imgRef"
        :src="computedSrc"
        :alt="alt"
        :class="$style.image"
        loading="lazy"
        :srcset="computedSrcset"
        :sizes="computedSizes"
      />
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
