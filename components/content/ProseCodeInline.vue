<template>
  <code :class="$style.code"><slot /></code>
</template>

<style lang="scss" module>
.code {
  font-family: 'Source Code Pro', monospace;
  color: $grey-3;
  font-weight: 600;
  background-color: $grey-9;
  font-size: 0.875em;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
