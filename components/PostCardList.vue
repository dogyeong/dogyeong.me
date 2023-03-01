<script setup lang="ts"></script>

<template>
  <section :class="$style.section">
    <slot></slot>
  </section>
</template>

<style lang="scss" module>
.section {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  row-gap: 40px;
  column-gap: 32px;
  max-width: 1280px;
  margin: 0 auto;

  @media ($tablet) {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 20vh;
  }
}
</style>
