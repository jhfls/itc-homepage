<script setup lang="ts">
import { INTRO_TIMING } from '~/composables/useIntro';

const { phase, done, arm, start, finish } = useIntro();
// setup 同步执行（先于子组件 mount）：写好 hasIntro/done，避免时序竞态。
const showing = arm();

onMounted(() => {
  if (showing)
    start(INTRO_TIMING);
});
</script>

<template>
  <div
    v-if="!done"
    id="intro"
    role="dialog"
    aria-label="进入"
    :class="{ 'phase-sub': phase !== 'idle', 'phase-hold': phase === 'hold' }"
  >
    <div class="intro-bg">
      <FxStreaks id="streaks-intro" />
      <FxMeteors :count="20" fast />
    </div>
    <div class="intro-center">
      <div class="intro-kicker">
        <span class="slash">/</span>ITC 2026<span class="slash">/</span>
      </div>
      <h1 class="intro-title">
        <span class="wipe">科创中心 ITC<span class="dot">·</span></span>
      </h1>
      <div class="intro-rule" />
      <p class="intro-sub">
        以创造连接世界
      </p>
    </div>
    <button id="intro-skip" type="button" @click="finish">
      跳过
    </button>
  </div>
</template>
