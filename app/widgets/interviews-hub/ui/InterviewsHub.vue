<script setup lang="ts">
import { INTERVIEWS } from '~/entities/interview'
import { JsRequiredNotice } from '~/shared/ui/js-required'
import './interviews-hub.css'
</script>

<template>
  <div class="interviews-hub">
    <JsRequiredNotice />
    <section
      id="interviews"
      class="section js-only"
    >
      <h2 class="section__title">Языки</h2>
      <ul class="interviews-hub__list">
        <li
          v-for="item in INTERVIEWS"
          :key="item.key"
        >
          <article
            class="interviews-hub__card"
            :style="{ '--hub-accent': item.accent }"
          >
            <NuxtLink
              class="interviews-hub__link"
              :to="item.to"
            >
              <img
                class="interviews-hub__icon"
                :src="item.icon"
                :alt="item.title"
                width="48"
                height="48"
              >
              <h3 class="interviews-hub__title">{{ item.title }}</h3>
              <p class="interviews-hub__excerpt">{{ item.excerpt }}</p>
            </NuxtLink>
            <p class="interviews-hub__more">
              <NuxtLink :to="item.to">
                Открыть квиз <span aria-hidden="true">→</span>
              </NuxtLink>
            </p>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>
