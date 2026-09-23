<script setup lang="ts">
import type { RoleCardModel } from '~/data/site';

defineProps<{ role: RoleCardModel }>();
</script>

<template>
  <NuxtLink class="role-card" :class="{ light: role.light }" :to="`/roles/${role.slug}`">
    <div class="bg" :class="role.bg" />
    <span class="num">/ {{ role.index }} — {{ role.code }} · {{ role.grade }} /</span>
    <span class="arrow" aria-hidden="true">→</span>
    <h3>
      {{ role.title }}<small>{{ role.subtitle }}</small>
    </h3>
    <p>{{ role.desc }}</p>
  </NuxtLink>
</template>
