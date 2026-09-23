<script setup lang="ts">
/** 卡片聚光：光标处一团暖光，CSS 绘制、JS 只喂坐标。 */
const elRef = ref<HTMLElement | null>(null);

function onMove(e: PointerEvent) {
  const el = elRef.value;
  if (!el)
    return;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--fx-x', `${(e.clientX - r.left).toFixed(1)}px`);
  el.style.setProperty('--fx-y', `${(e.clientY - r.top).toFixed(1)}px`);
}
</script>

<template>
  <div ref="elRef" class="spotlight" style="position: relative; overflow: hidden" @pointermove.passive="onMove">
    <slot />
  </div>
</template>
