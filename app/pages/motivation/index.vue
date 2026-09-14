<script setup lang="ts">
import { MOTIVATION_PAGES } from '~/entities/motivation'
import { MotivationStory } from '~/features/motivation-story'

const { data: home } = await useHome()
const page = MOTIVATION_PAGES.story

usePageSeo({
  title: () => page.seoTitle,
  description: () => page.seoDescription,
  path: () => '/motivation',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <MotivationStory />
</template>
