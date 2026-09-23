<script setup lang="ts">
import { ROLE_CRUMBS, ROLE_THEMES } from '~/data/site';

const slug = 'mentor';
const { data: page } = await useAsyncData(`role-${slug}`, () => queryCollection('roles').path(`/roles/${slug}`).first());

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const theme = ROLE_THEMES[slug]!;
const crumbs = ROLE_CRUMBS[slug]!;
const headTitle = computed(() => (page.value ? `${page.value.title} ${page.value.code}` : 'ITC 科创中心'));
const footDesc = computed(() => (page.value ? `ITC 科创中心 · ${page.value.title} ${page.value.code}` : 'ITC 科创中心'));
useHead({ title: headTitle });
</script>

<template>
  <div>
    <SiteNav :active="slug" :cta="{ text: '← 关于', href: '/', ghost: true }" />
    <RoleHero v-if="page" :page="page" :theme="theme" :crumbs="crumbs" :slug="slug" />
    <MarqueeTicker v-if="page" :items="[...page.marquee]" />
    <TracingBeam :beam="theme.beam">
      <MoreRoles :current="slug" />
    </TracingBeam>
    <SiteFooter kicker="/ ITC · 科创中心 /" :desc="footDesc" />
  </div>
</template>
