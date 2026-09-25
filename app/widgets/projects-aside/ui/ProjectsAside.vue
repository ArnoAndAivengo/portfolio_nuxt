<script setup lang="ts">
import type { ProjectPage } from '~/entities/project'
import { ProjectNav } from '~/shared/ui/project-nav'
import '~/shared/ui/project-nav/project-nav.css'
import { useSectionSpy } from '~/composables/useSectionSpy'

const props = defineProps<{
  page: ProjectPage
}>()

const sections = computed(() => 'sections' in props.page ? props.page.sections : null)
const { activeId, activate } = useSectionSpy()

const repoLink = computed(() => {
  if (!('repo' in props.page) || !props.page.repo) return null

  const href = props.page.repo
  const label = href.includes('gitlab.com')
    ? 'GitLab'
    : href.includes('github.com')
      ? 'GitHub'
      : 'Репозиторий'

  return { href, label }
})

const siteLink = computed(() => {
  if (!('site' in props.page) || !props.page.site) return null

  return { href: props.page.site, label: 'Промо-сайт' }
})

const isActive = (id: string) =>
  activeId.value === id || (!activeId.value && sections.value?.[0]?.id === id)

const goTo = (event: Event, id: string) => {
  const el = document.getElementById(id)
  if (!el) return

  event.preventDefault()
  activate(id)
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}
</script>

<template>
  <p
    v-if="page.name"
    class="eyebrow"
  >{{ page.eyebrow }}</p>
  <h1
    v-else
    class="eyebrow"
  >{{ page.eyebrow }}</h1>
  <h1
    v-if="page.name"
    class="name"
  >{{ page.name }}</h1>
  <p
    v-if="page.role"
    class="role"
  >{{ page.role }}</p>
  <p class="lead">{{ page.lead }}</p>
  <nav
    v-if="sections"
    class="project-nav"
    aria-label="Разделы"
  >
    <a
      v-for="(section, index) in sections"
      :key="section.id"
      :href="`#${section.id}`"
      class="project-nav__link"
      :class="[
        `project-nav__link--${page.current}`,
        { 'is-active': isActive(section.id) },
      ]"
      :aria-current="isActive(section.id) ? 'location' : undefined"
      @click="goTo($event, section.id)"
    >
      <span>{{ String(index + 1).padStart(2, '0') }}</span>
      {{ section.label }}
    </a>
    <a
      v-if="siteLink"
      class="project-nav__link project-nav__link--site"
      :class="`project-nav__link--${page.current}`"
      :href="siteLink.href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        class="project-nav__site-icon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9s1.3-6.2 3.8-9z" />
      </svg>
      {{ siteLink.label }}
    </a>
    <a
      v-if="repoLink"
      class="project-nav__link project-nav__link--repo"
      :class="`project-nav__link--${page.current}`"
      :href="repoLink.href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <ProjectRepoIcon :href="repoLink.href" />
      {{ repoLink.label }}
    </a>
  </nav>
  <ProjectNav
    v-else
    :current="page.current"
  />
</template>
