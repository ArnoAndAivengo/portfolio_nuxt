<script setup lang="ts">
import { InterviewsHub } from '~/widgets/interviews-hub'

const { data: home } = await useHome()

usePageSeo({
  title: () => 'Собеседования — Python и JavaScript · Александр Обухов',
  description: () => 'Квизы к собеседованию: Python и JavaScript. Уроки по темам, уровни и разбор ответов.',
  path: () => '/trainers/interviews',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <InterviewsHub />
</template>
