<script setup lang="ts">
import './screenshot-slider.css'

export type Screenshot = {
  src: string
  alt: string
}

const props = defineProps<{
  items: Screenshot[]
}>()

const viewport = ref<HTMLElement | null>(null)
const modalRef = ref<HTMLElement | null>(null)
const closeRef = ref<HTMLButtonElement | null>(null)
const opener = ref<HTMLElement | null>(null)
const pageIndex = ref(0)
const openIndex = ref<number | null>(null)

const count = computed(() => props.items.length)
const current = computed(() => {
  const index = openIndex.value
  if (index === null) return null
  return props.items[index] ?? null
})

const reducedMotion = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const wrap = (index: number) => {
  const n = count.value
  if (!n) return 0
  return ((index % n) + n) % n
}

const scrollToPage = (index: number) => {
  const el = viewport.value
  if (!el || !count.value) return

  const next = wrap(index)
  pageIndex.value = next
  el.scrollTo({
    left: next * el.clientWidth,
    behavior: reducedMotion() ? 'auto' : 'smooth',
  })
}

const onScroll = () => {
  const el = viewport.value
  if (!el?.clientWidth) return

  pageIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

const open = (index: number, event?: MouseEvent) => {
  opener.value = (event?.currentTarget as HTMLElement) ?? null
  openIndex.value = wrap(index)
  document.body.style.overflow = 'hidden'
  nextTick(() => closeRef.value?.focus())
}

const close = () => {
  openIndex.value = null
  document.body.style.overflow = ''
  nextTick(() => opener.value?.focus())
}

const stepOpen = (delta: number) => {
  if (openIndex.value === null) return

  const next = wrap(openIndex.value + delta)
  openIndex.value = next
  scrollToPage(next)
}

const focusables = () =>
  [...(modalRef.value?.querySelectorAll<HTMLElement>('button') ?? [])]

const onKey = (event: KeyboardEvent) => {
  if (openIndex.value === null) return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    stepOpen(-1)
    return
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault()
    stepOpen(1)
    return
  }

  if (event.key !== 'Tab') return

  const list = focusables()
  if (!list.length) return

  event.preventDefault()
  const active = document.activeElement as HTMLElement
  const i = list.indexOf(active)
  const next = event.shiftKey
    ? (i <= 0 ? list.length - 1 : i - 1)
    : (i === -1 || i === list.length - 1 ? 0 : i + 1)
  list[next]?.focus()
}

onMounted(() => {
  const el = viewport.value
  if (!el) return

  el.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)

  const resize = new ResizeObserver(() => {
    el.scrollTo({ left: pageIndex.value * el.clientWidth })
  })
  resize.observe(el)

  onUnmounted(() => {
    el.removeEventListener('scroll', onScroll)
    window.removeEventListener('keydown', onKey)
    resize.disconnect()
    document.body.style.overflow = ''
  })
})
</script>

<template>
  <div
    v-if="items.length"
    class="shots"
    role="region"
    aria-roledescription="карусель"
    aria-label="Скриншоты LearnPortal"
  >
    <div
      ref="viewport"
      class="shots__viewport"
      tabindex="0"
      @keydown.left.prevent="scrollToPage(pageIndex - 1)"
      @keydown.right.prevent="scrollToPage(pageIndex + 1)"
    >
      <ul class="shots__track">
        <li
          v-for="(shot, index) in items"
          :key="shot.src"
          class="shots__slide"
          :aria-hidden="index === pageIndex ? undefined : 'true'"
        >
          <button
            type="button"
            class="shots__open"
            :tabindex="index === pageIndex ? 0 : -1"
            :aria-label="`Увеличить: ${shot.alt}`"
            @click="open(index, $event)"
          >
            <img
              :src="shot.src"
              :alt="shot.alt"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : undefined"
              decoding="async"
              width="1600"
              height="900"
            >
          </button>
        </li>
      </ul>
    </div>
    <p class="shots__caption">{{ items[pageIndex]?.alt }}</p>
    <div class="shots__controls">
      <button
        type="button"
        class="shots__arrow"
        aria-label="Предыдущий скриншот"
        @click="scrollToPage(pageIndex - 1)"
      >‹</button>
      <div class="shots__dots">
        <button
          v-for="(_, index) in items"
          :key="index"
          type="button"
          class="shots__dot"
          :aria-current="index === pageIndex ? 'true' : undefined"
          :aria-label="`Скриншот ${index + 1} из ${items.length}`"
          @click="scrollToPage(index)"
        />
      </div>
      <button
        type="button"
        class="shots__arrow"
        aria-label="Следующий скриншот"
        @click="scrollToPage(pageIndex + 1)"
      >›</button>
    </div>
    <p
      class="shots__count"
      aria-live="polite"
    >{{ pageIndex + 1 }} / {{ items.length }}</p>
  </div>

  <Teleport to="body">
    <div
      v-if="current"
      ref="modalRef"
      class="shots-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="current.alt"
      @click.self="close"
    >
      <button
        ref="closeRef"
        type="button"
        class="shots-modal__close"
        aria-label="Закрыть"
        @click="close"
      >×</button>
      <button
        type="button"
        class="shots-modal__nav shots-modal__nav--prev"
        aria-label="Предыдущий скриншот"
        @click="stepOpen(-1)"
      >‹</button>
      <figure class="shots-modal__figure">
        <img
          class="shots-modal__image"
          :src="current.src"
          :alt="current.alt"
        >
        <figcaption class="shots-modal__caption">{{ current.alt }}</figcaption>
      </figure>
      <button
        type="button"
        class="shots-modal__nav shots-modal__nav--next"
        aria-label="Следующий скриншот"
        @click="stepOpen(1)"
      >›</button>
    </div>
  </Teleport>
</template>
