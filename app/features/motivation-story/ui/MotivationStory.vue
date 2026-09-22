<script setup lang="ts">
import '~/shared/ui/motivation-quiz/motivation-quiz.css'
import { JsRequiredNotice } from '~/shared/ui/js-required'
import { useMotivationStory } from '../model/useMotivationStory'

const SLIDE_COUNT = 10
const { current, progressPct, counter, nextSlide, restart } = useMotivationStory(SLIDE_COUNT)
</script>

<template>
  <div class="mg-page">
    <div
      class="mg-progress js-only"
      :style="{ width: `${progressPct}%` }"
      aria-hidden="true"
    />

    <section
      class="section"
      id="story"
    >
      <div class="game-wrapper">
        <JsRequiredNotice />
        <div class="game-container js-only">
          <div
            class="slide"
            :class="{ active: current === 0 }"
          >
            <h2 class="slide__title">Ура!!! Я получил диплом IT-специалиста!</h2>
            <p class="slide__text">
              5 лет института, 10 сессий, 847 литров кофе, 3 пересдачи по матану
              и mass-effect под партой на лекциях... Я наконец-то дипломированный специалист!
            </p>
            <p class="slide__text">
              Пора найти работу и применить свои навыки! Мир IT, встречай нового гения!
            </p>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Поиск работы</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 1 }"
          >
            <h2 class="slide__title">Класс! Я нашёл работу!</h2>
            <p class="slide__text">
              С моим дипломом меня сразу взяли! Правда, на позицию «Junior-младший-стажёр-подай-принеси»,
              но это же только начало!
            </p>
            <div class="slide__salary slide__salary--low">40 000 ₽/мес</div>
            <p class="slide__text">
              HR сказала: «У нас молодой дружный коллектив, печеньки и кикер!» <br>
              Звучит как мечта!
            </p>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Работаем!</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 2 }"
          >
            <h2 class="slide__title">Прошли 2 недели...</h2>
            <p class="slide__text">Тимлид: «Поправь небольшой баг в legacy-коде»</p>
            <div class="slide__code">// TODO: исправить потом (2019)
// FIXME: почему это работает??
// HACK: не трогать!!!
function magic() { return magic(); }</div>
            <p class="slide__text">
              Оказывается, «небольшой баг» — это 15 000 строк кода без единого комментария,
              написанного разработчиком, который уволился 3 года назад и унёс с собой все знания.
            </p>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Разберёмся!</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 3 }"
          >
            <h2 class="slide__title">Прошёл месяц</h2>
            <p class="slide__text">На митинге:</p>
            <div class="slide__highlight">
              <strong>PM:</strong> «Нам нужен адаптивный лендинг с SSR, GraphQL API,
              микросервисная архитектура, CI/CD, и чтобы грузился за 0.5 секунды. Дедлайн — пятница.»
            </div>
            <p class="slide__text">
              Я: *гуглю что такое SSR* <br><br>
              Также я: «Да, конечно, сделаем!»
            </p>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Учиться, учиться...</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 4 }"
          >
            <h2 class="slide__title">Великое осознание</h2>
            <p class="slide__text">
              Оказывается, диплом — это только билет в мир IT, а не финиш!
            </p>
            <p class="slide__text"><strong>Чему не учили на курсах:</strong></p>
            <div class="slide__list">
              <ul>
                <li>Как читать чужой код (особенно свой месячной давности)</li>
                <li>Почему «работает на моей машине» — не аргумент</li>
                <li>Что такое «production упал в 3 ночи»</li>
                <li>Как объяснить заказчику, что «быстро, дёшево, качественно» — не совместимо</li>
                <li>Почему Stack Overflow — лучший друг разработчика</li>
              </ul>
            </div>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Не сдаёмся!</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 5 }"
          >
            <h2 class="slide__title">Прошло полгода</h2>
            <p class="slide__text">
              Я прочитал 5 книг, прошёл 12 курсов, сломал production только 3 раза
              (и даже починил сам!).
            </p>
            <div class="slide__highlight">
              <strong>Тимлид:</strong> «Молодец, растёшь! Теперь ты можешь ревьюить код джунов.»<br><br>
              <strong>Я:</strong> *смотрю на код джуна*<br>
              <strong>Также я:</strong> «Господи, кто так пишет?!»<br>
              <strong>Git blame:</strong> «Это ты, 6 месяцев назад.»
            </div>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Дальше!</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 6 }"
          >
            <h2 class="slide__title">Прошёл год</h2>
            <p class="slide__text">
              Меня повысили до Middle! Теперь я знаю, что ничего не знаю,
              но делаю это профессионально.
            </p>
            <div class="slide__salary slide__salary--medium">120 000 ₽/мес</div>
            <p class="slide__text">Новые обязанности:</p>
            <div class="slide__list">
              <ul>
                <li>Менторить джунов (и вспоминать себя)</li>
                <li>Участвовать в архитектурных решениях</li>
                <li>Объяснять, почему «переписать всё с нуля» — плохая идея</li>
                <li>Пить больше кофе</li>
              </ul>
            </div>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Продолжаем расти!</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 7 }"
          >
            <h2 class="slide__title">Прошло 2 года</h2>
            <p class="slide__text">
              Теперь я Senior. Джуны смотрят на меня как на волшебника,
              когда я нахожу баг за 5 минут.
            </p>
            <div class="slide__highlight">
              <strong>Джун:</strong> «Как вы так быстро нашли ошибку?!»<br><br>
              <strong>Я:</strong> «Потому что я делал такую же ошибку 47 раз.»
            </div>
            <div class="slide__salary">250 000 ₽/мес</div>
            <p class="slide__text">
              Секрет успеха: упорство + любопытство + умение гуглить + 1000 ошибок
            </p>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >К финалу!</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 8 }"
          >
            <h2 class="slide__title">Мораль истории</h2>
            <div class="slide__highlight">
              <p><strong>IT — это не спринт, а марафон.</strong></p>
              <p>Диплом открывает дверь, но дальше идёшь сам.</p>
              <p>Каждая ошибка — это урок.</p>
              <p>Каждый баг — это возможность научиться.</p>
              <p>Каждый сложный проект — это рост.</p>
            </div>
            <p class="slide__text">
              <strong>Не бойся не знать — бойся не учиться!</strong>
            </p>
            <div class="slide__list">
              <ul>
                <li>Читай книги и документацию</li>
                <li>Практикуйся каждый день</li>
                <li>Не стесняйся спрашивать</li>
                <li>Делай код-ревью и учись у других</li>
                <li>Пей кофе (опционально, но рекомендуется)</li>
              </ul>
            </div>
            <button
              type="button"
              class="mg-btn js-only"
              @click="nextSlide"
            >Вдохновлён!</button>
          </div>

          <div
            class="slide"
            :class="{ active: current === 9 }"
          >
            <h2 class="slide__title">Твой путь начинается сейчас!</h2>
            <p class="slide__text">
              Неважно, на каком ты этапе — джун, мидл или сеньор.
              Главное — не останавливаться и продолжать расти!
            </p>
            <div class="slide__highlight slide__highlight--center">
              <p class="slide__quote">«Лучшее время посадить дерево было 20 лет назад.<br>
              Второе лучшее время — сейчас.»</p>
            </div>
            <p class="slide__text">Удачи на твоём пути в IT!</p>
            <div class="mg-btn-row">
              <button
                type="button"
                class="mg-btn js-only"
                @click="restart"
              >Пройти заново</button>
            </div>
          </div>
        </div>
      </div>
      <div class="mg-meta js-only">
        <p class="mg-counter">{{ counter }}</p>
      </div>
    </section>
  </div>
</template>
