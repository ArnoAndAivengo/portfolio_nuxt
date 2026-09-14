<script setup lang="ts">
import { LanguageQuiz } from '~/shared/ui/language-quiz'
import { usePythonQuiz } from '../model/usePythonQuiz'

const quiz = usePythonQuiz()
</script>

<template>
  <LanguageQuiz
    trainer="Python"
    kicker="Python"
    cookie="ao-python-consent"
    storage="ao-python-v1"
    storage-note="прогресс уроков: открытые уроки, лучший счёт, текущий вопрос."
    variant="python"
    :welcome="[
      'Тренажёр Python с уровнями: базовый, средний и продвинутый. Базовый заполнен полностью — восемь уроков, в конце вопросы как на собесе.',
    ]"
    v-bind="quiz"
  />
</template>
