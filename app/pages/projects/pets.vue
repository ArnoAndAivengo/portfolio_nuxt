<script setup lang="ts">
import { PROJECT_PAGES } from '~/entities/project'
import { ProjectsHub } from '~/widgets/projects-hub'

const { data: home } = await useHome()
const page = PROJECT_PAGES.pets

usePageSeo({
  title: () => `Проекты — ${home.value?.name ?? 'Александр Обухов'}`,
  description: () => page.lead,
  path: () => '/projects/pets',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <ProjectsHub section="pets" />
</template>
