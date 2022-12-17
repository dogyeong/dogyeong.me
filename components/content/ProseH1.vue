<template>
  <h1 :id="id" :class="$style.h1">
    <a v-if="generate" :href="`#${id}`">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#imports'
defineProps<{ id: string }>()
const heading = 1
const { anchorLinks } = useRuntimeConfig().public.content
const generate = anchorLinks?.depth >= heading && !anchorLinks?.exclude.includes(heading)
</script>

<style lang="scss" module>
.h1 {
  color: $grey-1;
  font-size: 2.5rem;
  font-weight: 400;
}
</style>
