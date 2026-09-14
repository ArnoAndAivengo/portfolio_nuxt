<script setup lang="ts">
import type { MotivationPage } from '~/entities/motivation'
import { MotivationNav } from '~/shared/ui/motivation-nav'

defineProps<{
  page: MotivationPage
}>()
</script>

<template>
  <p class="eyebrow">{{ page.eyebrow }}</p>
  <h1 class="name">{{ page.name }}</h1>
  <p class="role">{{ page.role }}</p>
  <p class="lead">{{ page.lead }}</p>
  <MotivationNav :current="page.current" />
</template>
