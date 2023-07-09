<script setup lang="ts">
useSeoMeta({
  title: 'dogyeong.me',
})

const { data } = await useAsyncData('articles', () => queryContent('/blog').sort({ publishedAt: -1 }).find())
</script>

<template>
  <main :class="$style.main">
    <PostCardList>
      <PostCard
        v-for="article in data"
        :key="article._id"
        :to="article._path || '/'"
        :image-src="
          article.thumbnail ||
          'https://res.cloudinary.com/dpefbi4ts/image/upload/v1688877804/thumb/sample.png'
        "
        :title="article.title || ''"
        :published-at="article.publishedAt ? new Date(article.publishedAt) : undefined"
        :thumbnail-placeholder="article.thumbnailPlaceholder"
      />
    </PostCardList>
  </main>
</template>

<style lang="scss" module>
.main {
  margin: 0 10vw;
  padding: 160px 0;
}
</style>
