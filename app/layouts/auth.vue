<template>
  <div class="flex min-h-screen flex-col">
    <LayoutAppLoginHeader/>
    <main class="flex flex-1 items-center justify-center">
      <UContainer class="w-full max-w-md">
        <slot />
      </UContainer>
    </main>

    <LayoutAppFooter />
  </div>
</template>