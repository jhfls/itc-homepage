<script setup lang="ts">
import { FOOT_LINKS } from '~/data/site';

withDefaults(
  defineProps<{ kicker?: string, desc?: string }>(),
  { kicker: '/ ITC · 科创中心 /', desc: 'ITC 科创中心 · 关于 ITC' },
);
</script>

<template>
  <footer>
    <div class="foot-in">
      <div>
        <div class="mlabel">
          {{ kicker }}
        </div>
        <p style="margin-top: 10px; font-size: 13px; color: var(--t3)">
          {{ desc }}
        </p>
      </div>
      <div class="foot-links">
        <NuxtLink v-for="l in FOOT_LINKS" :key="l.href" :to="l.href">
          {{ l.text }}
        </NuxtLink>
      </div>
      <small>隶属 · 金华市外国语学校 JHFLS</small>
    </div>
  </footer>
</template>
