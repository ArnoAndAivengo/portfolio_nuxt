<script setup lang="ts">
import { BugHunter, JAVASCRIPT_BUGS } from '~/features/bug-hunter'

const { data: home } = await useHome()

usePageSeo({
  title: () => 'Поиск багов JavaScript · Александр Обухов',
  description: () => 'Ищи ошибки в JavaScript и Vue: Junior, Middle, Senior и Expert. Таймер, серия и разбор.',
  path: () => '/trainers/bugs/javascript',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <BugHunter
    trainer="JavaScript"
    :bugs="JAVASCRIPT_BUGS"
    storage="ao-bugs-javascript-v1"
  />
</template>
