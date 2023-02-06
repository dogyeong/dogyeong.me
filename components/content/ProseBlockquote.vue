<template>
  <blockquote :class="$style.blockquote">
    <slot />
  </blockquote>
</template>

<style lang="scss" module>
.blockquote {
  background-color: darken($grey-9, 4%);
  margin-bottom: 2.5rem;
  padding: 2rem;
  border: 0;
  border-radius: 0.5rem;
  font-style: italic;
  font-weight: 400;
  white-space: pre-wrap;

  p {
    margin: 0;
  }
}
</style>
