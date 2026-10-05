<template>
  <UCard
    class="card-shadow group cursor-pointer border-2 border-dashed border-gray-300 bg-transparent transition-all duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:shadow-lg dark:border-gray-700 dark:hover:border-primary active:translate-y-0"
    :ui="{
      body: 'flex min-h-64 items-center justify-center',
    }"
  >
    <div class="flex flex-col items-center gap-2 text-center text-muted">
      <UIcon name="i-lucide-plus" class="size-7" />

      <span class="font-medium text-default select-none"> Add new project </span>

      <p class="max-w-56 text-sm leading-5 select-none">
        Start a new project and invite your team members to collaborate
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts"></script>
