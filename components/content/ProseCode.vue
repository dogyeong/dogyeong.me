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
    <span :class="$style.lang">{{ language }}</span>
  </div>
</template>

<style lang="scss" module>
.codeblock {
  padding: 2rem 0;
  border-radius: 0;
  margin: 0 -10vw 2rem;
  background-color: darken($grey-9, 4%);
  font-size: 0.875rem;
  overflow-x: auto;
  color: $grey-5;
  counter-reset: code-line;
  line-height: 1.4;
  position: relative;

  @media ($tablet) {
    margin: 0 0 2rem;
    border-radius: 0.5rem;
  }
}

.lang {
  position: absolute;
  bottom: 8px;
  right: 24px;
  display: inline-block;
  font-size: 0.75rem;
  text-align: right;
  font-family: 'Source Code Pro', monospace;
  color: $grey-6;
}
</style>

<style lang="scss">
pre code {
  display: block;
  width: fit-content;

  .line {
    display: block;
    min-height: 1rem;
    font-family: 'Source Code Pro', monospace;
    font-weight: 400;
    counter-increment: code-line;
    padding-right: 24px;
    min-width: 100%;
    width: max-content;

    &::before {
      content: counter(code-line);
      display: inline-block;
      width: 2rem;
      padding: 0;
      margin: 0;
      padding-right: 1.5rem;
      text-align: right;
      color: $grey-7;
      position: sticky;
      left: 0;
      background-color: darken($grey-9, 4%);
    }
  }
}
</style>
