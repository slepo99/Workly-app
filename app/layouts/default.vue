<template>
  <div class="flex min-h-screen">
    <LayoutAppSidebar/>

    <div class="flex min-w-0 flex-1 flex-col">
      <LayoutAppHeader/>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>