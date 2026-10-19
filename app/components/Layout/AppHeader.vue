<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <div class="flex items-center gap-2">
          <img src="~assets/images/logo.png" alt="Logo" class="h-16 w-auto" />
          <span class="font-bold text-2xl">{{ $t("header.title") }}</span>
        </div>
      </NuxtLink>
    </template>
    <UNavigationMenu :items="items" />
    <template #right>
      <HeaderSettings />
    </template>
    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" />
    </template>
  </UHeader>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";
import { usePermissions } from "~/composables/usePermissions";

const route = useRoute();
const { t } = useI18n();
const { isManagement } = usePermissions();

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
  ...(isManagement.value
    ? [
        {
          label: t("navigation.users"),
          to: "/users",
          active: route.path.startsWith("/users"),
        },
      ]
    : []),
  {
    label: t("navigation.tasks"),
    to: "/tasks",
    active: route.path.startsWith("/tasks"),
  },
  {
    label: t("navigation.teams"),
    to: "/teams",
    active: route.path.startsWith("/teams"),
  },
]);
</script>

<style></style>
