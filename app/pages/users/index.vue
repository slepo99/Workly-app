<template>
  <UPage> users </UPage>
</template>

<script setup lang="ts">
import { useUsers } from "~/composables/pages/useUsers";

const { onFirstLoadUsers } = useUsers();

await onFirstLoadUsers()
</script>

<style scoped></style>
