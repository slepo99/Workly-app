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

    <div class="space-y-4">
      <div class="rounded-xl bg-elevated/50 p-4">
        <div class="flex items-center gap-2">
          <USkeleton class="h-2.5 w-2.5 rounded-full" />
          <USkeleton class="h-5 w-36" />
        </div>

        <div class="mt-4 flex items-center gap-2">
          <USkeleton class="h-4 w-4 rounded" />
          <USkeleton class="h-4 w-40" />
        </div>

        <USkeleton class="mt-4 h-9 w-full rounded-lg" />

        <div class="mt-4 flex items-center">
          <USkeleton class="h-8 w-8 rounded-full" />
          <USkeleton class="-ml-2 h-8 w-8 rounded-full" />
          <USkeleton class="-ml-2 h-8 w-8 rounded-full" />
          <USkeleton class="ml-2 h-5 w-6 rounded-full" />
        </div>
      </div>

      <div class="rounded-xl bg-elevated/50 p-4 space-y-3">
        <USkeleton class="h-10 w-full rounded-lg" />
        <USkeleton class="h-10 w-full rounded-lg" />
      </div>
    </div>
  </UCard>
</template>