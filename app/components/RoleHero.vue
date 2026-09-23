<script setup lang="ts">
import type { RoleTheme } from '~/data/site';

/* content item 形状与 content.config.ts 的 roles schema 对齐；
   用结构化类型而不用生成类型，避免与 .nuxt 生成态耦合。 */
export interface RoleContent {
  title: string
  subtitle: string
  kicker: string
  badge?: string
  greek?: string[]
  tags?: { text: string, hot?: boolean }[]
  leadBold?: boolean
  dimLast?: boolean
  body?: unknown
}

const props = defineProps<{
  page: RoleContent & { body?: unknown }
  theme: RoleTheme
  crumbs: string[]
  slug: string
}>();

const tags = computed(() => props.page.tags ?? []);

const poemClass = computed(() => ({
  'lead-bold': props.page.leadBold,
  'dim-last': props.page.dimLast,
}));
</script>

<template>
  <section class="role-hero" :class="{ light: theme.light }">
    <div class="bg" :class="theme.bg" />
    <FxGrid />
    <FxMeteors :count="7" />
    <div class="role-hero-in">
      <div class="crumbs">
        <template v-for="(c, i) in crumbs" :key="c">
          <NuxtLink v-if="i === 0" to="/">
            {{ c }}
          </NuxtLink>
          <NuxtLink v-else-if="i === 1" to="/roles">
            {{ c }}
          </NuxtLink>
          <span v-else>{{ c }}</span>
          <template v-if="i < crumbs.length - 1">
            /
          </template>
        </template>
      </div>
      <div class="mlabel" style="color: rgba(255, 255, 255, 0.75)">
        <span class="slash">/</span><FxScramble as="span">
          {{ page.kicker }}
        </FxScramble><span class="slash">/</span>
      </div>
      <FxWords as="h1">
        {{ page.title }}<small>{{ page.subtitle }}</small>
      </FxWords>
      <div v-if="page.badge" class="badge">
        {{ page.badge }}
      </div>
      <div v-if="page.greek?.length" class="greek">
        <template v-for="(line, i) in page.greek" :key="i">
          <template v-if="line">
            {{ line }}<br>
          </template>
          <template v-else>
            <br>
          </template>
        </template>
      </div>
      <div class="poem" :class="poemClass">
        <ContentRenderer :value="page" />
      </div>
      <div v-if="tags.length" class="tags">
        <span v-for="t in tags" :key="t.text" class="tag" :class="{ hot: t.hot }">{{ t.text }}</span>
      </div>
      <div v-if="slug === 'visitor'" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px">
        <NuxtLink class="btn btn-ghost btn-sm" style="border-color: rgba(255, 255, 255, 0.3)" to="/roles">
          看看其他身份
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
