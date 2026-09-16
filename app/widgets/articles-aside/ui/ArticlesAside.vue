<script setup lang="ts">
import type { ArticlePage } from '~/entities/article'
import { ArticleNav } from '~/shared/ui/article-nav'

const props = defineProps<{
  page: ArticlePage
}>()

const { data: article } = await useArticle()

const name = computed(() => article.value?.theme || props.page.name)
const lead = computed(() => article.value?.asideLead || props.page.lead)
</script>

<template>
  <p
    v-if="name"
    class="eyebrow"
  >{{ page.eyebrow }}</p>
  <h1
    v-else
    class="eyebrow"
  >{{ page.eyebrow }}</h1>
  <h1
    v-if="name"
    class="name"
  >{{ name }}</h1>
  <p
    v-if="lead"
    class="lead"
  >{{ lead }}</p>
  <ArticleNav :current="page.current" />
</template>
