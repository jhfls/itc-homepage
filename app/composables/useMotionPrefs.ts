/** 动效总开关：?motion=0 或系统减少动效时关闭。 */
export function useMotionPrefs() {
  const disabled = useState<boolean>('motion-disabled', () => false);

  if (import.meta.client && !disabled.value) {
    try {
      const q = new URLSearchParams(window.location.search);
      if (q.get('motion') === '0')
        disabled.value = true;
      else if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
        disabled.value = true;
    } catch { /* ignore */ }
  }

  return { motionDisabled: disabled };
}
