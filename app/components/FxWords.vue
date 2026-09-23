<script setup lang="ts">
/** 逐字去模糊浮现：直接切分 DOM 文本节点，保留 <small>/<br> 等内联结构。 */
const props = withDefaults(
  defineProps<{ stagger?: number, delayMs?: number, as?: string }>(),
  { stagger: 0.038, delayMs: 60, as: 'div' },
);

const { motionDisabled } = useMotionPrefs();
const elRef = ref<HTMLElement | null>(null);

function split(el: HTMLElement, stagger: number) {
  const doc = document;
  const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes: Text[] = [];
  let n: Node | null = walker.nextNode();
  while (n) {
    if (n.nodeValue?.trim())
      nodes.push(n as Text);
    n = walker.nextNode();
  }
  const spans: HTMLSpanElement[] = [];
  nodes.forEach((node) => {
    const text = node.nodeValue ?? '';
    const frag = doc.createDocumentFragment();
    let plain = '';
    const drain = () => {
      if (plain) {
        frag.appendChild(doc.createTextNode(plain));
        plain = '';
      }
    };
    const re = /[A-Z0-9]+|[\u3400-\u9FFF]/gi;
    let m: RegExpExecArray | null = re.exec(text);
    let i = 0;
    while (m) {
      if (m.index > i)
        plain += text.slice(i, m.index);
      drain();
      const sp = doc.createElement('span');
      sp.className = 'fx-w';
      sp.textContent = m[0];
      frag.appendChild(sp);
      spans.push(sp);
      i = re.lastIndex;
      m = re.exec(text);
    }
    if (i < text.length)
      plain += text.slice(i);
    drain();
    node.parentNode?.replaceChild(frag, node);
  });
  spans.forEach((sp, i) => {
    sp.style.transitionDelay = `${(i * stagger).toFixed(3)}s`;
  });
  return spans.length > 0;
}

onMounted(() => {
  const el = elRef.value;
  if (!el)
    return;
  if (motionDisabled.value) {
    el.classList.add('fx-words-on');
    return;
  }
  const hasSpans = split(el, props.stagger);
  if (!hasSpans)
    return;
  waitForIntro(() => {
    const start = () => window.setTimeout(() => el.classList.add('fx-words-on'), props.delayMs);
    if (!('IntersectionObserver' in window)) {
      start();
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          io.disconnect();
          start();
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
    <slot />
  </component>
</template>
