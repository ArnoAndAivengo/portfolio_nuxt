<script setup lang="ts">
import { Tags } from '~/shared/ui/tags'
import ServicesHubSlider from './ServicesHubSlider.vue'
import './services-hub.css'

const SLIDE_SIZE = 4
const PROCESS_SLIDE_SIZE = 2
const NARROW_MQ = '(max-width: 980px)'

function chunkPages<T>(items: T[], size: number) {
  const pages: T[][] = []

  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size))
  }

  return pages
}

const isNarrow = ref(false)

onMounted(() => {
  const mq = window.matchMedia(NARROW_MQ)
  const sync = () => {
    isNarrow.value = mq.matches
  }

  sync()
  mq.addEventListener('change', sync)
  onUnmounted(() => mq.removeEventListener('change', sync))
})

const { data: home } = await useHome()
const { data: meta } = await useAsyncData('resume-meta', () => queryCollection('resumeMeta').first())
const { data: services } = await useAsyncData('services', () => queryCollection('services').first())

const offerPages = computed(() =>
  chunkPages(services.value?.offers ?? [], isNarrow.value ? 2 : SLIDE_SIZE),
)
const processPages = computed(() =>
  chunkPages(services.value?.process ?? [], PROCESS_SLIDE_SIZE),
)

const exampleIsExternal = (href: string, external?: boolean) =>
  Boolean(external) || href.startsWith('http')
</script>

<template>
  <div
    v-if="home && meta && services"
    class="services-hub"
  >
    <section
      id="offer"
      class="section"
    >
      <h2 class="section__title">
        Что делаю
      </h2>
      <div class="prose">
        <p><strong>{{ asText(services.lead) }}</strong></p>
        <p>{{ asText(services.intro) }}</p>
      </div>
    </section>

    <section
      id="formats"
      class="section"
    >
      <h2 class="section__title">Форматы</h2>
      <ServicesHubSlider
        name="formats"
        :pages="offerPages"
        label="Форматы работ"
      >
        <template #page="{ items }">
          <li
            v-for="offer in items"
            :key="offer.title"
          >
            <article class="services-hub__card">
              <h3 class="services-hub__title">{{ offer.title }}</h3>
              <p class="services-hub__excerpt">{{ offer.text }}</p>
              <p
                v-if="offer.examples?.length"
                class="services-hub__examples"
              >
                Например:
                <NuxtLink
                  v-for="example in offer.examples"
                  :key="example.href"
                  :to="example.href"
                  :external="exampleIsExternal(example.href, example.external)"
                  :target="exampleIsExternal(example.href, example.external) ? '_blank' : undefined"
                  :rel="exampleIsExternal(example.href, example.external) ? 'noopener noreferrer' : undefined"
                >
                  {{ example.label }}
                </NuxtLink>
              </p>
            </article>
          </li>
        </template>
      </ServicesHubSlider>
      <p class="services-hub__note">{{ services.note }}</p>
    </section>

    <section
      id="process"
      class="section"
    >
      <h2 class="section__title">От идеи до релиза</h2>
      <p class="prose">{{ services.processLead }}</p>
      <ServicesHubSlider
        name="process"
        :pages="processPages"
        list-class="services-hub__list--pair"
        label="Этапы от идеи до релиза"
      >
        <template #page="{ items }">
          <li
            v-for="step in items"
            :key="step.title"
          >
            <article class="services-hub__step">
              <h3 class="services-hub__step-title">
                {{ step.title }}
              </h3>
              <ul class="services-hub__step-items">
                <li
                  v-for="item in step.items"
                  :key="item"
                >{{ item }}</li>
              </ul>
            </article>
          </li>
        </template>
      </ServicesHubSlider>
    </section>

    <section
      id="stack"
      class="section"
    >
      <h2 class="section__title">Стек</h2>
      <div class="skills">
        <div
          v-for="group in meta.skillGroups"
          :key="group.label"
        >
          <h3 class="skills__label">{{ group.label }}</h3>
          <p class="skills__hint">{{ group.note }}</p>
          <Tags :items="group.items" />
        </div>
      </div>
      <ul
        v-if="meta.extra.length"
        class="resume-list services-hub__extra"
      >
        <li
          v-for="item in meta.extra"
          :key="item"
        >{{ item }}</li>
      </ul>
    </section>

    <section
      id="works"
      class="section"
    >
      <h2 class="section__title">Работы</h2>
      <p class="prose">{{ services.worksLead }}</p>
      <div class="resume-tracks">
        <NuxtLink to="/projects">
          Портфолио
          <span>CodeVega, Codestats, рейтинг нейросетей, живые демо</span>
        </NuxtLink>
        <a
          :href="home.github"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <span>{{ home.github.replace(/^https:\/\/github\.com\//, '') }}</span>
        </a>
        <a
          :href="home.gitlab"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitLab
          <span>{{ home.gitlab.replace(/^https:\/\/gitlab\.com\//, '') }}</span>
        </a>
      </div>
    </section>

    <section
      id="contact"
      class="section"
    >
      <h2 class="section__title">Контакты</h2>
      <p class="prose">{{ services.contactLead }}</p>
      <p class="contact-plain">
        <a :href="`mailto:${home.email}`">{{ home.email }}</a>
        <a :href="home.phoneHref">{{ home.phone }}</a>
        <span>{{ home.city }}, {{ home.country }}</span>
      </p>
      <div class="contact-actions">
        <a
          class="btn btn--primary"
          :href="home.telegram"
          target="_blank"
          rel="noopener noreferrer"
        >Написать в Telegram</a>
        <a
          class="btn btn--ghost"
          :href="`mailto:${home.email}`"
        >Email</a>
        <a
          class="btn btn--ghost"
          :href="home.phoneHref"
        >Позвонить</a>
        <a
          class="btn btn--ghost"
          :href="home.maxUrl"
          target="_blank"
          rel="noopener noreferrer"
        >MAX</a>
      </div>
    </section>
  </div>
</template>
