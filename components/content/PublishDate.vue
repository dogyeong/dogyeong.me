<script setup lang="ts">
const props = defineProps<{ date: string }>()

const date = new Date(props.date)
</script>

<template>
  <time :class="$style.time" :datetime="date.toISOString()">{{ date.toLocaleDateString('ko-KR') }}</time>
</template>

<style lang="scss" module>
.time {
  display: block;
  margin-top: 1.5rem;
  margin-bottom: 4rem;
  color: $grey-5;
  font-size: 1rem;
}
</style>
