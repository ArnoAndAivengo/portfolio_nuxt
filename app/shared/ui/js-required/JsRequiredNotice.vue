<script setup lang="ts">
const markup = '<div class="js-required"><p>Этот тренажёр работает только с включённым JavaScript. Разделы сайта и навигация доступны без него.</p></div>'
</script>

<template>
  <noscript v-html="markup" />
</template>
