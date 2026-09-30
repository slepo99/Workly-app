<template>
  <UApp :toaster="{ position: 'top-right' }">
    <NuxtLoadingIndicator color="#22c55e" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>