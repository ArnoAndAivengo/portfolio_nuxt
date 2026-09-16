<script setup lang="ts">
import { articleHref } from '~/entities/article'
import './articles-hub.css'

const props = defineProps<{
  feed: 'posts' | 'issues'
}>()

const { data: articles } = await useAsyncData('articles-hub', () =>
  queryCollection('articles').order('date', 'DESC').all(),
)

const items = computed(() =>
  (articles.value ?? []).filter((article) => article.feed === props.feed),
)

const title = computed(() => props.feed === 'posts' ? 'Публикации' : 'Выпуски')
const intro = computed(() =>
  props.feed === 'posts'
    ? 'Карьера, обучение, ИИ и практика разработки.'
    : 'Архитектура, курсы в Markdown, деплой и всё, что ломается по дороге.',
)
</script>

<template>
  <div
    class="articles-hub"
    :class="`articles-hub--${feed}`"
  >
    <section
      id="articles"
      class="section"
    >
      <h2 class="section__title">{{ title }}</h2>
      <p class="prose">{{ intro }}</p>
      <ul
        class="articles-hub__list"
        tabindex="0"
        :aria-label="title"
      >
        <li
          v-for="(article, index) in items"
          :key="article.path"
        >
          <article class="articles-hub__card">
            <NuxtLink
              v-if="article.cover"
              class="articles-hub__cover"
              :to="articleHref(article.path)"
              tabindex="-1"
              aria-hidden="true"
            >
              <img
                :src="article.cover"
                :alt="article.coverAlt || article.title"
                width="1200"
                height="675"
                loading="lazy"
                decoding="async"
              >
            </NuxtLink>
            <div class="articles-hub__body">
              <div class="articles-hub__meta">
                <span class="articles-hub__tag">{{ article.tag }}</span>
                <time :datetime="article.date">{{ article.dateLabel }}</time>
              </div>
              <h3 class="articles-hub__title">
                <NuxtLink :to="articleHref(article.path)">{{ article.title }}</NuxtLink>
              </h3>
              <p class="articles-hub__excerpt">{{ article.description || article.excerpt }}</p>
            </div>
            <NuxtLink
              class="articles-hub__read"
              :to="articleHref(article.path)"
            >
              Читать
            </NuxtLink>
          </article>
          <hr
            v-if="index < items.length - 1"
            class="articles-hub__rule"
          >
        </li>
      </ul>
    </section>
  </div>
</template>
