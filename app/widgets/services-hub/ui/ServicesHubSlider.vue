<script setup lang="ts" generic="T">
defineProps<{
  name: string
  pages: T[][]
  label: string
  listClass?: string
}>()

defineSlots<{
  page: (props: { items: T[], index: number }) => unknown
}>()
</script>

<template>
  <div
    v-if="pages.length"
    class="services-hub__slider"
    role="region"
    aria-roledescription="карусель"
    :aria-label="label"
  >
    <input
      v-for="(_, index) in pages"
      :id="`${name}-slide-${index}`"
      :key="`${name}-radio-${index}`"
      class="services-hub__radio"
      type="radio"
      :name="name"
      :data-slide="index"
      :checked="index === 0"
    >
    <div class="services-hub__viewport">
      <div class="services-hub__track">
        <ul
          v-for="(page, pageIdx) in pages"
          :key="`${name}-page-${pageIdx}`"
          class="services-hub__list"
          :class="listClass"
        >
          <slot
            name="page"
            :items="page"
            :index="pageIdx"
          />
        </ul>
      </div>
    </div>
    <div
      v-if="pages.length > 1"
      class="services-hub__controls"
    >
      <span class="services-hub__arrow-wrap">
        <label
          v-for="(_, index) in pages"
          :key="`${name}-prev-${index}`"
          class="services-hub__arrow"
          :data-page="index"
          :for="`${name}-slide-${(index - 1 + pages.length) % pages.length}`"
        >
          <span class="services-hub__sr">Предыдущий слайд</span>
          <span aria-hidden="true">‹</span>
        </label>
      </span>
      <div class="services-hub__dots">
        <label
          v-for="(_, index) in pages"
          :key="`${name}-dot-${index}`"
          class="services-hub__dot"
          :for="`${name}-slide-${index}`"
        >
          <span class="services-hub__sr">Слайд {{ index + 1 }} из {{ pages.length }}</span>
        </label>
      </div>
      <span class="services-hub__arrow-wrap">
        <label
          v-for="(_, index) in pages"
          :key="`${name}-next-${index}`"
          class="services-hub__arrow"
          :data-page="index"
          :for="`${name}-slide-${(index + 1) % pages.length}`"
        >
          <span class="services-hub__sr">Следующий слайд</span>
          <span aria-hidden="true">›</span>
        </label>
      </span>
    </div>
  </div>
</template>
