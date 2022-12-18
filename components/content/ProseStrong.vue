<template>
  <strong :class="$style.strong">
    <slot />
  </strong>
</template>

<style lang="scss" module>
.strong {
  font-weight: 500;
  color: $grey-3;
}
</style>
