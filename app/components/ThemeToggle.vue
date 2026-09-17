<script setup lang="ts">
const colorMode = useColorMode()
const ready = ref(false)

onMounted(() => {
  ready.value = true
})

const isDark = computed(() => ready.value && colorMode.value === 'dark')

const toggle = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const onKey = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== ' ') return

  event.preventDefault()

  if (event.key === 'ArrowLeft') {
    colorMode.preference = 'light'
    return
  }

  if (event.key === 'ArrowRight') {
    colorMode.preference = 'dark'
    return
  }

  toggle()
}
</script>

<template>
  <button
    type="button"
    class="theme-switch"
    :class="{ 'theme-switch--dark': isDark }"
    role="switch"
    :aria-checked="isDark"
    :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'"
    @click="toggle"
    @keydown="onKey"
  >
    <img
      class="theme-switch__icon theme-switch__icon--sun"
      src="~/assets/images/sun.png"
      alt=""
      width="15"
      height="15"
      draggable="false"
      aria-hidden="true"
    >
    <img
      class="theme-switch__icon theme-switch__icon--moon"
      src="~/assets/images/dark-sun.png"
      alt=""
      width="15"
      height="15"
      draggable="false"
      aria-hidden="true"
    >
    <span
      class="theme-switch__knob"
      aria-hidden="true"
    />
  </button>
</template>
