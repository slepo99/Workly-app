<template>
  <UCard class="w-full">
    <template #header>
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold">
          {{ t("register.form.title") }}
        </h1>

        <p class="text-sm text-muted">
          {{ t("register.form.subTitle") }}
        </p>
      </div>
    </template>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      loading-auto
      @submit="onRegister"
    >
      <UFormField :label="t('register.form.name')" name="name">
        <UInput
          type="text"
          autocomplete="name"
          class="w-full"
          placeholder="Name"
          v-model="state.name"
        />
      </UFormField>

      <UFormField :label="t('register.form.email')" name="email">
        <UInput
          type="email"
          autocomplete="email"
          class="w-full"
          placeholder="you@example.com"
          v-model="state.email"
        />
      </UFormField>

      <UFormField :label="t('register.form.password')" name="password">
        <UInput
          type="password"
          autocomplete="new-password"
          class="w-full"
          placeholder="••••••••"
          v-model="state.password"
        />
      </UFormField>

      <UButton
        block
        :label="t('register.form.createAcc')"
        type="submit"
        loading-auto
      />

      <p class="text-center text-sm text-muted">
        {{ t("register.form.hasAcc") }}

        <NuxtLink to="/login" class="font-medium text-primary hover:underline">
          {{ t("register.form.signIn") }}
        </NuxtLink>
      </p>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { useI18n } from "#imports";
import { useRegister } from "~/composables/pages/useRegister";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const { state, schema, onRegister } = useRegister();
</script>
