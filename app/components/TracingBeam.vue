<script setup lang="ts">
/** 滚动线路 Tracing Beam：线路板走线 + 渐变光带 + 巡线光点。 */
withDefaults(defineProps<{ beam?: string }>(), { beam: 'beam-creator' });

const secRef = ref<HTMLElement | null>(null);
const railRef = ref<HTMLDivElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);
const baseRef = ref<SVGPathElement | null>(null);
const glowRef = ref<SVGPathElement | null>(null);
const dotRef = ref<SVGCircleElement | null>(null);
const gradRef = ref<SVGLinearGradientElement | null>(null);

const gid = `fxbeam-${Math.random().toString(36).slice(2, 8)}`;

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

onMounted(() => {
  const sec = secRef.value;
  const rail = railRef.value;
  const svg = svgRef.value;
  const base = baseRef.value;
  const glow = glowRef.value;
  const dot = dotRef.value;
  const grad = gradRef.value;
  if (!sec || !rail || !svg || !base || !glow || !dot || !grad)
    return;
  if (window.innerWidth < 1100) {
    rail.style.display = 'none';
    return;
  }
  let H = 0, L = 0, ready = false;

  const update = () => {
    if (!ready)
      return;
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const prog = clamp((vh - r.top) / (vh + r.height), 0, 1);
    const yc = prog * H;
    grad.setAttribute('y1', (yc - 360).toFixed(1));
    grad.setAttribute('y2', (yc + 34).toFixed(1));
    try {
      const pt = (glow as unknown as SVGGeometryElement).getPointAtLength(clamp(prog, 0, 1) * L);
      dot.setAttribute('cx', pt.x.toFixed(2));
      dot.setAttribute('cy', pt.y.toFixed(2));
    } catch { /* ignore */ }
    dot.style.opacity = prog > 0.02 && prog < 0.995 ? '1' : '0';
  };

  const build = () => {
    H = sec.offsetHeight;
    if (H < 260 || window.innerWidth < 1100) {
      rail.style.display = 'none';
      ready = false;
      return;
    }
    rail.style.display = '';
    svg.setAttribute('height', String(H));
    svg.setAttribute('viewBox', `0 0 20 ${H}`);
    const a = H * 0.2, b = H * 0.46, c = H * 0.72;
    const d = `M1 0V${a - 18}L17 ${a}V${b - 18}L1 ${b}V${c - 18}L17 ${c}V${H}`;
    base.setAttribute('d', d);
    glow.setAttribute('d', d);
    try {
      L = (glow as unknown as SVGGeometryElement).getTotalLength();
    } catch {
      L = H;
    }
    ready = true;
    update();
  };

  build();
  let tick = 0;
  const onScroll = () => {
    if (tick)
      return;
    tick = requestAnimationFrame(() => {
      tick = 0;
      update();
    });
  };
  let rz: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(rz);
    rz = setTimeout(build, 180);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  const ro = new ResizeObserver(() => build());
  ro.observe(sec);
  onBeforeUnmount(() => {
    cancelAnimationFrame(tick);
    clearTimeout(rz);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    ro.disconnect();
  });
});
</script>

<template>
  <section ref="secRef" class="sec fx-beam" :class="beam">
    <div ref="railRef" class="fx-beam-rail" aria-hidden="true">
      <svg ref="svgRef" width="20" height="0" viewBox="0 0 20 0" fill="none" preserveAspectRatio="none">
        <path ref="baseRef" class="fx-beam-base" d="" />
        <path ref="glowRef" class="fx-beam-glow" d="" :stroke="`url(#${gid})`" />
        <circle ref="dotRef" class="fx-beam-dot" r="2.6" cx="1" cy="0" />
        <defs>
          <linearGradient :id="gid" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="0">
            <stop offset="0" style="stop-color: var(--beam-1, #ffb27a); stop-opacity: 0" />
            <stop offset="0.62" style="stop-color: var(--beam-1, #ffb27a); stop-opacity: 0.95" />
            <stop offset="0.82" style="stop-color: var(--beam-2, #ff7400); stop-opacity: 1" />
            <stop offset="1" style="stop-color: var(--beam-1, #ffb27a); stop-opacity: 0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <slot />
  </section>
</template>
