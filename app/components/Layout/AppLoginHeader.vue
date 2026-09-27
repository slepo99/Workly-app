<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/auth">
        <div class="flex items-center gap-2">
          <img src="~assets/images/logo.png" alt="Logo" class="h-16 w-auto" />
          <span class="font-bold text-2xl">{{ $t("header.title") }}</span>
        </div>
      </NuxtLink>
    </template>
    <template #right>
      <!-- <UColorModeButton />

      <UButton @click="$i18n.setLocale('uk')"> UA </UButton>
      <UButton @click="$i18n.setLocale('en')"> EN </UButton> -->
      <HeaderSettings />
    </template>
  </UHeader>
</template>
