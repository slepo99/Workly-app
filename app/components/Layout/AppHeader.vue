<template>
  <UHeader class="h-22">
    <template #left>
      <NuxtLink to="/">
        <div class="flex items-center gap-2">
          <img src="~assets/images/logo.png" alt="Logo" class="h-20 w-auto" />
          <span class="font-bold text-2xl">{{ $t("header.title") }}</span>
        </div>
      </NuxtLink>
    </template>
    <UNavigationMenu :items="items" />
    <template #right>
      <UColorModeButton />

      <UButton @click="$i18n.setLocale('uk')"> UA </UButton>
      <UButton @click="$i18n.setLocale('en')"> EN </UButton>
    </template>
  </UHeader>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";
const route = useRoute();
const { t } = useI18n();
const items = computed<NavigationMenuItem[]>(() => [
  {
    label: t("navigation.dashboard"),
    to: "/",
    active: route.path === "/",
  },
  {
    label: t("navigation.projects"),
    to: "/projects",
    active: route.path.startsWith("/projects"),
  },
]);
</script>

<style></style>
