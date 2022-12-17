<template>
  <ol :class="$style.ol">
    <slot />
  </ol>
</template>

<style lang="scss" module>
.ol {
  margin-bottom: 2rem;
  padding-left: 1.625rem;
  list-style-type: decimal;
}
</style>
