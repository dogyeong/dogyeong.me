<script setup lang="ts">
defineProps<{ title: string; to: string; imageSrc: string }>()
</script>

<template>
  <article :class="$style.wrapper">
    <NuxtLink :to="to" :class="$style.link">
      <span :class="$style.imgWrapper">
        <span :class="$style.img">
          <img :src="imageSrc" />
        </span>
      </span>
      <h3 :class="$style.title">{{ title }}</h3>
    </NuxtLink>
  </article>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
}

.link {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: min(3rem, 5.6vw);

  @media ($desktop) {
    font-size: 2rem;
  }
}

.imgWrapper {
  display: block;
  position: relative;
  padding-top: 62.5%;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.title {
  display: flex;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  font-size: inherit;
  font-weight: 600;
  color: $grey-0;
  margin-top: -0.7em;
  z-index: 3;
  padding: 0 32px;
  word-break: keep-all;
}
</style>
