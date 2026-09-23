<script setup lang="ts">
const props = defineProps<{ current: string }>();

/* 互链与身份索引同源：读 content，避免中英文案两处手写。 */
const { data: all } = await useAsyncData('more-roles', () => queryCollection('roles').where('listed', '=', true).order('index', 'ASC').all());

const links = computed(() =>
  (all.value ?? [])
    .map(r => ({ slug: String(r.stem ?? '').split('/').pop() ?? '', label: r.title, code: r.code }))
    .filter(l => l.slug !== props.current),
);
</script>

<template>
  <div class="sec-head">
    <div>
      <div class="mlabel">
        <span class="slash">/</span>MORE ROLES
      </div>
      <h2 style="font-size: 30px">
        其他身份
      </h2>
    </div>
  </div>
  <div class="nextroles" style="grid-template-columns: repeat(3, 1fr)">
    <NuxtLink v-for="l in links" :key="l.slug" :to="`/roles/${l.slug}`">
      <span>{{ l.label }} <span class="mono" style="opacity: 0.6">{{ l.code }}</span></span>
      <span aria-hidden="true">→</span>
    </NuxtLink>
  </div>
</template>
