<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: 'about' | 'roles' | 'creator' | 'mentor' | 'media' | 'fellow' | 'visitor'
    cta?: { text: string, href: string, ghost?: boolean }
  }>(),
  {
    active: 'about',
    cta: () => ({ text: '进入身份 →', href: '/roles' }),
  },
);

const route = useRoute();
function isActive(key: string) {
  if (key === 'about')
    return route.path === '/';
  if (key === 'roles')
    return route.path.startsWith('/roles');
  return false;
}
</script>

<template>
  <header class="nav">
    <div class="nav-in">
      <NuxtLink class="brand" to="/">
        <BrandLogo />
        <span><b>ITC</b><small>科创中心 · JINHUA</small></span>
      </NuxtLink>
      <nav class="nav-links" aria-label="主导航">
        <NuxtLink to="/" :class="{ on: isActive('about') }">
          关于 ABOUT
        </NuxtLink>
        <NuxtLink to="/roles" :class="{ on: isActive('roles') }">
          {{ active === 'creator' ? '创造者 CREATOR' : active === 'mentor' ? '指引者 MENTOR' : active === 'media' ? '闻道者 MEDIA' : active === 'fellow' ? '同路人 FELLOW' : '身份 ROLES' }}
        </NuxtLink>
        <NuxtLink v-if="active !== 'about' && active !== 'roles'" to="/roles">
          身份 ROLES
        </NuxtLink>
      </nav>
      <div class="nav-cta">
        <NuxtLink class="btn btn-sm" :class="cta.ghost ? 'btn-ghost' : 'btn-orange'" :to="cta.href">
          {{ cta.text }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
