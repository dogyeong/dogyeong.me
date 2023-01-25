<template>
  <ul :class="$style.ul">
    <slot />
  </ul>
</template>

<style lang="scss" module>
.ul {
  margin-bottom: 2rem;
  padding-left: 1.625rem;
  list-style-type: disc;
}

li > .ul {
  margin-bottom: 0;
}
</style>
