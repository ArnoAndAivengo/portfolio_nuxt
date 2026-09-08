<script setup lang="ts">
import { TouchTypeTrainer } from '~/features/touch-type'

const { data: home } = await useHome()

usePageSeo({
  title: () => 'Тренажёр печати — English QWERTY · Александр Обухов',
  description: () => 'Клавиатурный тренажёр слепой печати на английском: уроки QWERTY, адаптация по слабым клавишам и свободная практика.',
  path: () => '/trainers/typing',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <TouchTypeTrainer />
</template>
