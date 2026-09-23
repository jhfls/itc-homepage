<script setup lang="ts">
import type { Dept } from '~/data/site';

const { data: home } = await useAsyncData('site-home', () => queryCollection('site').path('/site/home').first());

const headTitle = computed(() => home.value?.title ?? 'ITC 科创中心 · 关于 ITC');
useHead({ title: headTitle });

const kicker = computed(() => home.value?.kicker ?? '');
const typer = computed<string[]>(() => home.value?.typer ?? []);
const heroSub = computed<string[]>(() => home.value?.heroSub ?? []);
const departments = computed<Dept[]>(() =>
  (home.value?.departments ?? []).map(d => ({
    label: d.label,
    title: d.title,
    desc: d.desc,
    href: d.href,
    linkText: d.linkText,
  })),
);
const marquee = computed<string[]>(() => home.value?.marquee ?? []);
const footKicker = computed(() => home.value?.footKicker ?? '');
const footDesc = computed(() => home.value?.footDesc ?? '');
</script>

<template>
  <div>
    <IntroOverlay />
    <SiteNav active="about" />

    <!-- Hero：交互网格 + 流星 + 光晕 -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-glow" />
        <FxStreaks id="streaks" />
      </div>
      <FxGrid :tint="[255, 116, 0]" />
      <FxMeteors :count="7" />
      <div class="hero-in">
        <div class="mlabel">
          <FxScramble as="span">
            /{{ kicker }}/
          </FxScramble>
        </div>
        <FxTyper v-if="typer.length" :words="typer" />
        <FxWords as="p" class="hero-sub" :stagger="0.016" :delay-ms="320">
          <template v-for="(line, i) in heroSub" :key="i">
            {{ line }}<br v-if="i < heroSub.length - 1">
          </template>
        </FxWords>
      </div>
    </section>

    <!-- 下属组织 -->
    <section id="about" class="sec">
      <RevealOnScroll>
        <div class="sec-head">
          <div>
            <div class="mlabel">
              <FxScramble as="span">
                /{{ kicker }}
              </FxScramble>
            </div>
            <FxWords as="h2">
              ITC<span style="color: var(--orange)">·</span>科创中心
            </FxWords>
          </div>
        </div>
      </RevealOnScroll>
      <div class="how">
        <RevealOnScroll v-for="d in departments" :key="d.label">
          <SpotlightCard class="how-card">
            <div class="label">
              {{ d.label }}
            </div>
            <h4>{{ d.title }}</h4>
            <p>
              {{ d.desc }}<NuxtLink v-if="d.href" :to="d.href" style="color: var(--orange)">
                {{ d.linkText }}
              </NuxtLink>
            </p>
          </SpotlightCard>
        </RevealOnScroll>
      </div>
    </section>

    <MarqueeTicker :items="marquee" />

    <SiteFooter :kicker="footKicker" :desc="footDesc" />
  </div>
</template>
