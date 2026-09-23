<script setup lang="ts">
/** 流星：位置 / 延迟 / 时长用确定性种子随机（mulberry32），SSR 与 hydration 一致，
 * 避免 Hydration style mismatch；视觉仍是随机分布，且每次加载稳定不跳变。
 * 同一页多个实例用 seed 区分（默认由 count / fast 派生）。 */
const props = withDefaults(
  defineProps<{ count?: number, fast?: boolean, seed?: number }>(),
  { count: 10, fast: false, seed: undefined },
);
const { motionDisabled } = useMotionPrefs();

interface Meteor {
  left: string
  top: string
  delay: string
  duration: string
  tail: string
  peak: string
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const meteors = computed<Meteor[]>(() => {
  if (motionDisabled.value)
    return [];
  const rand = mulberry32(props.seed ?? (props.count * 131 + (props.fast ? 17 : 0) + 7));
  const range = (a: number, b: number) => a + rand() * (b - a);
  return Array.from({ length: props.count }, () => ({
    left: `${range(-6, 104).toFixed(2)}%`,
    top: `${range(-32, -6).toFixed(2)}%`,
    delay: `${(props.fast ? range(0.05, 1.3) : range(0.2, 4.2)).toFixed(2)}s`,
    duration: `${(props.fast ? range(2.6, 4.6) : range(6, 13)).toFixed(2)}s`,
    tail: `${Math.round(props.fast ? range(110, 220) : range(70, 150))}px`,
    peak: (props.fast ? range(0.3, 0.7) : range(0.32, 0.85)).toFixed(2),
  }));
});
</script>

<template>
  <div v-if="meteors.length" class="fx-meteors" aria-hidden="true">
    <i
      v-for="(m, i) in meteors"
      :key="i"
      class="fx-meteor"
      :style="{
        'left': m.left,
        'top': m.top,
        'animationDelay': m.delay,
        'animationDuration': m.duration,
        '--tail': m.tail,
        '--peak': m.peak,
      }"
    />
  </div>
</template>
