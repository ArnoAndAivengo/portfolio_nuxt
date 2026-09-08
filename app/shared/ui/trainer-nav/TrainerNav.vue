<script setup lang="ts">
import './trainer-nav.css'

defineProps<{
  current: 'index' | 'typing' | 'python'
}>()
</script>

<template>
  <nav
    class="trainer-nav"
    aria-label="Тренажёры"
  >
    <NuxtLink
      to="/trainers/typing"
      class="trainer-nav__link trainer-nav__link--typing"
      :aria-current="current === 'typing' ? 'page' : undefined"
    >
      <span>01</span>
      Touch Type
    </NuxtLink>
    <NuxtLink
      to="/trainers/python"
      class="trainer-nav__link trainer-nav__link--python"
      :aria-current="current === 'python' ? 'page' : undefined"
    >
      <span>02</span>
      Python
    </NuxtLink>
  </nav>
</template>
