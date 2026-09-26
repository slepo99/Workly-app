<template>
  <UFooter :ui="{
    root: 'border-t border-default',
    center: 'flex flex-row gap-2 m-0'
  }">
    <template #left>
      <div class="flex flex-col gap-2 justify-center items-center lg:items-start">
        <p class="text-muted text-sm text-center">
        Copyright © {{ new Date().getFullYear() }} Workly
      </p>
      <p class="text-muted text-sm text-center">
        Smart project management for modern teams
      </p>
      </div>
    </template>
    <template #default>
      <UButton
        icon="i-simple-icons-discord"
        color="neutral"
        variant="ghost"
        to="https://go.nuxt.com/discord"
        target="_blank"
        aria-label="Discord"
      />
      <UButton
        icon="i-simple-icons-x"
        color="neutral"
        variant="ghost"
        to="https://go.nuxt.com/x"
        target="_blank"
        aria-label="X"
      />
      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="ghost"
        to="https://github.com/nuxt/nuxt"
        target="_blank"
        aria-label="GitHub"
      />
    </template>
    <template #right>
      <UNavigationMenu :items="items" variant="link" />
    </template>
  </UFooter>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const items: NavigationMenuItem[] = [
  {
    label: 'Privacy',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  },
  {
    label: 'Terms',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank'
  },
  {
    label: 'Contact',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  },
]
</script>

<style scoped></style>
