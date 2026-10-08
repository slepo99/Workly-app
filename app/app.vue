<script setup lang="ts">
import { en, uk } from "@nuxt/ui/locale";
import { LOCALES } from "./constants/locale";

const { locale } = useI18n();

const uiLocale = computed(() => {
  return locale.value === LOCALES.UK ? uk : en;
});
</script>

<template>
  <UApp
    :toaster="{ position: 'top-right' }"
    :locale="uiLocale"
  >
    <NuxtLoadingIndicator color="#22c55e" :height="3" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>