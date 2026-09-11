<script setup lang="ts">
import { Tags } from '~/shared/ui/tags'
import { isRemoteHref, projectGitUrl, projectHasPreview, projectHrefIsExternal } from '~/utils/project'

const { data: home } = await useHome()
const { data: resume } = await useAsyncData('resume', () => queryCollection('resume').first())
const { data: meta } = await useAsyncData('resume-meta', () => queryCollection('resumeMeta').first())
const { data: jobs } = await useAsyncData('jobs', () =>
  queryCollection('jobs').order('order', 'ASC').all(),
)
const { data: projects } = await useAsyncData('resume-projects', () =>
  queryCollection('projects').order('order', 'ASC').all(),
)

usePageSeo({
  title: () => resume.value?.seoTitle,
  description: () => resume.value?.seoDescription,
  path: () => '/resume',
  type: 'profile',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})

const openJobDetailsForPrint = () => {
  document.querySelectorAll<HTMLDetailsElement>('.job__extra').forEach((el) => {
    el.open = true
  })
}

const printResume = () => {
  openJobDetailsForPrint()
  window.print()
}

const diploma = ref<{ src: string, alt: string } | null>(null)
const diplomaCloseRef = ref<HTMLButtonElement | null>(null)
const diplomaOpener = ref<HTMLElement | null>(null)

const openDiploma = (src: string, alt: string, event?: MouseEvent) => {
  diplomaOpener.value = (event?.currentTarget as HTMLElement) ?? null
  diploma.value = { src, alt }
  document.body.style.overflow = 'hidden'
  nextTick(() => diplomaCloseRef.value?.focus())
}

const closeDiploma = () => {
  diploma.value = null
  document.body.style.overflow = ''
  nextTick(() => diplomaOpener.value?.focus())
}

const onDiplomaKey = (event: KeyboardEvent) => {
  if (!diploma.value) return

  if (event.key === 'Escape') {
    closeDiploma()
    return
  }

  if (event.key === 'Tab') {
    event.preventDefault()
    diplomaCloseRef.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onDiplomaKey)
  window.addEventListener('beforeprint', openJobDetailsForPrint)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onDiplomaKey)
  window.removeEventListener('beforeprint', openJobDetailsForPrint)
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    v-if="home && resume && meta"
    class="resume"
  >
    <section
      id="about"
      class="section"
    >
      <h2 class="section__title">Обо мне</h2>
      <div class="prose">
        <ContentRenderer :value="resume" />
      </div>
    </section>

    <KeyResults :items="meta.highlights" />

    <section
      id="value"
      class="section"
    >
      <h2 class="section__title">Что приношу в команду</h2>
      <ul class="resume-list">
        <li
          v-for="item in meta.contributions"
          :key="item.label"
        >
          <strong>{{ asText(item.label) }}</strong>
          — {{ asText(item.text) }}
        </li>
      </ul>
    </section>

    <section
      id="skills"
      class="section"
    >
      <h2 class="section__title">Ключевые компетенции</h2>
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
    </section>

    <section
      id="experience"
      class="section"
    >
      <h2 class="section__title">Опыт работы — {{ home.experienceYears }}</h2>
      <div class="jobs">
        <JobCard
          v-for="job in jobs"
          :key="job.order + job.company"
          :job="job"
          details
        />
      </div>
    </section>

    <section
      id="projects"
      class="section"
    >
      <h2 class="section__title">Проекты</h2>
      <ul class="proj">
        <li
          v-for="project in projects"
          :key="project.path"
        >
          <article class="proj__card">
            <div class="proj__head">
              <h3 class="proj__title">{{ project.title }}</h3>
              <span class="job__badge">{{ project.status }}</span>
              <NuxtLink
                v-if="projectHasPreview(project.href, project.spa)"
                class="proj__preview"
                :to="project.href"
                :external="projectHrefIsExternal(project.href, project.spa)"
                :target="project.spa || isRemoteHref(project.href) ? '_blank' : undefined"
                :rel="project.spa || isRemoteHref(project.href) ? 'noopener noreferrer' : undefined"
              >
                Превью
              </NuxtLink>
              <a
                v-if="projectGitUrl(project.href, project.repo)"
                class="proj__repo"
                :href="projectGitUrl(project.href, project.repo)"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Репозиторий ${project.title}`"
              >
                <ProjectRepoIcon :href="projectGitUrl(project.href, project.repo) ?? project.href" />
              </a>
            </div>
            <div class="proj__text prose">
              <ContentRenderer :value="project" />
            </div>
            <Tags :items="project.tags" />
          </article>
        </li>
      </ul>
    </section>

    <section
      id="education"
      class="section"
    >
      <h2 class="section__title">Образование</h2>
      <ul class="edu">
        <li
          v-for="item in meta.education"
          :key="item.title"
          class="edu__item"
        >
          <span class="edu__year">{{ item.year }}</span>
          <div>
            <p class="edu__title">{{ item.title }}</p>
            <p class="edu__org">{{ item.org }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section
      id="training"
      class="section"
    >
      <h2 class="section__title">Повышение квалификации</h2>
      <ul class="edu">
        <li
          v-for="item in meta.training"
          :key="item.title"
          class="edu__item"
          :class="{ 'edu__item--diploma': item.diploma }"
        >
          <span class="edu__year">{{ item.year }}</span>
          <div>
            <p class="edu__title">{{ item.title }}</p>
            <p class="edu__org">{{ item.org }}</p>
          </div>
          <button
            v-if="item.diploma"
            type="button"
            class="edu__diploma"
            :aria-label="item.diplomaAlt || 'Открыть диплом'"
            @click="openDiploma(item.diploma, item.diplomaAlt || 'Диплом', $event)"
          >
            <img
              :src="item.diploma"
              :alt="item.diplomaAlt || 'Диплом'"
              width="160"
              height="110"
              loading="lazy"
            >
          </button>
        </li>
      </ul>
    </section>

    <section
      id="languages"
      class="section"
    >
      <h2 class="section__title">Знание языков</h2>
      <ul class="resume-list">
        <li
          v-for="item in meta.languages"
          :key="item.name"
        >
          <strong>{{ item.name }}</strong>
          — {{ item.level }}
        </li>
      </ul>
    </section>

    <section
      id="extra"
      class="section"
    >
      <h2 class="section__title">Дополнительно</h2>
      <ul class="resume-list">
        <li
          v-for="item in meta.extra"
          :key="item"
        >{{ item }}</li>
      </ul>
    </section>

    <section
      id="goals"
      class="section"
    >
      <h2 class="section__title">Что ищу</h2>
      <ul class="resume-list">
        <li
          v-for="item in meta.goals"
          :key="item.label"
        >
          <strong>{{ asText(item.label) }}:</strong>
          {{ asText(item.text) }}
        </li>
      </ul>
    </section>

    <section
      id="contact"
      class="section"
    >
      <h2 class="section__title">Контакты</h2>
      <p class="prose">Готов обсудить роль или проект.</p>
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
        <button
          type="button"
          class="btn btn--ghost"
          @click="printResume"
        >PDF</button>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="diploma"
        class="diploma-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="diploma.alt"
        @click.self="closeDiploma"
      >
        <button
          ref="diplomaCloseRef"
          type="button"
          class="diploma-modal__close"
          aria-label="Закрыть"
          @click="closeDiploma"
        >×</button>
        <img
          class="diploma-modal__image"
          :src="diploma.src"
          :alt="diploma.alt"
        >
      </div>
    </Teleport>
  </div>
</template>
