<template>
  <div
    class="relative inline-flex items-center justify-center"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }"
  >
    <svg
      class="-rotate-90"
      :width="size"
      :height="size"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        class="text-neutral-200 dark:text-neutral-700"
      />

      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="progressOffset"
        :class="progressColor"
      />
    </svg>

    <!-- <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-sm font-semibold">
        {{ percent }}%
      </span>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    percent: number
    size?: number | string
    strokeWidth?: number
  }>(),
  {
    size: 80,
    strokeWidth: 2,
  },
)

const center = computed(() => Number(props.size) / 2)

const radius = computed(() =>
  Number(props.size) / 2 - props.strokeWidth / 2,
)

const circumference = computed(() =>
  2 * Math.PI * radius.value,
)

const normalizedPercent = computed(() =>
  Math.min(100, Math.max(0, props.percent)),
)

const progressOffset = computed(() =>
  circumference.value -
  (normalizedPercent.value / 100) * circumference.value,
)

const progressColor = computed(() => {
  if (normalizedPercent.value < 20) {
    return "text-error"
  }

  if (normalizedPercent.value < 40) {
    return "text-warning"
  }

  if (normalizedPercent.value < 60) {
    return "text-info"
  }

  return "text-success"
})
</script>