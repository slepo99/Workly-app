<template>
  <div class="rounded-xl border border-default bg-default">
    <div class="flex items-center justify-between border-b border-default p-4">
      <USkeleton class="h-5 w-24" />
      <USkeleton class="h-6 w-20 rounded-full" />
    </div>

    <div class="space-y-3 p-4">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-11/12" />
      <USkeleton class="h-4 w-9/12" />
    </div>

    <div class="flex items-center justify-between px-4 pb-4">
      <div class="flex items-center gap-2">
        <USkeleton class="h-4 w-4 rounded" />
        <USkeleton class="h-4 w-24" />
      </div>

      <USkeleton class="h-6 w-14 rounded-full" />
    </div>

    <div class="flex items-center justify-between border-t border-default p-4">
      <div class="flex items-center">
        <USkeleton class="h-8 w-8 rounded-full" />
        <USkeleton class="-ml-2 h-8 w-8 rounded-full" />
        <USkeleton class="-ml-2 h-8 w-8 rounded-full" />
        <USkeleton class="ml-2 h-5 w-6 rounded-full" />
      </div>

      <USkeleton class="h-6 w-6 rounded-full" />
    </div>
  </div>
</template>