import { consentLabel, readConsent, writeConsent, type ConsentChoice } from '~/shared/lib/consent'
import { LESSONS, LEVELS, type PythonLevelId } from './lessons'
import { usePythonLevel } from './usePythonLevel'

export type QuizView = 'hub' | 'run' | 'done'

type LessonResult = {
  best: number
  last: number
  attempts: number
}

type ShuffledOption = {
  text: string
  isCorrect: boolean
}

const STORAGE = 'ao-python-v1'
const COOKIE = 'ao-python-consent'
const PASS_PCT = 80
const LETTERS = ['A', 'B', 'C', 'D', 'E']

const shuffle = <T>(arr: T[]) => {
  const copy = arr.slice()

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const left = copy[i]
    const right = copy[j]
    if (left === undefined || right === undefined) continue
    copy[i] = right
    copy[j] = left
  }

  return copy
}

const isLevelId = (value: unknown): value is PythonLevelId =>
  LEVELS.some((item) => item.id === value)

export const usePythonQuiz = () => {
  const consent = ref<ConsentChoice>('')
  const view = ref<QuizView>('hub')
  const level = usePythonLevel()
  const lessonIndex = ref(0)
  const questionIndex = ref(0)
  const correct = ref(0)
  const wrong = ref(0)
  const answered = ref(false)
  const results = ref<Record<string, LessonResult>>({})
  const shuffled = ref<ShuffledOption[]>([])
  const selected = ref<number | null>(null)

  const currentLesson = computed(() => LESSONS[lessonIndex.value])
  const currentQuestion = computed(() => currentLesson.value?.questions[questionIndex.value])
  const lessonsInLevel = computed(() => LESSONS.filter((item) => item.level === level.value))
  const levelMeta = computed(() => LEVELS.find((item) => item.id === level.value) ?? LEVELS[0])
  const completedCount = computed(() =>
    lessonsInLevel.value.filter((item) => results.value[item.id]).length,
  )
  const bestScore = computed(() => {
    let sum = 0
    let max = 0

    lessonsInLevel.value.forEach((lesson) => {
      const rec = results.value[lesson.id]
      if (!rec) return
      sum += rec.best
      max += lesson.questions.length
    })

    return max ? `${sum} / ${max}` : '—'
  })
  const progressPct = computed(() => {
    const total = lessonsInLevel.value.length

    return total ? Math.round((completedCount.value / total) * 100) : 0
  })
  const barPct = computed(() => {
    const total = lessonsInLevel.value.reduce((n, lesson) => n + lesson.questions.length, 0)
    if (!total) return 0

    let done = 0
    lessonsInLevel.value.forEach((lesson) => {
      if (results.value[lesson.id]) done += lesson.questions.length
    })
    if (view.value === 'run' && currentLesson.value?.level === level.value) {
      done += correct.value + wrong.value
    }
    if (view.value === 'done' && currentLesson.value?.level === level.value && !results.value[currentLesson.value.id]) {
      done += currentLesson.value.questions.length
    }

    return Math.min(100, Math.round((done / total) * 100))
  })
  const donePct = computed(() => {
    const total = currentLesson.value?.questions.length || 1

    return Math.round((correct.value / total) * 100)
  })
  const passed = computed(() => donePct.value >= PASS_PCT)
  const nextLesson = computed(() => {
    const list = lessonsInLevel.value
    const pos = list.findIndex((item) => item.id === currentLesson.value?.id)

    return pos >= 0 ? list[pos + 1] : undefined
  })

  const persist = () => {
    if (consent.value !== 'accepted') return

    try {
      localStorage.setItem(STORAGE, JSON.stringify({
        level: level.value,
        results: results.value,
        view: view.value === 'run' ? 'run' : 'hub',
        lessonIndex: lessonIndex.value,
        questionIndex: answered.value ? questionIndex.value + 1 : questionIndex.value,
        correct: correct.value,
        wrong: wrong.value,
      }))
    } catch {
      /* ignore */
    }
  }

  const restore = () => {
    if (consent.value !== 'accepted') return

    try {
      const raw = localStorage.getItem(STORAGE)
      if (!raw) return
      const data = JSON.parse(raw)
      if (!data || typeof data !== 'object') return
      if (isLevelId(data.level)) level.value = data.level
      results.value = data.results && typeof data.results === 'object' ? data.results : {}
      if (data.view === 'run' && data.lessonIndex != null) {
        const idx = Number(data.lessonIndex) || 0
        const lesson = LESSONS[idx]
        const qIndex = Number(data.questionIndex) || 0
        if (lesson && qIndex < lesson.questions.length) {
          lessonIndex.value = idx
          if (isLevelId(lesson.level)) level.value = lesson.level
          questionIndex.value = qIndex
          correct.value = Number(data.correct) || 0
          wrong.value = Number(data.wrong) || 0
          view.value = 'run'
          prepareQuestion()
          return
        }
      }
      view.value = 'hub'
    } catch {
      /* ignore */
    }
  }

  const prepareQuestion = () => {
    const q = currentQuestion.value
    if (!q) return
    shuffled.value = shuffle(q.options.map((text, i) => ({ text, isCorrect: i === q.correct })))
    selected.value = null
    answered.value = false
  }

  const startLesson = (index: number) => {
    const lesson = LESSONS[index]
    if (!lesson) return
    lessonIndex.value = index
    if (isLevelId(lesson.level)) level.value = lesson.level
    questionIndex.value = 0
    correct.value = 0
    wrong.value = 0
    view.value = 'run'
    prepareQuestion()
    persist()
  }

  const answer = (index: number) => {
    if (answered.value) return
    answered.value = true
    selected.value = index
    if (shuffled.value[index]?.isCorrect) correct.value += 1
    else wrong.value += 1
    persist()
  }

  const nextQuestion = () => {
    if (!answered.value) return
    questionIndex.value += 1
    if (questionIndex.value >= (currentLesson.value?.questions.length || 0)) {
      showDone()
      return
    }
    prepareQuestion()
    persist()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showDone = () => {
    const lesson = currentLesson.value
    if (!lesson) return
    const rec = results.value[lesson.id] || { best: 0, last: 0, attempts: 0 }
    rec.last = correct.value
    rec.best = Math.max(rec.best, correct.value)
    rec.attempts += 1
    results.value = { ...results.value, [lesson.id]: rec }
    if (isLevelId(lesson.level)) level.value = lesson.level
    view.value = 'done'
    persist()
  }

  const goHub = () => {
    view.value = 'hub'
    persist()
  }

  const setLevel = (id: PythonLevelId) => {
    if (level.value === id) return
    level.value = id
    goHub()
  }

  const applyConsent = (choice: Exclude<ConsentChoice, ''>) => {
    writeConsent(COOKIE, choice)
    consent.value = choice
    if (choice === 'accepted') {
      restore()
      persist()
    } else {
      try {
        localStorage.removeItem(STORAGE)
      } catch {
        /* ignore */
      }
      results.value = {}
      level.value = 'basic'
      view.value = 'hub'
    }
  }

  const resetProgress = () => {
    if (!window.confirm('Сбросить прогресс Python-тренажёра?')) return
    results.value = {}
    view.value = 'hub'
    lessonIndex.value = 0
    questionIndex.value = 0
    correct.value = 0
    wrong.value = 0
    answered.value = false
    if (consent.value === 'accepted') {
      try {
        localStorage.removeItem(STORAGE)
      } catch {
        /* ignore */
      }
    }
  }

  const onKey = (event: KeyboardEvent) => {
    if (view.value !== 'run') return
    if (event.key === 'Enter' && answered.value) {
      event.preventDefault()
      nextQuestion()
      return
    }
    if (answered.value) return
    const letter = event.key.toUpperCase()
    const fromLetter = LETTERS.indexOf(letter)
    const fromDigit = parseInt(event.key, 10) - 1
    const idx = fromLetter >= 0 ? fromLetter : fromDigit
    if (idx >= 0 && idx < shuffled.value.length) answer(idx)
  }

  onMounted(() => {
    consent.value = readConsent(COOKIE)
    if (consent.value === 'accepted') restore()
    else if (consent.value === 'declined') view.value = 'hub'
    document.addEventListener('keydown', onKey)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKey)
  })

  return {
    LEVELS,
    LETTERS,
    consent,
    consentText: computed(() => consentLabel(consent.value)),
    gated: computed(() => !consent.value),
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
    questionIndex,
    lessonIndexOf: (id: string) => LESSONS.findIndex((item) => item.id === id),
    statusOf: (id: string, total: number) => {
      const rec = results.value[id]

      return rec ? `Лучший результат: ${rec.best} из ${total}` : 'Не начат'
    },
  }
}
