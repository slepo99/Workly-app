<template>
  <div
    class="card-shadow flex flex-col gap-2 rounded-xl bg-elevated p-3 sm:p-2 lg:gap-3 lg:p-4"
  >
    <span class="text-lg font-semibold">User details</span>
    <USeparator />

    <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
      <div class="flex w-full flex-col gap-2 lg:gap-3">
        <div class="flex w-full items-center justify-between gap-2">
          <div class="flex min-w-0 items-center gap-3 lg:gap-4">
            <UIcon class="shrink-0 text-xl lg:text-2xl" name="i-lucide-user" />
            <span class="text-sm sm:text-base">Role</span>
          </div>
          <span class="text-sm sm:text-base">Worker</span>
        </div>

        <USeparator />

        <div class="flex w-full items-center justify-between gap-2">
          <div class="flex min-w-0 items-center gap-3 lg:gap-4">
            <UIcon class="shrink-0 text-xl lg:text-2xl" name="i-lucide-mail" />
            <span class="text-sm sm:text-base">Email</span>
          </div>
          <span class="break-all text-right text-sm sm:text-base"
            >example@gmail.com</span
          >
        </div>
      </div>

      <USeparator
        orientation="vertical"
        color="primary"
        class="hidden h-20 lg:block"
      />

      <USeparator class="lg:hidden" />

      <div class="flex w-full flex-col gap-2 lg:gap-3">
        <div class="flex w-full items-center justify-between gap-2">
          <div class="flex min-w-0 items-center gap-3 lg:gap-4">
            <UIcon
              class="shrink-0 text-xl lg:text-2xl"
              name="i-lucide-user-shield"
            />
            <span class="text-sm sm:text-base">Position</span>
          </div>
          <span class="text-sm sm:text-base">Worker</span>
        </div>

        <USeparator />

        <div class="flex w-full items-center justify-between gap-2">
          <div class="flex min-w-0 items-center gap-3 lg:gap-4">
            <UIcon
              class="shrink-0 text-xl lg:text-2xl"
              name="i-lucide-calendar"
            />
            <span class="text-sm sm:text-base">Joined at</span>
          </div>
          <span class="text-right text-sm sm:text-base">example@gmail.com</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
