/**
 * 进入动画状态：对标 moonshotacademy 式划入，约 3s 后淡出。
 *
 * 时序竞争说明：父组件 setup 先于子组件 mount 执行，因此 IntroOverlay
 * 在 setup 同步阶段就把 hasIntro/done 写好，动效组件在 onMounted 里只需
 * 读一次状态即可，无需猜“intro 脚本跑了没”。
 */
export interface IntroTiming {
  titleIn: number
  subAt: number
  holdTill: number
  fastMultiplier: number
}

export const INTRO_TIMING: IntroTiming = {
  titleIn: 250,
  subAt: 1500,
  holdTill: 3000,
  fastMultiplier: 0.4,
};

export function useIntro() {
  const hasIntro = useState<boolean>('intro-present', () => false);
  const done = useState<boolean>('intro-done', () => false);
  const phase = useState<'idle' | 'sub' | 'hold'>('intro-phase', () => 'idle');

  /** IntroOverlay 在 setup 同步调用：标记本页有 intro，并决定是否跳过。 */
  const arm = (): boolean => {
    hasIntro.value = true;
    if (!import.meta.client)
      return true; // SSR：先渲染 intro 骨架
    let skip = false;
    try {
      const q = new URLSearchParams(window.location.search);
      skip = q.get('intro') === '0' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
    } catch {
      skip = false;
    }
    if (skip) {
      done.value = true;
      return false;
    }
    done.value = false;
    document.documentElement.classList.add('fx-intro-running');
    return true;
  };

  const finish = () => {
    if (done.value)
      return;
    done.value = true;
    try {
      sessionStorage.setItem('itc_intro_seen', '1');
    } catch { /* ignore */ }
    if (import.meta.client) {
      document.documentElement.classList.remove('fx-intro-running');
    }
  };

  const start = (timing: IntroTiming = INTRO_TIMING) => {
    if (!import.meta.client || done.value)
      return;
    let k = 1;
    try {
      const q = new URLSearchParams(window.location.search);
      const seen = sessionStorage.getItem('itc_intro_seen') === '1';
      if (seen && q.get('intro') !== 'slow')
        k = timing.fastMultiplier;
    } catch { /* ignore */ }
    window.setTimeout(() => {
      phase.value = 'sub';
    }, timing.titleIn * k);
    window.setTimeout(() => {
      phase.value = 'hold';
    }, timing.subAt * k);
    window.setTimeout(finish, timing.holdTill * k);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape')
      finish();
  };

  onMounted(() => window.addEventListener('keydown', onKey));
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey));

  return { hasIntro, done, phase, arm, start, finish };
}

/** 等待 intro 结束后再启动的效果（打字机、浮现文字等）。 */
export function waitForIntro(fn: () => void) {
  if (!import.meta.client)
    return;
  const done = useState<boolean>('intro-done', () => false);
  const hasIntro = useState<boolean>('intro-present', () => false);
  if (!hasIntro.value || done.value) {
    fn();
    return;
  }
  let called = false;
  const go = () => {
    if (called)
      return;
    called = true;
    fn();
  };
  const stop = watch(done, (v) => {
    if (v) {
      stop();
      go();
    }
  });
  // 兜底：intro 异常时 8s 后强制放行
  window.setTimeout(go, 8000);
}
