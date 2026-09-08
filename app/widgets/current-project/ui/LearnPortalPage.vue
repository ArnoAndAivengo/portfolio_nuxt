<script setup lang="ts">
import { PROJECT_PAGES } from '~/entities/project'
import { Tags } from '~/shared/ui/tags'
import ProjectCta from './ProjectCta.vue'
import './current-project.css'

const page = PROJECT_PAGES.learnPortal
const { data: home } = await useHome()

usePageSeo({
  title: () => page.seoTitle,
  description: () => page.seoDescription,
  path: () => '/projects/learn-portal',
  image: () => home.value?.ogImage,
  author: () => home.value?.name,
})

const stack = ['Nuxt 3', 'Vue 3', 'FSD', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'Nginx']
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
          LearnPortal (рабочее название) — <strong>обучающая платформа</strong> для web-разработчиков.
          Old school подход: теория, практика, алгоритмы, код руками — без готовых ответов из чата.
        </p>
        <p>
          Параллельно развивается <NuxtLink to="/projects/codestats">Codestats</NuxtLink> — аналитика для IT-рекрутинга;
          мост между продуктами — GitHub, GiLab-идентичность ученика.
        </p>
        <p>Несколько проблем, из‑за которых современное обучение часто не доводит до профессии:</p>
      </div>
      <ol class="current-project__numbered">
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
          Ассистенты, которые решают задачи за ученика, забирают навык думать
          и писать код самому.
        </li>
        <li>
          <strong>Фрагменты вместо профессии.</strong>
          Теория отдельно, домашка отдельно, командная работа почти нигде —
          выпускник знает куски стека, но не умеет вести задачу от идеи до релиза.
        </li>
        <li>
          <strong>Нет моста на рынок.</strong>
          Обучение обрывается дипломом: нет живого профиля, портфолио с реального пути
          и выхода на оплачиваемые задачи до первого оффера.
        </li>
      </ol>
      <div class="prose">
        <p><strong>LearnPortal отвечает на это так:</strong></p>
      </div>
      <ol class="current-project__numbered">
        <li>
          <strong>Наставничество с первой минуты.</strong>
          Для первых шагов AI‑ассистент помогает начать с нуля и освоиться на платформе:
          маршрут, первые шаги, как устроено обучение — без решения домашки за ученика.
        </li>
        <li>
          <strong>Сначала попытка, потом подсказка.</strong>
          В начале ученик решает задачу сам, без подсказок. Ускорители в виде ИИ открываются после попытки или попыток.
          Если задача на алгоритм, то ИИ будет выключен полностью, т.к. такие задачи ученик должен решать сам.
        </li>
        <li>
          <strong>Прозрачный путь кандидата.</strong>
          Курсы, квизы, код, техблог и вклад в командные проекты собираются в профиль,
          который работодатель видит ещё до собеседования.
        </li>
        <li>
          <strong>Живая команда, не песочница.</strong>
          Еженедельные проекты с ролями, ревью и ответственностью —
          как на настоящей работе.
        </li>
        <li>
          <strong>Выход на рынок изнутри.</strong>
          От обучения к оплачиваемым задачам и рекрутингу по сделанному на платформе —
          не только по красивому резюме.
        </li>
        <li>
          <strong>Программирование для всех.</strong>
          Большая часть материалов создаваемая сообществом будет бесплатной и доступной с любого устройства.
        </li>
      </ol>
    </section>

    <section
      id="inside"
      class="section current-project__section"
    >
      <h2 class="section__title">Что внутри</h2>
      <ul class="current-project__checks">
        <li><strong>Интерактивные курсы</strong> — теория, квизы, код в браузере, домашка в своей IDE</li>
        <li><strong>Технический блог</strong> — живой след роста: чему научился, что сломал, как починил</li>
        <li><strong>Геймификация</strong> — XP, уровни, достижения</li>
        <li><strong>Командные проекты</strong> — еженедельный набор с ролями: frontend, fullstack, тестировщик</li>
        <li><strong>Прозрачный профиль</strong> — курсы, проекты, вклад — до собеседования</li>
        <li><strong>Заработок на платформе</strong> — выход на оплачиваемые задачи внутри экосистемы</li>
        <li><strong>Рекрутинг</strong> — подбор по сделанному на платформе, а не только по резюме</li>
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
          Платформа активно развивается.<br>
          Своей открытой площадки пока нет — публичный сайт впереди.<br>
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
          LearnPortal — это сообщество, и создаётся сообществом.
          Работа над продуктом добровольная. Любой, кто хочет поучаствовать
          в развитии продукта, может принять участие.
        </p>
        <p>
          В будущем мы сделаем страницу участников — для всех, кто участвовал в развитии продукта.
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
          Репозиторий <strong>learn-portal-platform</strong> не публичный.
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
        <ul>
          <li>- <b>Кодеры</b> — ядро платформы.</li>
          <li>- <b>Контентщики и методисты</b> — базовые курсы.</li>
          <li>- <b>CEO и Product Manager</b> — приоритеты, партнёрства, как из локальной сборки
            вырастить площадку.</li>
          <li>- <b>Дизайн, QA, DevOps, сообщество и менторство</b> —
            чтобы ученик не упирался в сырой интерфейс и пустой чат.</li>
        </ul>
        <p>Любые идеи обсуждаются и вносятся в проект.</p>
        <h3 class="section__title">Как устроена работа</h3>
        <p>
          Открытой площадки пока нет. Разработка идёт локально:
          поднимаем стек у себя в Docker, пишем фичу или урок и отдаём
          <strong>merge request</strong>. Ревью и обсуждение — в MR и в Telegram,
          не на проде.
        </p>
        <h3 class="section__title">Что делать сейчас</h3>
      </div>
      <ul class="current-project__checks">
        <li>
          <strong>Код и фичи.</strong>
          Допиливать то, что уже есть, и собирать следующее:
          командные проекты, карьерные пути и портфолио ученика,
          связку с Codestats по GitHub, сертификаты, безопасность аккаунта.
        </li>
        <li>
          <strong>Базовые курсы — бесплатные.</strong>
          Дописать линейки: CSS и JavaScript после третьего курса,
          Python дальше первого модуля, затем Node.js, PHP, SQL и Git.
        </li>
        <li>
          <strong>Авторские курсы — планируются платные, позже.</strong>
          Специализации и курсы авторов не входят в бесплатное ядро.
          Сейчас можно закладывать программу и формат; монетизация — когда появится площадка.
        </li>
        <li>
          <strong>Первая открытая площадка.</strong>
          Когда продукт перестанет быть только локальным Docker:
          деплой, почта, нормальный вход для учеников.
        </li>
        <li>
          <strong>Документация и онбординг.</strong>
          Чтобы новый человек поднял проект и отправил первый MR без недели догадок.
        </li>
      </ul>
    </section>
  </div>
</template>
