<script setup lang="ts">
import { Tags } from '~/shared/ui/tags'
import { isRemoteHref, projectHrefIsExternal, projectRepoHref } from '~/utils/project'
import './projects-hub.css'

const props = defineProps<{
  section: 'current' | 'pets'
}>()

const { data: projects } = await useAsyncData('projects-hub', () =>
  queryCollection('projects').order('order', 'ASC').all(),
)

const items = computed(() => {
  const all = projects.value ?? []

  if (props.section === 'current') {
    return all.filter((project) => project.current)
  }

  return all.filter((project) => !project.current && project.featured)
})

const title = computed(() =>
  props.section === 'current'
    ? 'Продукты, над которыми сейчас идёт работа'
    : 'Эксперименты и учебные репозитории',
)

const repoUrl = (project: { href: string; repo?: string }) =>
  projectRepoHref(project.href, project.repo)

const repoLink = (project: { href: string; repo?: string }) => {
  const href = repoUrl(project)
  const label = href.includes('gitlab.com')
    ? 'GitLab'
    : href.includes('github.com')
      ? 'GitHub'
      : null

  return label ? { href, label } : null
}

const variantOf = (project: { variant?: string; spa?: boolean; title: string }) => {
  if (project.variant) return project.variant
  if (project.spa) return project.variant || 'crypto'
  if (project.title === 'Codestats') return 'codestats'
  if (project.title === 'LearnPortal') return 'learn-portal'

  return 'default'
}
</script>

<template>
  <div class="projects-hub">
    <section
      id="projects"
      class="section"
    >
      <h2 class="section__title">{{ title }}</h2>
      <ul class="projects-hub__list">
        <li
          v-for="project in items"
          :key="project.path"
        >
          <article
            class="projects-hub__card"
            :class="`projects-hub__card--${variantOf(project)}`"
          >
            <div class="projects-hub__head">
              <NuxtLink
                class="projects-hub__title-link"
                :to="project.href"
                :external="projectHrefIsExternal(project.href, project.spa)"
                :target="isRemoteHref(project.href) ? '_blank' : undefined"
                :rel="isRemoteHref(project.href) ? 'noopener noreferrer' : undefined"
              >
                <h3 class="projects-hub__title">{{ project.title }}</h3>
              </NuxtLink>
              <div
                v-if="project.spa || repoLink(project)"
                class="projects-hub__aside"
              >
                <NuxtLink
                  v-if="project.spa"
                  class="projects-hub__preview"
                  :to="project.href"
                  external
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Превью
                </NuxtLink>
                <a
                  v-if="repoLink(project)"
                  class="projects-hub__repo"
                  :href="repoLink(project)!.href"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ProjectRepoIcon :href="repoLink(project)!.href" />
                  {{ repoLink(project)!.label }}
                </a>
              </div>
            </div>
            <NuxtLink
              class="projects-hub__link"
              :to="project.href"
              :external="projectHrefIsExternal(project.href, project.spa)"
              :target="isRemoteHref(project.href) ? '_blank' : undefined"
              :rel="isRemoteHref(project.href) ? 'noopener noreferrer' : undefined"
            >
              <div class="projects-hub__excerpt prose">
                <ContentRenderer :value="project" />
              </div>
              <Tags :items="project.tags" />
            </NuxtLink>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>
