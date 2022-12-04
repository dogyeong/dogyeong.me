<script setup lang="ts"></script>

<template>
  <section :class="$style.section">
    <slot></slot>
  </section>
</template>

<style lang="scss" module>
.section {
  display: grid;
  grid-template-columns: repeat(1, auto);

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, auto);
  }
}
</style>
