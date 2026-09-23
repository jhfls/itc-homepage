<script setup lang="ts">
/** 乱序解密：英文/数字与汉字各自用字池，700ms 内收敛。 */
const props = withDefaults(defineProps<{ durationMs?: number, as?: string }>(), {
  durationMs: 700,
  as: 'div',
});

const { motionDisabled } = useMotionPrefs();
const elRef = ref<HTMLElement | null>(null);
const display = ref<string | null>(null);

const CJK = '科创中心未来创造者引路闻道设计影像实验代码光信号'.split('');
const LAT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

onMounted(() => {
  const el = elRef.value;
  if (!el)
    return;
  const full = el.textContent ?? '';
  if (motionDisabled.value) {
    display.value = full;
    return;
  }
  display.value = full;
  waitForIntro(() => {
    const run = () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const prog = Math.min(1, Math.max(0, (now - t0) / props.durationMs));
        const len = full.length;
        const local = Math.min(1, Math.max(0, (prog * (len + 6)) / 6));
        if (local >= 1) {
          display.value = full;
          return;
        }
        let out = '';
        const lock = Math.floor(local * len);
        for (let i = 0; i < len; i++) {
          const ch = full.charAt(i);
          if (i < lock || ch === ' ') {
            out += ch;
            continue;
          }
          if (/[A-Z0-9]/i.test(ch))
            out += LAT[(Math.random() * LAT.length) | 0];
          else if (/[\u3400-\u9fff]/.test(ch))
            out += CJK[(Math.random() * CJK.length) | 0];
          else out += ch;
        }
        display.value = out;
        if (prog < 1)
          requestAnimationFrame(step);
        else display.value = full;
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) {
      run();
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    onBeforeUnmount(() => io.disconnect());
  });
});
</script>

<template>
  <component :is="as" ref="elRef">
    <template v-if="display !== null">
      {{ display }}
    </template>
    <slot v-else />
  </component>
</template>
