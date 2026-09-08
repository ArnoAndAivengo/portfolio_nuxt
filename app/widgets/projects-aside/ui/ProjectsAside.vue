<script setup lang="ts">
import type { ProjectPage } from '~/entities/project'
import { ProjectNav } from '~/shared/ui/project-nav'
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
