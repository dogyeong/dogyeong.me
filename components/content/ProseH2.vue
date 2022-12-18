<template>
  <h2 :id="id" :class="$style.h2">
    <a v-if="generate" :href="`#${id}`">
      <slot />
    </a>
    <slot v-else />
  </h2>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#imports'
defineProps<{ id: string }>()
const heading = 2
const { anchorLinks } = useRuntimeConfig().public.content
const generate = anchorLinks?.depth >= heading && !anchorLinks?.exclude.includes(heading)
</script>

<style lang="scss" module>
.h2 {
  font-size: 1.875rem;
  font-weight: 500;
  margin-top: 5rem;
  margin-bottom: 2.5rem;
  color: $grey-1;

  a:hover {
    text-decoration: underline;
  }
}
</style>
