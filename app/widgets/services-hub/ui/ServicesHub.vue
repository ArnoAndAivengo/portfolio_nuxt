<script setup lang="ts">
import { Tags } from '~/shared/ui/tags'
import './services-hub.css'

const SLIDE_SIZE = 4

const { data: home } = await useHome()
const { data: meta } = await useAsyncData('resume-meta', () => queryCollection('resumeMeta').first())
const { data: services } = await useAsyncData('services', () => queryCollection('services').first())

const viewport = ref<HTMLElement | null>(null)
const pageIndex = ref(0)

const offerPages = computed(() => {
  const offers = services.value?.offers ?? []
  const pages = []

  for (let i = 0; i < offers.length; i += SLIDE_SIZE) {
    pages.push(offers.slice(i, i + SLIDE_SIZE))
  }

  return pages
})

const exampleIsExternal = (href: string, external?: boolean) =>
  Boolean(external) || href.startsWith('http')

const scrollToPage = (index: number) => {
  const el = viewport.value
  const count = offerPages.value.length
  if (!el || !count) return

  const next = ((index % count) + count) % count
  el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
}

const onScroll = () => {
  const el = viewport.value
  if (!el?.clientWidth) return

  pageIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

onMounted(() => {
  const el = viewport.value
  if (!el) return

  el.addEventListener('scroll', onScroll, { passive: true })

  const resize = new ResizeObserver(() => {
    el.scrollTo({ left: pageIndex.value * el.clientWidth })
  })
  resize.observe(el)

  onUnmounted(() => {
    el.removeEventListener('scroll', onScroll)
    resize.disconnect()
  })
})
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
      <div
        class="services-hub__slider"
        role="region"
        aria-roledescription="карусель"
        aria-label="Форматы работ"
      >
        <div
          ref="viewport"
          class="services-hub__viewport"
          tabindex="0"
          @keydown.left.prevent="scrollToPage(pageIndex - 1)"
          @keydown.right.prevent="scrollToPage(pageIndex + 1)"
        >
          <div class="services-hub__track">
            <ul
              v-for="(page, pageIdx) in offerPages"
              :key="pageIdx"
              class="services-hub__list"
              :aria-hidden="pageIdx === pageIndex ? undefined : 'true'"
            >
              <li
                v-for="offer in page"
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
                      :tabindex="pageIdx === pageIndex ? undefined : -1"
                    >
                      {{ example.label }}
                    </NuxtLink>
                  </p>
                </article>
              </li>
            </ul>
          </div>
        </div>
        <div class="services-hub__controls">
          <button
            type="button"
            class="services-hub__arrow"
            aria-label="Предыдущие форматы"
            @click="scrollToPage(pageIndex - 1)"
          >‹</button>
          <div class="services-hub__dots">
            <button
              v-for="(_, index) in offerPages"
              :key="index"
              type="button"
              class="services-hub__dot"
              :aria-current="index === pageIndex ? 'true' : undefined"
              :aria-label="`Слайд ${index + 1} из ${offerPages.length}`"
              @click="scrollToPage(index)"
            />
          </div>
          <button
            type="button"
            class="services-hub__arrow"
            aria-label="Следующие форматы"
            @click="scrollToPage(pageIndex + 1)"
          >›</button>
        </div>
      </div>
      <p class="services-hub__note">{{ services.note }}</p>
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
          <span>LearnPortal, Codestats, живые демо</span>
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
      id="why"
      class="section"
    >
      <h2 class="section__title">Почему безвозмездно</h2>
      <div class="prose">
        <p
          v-for="(paragraph, index) in services.whyFree"
          :key="index"
        >
          {{ paragraph }}
        </p>
      </div>
    </section>

    <section
      id="thanks"
      class="section"
    >
      <h2 class="section__title">О благодарности</h2>
      <div class="prose">
        <p>{{ services.gratitudeLead }}</p>
      </div>
      <ul class="resume-list">
        <li
          v-for="item in services.gratitude"
          :key="item"
        >{{ item }}</li>
      </ul>
      <p class="services-hub__note">{{ services.gratitudeNote }}</p>
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
        <span>Москва</span>
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
