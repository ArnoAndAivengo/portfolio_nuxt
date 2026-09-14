<script setup lang="ts">
import { BugHunter, PYTHON_BUGS } from '~/features/bug-hunter'

const { data: home } = await useHome()

usePageSeo({
  title: () => 'Поиск багов Python · Александр Обухов',
  description: () => 'Ищи ошибки в Python: Junior, Middle, Senior и Expert. Таймер, серия и разбор.',
  path: () => '/trainers/bugs/python',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <BugHunter
    trainer="Python"
    :bugs="PYTHON_BUGS"
    storage="ao-bugs-python-v1"
  />
</template>
