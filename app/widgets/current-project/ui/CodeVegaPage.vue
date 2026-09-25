<script setup lang="ts">
import { PROJECT_PAGES } from '~/entities/project'
import { Tags } from '~/shared/ui/tags'
import ProjectCta from './ProjectCta.vue'
import ScreenshotSlider from './ScreenshotSlider.vue'
import './current-project.css'

const page = PROJECT_PAGES.codevega
const { data: home } = await useHome()

usePageSeo({
  title: () => page.seoTitle,
  description: () => page.seoDescription,
  path: () => '/projects/codevega',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})

const screenshots = [
  { src: '/images/learnportal/learnportal.png', alt: 'Урок JavaScript: теория по DOM и опрос' },
  { src: '/images/learnportal/learnportal-2.png', alt: 'Программа курса HTML: модули и уроки' },
  { src: '/images/learnportal/learnportal-3.png', alt: 'Админ-панель: дашборд платформы' },
  { src: '/images/learnportal/learnportal-4.png', alt: 'Каталог курсов для разработчиков с фильтрами' },
  { src: '/images/learnportal/learnportal-5.png', alt: 'Документация проекта: индекс и навигация' },
  { src: '/images/learnportal/learnportal-6.png', alt: 'Справочник: VS Code, Git, HTML, CSS и JavaScript' },
  { src: '/images/learnportal/learnportal-7.png', alt: 'Блог: список статей автора' },
  { src: '/images/learnportal/learnportal-8.png', alt: 'Редактор новой статьи с модерацией' },
  { src: '/images/learnportal/learnportal-9.png', alt: 'Профиль ученика: XP, курсы и вовлечённость' },
]

