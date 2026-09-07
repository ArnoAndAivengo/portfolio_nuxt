<script setup lang="ts">
const { data: home } = await useHome()
const { data: meta } = await useAsyncData('resume-meta', () => queryCollection('resumeMeta').first())
const { data: experience } = await useAsyncData('experience', () =>
  queryCollection('experience').order('order', 'ASC').all(),
)
const { data: projects } = await useAsyncData('projects', () =>
  queryCollection('projects').where('featured', '=', true).order('order', 'ASC').all(),
)

usePageSeo({
  title: () => home.value?.seoTitle,
  description: () => home.value?.seoDescription,
  path: () => '/',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})
</script>

<template>
  <div v-if="home">
    <section
      id="about"
      class="section"
    >
      <h2 class="section__title">Обо мне</h2>
      <div class="prose">
        <ContentRenderer :value="home" />
      </div>
      <NuxtLink
        class="more"
        to="/resume"
      >
        Резюме · Frontend <span aria-hidden="true">→</span>
      </NuxtLink>
    </section>

    <section
      id="experience"
      class="section"
    >
      <h2 class="section__title">Опыт</h2>
      <ol class="exp">
        <li
          v-for="job in experience"
          :key="job.path"
        >
          <article
            class="exp__card"
            :class="{ 'exp__card--current': job.current }"
          >
            <div class="exp__period">{{ job.period }}</div>
            <div>
              <h3 class="exp__title">{{ job.title }}</h3>
              <div class="exp__text prose">
                <ContentRenderer :value="job" />
              </div>
              <ul class="tags">
                <li
                  v-for="tag in job.tags"
                  :key="tag"
                >{{ tag }}</li>
              </ul>
            </div>
          </article>
        </li>
      </ol>
      <NuxtLink
        class="more"
        to="/resume"
      >
        Резюме с деталями <span aria-hidden="true">→</span>
      </NuxtLink>
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
          <NuxtLink
            class="proj__card"
            :to="project.href"
            :external="project.href.startsWith('http')"
            :target="project.href.startsWith('http') ? '_blank' : undefined"
            :rel="project.href.startsWith('http') ? 'noopener noreferrer' : undefined"
          >
            <div class="proj__head">
              <h3 class="proj__title">{{ project.title }}</h3>
              <span class="job__badge">{{ project.status }}</span>
              <ProjectRepoIcon :href="project.href" />
            </div>
            <div class="proj__text prose">
              <ContentRenderer :value="project" />
            </div>
            <ul class="tags">
              <li
                v-for="tag in project.tags"
                :key="tag"
              >{{ tag }}</li>
            </ul>
          </NuxtLink>
        </li>
      </ul>
      <NuxtLink
        class="more"
        to="/projects"
      >
        Кейсы проектов <span aria-hidden="true">→</span>
      </NuxtLink>
    </section>

    <section
      id="skills"
      class="section"
    >
      <h2 class="section__title">Навыки</h2>
      <div class="skills">
        <div
          v-for="group in home.skills"
          :key="group.label"
        >
          <h3 class="skills__label">{{ group.label }}</h3>
          <ul class="tags">
            <li
              v-for="item in group.items"
              :key="item"
            >{{ item }}</li>
          </ul>
        </div>
      </div>
      <p class="prose skills__note">
        Подробный стек и опыт — в
        <NuxtLink
          class="more"
          to="/resume"
        >резюме Frontend</NuxtLink>.
      </p>
    </section>

    <section
      id="contact"
      class="section"
    >
      <h2 class="section__title">Контакты</h2>
      <p class="prose">Готов обсудить роль или проект.</p>
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
