<script setup lang="ts">
/** 交互网格：底格 CSS 发丝线，亮格 canvas 追光标，带衰减拖尾 + 环境扫描带。 */
const props = withDefaults(
  defineProps<{ cell?: number, tint?: readonly number[] }>(),
  { cell: 44, tint: () => [255, 116, 0] },
);

const { motionDisabled } = useMotionPrefs();
const canvasRef = ref<HTMLCanvasElement | null>(null);
const hostRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (motionDisabled.value)
    return;
  const canvas = canvasRef.value;
  const host = hostRef.value?.parentElement;
  if (!canvas || !host)
    return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
    return;

  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;
  const CELL = props.cell;
  const [tr, tg, tb] = props.tint;
  const palette: string[] = [];
  for (let k = 0; k < 32; k++) palette.push(`rgba(${tr},${tg},${tb},${((k / 31) * 0.55).toFixed(3)})`);

  let W = 0, H = 0, cols = 0, rows = 0;
  let lit: Float32Array = new Float32Array(0);
  let visible = true;
  const p = { x: -1e5, y: -1e5, on: false };
  const sp = { x: -1e5, y: -1e5 };
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  let raf = 0;
  let last = 0;

  const resize = () => {
    const r = host.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / CELL) + 1;
    rows = Math.ceil(H / CELL) + 1;
    lit = new Float32Array(cols * rows);
    for (let i = 0; i < lit.length; i++) lit[i] = Math.random() < 0.05 ? Math.random() * 0.1 : 0;
  };

  const splat = (px: number, py: number, strength: number) => {
    const cx = Math.floor(px / CELL), cy = Math.floor(py / CELL), R = 3;
    for (let dx = -R; dx <= R; dx++) {
      for (let dy = -R; dy <= R; dy++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= cols || y >= rows)
          continue;
        const d = Math.hypot(dx, dy) / R;
        lit[y * cols + x] = Math.min(1, (lit[y * cols + x] ?? 0) + strength * (1 - d));
      }
    }
  };

  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
    last = t;
    if (!visible || document.hidden)
      return;
    if (p.on) {
      sp.x += (p.x - sp.x) * Math.min(1, dt * 14);
      sp.y += (p.y - sp.y) * Math.min(1, dt * 14);
      splat(sp.x, sp.y, 0.85);
    }
    const band = (((t / 1000) % 17) / 17) * (W + 620) - 310;
    const decay = 0.9 ** (dt * 60);
    ctx.clearRect(0, 0, W, H);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        let v = (lit[i] ?? 0) * decay;
        const bx = Math.abs(x * CELL + CELL / 2 - band);
        if (bx < 130)
          v = Math.max(v, 0.11 * (1 - bx / 130));
        lit[i] = v;
        if (v > 0.012) {
          ctx.fillStyle = palette[Math.min(31, (v * 31) | 0)]!;
          ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
        }
      }
    }
  };

  resize();
  raf = requestAnimationFrame(frame);

  const io = new IntersectionObserver(([e]) => {
    visible = e?.isIntersecting ?? true;
  });
  io.observe(host);

  let rz: ReturnType<typeof setTimeout>;
  const onResize = () => {
    clearTimeout(rz);
    rz = setTimeout(resize, 200);
  };
  window.addEventListener('resize', onResize, { passive: true });
  const ro = new ResizeObserver(() => resize());
  ro.observe(host);

  const onMove = (e: PointerEvent) => {
    if (coarse)
      return;
    const r = host.getBoundingClientRect();
    p.x = e.clientX - r.left;
    p.y = e.clientY - r.top;
    p.on = true;
  };
  const onLeave = () => {
    p.on = false;
  };
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave);

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('resize', onResize);
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('pointerleave', onLeave);
  });
});
</script>

<template>
  <span ref="hostRef" style="display: contents">
    <canvas v-if="!motionDisabled" ref="canvasRef" class="fx-canvas" aria-hidden="true" />
  </span>
</template>
