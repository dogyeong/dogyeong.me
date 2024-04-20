<template>
  <main :class="$style.main">
    <ContentDoc />
  </main>
</template>

<style lang="scss" module>
.main {
  margin: 0 10vw;
  padding: 10rem 0;
  display: grid;
  grid-template-columns: repeat(24, minmax(0, 1fr));
  column-gap: 0.75rem;
  overflow-wrap: break-word;
  word-break: keep-all;

  > * {
    grid-column: 1 / span 24;

    @media ($tablet) {
      grid-column: 3 / span 20;
    }

    @media ($desktop) {
      grid-column: 7 / span 12;
    }
  }
}
</style>
