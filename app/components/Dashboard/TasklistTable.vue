<template>
  <div class="rounded-lg border border-default overflow-hidden">
    <div class="px-4 py-3 border-b border-default">
      <h2 class="font-semibold text-highlighted">Project Members</h2>
    </div>

    <UTable
      :data="data"
  :ui="{
  root: 'max-h-[500px] overflow-y-auto scrollbar-thin border border-default rounded-b-lg',
}"
    />
  </div>
</template>

<script setup lang="ts">
const data = ref(
  Array(1000)
    .fill(0)
    .map((_, i) => ({
      id: `4600-${i}`,
      date: '2024-03-11T15:30:00',
      status: 'paid',
      email: 'james.anderson@example.com',
      amount: 594
    }))
)
</script>

<style scoped></style>
