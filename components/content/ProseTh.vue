<template>
  <th :class="$style.th">
    <slot />
  </th>
</template>

<style lang="scss" module>
.th {
  padding: 0.5rem 1rem;
  background-color: $grey-9;

  &:not(:last-child) {
    border-right: 1px solid $grey-8;
  }
}
</style>
