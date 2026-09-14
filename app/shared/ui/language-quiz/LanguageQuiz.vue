<script setup lang="ts">
import { PrivacyPolicy } from '~/shared/ui/privacy-policy'
import type { QuizLesson, QuizLevel, QuizView, LessonResult, ShuffledOption } from '~/shared/lib/language-quiz'
import type { ConsentChoice } from '~/shared/lib/consent'
import './language-quiz.css'

defineOptions({ inheritAttrs: false })

defineProps<{
  trainer: string
  kicker: string
  cookie: string
  storage: string
  storageNote: string
  variant: string
  welcome: string[]
  levels: readonly QuizLevel[]
  letters: readonly string[]
  consent: ConsentChoice
  consentText: string
  view: QuizView
  level: string
  lessonsInLevel: QuizLesson[]
  levelMeta: QuizLevel | undefined
  completedCount: number
  bestScore: string
  progressPct: number
  barPct: number
  currentLesson: QuizLesson | undefined
  currentQuestion: QuizLesson['questions'][number] | undefined
  shuffled: ShuffledOption[]
  selected: number | null
  answered: boolean
  correct: number
  wrong: number
  donePct: number
  passed: boolean
  nextLesson: QuizLesson | undefined
  results: Record<string, LessonResult>
  applyConsent: (choice: Exclude<ConsentChoice, ''>) => void
  setLevel: (id: string) => void
  startLesson: (index: number) => void
  answer: (index: number) => void
  nextQuestion: () => void
  goHub: () => void
  resetProgress: () => void
  lessonIndexOf: (id: string) => number
  statusOf: (id: string, total: number) => string
  questionIndex: number
}>()
</script>

<template>
  <div
    class="py-page"
    :class="[
      consent ? 'py-has-consent' : 'py-needs-consent',
      `py-page--${variant}`,
    ]"
  >
    <div
      class="py-progress"
      :style="{ width: `${barPct}%` }"
    />

    <section
      class="section py-welcome"
      id="welcome"
    >
      <p class="py-kicker">{{ kicker }}</p>
      <div class="prose">
        <p
          v-for="(paragraph, index) in welcome"
          :key="index"
        >{{ paragraph }}</p>
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
            v-for="item in levels"
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
            ? `${lessonsInLevel.length ? lessonsInLevel.length : 'Восемь'} уроков базового уровня, в конце вопросы как на собесе.`
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
              Уроки уровня «{{ levelMeta?.label }}» появятся позже.
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
            <span class="py-option__letter">{{ letters[idx] }}</span>
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
          >К урокам</button>
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
            : `${levelMeta?.label} уровень пройден. Можно повторить уроки или заглянуть в другие вкладки.` }}
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
          >К урокам</button>
        </div>
      </div>
    </section>

    <PrivacyPolicy
      :trainer="trainer"
      :cookie="cookie"
      :storage="storage"
      :storage-note="storageNote"
      :consent-label="consentText"
      @accept="applyConsent('accepted')"
      @decline="applyConsent('declined')"
    />
  </div>
</template>
