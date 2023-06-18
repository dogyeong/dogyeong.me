<script setup lang="ts">
import Logo from '~/assets/svg/logo.svg'
</script>

<template>
  <header :class="$style.header">
    <NuxtLink to="/" :class="$style.logoWrapper">
      <Logo :class="$style.logo" aria-label="Go Home" />
    </NuxtLink>
    <div :class="$style.menuBar">
      <a :class="$style.iconLink" href="https://github.com/dogyeong" target="_blank" title="GitHub">
        <svg stroke-width="1.8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 22.027v-2.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 00-1.5-3.75 5.07 5.07 0 00-.09-3.77s-1.18-.35-3.91 1.48a13.38 13.38 0 00-7 0c-2.73-1.83-3.91-1.48-3.91-1.48A5.07 5.07 0 005 5.797a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 00-.94 2.58v2.87M9 20.027c-3 .973-5.5 0-7-3"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </a>
      <a :class="$style.iconLink" href="mailto:shroad1802@gmail.com" target="_blank" title="Mail">
        <svg stroke-width="1.8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 9l5 3.5L17 9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          <path
            d="M2 17V7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
            stroke-width="1.8"
          ></path>
        </svg>
      </a>
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  position: relative;
  z-index: 100;
}

.logoWrapper {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 100;
  display: flex;

  @media ($tablet) {
    top: 32px;
    left: 32px;
  }

  .logo {
    width: 32px;
    height: 32px;
    fill: $grey-0;
    color: $grey-0;
  }
}

.menuBar {
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  align-items: center;
  column-gap: 12px;

  @media ($tablet) {
    top: 32px;
    right: 32px;
    column-gap: 16px;
  }

  a {
    display: inline-flex;
  }
}

.iconLink {
  padding: 4px;

  svg {
    width: 20px;
    height: 20px;
    stroke: $grey-5;
    transition: stroke 0.1s ease-in-out;

    @media ($tablet) {
      width: 24px;
      height: 24px;
    }
  }

  &:hover svg {
    stroke: $grey-0;
  }
}
</style>
