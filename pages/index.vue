<script setup lang="ts">
const { data } = await useAsyncData('articles', () => queryContent('/blog').sort({ publishedAt: -1 }).find())
</script>

<template>
  <main :class="$style.test">
    <h1>Index</h1>
    <div>
      <h3 v-for="article in data" :key="article._id">
        <NuxtLink :to="article._path">
          {{ article.title }}
        </NuxtLink>
      </h3>
    </div>
    <input type="text" class="placeholder-red-700" placeholder="asbc" />
  </main>
</template>
