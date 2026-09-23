<script setup lang="ts">
/** 跑马灯：滚动越快跑得越快，方向恒定。 */
withDefaults(defineProps<{ items?: readonly string[] | string[] }>(), {
  items: () => [],
});
const { motionDisabled } = useMotionPrefs();
const rootRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

onMounted(() => {
  const root = rootRef.value;
  const track = trackRef.value;
  if (!root || !track || motionDisabled.value)
    return;
  let guard = 0;
  while (track.scrollWidth > 0 && track.scrollWidth < root.clientWidth * 2 && guard++ < 4) {
    track.innerHTML += track.innerHTML;
  }
  track.style.animation = 'none';
  let x = 0, boost = 0, lastY = window.scrollY, last = 0, live = true;
  const onScroll = () => {
    const y = window.scrollY;
    boost += Math.abs(y - lastY);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  const io = new IntersectionObserver(([e]) => {
    live = e?.isIntersecting ?? true;
  }, { threshold: 0 });
  io.observe(root);
  let raf = 0;
  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
    last = t;
    if (!live || document.hidden)
      return;
    const speed = 34 + Math.min(520, boost * 3.2);
    x -= speed * dt;
    const half = track.scrollWidth / 2;
    if (half > 0 && -x >= half)
      x += half;
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    boost *= 0.02 ** dt;
  };
  raf = requestAnimationFrame(frame);
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
  });
});
</script>

<template>
  <div ref="rootRef" class="marquee" role="presentation">
    <div ref="trackRef" class="marquee-track">
      <span v-for="(item, i) in items" :key="i">{{ item }} <em>{{ item.startsWith('FROM') || item.startsWith('NEVER') ? '---' : '·' }}</em></span>
    </div>
  </div>
</template>
