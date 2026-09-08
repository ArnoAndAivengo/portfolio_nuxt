<script setup lang="ts">
import { ProjectsHub } from '~/widgets/projects-hub'

const { data: home } = await useHome()
const projectsNav = SITE_NAV.find((item) => item.key === 'projects')

usePageSeo({
  title: () => projectsNav?.seoTitle,
  description: () => projectsNav?.seoDescription,
  path: () => '/projects',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <ProjectsHub section="current" />
</template>
