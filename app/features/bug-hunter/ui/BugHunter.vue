<script setup lang="ts">
import '~/shared/ui/language-quiz/language-quiz.css'
import { JsRequiredNotice } from '~/shared/ui/js-required'
import type { BugItem } from '../model/bugs'
import { useBugHunter } from '../model/useBugHunter'
import './bug-hunter.css'

const props = defineProps<{
  trainer: string
  bugs: BugItem[]
  storage: string
}>()

const {
  LETTERS,
  currentBug,
  levelName,
  currentIndex,
  list,
  shuffled,
  dots,
  answered,
  finished,
  timerPct,
  timerTone,
  score,
  bugsFound,
  streak,
  correctCount,
  wrongCount,
  maxStreak,
  progressPct,
  bonus,
  result,
  answer,
  nextBug,
  reset,
  optionClass,
  feedbackTitle,
  feedbackOk,
} = useBugHunter({
  bugs: props.bugs,
  storage: props.storage,
})

const variant = computed(() =>
  props.trainer === 'JavaScript' ? 'javascript' : 'python',
)
</script>

<template>
  <div
    class="py-page bh-page"
    :class="`py-page--${variant}`"
  >
    <div
      class="py-progress"
      :style="{ width: `${progressPct}%` }"
      aria-hidden="true"
    />

    <section
      class="section"
      id="bughunter"
    >
      <div class="py-view is-on">
        <JsRequiredNotice />

        <div
          v-if="!finished"
          class="py-header js-only"
        >
          <div>
            <span class="py-badge">{{ levelName }}</span>
          </div>
          <div
            class="py-score"
            aria-label="Счёт"
          >
            <span>Найдено <strong>{{ bugsFound }}</strong></span>
            <span>Очки <strong>{{ score }}</strong></span>
            <span>Серия <strong>{{ streak }}</strong></span>
          </div>
        </div>

        <template v-if="!finished && currentBug">
          <div
            class="bh-timer"
            aria-hidden="true"
          >
            <div
              class="bh-timer__fill"
              :class="{
                'is-danger': timerTone === 'danger',
                'is-critical': timerTone === 'critical',
              }"
              :style="{ width: `${timerPct}%` }"
            />
          </div>

          <div
            class="py-dots"
            aria-hidden="true"
          >
            <div
              v-for="(dot, index) in dots"
              :key="index"
              class="py-dot"
              :class="{
                'is-active': dot === 'active',
                'is-correct': dot === 'correct',
                'is-wrong': dot === 'wrong',
              }"
            />
          </div>

          <p class="py-q-num">
            Баг {{ currentIndex + 1 }} из {{ list.length }} · {{ levelName }}
          </p>
          <h2 class="py-q-text">Что не так в этом коде?</h2>
          <p class="py-q-context">{{ currentBug.hint }}</p>
          <pre class="py-code">{{ currentBug.code }}</pre>

          <div class="py-options">
            <button
              v-for="(option, index) in shuffled"
              :key="`${currentIndex}-${index}`"
              type="button"
              class="py-option"
              :class="optionClass(index)"
              :disabled="answered"
              @click="answer(index)"
            >
              <span class="py-option__letter">{{ LETTERS[index] }}</span>
              <span>{{ option.text }}</span>
            </button>
          </div>

          <div
            v-if="answered"
            class="py-feedback"
            :class="feedbackOk ? 'is-correct' : 'is-wrong'"
          >
            <div class="py-feedback__title">{{ feedbackTitle }}</div>
            <div class="py-feedback__text">{{ currentBug.explanation }}</div>
            <p
              v-if="feedbackOk"
              class="py-feedback__extra"
            >+{{ bonus }} бонусных очков</p>
            <p
              v-else
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
              @click="nextBug"
            >Далее</button>
            <button
              type="button"
              class="py-btn py-btn--ghost"
              @click="reset"
            >Заново</button>
          </div>
          <p class="py-hint">Клавиши 1–5 или A–E — ответ · Enter — дальше · R — заново</p>
        </template>

        <p
          v-else-if="!finished"
          class="py-q-text js-only"
        >Загрузка...</p>

        <template v-else>
          <p class="py-kicker">Поиск багов · {{ trainer }}</p>
          <h3 class="py-title">Поиск завершён</h3>
          <p class="py-lead">
            Найдено {{ bugsFound }} из {{ correctCount + wrongCount }} ·
            точность {{ result.percent }}%.
          </p>
          <div
            class="py-badge"
            :class="result.percent >= 60 ? 'py-badge--ok' : 'py-badge--mid'"
          >{{ result.rankLabel }}</div>
          <div class="py-stats bh-stats">
            <div class="py-stat py-stat--ok">
              <span class="py-stat__num">{{ correctCount }}</span>
              <span class="py-stat__label">Найдено</span>
            </div>
            <div class="py-stat py-stat--bad">
              <span class="py-stat__num">{{ wrongCount }}</span>
              <span class="py-stat__label">Промахи</span>
            </div>
            <div class="py-stat py-stat--accent">
              <span class="py-stat__num">{{ result.percent }}%</span>
              <span class="py-stat__label">Точность</span>
            </div>
            <div class="py-stat">
              <span class="py-stat__num">{{ maxStreak }}</span>
              <span class="py-stat__label">Макс. серия</span>
            </div>
          </div>
          <p class="py-unlock">{{ result.advice }}</p>
          <div class="py-actions">
            <button
              type="button"
              class="py-btn"
              @click="reset"
            >Пройти заново</button>
            <NuxtLink
              class="py-btn py-btn--ghost"
              to="/trainers/bugs"
            >К языкам</NuxtLink>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>
