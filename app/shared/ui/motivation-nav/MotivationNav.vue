<script setup lang="ts">
import type { MotivationCurrent } from '~/entities/motivation'
import './motivation-nav.css'

defineProps<{
  current: MotivationCurrent
}>()
</script>

<template>
  <nav
    class="motivation-nav"
    aria-label="Мотивация"
  >
    <NuxtLink
      to="/motivation"
      class="motivation-nav__link"
      :aria-current="current === 'story' ? 'page' : undefined"
    >
      <span>01</span>
      История
    </NuxtLink>
  </nav>
</template>
