<script setup lang="ts">
const route = useRoute()
const slug = computed(() => {
  const value = route.params.slug
  const parts = Array.isArray(value) ? value : value ? [value] : []

  return '/' + parts.join('/')
})

const { data: page } = await useAsyncData(
  () => 'article-' + slug.value,
  () => queryCollection('articles').path(slug.value).first(),
)
const { data: home } = await useHome()

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

usePageSeo({
  title: () => page.value?.title,
  description: () => {
    const extra = page.value as { description?: string } | null

    return extra?.description || home.value?.seoDescription
  },
  path: () => route.path,
  type: 'article',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <article
    v-if="page"
    class="prose"
  >
    <ContentRenderer :value="page" />
  </article>
</template>
