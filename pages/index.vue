<script setup lang="ts">
const { data } = await useAsyncData('articles', () => queryContent('/blog').sort({ publishedAt: -1 }).find())
</script>

<template>
  <main>
    <h1>Index</h1>
    <div>
      <PostCard
        v-for="article in data"
        :key="article._id"
        :to="article._path"
        image-src="/images/sample.jpeg"
        :title="article.title"
      />
    </div>
  </main>
</template>
