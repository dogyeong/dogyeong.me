<script setup lang="ts">
defineProps<{
  title: string
  to: string
  imageSrc: string
  publishedAt?: Date
  thumbnailPlaceholder?: string
}>()
</script>

<template>
  <article :class="$style.wrapper">
    <NuxtLink :to="to" :class="$style.link">
      <span :class="$style.imgWrapper">
        <span :class="$style.img">
          <BlurrableImage
            :src="imageSrc"
            :alt="title"
            :placeholder-data-uri="thumbnailPlaceholder"
            :widths="[280, 560, 840, 1120, 1400, 1568]"
            :sizes="['(max-width: 639px) 80vw', '(max-width: 1680px) 40vw', '1120px']"
          />
        </span>
      </span>
      <div :class="$style.description">
        <h2 :class="$style.title">{{ title }}</h2>
        <time
          v-if="publishedAt"
          :datetime="publishedAt.toISOString()"
          :class="$style.publishedAt"
          aria-label="publish date"
        >
          {{ publishedAt.toLocaleDateString('ko-KR') }}
        </time>
      </div>
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
  font-size: 1.5rem;

  @media ($desktop) {
    font-size: 2rem;
  }
}

.imgWrapper {
  display: block;
  position: relative;
  padding-top: 56.25%;
  width: 100%;
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
  background-size: cover;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.description {
  padding: 0 32px;
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
  word-break: keep-all;
}

.publishedAt {
  font-size: 1rem;
  font-weight: 300;
  color: $grey-2;
}
</style>