const stack = [
  'Nuxt 3',
  'Vue 3',
  'TypeScript',
  'Pinia',
  'FSD',
  'Tailwind',
  'Sass',
  'TipTap',
  'Monaco Editor',
  'CodeMirror',
  'Chart.js',
  'Nuxt Content',
  'Node.js',
  'Express',
  'Sequelize',
  'JWT',
  'Swagger',
  'Jest',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Nginx',
  'GitHub Actions',
  'PM2',
  'Ollama',
]
const roles = [
  'Fullstack',
  'Frontend',
  'Backend',
  'DevOps',
  'QA',
  'UX / UI',
  'CEO',
  'Product Manager',
  'Контент',
  'Методист',
  'Редактор',
  'Community',
  'Ментор',
]
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
          CodeVega — уникальный проект для обучения программированию.
          Главная цель — построить структурное обучение и дальнейшее развитие учеников.
          Это не очередная LMS, которая скрывает прогресс после обучения:
          CodeVega сохраняет весь прогресс в уникальном IT-паспорте.
        </p>
        <p>
          После регистрации ты вступаешь в сообщество CodeVega.
          Сообщество развивается силами самого сообщества, как и этот проект.
        </p>
        <h3 class="current-project__h">Обучение, которое не обнуляется</h3>
        <p>
          В отличие от обычных курсов, в CodeVega прогресс, написанный код и пет-проекты
          остаются с тобой навсегда. Можно менять языки и направления,
          но история роста только накапливается.
        </p>
        <h3 class="current-project__h">Прозрачность для работодателей</h3>
        <p>
          Профиль превращается в верифицированный «IT-паспорт».
          Рекрутерам не понадобятся тестовые задания — они увидят реальную динамику развития
          от первой строчки кода до сложных проектов. Опыт не нужно доказывать:
          «IT-паспорт» докажет его за тебя.
        </p>
        <h3 class="current-project__h">Что даёт обычное обучение</h3>
      </div>
      <ul class="current-project__numbered">
        <li>
          <strong>Нет прозрачности знаний.</strong>
          После курсов непонятно, что человек реально умеет: сертификат есть,
          а глубина, пробелы и самостоятельность остаются скрытыми.
        </li>
        <li>
          <strong>Работодатель не видит путь.</strong>
          Вся работа за время обучения остаётся в песочнице LMS —
          рекрутер получает резюме, а не доказанный трек: задачи, коммиты, вклад в проекты.
        </li>
        <li>
          <strong>AI ворует практику.</strong>
          Почти в каждую LMS-песочницу интегрируют ИИ.
          Ассистенты, которые решают задачи за ученика, забирают навык думать
          и писать код самому.
        </li>
        <li>
          <strong>Фрагменты профессии.</strong>
          Теория отдельно, домашка отдельно, командной работы нет —
          выпускник знает куски стека, но не умеет вести задачу от идеи до релиза.
        </li>
        <li>
          <strong>Нет моста на рынок.</strong>
          Обучение обрывается на дипломе и пару проектов: нет живого профиля,
          портфолио с реального пути и выхода на оплачиваемые задачи до первого оффера.
        </li>
      </ul>
      <div class="prose">
        <h3 class="current-project__h">Как отвечает CodeVega</h3>
      </div>
      <ul class="current-project__numbered">
        <li>
          <strong>Видно, что человек умеет.</strong>
          Курсы, квизы, ДЗ, спринты и командные проекты собираются в профиле.
          Глубина и самостоятельность читаются по делу, а не по сертификату.
        </li>
        <li>
          <strong>Работодатель видит путь.</strong>
          Не голое резюме с пройденными на словах курсами: задачи, коммиты
          и вклад в проекты открыты ещё до собеседования.
        </li>
        <li>
          <strong>Сначала попытка, потом подсказка.</strong>
          В начале ученик решает сам. ИИ открывается после попытки
          и не пишет домашку за ученика. На алгоритмах ИИ выключен полностью.
        </li>
        <li>
          <strong>Профессия целиком.</strong>
          Теория, практика и командные проекты с ролями, ревью и релизом —
          проекты ведут опытные TL от идеи до продакшена.
        </li>
        <li>
          <strong>Мост на рынок изнутри.</strong>
          Живой профиль, портфолио с реального пути и выход на оплачиваемые задачи —
          обучение не обрывается дипломом.
        </li>
      </ul>
    </section>

    <section
      id="screenshots"
      class="section current-project__section"
    >
      <h2 class="section__title">Скриншоты</h2>
      <ScreenshotSlider
        name="codevega-shots"
        label="Скриншоты CodeVega"
        :items="screenshots"
      />
    </section>

    <section
      id="inside"
      class="section current-project__section"
    >
      <h2 class="section__title">Что внутри</h2>
      <ul class="current-project__checks">
        <li><strong>Интерактивные курсы</strong> — теория, квизы, код в браузере, домашка</li>
        <li><strong>Технический блог</strong> — ученик ведёт живой блог: чему научился, что сломал, как починил</li>
        <li><strong>Геймификация</strong> — XP, уровни, достижения</li>
        <li><strong>Командные проекты</strong> — еженедельный набор с ролями: frontend, fullstack, тестировщик</li>
        <li><strong>Прозрачный профиль</strong> — верифицированный профиль с полной историей достижений</li>
        <li><strong>Заработок на платформе</strong> — выход на оплачиваемые задачи внутри экосистемы</li>
        <li><strong>Рекрутинг</strong> — рекрутеры видят реальную динамику развития от первой строчки кода до сложных проектов</li>
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
          <strong>В разработке.</strong>
          Проект активно разрабатывается. Его делает сообщество CodeVega —
          и сообщество же приносит новые идеи. Всё, что описано на этой странице, может измениться.
        </p>
        <p>
          Публичная страница —
          <a :href="page.site" target="_blank" rel="noopener noreferrer">codevega.ru</a>.
        </p>
      </div>
    </section>

    <section
      id="join"
      class="section current-project__section"
    >
      <h2 class="section__title">Участие</h2>
      <div class="prose">
        <p>
          CodeVega — бесплатная платформа. Это не значит, что бесплатно — значит некачественно.
          Мы хотим создать лучшую и современную обучающую платформу
          и вкладываем все силы и время в качество продукта.
        </p>
        <p>
          Работа над продуктом добровольная. Любой, кто хочет поучаствовать
          в развитии продукта, может принять участие.
        </p>
        <p>
          Нагрузка — как удобно: можно прийти на один MR или вести целое направление.
        </p>
        <p>
          Будем учиться и развивать навыки. Присоединяйтесь.
        </p>
        <ProjectCta
            :to="home?.telegram ?? 'https://t.me/alexObukhovArno'"
            label="Написать в Telegram"
            more="Принять участие"
            telegram
        />
        <p>
          Репозиторий <strong>CodeVega</strong> не публичный.
          После сообщения в Telegram выдаём доступ — дальше работа
          <strong>локально и через merge request</strong>.
        </p>


        <h3 class="section__title">Кто нужен</h3>
        <p>
          Нужны все, кто готов строить большой обучающий портал и другие продукты вокруг него.
        </p>
      </div>
      <Tags :items="roles" style="margin: 1rem 0;"/>
      <div class="prose">
        <p>
          Нет навыков? Присоединяйтесь: поможем, объясним. Важны руки, а навыки вырастут.
        </p>
        <p>Любые предложенные идеи обсуждаются и вносятся в проект.</p>
        <h3 class="section__title">Как устроена работа</h3>
        <p>
          Мы на лёгком старте. Открытой площадки пока нет (в планах).
          Разработка идёт локально: поднимаем стек у себя в Docker, пишем фичу или урок
          и отдаём <strong>merge request</strong>. Ревью и обсуждение — в MR и в Telegram.
        </p>
        <h3 class="section__title">Что делать сейчас</h3>
        <p>
          CodeVega — огромный проект с множеством интересных и уникальных задач.
          От лёгких до сложных.
        </p>
      </div>
      <ul class="current-project__checks">
        <li>
          <strong>Код и фичи.</strong>
          Доработка того, что уже есть, и собирать следующее:
          командные проекты, карьерные пути и портфолио ученика,
          связку с Codestats по GitHub, сертификаты, безопасность аккаунта.
        </li>
        <li>
          <strong>Базовые курсы.</strong>
          Дописать готовые линейки курсов и составлять новые.
        </li>
        <li>
          <strong>Авторские курсы.</strong>
          Собственные курсы авторов, которые хотят зарабатывать и продвигать их на платформе.
          Для таких курсов планируется движок-интегратор: на нём авторы смогут создавать уникальные курсы.
        </li>
        <li>
          <strong>Открытая площадка.</strong>
          Когда продукт перестанет быть локальным Docker:
          деплой, почта, нормальный вход для учеников.
        </li>
      </ul>
    </section>
  </div>
</template>
