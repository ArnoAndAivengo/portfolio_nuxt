<script setup lang="ts">
import { TRAINERS } from '~/entities/trainer'
import './trainers-hub.css'

const isExternal = (item: (typeof TRAINERS)[number]) =>
  'external' in item && item.external
</script>

<template>
  <div class="trainers-hub">
    <section
      id="trainers"
      class="section"
    >
      <h2 class="section__title">Тренажёры</h2>
      <p class="prose">
        Код каждый день тренирую ещё на
        <a
          href="https://coddy.tech/user/alexobukhovarno"
          target="_blank"
          rel="noopener noreferrer"
        >Coddy</a>
        и
        <a
          href="https://leetcode.com/u/arnoandaivengo/"
          target="_blank"
          rel="noopener noreferrer"
        >LeetCode</a>.
      </p>
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
              :external="isExternal(item)"
              :target="isExternal(item) ? '_blank' : undefined"
              :rel="isExternal(item) ? 'noopener noreferrer' : undefined"
            >
              <h3 class="trainers-hub__title">{{ item.title }}</h3>
              <p class="trainers-hub__excerpt">{{ item.excerpt }}</p>
            </NuxtLink>
            <p class="trainers-hub__more">
              <NuxtLink
                :to="item.to"
                :external="isExternal(item)"
                :target="isExternal(item) ? '_blank' : undefined"
                :rel="isExternal(item) ? 'noopener noreferrer' : undefined"
              >
                {{ isExternal(item) ? 'Открыть профиль' : 'Открыть тренажёр' }}
                <span aria-hidden="true">→</span>
              </NuxtLink>
            </p>
          </article>
        </li>
      </ul>
    </section>
  </div>
</template>
