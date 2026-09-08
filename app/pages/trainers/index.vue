<script setup lang="ts">
import { TrainersHub } from '~/widgets/trainers-hub'

const { data: home } = await useHome()
const trainers = SITE_NAV.find((item) => item.key === 'trainers')

usePageSeo({
  title: () => trainers?.seoTitle,
  description: () => trainers?.seoDescription,
  path: () => '/trainers',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <TrainersHub />
</template>
