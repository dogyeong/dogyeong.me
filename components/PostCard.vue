<script setup lang="ts">
defineProps<{ title: string; to: string; imageSrc: string }>()
</script>

<template>
  <article :class="$style.wrapper">
    <NuxtLink :to="to" :class="$style.link">
      <span :class="$style.imgWrapper">
        <img :src="imageSrc" :class="$style.img" />
      </span>
      <span :class="$style.dimmed" />
      <h3 :class="$style.title">{{ title }}</h3>
    </NuxtLink>
  </article>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  height: calc(100vw * 9 / 16);

  @media (min-width: 768px) {
    height: calc(100vw * 9 / 16 / 2);
  }
}

.link {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &:hover {
    .imgWrapper {
      transform: scale(1.1);
      transform-origin: center center;
    }

    .dimmed {
      opacity: 1;
    }
  }
}

.dimmed {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.66);
  transition: opacity 0.2s;
  pointer-events: none;
}

.imgWrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform: scale(1.02);
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 32px;
  font-size: 32px;
  font-weight: 400;
  color: $grey-0;
}
</style>
