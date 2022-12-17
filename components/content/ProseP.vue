<template>
  <p :class="$style.p"><slot /></p>
</template>

<style lang="scss" module>
.p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  color: $grey-5;
}
</style>
