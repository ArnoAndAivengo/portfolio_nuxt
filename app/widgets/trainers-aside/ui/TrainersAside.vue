<script setup lang="ts">
import type { TrainerPage } from '~/entities/trainer'
import { javascriptLevelMeta, useJavascriptLevel } from '~/features/javascript-quiz'
import { pythonLevelMeta, usePythonLevel } from '~/features/python-quiz'
import { BugNav } from '~/shared/ui/bug-nav'
import { InterviewNav } from '~/shared/ui/interview-nav'
import { TrainerNav } from '~/shared/ui/trainer-nav'
import './trainers-aside.css'

const props = defineProps<{
  page: TrainerPage
}>()

const pythonLevel = usePythonLevel()
const javascriptLevel = useJavascriptLevel()
const interviewRelated = computed(() =>
  props.page.current === 'interviews'
  || props.page.current === 'python'
  || props.page.current === 'javascript',
)
const interviewCurrent = computed(() =>
  props.page.current === 'python' || props.page.current === 'javascript'
    ? props.page.current
    : 'interviews',
)
const bugRelated = computed(() =>
  props.page.current === 'bugs'
  || props.page.current === 'bugs-python'
  || props.page.current === 'bugs-javascript',
)
const bugCurrent = computed(() => {
  if (props.page.current === 'bugs-python') return 'python'
  if (props.page.current === 'bugs-javascript') return 'javascript'

  return 'bugs'
})
const role = computed(() => {
  if (props.page.current === 'python') return pythonLevelMeta(pythonLevel.value).role
  if (props.page.current === 'javascript') return javascriptLevelMeta(javascriptLevel.value).role

  return props.page.role
})
const lead = computed(() => {
  if (props.page.current === 'python') return pythonLevelMeta(pythonLevel.value).lead
  if (props.page.current === 'javascript') return javascriptLevelMeta(javascriptLevel.value).lead

  return props.page.lead
})
</script>

<template>
  <p
    v-if="page.name"
    class="eyebrow"
  >{{ page.eyebrow }}</p>
  <h1
    v-else
    class="eyebrow"
  >{{ page.eyebrow }}</h1>
  <h1
    v-if="page.name"
    class="name"
  >{{ page.name }}</h1>
  <p
    v-if="role"
    class="role"
    aria-live="polite"
  >{{ role }}</p>
  <p
    class="lead"
    aria-live="polite"
  >{{ lead }}</p>
  <TrainerNav :current="page.current" />
  <InterviewNav
    v-if="interviewRelated"
    :current="interviewCurrent"
  />
  <BugNav
    v-if="bugRelated"
    :current="bugCurrent"
  />
  <p
    v-if="page.tip"
    class="kt-aside-tip"
    id="kt-aside-tip"
    aria-live="polite"
  >
    <span class="kt-aside-tip__label">Совет</span>
    <span
      class="kt-aside-tip__text"
      id="kt-aside-tip-text"
    >Расслабьте руки. Напряжение замедляет ваши рефлексы.</span>
  </p>
</template>
