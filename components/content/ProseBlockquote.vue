<template>
  <blockquote :class="$style.blockquote">
    <slot />
  </blockquote>
</template>

<style lang="scss" module>
.blockquote {
  background-color: $grey-8;
  margin-bottom: 2.5rem;
  padding: 2rem;
  border: 0;
  border-radius: 0.5rem;
  font-style: italic;
  font-weight: 400;

  p {
    margin: 0;
  }
}
</style>
