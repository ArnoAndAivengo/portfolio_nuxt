export const BUG_LEVELS = ['junior', 'middle', 'senior', 'expert'] as const

export type BugLevel = (typeof BUG_LEVELS)[number]

export type BugItem = {
  level: BugLevel
  code: string
  hint: string
  options: string[]
  correct: number
  explanation: string
}

export const BUG_LEVEL_NAMES: Record<BugLevel, string> = {
  junior: 'Junior',
  middle: 'Middle',
  senior: 'Senior',
  expert: 'Expert',
}
