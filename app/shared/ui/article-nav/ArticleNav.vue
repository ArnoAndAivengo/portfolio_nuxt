<script setup lang="ts">
import type { ArticleCurrent } from '~/entities/article'
import './article-nav.css'

defineProps<{
  current: ArticleCurrent
}>()
</script>

<template>
  <nav
    class="article-nav"
    aria-label="Разделы публикаций"
  >
    <NuxtLink
      to="/articles"
      class="article-nav__link article-nav__link--posts"
      :aria-current="current === 'posts' ? 'page' : undefined"
    >
      <span>01</span>
      Статьи
    </NuxtLink>
    <NuxtLink
      to="/articles/techblog"
      class="article-nav__link article-nav__link--issues"
      :aria-current="current === 'issues' ? 'page' : undefined"
    >
      <span>02</span>
      Техблог LearnPortal
    </NuxtLink>
  </nav>
</template>
