<script setup lang="ts">
import type { TrainerCurrent } from '~/entities/trainer'
import './trainer-nav.css'

defineProps<{
  current: TrainerCurrent
}>()

const interviewsCurrent = (current: TrainerCurrent) =>
  current === 'interviews' || current === 'python' || current === 'javascript'
const bugsCurrent = (current: TrainerCurrent) =>
  current === 'bugs' || current === 'bugs-python' || current === 'bugs-javascript'
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
      to="/trainers/interviews"
      class="trainer-nav__link trainer-nav__link--interviews"
      :aria-current="interviewsCurrent(current) ? 'page' : undefined"
    >
      <span>02</span>
      Собеседования
    </NuxtLink>
    <NuxtLink
      to="/trainers/bugs"
      class="trainer-nav__link trainer-nav__link--bugs"
      :aria-current="bugsCurrent(current) ? 'page' : undefined"
    >
      <span>03</span>
      Поиск багов
    </NuxtLink>
  </nav>
</template>
