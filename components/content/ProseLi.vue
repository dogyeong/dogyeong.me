<template>
  <li :class="$style.li"><slot /></li>
</template>

<style lang="scss" module>
.li {
  margin: 0.5rem 0;
  padding-left: 0.375rem;
  color: $grey-5;
  font-size: 1rem;
}
</style>
