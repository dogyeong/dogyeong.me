<script setup lang="ts">
defineProps({
  href: {
    type: String,
    default: '',
  },
  blank: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <NuxtLink :href="href" :class="$style.anchor">
    <slot />
  </NuxtLink>
</template>

<style lang="scss" module>
.anchor {
  &,
  &:visited,
  &:hover,
  &:active {
    color: $indigo-5;
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>
