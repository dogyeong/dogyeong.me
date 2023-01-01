<script lang="ts">
import { defineComponent } from '#imports'

export default defineComponent({
  props: {
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    highlights: {
      type: Array as () => number[],
      default: () => [],
    },
  },
})
</script>

<template>
  <div :class="$style.codeblock">
    <slot />
  </div>
</template>

<style lang="scss" module>
.codeblock {
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  background-color: darken($grey-9, 4%);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  overflow-x: auto;
  color: $grey-5;
}
</style>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
  font-family: 'Source Code Pro', monospace;
  font-weight: 400;
}
</style>
