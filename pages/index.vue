<script setup lang="ts">
const { data } = await useAsyncData('articles', () => queryContent('/blog').sort({ publishedAt: -1 }).find())
</script>

<template>
  <main :class="$style.main">
    <PostCardList>
      <PostCard
        v-for="article in data"
        :key="article._id"
        :to="article._path || '/'"
        :image-src="article.thumbnail || '/images/sample.jpeg'"
        :title="article.title || ''"
        :published-at="article.publishedAt ? new Date(article.publishedAt) : undefined"
      />
    </PostCardList>
  </main>
</template>

<style lang="scss" module>
.main {
  margin: 0 10vw;
  padding: 120px 0;
}
</style>
