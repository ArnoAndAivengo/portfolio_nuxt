<script setup lang="ts">
import './project-nav.css'

defineProps<{
  current: 'index' | 'pets' | 'learn-portal' | 'codestats'
}>()
</script>

<template>
  <nav
    class="project-nav"
    aria-label="Проекты"
  >
    <NuxtLink
      to="/projects"
      class="project-nav__link project-nav__link--index"
      :aria-current="current === 'index' ? 'page' : undefined"
    >
      <span>01</span>
      Текущие
    </NuxtLink>
    <NuxtLink
      to="/projects/pets"
      class="project-nav__link project-nav__link--pets"
      :aria-current="current === 'pets' ? 'page' : undefined"
    >
      <span>02</span>
      Проекты
    </NuxtLink>
    <NuxtLink
      to="/projects/learn-portal"
      class="project-nav__link project-nav__link--learn-portal"
      :aria-current="current === 'learn-portal' ? 'page' : undefined"
    >
      <span>03</span>
      LearnPortal
    </NuxtLink>
    <NuxtLink
      to="/projects/codestats"
      class="project-nav__link project-nav__link--codestats"
      :aria-current="current === 'codestats' ? 'page' : undefined"
    >
      <span>04</span>
      Codestats
    </NuxtLink>
  </nav>
</template>
