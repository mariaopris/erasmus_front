<script setup>
import { RouterView } from 'vue-router'
document.documentElement.classList.forEach((token) => {
  if (token.indexOf('style') === 0) {
    document.documentElement.classList.replace(token, `style-white`)
  }
})
</script>

<template>
  <RouterView />
</template>
