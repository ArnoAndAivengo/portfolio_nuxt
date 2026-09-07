<script setup lang="ts">
import { navItemForPath } from '~/utils/nav'

const props = defineProps<{
  title: string
}>()

const route = useRoute()
const { data: home } = await useHome()
const nav = computed(() => navItemForPath(route.path))

const pageTitle = () => {
  if ('seoTitle' in nav.value) return nav.value.seoTitle

  return `${props.title} — ${home.value?.name ?? ''}`.trim()
}

const pageDescription = () => {
  if ('seoDescription' in nav.value) return nav.value.seoDescription

  if ('lead' in nav.value) return nav.value.lead

  return home.value?.seoDescription
}

usePageSeo({
  title: pageTitle,
  description: pageDescription,
  path: () => nav.value.to,
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <section class="coming-soon">
    <h2>{{ title }}</h2>
    <p>Раздел в разработке. Скоро здесь появится содержимое.</p>
  </section>
</template>
