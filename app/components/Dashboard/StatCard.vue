<template>
<UCard>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <UIcon :name="props.icon" />
      <span class="text-sm">{{ props.title }}</span>
    </div>

    <UButton
      icon="i-lucide-arrow-up-right"
      color="neutral"
      variant="ghost"
      size="sm"
      @click="emit('viewDetails')"
    />
  </div>

  <div class="mt-6 flex items-end justify-between">
    <span class="text-3xl font-semibold">{{ props.value }}</span>

    <!-- <span class="text-sm text-error">
      ↓ 2.02%
    </span> -->
  </div>
</UCard>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    icon: string
    title: string
    value: string | number
}>(), {})

const emit = defineEmits<{
    (e: 'viewDetails'): void
}>()
</script>

<style scoped></style>
