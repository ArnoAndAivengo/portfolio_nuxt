<script setup lang="ts">
import { BUG_HUNTS, type BugHuntKey } from '~/entities/bug-hunt'
import '~/shared/ui/interview-nav/interview-nav.css'

defineProps<{
  current?: BugHuntKey | 'bugs'
}>()
</script>

<template>
  <nav
    class="interview-nav"
    aria-label="Языки поиска багов"
  >
    <NuxtLink
      v-for="item in BUG_HUNTS"
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
