export type QuizView = 'hub' | 'run' | 'done'

export type QuizQuestion = {
  question: string
  context: string
  code?: string
  options: string[]
  correct: number
  explanation: string
}

export type QuizLesson = {
  id: string
  level: string
  kicker: string
  title: string
  lead: string
  questions: QuizQuestion[]
}

export type QuizLevel<L extends string = string> = {
  id: L
  label: string
  role: string
  lead: string
}

export type LessonResult = {
  best: number
  last: number
  attempts: number
}

export type ShuffledOption = {
  text: string
  isCorrect: boolean
}
