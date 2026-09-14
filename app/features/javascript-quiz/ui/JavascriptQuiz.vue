<script setup lang="ts">
import { LanguageQuiz } from '~/shared/ui/language-quiz'
import { useJavascriptQuiz } from '../model/useJavascriptQuiz'

const quiz = useJavascriptQuiz()
</script>

<template>
  <LanguageQuiz
    trainer="JavaScript"
    kicker="JavaScript"
    cookie="ao-javascript-consent"
    storage="ao-javascript-v1"
    storage-note="прогресс уроков: открытые уроки, лучший счёт, текущий вопрос."
    variant="javascript"
    :welcome="[
      'Тренажёр JavaScript с уровнями: базовый, средний и продвинутый. Базовый заполнен — восемь уроков, в конце вопросы как на собесе.',
    ]"
    v-bind="quiz"
  />
</template>
