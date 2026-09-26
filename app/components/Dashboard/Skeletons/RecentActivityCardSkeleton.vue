<template>
  <UCard
    :ui="{
      header: 'flex items-center justify-between',
      body: 'p-4'
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <USkeleton class="h-4 w-4 rounded" />
        <USkeleton class="h-6 w-40" />
      </div>

      <USkeleton class="h-6 w-6 rounded-full" />
    </template>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DashboardSkeletonsTaskCardSkeleton />
      <DashboardSkeletonsTaskCardSkeleton />
    </div>
  </UCard>
</template>