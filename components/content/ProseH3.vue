<template>
  <h3 :id="id" :class="$style.h3">
    <a v-if="generate" :href="`#${id}`">
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#imports'
defineProps<{ id: string }>()
const heading = 3
const { anchorLinks } = useRuntimeConfig().public.content
const generate = anchorLinks?.depth >= heading && !anchorLinks?.exclude.includes(heading)
</script>

<style lang="scss" module>
.h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: $grey-1;

  a:hover {
    text-decoration: underline;
  }
}
</style>
