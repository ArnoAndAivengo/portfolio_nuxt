<script setup lang="ts">
const restore = () => {
  const input = document.getElementById('theme-toggle')
  if (input instanceof HTMLInputElement) {
    input.checked = useThemeDark().value || document.documentElement.classList.contains('dark')
  }
}

onMounted(restore)

const route = useRoute()
watch(() => route.fullPath, () => {
  nextTick(restore)
})
</script>

<template>
  <label class="theme-switch">
    <input
      id="theme-toggle"
      class="theme-switch__input"
      type="checkbox"
      role="switch"
      aria-label="Тёмная тема"
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
  </label>
</template>
