<script setup lang="ts">
defineProps<{ error?: { statusCode?: number, message?: string } }>();
</script>

<template>
  <div>
    <SiteNav active="about" :cta="{ text: '← 关于', href: '/', ghost: true }" />
    <section class="sec" style="padding-top:120px;padding-bottom:120px">
      <div class="mlabel">
        <span class="slash">/</span>404 · NOT FOUND
      </div>
      <h1 style="color:var(--t1);font-size:clamp(40px,6vw,72px);margin:18px 0">
        走丢了<span style="color:var(--orange)">·</span>
      </h1>
      <p style="margin-bottom:24px">
        这个页面不存在。回关于页，或者去身份看看。
      </p>
      <div style="display:flex;gap:10px">
        <NuxtLink class="btn btn-orange btn-sm" to="/">
          ← 关于 ITC
        </NuxtLink>
        <NuxtLink class="btn btn-ghost btn-sm" to="/roles">
          身份 ROLES
        </NuxtLink>
      </div>
    </section>
    <SiteFooter />
  </div>
</template>
