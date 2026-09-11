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

const pageDescription = (): string | undefined => {
  const item = nav.value

  if ('seoDescription' in item && typeof item.seoDescription === 'string') {
    return item.seoDescription
  }

  if ('lead' in item && typeof item.lead === 'string') {
    return item.lead
  }

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
