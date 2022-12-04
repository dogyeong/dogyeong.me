<script setup lang="ts">
const { data } = await useAsyncData('articles', () => queryContent('/blog').sort({ publishedAt: -1 }).find())
</script>

<template>
  <main>
    <h1>Index</h1>
    <div>
      <PostCardList>
        <PostCard
          v-for="article in data"
          :key="article._id"
          :to="article._path || '/'"
          :image-src="article.thumbnail || '/images/sample.jpeg'"
          :title="article.title || ''"
        />
      </PostCardList>
    </div>
  </main>
</template>
