export function useReveal(target: Ref<HTMLElement | null>) {
  const visible = ref(false);
  let io: IntersectionObserver | null = null;

  onMounted(() => {
    const el = target.value;
    if (!el)
      return;
    if (!('IntersectionObserver' in window)) {
      visible.value = true;
      return;
    }
    io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          visible.value = true;
          io?.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
  });

  onBeforeUnmount(() => io?.disconnect());
  return { visible };
}
