<template>
  <UDropdownMenu
    :items="items"
    :ui="{
      content: 'min-w-46',
    }"
  >
    <UButton icon="i-lucide-settings" color="neutral" variant="ghost" />

    <template #theme>
      <div class="flex w-full items-center justify-between gap-4">
        <span>{{ currentTheme }}</span>

        <div class="flex items-center gap-1">
          <UFieldGroup>
            <UButton
              icon="i-lucide-moon"
              size="xs"
              color="neutral"
              :variant="colorMode.preference === 'dark' ? 'solid' : 'ghost'"
              @click.stop="colorMode.preference = 'dark'"
            />

            <UButton
              icon="i-lucide-sun"
              size="xs"
              color="neutral"
              :variant="colorMode.preference === 'light' ? 'solid' : 'ghost'"
              @click.stop="colorMode.preference = 'light'"
            />
            <UButton
              icon="i-lucide-monitor"
              size="xs"
              color="neutral"
              :variant="colorMode.preference === 'system' ? 'solid' : 'ghost'"
              @click.stop="colorMode.preference = 'system'"
            />
          </UFieldGroup>
        </div>
      </div>
    </template>
    <template #language>
      <div class="flex w-full items-center justify-between gap-4">
        <span>{{ t("header.settings.language") }}</span>

        <div class="flex items-center gap-1">
          <UButton
            size="xs"
            color="neutral"
            :variant="locale === 'uk' ? 'solid' : 'ghost'"
            @click.stop="setLocale('uk')"
          >
            UA
          </UButton>

          <UButton
            size="xs"
            color="neutral"
            :variant="locale === 'en' ? 'solid' : 'ghost'"
            @click.stop="setLocale('en')"
          >
            EN
          </UButton>
        </div>
      </div>
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const colorMode = useColorMode();

const { t, locale, setLocale } = useI18n();

const items = computed<DropdownMenuItem[][]>(() => {
  const menu: DropdownMenuItem[][] = [
    [
      {
        label: "Theme",
        slot: "theme" as const,
      },
      {
        label: "Language",
        slot: "language" as const,
      },
    ],
  ]

  if (authStore.isAuthenticated) {
    menu.push([
      {
        label: "Logout",
        icon: "i-lucide-log-out",
        color: "error",
        kbds: ["shift", "meta", "q"],
        onSelect: async () => {
          await authStore.logout()
          await navigateTo("/login")
        },
      },
    ])
  }

  return menu
})
const currentTheme = computed(() => {
  return t(`header.settings.theme.${colorMode.preference}`);
});
</script>
