const STORAGE = 'ao-motivation-story'
const ANIM_MS = 500

const reducedMotion = () =>
  import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const useMotivationStory = (total: number) => {
  const current = ref(0)
  const animating = ref(false)

  const progressPct = computed(() => total ? ((current.value + 1) / total) * 100 : 0)
  const counter = computed(() => `${current.value + 1} / ${total}`)

  const persist = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE, String(current.value))
    } catch {
      /* ignore */
    }
  }

  const show = (index: number, instant = false) => {
    if (animating.value && !instant) return
    const next = Math.min(Math.max(index, 0), Math.max(total - 1, 0))
    if (!instant) {
      animating.value = true
      window.setTimeout(() => {
        animating.value = false
      }, reducedMotion() ? 0 : ANIM_MS)
      window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
    current.value = next
    persist()
  }

  const nextSlide = () => {
    if (current.value < total - 1) show(current.value + 1)
  }

  const prevSlide = () => {
    if (current.value > 0) show(current.value - 1)
  }

  const restart = () => {
    if (animating.value) return
    try {
      localStorage.removeItem(STORAGE)
    } catch {
      /* ignore */
    }
    show(0, true)
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
  }

  const onKey = (event: KeyboardEvent) => {
    const target = event.target
    if (target instanceof HTMLElement && (target.closest('input, textarea, select, [contenteditable="true"]'))) return
    const onControl = target instanceof HTMLElement && Boolean(target.closest('button, a'))

    if (event.key === 'ArrowRight' || (event.key === ' ' && !onControl)) {
      event.preventDefault()
      nextSlide()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prevSlide()
    } else if (event.key === 'r' || event.key === 'R') {
      if (!onControl) restart()
    }
  }

  let touchStartX = 0

  const onTouchStart = (event: TouchEvent) => {
    touchStartX = event.changedTouches[0]?.screenX ?? 0
  }

  const onTouchEnd = (event: TouchEvent) => {
    const endX = event.changedTouches[0]?.screenX ?? 0
    const diff = touchStartX - endX
    if (Math.abs(diff) <= 50) return
    if (diff > 0) nextSlide()
    else prevSlide()
  }

  onMounted(() => {
    try {
      const saved = localStorage.getItem(STORAGE)
      if (saved !== null) {
        const index = Number.parseInt(saved, 10)
        if (!Number.isNaN(index)) show(index, true)
      }
    } catch {
      /* ignore */
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKey)
    document.removeEventListener('touchstart', onTouchStart)
    document.removeEventListener('touchend', onTouchEnd)
  })

  return {
    current,
    progressPct,
    counter,
    nextSlide,
    prevSlide,
    restart,
  }
}
