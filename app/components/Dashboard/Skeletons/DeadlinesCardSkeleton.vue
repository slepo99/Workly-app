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
      <div
        v-for="i in 3"
        :key="i"
        class="rounded-xl bg-elevated/50 p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <USkeleton class="h-5 w-40" />
            <div class="mt-3 flex items-center gap-2">
              <USkeleton class="h-2.5 w-2.5 rounded-full" />
              <USkeleton class="h-4 w-24" />
            </div>
          </div>

          <USkeleton class="h-8 w-8 rounded-lg" />
        </div>
      </div>
    </div>
  </UCard>
</template>