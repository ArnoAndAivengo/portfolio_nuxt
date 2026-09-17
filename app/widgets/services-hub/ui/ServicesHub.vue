<script setup lang="ts">
import { Tags } from '~/shared/ui/tags'
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

const pageStride = (el: HTMLElement) => {
  const page = el.querySelector('.services-hub__list')
  if (!(page instanceof HTMLElement)) return el.clientWidth

  const track = page.parentElement
  const gap = track ? Number.parseFloat(getComputedStyle(track).columnGap) || 0 : 0

  return page.getBoundingClientRect().width + gap
}

const useSnapSlider = (pageCount: { readonly value: number }) => {
  const viewport = ref<HTMLElement | null>(null)
  const pageIndex = ref(0)

  const scrollToPage = (index: number) => {
    const el = viewport.value
    const count = pageCount.value
    if (!el || !count) return

    const next = ((index % count) + count) % count
    el.scrollTo({ left: next * pageStride(el), behavior: 'smooth' })
  }

  const onScroll = () => {
    const el = viewport.value
    const stride = el ? pageStride(el) : 0
    if (!stride) return

    pageIndex.value = Math.round(el.scrollLeft / stride)
  }

  onMounted(() => {
    const el = viewport.value
    if (!el) return

    el.addEventListener('scroll', onScroll, { passive: true })

    const resize = new ResizeObserver(() => {
      el.scrollTo({ left: pageIndex.value * pageStride(el) })
    })
    resize.observe(el)

    const stopWatch = watch(pageCount, () => {
      if (pageIndex.value >= pageCount.value) {
        pageIndex.value = Math.max(0, pageCount.value - 1)
      }

      el.scrollTo({ left: pageIndex.value * pageStride(el) })
    })

    onUnmounted(() => {
      stopWatch()
      el.removeEventListener('scroll', onScroll)
      resize.disconnect()
    })
  })

  return { viewport, pageIndex, scrollToPage }
}

const { data: home } = await useHome()
const { data: meta } = await useAsyncData('resume-meta', () => queryCollection('resumeMeta').first())
const { data: services } = await useAsyncData('services', () => queryCollection('services').first())

const offerPages = computed(() =>
  chunkPages(services.value?.offers ?? [], isNarrow.value ? 2 : SLIDE_SIZE),
)
const processPages = computed(() =>
  chunkPages(services.value?.process ?? [], PROCESS_SLIDE_SIZE),
)

const {
  viewport: offersViewport,
  pageIndex: offersPage,
  scrollToPage: scrollOffers,
} = useSnapSlider(computed(() => offerPages.value.length))

const {
  viewport: processViewport,
  pageIndex: processPage,
  scrollToPage: scrollProcess,
} = useSnapSlider(computed(() => processPages.value.length))

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
      <div
        class="services-hub__slider"
        role="region"
        aria-roledescription="карусель"
        aria-label="Форматы работ"
      >
        <div
          ref="offersViewport"
          class="services-hub__viewport"
          tabindex="0"
          @keydown.left.prevent="scrollOffers(offersPage - 1)"
          @keydown.right.prevent="scrollOffers(offersPage + 1)"
        >
          <div class="services-hub__track">
            <ul
              v-for="(page, pageIdx) in offerPages"
              :key="pageIdx"
              class="services-hub__list"
              :aria-hidden="pageIdx === offersPage ? undefined : 'true'"
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
                      :tabindex="pageIdx === offersPage ? undefined : -1"
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
            @click="scrollOffers(offersPage - 1)"
          >‹</button>
          <div class="services-hub__dots">
            <button
              v-for="(_, index) in offerPages"
              :key="index"
              type="button"
              class="services-hub__dot"
              :aria-current="index === offersPage ? 'true' : undefined"
              :aria-label="`Слайд ${index + 1} из ${offerPages.length}`"
              @click="scrollOffers(index)"
            />
          </div>
          <button
            type="button"
            class="services-hub__arrow"
            aria-label="Следующие форматы"
            @click="scrollOffers(offersPage + 1)"
          >›</button>
        </div>
      </div>
      <p class="services-hub__note">{{ services.note }}</p>
    </section>

    <section
      id="process"
      class="section"
    >
      <h2 class="section__title">От идеи до релиза</h2>
      <p class="prose">{{ services.processLead }}</p>
      <div
        class="services-hub__slider"
        role="region"
        aria-roledescription="карусель"
        aria-label="Этапы от идеи до релиза"
      >
        <div
          ref="processViewport"
          class="services-hub__viewport"
          tabindex="0"
          @keydown.left.prevent="scrollProcess(processPage - 1)"
          @keydown.right.prevent="scrollProcess(processPage + 1)"
        >
          <div class="services-hub__track">
            <ul
              v-for="(page, pageIdx) in processPages"
              :key="pageIdx"
              class="services-hub__list services-hub__list--pair"
              :aria-hidden="pageIdx === processPage ? undefined : 'true'"
            >
              <li
                v-for="step in page"
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
            </ul>
          </div>
        </div>
        <div class="services-hub__controls">
          <button
            type="button"
            class="services-hub__arrow"
            aria-label="Предыдущие этапы"
            @click="scrollProcess(processPage - 1)"
          >‹</button>
          <div class="services-hub__dots">
            <button
              v-for="(_, index) in processPages"
              :key="index"
              type="button"
              class="services-hub__dot"
              :aria-current="index === processPage ? 'true' : undefined"
              :aria-label="`Слайд ${index + 1} из ${processPages.length}`"
              @click="scrollProcess(index)"
            />
          </div>
          <button
            type="button"
            class="services-hub__arrow"
            aria-label="Следующие этапы"
            @click="scrollProcess(processPage + 1)"
          >›</button>
        </div>
      </div>
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
          <span>LearnPortal, Codestats, рейтинг нейросетей, живые демо</span>
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
