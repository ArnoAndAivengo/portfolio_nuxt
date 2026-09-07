<script setup lang="ts">
defineProps<{
  items: Array<{ lead: string, text: string }>
}>()
</script>

<template>
  <section
    id="highlights"
    class="section"
  >
    <h2 class="section__title">Ключевые результаты</h2>
    <ul class="resume-list">
      <li
        v-for="item in items"
        :key="item.lead"
      >
        <strong>{{ asText(item.lead) }}</strong>
        — {{ asText(item.text) }}
      </li>
    </ul>
  </section>
</template>
