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
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 1.5rem;
  overflow-wrap: break-word;

  > * {
    grid-column: 1 / span 12;

    @media ($tablet) {
      grid-column: 2 / span 10;
    }

    @media ($desktop) {
      grid-column: 3 / span 8;
    }
  }
}
</style>
