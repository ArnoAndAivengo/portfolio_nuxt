<script setup lang="ts">
import { INTERVIEWS, type InterviewKey } from '~/entities/interview'
import './interview-nav.css'

defineProps<{
  current?: InterviewKey | 'interviews'
}>()
</script>

<template>
  <nav
    class="interview-nav"
    aria-label="Языки собеседования"
  >
    <NuxtLink
      v-for="item in INTERVIEWS"
      :key="item.key"
      :to="item.to"
      class="interview-nav__link"
      :style="{ '--interview-accent': item.accent }"
      :aria-current="current === item.key ? 'page' : undefined"
    >
      <img
        class="interview-nav__icon"
        :src="item.icon"
        alt=""
        width="22"
        height="22"
      >
      {{ item.title }}
    </NuxtLink>
  </nav>
</template>
