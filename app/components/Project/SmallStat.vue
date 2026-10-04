<template>
  <UCard>
    <template #default>
      <div class="flex items-center gap-3">
        <div class="flex items-start justify-center">
          <slot name="icon" />
        </div>
        <div class="flex flex-col items-start justify-center">
          <span class="text-md text-neutral-500 line-clamp-2 truncate"
            ><slot name="title"
          /></span>
         <span class="text-xl font-semibold truncate">
            <slot name="value"/>
         </span>
        </div>
        <div class="flex items-center justify-center gap-3">
            <slot name="extra-value"/>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts"></script>

<style scoped></style>
