<script setup lang="ts">
import { ServicesHub } from '~/widgets/services-hub'

const { data: home } = await useHome()
const servicesNav = SITE_NAV.find((item) => item.key === 'services')

usePageSeo({
  title: () => servicesNav?.seoTitle,
  description: () => servicesNav?.seoDescription,
  path: () => '/services',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <ServicesHub />
</template>
