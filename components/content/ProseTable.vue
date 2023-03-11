<template>
  <table :class="$style.table">
    <slot />
  </table>
</template>

<style lang="scss" module>
.table {
  table-layout: auto;
  width: 100%;
  border-spacing: 0;
  border-radius: 8px;
  color: $grey-5;
  border: 1px solid $grey-8;
  border-collapse: unset;
  overflow: hidden;
  margin-bottom: 2rem;
}
</style>
