<script setup lang="ts">
import './privacy-policy.css'

withDefaults(defineProps<{
  trainer: string
  cookie: string
  storage: string
  storageNote: string
  consentLabel: string
  updated?: string
}>(), {
  updated: '',
})

const emit = defineEmits<{
  accept: []
  decline: []
}>()
</script>

<template>
  <section
    class="section trainer-privacy"
    id="privacy"
    data-section="privacy"
  >
    <h2 class="section__title">Политика конфиденциальности</h2>
    <div class="prose">
      <p>
        Эта политика относится только к странице тренажёра
        <strong>{{ trainer }}</strong> на arnoandaivengo.ru.
        Другие разделы сайта она не покрывает.
      </p>
      <p>
        <strong>Что хранится.</strong>
        На странице нет аналитики, рекламы и сторонних счётчиков.
        Если вы принимаете cookies, в браузере сохраняются:
      </p>
      <ul>
        <li>cookie <code>{{ cookie }}</code> — ваш выбор (принять / отклонить), на 12 месяцев;</li>
        <li>localStorage <code>{{ storage }}</code> — {{ storageNote }}</li>
      </ul>
      <p>
        <strong>Если отклонить.</strong>
        Тренажёр работает как обычно, но прогресс не записывается
        и пропадает после закрытия вкладки. Уже сохранённый прогресс
        при отклонении удаляется.
      </p>
      <p>
        Данные не передаются на сервер и не продаются третьим лицам.
        Выбор можно изменить ниже в любой момент.
      </p>
      <div class="trainer-privacy__actions">
        <button
          type="button"
          class="trainer-privacy__btn"
          @click="emit('accept')"
        >Принять cookies</button>
        <button
          type="button"
          class="trainer-privacy__btn trainer-privacy__btn--ghost"
          @click="emit('decline')"
        >Отклонить</button>
      </div>
    </div>
  </section>
</template>
