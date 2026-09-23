<script setup lang="ts">
import type { RoleCardModel } from '~/data/site';
import { ROLE_THEMES } from '~/data/site';

useHead({ title: '身份 ROLES' });

/* 卡片直接读 content：文案与详情页同源，顺序按 frontmatter index。 */
const { data: roles } = await useAsyncData('roles-index', () => queryCollection('roles').where('listed', '=', true).order('index', 'ASC').all());

function slugOf(stem: unknown): string {
  return String(stem ?? '').split('/').pop() ?? '';
}

const cards = computed<RoleCardModel[]>(() =>
  (roles.value ?? []).flatMap((r) => {
    const slug = slugOf(r.stem);
    const theme = ROLE_THEMES[slug];
    if (!theme)
      return [];
    return [{ slug, index: r.index, code: r.code, grade: r.grade, title: r.title, subtitle: r.subtitle, desc: r.desc, ...theme }];
  }),
);
</script>

<template>
  <div>
    <SiteNav active="roles" :cta="{ text: '← 关于', href: '/', ghost: true }" />

    <section id="roles" class="sec">
      <RevealOnScroll>
        <div class="sec-head">
          <div>
            <div class="mlabel">
              <FxScramble as="span">
                /ROLES · 四个身份
              </FxScramble>
            </div>
            <FxWords as="h2">
              找到你的<span class="dot">·</span>位置
            </FxWords>
          </div>
          <p>点击进入对应身份介绍。</p>
        </div>
      </RevealOnScroll>
      <div class="roles">
        <RevealOnScroll v-for="role in cards" :key="role.slug">
          <RoleCard :role="role" />
        </RevealOnScroll>
      </div>
    </section>

    <SiteFooter kicker="/ ITC · 身份 ROLES /" desc="ITC 科创中心 · 四个身份" />
  </div>
</template>
