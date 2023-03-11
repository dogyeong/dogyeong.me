<template>
  <tr :class="$style.tr">
    <slot />
  </tr>
</template>

<style lang="scss" module>
.tr:not(:last-child) {
  > td {
    border-bottom: 1px solid $grey-8;
  }
}
</style>
