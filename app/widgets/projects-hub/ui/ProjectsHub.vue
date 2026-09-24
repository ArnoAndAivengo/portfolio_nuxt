<script setup lang="ts">
import { Tags } from '~/shared/ui/tags'
import { isRemoteHref, projectHrefIsExternal, projectRepoHref } from '~/utils/project'
import './projects-hub.css'

const props = defineProps<{
  section: 'current' | 'portfolio'
}>()

const { data: projects } = await useAsyncData('projects-hub', () =>
  queryCollection('projects').order('order', 'ASC').all(),
)

const items = computed(() => {
  const all = projects.value ?? []

  if (props.section === 'current') {
    return all.filter((project) => project.current)
  }

  return all.filter((project) => !project.current && (project.featured || project.pets))
})

const title = computed(() =>
  props.section === 'current'
    ? 'Продукты, над которыми сейчас идёт работа'
    : 'Портфолио',
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

const COVER_FALLBACK = '/images/projects/placeholder.svg'

const variantOf = (project: { variant?: string; spa?: boolean; title: string }) => {
  if (project.variant) return project.variant
  if (project.spa) return project.variant || 'crypto'
  if (project.title === 'Codestats') return 'codestats'
  if (project.title === 'LearnPortal') return 'learn-portal'

  return 'default'
}

const coverOf = (project: { cover?: string }) => project.cover || COVER_FALLBACK

const coverLightboxId = (path: string) =>
  `hub-cover-${path.replace(/^\//, '').replace(/\//g, '-')}`
</script>

<template>
  <div class="projects-hub">
    <section
      id="projects"
      class="section"
    >
      <h2 class="section__title">{{ title }}</h2>
      <ul
        class="projects-hub__list"
        :class="{ 'projects-hub__list--grid': section === 'portfolio' }"
        tabindex="0"
        aria-label="Список проектов"
      >
        <li
          v-for="project in items"
          :key="project.path"
        >
          <article
            class="projects-hub__card"
            :class="`projects-hub__card--${variantOf(project)}`"
          >
            <div
              v-if="section === 'portfolio'"
              class="projects-hub__cover"
            >
              <button
                type="button"
                class="projects-hub__cover-media"
                :popovertarget="coverLightboxId(project.path)"
                :aria-label="`Увеличить: ${project.coverAlt || project.title}`"
              >
                <img
                  :src="coverOf(project)"
                  :alt="project.coverAlt || project.title"
                  width="1200"
                  height="675"
                  loading="lazy"
                  decoding="async"
                >
              </button>
            </div>
            <div
              v-if="section === 'portfolio'"
              :id="coverLightboxId(project.path)"
              class="projects-hub__lightbox"
              popover="auto"
              role="dialog"
              aria-modal="true"
              :aria-label="project.coverAlt || project.title"
            >
              <button
                type="button"
                class="projects-hub__lightbox-close"
                :popovertarget="coverLightboxId(project.path)"
                popovertargetaction="hide"
                aria-label="Закрыть"
              >×</button>
              <figure class="projects-hub__lightbox-figure">
                <img
                  class="projects-hub__lightbox-image"
                  :src="coverOf(project)"
                  :alt="project.coverAlt || project.title"
                >
                <figcaption class="projects-hub__lightbox-caption">
                  {{ project.coverAlt || project.title }}
                </figcaption>
              </figure>
            </div>
            <template v-if="section === 'portfolio'">
              <NuxtLink
                v-if="!project.spa"
                class="projects-hub__title-link"
                :to="project.href"
                :external="projectHrefIsExternal(project.href, project.spa)"
                :target="isRemoteHref(project.href) ? '_blank' : undefined"
                :rel="isRemoteHref(project.href) ? 'noopener noreferrer' : undefined"
              >
                <h3 class="projects-hub__title">{{ project.title }}</h3>
              </NuxtLink>
              <h3
                v-else
                class="projects-hub__title"
              >{{ project.title }}</h3>
            </template>
            <div class="projects-hub__head">
              <template v-if="section !== 'portfolio'">
                <NuxtLink
                  v-if="!project.spa"
                  class="projects-hub__title-link"
                  :to="project.href"
                  :external="projectHrefIsExternal(project.href, project.spa)"
                  :target="isRemoteHref(project.href) ? '_blank' : undefined"
                  :rel="isRemoteHref(project.href) ? 'noopener noreferrer' : undefined"
                >
                  <h3 class="projects-hub__title">{{ project.title }}</h3>
                </NuxtLink>
                <h3
                  v-else
                  class="projects-hub__title"
                >{{ project.title }}</h3>
              </template>
              <div
                v-if="project.status || project.spa || repoLink(project)"
                class="projects-hub__aside"
              >
                <span
                  v-if="project.status"
                  class="job__badge"
                >{{ project.status }}</span>
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
              v-if="!project.spa"
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
            <div
              v-else
              class="projects-hub__body"
            >
              <div class="projects-hub__excerpt prose">
                <ContentRenderer :value="project" />
              </div>
              <Tags :items="project.tags" />
            </div>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>
