<template>
  <td :class="$style.td">
    <slot />
  </td>
</template>

<style lang="scss" module>
.td {
  padding: 0.5rem 1rem;

  &:not(:last-child) {
    border-right: 1px solid $grey-8;
  }
}
</style>
