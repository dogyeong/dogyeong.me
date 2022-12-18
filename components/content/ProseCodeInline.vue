<template>
  <code :class="$style.code"><slot /></code>
</template>

<style lang="scss" module>
.code {
  font-family: 'Source Code Pro', monospace;
  color: $grey-3;
  font-weight: 600;
}
</style>
