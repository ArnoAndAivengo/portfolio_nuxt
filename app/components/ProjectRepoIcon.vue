<script setup lang="ts">
const { href } = defineProps<{
  href: string
}>()

const isGitlab = computed(() => href.includes('gitlab.com'))
</script>

<template>
  <span
    class="proj__icon"
    aria-hidden="true"
  >
    <IconGitlab v-if="isGitlab" />
    <IconGithub v-else />
  </span>
</template>
