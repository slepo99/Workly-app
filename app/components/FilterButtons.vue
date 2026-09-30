<template>
  <div class="flex flex-wrap gap-2">
    <UButton
      label="All"
      :variant="!selectedStatus.length ? 'solid' : 'outline'"
      :color="!selectedStatus.length ? 'primary' : 'neutral'"
      class="rounded-full"
      @click="selectedStatus = []"
    />

    <UButton
      v-for="filter in filters"
      :key="filter.value"
      :label="filter.label"
      :variant="selectedStatus.includes(filter.value) ? 'solid' : 'outline'"
      :color="selectedStatus.includes(filter.value) ? 'primary' : 'neutral'"
      class="rounded-full"
      @click="onSelectedStatus(filter.value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  filters: { label: string; value: string }[];
}>();

const selectedStatus = defineModel<string[]>({ required: true });

function onSelectedStatus(currentStatus: string) {
  if (!selectedStatus.value.includes(currentStatus)) {
    selectedStatus.value = [...selectedStatus.value, currentStatus];
  } else {
    selectedStatus.value = selectedStatus.value.filter(
      (status) => status !== currentStatus,
    );
  }
}
</script>