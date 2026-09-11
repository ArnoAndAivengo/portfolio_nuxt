<script setup lang="ts">
import { PrivacyPolicy } from '~/shared/ui/privacy-policy'
import { usePythonQuiz } from '../model/usePythonQuiz'
import './python-quiz.css'

const {
  LEVELS,
  LETTERS,
  consent,
  consentText,
  view,
  level,
  lessonsInLevel,
  levelMeta,
  completedCount,
  bestScore,
  progressPct,
  barPct,
  currentLesson,
  currentQuestion,
  shuffled,
  selected,
  answered,
  correct,
  wrong,
  donePct,
  passed,
  nextLesson,
  results,
  applyConsent,
  setLevel,
  startLesson,
  answer,
  nextQuestion,
  goHub,
  resetProgress,
  lessonIndexOf,
  statusOf,
  questionIndex,
} = usePythonQuiz()
</script>

<template>
  <div
    class="py-page"
    :class="consent ? 'py-has-consent' : 'py-needs-consent'"
  >
    <div
      class="py-progress"
      :style="{ width: `${barPct}%` }"
    />

    <section
      class="section py-welcome"
      id="welcome"
    >
      <p class="py-kicker">Python</p>
      <div class="prose">
        <p>
          Тренажёр Python с уровнями: базовый, средний и продвинутый.
          Базовый заполнен полностью — восемь уроков, в конце вопросы как на собесе.
        </p>
        <p>
          Сначала нужно принять или отклонить cookies.
          Если примете — прогресс сохранится в браузере.
          Если отклоните — заниматься можно, но прогресс не запомнится.
        </p>
      </div>
    </section>

    <section
      class="section"
      id="board"
    >
      <div
        class="py-view"
        :class="{ 'is-on': view === 'hub' }"
      >
        <div
          class="py-tabs"
          role="tablist"
          aria-label="Уровни"
        >
          <button
            v-for="item in LEVELS"
            :key="item.id"
            type="button"
            class="py-tab"
            role="tab"
            :class="{ 'is-active': level === item.id }"
            :aria-selected="level === item.id"
            @click="setLevel(item.id)"
          >{{ item.label }}</button>
        </div>

        <p class="py-lead">
          {{ level === 'basic'
            ? 'Восемь уроков: от синтаксиса до вопросов как на собесе.'
            : 'Сюда скоро добавим уроки. Пока можно пройти весь базовый уровень.' }}
        </p>

        <div class="py-meta">
          <span>Уроков: <strong>{{ completedCount }} / {{ lessonsInLevel.length }}</strong></span>
          <span>Прогресс: <strong>{{ progressPct }}%</strong></span>
          <span>Лучший счёт: <strong>{{ bestScore }}</strong></span>
        </div>

        <div class="py-lessons">
          <div
            v-if="!lessonsInLevel.length"
            class="py-empty"
          >
            <p class="py-empty__title">Пока пусто</p>
            <p class="py-empty__text">
              Уроки уровня «{{ levelMeta.label }}» появятся позже.
              Переключитесь на вкладку «Базовый».
            </p>
          </div>
          <template v-else>
            <article
              v-for="lesson in lessonsInLevel"
              :key="lesson.id"
              class="py-card"
            >
              <div style="display: flex; justify-content: space-between;">
                <p class="py-card__kicker">{{ lesson.kicker }}</p>

                <p class="py-card__meta">{{ statusOf(lesson.id, lesson.questions.length) }}</p>
              </div>
              <h3 class="py-card__title">{{ lesson.title }}</h3>
              <p class="py-card__lead">{{ lesson.lead }}</p>
              <div class="py-card__actions">
                <button
                  type="button"
                  class="py-btn"
                  @click="startLesson(lessonIndexOf(lesson.id))"
                >{{ results[lesson.id] ? 'Повторить' : 'Начать' }}</button>
              </div>
            </article>
          </template>
        </div>

        <div class="py-actions">
          <button
            type="button"
            class="py-btn py-btn--ghost"
            @click="resetProgress"
          >Сбросить прогресс</button>
        </div>
      </div>

      <div
        class="py-view"
        :class="{ 'is-on': view === 'run' }"
      >
        <div class="py-header">
          <div>
            <span class="py-badge">{{ currentLesson?.title }}</span>
          </div>
          <div
            class="py-score"
            aria-label="Счёт"
          >
            <span>Верно <strong>{{ correct }}</strong></span>
            <span>Ошибки <strong>{{ wrong }}</strong></span>
          </div>
        </div>

        <div
          class="py-dots"
          aria-hidden="true"
        >
          <div
            v-for="(_, i) in currentLesson?.questions"
            :key="i"
            class="py-dot"
            :class="{
              'is-active': i === questionIndex && !answered,
              'is-done': i < questionIndex,
              'is-correct': i === questionIndex && answered && shuffled[selected ?? -1]?.isCorrect,
              'is-wrong': i === questionIndex && answered && !shuffled[selected ?? -1]?.isCorrect,
            }"
          />
        </div>

        <p class="py-q-num">
          Вопрос {{ questionIndex + 1 }} из {{ currentLesson?.questions.length }}
        </p>
        <h2 class="py-q-text">{{ currentQuestion?.question }}</h2>
        <p class="py-q-context">{{ currentQuestion?.context }}</p>
        <pre
          v-if="currentQuestion?.code"
          class="py-code"
        >{{ currentQuestion.code }}</pre>

        <div class="py-options">
          <button
            v-for="(opt, idx) in shuffled"
            :key="idx"
            type="button"
            class="py-option"
            :class="{
              'is-correct': answered && opt.isCorrect,
              'is-wrong': answered && idx === selected && !opt.isCorrect,
            }"
            :disabled="answered"
            @click="answer(idx)"
          >
            <span class="py-option__letter">{{ LETTERS[idx] }}</span>
            <span>{{ opt.text }}</span>
          </button>
        </div>

        <div
          v-if="answered && currentQuestion"
          class="py-feedback"
          :class="shuffled[selected ?? -1]?.isCorrect ? 'is-correct' : 'is-wrong'"
        >
          <div class="py-feedback__title">
            {{ shuffled[selected ?? -1]?.isCorrect ? 'Правильно' : 'Неправильно' }}
          </div>
          <div class="py-feedback__text">{{ currentQuestion.explanation }}</div>
          <p
            v-if="!shuffled[selected ?? -1]?.isCorrect"
            class="py-feedback__extra"
          >
            Верно:
            <strong>{{ shuffled.find((item) => item.isCorrect)?.text }}</strong>
          </p>
        </div>

        <div class="py-run-actions">
          <button
            type="button"
            class="py-btn"
            :disabled="!answered"
            @click="nextQuestion"
          >
            {{ questionIndex >= (currentLesson?.questions.length ?? 1) - 1 ? 'Итог урока' : 'Далее' }}
          </button>
          <button
            type="button"
            class="py-btn py-btn--ghost"
            @click="goHub"
          >На главную</button>
        </div>
        <p class="py-hint">Клавиши 1–5 или A–E — ответ · Enter — дальше</p>
      </div>

      <div
        class="py-view"
        :class="{ 'is-on': view === 'done' }"
      >
        <p class="py-kicker">{{ currentLesson?.kicker }}</p>
        <h3 class="py-title">{{ passed ? 'Урок освоен' : 'Урок пройден' }}</h3>
        <p class="py-lead">
          {{ currentLesson?.title }}: {{ correct }} из
          {{ currentLesson?.questions.length }} · точность {{ donePct }}%.
        </p>
        <div
          class="py-badge"
          :class="passed ? 'py-badge--ok' : 'py-badge--mid'"
        >{{ passed ? 'Хорошо' : 'Есть куда расти' }}</div>
        <div class="py-stats">
          <div class="py-stat py-stat--ok">
            <span class="py-stat__num">{{ correct }}</span>
            <span class="py-stat__label">Верно</span>
          </div>
          <div class="py-stat py-stat--bad">
            <span class="py-stat__num">{{ wrong }}</span>
            <span class="py-stat__label">Ошибки</span>
          </div>
          <div class="py-stat py-stat--accent">
            <span class="py-stat__num">{{ donePct }}%</span>
            <span class="py-stat__label">Точность</span>
          </div>
        </div>
        <p class="py-unlock">
          {{ nextLesson
            ? `Дальше: ${nextLesson.title}.`
            : `${levelMeta.label} уровень пройден. Можно повторить уроки или заглянуть в другие вкладки.` }}
        </p>
        <div class="py-actions">
          <button
            v-if="nextLesson"
            type="button"
            class="py-btn"
            @click="startLesson(lessonIndexOf(nextLesson.id))"
          >Следующий урок</button>
          <button
            type="button"
            class="py-btn py-btn--ghost"
            @click="startLesson(lessonIndexOf(currentLesson?.id ?? ''))"
          >Ещё раз</button>
          <button
            type="button"
            class="py-btn py-btn--ghost"
            @click="goHub"
          >На главную</button>
        </div>
      </div>
    </section>

    <section
      v-if="view === 'hub'"
      class="section"
      id="tips"
    >
      <h2 class="section__title">Как заниматься</h2>
      <div class="prose">
        <p>
          Повторение — мать учения. Это не экзамен: не торопитесь,
          читайте разбор и повторяйте пройденные уроки.
        </p>
        <ol>
          <li><strong>Читайте код.</strong> Если есть фрагмент — сначала он, потом варианты.</li>
          <li><strong>Смотрите разбор.</strong> Даже верный ответ стоит прочитать: там уточнение.</li>
          <li><strong>Повторяйте урок.</strong> Вопросы те же, порядок ответов каждый раз другой. Ежедневное повторение лучше закрепляет базу.</li>
        </ol>
      </div>
    </section>

    <PrivacyPolicy
      trainer="Python"
      cookie="ao-python-consent"
      storage="ao-python-v1"
      storage-note="прогресс уроков: открытые уроки, лучший счёт, текущий вопрос."
      :consent-label="consentText"
      @accept="applyConsent('accepted')"
      @decline="applyConsent('declined')"
    />
  </div>
</template>
