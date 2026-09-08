<script setup lang="ts">
import { consentLabel, readConsent } from '~/shared/lib/consent'
import { PrivacyPolicy } from '~/shared/ui/privacy-policy'
import { mountTouchType } from '../model/engine'
import './touch-type.css'

const root = ref<HTMLElement | null>(null)
const ready = ref(false)
const consentText = ref(consentLabel(''))
let handle: { unmount: () => void, applyConsent: (choice: string) => void } | undefined

onMounted(() => {
  if (!root.value) return
  handle = mountTouchType(root.value, {
    onConsentReady: () => {
      ready.value = true
    },
  })
  consentText.value = consentLabel(readConsent('ao-typing-consent'))
})

onUnmounted(() => {
  handle?.unmount()
  document.body.classList.remove('is-kt-run')
})

const onAccept = () => {
  handle?.applyConsent('accepted')
  consentText.value = consentLabel('accepted')
}

const onDecline = () => {
  handle?.applyConsent('declined')
  consentText.value = consentLabel('declined')
}
</script>

<template>
  <div
    ref="root"
    class="kt-page"
    :class="ready ? 'kt-has-consent' : 'kt-needs-consent'"
  >
    <section
      class="section kt-welcome"
      id="welcome"
    >
      <p class="kt-kicker">Touch Type</p>
      <div class="prose">
        <p>
          Тренажёр слепой печати на английском QWERTY:
          уроки по клавишам, разбор ошибок и практика.
        </p>
        <p>
          Сначала нужно принять или отклонить cookies.
          Если примете — прогресс сохранится в браузере.
          Если отклоните — тренироваться можно, но прогресс не запомнится.
        </p>
      </div>
    </section>

    <section
      class="section"
      id="hub"
      data-section="hub"
    >
      <div class="kt">
        <div
          class="kt-view is-on"
          data-kt-view="hub"
        >
          <p class="kt-kicker">Touch Type · English</p>

          <div class="kt-meta">
            <span>Освоено: <strong id="kt-progress-keys">0 / 30</strong></span>
            <span>Прогресс: <strong id="kt-progress-pct">0%</strong></span>
            <span>Уроков: <strong id="kt-lessons">0</strong></span>
            <span>Лучший WPM: <strong id="kt-best-wpm">0</strong></span>
          </div>

          <div class="kt-actions">
            <button
              type="button"
              class="kt-btn"
              id="kt-start"
            >Начать урок</button>
            <button
              type="button"
              class="kt-btn kt-btn--ghost"
              id="kt-infinite"
            >Практика</button>
            <button
              type="button"
              class="kt-btn kt-btn--ghost"
              id="kt-weak"
              disabled
            >Слабые</button>
            <button
              type="button"
              class="kt-btn kt-btn--ghost"
              id="kt-review"
              disabled
            >Повторить</button>
            <button
              type="button"
              class="kt-btn kt-btn--ghost"
              id="kt-reset"
            >Сбросить</button>
          </div>

          <p class="kt-hint">
            Сейчас в уроке: <strong id="kt-lesson-keys">F J</strong>
            <span id="kt-text-mode" />
          </p>
          <p
            class="kt-path"
            id="kt-next-hint"
          >Дальше: D K · оба средних. Откроется при точности от 92%.</p>
          <p
            class="kt-review-note"
            id="kt-review-hint"
            hidden
          />
          <div
            class="kt-kb"
            id="kt-hub-kb"
            aria-label="Клавиатура QWERTY"
          />
          <ul class="kt-legend">
            <li><span class="kt-dot kt-dot--learning" />Изучаем</li>
            <li><span class="kt-dot kt-dot--mastered" />Освоены</li>
            <li><span class="kt-dot kt-dot--review" />Повторить</li>
            <li><span class="kt-dot kt-dot--weak" />Слабые</li>
          </ul>
        </div>

        <div
          class="kt-view"
          data-kt-view="run"
          id="run"
        >
          <div
            class="kt-run"
            id="kt-run"
          >
            <p
              class="kt-kicker"
              id="kt-mode-label"
            >Урок</p>
            <div class="kt-stats">
              <div class="kt-stat">
                <span class="kt-stat__label">WPM</span>
                <span
                  class="kt-stat__value"
                  id="kt-wpm"
                >0</span>
              </div>
              <div class="kt-stat">
                <span class="kt-stat__label">Точность</span>
                <span
                  class="kt-stat__value"
                  id="kt-acc"
                >100%</span>
              </div>
              <div class="kt-stat">
                <span class="kt-stat__label">Верно</span>
                <span
                  class="kt-stat__value"
                  id="kt-hits"
                >0</span>
              </div>
              <div class="kt-stat">
                <span class="kt-stat__label">Ошибки</span>
                <span
                  class="kt-stat__value"
                  id="kt-miss"
                >0</span>
              </div>
            </div>
            <div
              class="kt-progress"
              aria-hidden="true"
            ><span id="kt-bar" /></div>

            <div class="kt-glyph-wrap">
              <div
                class="kt-glyph"
                id="kt-glyph"
                aria-live="polite"
              >F</div>
              <p
                class="kt-finger"
                id="kt-finger"
              >Левый указательный</p>
            </div>

            <p
              class="kt-layout"
              id="kt-layout"
            >Похоже, включена русская раскладка. Переключитесь на English (US).</p>
            <p
              class="kt-layout kt-layout--caps"
              id="kt-caps"
            >Включён Caps Lock. Выключите его — печатаем строчными.</p>

            <div
              class="kt-text"
              id="kt-text"
            >
              <input
                class="kt-capture"
                id="kt-capture"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                aria-label="Поле ввода для урока"
              >
              <div
                class="kt-chars"
                id="kt-chars"
              />
            </div>

            <div
              class="kt-kb"
              id="kt-run-kb"
              aria-hidden="true"
            />
            <div class="kt-run-actions">
              <button
                type="button"
                class="kt-btn kt-btn--ghost"
                id="kt-stop"
              >Завершить · Esc</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="section kt-tips"
      id="tips"
      data-section="tips"
    >
      <h2 class="section__title">Как печатать</h2>
      <div class="prose">
        <p>
          Цель не скорость, а мышечная память. Смотрите на строку,
          а не на клавиатуру — подсветка подскажет палец и клавишу.
        </p>
        <ol>
          <li><strong>F и J.</strong> Указательные пальцы на бугорках, остальные — на домашнем ряду ASDF JKL;.</li>
          <li><strong>Не подглядывать.</strong> Ошибка не двигает курсор: нажмите правильную клавишу и идите дальше.</li>
          <li><strong>Сначала точность.</strong> Новые буквы открываются, когда текущие стабильно выше ~92%.</li>
          <li><strong>Раскладка English (US).</strong> Печатаем строчные английские буквы; пробел — большими пальцами.</li>
        </ol>
      </div>
    </section>

    <PrivacyPolicy
      trainer="Touch Type"
      cookie="ao-typing-consent"
      storage="ao-typing-v1"
      storage-note="прогресс уроков: открытые клавиши, точность по клавишам, число уроков, лучший WPM."
      :consent-label="consentText"
      @accept="onAccept"
      @decline="onDecline"
    />

    <dialog
      class="kt-modal"
      id="kt-modal"
      aria-labelledby="kt-modal-title"
    >
      <p
        class="kt-kicker"
        id="kt-modal-kicker"
      >Урок</p>
      <h3
        class="kt-title"
        id="kt-modal-title"
        tabindex="-1"
      >Готово</h3>
      <p
        class="kt-modal__lead"
        id="kt-modal-lead"
      />
      <div
        class="kt-result__grid"
        id="kt-modal-stats"
      />
      <p
        class="kt-modal__errors"
        id="kt-modal-errors"
        hidden
      />
      <p
        class="kt-unlock"
        id="kt-modal-unlock"
        hidden
      />
      <div class="kt-actions">
        <button
          type="button"
          class="kt-btn"
          id="kt-modal-next"
        >Продолжить</button>
        <button
          type="button"
          class="kt-btn kt-btn--ghost"
          id="kt-modal-weak"
          hidden
        >Слабые</button>
        <button
          type="button"
          class="kt-btn kt-btn--ghost"
          id="kt-modal-hub"
        >На главную</button>
      </div>
      <p class="kt-hint">Enter — дальше · Esc — выход</p>
    </dialog>
  </div>
</template>
