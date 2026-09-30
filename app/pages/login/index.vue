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

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onLogin" loading-auto>
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
        loading-auto
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
import { useLogin } from "~/composables/useLogin";
import { useAuthStore } from "~/stores/auth";
definePageMeta({
  layout: "auth",
});
const { t } = useI18n();
const { state, schema, onLogin } = useLogin();
const authStore = useAuthStore();
</script>
