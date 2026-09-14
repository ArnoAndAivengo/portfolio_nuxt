<script setup lang="ts">
import { BugsHub } from '~/widgets/bugs-hub'

const { data: home } = await useHome()

usePageSeo({
  title: () => 'Поиск багов — Python и JavaScript · Александр Обухов',
  description: () => 'Тренажёр поиска багов: Python и JavaScript, уровни Junior → Expert, таймер и разбор.',
  path: () => '/trainers/bugs',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <BugsHub />
</template>
