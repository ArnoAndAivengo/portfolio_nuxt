<script setup lang="ts">
import { ARTICLE_PAGES } from '~/entities/article'
import { ArticlesHub } from '~/widgets/articles-hub'

const { data: home } = await useHome()
const page = ARTICLE_PAGES.issues

usePageSeo({
  title: () => page.seoTitle,
  description: () => page.seoDescription,
  path: () => '/articles/techblog',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <ArticlesHub feed="issues" />
</template>
