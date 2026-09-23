<script setup lang="ts">
/** 打字机：默认只放一遍（ITC → It Creates → It Challenges → 收回 ITC 停住）。 */
const props = withDefaults(
  defineProps<{
    words: readonly string[] | string[]
    typeMs?: number
    delMs?: number
    holdMs?: number
    holdFirstMs?: number
    gapMs?: number
    loop?: boolean
    as?: string
  }>(),
  { typeMs: 78, delMs: 44, holdMs: 1900, holdFirstMs: 2600, gapMs: 240, loop: false, as: 'h1' },
);

const { motionDisabled } = useMotionPrefs();
const text = ref('');
const isTyping = ref(false);
const isDone = ref(false);
const started = ref(false);
const elRef = ref<HTMLElement | null>(null);
const timers: ReturnType<typeof setTimeout>[] = [];

function later(fn: () => void, ms: number) {
  timers.push(setTimeout(fn, ms));
}

function typeTo(target: string, done: () => void) {
  let i = text.value.length;
  const tick = () => {
    if (i >= target.length) {
      done();
      return;
    }
    i += 1;
    text.value = target.slice(0, i);
    later(tick, props.typeMs + ((Math.random() * 34) | 0));
  };
  tick();
}

function step(idx: number, finishing: boolean) {
  const word = props.words[idx] ?? '';
  let keep = 0;
  if (idx > 0) {
    const cur = text.value;
    while (keep < cur.length && keep < word.length && cur.charAt(keep) === word.charAt(keep)) keep += 1;
  }
  isTyping.value = true;
  const shrink = () => {
    if (text.value.length <= keep) {
      later(() => {
        typeTo(word, () => {
          isTyping.value = false;
          const last = idx === props.words.length - 1;
          later(() => {
            if (finishing) {
              isDone.value = true;
              return;
            }
            if (last)
              step(0, !props.loop);
            else step(idx + 1, false);
          }, idx === 0 ? props.holdFirstMs : props.holdMs);
        });
      }, props.gapMs);
      return;
    }
    text.value = text.value.slice(0, -1);
    later(shrink, props.delMs);
  };
  shrink();
}

function begin() {
  if (started.value)
    return;
  started.value = true;
  if (motionDisabled.value) {
    text.value = props.words[0] ?? '';
    isDone.value = true;
    return;
  }
  if (props.words.length === 1) {
    // 单词：直接打出来后停住
    isTyping.value = true;
    typeTo(props.words[0] ?? '', () => {
      isTyping.value = false;
      isDone.value = true;
    });
    return;
  }
  step(0, false);
}

onMounted(() => {
  const el = elRef.value;
  text.value = '';
  if (!el) {
    begin();
    return;
  }
  waitForIntro(() => {
    if (!('IntersectionObserver' in window)) {
      begin();
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      begin();
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          io.disconnect();
          begin();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    onBeforeUnmount(() => io.disconnect());
  });
});

onBeforeUnmount(() => timers.forEach(clearTimeout));
</script>

<template>
  <component
    :is="as"
    ref="elRef"
    class="fx-typer fx-typer-on"
    :class="{ 'is-typing': isTyping, 'is-done': isDone }"
    :aria-label="words.join(' · ')"
  >
    <span class="fx-typer-text" aria-hidden="true">{{ text }}</span><i class="fx-typer-caret" aria-hidden="true" />
  </component>
</template>
