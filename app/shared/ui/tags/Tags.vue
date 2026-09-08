<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<template>
  <ul
    v-if="items.length"
    class="tags"
  >
    <li
      v-for="item in items"
      :key="item"
    >{{ item }}</li>
  </ul>
</template>
