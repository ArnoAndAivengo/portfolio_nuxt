<script setup lang="ts">
const markup = '<div class="js-off-banner" role="status">Некоторые функции на сайте без включённого JavaScript работать не будут.</div>'
</script>

<template>
  <noscript v-html="markup" />
</template>
