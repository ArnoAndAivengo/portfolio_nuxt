<script setup lang="ts">
const error = useError()
const is404 = computed(() => error.value?.statusCode === 404)
const title = computed(() => (is404.value ? 'Страница не найдена' : 'Что-то пошло не так'))

useSeoMeta({
  title: () => `${title.value} — Александр Обухов`,
  robots: 'noindex, nofollow',
})

const go = async (path: string) => {
  await clearError({ redirect: path })
}
</script>

<template>
  <NuxtLayout>
    <section class="coming-soon">
      <h2>{{ title }}</h2>
      <p v-if="is404">
        Такого адреса нет. Можно вернуться на главную или открыть резюме.
      </p>
      <p v-else>
        Не получилось открыть страницу. Попробуйте главную.
      </p>
      <div class="contact-actions">
        <NuxtLink
          class="btn btn--primary"
          to="/"
          @click.prevent="go('/')"
        >На главную</NuxtLink>
        <NuxtLink
          class="btn btn--ghost"
          to="/resume"
          @click.prevent="go('/resume')"
        >Резюме</NuxtLink>
      </div>
    </section>
  </NuxtLayout>
</template>
