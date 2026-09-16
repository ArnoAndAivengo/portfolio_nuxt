<script setup lang="ts">
import { OG_IMAGE, SITE_ORIGIN } from '~/constants'
import { articleHref } from '~/entities/article'
import { siteUrl } from '~/utils/site'
import './article-page.css'

const route = useRoute()
const { data: page } = await useArticle()
const { data: home } = await useHome()

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

usePageSeo({
  title: () => page.value?.title,
  description: () => page.value?.description || home.value?.seoDescription,
  path: () => route.path,
  type: 'article',
  image: () => page.value?.cover ? siteUrl(page.value.cover) : home.value?.ogImage,
  author: () => home.value?.name,
})

useSeoMeta({
  articlePublishedTime: () => page.value?.date,
})

const articleSchema = computed(() => {
  if (!page.value || !home.value) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.value.title,
    description: page.value.description,
    image: page.value.cover ? siteUrl(page.value.cover) : (home.value.ogImage || OG_IMAGE),
    datePublished: page.value.date,
    author: {
      '@type': 'Person',
      name: home.value.name,
      url: `${SITE_ORIGIN}/`,
    },
    publisher: {
      '@type': 'Person',
      name: home.value.name,
      url: `${SITE_ORIGIN}/`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_ORIGIN}${articleHref(page.value.path)}`,
    },
    inLanguage: 'ru-RU',
  }
})

useHead({
  script: () => articleSchema.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify(articleSchema.value),
      }]
    : [],
})
</script>

<template>
  <article
    v-if="page"
    class="article-page"
  >
    <header class="article-page__header">
      <p class="article-page__meta">{{ page.kicker }}</p>
      <h1 class="article-page__title">{{ page.title }}</h1>
      <dl
        v-if="page.dateLabel"
        class="article-page__details"
      >
        <div class="article-page__details-row">
          <dt>Дата</dt>
          <dd>{{ page.dateLabel }}</dd>
        </div>
        <div
          v-if="page.detailsLabel && page.detailsValue"
          class="article-page__details-row"
        >
          <dt>{{ page.detailsLabel }}</dt>
          <dd>{{ page.detailsValue }}</dd>
        </div>
      </dl>
    </header>
    <figure
      v-if="page.cover"
      class="article-page__cover"
    >
      <img
        :src="page.cover"
        :alt="page.coverAlt || page.title"
        width="1200"
        height="675"
        decoding="async"
      >
    </figure>
    <div class="article-page__body prose">
      <ContentRenderer :value="page" />
    </div>
  </article>
</template>
