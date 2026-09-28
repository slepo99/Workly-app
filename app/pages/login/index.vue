<template>
  <UCard class="w-full">
    <template #header>
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">
          {{ t("login.form.title") }}
        </h1>

        <p class="text-sm text-muted">
          {{ t("login.form.subTitle") }}
        </p>
      </div>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onLogin">
      <UFormField :label="t('login.form.email')" name="email">
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="t('login.form.password')" name="password">
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UButton
        block
        :label="t('login.form.signIn')"
        type="submit"
        class="cursor-pointer"
      />

      <p class="text-center text-sm text-muted">
        {{ t("login.form.noAcc") }}

        <NuxtLink
          to="/register"
          class="font-medium text-primary hover:underline"
        >
          {{ t("login.form.createAcc") }}
        </NuxtLink>
      </p>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";
import { z } from "zod";
import { useAuthStore } from "~/stores/auth";
import type { Login } from "~/composables/api/useAuthApi/types";
const toast = useToast();
const authStore = useAuthStore();

definePageMeta({
  layout: "auth",
});
const { t } = useI18n();

const state = reactive<Login>({
  email: "",
  password: "",
});

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

async function onLogin() {
  try {
    await authStore.login(state)

    if (authStore.isAuthenticated) {
      toast.add({
        title: t("login.toast.success.title"),
        description: t("login.toast.success.subTitle"),
        color: "success",
        duration: 7000,
      })

      await navigateTo("/")
    }
  } catch (error: any) {
    toast.add({
      title: t("login.toast.error.wrongCreds.title"),
      description: error?.data?.statusMessage || t("login.toast.error.wrongCreds.subTitle"),
      color: "error",
    })
  }
}
</script>
