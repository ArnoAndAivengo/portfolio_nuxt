<script setup lang="ts">
import { BUG_HUNTS } from '~/entities/bug-hunt'
import './bugs-hub.css'
</script>

<template>
  <div class="bugs-hub">
    <section
      id="bugs"
      class="section"
    >
      <h2 class="section__title">Языки</h2>
      <ul class="bugs-hub__list">
        <li
          v-for="item in BUG_HUNTS"
          :key="item.key"
        >
          <article
            class="bugs-hub__card"
            :style="{ '--hub-accent': item.accent }"
          >
            <NuxtLink
              class="bugs-hub__link"
              :to="item.to"
            >
              <img
                class="bugs-hub__icon"
                :src="item.icon"
                :alt="item.title"
                width="48"
                height="48"
              >
              <h3 class="bugs-hub__title">{{ item.title }}</h3>
              <p class="bugs-hub__excerpt">{{ item.excerpt }}</p>
            </NuxtLink>
            <p class="bugs-hub__more">
              <NuxtLink :to="item.to">
                Открыть поиск <span aria-hidden="true">→</span>
              </NuxtLink>
            </p>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>
