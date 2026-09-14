<script setup lang="ts">
import { JavascriptQuiz } from '~/features/javascript-quiz'

const { data: home } = await useHome()

usePageSeo({
  title: () => 'Собеседование JavaScript · Александр Обухов',
  description: () => 'Интерактивный тренажёр JavaScript: базовый, средний и продвинутый. Вопрос и пять ответов с разбором.',
  path: () => '/trainers/javascript',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <JavascriptQuiz />
</template>
