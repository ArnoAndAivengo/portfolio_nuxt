import { BUG_LEVEL_NAMES, BUG_LEVELS, type BugItem, type BugLevel } from './bugs'

const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const
const TIMER_SEC = 30

type Options = {
  bugs: BugItem[]
  storage: string
}

type ShuffledOption = {
  text: string
  isCorrect: boolean
}

type DotState = 'idle' | 'active' | 'correct' | 'wrong'

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

const shuffleOptions = (bug: BugItem): ShuffledOption[] =>
  shuffle(bug.options.map((text, index) => ({
    text,
    isCorrect: index === bug.correct,
  })))

export const useBugHunter = (options: Options) => {
  const { bugs, storage } = options
  const bugsForLevel = (level: BugLevel) => bugs.filter((item) => item.level === level)
  const bugsTotal = bugs.length
  const isBugLevel = (value: unknown): value is BugLevel =>
    BUG_LEVELS.some((level) => level === value)
  const reducedMotion = () =>
    import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const currentLevel = ref<BugLevel>('junior')
  const currentIndex = ref(0)
  const score = ref(0)
  const bugsFound = ref(0)
  const streak = ref(0)
  const maxStreak = ref(0)
  const totalBugs = ref(0)
  const correctCount = ref(0)
  const wrongCount = ref(0)
  const answered = ref(false)
  const finished = ref(false)
  const timedOut = ref(false)
  const timer = ref(TIMER_SEC)
  const selected = ref<number | null>(null)
  const list = ref<BugItem[]>([])
  const shuffled = ref<ShuffledOption[]>([])
  const dots = ref<DotState[]>([])
  let timerId: number | null = null

  const currentBug = computed(() => list.value[currentIndex.value])
  const codeLines = computed(() => currentBug.value?.code.split('\n') ?? [])
  const levelName = computed(() => BUG_LEVEL_NAMES[currentLevel.value])
  const timerPct = computed(() => (timer.value / TIMER_SEC) * 100)
  const timerTone = computed(() =>
    timer.value < 10 ? 'critical' : timer.value < 20 ? 'danger' : 'ok',
  )
  const progressPct = computed(() => {
    if (finished.value) return 100

    return bugsTotal ? Math.min(100, (totalBugs.value / bugsTotal) * 100) : 0
  })
  const bonus = computed(() => Math.max(1, Math.floor(timer.value / 5)))
  const result = computed(() => {
    const total = correctCount.value + wrongCount.value || 1
    const percent = Math.round((correctCount.value / total) * 100)
    let rank: BugLevel = 'junior'
    if (percent >= 85 && correctCount.value >= 10) rank = 'expert'
    else if (percent >= 60 && correctCount.value >= 6) rank = 'senior'
    else if (percent >= 40) rank = 'middle'
    const advice = percent >= 85
      ? 'Ты настоящий охотник за багами. Навыки код-ревью на высоком уровне.'
      : percent >= 60
        ? 'Отличный результат. Продолжай практиковаться — до эксперта рукой подать.'
        : 'Не сдавайся. Каждый баг — это урок. Тренируйся и станешь мастером.'

    return { total, percent, rank, advice, rankLabel: BUG_LEVEL_NAMES[rank] }
  })

  const stopTimer = () => {
    if (timerId != null) {
      window.clearInterval(timerId)
      timerId = null
    }
  }

  const persist = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(storage, JSON.stringify({
        currentLevel: currentLevel.value,
        currentIndex: currentIndex.value,
        score: score.value,
        bugsFound: bugsFound.value,
        streak: streak.value,
        maxStreak: maxStreak.value,
        totalBugs: totalBugs.value,
        correctCount: correctCount.value,
        wrongCount: wrongCount.value,
        finished: finished.value,
      }))
    } catch {
      /* ignore */
    }
  }

  const prepareBug = () => {
    const bug = list.value[currentIndex.value]
    if (!bug) return
    shuffled.value = shuffleOptions(bug)
    selected.value = null
    answered.value = false
    timedOut.value = false
    timer.value = TIMER_SEC
    dots.value = list.value.map((_, index) => {
      if (index === currentIndex.value) return 'active'
      const prev = dots.value[index]
      if (index < currentIndex.value && (prev === 'correct' || prev === 'wrong')) return prev

      return 'idle'
    })
  }

  const startTimer = () => {
    stopTimer()
    if (!import.meta.client || finished.value) return
    timer.value = TIMER_SEC
    timerId = window.setInterval(() => {
      timer.value -= 1
      if (timer.value > 0) return
      stopTimer()
      if (!answered.value) autoReveal()
    }, 1000)
  }

  const startLevel = (level: BugLevel) => {
    currentLevel.value = level
    list.value = shuffle(bugsForLevel(level))
    currentIndex.value = 0
    dots.value = list.value.map((_, i) => i === 0 ? 'active' : 'idle')
    if (!list.value.length) {
      showFinal()
      return
    }
    prepareBug()
    startTimer()
  }

  const showFinal = () => {
    stopTimer()
    finished.value = true
    persist()
  }

  const markDot = (ok: boolean) => {
    const nextDots = dots.value.slice()
    nextDots[currentIndex.value] = ok ? 'correct' : 'wrong'
    dots.value = nextDots
  }

  const autoReveal = () => {
    if (answered.value) return
    answered.value = true
    timedOut.value = true
    selected.value = null
    streak.value = 0
    wrongCount.value += 1
    totalBugs.value += 1
    markDot(false)
    persist()
  }

  const answer = (index: number) => {
    if (answered.value) return
    const option = shuffled.value[index]
    if (!option) return
    stopTimer()
    answered.value = true
    selected.value = index
    timedOut.value = false
    if (option.isCorrect) {
      score.value += 10 + bonus.value
      bugsFound.value += 1
      streak.value += 1
      correctCount.value += 1
      if (streak.value > maxStreak.value) maxStreak.value = streak.value
    } else {
      streak.value = 0
      wrongCount.value += 1
    }
    totalBugs.value += 1
    markDot(option.isCorrect)
    persist()
  }

  const nextBug = () => {
    if (!answered.value) return
    const nextIndex = currentIndex.value + 1
    if (nextIndex >= list.value.length) {
      const levelPos = BUG_LEVELS.indexOf(currentLevel.value)
      const nextLevel = BUG_LEVELS[levelPos + 1]
      if (nextLevel) startLevel(nextLevel)
      else showFinal()
    } else {
      currentIndex.value = nextIndex
      prepareBug()
      startTimer()
    }
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
  }

  const reset = () => {
    stopTimer()
    score.value = 0
    bugsFound.value = 0
    streak.value = 0
    maxStreak.value = 0
    totalBugs.value = 0
    correctCount.value = 0
    wrongCount.value = 0
    answered.value = false
    finished.value = false
    timedOut.value = false
    selected.value = null
    try {
      localStorage.removeItem(storage)
    } catch {
      /* ignore */
    }
    startLevel('junior')
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
  }

  const restore = () => {
    try {
      const raw = localStorage.getItem(storage)
      if (!raw) return false
      const data = JSON.parse(raw) as Record<string, unknown>
      if (!data || typeof data !== 'object') return false
      finished.value = Boolean(data.finished)
      score.value = Number(data.score) || 0
      bugsFound.value = Number(data.bugsFound) || 0
      streak.value = Number(data.streak) || 0
      maxStreak.value = Number(data.maxStreak) || 0
      totalBugs.value = Number(data.totalBugs) || 0
      correctCount.value = Number(data.correctCount) || 0
      wrongCount.value = Number(data.wrongCount) || 0
      const savedLevel = data.currentLevel
      currentLevel.value = isBugLevel(savedLevel) ? savedLevel : 'junior'
      if (finished.value) return true
      startLevel(currentLevel.value)
      const savedIndex = Number(data.currentIndex) || 0
      if (savedIndex > 0 && savedIndex < list.value.length) {
        currentIndex.value = savedIndex
        prepareBug()
        startTimer()
      }
      return true
    } catch {
      return false
    }
  }

  const onKey = (event: KeyboardEvent) => {
    const target = event.target
    if (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"]')) return
    if (event.key === 'Enter' && answered.value && !finished.value) {
      if (target instanceof HTMLElement && target.closest('button, a')) return
      event.preventDefault()
      nextBug()
      return
    }
    if (event.key === 'r' || event.key === 'R') {
      if (target instanceof HTMLElement && target.closest('button, a')) return
      reset()
      return
    }
    if (answered.value || finished.value) return
    const letter = event.key.toUpperCase()
    const fromLetter = LETTERS.findIndex((item) => item === letter)
    const fromDigit = Number.parseInt(event.key, 10) - 1
    const idx = fromLetter >= 0 ? fromLetter : fromDigit
    if (idx >= 0 && idx < shuffled.value.length) answer(idx)
  }

  onMounted(() => {
    if (!restore()) startLevel('junior')
    document.addEventListener('keydown', onKey)
  })

  onUnmounted(() => {
    stopTimer()
    document.removeEventListener('keydown', onKey)
  })

  return {
    LETTERS,
    currentBug,
    codeLines,
    levelName,
    currentIndex,
    list,
    shuffled,
    dots,
    answered,
    timedOut,
    selected,
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
    optionClass: (index: number) => {
      if (!answered.value) return ''
      const option = shuffled.value[index]
      if (option?.isCorrect) return 'is-correct'
      if (selected.value === index) return 'is-wrong'

      return ''
    },
    feedbackTitle: computed(() => {
      if (timedOut.value) return 'Время вышло'
      const option = selected.value != null ? shuffled.value[selected.value] : undefined

      return option?.isCorrect ? 'Баг найден' : 'Не тот баг'
    }),
    feedbackOk: computed(() => {
      if (timedOut.value) return false
      const option = selected.value != null ? shuffled.value[selected.value] : undefined

      return Boolean(option?.isCorrect)
    }),
  }
}
