<script setup lang="ts">
import './screenshot-slider.css'

export type Screenshot = {
  src: string
  alt: string
}

const props = withDefaults(defineProps<{
  items: Screenshot[]
  name?: string
  label?: string
}>(), {
  name: 'shots',
  label: 'Скриншоты',
})

const radioId = (index: number) => `${props.name}-slide-${index}`
const lightboxId = computed(() => `${props.name}-lb`)
const panelId = (index: number) => `${props.name}-lb-panel-${index}`

const openPanel = (index: number) => {
  requestAnimationFrame(() => {
    document.getElementById(panelId(index))?.scrollIntoView({
      inline: 'start',
      block: 'nearest',
    })
  })
}
</script>

<template>
  <div
    v-if="items.length"
    class="shots"
    role="region"
    aria-roledescription="карусель"
    :aria-label="label"
  >
    <input
      v-for="(_, index) in items"
      :id="radioId(index)"
      :key="`${name}-radio-${index}`"
      class="shots__radio"
      type="radio"
      :name="name"
      :data-slide="index"
      :checked="index === 0"
    >
    <div class="shots__viewport">
      <ul class="shots__track">
        <li
          v-for="(shot, index) in items"
          :key="shot.src"
          class="shots__slide"
        >
          <button
            type="button"
            class="shots__open"
            :popovertarget="lightboxId"
            :aria-label="`Увеличить: ${shot.alt}`"
            @click="openPanel(index)"
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
          <p class="shots__slide-caption">{{ shot.alt }}</p>
        </li>
      </ul>
    </div>
    <div class="shots__captions">
      <p
        v-for="(shot, index) in items"
        :key="`${name}-caption-${shot.src}`"
        class="shots__caption"
        :data-page="index"
      >{{ shot.alt }}</p>
    </div>
    <div
      v-if="items.length > 1"
      class="shots__controls"
    >
      <span class="shots__arrow-wrap">
        <label
          v-for="(_, index) in items"
          :key="`${name}-prev-${index}`"
          class="shots__arrow"
          :data-page="index"
          :for="radioId((index - 1 + items.length) % items.length)"
        >
          <span class="shots__sr">Предыдущий скриншот</span>
          <span aria-hidden="true">‹</span>
        </label>
      </span>
      <div class="shots__dots">
        <label
          v-for="(_, index) in items"
          :key="`${name}-dot-${index}`"
          class="shots__dot"
          :for="radioId(index)"
        >
          <span class="shots__sr">Скриншот {{ index + 1 }} из {{ items.length }}</span>
        </label>
      </div>
      <span class="shots__arrow-wrap">
        <label
          v-for="(_, index) in items"
          :key="`${name}-next-${index}`"
          class="shots__arrow"
          :data-page="index"
          :for="radioId((index + 1) % items.length)"
        >
          <span class="shots__sr">Следующий скриншот</span>
          <span aria-hidden="true">›</span>
        </label>
      </span>
    </div>
    <div class="shots__counts">
      <p
        v-for="(_, index) in items"
        :key="`${name}-count-${index}`"
        class="shots__count"
        :data-page="index"
      >{{ index + 1 }} / {{ items.length }}</p>
    </div>

    <div
      :id="lightboxId"
      class="shots-modal"
      popover="auto"
      role="dialog"
      aria-modal="true"
      :aria-label="label"
    >
      <button
        type="button"
        class="shots-modal__close"
        :popovertarget="lightboxId"
        popovertargetaction="hide"
        aria-label="Закрыть"
      >×</button>
      <span
        v-if="items.length > 1"
        class="shots-modal__arrow-wrap shots-modal__arrow-wrap--prev"
      >
        <label
          v-for="(_, index) in items"
          :key="`${name}-lb-prev-${index}`"
          class="shots-modal__nav"
          :data-page="index"
          :for="radioId((index - 1 + items.length) % items.length)"
        >
          <span class="shots__sr">Предыдущий скриншот</span>
          <span aria-hidden="true">‹</span>
        </label>
      </span>
      <div class="shots-modal__panels">
        <figure
          v-for="(shot, index) in items"
          :key="`${name}-lb-${shot.src}`"
          :id="panelId(index)"
          class="shots-modal__figure"
          :data-page="index"
        >
          <img
            class="shots-modal__image"
            :src="shot.src"
            :alt="shot.alt"
          >
          <figcaption class="shots-modal__caption">{{ shot.alt }}</figcaption>
        </figure>
      </div>
      <span
        v-if="items.length > 1"
        class="shots-modal__arrow-wrap shots-modal__arrow-wrap--next"
      >
        <label
          v-for="(_, index) in items"
          :key="`${name}-lb-next-${index}`"
          class="shots-modal__nav"
          :data-page="index"
          :for="radioId((index + 1) % items.length)"
        >
          <span class="shots__sr">Следующий скриншот</span>
          <span aria-hidden="true">›</span>
        </label>
      </span>
    </div>
  </div>
</template>
