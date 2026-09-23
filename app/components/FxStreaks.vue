<script setup lang="ts">
import type { CSSProperties } from 'vue';
/** 环境光轨：40 条慢漂细线，其中两条橙色高亮。
 * 位置用确定性种子随机：SSR 与客户端 hydration 算出完全一致的值，
 * 避免 Hydration style mismatch；视觉仍是随机分布，且每次加载稳定不跳变。 */
const props = withDefaults(defineProps<{ id?: string, lines?: number }>(), {
  id: 'streaks',
  lines: 40,
});

/** 直接用 CSSProperties：键全是标准 CSS 属性，--var 索引签名也自带，:style 绑定可通过类型检查。 */
type Streak = Pick<CSSProperties, 'left' | 'opacity' | 'width' | 'background'>;

/** 整数哈希 → [0, 1)：同一输入永远同一输出，服务端与客户端一致。 */
function hash01(n: number): number {
  let x = (n + 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
  x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
}

const streaks = computed<Streak[]>(() =>
  Array.from({ length: props.lines }, (_, i) => {
    const base: Streak = {
      left: `${(i * 2.6 + hash01(i * 2)).toFixed(2)}%`,
      opacity: (0.05 + hash01(i * 2 + 1) * 0.18).toFixed(2),
    };
    if (i === 15) {
      base.width = '12px';
      base.background = 'linear-gradient(180deg,transparent,#FF7400 30%,#FFB02E 60%,transparent)';
      base.opacity = '0.45';
    }
    if (i === 24) {
      base.width = '2px';
      base.background = '#FF7400';
      base.opacity = '0.6';
    }
    return base;
  }),
);
</script>

<template>
  <div :id="id" class="streaks" aria-hidden="true">
    <i v-for="(s, i) in streaks" :key="i" :style="s" />
  </div>
</template>
