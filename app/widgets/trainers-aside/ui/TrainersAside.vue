<script setup lang="ts">
import type { TrainerPage } from '~/entities/trainer'
import { pythonLevelMeta, usePythonLevel } from '~/features/python-quiz/model/usePythonLevel'
import { TrainerNav } from '~/shared/ui/trainer-nav'
import './trainers-aside.css'

const props = defineProps<{
  page: TrainerPage
}>()

const pythonLevel = usePythonLevel()
const pythonMeta = computed(() => pythonLevelMeta(pythonLevel.value))
const role = computed(() => props.page.current === 'python' ? pythonMeta.value.role : props.page.role)
const lead = computed(() => props.page.current === 'python' ? pythonMeta.value.lead : props.page.lead)
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
