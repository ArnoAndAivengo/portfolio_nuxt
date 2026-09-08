<script setup lang="ts">
import { PROJECT_PAGES } from '~/entities/project'
import { Tags } from '~/shared/ui/tags'
import ProjectCta from './ProjectCta.vue'
import './current-project.css'

const page = PROJECT_PAGES.codestats
const { data: home } = await useHome()

usePageSeo({
  title: () => page.seoTitle,
  description: () => page.seoDescription,
  path: () => '/projects/codestats',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})

const stack = ['NestJS', 'PostgreSQL', 'Redis', 'Nuxt 3', 'Vue 3', 'React', 'Docker', 'GitHub API']
</script>

<template>
  <div class="current-project">
    <section
      id="overview"
      class="section current-project__section"
    >
      <h2 class="section__title">О проекте</h2>
      <div class="prose">
        <p>
          Codestats — платформа для IT-рекрутинга.
          Платформа помогает смотреть на кандидата не только через резюме,
          но и через реальную активность на GitHub: проекты, языки, динамику коммитов.
          Вакансии и кандидаты живут рядом — без таблиц в мессенджерах и ручного разбора профилей.
        </p>
        <p>
          Проект развивается как самостоятельный продукт, но связан с
          <NuxtLink to="/projects/learn-portal">LearnPortal</NuxtLink>: ученики сдают домашку ссылкой на GitHub —
          тот же след может попасть в профиль кандидата, когда рекрутер смотрит на выпускника.
        </p>
        <p><strong>Зачем это нужно:</strong></p>
      </div>
      <ol class="current-project__numbered">
        <li>
          <strong>Резюме мало говорит о навыках.</strong>
          Слова «Vue, Node, PostgreSQL» легко написать — сложнее показать,
          что человек реально пишет код и ведёт проекты.
        </li>
        <li>
          <strong>GitHub проверяют вручную.</strong>
          На нескольких кандидатах в неделю это ещё терпимо; дальше данные устаревают,
          а картина по вакансии рассыпается.
        </li>
        <li>
          <strong>Обучение и подбор не стыкуются.</strong>
          LMS знает, что урок сдан, но работодатель не видит путь ученика —
          коммиты, репозитории, рост от задачи к задаче.
        </li>
      </ol>
      <div class="prose">
        <p><strong>Codestats закрывает этот разрыв:</strong></p>
      </div>
      <ol
        class="current-project__numbered"
      >
        <li>
          <strong>Кандидат с доказательствами.</strong>
          Профиль на GitHub и сводка по активности — рядом с карточкой кандидата.
        </li>
        <li>
          <strong>Вакансии и воронка в одном интерфейсе.</strong>
          Кто на какой стадии, что уже собрано, когда обновлялись данные.
        </li>
        <li>
          <strong>Связь с LearnPortal.</strong>
          Два отдельных продукта, общий мост через GitHub — без смешивания обучения и рекрутинга.
        </li>
      </ol>
    </section>

    <section
      id="inside"
      class="section current-project__section"
    >
      <h2 class="section__title">Что внутри</h2>
      <ul class="current-project__checks">
        <li><strong>Вакансии</strong> — создание, статусы, привязка кандидатов</li>
        <li><strong>Кандидаты</strong> — карточка с GitHub-профилем и сводкой по активности</li>
        <li><strong>Аналитика GitHub</strong> — репозитории, языки, коммиты; обновление в фоне</li>
        <li><strong>Основной интерфейс</strong> — для рекрутера: вакансии, дашборды, поиск</li>
        <li><strong>Админка</strong> — пользователи, задачи, системная статистика</li>
        <li><strong>Интеграция с LearnPortal</strong> — ученик с GitHub → кандидат с проверяемым следом</li>
      </ul>
    </section>

    <section
      id="stack"
      class="section current-project__section"
    >
      <h2 class="section__title">Стек</h2>
      <Tags
        class="current-project__stack"
        :items="stack"
      />
    </section>

    <section
      id="status"
      class="section current-project__section"
    >
      <h2 class="section__title">Статус</h2>
      <div class="prose">
        <p>
          Проект в активной разработке. <br>
          Репозиторий закрытый: код и участие в команде — только по приглашению.
        </p>
      </div>
    </section>

    <section
      id="code"
      class="section current-project__section"
    >
      <h2 class="section__title">Код</h2>
      <div class="prose">
        <p>
          Монорепозиторий <strong>codestats-platform</strong> закрытый.
          Исходники и вклад в код — только для приглашённых коллабораторов.
          Если хотите присоединиться — напишите в Telegram.
        </p>
      </div>
      <ProjectCta
        :to="home?.telegram ?? 'https://t.me/alexObukhovArno'"
        label="Написать в Telegram"
        more="Приглашение в репозиторий"
        telegram
      />
    </section>

    <section
      id="learnportal"
      class="section current-project__section"
    >
      <h2 class="section__title">LearnPortal</h2>
      <div class="prose">
        <p>
          Параллельный проект — обучающая платформа для web-разработчиков.
          Codestats и LearnPortal остаются отдельными продуктами;
          связь — через GitHub: ученик сдаёт домашку ссылкой на репозиторий,
          рекрутер видит не только «урок пройден», а реальный код и динамику роста.
        </p>
      </div>
      <ProjectCta
        to="/projects/learn-portal"
        label="Страница LearnPortal"
        more="Открыть"
      />
    </section>
  </div>
</template>
