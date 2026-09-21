<template>
  <div class="flex min-h-screen">
    <LayoutAppSidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <LayoutAppHeader />

      <UMain class="flex-1">
        <UContainer class="py-6">
          <slot />
        </UContainer>
      </UMain>
    </div>
  </div>
</template>
