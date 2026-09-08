<script setup lang="ts">
import { PythonQuiz } from '~/features/python-quiz'

const { data: home } = await useHome()

usePageSeo({
  title: () => 'Тренажёр Python · Александр Обухов',
  description: () => 'Интерактивный тренажёр Python: базовый, средний и продвинутый. Вопрос и пять ответов с разбором.',
  path: () => '/trainers/python',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <PythonQuiz />
</template>
