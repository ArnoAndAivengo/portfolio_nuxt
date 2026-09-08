export function useSectionSpy() {
  const activeId = ref('')

  let frame = 0

  const sections = () =>
    [...document.querySelectorAll<HTMLElement>('#content .current-project__section[id]')]

  const sync = () => {
    if (!import.meta.client) return

    const els = sections()
    if (!els.length) return

    const marker = Math.round(window.innerHeight * 0.28)
    let current = els[0].id

    for (const el of els) {
      if (el.getBoundingClientRect().top <= marker) current = el.id
    }

    const bottomGap =
      document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)

    if (bottomGap < 64) current = els[els.length - 1].id

    if (activeId.value !== current) activeId.value = current
  }

  const onScroll = () => {
    if (frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      sync()
    })
  }

  onMounted(() => {
    let tries = 0
    const waitForSections = () => {
      sync()
      if (sections().length || tries > 30) return
      tries += 1
      requestAnimationFrame(waitForSections)
    }

    waitForSections()
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    window.addEventListener('resize', onScroll)
  })

  onUnmounted(() => {
    if (frame) cancelAnimationFrame(frame)
    document.removeEventListener('scroll', onScroll, { capture: true })
    window.removeEventListener('resize', onScroll)
  })

  const activate = (id: string) => {
    activeId.value = id
  }

  return { activeId, activate }
}
