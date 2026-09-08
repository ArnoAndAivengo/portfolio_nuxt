<script setup lang="ts">
import { TRAINERS } from '~/entities/trainer'
import './trainers-hub.css'
</script>

<template>
  <div class="trainers-hub">
    <section
      id="trainers"
      class="section"
    >
      <h2 class="section__title">Тренажёры</h2>
      <ul class="trainers-hub__list">
        <li
          v-for="item in TRAINERS"
          :key="item.key"
        >
          <article
            class="trainers-hub__card"
            :class="`trainers-hub__card--${item.key}`"
          >
            <NuxtLink
              class="trainers-hub__link"
              :to="item.to"
            >
              <h3 class="trainers-hub__title">{{ item.title }}</h3>
              <p class="trainers-hub__excerpt">{{ item.excerpt }}</p>
            </NuxtLink>
            <p class="trainers-hub__more">
              <NuxtLink :to="item.to">
                Открыть тренажёр <span aria-hidden="true">→</span>
              </NuxtLink>
            </p>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>
