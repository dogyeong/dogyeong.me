<script setup lang="ts">
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import '~/assets/reset.scss'

useHead({ htmlAttrs: { lang: 'ko' }, title: 'dogyeong.dev' })

onBeforeMount(() => {
  const firebaseConfig = {
    apiKey: 'AIzaSyBEMQu611YHqTKRF93u99p4gTPPTFHfTyw',
    authDomain: 'devpass-30165.firebaseapp.com',
    projectId: 'devpass-30165',
    storageBucket: 'devpass-30165.appspot.com',
    messagingSenderId: '281649795294',
    appId: '1:281649795294:web:c15383acaadf7a7058324f',
    measurementId: 'G-LW7FPNPD0S',
  }

  const app = initializeApp(firebaseConfig)
  getAnalytics(app)
})
</script>

<template>
  <div>
    <HeaderBar />
    <NuxtPage />
  </div>
</template>

<style lang="scss">
html,
body {
  background-color: rgb(8, 11, 22);
  min-height: 100vh;
  font-size: 14px;

  @media ($tablet) {
    font-size: 16px;
  }
}
</style>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translate(0, 10px);
}

body {
  --sb-track-color: #{$grey-9};
  --sb-thumb-color: #{$grey-6};
  --sb-size: 10px;

  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}

body::-webkit-scrollbar {
  width: var(--sb-size);
}

body::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 10px;
}

body::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 10px;
}
</style>
