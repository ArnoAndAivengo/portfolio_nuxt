<script setup lang="ts">
import { OG_IMAGE, SITE_NAV, SITE_ORIGIN } from '~/constants'
import { trainerPageForPath } from '~/entities/trainer'
import { navItemForPath } from '~/utils/nav'
import { TrainersAside } from '~/widgets/trainers-aside'

const route = useRoute()
const { data: home } = await useHome()
const currentNav = computed(() => navItemForPath(route.path))
const trainerPage = computed(() => trainerPageForPath(route.path))
const pageKey = computed(() => trainerPage.value?.pageKey ?? currentNav.value.key)
const showProfile = computed(() => pageKey.value === 'home' || pageKey.value === 'resume')
const pageLead = computed(() =>
  'lead' in currentNav.value ? currentNav.value.lead : '',
)

const isSiteNavCurrent = (item: (typeof SITE_NAV)[number]) => {
  if (item.key === 'trainers') return Boolean(trainerPage.value)
  if (item.to === '/') return route.path === '/'

  return route.path.startsWith(item.to)
}

const colorMode = useColorMode()

const personSchema = computed(() => {
  if (!home.value) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: home.value.name,
    jobTitle: home.value.role,
    description: home.value.seoDescription,
    image: home.value.ogImage || OG_IMAGE,
    url: `${SITE_ORIGIN}/`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Москва',
      addressCountry: 'RU',
    },
    sameAs: [home.value.github, home.value.gitlab, home.value.telegram],
  }
})

useHead({
  meta: [{
    name: 'theme-color',
    content: () => colorMode.value === 'dark' ? '#0a192f' : '#ffffff',
  }],
  script: () => personSchema.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify(personSchema.value),
      }]
    : [],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <a class="skip-link" href="#content">К содержимому</a>

  <div
    v-if="home"
    class="shell"
    id="top"
    :data-page="pageKey"
  >
    <ThemeToggle />
    <aside
      class="aside"
      :class="{ 'aside--compact': !showProfile }"
      :aria-label="showProfile ? 'Профиль' : trainerPage ? 'Тренажёр' : 'Навигация'"
    >
      <div class="aside__top">
        <TrainersAside
          v-if="trainerPage"
          :page="trainerPage"
        />
        <template v-else>
          <h1
            v-if="!showProfile"
            class="eyebrow"
          >{{ currentNav.eyebrow }}</h1>
          <p
            v-else
            class="eyebrow"
          >{{ currentNav.eyebrow }}</p>
          <template v-if="showProfile">
            <div class="photo">
              <picture>
                <source
                  srcset="/images/alex/alex.webp"
                  type="image/webp"
                >
                <img
                  src="/images/alex/alex.jpeg"
                  :alt="home.name"
                  width="160"
                  height="160"
                  decoding="async"
                  fetchpriority="high"
                >
              </picture>
            </div>
            <h1 class="name">{{ home.name }}</h1>
            <p class="role">{{ home.role }}</p>
            <div class="status">
              <span
                class="status__dot"
                aria-hidden="true"
              />
              {{ home.status }}
            </div>
          </template>
          <p
            v-if="showProfile"
            class="lead"
          >
            Фокус на <strong>Vue&nbsp;3 / Nuxt</strong>.
            {{ home.experienceYears }} — e‑commerce, аналитика, edtech.
          </p>
          <p
            v-else
            class="lead"
          >
            {{ pageLead }}
          </p>
          <div class="aside-contacts">
            <a
              :href="home.telegram"
              target="_blank"
              rel="noopener noreferrer"
            >Telegram</a>
            <a :href="`mailto:${home.email}`">Email</a>
            <a :href="home.phoneHref">{{ home.phone }}</a>
          </div>
          <div class="social">
            <a
              :href="home.github"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
            </a>
            <a
              :href="home.gitlab"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitLab"
              title="GitLab"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51 1.22 3.78a.84.84 0 01-.3.94z"/></svg>
            </a>
            <a
              :href="home.telegram"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              title="Telegram"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a
              :href="`mailto:${home.email}`"
              aria-label="Email"
              title="Email"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
            </a>
          </div>
        </template>
      </div>

      <div class="aside__bottom">
        <nav
          class="site-nav"
          aria-label="Разделы сайта"
        >
          <NuxtLink
            v-for="item in SITE_NAV"
            :key="item.key"
            :to="item.to"
            :data-nav="item.key"
            :aria-current="isSiteNavCurrent(item) ? 'page' : undefined"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <main
      class="main"
      id="content"
    >
      <slot />
    </main>

    <footer class="footer">
      <div class="footer__meta">
        <span>Страница обновлена {{ home.updated }}</span>
        <span>© {{ home.name }}, 2026</span>
      </div>
      <a
        href="#top"
        class="footer__link"
      >Наверх ↑</a>
    </footer>
  </div>
</template>
