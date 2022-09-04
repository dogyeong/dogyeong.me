<script setup lang="ts">
const { data } = await useAsyncData('articles', () => queryContent('/blog').sort({ publishedAt: -1 }).find())
</script>

<template>
  <main>
    <h1>Index</h1>
    <div>
      <h3 v-for="article in data" :key="article._id">{{ article.title }}</h3>
    </div>
  </main>
</template>
