<script setup lang="ts">
import { Tags } from '~/shared/ui/tags'

defineProps<{
  job: {
    company: string
    position: string
    period: string
    location: string
    sites?: string[] | null
    current: boolean
    badge?: string | null
    tags: string[]
    teaser: string
    duties?: Array<{ label?: string | null, text: string }>
    results?: string[]
  }
  details?: boolean
}>()
</script>

<template>
  <article
    class="job"
    :class="{ 'job--current': job.current }"
  >
    <header class="job__header">
      <p class="job__meta">
        <span class="job__period">{{ job.period }}</span>
        <span class="job__location">{{ job.location }}</span>
        <a
          v-for="href in job.sites"
          :key="href"
          class="job__site"
          :href="href"
          target="_blank"
          rel="noopener noreferrer"
        >{{ siteHost(href) }}</a>
      </p>
      <div class="job__company-row">
        <h3 class="job__company">{{ job.company }}</h3>
        <span
          v-if="job.current"
          class="job__badge job__badge--current"
        >Текущий</span>
        <span
          v-if="job.badge"
          class="job__badge"
        >{{ job.badge }}</span>
      </div>
      <p class="job__position">{{ job.position }}</p>
    </header>
    <p class="job__summary">{{ asText(job.teaser) }}</p>
    <Tags :items="job.tags" />
    <details
      v-if="details"
      class="job__extra"
    >
      <summary class="job__more">
        <span class="job__more-label job__more-label--open">Подробнее</span>
        <span class="job__more-label job__more-label--close">Скрыть</span>
      </summary>
      <div class="job__detail">
        <ul class="resume-list job__duties">
          <li
            v-for="(duty, index) in job.duties"
            :key="index"
          >
            <template v-if="duty.label">
              <strong>{{ asText(duty.label) }}:</strong>
              {{ asText(duty.text) }}
            </template>
            <template v-else>
              {{ asText(duty.text) }}
            </template>
          </li>
        </ul>
        <ul
          v-if="job.results?.length"
          class="resume-list resume-list--accent"
        >
          <li
            v-for="(result, resultIndex) in job.results"
            :key="resultIndex"
          >{{ asText(result) }}</li>
        </ul>
      </div>
    </details>
  </article>
</template>
