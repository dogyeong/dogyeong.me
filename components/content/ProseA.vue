<script setup lang="ts">
import Link from '@/components/Link'

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
  <Link :href="href" :class="$style.anchor">
    <slot />
  </Link>
</template>

<style lang="scss" module>
.anchor {
  &,
  &:visited,
  &:hover,
  &:active {
    color: $indigo-5;

    > code {
      color: $indigo-5;
    }
  }

  &:hover {
    text-decoration: underline;
  }
}
</style>
