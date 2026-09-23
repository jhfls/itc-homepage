<script setup lang="ts">
const elRef = ref<HTMLElement | null>(null);
const { visible } = useReveal(elRef);
</script>

<template>
  <div ref="elRef" class="reveal" :class="{ vis: visible }">
    <slot />
  </div>
</template>
